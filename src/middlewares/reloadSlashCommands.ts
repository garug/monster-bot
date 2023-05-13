import { Request, Response } from "express"
import reloadSlashCommands from "../usecases/reloadSlashCommands.js"

export default async (_req: Request, res: Response) => {
  await reloadSlashCommands()

  return res.status(200).send()
}
