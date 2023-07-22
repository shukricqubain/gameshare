module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        userID: {
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userName: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        firstName: {
            type: Sequelize.STRING,
            validate:{
            }
        },
        lastName: {
            type: Sequelize.STRING,
            validate:{
            }
        },
        dateOfBirth: {
            type: Sequelize.DATE,
            validate:{
            }
        },
        email: {
            type: Sequelize.STRING,
            validate:{
            }
        },
        phoneNumber: {
            type: Sequelize.STRING,
            validate:{
            }
        },
        userRole: {
            type: Sequelize.INTEGER,
            validate:{
            }
        },
        password: {
            type: Sequelize.STRING,
            validate:{
            }
        },
    },{
        tableName: 'user'
    },{
        indexes:[{
            unique:true, 
            fields: ['userID','email','phoneNumber']}]
    });

    return User;
};