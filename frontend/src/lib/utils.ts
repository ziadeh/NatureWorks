import { type ClassValue, clsx } from "clsx";
//@ts-ignore
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Automatically use the client's local time zone
  return new Intl.DateTimeFormat(undefined, options).format(date);
}
