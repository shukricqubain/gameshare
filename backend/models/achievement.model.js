module.exports = (sequelize, Sequelize) => {
    const Achievement = sequelize.define("achievement", {
        achievementID: {
            unique: true,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        gameID: {
            foreignKey: true,
            type: Sequelize.INTEGER,
            validate:{
                isInt: true
            }
        },
        achievementName: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        achievementDescription: {
            type: Sequelize.STRING,
            validate: {
            }
        },
        achievementIcon: {
            type: Sequelize.STRING,
            validate:{
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
        tableName: 'achievement'
    },{
        indexes:[{
            unique:true, 
            fields: ['achievementID']}]
    });
    return Achievement;
};