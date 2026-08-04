const authService = require("../services/auth.service");



exports.login = async (req, res) => {

    try {


        const {
            username,
            password
        } = req.body;



        const result =
            await authService.login(
                username,
                password
            );



        if (!result) {

            return res.status(401).json({

                success: false,

                message: "Invalid username or password."

            });

        }



        return res.json({

            success: true,

            token: result.token,

            user: {

                id: result.user.id,

                username: result.user.username,

                role: result.user.role,

                name: result.user.name,

                business_name: result.user.business_name

            }

        });



    }
    catch(error){

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Login failed."

        });

    }

};







exports.register = async (req,res)=>{


    try{


        const user =
            await authService.register(
                req.body
            );


        res.json({

            success:true,

            message:"Account created successfully.",

            user:{
                id:user.id,
                username:user.username,
                name:user.name
            }

        });


    }
    catch(error){


        console.error(
            "Register Error:",
            error
        );


        res.status(400).json({

            success:false,

            message:error.message

        });


    }


};








exports.resetPassword = async (req,res)=>{


    try{

const {

    gst_pan,

    newPassword

} = req.body;



const result =
    await authService.resetPassword(
        gst_pan,
        newPassword
    );



        if(!result){

            return res.status(404).json({

                success:false,

                message:"GSTN / PAN  not found."

            });

        }



        res.json({

            success:true,

            message:"Password updated successfully."

        });



    }
    catch(error){


        console.error(
            "Reset Password Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Password reset failed."

        });


    }


};