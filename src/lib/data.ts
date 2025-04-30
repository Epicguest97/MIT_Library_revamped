import type { LinkData } from '@/types';
import linksData from '@/data/links.json';

export function getLinksData(): LinkData[] {
  // In a real application, you might fetch this data from an API
  return linksData as LinkData[];
}

// Utility function to get unique values for a specific path level
export function getUniquePathValues(data: LinkData[], level: number, currentPath: string[] = []): string[] {
  const values = new Set<string>();
  data.forEach(item => {
    // Check if the item's path matches the current selected path up to the previous level
    let match = true;
    for (let i = 0; i < level; i++) {
      if (item.path[i] !== currentPath[i]) {
        match = false;
        break;
      }
    }
    // If it matches and the path has an element at the current level, add it
    if (match && item.path.length > level) {
      values.add(item.path[level]);
    }
  });
  return Array.from(values).sort(); // Sort alphabetically
}

// Utility function to filter links based on the selected path
export function filterLinks(data: LinkData[], selectedPath: string[]): LinkData[] {
  return data.filter(item => {
    if (item.path.length < selectedPath.length) return false;
    for (let i = 0; i < selectedPath.length; i++) {
      if (selectedPath[i] && item.path[i] !== selectedPath[i]) {
        return false;
      }
    }
    return true;
  });
}

// Utility function to determine the maximum depth of paths
export function getMaxPathDepth(data: LinkData[]): number {
  return data.reduce((maxDepth, item) => Math.max(maxDepth, item.path.length), 0);
}

// Placeholder names for dropdown labels based on level index
export function getPathLevelLabel(level: number): string {
  const labels = ["Year", "Session", "Degree", "Semester", "Department", "Specialization", "Subject"]; // Extend as needed
  return labels[level] || `Level ${level + 1}`;
}
