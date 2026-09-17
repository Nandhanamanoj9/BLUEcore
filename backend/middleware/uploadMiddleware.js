import multer from 'multer';
import path from 'path';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../utils/constants.js';

// Use memoryStorage so file buffer can be uploaded to Firebase Storage
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, WEBP images and PDF documents are permitted.'
      ),
      false
    );
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});

// Middleware wrapper that gracefully formats Multer errors
export function handleUpload(fieldName) {
  const multerUpload = upload.single(fieldName);

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'File too large. Maximum allowed file size is 10 MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
}

// Middleware wrapper that accepts any of the specified field names in a SINGLE pass
export function handleFlexibleUpload(fieldNames = ['ffile', 'referenceFile', 'file']) {
  const multerAny = upload.any();

  return (req, res, next) => {
    multerAny(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'File too large. Maximum allowed file size is 10 MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // If a file was uploaded under any recognized field name, map it to req.file
      if (req.files && req.files.length > 0) {
        const matched = req.files.find((f) => fieldNames.includes(f.fieldname)) || req.files[0];
        req.file = matched;
      }

      next();
    });
  };
}

export default {
  upload,
  handleUpload,
  handleFlexibleUpload
};
