set -euo pipefail
for f in site/index.html site/styles.css site/layout.css site/sections.css site/app.js; do
  test -f "$f" || { echo "missing $f" >&2; exit 1; }
done
grep -q 'layout.css' site/styles.css
grep -q 'sections.css' site/styles.css
echo "site/ is complete"
