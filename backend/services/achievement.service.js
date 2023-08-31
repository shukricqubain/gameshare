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
async function create(achievement){
    try{
        return await db.achievement.create({
            achievementID: achievement.achievementID,
            gameID: achievement.gameID,
            achievementName: achievement.achievementName,
            achievementDescription: achievement.achievementDescription,
            achievementProgress: achievement.achievementProgress,
            achievementICON: achievement.achievementICON
        });
    } catch(err){
        console.log(err)
        if(err.errors[0].type === 'unique violation'){
            return err.errors[0].message;
        }
    }
}

async function getOne(achievementID){
    try{
        return await db.achievement.findOne({
            where: {achievementID: achievementID},
            raw: true
        });
    } catch(err){
        console.log(err);
    }
}

async function update(achievementID, achievement){
    try{
        return result = await db.achievement.update(
            achievement,
            {
                where:{
                    achievementID: achievementID
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

async function deleteAchievement(achievementID){
    try{
        return result = await db.achievement.destroy({
            where:{
                achievementID: achievementID
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
    deleteAchievement
};