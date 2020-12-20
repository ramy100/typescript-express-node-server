import { ID_TOKEN_KEY, getToken } from '../common/jwt.service'

export default (_context) => ({
  httpEndpoint: 'http://localhost:4000',
  getAuth: () => {
    return 'Bearer ' + getToken() || ''
  },
  wsEndpoint: 'ws://localhost:4000/graphql',
  tokenName: ID_TOKEN_KEY,
})
