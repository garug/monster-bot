export type PokemonFilters = {
  user?: string;
  name?: string;
  shiny?: boolean;
}

export type Pageable = {
  page: number;
  size: number;
}

export type Page<T> = {
  content: T[];
  size: number;
  count: number;
  page: number;
}

export type PokemonRepository = {
  find(filters: PokemonFilters, pageable: Pageable): Promise<Page<any>>;
  updateTiers(): Promise<any>;
  uniquePokemon(user?: string): Promise<number>;
}
