import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['caption', 'body', 'title', 'heading', 'input'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      word && word === word.toLowerCase()
        ? word[0].toUpperCase() + word.slice(1)
        : word,
    )
    .join(" ");
}