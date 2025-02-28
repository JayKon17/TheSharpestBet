import json

# Open the file and load the data
with open("processed_players_data.json", "r") as file:
    try:
        data = json.load(file)
    except json.decoder.JSONDecodeError:
        # Try reading as multiple JSON objects, line by line
        file.seek(0)  # Reset the file pointer
        content = file.read()
        # If there's more than one JSON object, split them (separated by '}{')
        json_objects = content.split('}{')
        # Correct split points by adding the missing braces back
        json_objects = ['{' + obj + '}' if i > 0 else obj for i, obj in enumerate(json_objects)]
        
        # Now load them one by one
        data = []
        for obj in json_objects:
            data.append(json.loads(obj))

# Create a dictionary mapping player names to player IDs
player_map = {player["skaterFullName"]: player["playerId"] for player in data[0]["players"]}

# Write the player map to a new JSON file
with open("player_names_to_ids.json", "w") as outfile:
    json.dump(player_map, outfile, indent=4)

print("Player name to ID map saved to 'player_names_to_ids.json'")
