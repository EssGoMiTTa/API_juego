const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.execute("SELECT * FROM players WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      token, 
      id: user.id, 
      username: user.username, 
      message: "Inicio de sesión exitoso" 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = { router, authenticate };
