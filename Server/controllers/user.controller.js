const db = require('../models')
const User = db.user
const op = db.Sequelize.Op
const {v4: uuidv4} = require('uuid')
exports.create = (req, res) => {

    const {fName, userId, email, constituencyId, nationalId} = req.body

    const USER = {
        userId: userId,
        constituencyId: constituencyId,
        fName: fName,
        nationalId: nationalId,
        email: email
    }

    User.create(USER)
        .then(r => res.send(r))
        .catch(err => {
            console.log(err)
            res.status(500).send({message: err.message || 'Error creating Election'})
        })

}

exports.findAll = (req, res) => {
    User.findAll().then(d => {
        res.send(d)
    }).catch(err => res.send(err.message))
}

exports.getUserById = (req, res) => {
    let uId = req.params.uid
    User.findOne({where: {userId: uId}}).then(r => {
        res.send(r)
    }).catch(err => {
        res.status(500).send({"msg": err.message})
    })
}

exports.delete = (req, res) => {
    let id = req.params.id
    User.destroy({where: {id: id}}).then(r => {
        res.status(200).send(r)
    }).catch(err => {
        res.status(500).send(err.message)
    })
}