import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

// Set up multer storage in memory
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const uploadMiddleware = upload.single('imageSchema'); // Expect a single file

  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    // Access the file buffer
    const fileBuffer = req.file?.buffer; // File stored in memory as a buffer

    if (fileBuffer) {
      // Convert the buffer to a Base64 string if needed
      const base64String = fileBuffer.toString('base64');

      // Log or process the file
      //console.log('Base64-encoded file:', base64String);
      //console.log('Original filename:', req.file?.originalname);
    }

    // Other form fields are still accessible in req.body
    console.log('Form fields:', req.body);

    // Send a response
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully!',
      filename: req.file?.originalname,
      base64String: req.file?.buffer?.toString('base64'), // Optional: include the Base64 string in response
    });
  });
}
