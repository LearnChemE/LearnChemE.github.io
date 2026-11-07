import csv
import json
import os
import subprocess
import re
import pandas as pd

nameLocationCSV = pd.read_csv('linkMigrationInfo/reviewLinkList.csv')
matched = nameLocationCSV[nameLocationCSV['status'] == 'matched']
print(matched.info())



to_migrate = matched[matched['source_url'].isnull()]
print(to_migrate.info())

homepage_info = pd.read_json('home_page/output/under-review.json')

i=0
failed=0
# Create a directory for each to migrate entry
for index, row in to_migrate.iterrows():
    oldPath = row['html_page']
    # Use item name as directory name, but in pascal case and without spaces
    item_name = row['item'].strip()  # Remove leading/trailing whitespace
    noParenth = re.sub(r'\(.*?\)', '', item_name)  # Remove text within parentheses
    directory_name = 'demos/' + ''.join(word.capitalize() for word in re.split(r"[\s\:\'\-\,]+", noParenth))  # Convert to PascalCase
    # print(f"Creating directory: {directory_name}")
    if not os.path.exists(directory_name):
        # Create the directory if it doesn't exist

        # Replace the link in the homepage_info JSON with the new link
        search_key = 'https://learncheme.github.io/' + row['html_page'].lstrip('/').replace(' ','%20')  # Remove leading slash if present
        new_link = directory_name + '/index.html'
        if (homepage_info[homepage_info['href'] == search_key].empty):
            print(f"Warning: No matching entry found for {search_key} in homepage_info.")
            failed += 1
        else:
            # print(f"Updating link for {row['item']} from {search_key} to {new_link}")
            homepage_info.loc[homepage_info['href'] == search_key, 'href'] = "https://learncheme.github.io/" + new_link

            os.makedirs(directory_name)
            # Copy the source file to the new directory
            index_dir = directory_name + '/index.html'
            print(f"Moving file from {oldPath} to {index_dir}")
            subprocess.run(['mv', oldPath, index_dir])
        
        i += 1
    # try:
    #     os.makedirs(directory_name)
    #     print(f"Directory '{directory_name}' created successfully.")
    # except FileExistsError:
    #     print(f"Directory '{directory_name}' already exists.")
    # except Exception as e:
    #     print(f"An error occurred while creating directory '{directory_name}': {e}")

print(f"Total items processed: {i} out of {len(homepage_info)}")
print(f"Total items failed to update: {failed} out of {len(homepage_info)}")

# Save the updated homepage_info JSON
output_path = os.path.join('home_page', 'output', 'under-review-copy.json')
json_output = homepage_info.to_json(orient='records', indent=2).replace(r'\/', '/')
with open(output_path, 'w') as output_file:
    output_file.write(json_output)
print("Updated homepage_info JSON saved to 'home_page/output/under-review.json'.")