import express from 'express';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
    if (req.file) {
        // Return the URL path
        const filePath = `/uploads/${req.file.filename}`;
        res.send(filePath);
    } else {
        res.status(400).send('No file uploaded');
    }
});

export default router;
