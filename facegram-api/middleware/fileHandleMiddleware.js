const multer = require("multer");

const storage = multer.memoryStorage();

const fileHandleMiddleware = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check the extension
  const extname = filetypes.test(file.mimetype);
  // Check the mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

// Export the fileHandleMiddleware
module.exports = fileHandleMiddleware;
