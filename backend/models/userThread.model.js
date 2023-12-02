module.exports = (sequelize, Sequelize) => {
    const UserThread = sequelize.define("userThread", {
        userThreadID:{
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        threadID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        userID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        boardID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        boardName: {
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
        tableName: 'userThread',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['userThreadID']}]
    });
    return UserThread;
};