#!/bin/bash

TARGET_DIR="${1:-.}"
OUTPUT_FILE="combined_codebase.md"

# Clear the output file
> "$OUTPUT_FILE"

echo "Combining files from '$TARGET_DIR'..."

# Make sure to remove *.pdf from the EXCLUDE_PATTERNS if you added it earlier!
find "$TARGET_DIR" -type f -not -path '*/\.*' ! -name "$OUTPUT_FILE" -print0 | while IFS= read -r -d $'\0' file; do
    
    echo "Appending: $file"

    echo "## File: \`$file\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo '```text' >> "$OUTPUT_FILE"
    
    # Check if the file is a PDF
    if [[ "${file,,}" == *.pdf ]]; then
        # Check if pdftotext is installed
        if command -v pdftotext &> /dev/null; then
            pdftotext "$file" - >> "$OUTPUT_FILE"
        else
            echo "[Error: 'pdftotext' is not installed. Cannot read PDF.]" >> "$OUTPUT_FILE"
        fi
    else
        # Standard text file, use cat
        cat "$file" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE" 
    echo '```' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

done

echo "Done! Check $OUTPUT_FILE"