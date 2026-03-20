import userModel from '../models/user.model.js';

export const createUser = async({firstName, lastname, email, password }) => {
    if(!firstName || !email || !password){
        throw new Error('All feilds are required');
    }
    const user = userModel.create({
        fullname:{
            firstName,
            lastname
        },
        email,
        password
    })
    return user;
} 