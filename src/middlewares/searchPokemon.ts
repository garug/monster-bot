import ownedpokemon from "../infra/mongodb/adapters/ownedpokemon.js";

export default async (req, res) => {
  const { limit, user, name, page, shiny } = req.query as any;

  let usedLimit = parseInt(limit);

  if (page && !limit) {
    usedLimit = 10;
  }

  // TODO sanitizar filtros e paginação antes de passar ao repository
  const pageResult = await ownedpokemon.find({
    user,
    name,
    shiny: shiny === "true"
  }, {
    size: usedLimit,
    page: Number(page) > 0 ? Number(page) : 1
  });

  return res.set({
    'Pagination-Size': usedLimit,
    'Pagination-Page': page,
    'Pagination-Count': pageResult.count,
  }).json(pageResult.content)
}
