import { Request, Response, NextFunction } from "express"

export default async (req: Request, res: Response, next: NextFunction) => {
  const { lastStatus } = res.locals

  const time = lastStatus.date.getTime()
  const test = getTest(time, maxInterval)

  if (!test)
    return res.status(200).send()

  next()
}

const maxInterval = 12 * 60 * 1000;

function getTest(time, interval) {
  const now = new Date().getTime()
  const timeDifference = now - time
  const probability = timeDifference / interval

  return probability > Math.random()
}
