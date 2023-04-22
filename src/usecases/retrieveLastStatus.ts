import activeStatus from "infra/dynamodb/adapters/activeStatus.js"
import { ActiveStatus } from "types/activeStatus.js"

export default async (): Promise<ActiveStatus> => {
  return activeStatus.getLast()
}
