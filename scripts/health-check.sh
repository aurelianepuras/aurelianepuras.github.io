#!/bin/bash

# Basic Health Check Script
# Usage: ./scripts/health-check.sh [URL]

SITE_URL="${1:-https://aurelianepuras.github.io}"
EXIT_CODE=0

echo "🔍 Health Check for: $SITE_URL"
echo "=================================="

# Check main page
echo -n "Checking main page... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ OK (HTTP $HTTP_CODE)"
else
  echo "❌ FAILED (HTTP $HTTP_CODE)"
  EXIT_CODE=1
fi

# Check robots.txt
echo -n "Checking robots.txt... "
ROBOTS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/robots.txt" 2>/dev/null || echo "000")
if [ "$ROBOTS_CODE" = "200" ]; then
  echo "✅ OK (HTTP $ROBOTS_CODE)"
else
  echo "⚠️  WARNING (HTTP $ROBOTS_CODE)"
fi

# Check sitemap
echo -n "Checking sitemap... "
SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/sitemap-index.xml" 2>/dev/null || echo "000")
if [ "$SITEMAP_CODE" = "200" ]; then
  echo "✅ OK (HTTP $SITEMAP_CODE)"
else
  echo "⚠️  WARNING (HTTP $SITEMAP_CODE)"
fi

# Check favicon
echo -n "Checking favicon... "
FAVICON_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/favicon.svg" 2>/dev/null || echo "000")
if [ "$FAVICON_CODE" = "200" ]; then
  echo "✅ OK (HTTP $FAVICON_CODE)"
else
  echo "⚠️  WARNING (HTTP $FAVICON_CODE)"
fi

# Check response time
echo -n "Checking response time... "
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL" 2>/dev/null || echo "999")
if (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
  echo "✅ OK (${RESPONSE_TIME}s)"
else
  echo "⚠️  SLOW (${RESPONSE_TIME}s)"
fi

echo "=================================="
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Health check PASSED"
else
  echo "❌ Health check FAILED"
fi

exit $EXIT_CODE
