interface Config {
  isLocal: boolean
  API_URL: string
  PISTON_URL: string
  environmentText: string
}

const prod: Config = {
  isLocal: false,
  API_URL: 'https://api.codeabac.us',
  PISTON_URL: 'https://piston.codeabac.us',
  environmentText: ''
}

const dev: Config = {
  isLocal: true,
  API_URL: 'http://localhost',
  PISTON_URL: 'http://localhost:2000',
  environmentText: 'LOCAL ENV.'
}

const staging: Config = {
  isLocal: true,
  API_URL: 'https://api-staging.codeabac.us',
  PISTON_URL: 'https://piston.codeabac.us',
  environmentText: 'STAGING ENV.'
}

const isStaging = window.location.hostname.startsWith('staging')

export default isStaging ? staging : process.env.NODE_ENV === 'development' ? dev : prod
