const prisma = require("../../prisma/config");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const emailExists = await prisma.User.findUnique({
      where: {
        email,
      },
    });

    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.User.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({ Message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to sign up" });
  }
}

async function logIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.User.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "incorrect email or password",
        },
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "incorrect email or password",
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      Message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
}

module.exports = { signUp, logIn };
