const getMaxPage = async function (Model,matchParam, req) {
  const total = await Model.countDocuments(matchParam)
  let maxPage;
  if (total === 0) {
    maxPage = 1;
  } else {
    maxPage = total/ req.query.limit;
    if (!Number.isInteger(maxPage)) {
      maxPage = Math.floor(maxPage) + 1;
    }
  }
  return maxPage;
};
module.exports = getMaxPage;
