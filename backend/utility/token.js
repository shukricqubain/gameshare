const jwt = require('jsonwebtoken');
const secret = '3310969166433653447079416612547342880134738789931871978370073798795133211999047787078905511792111667';
const tokenController = require('../controllers/token.controller');

async function generateToken(user) {
    try {
        const token = jwt.sign(
            { data: `${user.userRole}` },
            secret,
            { expiresIn: '4h' }
        );
        const token_obj = {
            token: token,
            userName: user.userName
        }
        await tokenController.create(token_obj);
        return token;
    } catch (err) {
        console.log(err);
    }
}

async function updateToken(user) {
    try {
        const token = jwt.sign(
            { data: `${user.userRole}` },
            secret,
            { expiresIn: '4h' }
        );
        const token_obj = {
            token: token,
            userName: user.userName
        }
        let token_to_update = await tokenController.findUsername(user.userName);
        if (token_to_update !== 'Cannot find token with specified username.') {
            await tokenController.update(token_to_update.tokenID, token_obj);
        } else {
            await tokenController.create(token_obj);
        }

        return token;
    } catch (err) {
        console.log(err);
    }
}

async function verifyToken(token) {
    let returnString = '';
    let roleID = 0;
    let returnOBJ = {
        returnString: returnString,
        roleID: roleID
    }
    ///verify token
    jwt.verify(token.token, secret, async (err, decoded) => {
        if (err) {
            ///Token expired
            if (err.name === 'TokenExpiredError') {
                returnOBJ.returnString = 'TokenExpiredError';
            } else if (err.name === 'NotBeforeError') {
                returnOBJ.returnString = 'JWT Not Before Error.';
            } else {
                returnOBJ.returnString = 'JsonWebTokenError';
            }
        } else {
            returnOBJ.roleID = Number(decoded.data);
            returnOBJ.returnString = 'Logged in successfully.';
        }
    });
    return returnOBJ;
}

module.exports = {
    generateToken,
    updateToken,
    verifyToken
};