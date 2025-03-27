const express = require("express");
const cors = require("cors");
require("dotenv").config();

const playerRoutes = require("./routes/playerRoutes");
const gameProgressRoutes = require("./routes/gameProgressRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes.router);
app.use("/players", playerRoutes);
app.use("/game_progress", gameProgressRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
