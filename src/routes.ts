import cors from "cors"
import { json, Router } from "express"
import canInvoke from "./middlewares/canInvoke.js"
import doSpawnPokemon from "./middlewares/doSpawnPokemon.js"
import setLastStatus from "./middlewares/setLastStatus.js"
import testAction from "./middlewares/testAction.js"
import testActivePokemon from "./middlewares/testActivePokemon.js"
import reloadSlashCommands from "./middlewares/reloadSlashCommands.js"
import searchPokemon from "./middlewares/searchPokemon.js"

export const routes = Router()

const corsOptions = {
  origin: process.env.FRONTEND_URL
}

routes.use(cors(corsOptions))

routes.use(json())
routes.use("/health", (_req, res) => res.send("ok"))
routes.use("/interactions/reload", reloadSlashCommands)
routes.use("/call", [canInvoke, setLastStatus, testAction, testActivePokemon], doSpawnPokemon)
routes.use("/pokemon", searchPokemon)
