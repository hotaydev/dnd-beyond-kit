#!/bin/bash

VERSION=$(cat ./manifest.json | jq .version | tr -d '"')

zip -r dnd-beyond-kit-v${VERSION}.zip ./manifest.json ./translations/*.json ./translations/**/*.json ./scripts ./popup ./images ./_locales
