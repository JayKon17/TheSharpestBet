import requests
import json

# Define the URL and parameters for the API request
BASE_URL = "https://api.nhle.com/stats/rest/en/skater/summary"
TOTAL_PLAYERS = 862  # Total players as per the API response
LIMIT = 100  # Limit of players per page
START = 0  # Start index for the first page
OUTPUT_FILE = 'players_data.json'  # The output file to save the data

# Function to fetch data from the API and append to the JSON file
def fetch_data(start):
    params = {
        'isAggregate': 'false',
        'isGame': 'false',
        'sort': '[{"property":"lastName","direction":"ASC_CI"},{"property":"skaterFullName","direction":"ASC_CI"},{"property":"playerId","direction":"ASC"}]',
        'cayenneExp': 'gameTypeId=2 and seasonId<=20242025 and seasonId>=20242025',
        'start': start,
        'limit': LIMIT
    }
    
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if we got data
        if 'data' in data and len(data['data']) > 0:
            # Append the data to the JSON file
            append_to_json(data['data'])
            
            # If there's more data, fetch the next page
            if len(data['data']) == LIMIT and len(data['data']) < TOTAL_PLAYERS:
                fetch_data(start + LIMIT)
            else:
                print(f"All data fetched. Total players fetched: {len(data['data'])}")
        else:
            print("No data returned from API.")
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")

# Function to append data to the output JSON file
def append_to_json(data):
    try:
        # Try opening the file in append mode
        with open(OUTPUT_FILE, 'a') as f:
            for item in data:
                f.write(json.dumps(item) + '\n')
            print(f"Appended {len(data)} items to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error appending data to JSON: {e}")

# Main execution
if __name__ == '__main__':
    # First, check if the file already exists and clear it if necessary
    try:
        with open(OUTPUT_FILE, 'w') as f:
            f.write('')  # Clear the file before starting fresh
    except Exception as e:
        print(f"Error clearing the file: {e}")
    
    # Start the data fetching process
    fetch_data(START)
