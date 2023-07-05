const upload = require("../middleware/upload.file");

module.exports = app => {
    const candidate = require("../controllers/candidate.controller");

    const router = require("express").Router();

    router.post('/', upload.fields([{name: "candidateImage", maxCount: 1}, {
        name: "candidateSymbol",
        maxCount: 1
    }]), candidate.create)

    router.get('/', candidate.findAll)


    app.use('/api/candidate', router)
}