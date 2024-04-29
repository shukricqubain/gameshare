const jwt = require('jsonwebtoken');
const secret = '3310969166433653447079416612547342880134738789931871978370073798795133211999047787078905511792111667';

async function generateToken(user) {
    try {
        const token = jwt.sign(
            { 
                roleID: user.userRole,
                userName: user.userName,
                profilePictureFileName: user.profilePictureFileName
            },
            secret,
            { expiresIn: '4h' }
        );
        return token;
    } catch (err) {
        console.log(err);
    }
}

async function verifyToken(token) {
    let returnString = '';
    let returnOBJ = {
        returnString: returnString,
        decoded: {}
    }
    ///verify token
    jwt.verify(token, secret, async (err, decoded) => {
        // console.log(decoded)
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
            returnOBJ.decoded = decoded;
            returnOBJ.returnString = 'Logged in successfully.';
        }
    });
    return returnOBJ;
}

module.exports = {
    generateToken,
    verifyToken
};