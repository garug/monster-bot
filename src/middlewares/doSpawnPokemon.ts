import { Request, Response, NextFunction } from "express"
import spawnPokemon from "../usecases/spawnPokemon.js"
import resolveStatus from "../usecases/resolveStatus.js"

export default async (_req: Request, res: Response) => {
  const lastStatus = res.locals.lastStatus

  await Promise.all([
    resolveStatus(lastStatus.date.getTime().toString()),
    spawnPokemon()
  ])

  return res.status(201).send()
}
