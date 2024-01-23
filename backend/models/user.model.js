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
            type: 'VARBINARY(255)',
            validate:{
            }
        },
        lastName: {
            type: 'VARBINARY(255)',
            validate:{
            }
        },
        dateOfBirth: {
            type: Sequelize.DATE,
            validate:{
            }
        },
        email: {
            type: 'VARBINARY(255)',
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
        userPassword: {
            type: Sequelize.STRING,
            validate:{
            }
        },
        profilePicture:{
            type: Sequelize.TEXT('long'),
            validate: {
            }
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    },{
        tableName: 'user'
    },{
        indexes:[{
            unique:true, 
            fields: ['userID','email','phoneNumber']}]
    });

    return User;
};