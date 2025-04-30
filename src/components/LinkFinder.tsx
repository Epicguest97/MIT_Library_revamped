
"use client";

import * as React from "react";
import type { LinkData } from "@/types";
import { getLinksData, getUniquePathValues, filterLinks, getMaxPathDepth, getPathLevelLabel } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Link as LinkIcon } from "lucide-react";

const ALL_VALUE = "__ALL__"; // Use a constant for the special value

export function LinkFinder() {
  const [links, setLinks] = React.useState<LinkData[]>([]);
  const [maxDepth, setMaxDepth] = React.useState<number>(0);
  const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
  const [filteredLinks, setFilteredLinks] = React.useState<LinkData[]>([]);
  const [dropdownOptions, setDropdownOptions] = React.useState<string[][]>([]);

  React.useEffect(() => {
    const data = getLinksData();
    setLinks(data);
    const depth = getMaxPathDepth(data);
    setMaxDepth(depth);
    setSelectedPath(Array(depth).fill("")); // Initialize selectedPath with empty strings
    setFilteredLinks(data); // Initially show all links
  }, []);

  React.useEffect(() => {
    const newOptions: string[][] = [];
    for (let i = 0; i < maxDepth; i++) {
      newOptions[i] = getUniquePathValues(links, i, selectedPath);
    }
    setDropdownOptions(newOptions);

    // Filter links based on the current selectedPath
    const currentlySelected = selectedPath.filter(p => p !== "");
    if (currentlySelected.length > 0) {
      setFilteredLinks(filterLinks(links, currentlySelected));
    } else {
      setFilteredLinks(links); // Show all if no selection
    }

  }, [selectedPath, links, maxDepth]);


  const handleSelectChange = (level: number, value: string) => {
    setSelectedPath(prevPath => {
      const newPath = [...prevPath];
      // Map __ALL__ back to empty string for filtering logic
      const actualValue = value === ALL_VALUE ? "" : value;
      // Reset subsequent levels when a level is changed
      for (let i = level; i < newPath.length; i++) {
        newPath[i] = (i === level) ? actualValue : ""; // Set current level, clear subsequent
      }
      return newPath;
    });
  };

  const handleReset = () => {
    setSelectedPath(Array(maxDepth).fill(""));
  }

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
            {Array.from({ length: maxDepth }).map((_, level) => (
              dropdownOptions[level]?.length > 0 && ( // Only render dropdown if options exist for this level based on current path
                <div key={level} className="space-y-1">
                   <label htmlFor={`select-${level}`} className="text-sm font-medium text-muted-foreground">
                    {getPathLevelLabel(level)}
                  </label>
                  <Select
                    // Map empty string state back to __ALL__ for display in SelectTrigger
                    value={selectedPath[level] === "" ? ALL_VALUE : selectedPath[level]}
                    onValueChange={(value) => handleSelectChange(level, value)}
                    // Disable dropdown if the previous level hasn't been selected (and it's not the first level)
                    disabled={level > 0 && !selectedPath[level - 1] && selectedPath[level - 1] !== ""}
                  >
                    <SelectTrigger id={`select-${level}`} className="w-full bg-input rounded-md shadow-sm">
                      {/* The placeholder will show if the value passed to Select is not found in SelectItem */}
                      {/* So, when value is __ALL__, it matches the "All" item. When it's a real path, it matches that. */}
                      <SelectValue placeholder={`Select ${getPathLevelLabel(level)}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use the non-empty value for the "All" item */}
                      <SelectItem value={ALL_VALUE}>All</SelectItem>
                      {dropdownOptions[level]?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            ))}
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
                      {link.name || new URL(link.url).pathname.split('/').pop() || 'Link'}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {link.path.join(' / ')}
                    </p>
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

