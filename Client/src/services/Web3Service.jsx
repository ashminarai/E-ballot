import Web3 from "web3";

import Voting from '../assets/contracts/Voting.json'

class Web3Service {

    contract = null

    constructor() {
        this.getWeb3().then(web3 => {
            let abi = Voting.abi
            let networkData = Voting.networks[5777]
            if (networkData) {
                let address = networkData.address
                this.contract = new web3.eth.Contract(abi, address)
            }
        }).catch(err => {
            console.log(err)
        })
        window.ethereum?.on('accountsChanged', (acc) => {
            window.location.reload();
        });
    }

    getContract = () => {
        return new Promise((resolve, reject) => {
            let check = setInterval(() => {
                if (this.contract != null) {
                    resolve(this.contract);
                    clearInterval(check);
                }
            }, 1000);
        })
    }

    getCurrentAccount = () => {
        return new Promise((resolve, reject) => {
            this.getWeb3().then((web3) => {
                web3.eth.getAccounts((err, accs) => {
                    this.account = accs[0];
                    resolve(this.account);
                });
            });
        });
    }

    getWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            window.ethereum.enable()
            return window.web3
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            return window.web3
        }
        else {
            return window.web3
        }
    }
}

export default Web3Service;

