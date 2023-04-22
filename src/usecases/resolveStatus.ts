import { resolveStatus } from "../infra/dynamodb/adapters/activeStatus.js"

export default async (id: string) => {
  return resolveStatus(id)
}
