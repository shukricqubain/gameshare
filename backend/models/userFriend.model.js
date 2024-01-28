module.exports = (sequelize, Sequelize) => {
    const UserFriend = sequelize.define("userFriend", {
        userFriendID:{
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userIDSentRequest: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userIDReceivedRequest: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        areFriends: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        createdBy: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
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
        tableName: 'userFriend'
    },{
        indexes:[{
            unique:true, 
            fields: ['userFriendID']}]
    });
    return UserFriend;
};