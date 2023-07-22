module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        roleID: {
            autoIncrement: true,
            primaryKey: true,        
            type: Sequelize.INTEGER,
            validate:{
                isInt: true,   
            }
        },
        name: {
            type: Sequelize.STRING,
            validate:{
                notEmpty: false,
            }
        },
        desc: {
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
        tableName: 'role',
        timestamps: true,
        
    },{
        indexes:[{
            unique:true, 
            fields: ['roleID','name','desc']}]
    });

    return Role;
};