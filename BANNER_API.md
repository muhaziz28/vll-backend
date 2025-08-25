# Banner API Documentation

## Overview
Banner API menyediakan endpoint untuk mengelola banner dengan fitur upload gambar dan CRUD operations.

## Base URL
```
http://localhost:3000/api/v1/banners
```

## Endpoints

### 1. Upload Banner Image
**POST** `/api/v1/banners/upload`

Upload gambar banner ke server.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data dengan field `image` (file gambar)

**Response:**
```json
{
  "imageFile": "image-1234567890-123456789.jpg",
  "imageSize": 1024000,
  "imagePath": "uploads/image-1234567890-123456789.jpg"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/banners/upload \
  -F "image=@/path/to/banner.jpg"
```

### 2. Create Banner
**POST** `/api/v1/banners`

Membuat banner baru.

**Request:**
```json
{
  "bannerTitle": "Banner Promosi",
  "imageFile": "image-1234567890-123456789.jpg",
  "imageSize": 1024000,
  "imagePath": "uploads/image-1234567890-123456789.jpg",
  "isActive": true
}
```

**Response:**
```json
{
  "id": 1,
  "bannerTitle": "Banner Promosi",
  "imageFile": "image-1234567890-123456789.jpg",
  "imageSize": 1024000,
  "imagePath": "uploads/image-1234567890-123456789.jpg",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get All Banners
**GET** `/api/v1/banners`

Mendapatkan semua banner (diurutkan berdasarkan created_at desc).

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "bannerTitle": "Banner Promosi",
      "imageFile": "image-1234567890-123456789.jpg",
      "imageSize": 1024000,
      "imagePath": "uploads/image-1234567890-123456789.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Get Active Banners
**GET** `/api/v1/banners/active`

Mendapatkan hanya banner yang aktif.

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "bannerTitle": "Banner Promosi",
      "imageFile": "image-1234567890-123456789.jpg",
      "imageSize": 1024000,
      "imagePath": "uploads/image-1234567890-123456789.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Get Banner by ID
**GET** `/api/v1/banners/:id`

Mendapatkan banner berdasarkan ID.

**Response:**
```json
{
  "id": 1,
  "bannerTitle": "Banner Promosi",
  "imageFile": "image-1234567890-123456789.jpg",
  "imageSize": 1024000,
  "imagePath": "uploads/image-1234567890-123456789.jpg",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Update Banner
**PUT** `/api/v1/banners/:id`

Mengupdate banner berdasarkan ID.

**Request:**
```json
{
  "bannerTitle": "Banner Promosi Updated",
  "isActive": false
}
```

**Response:**
```json
{
  "id": 1,
  "bannerTitle": "Banner Promosi Updated",
  "imageFile": "image-1234567890-123456789.jpg",
  "imageSize": 1024000,
  "imagePath": "uploads/image-1234567890-123456789.jpg",
  "isActive": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 7. Delete Banner
**DELETE** `/api/v1/banners/:id`

Menghapus banner berdasarkan ID. File gambar juga akan dihapus dari server.

**Response:**
- Status: 204 No Content

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "message": "Banner not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to create banner"
}
```

## File Upload Specifications

- **Supported formats**: Image files only (JPEG, PNG, GIF, etc.)
- **Maximum file size**: 5MB
- **Storage location**: `./public/uploads/`
- **File naming**: `{fieldname}-{timestamp}-{random}.{extension}`
- **Access URL**: `http://localhost:3000/uploads/{filename}`

## Database Schema

```sql
CREATE TABLE banner (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  banner_title TEXT,
  image_file TEXT NOT NULL,
  image_size INTEGER NOT NULL,
  image_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Complete Workflow

1. **Upload image:**
```bash
curl -X POST http://localhost:3000/api/v1/banners/upload \
  -F "image=@banner.jpg"
```

2. **Create banner with uploaded image data:**
```bash
curl -X POST http://localhost:3000/api/v1/banners \
  -H "Content-Type: application/json" \
  -d '{
    "bannerTitle": "Promo Banner",
    "imageFile": "image-1234567890-123456789.jpg",
    "imageSize": 1024000,
    "imagePath": "uploads/image-1234567890-123456789.jpg",
    "isActive": true
  }'
```

3. **Get all banners:**
```bash
curl http://localhost:3000/api/v1/banners
```

4. **Update banner:**
```bash
curl -X PUT http://localhost:3000/api/v1/banners/1 \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

5. **Delete banner:**
```bash
curl -X DELETE http://localhost:3000/api/v1/banners/1
```