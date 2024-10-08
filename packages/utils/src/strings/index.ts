export function pascalCase(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function kebabCase(input: string): string {
  return input
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-");
}



