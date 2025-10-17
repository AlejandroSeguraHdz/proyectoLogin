import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { createAccessToken } from "../libs/jwt.js"
import { TOKEN_SECRET } from "../config.js";
import jwt  from "jsonwebtoken";
/*export const register = async (req, res) => {

    try {


        const { email, password, username } = req.body;

        const userFound = await User.findOne({ email });
        if (userFound)
            return res.status(400).json(["The email is alredy in use"])

        const passwordhash = await bcrypt.hash(password, 10)
        const newUSer = User({
            username,
            email,
            password: passwordhash,

        })
        const userSaved = await newUSer.save()

        const token = await createAccessToken({ id: userSaved.id })
        res.cookie('token', token, { sameSite: "none" })
        return res.status(200)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

*/
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFound = await User.findOne({ username });

    if (userFound)
      return res.status(400).json(["The username is already in use"]);
      
    const userFound2 = await User.findOne({ email });

    if (userFound2)
      return res.status(400).json(["The email is already in use"]);


    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });
        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: false,


        });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFound = await User.findOne({ username });
        console.log(username)
        if (!userFound)
            return res.status(400).json(["The username does not exist"]);

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json( ["The password is incorrect"],);
        }

        const token = await createAccessToken({
            id: userFound._id,
            username: userFound.username,
        });

        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: false,


        });

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
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

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)
    console.log("id ", req.user.id)
    if (!userFound)
        return res.status(400).json(["User not found"]);
    console.log("userFound ", userFound.id)
    return res.json({
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
        password: userFound.password
    })


}
export const verifyToken = async (req, res) => {
    const { token } = req.cookies
    if (!token) return res.status(401).json(["Unauthorized" ])

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.status(401).json(["Unauthorized" ])

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json(["Unauthorized" ])

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        })
    })
}