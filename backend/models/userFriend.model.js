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
            foriegnKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userIDReceivedRequest: {
            foriegnKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        areFriends: {
            type: Sequelize.ENUM,
            values: ['accepted', 'pending', 'rejected']
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