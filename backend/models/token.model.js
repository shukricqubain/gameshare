module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        tokenID: {
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        token: {
            type: Sequelize.STRING,
            validate:{
                notEmpty: false,
            }
        },
        userName: {
            type: Sequelize.STRING,
            validate:{
                notEmpty: false,
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
        tableName: 'token',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['tokenID','token','userName']}]
    });

    return Role;
};