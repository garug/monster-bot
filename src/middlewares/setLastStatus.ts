import { Request, Response, NextFunction } from "express"
import lastStatus from "../usecases/retrieveLastStatus.js"

export default async (req: Request, res: Response, next: NextFunction) => {
  res.locals.lastStatus = await lastStatus()

  next()
}
