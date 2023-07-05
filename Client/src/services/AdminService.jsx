import axios from "axios";
import Web3Service from "./Web3Service";
import {getElectionDetails} from "./VoterService";

const API = import.meta.env.VITE_API
const ws = new Web3Service()
// Authentication
export const checkIsAdmin = () => {
    return new Promise((resolve, reject) => {
        ws.getContract().then(c => {
            ws.getCurrentAccount().then(a => {
                c.methods.isAdmin().call({from: a}).then(r => {
                    resolve(r)
                }).catch(err => {
                    reject(err)
                })
            })

        })
    })
}

export const adminLogin = (data) => {
    return new Promise((resolve, reject) => {
        ws.getContract().then(c => {
            c.methods
                .adminLogin(data.pwd)
                .call()
                .then((r) => {
                    // console.log(r);
                    resolve(r);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    })

}

// Election

export const getAllElections = () => {
    return axios.get(API + '/election')
}

export const addElection = (data) => {
    let election = data
    return new Promise((resolve, reject) => {
        axios.post(API + '/election', data).then(r => {
            if (r.status === 200) {
                election = r.data
                ws.getContract().then(c => {
                    ws.getCurrentAccount().then(a => {
                        c.methods.addElection(election.electionId)
                            .send({from: a})
                            .on("confirmation", (d) => {
                                console.log(d);
                                resolve(d);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                })
            }
        })
    })
}

export const deleteElection = (id) => {
    return axios.delete(API + '/election/' + id)
}

export const updateElection = (election) => {
    return axios.put(API + '/election/', election)
}

// Constituency

export const addConstituency = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(API + '/constituency', data).then((res) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
};


export const deleteConstituency = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(API + '/constituency/' + id).then((res) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getAllConstituencies = () => {
    return new Promise((resolve, reject) => {
        axios.get(API + '/constituency')
            .then(function (response) {
                // handle success
                // console.log(response);
                resolve(response)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                reject(error)
            })
            .finally(function () {
                // always executed
            });
    })

}

export const getElectionConstituencies = () => {
    return new Promise((resolve, reject) => {
        let ecs = []
        getAllElections().then(r => {
            let elections = r.data
            if (elections.length === 0) resolve(ecs)
            getAllConstituencies().then(c => {
                let constituencies = c.data
                let ec = {
                    electionId: '', name: ''
                }
                elections.forEach((e, i) => {
                    ec.electionId = e.electionId;
                    ec.name = constituencies.filter((c, i) => c.id === e.constituencyId)[0].name
                    ecs.push(ec)
                    if (elections.length === ecs.length) resolve(ecs)

                })

            })
        })
    })
}

// Candidates

export const addCandidate = (data) => {
    console.log(data.get("candidateImage"))
    return new Promise((resolve, reject) => {
        axios.post(API + '/candidate', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(result => {
            ws.getContract().then(c => {
                ws.getCurrentAccount().then(a => {
                    console.log(result.data.id)
                    c.methods.addCandidate(result.data.id.toString(), data.get("fName"), data.get("electionId"))
                        .send({from: a})
                        .on("confirmation", (r) => {
                            console.log(r);
                            resolve(r);
                        })
                        .catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                })

            })
        })
    })
}

export const getAllCandidatesBC = () => {
    return new Promise((resolve, reject) => {
        ws.getContract().then(c => {
            c.methods
                .getCandidates()
                .call()
                .then((r) => {
                    resolve(r)
                    console.log("Candidates", r);
                }).catch(err => {
                reject(err)
            });
        })
    })
}

export const getAllCandidatesServer = () => {
    return axios.get(API + '/candidate')
}

export const getAllCandidatesByElection = (eId) => {
    return axios.get(API + '/candidate/election/' + eId)
}

//Voters

export const getAllVoters = () => {
    return new Promise((resolve, reject) => {
        ws.getContract().then(c => {
            c.methods.getUsers().call().then(u => {
                resolve(u)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    })
}

export const verifyVoter = (userId) => {
    return new Promise((resolve, reject) => {

        ws.getContract().then(c => {
            ws.getCurrentAccount().then(a => {
                console.log(userId)
                c.methods.verifyUser(userId).send({from: a})
                    .on('confirmation', (r) => {
                        resolve(r)
                    }).on('error', (err) => {
                    reject(err)
                })
            })

        })
    })
}

export const getCounts = async () => {
    let data = {
        electionsCount: 0, votersCount: 0, activeElectionsCount: 0, activeVoters: 0, constituencyCount: 0
    }
    const activeVoters = await getAllVoters().then(v => {
        return v.filter((u, i) => u.isActive === true)
    })
    data.activeVoters = activeVoters.length
    await axios.get(API + '/count').then(r => {
        console.log(r)
        let _d = r.data.data
        data.activeElectionsCount = _d.activeElectionsCount
        data.constituencyCount = _d.constituencyCount
        data.votersCount = _d.votersCount
        data.electionsCount = _d.electionsCount
    })

    return data;
}

export const getElectionResults = (eId) => {
    let data = []
    return new Promise((resolve, reject) => {
        ws.getContract().then(c => {
            c.methods.getResult(eId).call().then(result => {
                getAllCandidatesServer().then(r => {
                    let _candidates = r.data
                    console.log(_candidates,result);
                    _candidates.forEach((c, i) => {
                        c.votes = result.filter((a, k) => c.id === parseInt(a.id))[0].voteCount
                        data.push(c)
                        if (data.length === result.length) resolve(data)
                    })
                })
            }).catch(err => {
                reject(err)
            })
        })
    })
}

export const getCandidateVote = (eId) => {
    return new Promise((resolve, reject) => {
        getAllCandidatesServer().then(async r => {
            console.log(r)
            let candidates = await r.data.filter((c, i) => c.electionId === eId)
            candidates.forEach((ca, i) => {
                ws.getContract().then(c => {
                    console.log(ca.id)
                    c.methods.getCandidateVotes(ca.id.toString()).call().then(result => {
                        console.log(ca.id, result)
                    }).catch(err => {
                        console.log(err)
                    })
                })
            })
        })
    })

}

export const formatDate = (dateString) => {
    const options = { //Typescript ways of adding the type
        year: "numeric", month: "long", day: "numeric",
    };
    return new Date(dateString).toLocaleDateString([], options);
};

export const getElectionReportDetails = (eId) => {
    return new Promise((resolve, reject) => {
        getElectionDetails(eId).then(r => {
            let election = r.data
            ws.getContract().then(c => {
                c.methods.getElection(eId).call().then(e => {
                    console.log(e)
                    resolve({election, e})
                }).catch(err => {
                    reject(err)
                })
            })
        })
    })
}