module.exports = (sequelize, Sequelize) => {
    const ThreadItem = sequelize.define("threadItem", {
        threadItemID:{
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        threadID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        threadMessage: {
            foreignKey: true,
            type: Sequelize.STRING,
            validate: {
            }
        },
        userID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        replyID: {
            type: Sequelize.INTEGER,
            validate: {
            }
        },
        threadItemImage: {
            type: Sequelize.TEXT('long'),
            validate: {
            }
        },
        createdAt: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW,
            validate:{
            }
        },
        updatedAt: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW,
            validate:{
            }
        },
    },{
        tableName: 'threadItem',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['threadItemID']}]
    });
    return ThreadItem;
};