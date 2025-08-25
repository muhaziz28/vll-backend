import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { 
  listBanners, 
  getBanner, 
  createBanner, 
  updateBanner, 
  deleteBanner,
  getActiveBanners,
  uploadBannerImage
} from './banner.controller';

export const bannerRouter = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Banner CRUD routes
bannerRouter.get('/', listBanners);
bannerRouter.get('/active', getActiveBanners);
bannerRouter.get('/:id', getBanner);
bannerRouter.post('/', createBanner);
bannerRouter.put('/:id', updateBanner);
bannerRouter.delete('/:id', deleteBanner);

// File upload route
bannerRouter.post('/upload', upload.single('image'), uploadBannerImage);