import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

// Set up multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // Define where to store the files
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Define the filename
    },
  }),
});

// Disabling body parsing for multer
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to save the image path
const saveImage = (file) => {
  return `/uploads/${file.originalname}`;
};

// API handler function
export default async function handler(req, res) {
  const uploadMiddleware = upload.single('image'); // Expecting a single file with the field name 'image'

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
      const orderData = JSON.parse(req.body.orderData);
      let imageUrl = '';

      if (req.file) {
        // File was uploaded
        imageUrl = saveImage(req.file);
      }

      // Add order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        imageUrl,
      });

      res.status(200).json({ id: orderRef.id });
    } catch (error) {
      console.error('Error adding order to Firestore:', error);
      res.status(500).json({ error: 'Failed to add order' });
    }
  });
}
