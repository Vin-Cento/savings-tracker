find . \( -path './migrations' -o -path './backend-code-lib' -o -path './backend-code' -o -path './tests' \) -prune -o -type f \( -name '*.py' \) -print0 | xargs -0 wc -l
