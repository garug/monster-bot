import { Request, Response, NextFunction } from "express"

export default (req: Request, res: Response, next: NextFunction) => {
  const { key } = req.query;

  if (key !== process.env.CALLABLE_POKEMON)
    return res.status(401).send();

  next()
}
