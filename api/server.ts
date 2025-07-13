import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swaggerConfig";
import authRoutes from "./routes/authRoutes";
import gmailRoutes from "./routes/gmailRoutes";
import calendarRoutes from "./routes/calendarRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Mount routers
app.use("/auth", authRoutes);
app.use("/api/gmail", gmailRoutes);
app.use("/api/calendar", calendarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL d'authentification: http://localhost:${PORT}/auth/google`);
});

export default app;
