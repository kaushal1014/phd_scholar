export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

