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
    ///verify token
    jwt.verify(token.token, secret, async (err, decoded) => {
        if (err) {
            ///Token expired
            if (err.name === 'TokenExpiredError') {
                let result = await tokenController.delete(token.tokenID);
                if (result == 1) {
                    return 'Token deleted, reload login.';
                } else {
                    return 'Error deleting token.';
                }
            } else if (err.name === 'NotBeforeError') {
                return res.status(401).send({
                    message: 'JWT Not Before Error.'
                });
            } else {
                return 'JsonWebTokenError';
            }
        } else {
            return 'Logged in successfully.';
        }
    });
}

async function decodeToken(token){
    jwt.decode(token.token, secret, (err, decoded) => {
        if(err){
            return 'Error decoding token.';
        } else {
            return ''
        }
    });
}

module.exports = {
    generateToken,
    updateToken,
    verifyToken,
    decodeToken
};