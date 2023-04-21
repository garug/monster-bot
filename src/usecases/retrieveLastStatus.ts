import { ActiveStatus } from "types/activeStatus.js"

let lastPokemon: ActiveStatus = {
  date: new Date(),
  pokemon: undefined,
  prev: undefined
}

export default async (): Promise<ActiveStatus> => {
  // TODO
  return lastPokemon
}
