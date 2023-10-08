module.exports = (sequelize, Sequelize) => {
    const Board = sequelize.define("board", {
        boardID: {
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
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
        tableName: 'board',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['boardID']}]
    });

    return Board;
};