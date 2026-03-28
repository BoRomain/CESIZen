import express from "express";
import utilisateur from "./routes/Utilisateur.js";
import information from "./routes/Information.js";
import activiteDetente from "./routes/ActiviteDetente.js";
import admin from "./routes/Admin.js";
import favori from "./routes/Favori.js";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";
import { errorHandler } from "./middlewares/Errors.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use("/utilisateur", utilisateur);
app.use("/information", information);
app.use("/activiteDetente", activiteDetente);
app.use("/favori", favori);
app.use("/admin", admin);

app.get("/", (req, res) => {
  res.send("CESIZEN actif !");
});

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`CESIZEN API en écoute sur le port ${port}`);
});
