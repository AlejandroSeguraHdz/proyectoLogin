import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { createAccessToken } from "../libs/jwt.js"
import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";
 
export const register = async (req, res) => {
    try {
        const { noEmpleado, nombres, apellidoP, apellidoM, email, password } = req.body;

        const userFound = await User.findOne({ noEmpleado });

        if (userFound)
            return res.status(400).json(["El nuero de empleado ya esta registrado"]);

        const userFound2 = await User.findOne({ email });

        if (userFound2)
            return res.status(400).json(["El email ya esta registrado"]);


        // hashing the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating the user
        const newUser = new User({
            noEmpleado,
            nombres,
            apellidoP,
            apellidoM,
            email,
            password: passwordHash,
        });

        // saving the user in the database
        const userSaved = await newUser.save();



        res.json({
            id: userSaved._id,
            noEmpleado: userSaved.noEmpleado,
            nombres: userSaved.nombres,
            apellidoP: userSaved.apellidoP,
            apellidoM: userSaved.apellidoM,
            email: userSaved.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { noEmpleado, password } = req.body;
        const userFound = await User.findOne({ noEmpleado });
         if (!userFound)
            return res.status(400).json(["El numero de empleado no existe"]);

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json(["Contraseña incorrecta"],);
        }

        const token = await createAccessToken({
            id: userFound._id,
            noEmpleado: userFound.noEmpleado,
            nombres: userFound.nombres,
        });

        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: false,


        });

        res.json({
             id: userFound._id,
            noEmpleado: userFound.noEmpleado,
            nombres: userFound.nombres,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0),
    });
    return res.sendStatus(200)
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies
    if (!token) return res.status(401).json(["Unauthorized"])

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.status(401).json(["Unauthorized"])

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json(["Unauthorized"])

        return res.json({
            id: userFound._id,
            noEmpleado: userFound.noEmpleado,
            email: userFound.email
        })
    })
}