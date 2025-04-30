
import type { LinkData } from '@/types';
import linksData from '@/data/links.json';

// Utility function to get unique values for a specific path level
export function getUniquePathValues(data: LinkData[], level: number, currentPath: string[] = []): string[] {
  const values = new Set<string>();
  data.forEach(item => {
    // Check if the item's path matches the current selected path up to the previous level
    let match = true;
    for (let i = 0; i < level; i++) {
       // If the current level selection is empty or matches the item's path at that level
      if (currentPath[i] && item.path[i] !== currentPath[i]) {
        match = false;
        break;
      }
    }
    // If it matches and the path has an element at the current level, add it
    if (match && item.path.length > level && item.path[level]) { // Ensure path[level] exists and is not empty
      values.add(item.path[level]);
    }
  });
  return Array.from(values).sort(); // Sort alphabetically
}


// Utility function to filter links based on the selected path
export function filterLinks(data: LinkData[], selectedPath: string[]): LinkData[] {
  return data.filter(item => {
    // Check if the item's path has at least as many levels as the selected path
    // Note: We don't filter out items with *more* levels, only those with fewer *that don't match*
    if (item.path.length < selectedPath.filter(p => p !== '').length) {
         // If the item path is shorter than the number of *selected* levels, it can't match
        return false;
    }

    // Check each selected level against the item's path
    for (let i = 0; i < selectedPath.length; i++) {
      // If a level is selected (not empty string) and it doesn't match the item's path at that level
      if (selectedPath[i] && item.path[i] !== selectedPath[i]) {
        return false; // Doesn't match, filter out
      }
    }
    // If all selected levels match, include the item
    return true;
  });
}


// Utility function to determine the maximum depth of paths
export function getMaxPathDepth(data: LinkData[]): number {
  if (!data || data.length === 0) {
    return 0;
  }
  return data.reduce((maxDepth, item) => Math.max(maxDepth, item.path.length), 0);
}

// Function to dynamically determine path level labels based on data inspection (simple heuristic)
export function getPathLevelLabel(level: number, data: LinkData[]): string {
    // Simple heuristic: Check common patterns at each level
    const sampleValues = getUniquePathValues(data, level);

    if (level === 0) return "Year"; // Usually the first level is Year
    if (level === 1 && sampleValues.some(v => v.includes('-'))) return "Session"; // Session often contains '-'
    if (level === 2 && sampleValues.some(v => v.includes('.'))) return "Degree"; // Degree might have B.Tech, M.Sc.
    if (level === 3 && sampleValues.some(v => v.toLowerCase().includes('sem'))) return "Semester";
    if (level === 4) return "Department/Branch"; // Common names for the 5th level
    if (level === 5) return "Specialization/Subject"; // Common names for the 6th level

    // Fallback generic label
    return `Level ${level + 1}`;
}


// Load data directly - No need for a separate function unless fetching async
export const ALL_LINKS_DATA: LinkData[] = linksData as LinkData[];


