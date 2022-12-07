const QRCode = require("qrcode");

const genQrCode = async (bookID) => {
  try {
    const qrcode = await QRCode.toDataURL(bookID);
    return qrcode;
  } catch (err) {
    console.log(err);
  }
};

module.exports = genQrCode;
