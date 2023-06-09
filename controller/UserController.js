import Users from "../models/userModel.js";
import bcrypt from "bcrypt"


export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'username', 'email']
        });
        res.json(users)
    } catch (error) {
        console.log(error.message)
    }
}

export const userRegister = async (req, res) => {
    const { username , email , password, confPassword } = req.body
    if(password !== confPassword ) return res.status(400).json({msg: "Password dan confirm password salah"})

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error.message);
    }
}