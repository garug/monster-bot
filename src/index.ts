import "dotenv/config"
import express from "express";
import { routes } from "./routes.js";

const app = express()

const port = process.env.PORT || 8081

export const server = app
  .use(routes)
  .listen(port, () => console.log(`Server online on port ${port}`))
