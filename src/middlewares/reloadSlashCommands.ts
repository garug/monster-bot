import { Request, Response } from "express"
import { deployCommands } from "infra/discord/config_commands.js"

export default async (_req: Request, res: Response) => {
  await deployCommands()

  return res.status(200).send()
}
