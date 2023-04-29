import { Request, Response, NextFunction } from "express"
import { ActiveStatus } from "../types/activeStatus.js"
import fleePokemon from "../usecases/fleePokemon.js"

export default async (_req: Request, res: Response, next: NextFunction) => {
  const lastStatus: ActiveStatus = res.locals.lastStatus

  if (lastStatus.pokemon) {
    await Promise.all([
      fleePokemon(lastStatus.pokemon.name),
    ])

    return res.status(202).send()
  }

  next()
}
