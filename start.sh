#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================="
echo "  Udyog Setu — Quick Launch"
echo "=========================================="

# Check for node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not found in PATH."
    echo "Please install Node.js 18+ or ensure it is in your PATH."
    exit 1
fi

npm start
