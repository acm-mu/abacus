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


export { useFetch, useFetchPost } from './useFetch';