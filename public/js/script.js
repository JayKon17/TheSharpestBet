// Update the slider value display in real-time as the user moves the slider
document.getElementById('gameSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').textContent = this.value;  // Update display text
});

// Function to fetch player data
function fetchPlayerData() {
    const playerName = document.getElementById('playerName').value.trim();

    if (!playerName) {
        alert('Please enter a player name');
        return;
    }

    // Show loading message
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('playerData').innerHTML = '';  // Clear previous data

    // Make the GET request to the server for player data
    fetch(`/search?name=${playerName}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading message after data is fetched
            document.getElementById('loadingMessage').style.display = 'none';

            if (data.error) {
                document.getElementById('playerData').innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            // Log the raw data to verify
            console.log('Raw processed stats:', data.processedStats);

            // Initialize arrays to store stats for calculation
            let points = [];
            let rebounds = [];
            let assists = [];
            let steals = [];
            let blocks = [];

            // Loop through processed stats and push values into arrays
            if (data.processedStats && Array.isArray(data.processedStats)) {
                data.processedStats.forEach(game => {
                    // Log the game data to see what we're processing
                    console.log('Game data:', game);

                    // Ensure the values are numbers or default to 0 if invalid
                    points.push(isNaN(game.points) ? 0 : parseFloat(game.points));
                    rebounds.push(isNaN(game.rebounds) ? 0 : parseFloat(game.rebounds));
                    assists.push(isNaN(game.assists) ? 0 : parseFloat(game.assists));
                    steals.push(isNaN(game.steals) ? 0 : parseFloat(game.steals));
                    blocks.push(isNaN(game.blocks) ? 0 : parseFloat(game.blocks));
                });
            }

            // Get the number of games from the slider
            const numGames = parseInt(document.getElementById('gameSlider').value, 10);

            // Create a subset of the last N games based on the slider
            const statsSubset = data.processedStats.slice(0, numGames);

            // Calculate averages for the selected subset
            let avgPoints = calculateAverage(statsSubset.map(game => parseFloat(game.points) || 0));
            let avgRebounds = calculateAverage(statsSubset.map(game => parseFloat(game.rebounds) || 0));
            let avgAssists = calculateAverage(statsSubset.map(game => parseFloat(game.assists) || 0));
            let avgSteals = calculateAverage(statsSubset.map(game => parseFloat(game.steals) || 0));
            let avgBlocks = calculateAverage(statsSubset.map(game => parseFloat(game.blocks) || 0));

            // Prepare HTML content to display averages in a table
            let htmlContent = `<h2>Player Averages (Last ${numGames} Games)</h2>
                <table id="averagesTable" class="averagesTable" border="1">
                <thead>
                    <tr>
                        <th>Stat</th><th>Average</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Points per Game</td><td>${avgPoints.toFixed(2)}</td></tr>
                    <tr><td>Rebounds per Game</td><td>${avgRebounds.toFixed(2)}</td></tr>
                    <tr><td>Assists per Game</td><td>${avgAssists.toFixed(2)}</td></tr>
                    <tr><td>Steals per Game</td><td>${avgSteals.toFixed(2)}</td></tr>
                    <tr><td>Blocks per Game</td><td>${avgBlocks.toFixed(2)}</td></tr>
                </tbody>
            </table>`;

            // Display averages table above the stats table
            document.getElementById('playerData').innerHTML = htmlContent;

            // Add the appropriate class to maintain styling
            document.querySelector('table.averagesTable').classList.add('averagesTable');

            // Add the game stats table below
            let statsContent = "<h2>Player Game Stats</h2><table border='1' class='gameStatsTable'><thead><tr><th>Game ID</th><th>Date</th><th>Team</th><th>@</th><th>Opponent</th><th>Score</th><th>Minutes Played</th><th>FGM</th><th>FGA</th><th>3PM</th><th>3PA</th><th>Rebounds</th><th>Assists</th><th>Steals</th><th>Blocks</th><th>Points</th></tr></thead><tbody>";

            // Loop through processed stats and create table rows for the selected subset
            statsSubset.forEach(game => {
                statsContent += `<tr>
                    <td>${game.game_id || 'N/A'}</td>
                    <td>${game.date || 'N/A'}</td>
                    <td>${game.team_player || 'N/A'}</td>
                    <td>${game.is_home}</td>
                    <td>${game.team_villain || 'N/A'}</td>
                    <td>${game.score || 'N/A'}</td>
                    <td>${game.minutes_played || 'N/A'}</td>
                    <td>${game.field_goals || 'N/A'}</td>
                    <td>${game.field_goals_attempted || 'N/A'}</td>
                    <td>${game['3pm'] || 'N/A'}</td>
                    <td>${game['3pa'] || 'N/A'}</td>
                    <td>${game.rebounds || 'N/A'}</td>
                    <td>${game.assists || 'N/A'}</td>
                    <td>${game.steals || 'N/A'}</td>
                    <td>${game.blocks || 'N/A'}</td>
                    <td>${game.points || 'N/A'}</td>
                </tr>`;
            });

            statsContent += "</tbody></table>";
            document.getElementById('playerData').innerHTML += statsContent; // Append stats below the averages

            // Apply CSS class to game stats table for styling
            document.querySelector('table.gameStatsTable').classList.add('gameStatsTable');

        })
        .catch(error => {
            console.error('Error fetching player data:', error);
            document.getElementById('playerData').innerHTML = `<p>Error fetching data</p>`;
            document.getElementById('loadingMessage').style.display = 'none'; // Hide loading message if there's an error
        });
}

// Simple function to calculate average of an array
function calculateAverage(arr) {
    const total = arr.reduce((sum, value) => sum + value, 0);
    return arr.length ? total / arr.length : 0;
}

// Add event listener to trigger search on pressing "Enter"
document.getElementById('playerName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        fetchPlayerData();  // Trigger search if "Enter" is pressed
    }
});
