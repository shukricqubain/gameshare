module.exports = (sequelize, Sequelize) => {
    const UserAchievement = sequelize.define("userAchievement", {
        userAchievementID: {
            unique: true,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        achievementID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate: {
                isInt: true
            }
        },
        gameID: {
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
        achievementStatus: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    }, {
        tableName: 'userAchievement'
    }, {
        indexes: [{
            unique: true,
            fields: ['userAchievementID']
        }]
    });
    return UserAchievement;
};