const QRCode = require("qrcode");

const catchAsync = require("./catchAsync");

exports.genQr = catchAsync(async (jsonObj) => {
  const strObj = JSON.stringify(jsonObj);
  const qrcode = await QRCode.toDataURL(strObj);
  return qrcode;
});
