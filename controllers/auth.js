const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const emailExist = await User.findOne({ email });
        if ( emailExist ) {
            return res.status(400).json({
                of: false,
                msg: 'The email is already registered.'
            });
            
        }

        const user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generate Json Web Token
        const token = await generateJWT( user.id );

    
        res.json({
            ok: true,  
            user,
            token
        });   
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact with the admin.'
        });   
    }
}

const login = async ( req, res = response) => {

    const {email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });
        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not found.'
            });
        }

        // Validate Password
        const validatePassword = bcrypt.compareSync( password, userDB.password );
        if ( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password is not valid.'
            }); 
        }

        // Generate JWT
        const token = await generateJWT( userDB.id );
        res.json({
            ok: true,  
            user: userDB,
            token
        });   
        
          
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contact the admin.'
        });
    }
}

const renewToken = async(req, res = response ) => {
    
    const uid = req.uid;
    const token = await generateJWT( uid );
    const user = await User.findById( uid );
    
    
    res.json({
        ok: true,
        user,
        token
    });
}
module.exports = {
    createUser,
    login,
    renewToken
}