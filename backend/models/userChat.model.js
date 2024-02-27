module.exports = (sequelize, Sequelize) => {
    const UserChat = sequelize.define("userChat", {
        userChatID:{
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userOneID: {
            foriegnKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userTwoID: {
            foriegnKey: true,
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
        tableName: 'userChat'
    },{
        indexes:[{
            unique:true, 
            fields: ['userChatID']}]
    });
    return UserChat;
};