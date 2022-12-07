const QRCode = require("qrcode");

const genQrCode = async (bookID) => {
  try {
    const qrcode = await QRCode.toDataURL(bookID);
    return qrcode;
  } catch (err) {
    console.log(err);
    throw new Error("QR-code generatysa qilinmadi");
  }
};

module.exports = genQrCode;
