find . \( -path './migrations' -o -path './backend-code-lib' \) -prune -o -type f \( -name '*.py' \) -print0 | xargs -0 wc -l
