
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

  // Search bar state
  const [subjectCodeQuery, setSubjectCodeQuery] = React.useState("");
  const [nameQuery, setNameQuery] = React.useState("");


  // Effect to calculate initial dropdown options and labels
   React.useEffect(() => {
    if (links.length > 0 && maxDepth > 0) {
      const initialOptions: string[][] = [];
      const initialLabels: string[] = [];
      for (let i = 0; i < maxDepth; i++) {
        const label = getPathLevelLabel(i, links);
        // Exclude session
        if (label.toLowerCase() === 'session') continue;
        initialOptions[i] = getUniquePathValues(links, i, []);
        initialLabels[i] = label;
      }
      setDropdownOptions(initialOptions);
      setLevelLabels(initialLabels);
      setSelectedPath(Array(maxDepth).fill("")); // Ensure selected path is reset based on actual maxDepth
      setFilteredLinks(links); // Reset filtered links to all
    }
   }, [links, maxDepth]); // Depend on links and maxDepth

  // Effect to update dropdown options and filtered links when selectedPath, subjectCodeQuery, or nameQuery changes
  React.useEffect(() => {
    const newOptions: string[][] = [];
    const currentSelectedForFiltering = selectedPath.slice(0, maxDepth).map(p => p === ALL_VALUE ? "" : p); // Prepare path for filtering

    for (let i = 0; i < maxDepth; i++) {
      // Pass the *current* selected path up to the *previous* level to get relevant options
      const label = levelLabels[i];
      if (label && label.toLowerCase() === 'session') continue;
      const relevantPathForOptions = currentSelectedForFiltering.slice(0, i);
      newOptions[i] = getUniquePathValues(links, i, relevantPathForOptions);
    }
    setDropdownOptions(newOptions);

    // Filter links based on dropdowns, subject code, and name
    let filtered = links;
    const activeFilters = currentSelectedForFiltering.filter(p => p !== "");
    if (activeFilters.length > 0) {
      filtered = filterLinks(filtered, currentSelectedForFiltering);
    }
    if (subjectCodeQuery.trim() !== "") {
      const codeLower = subjectCodeQuery.trim().toLowerCase();
      filtered = filtered.filter(link => link.name && link.name.toLowerCase().includes(codeLower));
    }
    if (nameQuery.trim() !== "") {
      const nameLower = nameQuery.trim().toLowerCase();
      filtered = filtered.filter(link => link.name && link.name.toLowerCase().includes(nameLower));
    }
    setFilteredLinks(filtered);

  }, [selectedPath, links, maxDepth, subjectCodeQuery, nameQuery, levelLabels]);


  const handleSelectChange = (level: number, value: string) => {
    setSelectedPath(prevPath => {
      const newPath = [...prevPath];
      const actualValue = value === ALL_VALUE ? "" : value;

      // Find the index of the 'Year' dropdown
      const yearIndex = levelLabels.findIndex(label => label.toLowerCase() === 'year');
      // Remove session from indices
      const indices = levelLabels.map((_, i) => i).filter(i => levelLabels[i].toLowerCase() !== 'session');
      const otherIndices = indices.filter(i => i !== yearIndex);

      if (level === yearIndex) {
        // Only update the year selection, do not reset any other selections
        newPath[yearIndex] = actualValue;
      } else {
        // For non-year dropdowns, update value and reset only subsequent non-year dropdowns
        // Find this level's index in otherIndices
        const idxInOthers = otherIndices.indexOf(level);
        otherIndices.forEach((i, idx) => {
          if (idx < idxInOthers) {
            // Keep previous selections
            return;
          } else if (idx === idxInOthers) {
            newPath[i] = actualValue;
          } else {
            newPath[i] = "";
          }
        });
        // Year selection remains unchanged
      }
      while (newPath.length < maxDepth) {
        newPath.push("");
      }
      return newPath.slice(0, maxDepth);
    });
  };


  const handleReset = () => {
    setSelectedPath(Array(maxDepth).fill(""));
  }

   // Function to safely get a label, falling back if labels aren't loaded yet
   const getLabel = (level: number) => levelLabels[level] || `Level ${level + 1}`;

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto p-4 min-h-screen bg-neutral-900 text-white rounded-xl shadow-2xl border border-neutral-800">
      {/* Search Bars */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by subject code (e.g., MAT 2155)"
          value={subjectCodeQuery}
          onChange={e => setSubjectCodeQuery(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Search by name"
          value={nameQuery}
          onChange={e => setNameQuery(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      {/* Left: Dropdowns */}
      <div className="min-w-[220px] flex flex-col gap-4 border-r border-neutral-700 pr-6">
        {/* Dropdowns */}
        {(() => {
          const yearIndex = levelLabels.findIndex(label => label.toLowerCase() === 'year');
          const indices = levelLabels.map((_, i) => i).filter(i => levelLabels[i].toLowerCase() !== 'session');
          const otherIndices = indices.filter(i => i !== yearIndex);
          return (
            <>
              {otherIndices.map((level, idx) => {
                const currentOptions = dropdownOptions[level] || [];
                const hasOptions = currentOptions.length > 0;
                const isEnabled = idx === 0 || (selectedPath[otherIndices[idx - 1]] !== "" && selectedPath[otherIndices[idx - 1]] !== undefined);
                if (idx === 0 || isEnabled || hasOptions) {
                  return (
                    <div key={level} className="flex flex-col gap-1">
                      <label htmlFor={`select-${level}`} className="text-sm font-medium text-neutral-200">
                        {getLabel(level)}
                      </label>
                      <Select
                        value={selectedPath[level] || ALL_VALUE}
                        onValueChange={(value) => handleSelectChange(level, value)}
                        disabled={!isEnabled && level > 0}
                      >
                        <SelectTrigger id={`select-${level}`} className="w-full border rounded px-2 py-1 bg-neutral-800 text-white border-neutral-700">
                          <SelectValue placeholder={`Select ${getLabel(level)}...`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_VALUE}>All</SelectItem>
                          {currentOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return null;
              })}
              {/* Render the 'Year' dropdown last */}
              {yearIndex !== -1 && (() => {
                const currentOptions = dropdownOptions[yearIndex] || [];
                const hasOptions = currentOptions.length > 0;
                const allOthersSelected = otherIndices.every(i => selectedPath[i] && selectedPath[i] !== "");
                const isEnabled = allOthersSelected;
                if (isEnabled || hasOptions) {
                  return (
                    <div key={yearIndex} className="flex flex-col gap-1">
                      <label htmlFor={`select-${yearIndex}`} className="text-sm font-medium text-neutral-200">
                        {getLabel(yearIndex)}
                      </label>
                      <Select
                        value={selectedPath[yearIndex] || ALL_VALUE}
                        onValueChange={(value) => handleSelectChange(yearIndex, value)}
                        disabled={!isEnabled && yearIndex > 0}
                      >
                        <SelectTrigger id={`select-${yearIndex}`} className="w-full border rounded px-2 py-1 bg-neutral-800 text-white border-neutral-700">
                          <SelectValue placeholder={`Select ${getLabel(yearIndex)}...`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_VALUE}>All</SelectItem>
                          {currentOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return null;
              })()}
            </>
          );
        })()}
        <button
          onClick={handleReset}
          className="mt-4 px-3 py-1 border border-neutral-700 rounded bg-neutral-800 text-white text-sm hover:bg-neutral-700 transition"
          type="button"
        >
          Reset Filters
        </button>
      </div>
      {/* Right: Results */}
      <div className="flex-1 pl-0 md:pl-6">
        <div className="mb-4 text-lg font-semibold text-neutral-100">
          Results ({filteredLinks.length})
        </div>
        {filteredLinks.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {filteredLinks.map((link, index) => (
              <li key={index} className="p-0 bg-neutral-800/80 rounded-lg border border-neutral-700 shadow hover:bg-neutral-800 transition-colors">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline text-base hover:text-green-300 transition-colors"
                >
                  {link.name || (link.url ? new URL(link.url).pathname.split('/').pop() : '') || 'Link'}
                </a>
                {link.path && link.path.length > 0 && (
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {link.path.join(' / ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400 italic">No links found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
