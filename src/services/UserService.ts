import { User } from "../models/User";
import bcrypt from 'bcrypt';

export const all = async () => {
    return await User.findAll();
}

export const registerUser = async (email: string, password: string) => {
    const hasUser = await User.findOne({ where: { email }})
    if(hasUser){
        return new Error('E-mail já existe!');
    }

    let hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
        email,
        password: hash
    });

    return newUser;
}

export const findByEmail = async (email: string) => {
    return await User.findOne({ where: { email }});
}

export const matchPassword = (passwordText: string, encrypted: string) => {
    return bcrypt.compareSync(passwordText, encrypted);
}