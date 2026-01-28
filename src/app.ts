import express from "express";
import utilisateur from "./routes/Utilisateur.js";
import information from "./routes/Information.js";
import activiteDetente from "./routes/ActiviteDetente.js";

const app = express();
const port: number = 3000;

app.use("/utilisateur", utilisateur);
app.use("/information", information);
app.use("/activiteDetente", activiteDetente);

app.get("/", (req, res) => {
  res.send("CESIZEN actif !");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
