#!/bin/bash

# Test script untuk Banner API
BASE_URL="http://localhost:3000/api/v1/banners"

echo "=== Testing Banner API ==="

# Test 1: Get all banners (should be empty initially)
echo "1. Getting all banners..."
curl -s "$BASE_URL" | jq '.'

# Test 2: Create a banner (without image upload for now)
echo -e "\n2. Creating a banner..."
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "bannerTitle": "Test Banner",
    "imageFile": "test-image.jpg",
    "imageSize": 1024000,
    "imagePath": "uploads/test-image.jpg",
    "isActive": true
  }' | jq '.'

# Test 3: Get all banners again
echo -e "\n3. Getting all banners after creation..."
curl -s "$BASE_URL" | jq '.'

# Test 4: Get active banners
echo -e "\n4. Getting active banners..."
curl -s "$BASE_URL/active" | jq '.'

# Test 5: Get banner by ID
echo -e "\n5. Getting banner by ID (1)..."
curl -s "$BASE_URL/1" | jq '.'

# Test 6: Update banner
echo -e "\n6. Updating banner..."
curl -s -X PUT "$BASE_URL/1" \
  -H "Content-Type: application/json" \
  -d '{
    "bannerTitle": "Updated Test Banner",
    "isActive": false
  }' | jq '.'

# Test 7: Get updated banner
echo -e "\n7. Getting updated banner..."
curl -s "$BASE_URL/1" | jq '.'

# Test 8: Get active banners (should be empty now)
echo -e "\n8. Getting active banners (should be empty)..."
curl -s "$BASE_URL/active" | jq '.'

# Test 9: Delete banner
echo -e "\n9. Deleting banner..."
curl -s -X DELETE "$BASE_URL/1"

# Test 10: Get all banners (should be empty again)
echo -e "\n10. Getting all banners after deletion..."
curl -s "$BASE_URL" | jq '.'

echo -e "\n=== Banner API Test Complete ==="