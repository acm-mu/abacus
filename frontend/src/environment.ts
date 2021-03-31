interface Config {
  isLocal: boolean;
  API_URL: string;
}

const prod: Config = {
  isLocal: false,
  API_URL: 'https://api.codeabac.us'
}

const dev: Config = {
  isLocal: true,
  API_URL: 'http://localhost'
}

export default process.env.NODE_ENV === 'development' ? dev : prod