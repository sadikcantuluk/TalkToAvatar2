#!/bin/bash
# API Endpoint Test Script
# Usage: ./test_api_endpoints.sh <base_url> <token>
# Example: ./test_api_endpoints.sh http://localhost:3000 "your_jwt_token"

BASE_URL="${1:-http://localhost:3000}"
TOKEN="${2}"

if [ -z "$TOKEN" ]; then
    echo "Error: Token is required"
    echo "Usage: ./test_api_endpoints.sh <base_url> <token>"
    exit 1
fi

echo "=========================================="
echo "API Endpoint Test Script"
echo "Base URL: $BASE_URL"
echo "=========================================="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗${NC} (HTTP $http_code)"
        echo "$body"
    fi
    echo
}

# Test User endpoints
echo "=== User Endpoints ==="
test_endpoint "GET" "/api/v1/users" "" "GET /api/v1/users"
test_endpoint "GET" "/api/v1/users/$(curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/v1/users | jq -r '.[0].id')" "" "GET /api/v1/users/:id"
test_endpoint "GET" "/api/v1/users/$(curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/v1/users | jq -r '.[0].id')/courses" "" "GET /api/v1/users/:id/courses"

# Test Course endpoints
echo "=== Course Endpoints ==="
COURSE_DATA='{"course":{"title":"Test Course","description":"Test Description","language_code":"en","level":"A1","status":"active"}}'
test_endpoint "POST" "/api/v1/courses" "$COURSE_DATA" "POST /api/v1/courses"

COURSE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$COURSE_DATA" "$BASE_URL/api/v1/courses" | jq -r '.course.id')

if [ "$COURSE_ID" != "null" ] && [ -n "$COURSE_ID" ]; then
    test_endpoint "GET" "/api/v1/courses" "" "GET /api/v1/courses"
    test_endpoint "GET" "/api/v1/courses/$COURSE_ID" "" "GET /api/v1/courses/:id"
    test_endpoint "GET" "/api/v1/courses/$COURSE_ID/subjects" "" "GET /api/v1/courses/:id/subjects"
    test_endpoint "GET" "/api/v1/courses/$COURSE_ID/videos" "" "GET /api/v1/courses/:id/videos"
    test_endpoint "GET" "/api/v1/courses/$COURSE_ID/reports" "" "GET /api/v1/courses/:id/reports"
    test_endpoint "GET" "/api/v1/courses/$COURSE_ID/analyses" "" "GET /api/v1/courses/:id/analyses"
    
    UPDATE_DATA='{"course":{"title":"Updated Course Title"}}'
    test_endpoint "PUT" "/api/v1/courses/$COURSE_ID" "$UPDATE_DATA" "PUT /api/v1/courses/:id"
    
    # Test Subject
    echo "=== Subject Endpoints ==="
    SUBJECT_DATA="{\"subject\":{\"course_id\":\"$COURSE_ID\",\"title\":\"Test Subject\",\"description\":\"Test Description\",\"order\":1}}"
    test_endpoint "POST" "/api/v1/subjects" "$SUBJECT_DATA" "POST /api/v1/subjects"
    
    # Test Report
    echo "=== Report Endpoints ==="
    REPORT_DATA="{\"report\":{\"course_id\":\"$COURSE_ID\",\"title\":\"Test Report\",\"content\":\"Test Content\",\"report_type\":\"progress\"}}"
    test_endpoint "POST" "/api/v1/reports" "$REPORT_DATA" "POST /api/v1/reports"
    
    # Test Analysis
    echo "=== Analysis Endpoints ==="
    ANALYSIS_DATA="{\"analysis\":{\"course_id\":\"$COURSE_ID\",\"analysis_type\":\"performance\",\"data\":{\"score\":85},\"summary\":\"Test Summary\"}}"
    test_endpoint "POST" "/api/v1/analyses" "$ANALYSIS_DATA" "POST /api/v1/analyses"
    
    # Cleanup
    test_endpoint "DELETE" "/api/v1/courses/$COURSE_ID" "" "DELETE /api/v1/courses/:id (cleanup)"
else
    echo -e "${YELLOW}Warning: Could not create course, skipping dependent tests${NC}"
fi

echo "=========================================="
echo "Test completed!"
echo "=========================================="

