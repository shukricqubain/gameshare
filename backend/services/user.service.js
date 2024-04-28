const db = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const config = require('../config/config.js');
const secretKey = config.secret_key;
const mmddyyyyFormat = 'MM-DD-YYYY';
const yyyyddmmFormat = 'YYYY-MM-DD';

async function findCount(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let searchTerm = searchCriteria.searchTerm;
        let users;
        let where;
        if (searchTerm !== '') {
            where = {
                [Op.or]: {
                    userID: { [Op.like]: '%' + searchTerm + '%' },
                    userName: { [Op.like]: '%' + searchTerm + '%' },
                    userRole: { [Op.like]: '%' + searchTerm + '%' },
                    email: { [Op.like]: '%' + searchTerm + '%' }
                }
            };
        } else {
            where = '';
        }
        users = await db.user.findAll({
            where: where,
            order: [
                [sort, sortDirection],
                ['userName', 'ASC'],
            ],
            attributes: ['userID'],
            raw: true,
        }); 
        return users.length;
    } catch (err) {
        console.log(err)
    }
}

async function getAll(searchCriteria) {
    try {
        let sort = searchCriteria.sort;
        let sortDirection = searchCriteria.direction;
        let pagination = searchCriteria.pagination;
        let searchTerm = searchCriteria.searchTerm;
        let limit;
        let offset;
        let page = searchCriteria.page;
        let where;
        if (searchTerm !== '') {
            where =  {
                [Op.or]: {
                    userID: { [Op.like]: '%' + searchTerm + '%' },
                    userName: { [Op.like]: '%' + searchTerm + '%' },
                    userRole: { [Op.like]: '%' + searchTerm + '%' },
                    email: { [Op.like]: '%' + searchTerm + '%' }
                }
            };
        } else {
            where = '';
        }
        if(pagination === 'true'){
            limit = searchCriteria.limit;
            if (page != 0) {
                offset = page * limit;
            }
            return await db.user.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userName', 'ASC'],
                ],
                limit: limit,
                offset: offset,
                attributes: [
                    'userID',
                    'userName',
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.firstName"),
                            secretKey
                        ),
                        "CHAR"
                    ),'firstName'],
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.lastName"),
                            secretKey
                        ),
                        "CHAR"
                    ),'lastName'],
                    'dateOfBirth',
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.email"),
                            secretKey
                        ),
                        "CHAR"
                    ),'email'],
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.phoneNumber"),
                            secretKey
                        ),
                        "CHAR"
                    ),'phoneNumber'],
                    'userRole',
                    'userPassword',
                    'profilePictureFileName',
                    'createdAt',
                    'updatedAt'
                ],
                raw: true,
            });
        } else {
            return await db.user.findAll({
                where: where,
                order: [
                    [sort, sortDirection],
                    ['userName', 'ASC'],
                ],
                attributes: [
                    'userID',
                    'userName',
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.firstName"),
                            secretKey
                        ),
                        "CHAR"
                    ),'firstName'],
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.lastName"),
                            secretKey
                        ),
                        "CHAR"
                    ),'lastName'],
                    'dateOfBirth',
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.email"),
                            secretKey
                        ),
                        "CHAR"
                    ),'email'],
                    [Sequelize.cast(
                        Sequelize.fn(
                            "AES_DECRYPT",
                            Sequelize.col("user.phoneNumber"),
                            secretKey
                        ),
                        "CHAR"
                    ),'phoneNumber'],
                    'userRole',
                    'userPassword',
                    'profilePictureFileName',
                    'createdAt',
                    'updatedAt'
                ],
                raw: true,
            });
        }
    } catch (err) {
        console.log(err)
    }
}

async function create(user) {
    try {
        ///clean up dateOfBirth for insertion
        let dateString = `${user.dateOfBirth}`;
        let dateArray = dateString.split('T');
        dateString = `${dateArray[0]}`;
        user.dateOfBirth = dateString;
        ///clean up createdAt for insertion
        let createdAt = moment(new Date()).format(yyyyddmmFormat);
        let createdString = `${createdAt}`;
        let createdArray = createdString.split('T');
        createdString = `${createdArray[0]}`;
        user.createdAt = createdString;
        return await db.sequelize.query(
            `INSERT INTO user ( userName, firstName, lastName, dateOfBirth, email, phoneNumber, userRole, userPassword, profilePictureFileName, createdAt ) VALUES
            ( 
                '${user.userName}', 
                AES_ENCRYPT('${user.firstName}','${secretKey}'), 
                AES_ENCRYPT('${user.lastName}','${secretKey}'), 
                STR_TO_DATE('${user.dateOfBirth}',"%Y-%m-%d %H:%i:%s"), 
                AES_ENCRYPT('${user.email}','${secretKey}'), 
                AES_ENCRYPT('${user.phoneNumber}','${secretKey}'),
                '${user.userRole}', 
                '${user.userPassword}', 
                '${user.profilePictureFileName}',
                STR_TO_DATE('${user.createdAt}',"%Y-%m-%d %H:%i:%s") 
            );`
        );
    } catch (err) {
        console.log(err)
        if (err.name === 'SequelizeDatabaseError') {
            return 'Database error';
        } else if (err.errors[0].type !== undefined && err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function getOne(userID) {
    try {
        return await db.user.findOne({
            where: { userID: userID },
            attributes: [
                'userID',
                'userName',
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.firstName"),
                        secretKey
                    ),
                    "CHAR"
                ),'firstName'],
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.lastName"),
                        secretKey
                    ),
                    "CHAR"
                ),'lastName'],
                'dateOfBirth',
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.email"),
                        secretKey
                    ),
                    "CHAR"
                ),'email'],
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.phoneNumber"),
                        secretKey
                    ),
                    "CHAR"
                ),'phoneNumber'],
                'userRole',
                'userPassword',
                'profilePictureFileName',
                'createdAt',
                'updatedAt'
            ],
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function getUserByUserName(username) {
    try {
        return await db.user.findOne({
            where: { userName: username },
            attributes: [
                'userID',
                'userName',
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.firstName"),
                        secretKey
                    ),
                    "CHAR"
                ),'firstName'],
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.lastName"),
                        secretKey
                    ),
                    "CHAR"
                ),'lastName'],
                'dateOfBirth',
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.email"),
                        secretKey
                    ),
                    "CHAR"
                ),'email'],
                [Sequelize.cast(
                    Sequelize.fn(
                        "AES_DECRYPT",
                        Sequelize.col("user.phoneNumber"),
                        secretKey
                    ),
                    "CHAR"
                ),'phoneNumber'],
                'userRole',
                'userPassword',
                'profilePictureFileName',
                'createdAt',
                'updatedAt'
            ],
            raw: true
        });
    } catch (err) {
        console.log(err);
    }
}

async function update(userID, user) {
    try {
        ///encrypt updated fields
        ///clean up dateOfBirth for updation
        let dateString = `${user.dateOfBirth}`;
        let dateArray = dateString.split('T');
        dateString = `${dateArray[0]} ${dateArray[1]}`;
        user.dateOfBirth = dateString.slice(0, -5);
        ///clean up createdAt for updation
        let createdString = `${user.createdAt}`;
        let createdArray = createdString.split('T');
        createdString = `${createdArray[0]} ${createdArray[1]}`;
        user.createdAt = createdString.slice(0, -5);
        ///clean up updatedAt for updation
        let updatedAt = moment(new Date()).format(mmddyyyyFormat);
        let updatedString = `${updatedAt}`;
        let updatedArray = updatedString.split('T');
        updatedString = `${updatedArray[0]}`;
        user.updatedAt = updatedString;
        return await db.sequelize.query(
            `UPDATE user
            SET userName = '${user.userName}', 
            firstName = AES_ENCRYPT('${user.firstName}','${secretKey}'),
            lastName = AES_ENCRYPT('${user.lastName}','${secretKey}'),
            dateOfBirth = STR_TO_DATE('${user.dateOfBirth}',"%Y-%m-%d %H:%i:%s"),
            email = AES_ENCRYPT('${user.email}','${secretKey}'),
            phoneNumber = AES_ENCRYPT('${user.phoneNumber}','${secretKey}'),
            userRole = '${user.userRole}',
            userPassword = '${user.userPassword}',
            profilePictureFileName = '${user.profilePictureFileName}',
            createdAt = STR_TO_DATE('${user.createdAt}',"%Y-%m-%d %H:%i:%s"),
            updatedAt = STR_TO_DATE('${user.updatedAt}',"%m-%d-%Y")
            WHERE user.userID = ${userID};`
        );
    } catch (err) {
        console.log(err);
        if (err.errors[0].type === 'unique violation') {
            return err.errors[0].message;
        }
    }
}

async function deleteUser(userID) {
    try {
        return result = await db.user.destroy({
            where: {
                userID: userID
            }
        });
    } catch (err) {
        console.log(err);
    }
}

async function getAllUserNames(){
    return await db.user.findAll({
        attributes: [
            'userID',
            'userName'
        ],
        order: [
            ['userName', 'ASC'],
        ]
    });
}

async function getAllProfilePicturesByIDs(userFriends){
    return await db.user.findAll({
        where: {
            userID: {
                [Op.in]: userFriends
            }
        },
        attributes: [
            'userID',
            'userName',
            'profilePictureFileName'
        ],
        order: [
            ['userName', 'ASC'],
        ],
        raw: true
    });
}

module.exports = {
    getAll,
    getOne,
    getUserByUserName,
    getAllUserNames,
    getAllProfilePicturesByIDs,
    create,
    update,
    deleteUser,
    findCount
};