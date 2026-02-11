import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-';
    cb(null, uniquePrefix + file.originalname); // Avoid file collision
  }
});

export const upload = multer({ storage });