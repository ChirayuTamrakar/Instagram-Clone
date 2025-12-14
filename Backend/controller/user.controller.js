const userModel = require("../../../BookMyCab/Backend/models/user.model");
const userService = require('../services/user.service')
const {validationResult} = require('express-validator')
const blackListTokenModel = require('../models/blackistToken.model');

export const registerUser = async(req, res)=>{
    //Check any Problem with the input data
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password}  = req.body;
    const ifUserAlreadyExistes = await userModel.findOne({email});
    if(ifUserAlreadyExistes){
        return res.status(400).json({message: "User Already Exist!"}); 
    }
    // Generate hashPassword for new user
    const hashedPassword = await userModel.hashPassword(password);
    // Make in user in DataBase
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    // Reture the token to userin cookie
    const token = user.generateAuthToken(); //IMP why not userModel    bcuse ----user is an instance of your user model (a single user document)
    res.cookie('token',  token); //We can do thisdue to cookie parser.(Attached in app.js)
    res.status(201).json({token, user});
}


export const loginUser = async (req, res, next)=>{
    //Check for problems
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const {email, password} = req.body;
    //find the user
    const user = await userModel.findOne({ email }).select('+password'); //IMP ✅ You’re telling Mongoose: “I know password is excluded by default, but I want it included in this specific query.”

    if(!user){
        return res.status(401).json({ message: 'Invalid email'});
    }
    //Compare Password
    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = user.generateAuthToken();  //IMP why not userModel.gener...    because it is methord not static   
    res.cookie('token', token);
    res.status(200).json({token, user});
}


export const getUserProfile = async (req, res, next)=>{
    
}


export const logoutUser = async (req, res, next) => {
    res.clearCookie('token'); //This command removes the cookie named token from the client’s browser  //IMP:- Clearing the cookie is in response it does not affct the request. 
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blackListTokenModel.create({token});
    res.status(200).json({ message: 'Logged out successfully' });
    console.log("Logout Successfully")
}   
