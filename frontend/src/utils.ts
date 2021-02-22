
const lang = (language: string): string => {
  switch (language) {
    case 'python3':
      return "Python 3"
    default:
      return language
  }
}

const formattext = (str: string): string => str.replace(/(^.*$)/gm, (c: any) => isNaN(c) ? `"${c}"` : c)
const capitalize = (str: string): string => str.trim().replace(/^\w/, (c) => c.toUpperCase());


export { lang, capitalize, formattext }