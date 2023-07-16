import multer, { diskStorage } from 'multer';
import fs from 'fs';

const uploadsDirectory = '../client/public/uploads';

try {
    if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory);
    }
} catch (error) {
    console.error('Error creating uploads directory:', error);
}

const storage = diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, cb) => {
        const uniqueSuffix =
            new Date(Date.now()).toDateString() +
            '---' +
            Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${file.fieldname}-${uniqueSuffix}.${fileExtension}`;
        cb(null, fileName);
    },
});

export const upload = multer({ storage });
