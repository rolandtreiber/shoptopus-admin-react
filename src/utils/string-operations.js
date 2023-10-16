export const snakeToCapitalised = (str) => {
  return str
    .split("_")
    .filter(x => x.length > 0)
    .map((x) => (x.charAt(0).toUpperCase() + x.slice(1)))
    .join(" ");
}

export const dotSeparatedToCapitalised = (str) => {
  return str
    .split(".")
    .filter(x => x.length > 0)
    .map((x) => (x.charAt(0).toUpperCase() + x.slice(1)))
    .join(" ");
}