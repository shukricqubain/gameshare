module.exports = (sequelize, Sequelize) => {
    const UserBoard = sequelize.define("userBoard", {
        userBoardID: {
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        boardID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        userID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        boardName: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        gameID: {
            type: Sequelize.INTEGER,
            validate:{
            }
        },
        gameName:{
            type: Sequelize.STRING,
            validate:{
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
        tableName: 'userBoard',
        timestamps: true,
    },{
        indexes:[{
            unique:true, 
            fields: ['userBoardID']}]
    });
    return UserBoard;
};