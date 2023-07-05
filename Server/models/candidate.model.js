DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("candidate", {
        fName: {
            type: DataTypes.STRING,
        }, lName: {
            type: DataTypes.STRING,
        }, party: {
            type: DataTypes.STRING,
        }, candidateImage: {
            type: DataTypes.STRING,
        }, candidateSymbol: {
            type: DataTypes.STRING,
        },electionId :{
            type: DataTypes.STRING,
        }
    });
};
