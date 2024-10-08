export const join = (...names: string[]) => {
  return names.join(" ");
};

export const switchClass = (obj: Record<string, boolean>) => {
  return Object.entries(obj)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(" ");
};
