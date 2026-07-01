import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../config/upload.js";

const router = express.Router();

// Register

router.post("/register", upload.single("photo"), async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({
        message:"User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const photo = req.file
      ? "/uploads/" + req.file.filename
      : "/images/default-user.png";

    await User.create({

      name,
      email,
      password: hashedPassword,
      photo

    });

    res.json({
      message:"Registration Successful"
    });

  } catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

// Login
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        photo:user.photo
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;