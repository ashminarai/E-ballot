const db = require('../models')
const Candidate = db.candidate
const op = db.Sequelize.Op
const {v4: uuidv4} = require('uuid')
const fs = require("fs");
exports.create = (req, res) => {

    const {fName, lName, electionId, party} = req.body

    console.log(req.files.candidateImage[0].filename)

    const C = {
        electionId: electionId,
        fName: fName,
        lName: lName,
        party: party,
        candidateImage: req.files.candidateImage[0].filename,
        candidateSymbol: req.files.candidateSymbol[0].filename,
    }

    // console.log(C)

    Candidate.create(C)
        .then(r => res.send(r))
        .catch(err => {
            res.status(500).send({message: err.message || 'Error creating Election'})
        })

}

exports.findAll = (req, res) => {
    Candidate.findAll().then(d => {
        res.send(d)
    }).catch(err => res.send(err.message))
}