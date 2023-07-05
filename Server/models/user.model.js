DataTypes = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("user", {
        userId: {
            type: DataTypes.STRING,unique:true
        }, fName: {
            type: DataTypes.STRING,
        }, nationalId: {
            type: DataTypes.STRING,
        }, email: {
            type: DataTypes.STRING,
        }
    });
};
