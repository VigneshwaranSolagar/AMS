const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtConfig = require("../config/jwt.config");
const userModel = require("../models/user.model");



async function login(username, password) {

    const user =
        await userModel.findByUsername(username);


    if (!user)
        return null;


    const valid =
        await bcrypt.compare(
            password,
            user.password_hash
        );


    if (!valid)
        return null;



    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },

        jwtConfig.SECRET,

        {
            expiresIn: "8h"
        }
    );


    return {

        token,

        user

    };

}





async function register(data) {


    const existing =
        await userModel.getUserCount();



    if(existing > 0){

        throw new Error(
            "Account already exists."
        );

    }



    const hash =
        await bcrypt.hash(
            data.password,
            10
        );



    const user = await userModel.createUser({

        username: data.mobile,

        password_hash: hash,

        role: "ADMIN",

        name: data.name,

        mobile: data.mobile,

        business_name: data.business_name,

        gst_pan: data.gst_pan

    });



    return user;

}





async function resetPassword(
    gst_pan,
    newPassword
)
{


    const user =
        await userModel.findByGstPan(
            gst_pan
        );


    if(!user){

        return null;

    }



    const hash =
        await bcrypt.hash(
            newPassword,
            10
        );



    await userModel.updatePasswordByGstPan(
        gst_pan,
        hash
    );


    return true;

}





module.exports = {

    login,

    register,

    resetPassword

};