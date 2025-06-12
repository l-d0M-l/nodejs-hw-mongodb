import path from 'node:path';

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src', 'tmp'));
  },
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now();
    cb(null, `${uniquePreffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
