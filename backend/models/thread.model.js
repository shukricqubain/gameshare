module.exports = (sequelize, Sequelize) => {
    const Thread = sequelize.define("thread", {
        threadID:{
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        boardID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        userID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        threadName: {
            type: Sequelize.STRING,
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
        tableName: 'thread',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['threadID']}]
    });
    return Thread;
};