const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { authenticate } = require("./authRoutes");

const router = express.Router();

// Crear un jugador (C)
router.post("/", async (req, res) => {
  const { first_name, last_name, email, phone, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.execute(
      "INSERT INTO players (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, username, hashedPassword]
    );
    res.json({ id: result.insertId, message: "Jugador creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los jugadores (R) - Protegido
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM players");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un jugador (U) - Protegido
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, username } = req.body;
  try {
    await pool.execute(
      "UPDATE players SET first_name=?, last_name=?, email=?, phone=?, username=? WHERE id=?",
      [first_name, last_name, email, phone, username, id]
    );
    res.json({ message: "Jugador actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un jugador (D) - Protegido
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM players WHERE id=?", [id]);
    res.json({ message: "Jugador eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un jugador por su ID (R) - Protegido
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM players WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
