import json

# Read the JSON file
with open('processed_players_data.json', 'r') as file:
    data = json.load(file)

# Create a dictionary to map player names to player IDs
player_map = {player["skaterFullName"]: player["playerId"] for player in data["players"]}

# Save the result to a new file
with open('player_names_to_ids.json', 'w') as outfile:
    json.dump(player_map, outfile, indent=4)

print("Data processed and saved to 'player_names_to_ids.json'")
