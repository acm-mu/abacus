interface Config {
  isLocal: boolean
  API_URL: string
  environmentText: string
}

const prod: Config = {
  isLocal: false,
  API_URL: process.env.API_URL || 'https://abacus.cs.mu.edu:8080',
  environmentText: ''
}

const dev: Config = {
  isLocal: true,
  API_URL: 'http://localhost',
  environmentText: 'LOCAL ENV.'
}

const staging: Config = {
  isLocal: true,
  API_URL: process.env.API_URL || 'https://api-staging.codeabac.us',
  environmentText: 'STAGING ENV.'
}

const isStaging = window.location.hostname.startsWith('staging')

export default isStaging ? staging : process.env.NODE_ENV === 'development' ? dev : prod
