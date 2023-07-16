import { Router } from 'express';
import { Register, Login, logout } from '../Controllers/AuthController.js';
import { upload } from '../Controllers/ImgUploadCntrollres.js';

const route = Router();

// Define  the routes
route.post('/auth/login', Login);
route.post('/auth/register', upload.single('profileImg'), Register);
route.post('/auth/logout', logout);

export default route;
