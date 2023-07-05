const db = require('../models')
const User = db.user
const Election = db.elections
const Constituencies = db.constituency


exports.getCounts = async (req, res) => {
    let data = {
        electionsCount: 0,
        votersCount: 0,
        activeElectionsCount: 0,
        constituencyCount: 0
    }

    data.electionsCount = await Election.count()
    data.activeElectionsCount = await Election.count({where: {status: true}})
    data.votersCount = await User.count()
    data.constituencyCount = await Constituencies.count()

    res.send({data: data})
}
