module.exports = (sequelize, Sequelize) => {
    const UserMessage = sequelize.define("userMessage", {
        userMessageID:{
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userIDSentMessage: {
            foriegnKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userIDReceivedMessage: {
            foriegnKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userMessage: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        isRead: {
            type: Sequelize.INTEGER,
            validate: {
            }
        },
        messageImage:{
            type: Sequelize.TEXT('long'),
            validate: {
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
        tableName: 'userMessage'
    },{
        indexes:[{
            unique:true, 
            fields: ['userMessageID']}]
    });
    return UserMessage;
};