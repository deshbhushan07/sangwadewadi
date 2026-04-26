#!/bin/bash
# ================================================================
# सांगवडेवाडी Village Website — Deployment Script
# ================================================================
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [dev|build|deploy|setup]
# ================================================================

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

print_banner() {
  echo ""
  echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}${BOLD}║   🏡 सांगवडेवाडी Village Website                ║${NC}"
  echo -e "${GREEN}${BOLD}║   Deployment & Setup Script                      ║${NC}"
  echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_node() {
  if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    echo "   Download: https://nodejs.org"
    exit 1
  fi
  NODE_VER=$(node -v)
  echo -e "${GREEN}✅ Node.js found: ${NODE_VER}${NC}"
}

check_npm() {
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ npm found: $(npm -v)${NC}"
}

check_firebase_cli() {
  if ! command -v firebase &> /dev/null; then
    echo -e "${GOLD}⚠️  Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
  fi
  echo -e "${GREEN}✅ Firebase CLI: $(firebase --version)${NC}"
}

setup_env() {
  echo -e "${GOLD}📝 Setting up environment variables...${NC}"
  if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GOLD}⚠️  .env file created from template.${NC}"
    echo -e "${GOLD}   Please edit .env with your Firebase & Cloudinary credentials!${NC}"
    echo ""
    echo "   Required values:"
    echo "   - REACT_APP_FIREBASE_API_KEY"
    echo "   - REACT_APP_FIREBASE_AUTH_DOMAIN"
    echo "   - REACT_APP_FIREBASE_PROJECT_ID"
    echo "   - REACT_APP_FIREBASE_STORAGE_BUCKET"
    echo "   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
    echo "   - REACT_APP_FIREBASE_APP_ID"
    echo "   - REACT_APP_CLOUDINARY_CLOUD_NAME"
    echo "   - REACT_APP_CLOUDINARY_UPLOAD_PRESET"
    echo ""
    read -p "Press Enter after editing .env to continue..."
  else
    echo -e "${GREEN}✅ .env already exists.${NC}"
  fi
}

install_deps() {
  echo -e "${GOLD}📦 Installing dependencies...${NC}"
  npm install
  echo -e "${GREEN}✅ Dependencies installed.${NC}"
}

dev_server() {
  echo -e "${GREEN}🚀 Starting development server...${NC}"
  echo -e "${GOLD}   Open: http://localhost:3000${NC}"
  npm start
}

build_app() {
  echo -e "${GOLD}🔨 Building production bundle...${NC}"
  npm run build
  echo -e "${GREEN}✅ Build complete! Output in: ./build/${NC}"
}

deploy_firebase() {
  echo -e "${GOLD}☁️  Deploying to Firebase Hosting...${NC}"
  firebase login
  firebase deploy
  echo -e "${GREEN}✅ Deployed successfully!${NC}"
}

deploy_local_preview() {
  echo -e "${GOLD}🔍 Starting local production preview...${NC}"
  if ! command -v serve &> /dev/null; then
    npm install -g serve
  fi
  serve -s build -l 3000
}

# ─── Main ───
print_banner
check_node
check_npm

COMMAND=${1:-"help"}

case "$COMMAND" in
  "setup")
    echo -e "${BOLD}📋 Full Setup${NC}"
    setup_env
    install_deps
    echo ""
    echo -e "${GREEN}${BOLD}✅ Setup complete!${NC}"
    echo -e "${GOLD}Next steps:${NC}"
    echo "  1. Edit .env with your Firebase & Cloudinary credentials"
    echo "  2. Run: ./deploy.sh dev     — to start development server"
    echo "  3. Run: ./deploy.sh build   — to create production build"
    echo "  4. Run: ./deploy.sh deploy  — to deploy to Firebase"
    ;;

  "dev")
    echo -e "${BOLD}🛠️  Development Mode${NC}"
    if [ ! -d "node_modules" ]; then install_deps; fi
    dev_server
    ;;

  "build")
    echo -e "${BOLD}📦 Production Build${NC}"
    if [ ! -d "node_modules" ]; then install_deps; fi
    build_app
    ;;

  "preview")
    echo -e "${BOLD}👁️  Local Preview${NC}"
    if [ ! -d "build" ]; then build_app; fi
    deploy_local_preview
    ;;

  "deploy")
    echo -e "${BOLD}🚀 Full Deploy to Firebase${NC}"
    if [ ! -d "node_modules" ]; then install_deps; fi
    build_app
    check_firebase_cli
    deploy_firebase
    ;;

  "install")
    install_deps
    ;;

  "help"|*)
    echo -e "${BOLD}Available commands:${NC}"
    echo ""
    echo -e "  ${GREEN}./deploy.sh setup${NC}    — First-time setup (env + install)"
    echo -e "  ${GREEN}./deploy.sh dev${NC}      — Start development server"
    echo -e "  ${GREEN}./deploy.sh build${NC}    — Create production build"
    echo -e "  ${GREEN}./deploy.sh preview${NC}  — Preview production build locally"
    echo -e "  ${GREEN}./deploy.sh deploy${NC}   — Build + deploy to Firebase Hosting"
    echo -e "  ${GREEN}./deploy.sh install${NC}  — Install npm dependencies"
    echo ""
    echo -e "${GOLD}Quick Start:${NC}"
    echo "  1. ./deploy.sh setup"
    echo "  2. Edit .env with your credentials"
    echo "  3. ./deploy.sh dev"
    ;;
esac

echo ""
