module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        gameID: {
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
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
        developers:{
            type: Sequelize.STRING,
            validate: {
            } 
        },
        publishers:{
            type: Sequelize.STRING,
            validate: {
            }
        },
        genre:{
            type: Sequelize.STRING,
            validate: {
            }
        },
        releaseDate: {
            type: Sequelize.DATE,
            validate:{
            }
        },
        gameCover:{
            type: Sequelize.TEXT('long'),
            validate: {
            }
        },
        platform: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        gameCoverFileName: {
            type: Sequelize.STRING,
            validate: {
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
        tableName: 'game'
    },{
        indexes:[{
            unique:true, 
            fields: ['gameID','gameName']}]
    });
    return Game;
};