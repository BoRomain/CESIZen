import express from "express";
import utilisateur from "./routes/Utilisateur.js";
import information from "./routes/Information.js";
import activiteDetente from "./routes/ActiviteDetente.js";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";
import { errorHandler } from "./middlewares/Errors.js";

const app = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use("/utilisateur", utilisateur);
app.use("/information", information);
app.use("/activiteDetente", activiteDetente);

app.get("/", (req, res) => {
  res.send("CESIZEN actif !");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
