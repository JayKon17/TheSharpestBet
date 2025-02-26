import pandas as pd
import matplotlib.pyplot as plt

# Load your JSON file into a DataFrame
df = pd.read_json('processed_player_game_data.json')

# Print the first few rows to check the structure
print(df.head())

# Clean up the numeric columns (if they are strings)
df['points'] = pd.to_numeric(df['points'], errors='coerce')  # Convert to numeric
df['assists'] = pd.to_numeric(df['assists'], errors='coerce')
df['rebounds'] = pd.to_numeric(df['rebounds'], errors='coerce')

# Verify the conversion of columns
print(df.dtypes)

# Analyze the average points scored per game
average_points = df['points'].mean()
print(f"Average points per game: {average_points}")

# Filter games where the player scored more than 20 points
high_scoring_games = df[df['points'] > 20]
print(f"Games where the player scored more than 20 points:\n{high_scoring_games}")

# Plot points over the game_id (game number)
plt.plot(df['game_id'], df['points'], marker='o')
plt.xlabel('Game ID')
plt.ylabel('Points')
plt.title('Points Scored by Game')
plt.show()

# Save processed data to a new JSON file (optional)
df.to_json('processed_data_analysis.json', orient='records', lines=True)
