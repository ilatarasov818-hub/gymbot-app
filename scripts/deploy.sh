#!/bin/sh
# Сборка и публикация на GitHub Pages: dist уходит в ветку gh-pages.
set -e
npm run build
touch dist/.nojekyll
cd dist
git init -q -b gh-pages
git add -A
git commit -qm "Публикация"
git push -f "$(cd .. && git remote get-url origin)" gh-pages
rm -rf .git
