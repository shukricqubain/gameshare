const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    logging: false,
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.token = require("./token.model.js")(sequelize, Sequelize);
db.game = require('./game.model.js')(sequelize, Sequelize);
db.achievement = require('./achievement.model.js')(sequelize, Sequelize);
db.userGame = require('./userGame.model.js')(sequelize, Sequelize);
db.userAchievement = require('./userAchievement.model.js')(sequelize, Sequelize);
db.userBoard = require('./userBoard.model.js')(sequelize, Sequelize);
db.userThread = require('./userThread.model.js')(sequelize, Sequelize);
db.userFriend = require('./userFriend.model.js')(sequelize, Sequelize);
db.userMessage = require('./userMessage.model.js')(sequelize, Sequelize);
db.board = require('./board.model.js')(sequelize, Sequelize);
db.thread = require('./thread.model.js')(sequelize, Sequelize);
db.threadItem = require('./threadItem.model.js')(sequelize, Sequelize);

module.exports = db;
