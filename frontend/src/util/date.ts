const timezoneOffset = () => (new Date()).getTimezoneOffset() * 60 * 1000

const toLocal = (date: string | number): Date => new Date((typeof (date) === 'string' ? parseInt(date) : date) - timezoneOffset())
const toGMT = (date: string | number): Date => new Date((typeof (date) === 'string' ? parseInt(date) : date) + timezoneOffset())

const toLocalDateString = (date: string | number): string => toLocal(date).toISOString().substring(0, 10)
const toLocalTimeString = (date: string | number): string => toLocal(date).toISOString().substring(11, 16)

export { toLocal, toGMT, toLocalDateString, toLocalTimeString }