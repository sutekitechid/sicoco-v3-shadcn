#!/usr/bin/env sh
# This script ensures all Husky hooks have correct permissions
# Run automatically during pnpm install via "prepare" script

echo "🔧 Setting up Husky hooks..."

# Make all hooks in .husky executable
if [ -d ".husky" ]; then
  find .husky -type f \( -name "pre-*" -o -name "post-*" -o -name "commit-*" -o -name "prepare-*" \) | while read -r hook; do
    if [ -f "$hook" ]; then
      chmod +x "$hook"
      echo "✅ Made $hook executable"
    fi
  done
  echo "✨ Husky setup complete!"
else
  echo "⚠️  .husky directory not found"
fi
