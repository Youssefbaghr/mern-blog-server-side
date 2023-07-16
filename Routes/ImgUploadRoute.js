import { Router } from 'express';
import { upload } from '../Controllers/ImgUploadCntrollres.js';

const route = Router();

route.post('/upload', upload.single('picture'), (req, res) => {
    const imageUrl = req.file.filename;
    res.json({ imageUrl });
});

export default route;
