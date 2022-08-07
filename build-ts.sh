#!/bin/bash
printf "TypeScript "
npx tsc --version
printf "\n"
npx tsc --showConfig
printf "\nTranspiling...\n"
time npx tsc --removeComments --strict
