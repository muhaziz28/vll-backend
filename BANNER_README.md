# Banner Feature Implementation

## Overview
Fitur CRUD banner telah berhasil ditambahkan ke project Express TypeScript. Fitur ini memungkinkan pengguna untuk mengelola banner dengan upload gambar dan operasi CRUD lengkap.

## Fitur yang Ditambahkan

### 1. Database Schema
- Model `Banner` dengan field sesuai requirement
- Auto-increment ID
- Timestamp fields (created_at, updated_at)
- Boolean flag untuk status aktif

### 2. API Endpoints
- `GET /api/v1/banners` - Mendapatkan semua banner
- `GET /api/v1/banners/active` - Mendapatkan banner aktif saja
- `GET /api/v1/banners/:id` - Mendapatkan banner berdasarkan ID
- `POST /api/v1/banners` - Membuat banner baru
- `PUT /api/v1/banners/:id` - Mengupdate banner
- `DELETE /api/v1/banners/:id` - Menghapus banner
- `POST /api/v1/banners/upload` - Upload gambar banner

### 3. File Upload
- Menggunakan Multer untuk handling file upload
- Validasi tipe file (hanya gambar)
- Limit ukuran file (5MB)
- Penyimpanan di `./public/uploads/`
- Static file serving di `/uploads/`

### 4. File Structure
```
src/modules/banner/
├── banner.controller.ts  # Controller dengan logic CRUD
├── banner.service.ts     # Service layer untuk database operations
├── banner.types.ts       # Zod schemas untuk validation
└── banner.route.ts       # Route definitions

public/
└── uploads/              # Directory untuk menyimpan file upload
```

## Cara Penggunaan

### 1. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migration (sudah dilakukan)
npm run prisma:migrate
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test API
```bash
# Jalankan test script
./test_banner_api.sh

# Atau test manual dengan curl
curl http://localhost:3000/api/v1/banners
```

## Workflow Lengkap

### 1. Upload Gambar
```bash
curl -X POST http://localhost:3000/api/v1/banners/upload \
  -F "image=@/path/to/banner.jpg"
```

### 2. Create Banner
```bash
curl -X POST http://localhost:3000/api/v1/banners \
  -H "Content-Type: application/json" \
  -d '{
    "bannerTitle": "Banner Promosi",
    "imageFile": "image-1234567890-123456789.jpg",
    "imageSize": 1024000,
    "imagePath": "uploads/image-1234567890-123456789.jpg",
    "isActive": true
  }'
```

### 3. Get Banners
```bash
# Get all banners
curl http://localhost:3000/api/v1/banners

# Get active banners only
curl http://localhost:3000/api/v1/banners/active
```

### 4. Update Banner
```bash
curl -X PUT http://localhost:3000/api/v1/banners/1 \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

### 5. Delete Banner
```bash
curl -X DELETE http://localhost:3000/api/v1/banners/1
```

## Dependencies yang Ditambahkan

- `multer` - File upload middleware
- `@types/multer` - TypeScript types untuk multer

## Konfigurasi

### File Upload Settings
- **Max file size**: 5MB
- **Allowed formats**: Image files only
- **Storage location**: `./public/uploads/`
- **File naming**: `{fieldname}-{timestamp}-{random}.{extension}`

### Database Configuration
- **Provider**: SQLite
- **Database file**: `./prisma/dev.db`
- **Auto-increment ID**: Yes
- **Timestamps**: Automatic

## Error Handling

- Validasi input menggunakan Zod
- File upload validation
- Database error handling
- Proper HTTP status codes
- Descriptive error messages

## Security Features

- File type validation
- File size limits
- Secure file naming
- Input sanitization
- Error message sanitization

## Testing

File `test_banner_api.sh` tersedia untuk testing lengkap semua endpoint:
- Create, Read, Update, Delete operations
- Active banner filtering
- Error handling
- File upload (manual testing required)

## Next Steps

Untuk pengembangan lebih lanjut, pertimbangkan:
1. Authentication & Authorization
2. Image resizing/compression
3. Multiple image formats support
4. CDN integration
5. Image optimization
6. Bulk operations
7. Search and filtering
8. Pagination

## Troubleshooting

### Common Issues

1. **Database not found**: Pastikan file `.env` ada dengan `DATABASE_URL`
2. **Upload directory not found**: Pastikan `./public/uploads/` sudah dibuat
3. **Permission denied**: Pastikan folder uploads memiliki permission write
4. **File too large**: Pastikan file < 5MB

### Debug Commands

```bash
# Check database
npx prisma studio

# Check logs
npm run dev

# Test specific endpoint
curl -v http://localhost:3000/api/v1/banners
```