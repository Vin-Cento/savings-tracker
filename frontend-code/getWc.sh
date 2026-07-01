!#/bin/sh

find . \
  \( -path './node_modules' -o -path './client' -o -path './src/assets' \) -prun
e -o \
  -type f \( -name '*.ts' -o -name '*.js' -o -name '*.tsx' -o -name '*.jsx' \)

-print0 | xargs -0 wc -l
