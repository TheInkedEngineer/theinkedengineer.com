import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAnimationDelay(index: number, multiplier = 50, max = 200) {
  return Math.min(index * multiplier, max)
}
