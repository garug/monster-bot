import { Request, Response, NextFunction } from "express"
import spawnPokemon from "../usecases/spawnPokemon.js"

export default async (_req: Request, res: Response) => {
  const lastStatus = res.locals.lastStatus

  await Promise.all([
    spawnPokemon()
  ])

  return res.status(201).send()
}
