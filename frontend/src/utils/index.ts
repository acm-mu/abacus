// Convert's stored language values in to syntax highlighter friendly values
export const syntax_lang = (language: string): string => {
  switch (language) {
    case 'python3':
      return "python"
    default:
      return language
  }
}

// Capitalizes the first letter of a string
export const capitalize = (str: string): string => str.trim().replace(/^\w/, (c) => c.toUpperCase());

// Capitalizes the first letter of every word in a string
export const capitalize_all = (str: string): string => str.trim().replace(/\w*/g, (word) => capitalize(word));

export const compare = (o1: string | number, o2: string | number): number => {
  if (typeof (o1) == 'string' && typeof (o2) == 'string')
    return o1.localeCompare(o2)
  else if (typeof (o1) == 'number' && typeof (o2) == 'number') {
    if (o1 == o2) return 0
    return o1 > o2 ? 1 : -1;
  }
  return 0
}



export { useFetch, useFetchPost } from './useFetch';