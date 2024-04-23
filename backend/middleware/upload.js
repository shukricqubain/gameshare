const util = require("util");
const multer = require("multer");
const maxSize = 20000000;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let assetLocation = req.params.assetLocation;
    let destination = `../frontend/src/assets/${assetLocation}`;
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single("imageFile");
module.exports = upload;
