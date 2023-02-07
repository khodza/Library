const XLSX = require("xlsx");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Features = require("../utils/features");
const User = require("../modules/usersModule");
const Book = require("../modules/bookModule");
const getMaxPage = require("../utils/maxPage");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model, matchParam) =>
  catchAsync(async (req, res, next) => {
    let matchings =matchParam;
    const features = new Features(Model.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();

    let queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    if (Object.keys(queryObj).length !== 0) {
       matchings = { ...matchParam, ...queryObj };
    }
    const doc = await features.query;
    const maxPage = await getMaxPage(Model, matchings, req);

    res.status(200).json({
      status: "success",
      maxPage,
      result: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //TODO
    // Should add popOptions for comments ,products, reviews
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError("Bu ID lik dakument topilmadi!", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Book && req.body.codes) {
      return next(
        new AppError(
          `Kitobning serialarini o'zgartirish uchun boshqa route dan foidalaning!`,
          400
        )
      );
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (Model === User && req.body.password) {
      doc.password = req.body.password;
      doc.passwordConfirm = req.body.passwordConfirm;
      await doc.save({ validateBeforeSave: false });
      doc.password = undefined;
    }

    if (!doc) {
      return next(new AppError("Bu ID lik dakument topilmadi!!", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Bu ID lik dakument topilmadi!"));
    }
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  });

exports.downloadExcel = (Model, fileName, matchOpt, sortOpt) =>
  catchAsync(async (req, res, next) => {
    const wb = XLSX.utils.book_new(); //new workbook
    const data = await Model.aggregate([
      { $match: matchOpt },
      { $sort: sortOpt },
      { $project: { _id: 0, id: 0, __v: 0, slug: 0, active: 0 } },
    ]);
    let temp = JSON.stringify(data);
    temp = JSON.parse(temp);
    const ws = XLSX.utils.json_to_sheet(temp);
    const down = path.join(__dirname, `../data/exel-docs/${fileName}`);
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    XLSX.writeFile(wb, down);
    res.download(down);
  });

exports.searchDoc = (Model, matchParam = {
  _id: { $exists: true }}) =>
  catchAsync(async (req, res, next) => {
    const payload = req.body.payload.trim();
    let search = await Model.find({
      ...matchParam,
      // name: { $regex: new RegExp(`^${payload}.*`, "i") },
      studentName:  { $regex: payload, $options: 'i' } ,
      name:  { $regex: payload, $options: 'i' } ,
    }).setOptions({ route: 'disable-active' });
    search = search.slice(0, 10);
    res.status(200).json({
      status: "success",
      data: search,
    });
  });
