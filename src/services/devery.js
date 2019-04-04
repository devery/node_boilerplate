import Web3 from 'web3'
import { Eth } from 'web3-eth'
import { DeveryRegistry } from '@devery/devery'
import crossFetch from 'cross-fetch'

global.fetch = crossFetch

const { INFURA_API_KEY, INFURA_NET, WALLET_ID, WALLET_PRIVATE_KEY } = process.env

class DeveryInteraction {
  constructor(httpProvider, walletId, walletPrivateKey, networkId, gasLimit, gasPrice) {
    this.walletId = walletId
    this.walletPrivateKey = walletPrivateKey
    this.networkId = Number(networkId)
    this.gasLimit = gasLimit
    this.gasPrice = gasPrice
    this.eth = new Eth(httpProvider) // USE IT FOR TRANSACTIONS OUT OF DEVERY
    this.web3 = new Web3(httpProvider)
  }

  init() {
    const deveryRegistryClient = new DeveryRegistry({
      web3Instance: this.web3,
      acc: this.walletId,
      walletPrivateKey: this.walletPrivateKey,
      networkId: this.networkId
    })
    this.deveryRegistryClient = deveryRegistryClient
    return null
  }

  getApps() {
    return this.deveryRegistryClient.appAccountsLength().then(length => {
      return this.deveryRegistryClient.appAccountsPaginated(0, length)
    })
  }

  getAppByAddress(address) {
    return this.deveryRegistryClient.getApp(address).then(app => {
      return {
        appName: app.appName,
        fee: app.feeAccount,
        isActive: app.active
      }
    })
  }
}

export default new DeveryInteraction(
  `https://${INFURA_NET}.infura.io/${INFURA_API_KEY}`,
  WALLET_ID,
  WALLET_PRIVATE_KEY,
  3,
  250000,
  1500000
)
