import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/'); // Directory where files are saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage });

// Use the multer middleware for parsing the multipart form data
export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing for file uploads
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use multer to handle the file upload
  const uploadMiddleware = upload.single('imageSchema'); // Expecting a single file in the 'imageSchema' field

  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    // After the file is uploaded, you can access the file in req.file
    console.log('File uploaded:', req.file); // File metadata

    // Other form fields can be accessed via req.body
    console.log('Form fields:', req.body); // e.g., { username: 'John', description: 'Bio' }

    // Send a response back
    res.status(200).json({ success: true, message: 'File registered successfully!', file: req.file });
  });
}
