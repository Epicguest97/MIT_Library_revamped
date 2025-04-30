import json

# Load data from input JSON file
with open('links.json', 'r') as f:
    data = json.load(f)

# Function to update each entry
def replace_computer_with_cs(entry):
    if "path" in entry:
        entry["path"] = ["Computer Science" if p == "Computer Science and Engg" else p for p in entry["path"]]
    return entry

# Update data (assuming it's a list of entries)
if isinstance(data, list):
    updated_data = [replace_computer_with_cs(entry) for entry in data]
else:
    updated_data = replace_computer_with_cs(data)

# Save the updated data to a new JSON file
with open('links.json', 'w') as f:
    json.dump(updated_data, f, indent=2)

print("Update complete. Modified data saved to 'output.json'.")
