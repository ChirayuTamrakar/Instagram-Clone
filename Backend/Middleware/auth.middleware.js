import userModel from'../models/user.model.js';
import blacklistTokenModel from '../models/blacklist.model.js';
import jwt from 'jsonwebtoken';

// Middleware to authenticate user -> Check if token exist
//                                 -> is token blacklisted
//                                 -> Find user form the token and return user.
export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; //IMP ?  - 
    console.log('Token from cookie or header:', token);
    // Check if token exists
    if (!token){                     
        return res.status(401).json({ message: 'Unauthorized ' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
   
    if(isBlacklisted){
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    //This decoded part goes in try and catch block:-
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        return next();
    }catch(err){
        return res.status(402).json({message: 'Token expired '})
    }
}

export default authUser;

