
"use client";

import * as React from "react";
import type { LinkData } from "@/types";
import { getUniquePathValues, filterLinks, getMaxPathDepth, getPathLevelLabel, ALL_LINKS_DATA } from "@/lib/data"; // Import ALL_LINKS_DATA
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Link as LinkIcon } from "lucide-react";

const ALL_VALUE = "__ALL__"; // Use a constant for the special value

export function LinkFinder() {
  // Directly use the imported data
  const links = React.useMemo(() => ALL_LINKS_DATA, []);
  const maxDepth = React.useMemo(() => getMaxPathDepth(links), [links]);
  const [selectedPath, setSelectedPath] = React.useState<string[]>(() => Array(maxDepth).fill("")); // Initialize selectedPath based on calculated maxDepth
  const [filteredLinks, setFilteredLinks] = React.useState<LinkData[]>(links); // Initialize with all links
  const [dropdownOptions, setDropdownOptions] = React.useState<string[][]>([]);
  const [levelLabels, setLevelLabels] = React.useState<string[]>([]);


  // Effect to calculate initial dropdown options and labels
   React.useEffect(() => {
    if (links.length > 0 && maxDepth > 0) {
      const initialOptions: string[][] = [];
      const initialLabels: string[] = [];
      for (let i = 0; i < maxDepth; i++) {
        initialOptions[i] = getUniquePathValues(links, i, []); // Initial options based on all links
        initialLabels[i] = getPathLevelLabel(i, links);
      }
      setDropdownOptions(initialOptions);
      setLevelLabels(initialLabels);
      setSelectedPath(Array(maxDepth).fill("")); // Ensure selected path is reset based on actual maxDepth
      setFilteredLinks(links); // Reset filtered links to all
    }
   }, [links, maxDepth]); // Depend on links and maxDepth

  // Effect to update dropdown options and filtered links when selectedPath changes
  React.useEffect(() => {
    const newOptions: string[][] = [];
    const currentSelectedForFiltering = selectedPath.slice(0, maxDepth).map(p => p === ALL_VALUE ? "" : p); // Prepare path for filtering

    for (let i = 0; i < maxDepth; i++) {
      // Pass the *current* selected path up to the *previous* level to get relevant options
      const relevantPathForOptions = currentSelectedForFiltering.slice(0, i);
      newOptions[i] = getUniquePathValues(links, i, relevantPathForOptions);
    }
    setDropdownOptions(newOptions);

    // Filter links based on the *current* selectedPath (excluding __ALL__)
     const activeFilters = currentSelectedForFiltering.filter(p => p !== "");
     if (activeFilters.length > 0) {
       setFilteredLinks(filterLinks(links, currentSelectedForFiltering));
     } else {
       setFilteredLinks(links); // Show all if no real selection
     }

  }, [selectedPath, links, maxDepth]); // Depend on selectedPath, links, and maxDepth


  const handleSelectChange = (level: number, value: string) => {
    setSelectedPath(prevPath => {
      const newPath = [...prevPath];
       // Map __ALL__ back to empty string for internal state consistency
      const actualValue = value === ALL_VALUE ? "" : value;
       // Reset subsequent levels when a level is changed
      for (let i = 0; i < maxDepth; i++) {
        if (i === level) {
          newPath[i] = actualValue; // Set current level
        } else if (i > level) {
          newPath[i] = ""; // Clear subsequent levels
        }
      }
      // Ensure the array length matches maxDepth, padding with "" if needed
       while (newPath.length < maxDepth) {
           newPath.push("");
       }
      return newPath.slice(0, maxDepth); // Trim to maxDepth just in case
    });
  };


  const handleReset = () => {
    setSelectedPath(Array(maxDepth).fill(""));
  }

   // Function to safely get a label, falling back if labels aren't loaded yet
   const getLabel = (level: number) => levelLabels[level] || `Level ${level + 1}`;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
       <Card className="shadow-lg bg-card text-card-foreground rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            Link Finder
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Render dropdowns based on maxDepth */}
             {Array.from({ length: maxDepth }).map((_, level) => {
               const currentOptions = dropdownOptions[level] || []; // Default to empty array if options not ready
               const hasOptions = currentOptions.length > 0;
                // Determine if the dropdown should be enabled
               const isEnabled = level === 0 || (selectedPath[level - 1] !== "" && selectedPath[level - 1] !== undefined);

               // Only render if the level is the first OR the previous level was selected OR if it has options (to show 'All')
               if (level === 0 || isEnabled || hasOptions) {
                 return (
                   <div key={level} className="space-y-1">
                     <label htmlFor={`select-${level}`} className="text-sm font-medium text-muted-foreground">
                       {getLabel(level)} {/* Use dynamic label */}
                     </label>
                     <Select
                       value={selectedPath[level] || ALL_VALUE} // Use ALL_VALUE if current level is empty
                       onValueChange={(value) => handleSelectChange(level, value)}
                       disabled={!isEnabled && level > 0} // Disable if previous level not selected (and not first level)
                     >
                       <SelectTrigger id={`select-${level}`} className="w-full bg-input rounded-md shadow-sm">
                         <SelectValue placeholder={`Select ${getLabel(level)}...`} />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value={ALL_VALUE}>All</SelectItem>
                         {/* Only map options if they exist */}
                         {currentOptions.map((option) => (
                           <SelectItem key={option} value={option}>
                             {option}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 );
               }
               return null; // Don't render the dropdown if conditions aren't met
             })}
          </div>
           <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">Reset Filters</Button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <List size={20} />
              Results ({filteredLinks.length})
            </h2>
            {filteredLinks.length > 0 ? (
              <ul className="space-y-3">
                {filteredLinks.map((link, index) => (
                  <li key={index} className="border p-4 rounded-md bg-secondary/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline font-medium group"
                    >
                      <LinkIcon size={16} className="text-accent group-hover:text-primary transition-colors duration-200" />
                      {/* Display name if available, otherwise extract filename or default to 'Link' */}
                      {link.name || (link.url ? new URL(link.url).pathname.split('/').pop() : '') || 'Link'}
                    </a>
                     {/* Conditionally render path if it exists and has elements */}
                    {link.path && link.path.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                        {link.path.join(' / ')}
                        </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No links found matching your criteria.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

