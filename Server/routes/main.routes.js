const {getCounts} = require("../controllers/main.controller");
module.exports = app => {
    const router = require("express").Router();

    router.get('/count', getCounts)

    app.use('/api', router)
}