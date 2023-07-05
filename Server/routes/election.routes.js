module.exports = app => {
    const election = require('../controllers/election.controller')

    const router = require("express").Router();

    router.post('/', election.create)

    router.get('/', election.findAll)

    router.get('/:id', election.findElectionByEId)

    router.delete('/:id', election.delete)

    router.put('/', election.update)

    app.use('/api/election', router)
}