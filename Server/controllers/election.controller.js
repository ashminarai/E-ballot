const db = require('../models')
const Election = db.elections
const Constituency = db.constituency
const op = db.Sequelize.Op
const { v4: uuidv4 } = require('uuid')
exports.create = (req, res) => {

    const { constituencyId, startDate, endDate } = req.body

    const ELECTION = {
        electionId: uuidv4(),
        constituencyId: constituencyId,
        startDate: startDate,
        endDate: endDate,
        status: false,
        result: false
    }

    Election.create(ELECTION)
        .then(r => res.send(r))
        .catch(err => {
            res.status(500).send({ message: err.message || 'Error creating Election' })
        })

}

exports.findAll = (req, res) => {
    let data = []
    Election.findAll().then(d => {
        if (d.length === 0) {
            res.send(data)
        } else {
            d.forEach((e, i) => {
                console.log(e)
                let _e = e.dataValues
                Constituency.findByPk(e.constituencyId).then(c => {
                    _e.constituency = c.dataValues
                    console.log(_e)
                    data.push(_e)
                    if (data.length === d.length) res.send(data)
                })
            })
        }
    }).catch(err => res.send(err.message))
}

exports.delete = (req, res) => {
    let id = req.params.id
    Election.destroy({ where: { id: id } }).then(r => {
        if (r) {
            res.status(200).send({ "status": "success", "msg": `deleted Election with id ${id}` })
        } else {
            res.status(404).send({ "status": "success", "msg": `Election with id ${id} not found` })
        }
    }).catch(err => {
        res.send({ "status": "failed", "msg": "failed delete" })
    })
}

exports.update = (req, res) => {
    let id = req.body.id
    Election.update(req.body, {
        where: { id: id }
    }).then(r => {
        console.log(r)
        if (r[0] === 1) {
            res.send({ status: "success", msg: `updated Election with id: ${id}` })
        } else {
            res.status(404).send({ status: "failed", msg: `not found election with id: ${id}` })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}

exports.findElectionByEId = (req, res) => {
    let eid = req.params.id

    Election.findOne({ where: { electionId: eid } }).then(r => {
        let election = r.dataValues
        Constituency.findByPk(election.constituencyId).then(r => {
            election.constituency = r.dataValues
            res.send(election)
        })

    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
}