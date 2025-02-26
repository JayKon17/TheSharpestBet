import json
import requests
from bs4 import BeautifulSoup
import sys

RAW_DATA_FILE = "player_game_data.json"
PROCESSED_DATA_FILE = "processed_player_game_data.json"

def build_player_url(player_name):
    base_url = "https://www.basketball-reference.com/players/"
    name_parts = player_name.lower().split()
    if len(name_parts) < 2:
        return None 
    
    last_name, first_name = name_parts[1], name_parts[0]
    player_initial = last_name[0]
    player_id = f"{last_name[:5]}{first_name[:2]}01"
    return f"{base_url}{player_initial}/{player_id}/gamelog/2025"

def get_game_data(player_url):

    print(f"Scraping URL: {player_url}")

    response = requests.get(player_url)

    if response.status_code != 200:
        return {"error": f"Failed to fetch data, status code {response.status_code}"}

    soup = BeautifulSoup(response.text, "html.parser")
    game_log_div = soup.find("div", {"id": "div_pgl_basic"})

    if not game_log_div:
        return {"error": "Game log not found on page"}

    game_log_table = game_log_div.find("table")
    if not game_log_table:
        return {"error": "Table not found in game log"}

    rows = game_log_table.find_all("tr")[1:]
    game_data = []

    for row in rows:
        columns = row.find_all("td")
        if len(columns) < 5:
            continue #workaround to inactive rows

        game_data.append([col.text.strip() for col in columns])

    return game_data if game_data else {"error": "No game data found"}

def process_row(row):
    if len(row) != 29:  #Full game daya is always 29 col
        print(f"Skipping row due to incorrect number of columns: {row}")
        return None

    return {
        "date": row[1],
        "game_id": row[0],
        "team_player": row[3],
        "is_home": row[4],
        "team_villain": row[5],
        "score": row[6],
        "minutes_played": row[8],
        "field_goals": row[9],
        "field_goals_attempted": row[10],
        "3pm": row[12],
        "3pa": row[13],
        "rebounds": row[20],
        "assists": row[21],
        "steals": row[22],
        "blocks": row[23],
        "points": row[26],
    }

# Function to process and clean entire dataset
def process_data(raw_data):
    processed_data = []
    for row in raw_data:
        try:
            cleaned_row = process_row(row)
            if cleaned_row:
                processed_data.append(cleaned_row)
        except Exception as e:
            print(f"Error processing row: {row}. Error: {e}")
            continue
    return processed_data

# Main function
def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Player name not provided"}))
        return

    player_name = sys.argv[1]
    player_url = build_player_url(player_name)

    if not player_url:
        print(json.dumps({"error": "Invalid player name format"}))
        return

    # Scrape game data
    game_data = get_game_data(player_url)

    # Save raw data to file
    with open(RAW_DATA_FILE, "w", encoding="utf-8") as f:
        json.dump({"player": player_name, "stats": game_data}, f, indent=4, ensure_ascii=False)

    # If scraper fails to find game data, log error and exit
    if "error" in game_data:
        print(json.dumps(game_data))  # Print the error message if scraping fails
        return

    # Process the game data
    processed_data = process_data(game_data)

    # Save processed data
    with open(PROCESSED_DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(processed_data, f, indent=4, ensure_ascii=False)

    print(f"Processed data has been written to {PROCESSED_DATA_FILE}")

# Run script
if __name__ == "__main__":
    main()
    