interface Config {
  API_URL: string
}

const prod: Config = {
  API_URL: 'https://api.codeabac.us'
}

const dev: Config = {
  API_URL: 'http://localhost'
}

export default process.env.NODE_ENV === 'development' ? dev : prod