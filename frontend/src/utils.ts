
const syntax_lang = (language: string): string => {
  switch (language) {
    case 'python3':
      return "python"
    default:
      return language
  }
}

const format_text = (str: string): string => str.replace(/(^.*$)/gm, (c: string) => isNaN(+c) ? `"${c}"` : c)
const capitalize = (str: string): string => str.trim().replace(/^\w/, (c) => c.toUpperCase());


export { syntax_lang, capitalize, format_text }