const QRCode = require("qrcode");
const catchAsync = require("./catchAsync");

const genQrCode = catchAsync(async (bookID) => {
  const qrcode = await QRCode.toDataURL(bookID);
  return qrcode;
});

module.exports = genQrCode;
