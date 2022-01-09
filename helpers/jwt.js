const jwt = require('jsonwebtoken');

const generateJWT = ( uid ) => {

    return new Promise( (resolve, reject) => {
        
        const payload = { uid };

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, ( error, token ) => {

            if ( error ) {
            // The token could not be created.
            reject('The JWT could not be created.');
            
            } else{
            // TOKEN!
            resolve( token );
            }
        });
    } );
}

module.exports = {
    generateJWT
}