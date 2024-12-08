#!/bin/bash

# Compare two JSON files and list keys exclusive to each file
# Usage: ./compare-translations.sh file1.json file2.json

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 file1.json file2.json"
  exit 1
fi

FILE1=$1
FILE2=$2

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Please install jq and try again."
  echo "For debian-based distros you can use `sudo apt install jq`. For macOS devices, use `brew install jq`. For Windows, please use WSL2."
  exit 1
fi

# Extract keys from both JSON files
KEYS_FILE1=$(jq -r 'paths | map(tostring) | join(".")' "$FILE1" | sort)
KEYS_FILE2=$(jq -r 'paths | map(tostring) | join(".")' "$FILE2" | sort)

# Find keys that differ between FILE1 and FILE2
DIFF1=$(comm -23 <(echo "$KEYS_FILE1") <(echo "$KEYS_FILE2") | sed 's/^/- "/; s/$/"/')
DIFF2=$(comm -13 <(echo "$KEYS_FILE1") <(echo "$KEYS_FILE2") | sed 's/^/- "/; s/$/"/')

# Display results
if [[ -n "$DIFF1" || -n "$DIFF2" ]]; then
  if [[ -n "$DIFF1" ]]; then
    echo "Keys in $FILE1 but not in $FILE2:"
    echo "$DIFF1"
    echo "" # Add a blank line
  fi
  if [[ -n "$DIFF2" ]]; then
    echo "Keys in $FILE2 but not in $FILE1:"
    echo "$DIFF2"
  fi
else
  echo "There are no differences between the keys in $FILE1 and $FILE2."
fi