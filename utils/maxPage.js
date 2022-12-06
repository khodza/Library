const getMaxPage = async function (Model, matchParam, req) {
  const total = await Model.aggregate([
    { $match: matchParam },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0 } },
  ]);
  let maxPage;
  if (total.length === 0) {
    maxPage = 1;
  } else {
    maxPage = total[0].count / req.query.limit;
    if (!Number.isInteger(maxPage)) {
      maxPage = Math.floor(maxPage) + 1;
    }
  }
  return maxPage;
};
module.exports = getMaxPage;
