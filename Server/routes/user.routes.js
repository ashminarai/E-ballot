module.exports = app => {
    const user = require('../controllers/user.controller')

    const router = require("express").Router();

    router.post('/', user.create)

    router.get('/', user.findAll)

    router.get('/:uid', user.getUserById)

    router.delete('/:id', user.delete)
        //Mounted express 
    app.use('/api/user', router)
}