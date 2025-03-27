const express = require("express");
const pool = require("../db");
const { authenticate } = require("./authRoutes");

const router = express.Router();

// Crear progreso de juego (C) - Protegido
router.post("/", authenticate, async (req, res) => {
  const { player_id, score, lives, time, levels, crystals } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO game_progress (player_id, score, lives, time, levels, crystals) VALUES (?, ?, ?, ?, ?, ?)",
      [player_id, score, lives, time, levels, crystals]
    );
    res.json({ id: result.insertId, message: "Progreso creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener progreso de todos los jugadores (R) - Protegido
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM game_progress");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar progreso de un jugador (U) - Protegido
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { score, lives, time, levels, crystals } = req.body;
  try {
    await pool.execute(
      "UPDATE game_progress SET score=?, lives=?, time=?, levels=?, crystals=?, last_update=NOW() WHERE player_id=?",
      [score, lives, time, levels, crystals, id]
    );
    res.json({ message: "Progreso actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar progreso de un jugador (D) - Protegido
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM game_progress WHERE id=?", [id]);
    res.json({ message: "Progreso eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener progreso de un jugador por su ID (R) - Protegido
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM game_progress WHERE player_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Progreso no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
