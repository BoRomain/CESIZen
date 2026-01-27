import express from "express";
import utilisateur from "./routes/Utilisateur.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

const app = express();
const port: number = 3000;

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/utilisateur", utilisateur);

app.get("/", (req, res) => {
  res.send("CESIZEN actif !");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
