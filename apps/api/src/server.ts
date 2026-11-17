import "dotenv/config";
import cors from "cors";
import express from "express";
import { healthResponseSchema } from "@botforge/shared";

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json(healthResponseSchema.parse({ status: "ok", service: "api" }));
});

app.get("/api/v1/bots", (_request, response) => {
  response.json({ data: [] });
});

app.listen(port, () => {
  console.log(`BotForge API listening on http://localhost:${port}`);
});
