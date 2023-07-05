module.exports = app => {
    const constituency = require('../controllers/constituency.controller')

    const router = require("express").Router();

    router.post('/', constituency.create)

    router.get('/', constituency.findAll)

    router.delete('/:id', constituency.delete)

    app.use('/api/constituency', router)
}