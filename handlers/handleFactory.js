const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Features =require('../utils/features')
const User = require('../modules/usersModule');


exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
  
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const features =new Features(Model.find(),req.query).filter().sort().limitField().paginate()
  
    const doc  = await features.query;
  
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
         doc,
      },
    });
  });


  exports.getOne = (Model) => catchAsync(async (req, res, next) => {
    //TODO
    // Should add popOptions for comments ,products, reviews
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('Document with given ID not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

  exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
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
      return next(new AppError('Document with given ID not found!', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

  exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Document with given ID not found'));
    }
    res.status(204).json({
      status: 'deleted',
      data: null,
    });
  });
  