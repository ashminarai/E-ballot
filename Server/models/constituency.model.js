const DataTypes = require('sequelize')

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("constituency", {
        name: DataTypes.STRING
    })
}