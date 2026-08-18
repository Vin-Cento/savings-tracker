export type SortDirection = "asc" | "desc" | null;

export type SortConfig<T> = {
  attr: keyof T;
  direction: SortDirection;
} | null;

export function getNextSortConfig<T>(
  currentSortConfig: SortConfig<T>,
  attr: keyof T
): SortConfig<T> {
  let direction: SortDirection = "asc";

  if (currentSortConfig?.attr === attr) {
    if (currentSortConfig.direction === "asc") direction = "desc";
    else if (currentSortConfig.direction === "desc") direction = null;
    else direction = "asc";
  }

  return {
    attr,
    direction,
  };
}

export function sortByConfig<T>(
  data: T[],
  sortConfig: SortConfig<T>,
  sortingComparison: (
    a: NonNullable<T[keyof T]>,
    b: NonNullable<T[keyof T]>
  ) => number
): T[] {
  return [...data].sort((a, b) => {
    if (!sortConfig || sortConfig.direction === null) return 0;

    const attributeValueA = a[sortConfig.attr];
    const attributeValueB = b[sortConfig.attr];

    if (attributeValueA == null && attributeValueB == null) return 0;
    if (attributeValueA == null) return 1;
    if (attributeValueB == null) return -1;

    const comparison = sortingComparison(
      attributeValueA as NonNullable<T[keyof T]>,
      attributeValueB as NonNullable<T[keyof T]>
    );

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });
}
