#!/bin/bash

# QuickFleet Mobile Chatbot - Setup Verification Script
# This script checks if everything is properly configured

echo "🔍 QuickFleet Mobile Chatbot - Setup Verification"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Check 1: Node modules installed
echo -n "✓ Checking node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}MISSING${NC}"
    ((CHECKS_FAILED++))
fi

# Check 2: Chatbot component exists
echo -n "✓ Checking Chatbot.tsx... "
if [ -f "components/Chatbot.tsx" ]; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}MISSING${NC}"
    ((CHECKS_FAILED++))
fi

# Check 3: Layout file exists
echo -n "✓ Checking app/_layout.tsx... "
if [ -f "app/_layout.tsx" ]; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}MISSING${NC}"
    ((CHECKS_FAILED++))
fi

# Check 4: Chatbot imported in layout
echo -n "✓ Checking Chatbot import in layout... "
if grep -q "import.*Chatbot.*from.*@/components/Chatbot" app/_layout.tsx; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}NOT FOUND${NC}"
    ((CHECKS_FAILED++))
fi

# Check 5: Chatbot rendered in layout
echo -n "✓ Checking Chatbot rendered... "
if grep -q "<Chatbot />" app/_layout.tsx; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}NOT RENDERED${NC}"
    ((CHECKS_FAILED++))
fi

# Check 6: .env file exists
echo -n "✓ Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
    
    # Check 6.5: EXPO_PUBLIC_API_URL configured
    echo -n "  - Checking EXPO_PUBLIC_API_URL... "
    if grep -q "EXPO_PUBLIC_API_URL" .env; then
        API_URL=$(grep "EXPO_PUBLIC_API_URL" .env | cut -d'=' -f2)
        echo -e "${GREEN}Set to: $API_URL${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}NOT SET (optional)${NC}"
    fi
else
    echo -e "${YELLOW}NOT FOUND (create one if needed)${NC}"
fi

# Check 7: TypeScript config
echo -n "✓ Checking tsconfig.json... "
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}OK${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}MISSING${NC}"
    ((CHECKS_FAILED++))
fi

# Check 8: No .expo cache (should be clean)
echo -n "✓ Checking for stale caches... "
CACHE_COUNT=0
[ -d ".expo" ] && ((CACHE_COUNT++))
[ -f ".tsbuildinfo" ] && ((CACHE_COUNT++))
[ -d "node_modules/.cache" ] && ((CACHE_COUNT++))

if [ $CACHE_COUNT -eq 0 ]; then
    echo -e "${GREEN}Clean${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}Found $CACHE_COUNT cache(s) - consider clearing with: npm run dev -- --clear${NC}"
fi

echo ""
echo "=================================================="
echo -e "✓ Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "✗ Checks Failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Everything looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run dev"
    echo "2. Open http://localhost:8081 (web) or scan QR code (mobile)"
    echo "3. Look for 💬 Chat button in bottom-right"
    echo ""
    echo "For troubleshooting, see TROUBLESHOOTING.md"
    exit 0
else
    echo -e "${RED}✗ Some issues found. Please fix them above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Run: npm install"
    echo "- Run: npm run dev -- --clear"
    echo "- Check SETUP.md for detailed instructions"
    exit 1
fi
