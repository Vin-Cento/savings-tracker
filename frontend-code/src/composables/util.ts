export function isValidDate(value: any): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function sortingComparison(aValue: any, bValue: any) {
  let comparison = 0;
  if (typeof aValue === "number" && typeof bValue === "number") {
    comparison = aValue - bValue;
  } else if (isValidDate(aValue) && isValidDate(bValue)) {
    const dateA = new Date(aValue);
    const dateB = new Date(bValue);
    comparison = dateA.getTime() - dateB.getTime();
  } else if (typeof aValue === "string" && typeof bValue === "string") {
    comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
  } else {
    comparison = String(aValue).localeCompare(String(bValue));
  }
  return comparison
}
