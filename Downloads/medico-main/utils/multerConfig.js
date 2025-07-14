// middleware/upload.js
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const BASE_DIR = path.join(__dirname, '..', 'uploads');

/**
 * Ensure a directory exists, or create it
 */
function ensureDir(dir) {
  try {
    console.log(`ensureDir: checking directory ${dir}`);
    if (!fs.existsSync(dir)) {
      console.log(`ensureDir: directory not found, creating ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(`ensureDir: created directory ${dir}`);
    } else {
      console.log(`ensureDir: directory already exists ${dir}`);
    }
  } catch (err) {
    console.error(`ensureDir error for ${dir}:`, err);
    throw err;
  }
}

/**
 * Factory to create a multer instance for a given subfolder
 */
function createUploader(subfolder) {
  const uploadPath = path.join(BASE_DIR, subfolder);
  try {
    ensureDir(uploadPath);
  } catch (err) {
    console.error(`createUploader: failed to ensureDir for ${uploadPath}:`, err);
    throw err;
  }

  let storage;
  try {
    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          console.log(`storage.destination: saving file to ${uploadPath}`);
          cb(null, uploadPath);
        } catch (err) {
          console.error('storage.destination error:', err);
          cb(err);
        }
      },
      filename: (req, file, cb) => {
        try {
          const ext = path.extname(file.originalname).toLowerCase();
          const filename = `${Date.now()}${ext}`;
          console.log(`storage.filename: naming file ${filename}`);
          cb(null, filename);
        } catch (err) {
          console.error('storage.filename error:', err);
          cb(err);
        }
      }
    });
  } catch (err) {
    console.error('createUploader: multer.diskStorage config error:', err);
    throw err;
  }

  // Configure multer
  const uploader = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      try {
        const allowed = /\.(jpe?g|png|webp)$/i;
        if (!allowed.test(file.originalname)) {
          const error = new Error('Only JPG, PNG or WEBP images are allowed');
          console.error(`fileFilter: rejecting file ${file.originalname}`);
          return cb(error, false);
        }
        console.log(`fileFilter: accepting file ${file.originalname}`);
        cb(null, true);
      } catch (err) {
        console.error('fileFilter error:', err);
        cb(err);
      }
    }
  });

  return uploader;
}

module.exports = {
  uploadBlog:     createUploader('blog'),
  uploadCarousel: createUploader('carousel'),
  uploadGallery:  createUploader('gallery'),
};
