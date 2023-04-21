export type ActivePokemon = {
  name: string,
  form?: string,
  id: number,
  shiny: boolean,
  chance: number,
  stats: {
    name: string,
    value: number
  }[]
}

export type ActiveStatus = {
  date: Date,
  pokemon?: ActivePokemon,
  prev?: ActivePokemon
}
