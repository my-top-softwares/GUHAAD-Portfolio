import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder-ka image lagu kaydinayo
  },
  filename: function (req, file, cb) {
    // samee unique filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter (optional) - accept only images
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|html|htm|mp4|mov|avi|wmv|mp3|wav|ogg|mpeg/;
  const allowedMimetypes = /image\/|application\/pdf|text\/html|video\/|audio\//;

  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimetypeValid = allowedMimetypes.test(file.mimetype);

  if (isExtensionValid || isMimetypeValid) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Allowed: images, videos, audio, HTML, and PDF."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // max 50MB
});

export default upload;