module.exports = (sequelize, Sequelize) => {
    const UserGame = sequelize.define("userGame", {
        userGameID:{
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        gameID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        gameName: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        userID: {
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        gameEnjoymentRating:{
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
        tableName: 'userGame'
    },{
        indexes:[{
            unique:true, 
            fields: ['userGameID']}]
    });
    return UserGame;
};