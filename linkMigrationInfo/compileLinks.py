import pandas as pd
import re

sims_list = pd.read_csv("aiSimsList.csv")
sims_list = sims_list[sims_list["title"].notnull()]

needs_link = sims_list[sims_list["link"].isnull()]

# print(needs_link)
under_review = pd.read_json("../home_page/output/under-review.json")
demos = pd.read_json("../home_page/output/demos.json")
json_list = pd.concat([under_review, demos], ignore_index=True)

for index, row in needs_link.iterrows():
    title = row["title"].strip()
    noParenth = re.sub(r'\(.*?\)', '', title)  # Remove text within parentheses
    directory_name = ''.join(word.capitalize() for word in re.split(r"[\s\:\'\-\,]+", noParenth))  # Convert to PascalCase
    # print(f"Title: {title}, Directory Name: {directory_name}")

    json_entry = json_list[json_list['href'].str.contains(directory_name)]
    
    if len(json_entry) != 1:
        print(f"Warning: Expected one link for {directory_name}, found {len(json_entry)}")
        continue

    link = str(json_entry['href'].iloc[0])
    # print(f"Found link for {title}: {link}")
    
    # Add the link to the sims_list DataFrame
    sims_list.at[index, 'link'] = link

# Write the new sims list
sims_list.to_csv("aiSimsList_newlinks.csv", index=False)
