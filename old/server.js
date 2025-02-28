const express = require('express');
const app = express();
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

// Serve static files like index.html, CSS, etc.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/search', (req, res) => {
    const playerName = req.query.name;
    if (!playerName) {
        return res.json({ error: "Player name is required" });
    }

    console.log(`Fetching data for player: ${playerName}`);

    // Run the scraper (1player_stats_scraper.py)
    exec(`python 1player_stats_scraper.py "${playerName}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running scraper: ${error.message}`);
            return res.json({ error: "Error fetching player stats" });
        }

        // After the scraper completes, read the raw stats from the JSON file
        fs.readFile('player_game_data.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err.message}`);
                return res.json({ error: "Error reading player data" });
            }

            const playerData = JSON.parse(data);
            const rawStats = playerData.stats;  // Get the raw stats from the scraped data

            // Read the processed stats from the file
            fs.readFile('processed_player_game_data.json', 'utf-8', (err, processedData) => {
                if (err) {
                    console.error(`Error reading processed data: ${err.message}`);
                    return res.json({ error: "Error reading processed data" });
                }

                const processedStats = JSON.parse(processedData);

                // Send results back to the frontend
                res.json({
                    player: playerName,
                    message: "Search completed successfully!",
                    rawStats: rawStats,  // Stats from 1player_stats_scraper.py
                    processedStats: processedStats  // Processed stats from 1player_stats_scraper.py
                });
            });
        });
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
