const db = require('../models/index');

async function getAll(){
    try{
        return await db.achievement.findAll({
            raw: true,
        });
    } catch(err){
        console.log(err)
    }
}
async function create(game){
    try{
        return await db.achievement.create({
            gameID: game.gameID,
            gameName: game.gameName,
            developers: game.developers,
            publishers: game.publishers,
            genre: game.genre,
            releaseDate: game.releaseDate,
            gameCover: game.gameCover,
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(gameID){
    try{
        return await db.achievement.findOne({
            where: {gameID: gameID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(gameID, game){
    try{
        return result = await db.achievement.update(
            game,
            {
                where:{
                    gameID: gameID
                }
            }
        );
    } catch(err){
        console.log(err);
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function deleteGame(gameID){
    try{
        return result = await db.achievement.destroy({
            where:{
                gameID: gameID
            }
        });
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    deleteGame
};