const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.elections = require("./election.model.js")(sequelize, Sequelize);
db.constituency = require('./constituency.model')(sequelize, Sequelize)
db.candidate = require('./candidate.model')(sequelize, Sequelize)
db.user = require('./user.model')(sequelize, Sequelize)

db.elections.belongsTo(db.constituency, {foreignKey: 'constituencyId', as: 'constituency'})
// db.candidate.belongsTo(db.elections, {foreignKey: 'electionId', as: 'election'})
db.user.belongsTo(db.constituency, {foreignKey: 'constituencyId', as: 'constituency'})

module.exports = db;
