import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swaggerConfig";
import authRoutes from "./routes/authRoutes";
import gmailRoutes from "./routes/gmailRoutes";
import calendarRoutes from "./routes/calendarRoutes";
import configureDI from "./config/container";
import configureRouter from "./config/configure-router";
dotenv.config();
const diContainer = configureDI();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

configureRouter(app, diContainer);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL d'authentification: http://localhost:${PORT}/auth/google`);
});

export default app;
