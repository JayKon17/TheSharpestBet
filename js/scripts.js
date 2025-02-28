document.addEventListener("DOMContentLoaded", () => {
    const API_key = "5be9118d712dcce89e543dbfa3a1de27" // 7 is last digit

    // Data structure to manage sport-related content
    const sportsData = {
        nhl: {
            title: "🏒 NHL Section",
            contentFunction: showNHLPage
        },
        nba: {
            title: "🏀 NBA Section",
            contentFunction: showNBAPage
        },
        mlb: {
            title: "⚾ MLB Section",
            contentFunction: showMLBPage
        },
        nfl: {
            title: "🏈 NFL Section",
            contentFunction: showNFLPage
        }
    };

    // Base Site - Sidebar
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sport = event.target.dataset.sport;
            if (sport && sportsData[sport]) {
                updateContent(sport); // Now call updateContent instead of the direct content function
            }
        });
    });

    // Display content for the selected sport
    function updateContent(sport) {
        const contentArea = document.getElementById("content-area");
        const liveScoresContainer = document.getElementById("live-scores-container");
        const shotAnalysisContainer = document.getElementById("shot-analysis-container");
        const gameLogContainer = document.getElementById("game-log-container");

        contentArea.innerHTML = ""; // Clear any previous content
        document.getElementById("section-title").innerText = sportsData[sport].title;

        liveScoresContainer.style.display = "none";
        gameLogContainer.style.display = "none";
        shotAnalysisContainer.style.display = "none";

        sportsData[sport].contentFunction();
    }

    // NHL Stuff 




    // NHL Stuff




    // NHL Stuff 

    let playerIDConverter = {};


    // Show content for the NHL page
    function showNHLPage() {
        const contentArea = document.getElementById("content-area");
        contentArea.innerHTML = `
    <div class="search-bar-container">
    <input type="text" id="search-bar" placeholder="Search for players..." onkeyup="showSuggestions(this.value)">
    <div id="suggestions-container" class="suggestions-container"></div>
`;
        document.getElementById("live-scores-container").style.display = "block";
        fetchLiveNHLScore(); // Fetch live NHL scores
    }

    /* NHL Player ID Map */
    let playerData = []; // Initialize as an empty array

    fetch('data/NHL_playerIDconverter.json')
        .then(response => response.json())
        .then(data => {
            playerData = Object.keys(data).map(name => ({
                name: name,
                id: data[name] // Preserve the ID if needed
            }));
        })
        .catch(error => console.error('Error loading player data:', error));

    // Show suggestions based on the search input
    window.showSuggestions = function(query) {
        const suggestionsContainer = document.getElementById("suggestions-container");
        suggestionsContainer.innerHTML = ''; // Clear previous suggestions

        if (query.length > 2) {
            const filteredPlayers = playerData.filter(player =>
                player.name.toLowerCase().includes(query.toLowerCase())
            );

            filteredPlayers.forEach(player => {
                const suggestionItem = document.createElement("div");
                suggestionItem.classList.add("suggestion-item");
                suggestionItem.textContent = player.name;
                suggestionItem.onclick = function() {
                    selectPlayer(player.name);
                };
                suggestionsContainer.appendChild(suggestionItem);
            });
        }
    };

    window.selectPlayer = function(playerName) {
        document.getElementById("search-bar").value = playerName;
        document.getElementById("suggestions-container").innerHTML = ''; // Clear suggestions
        console.log(`Player selected: ${playerName}`); // Replace with actual functionality
    };

    function selectPlayer(playerName) {
        document.getElementById("search-bar").value = playerName;
        document.getElementById("suggestions-container").innerHTML = ''; // Clear suggestions

        // Normalize the player name (case insensitive)
        const normalizedPlayerName = playerName.trim().toLowerCase();

        // Loop through playerData array to find the correct player ID
        let playerId = null;
        for (let i = 0; i < playerData.length; i++) {
            if (playerData[i].name.toLowerCase() === normalizedPlayerName) {
                playerId = playerData[i].id;
                break; // Exit the loop once the correct player is found
            }
        }

        // If player ID was found, proceed; otherwise, display an error
        if (!playerId) {
            console.error(`Player ID not found for: ${playerName}`);
            document.getElementById("game-log-container").innerHTML = `Player ID not found for: ${playerName}`;
            return; // Stop the function if ID is not found
        }

        // Call API with the found player ID
        const url = `https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/player/${playerId}/game-log/20242025/2`;

        document.getElementById("game-log-container").style.display = "block"
        document.getElementById("shot-analysis-container").style.display = "block"

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.gameLog && data.gameLog.length > 0) {
                    displayGameLog(data.gameLog);
                    displayShotAnalysis(data.gameLog);
                    console.log(url)
                } else {
                    document.getElementById("game-log-container").innerHTML = "No Game Log Data available.";
                }
            })
            .catch(error => {
                console.error('Error fetching player stats:', error);
                document.getElementById("game-log-container").innerHTML = "Error fetching player stats.";
            });
    }

    // Function to display the game log data in an HTML table
    function displayGameLog(gameLog) {
        const tableContainer = document.getElementById("game-log-container");
        tableContainer.innerHTML = ''; // Clear previous content

        // Create table structure
        const table = document.createElement('table');
        table.classList.add('game-log-table'); // Add a class for styling

        // Define headers
        const headers = ['Date', 'Team', '@', 'Opponent', 'Goals', 'Assists', 'Points', 'Shots', 'PIM', 'TOI'];

        // Create table header (using map and template literals)
        const headerRow = `<tr>${headers.map(headerText => `<th>${headerText}</th>`).join('')}</tr>`;

    // Create table rows
    const rows = gameLog.map(game => {
        const atSymbol = game.homeRoadFlag === "R" ? "@" : "vs";
        return `
            <tr>
                <td>${game.gameDate}</td>
                <td>${game.commonName.default}</td>
                <td>${atSymbol}</td>
                <td>${game.opponentCommonName.default}</td>
                <td>${game.goals}</td>
                <td>${game.assists}</td>
                <td>${game.points}</td>
                <td>${game.shots}</td>
                <td>${game.pim}</td>
                <td>${game.toi}</td>
            </tr>
        `;
    }).join('');

    // Combine the header and body into the table
    table.innerHTML = `<thead>${headerRow}</thead><tbody>${rows}</tbody>`;

    // Append the table to the container
    tableContainer.appendChild(table);
    }


    // Helper functions (define before being called)
    function createRow(values, cellType = 'td') {
        const row = document.createElement('tr');
        values.forEach(value => {
        const cell = document.createElement(cellType);
        cell.textContent = value;
        row.appendChild(cell);
        });
        return row;
        }

    function createDataRow(label, data) {
        const row = document.createElement('tr');
        row.appendChild(createCell(label));  // First cell (row label)

        data.over.forEach(value => row.appendChild(createCell(value)));
        row.appendChild(createCell(''));  // Empty separator cell
        data.under.forEach(value => row.appendChild(createCell(value)));

        return row;
    }

    function createCell(content) {
        const cell = document.createElement('td');
        cell.textContent = content;
        return cell;
    }

    // Your main display function
    function displayShotAnalysis() {
    const shotAnalysisContainer = document.getElementById("shot-analysis-container");
    shotAnalysisContainer.innerHTML = '';  // Clear previous content

    const table = document.createElement('table');
    table.classList.add('shot-analysis-table');

    const headers = ['Over', '0.5', '1.5', '2.5', '3.5', '4.5', '5.5+', 'Under', '0.5', '1.5', '2.5', '3.5', '4.5', '5.5+'];
    table.appendChild(createRow(headers, 'th'));

    const shotAnalysisData = calculateShotAnalysisData(getGameLogData());

    const rows = [
    { label: 'Counts', data: shotAnalysisData.counts },
    { label: '% Games', data: shotAnalysisData.percentages },
    { label: 'Breakeven Odds', data: shotAnalysisData.breakevens }
    ];

    rows.forEach(row => {
    table.appendChild(createDataRow(row.label, row.data));
    });

    shotAnalysisContainer.appendChild(table);
    }

    /* Shot Anaylsis Table and Functions for it */ 

    function getGameLogData() {
        const gameLogContainer = document.getElementById("game-log-container");
        const rows = gameLogContainer.querySelectorAll("table tbody tr");

        const gameLogData = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const game = {
                gameDate: cells[0].textContent,             // Game Date
                heroTeam: cells[1].textContent,             // Hero team
                homeRoadFlag: cells[2].textContent,         // Home/Road flag
                opponent: cells[3].textContent,             // Opponent 
                goals: parseInt(cells[4].textContent),      // Goals 
                assists: parseInt(cells[5].textContent),    // Assists 
                points: parseInt(cells[6].textContent),     // Points 
                shots: parseInt(cells[7].textContent),      // Shots 
                pim: parseInt(cells[8].textContent),        // PIM 
                toi: cells[9].textContent                   // Time on Ice 
            };

            gameLogData.push(game);

        });
        return gameLogData;
        }

        function calculateShotAnalysisData(gameLogData) {
            const counts = { over: [], under: [] };
            const percentages = { over: [], under: [] };
            const breakevens = { over: [], under: [] };
        
            const thresholds = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];
        
            // Initialize arrays
            thresholds.forEach(() => {
                counts.over.push(0);
                counts.under.push(0);
                percentages.over.push(0);
                percentages.under.push(0);
                breakevens.over.push(0);
                breakevens.under.push(0);
            });
        
            gameLogData.forEach(game => {
                thresholds.forEach((threshold, index) => {
                    if (game.shots >= threshold) {
                        counts.over[index]++; // Increment for "over"
                    } else {
                        counts.under[index]++; // Increment for "under" (else condition)
                    }
                });
            });
        
            thresholds.forEach((threshold, index) => {
                const overCount = counts.over[index];
                const underCount = counts.under[index];
        
                // Percentage calculation
                const overPercent = overCount / gameLogData.length;
                const underPercent = underCount / gameLogData.length;
        
                percentages.over[index] = (overPercent * 100).toFixed(1) + "%";
                percentages.under[index] = (underPercent * 100).toFixed(1) + "%";
        
                // Breakeven Odds Conversion
                breakevens.over[index] = convertToAmericanOdds(overPercent);
                breakevens.under[index] = convertToAmericanOdds(underPercent);
            });
        
            return { counts, percentages, breakevens };
        }
        

    // Function to convert probability to American Odds
    function convertToAmericanOdds(probability) {
    if (probability <= 0 || probability >= 1) return "N/A"; // Invalid values
    probability = parseFloat(probability.toFixed(4));

    if (probability > 0.50) {
        return Math.round(-((probability / (1 - probability)) * 100)); // Favorite odds
    } else {
        return "+" + Math.round(((1 - probability) / probability) * 100); // Underdog odds
    }
    }

    // Function to fetch live NHL scores (only for the NHL page)
    function fetchLiveNHLScore() {
        const apiKey = API_key;  // Replace with your actual API key
        const apiUrl = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/scores/?daysFrom=1&apiKey=${apiKey}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);  // Log the entire response to check the structure
                if (Array.isArray(data) && data.length > 0) {
                    displayLiveNHLScores(data);
                } else {
                    displayLiveNHLScores([]);  // Pass an empty array if no games are found
                }
            })
            .catch(error => {
                console.error('Error fetching live scores:', error);
                displayLiveNHLScores([]);  // Ensure a blank scoreboard is displayed if the API fails
            });
        }
        
        async function displayLiveNHLScores(data) {
        const scoresContainer = document.getElementById("live-scores");
        scoresContainer.innerHTML = ''; // Clear existing content
        
        // Fetch the team abbreviations before proceeding
        const abbrTeam = await fetchTeamAbbreviations();
        
        // Create a blank scoreboard if no games or API error
        if (data.length === 0) {
        const placeholderMessage = document.createElement("div");
        placeholderMessage.classList.add("scoreboard-placeholder");
        placeholderMessage.innerHTML = `
            <div class="score-item">
                <div class="score-item-header">
                    <span class="game-status-future">No live NHL games available at the moment.</span>
                </div>
                <div class="score-item-body">
                    <div class="team">
                        <span class="team-name"></span>
                    </div>
                    <div class="team">
                        <span class="team-name"></span>
                    </div>
                </div>
            </div>
        `;
        scoresContainer.appendChild(placeholderMessage); // Add the placeholder content
        } else {
        data.forEach(game => {
            const gameElement = document.createElement("div");
            gameElement.classList.add("score-item");
        
            if (game.scores && game.scores.length >= 2) {
                // **LIVE OR COMPLETED GAME**
                const homeTeamAbbr = abbrTeam[game.scores[0].name] || 'default';
                const awayTeamAbbr = abbrTeam[game.scores[1].name] || 'default';
        
                const homeTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NHL/500/scoreboard/${homeTeamAbbr}.png&h=27&w=27`;
                const awayTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NHL/500/scoreboard/${awayTeamAbbr}.png&h=27&w=27`;
        
                const homeTeamScore = game.scores[0].score ?? "N/A";
                const awayTeamScore = game.scores[1].score ?? "N/A";
        
                gameElement.innerHTML = `
                    <div class="score-item-header">
                        <span class="game-status-present">${game.completed ? 'Final' : 'In Progress'}</span>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 0px 0;">
                    </div>
                    <div class="score-item-body">
                        <div class="team">
                            <img src="${homeTeamLogo}" alt="${homeTeamAbbr}" class="team-logo">
                            <span class="team-name">${homeTeamAbbr}</span>
                            <span class="score">${homeTeamScore}</span>
                        </div>
                        <div class="team">
                            <img src="${awayTeamLogo}" alt="${awayTeamAbbr}" class="team-logo">
                            <span class="team-name">${awayTeamAbbr}</span>
                            <span class="score">${awayTeamScore}</span>
                        </div>
                    </div>
                `;
            } else if (!game.scores) {
                // **FUTURE GAME**
                const gameDate = new Date(game.commence_time); // Parse the ISO string
                // Get today's date
                const today = new Date();
        
                // Check if the game date is today
                const isToday = gameDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                }) === today.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                });
        
                // Format the game date if it's not today
                const formattedDate = isToday ? '' : gameDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                }); // e.g., "02/27" or ""
        
                const formattedTime = gameDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }); // e.g., "7:00 PM"
            
                const homeTeamAbbr = abbrTeam[game.home_team] || 'default';
                const awayTeamAbbr = abbrTeam[game.away_team] || 'default';
        
                const homeTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NHL/500/scoreboard/${homeTeamAbbr}.png&h=27&w=27`;
                const awayTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NHL/500/scoreboard/${awayTeamAbbr}.png&h=27&w=27`;
        
                gameElement.innerHTML = `
                    <div class="score-item-header">
                        <span class="game-status-future">${formattedDate} ${formattedTime}</span>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 0px 0;">
                    </div>
                    <div class="score-item-body">
                        <div class="team">
                            <img src="${homeTeamLogo}" alt="${homeTeamAbbr}" class="team-logo">
                            <span class="team-name">${homeTeamAbbr}</span>
                        </div>
                        <div class="team">
                            <img src="${awayTeamLogo}" alt="${awayTeamAbbr}" class="team-logo">
                            <span class="team-name">${awayTeamAbbr}</span>
                        </div>
                    </div>
                `;
            }
        
            scoresContainer.appendChild(gameElement);
        });
        }
        }
        
        async function fetchTeamAbbreviations() {
        const response = await fetch('../data/team-Abbreviations.json');
        const abbrTeam = await response.json();
        return abbrTeam;
        }








    //NBA Stuff







    // Show content for the NBA page
    function showNBAPage() {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""
    contentArea.innerHTML = `
        <div class="search-container">
            <input type="text" id="search" placeholder="Search NBA Players...">
        </div>
        <div class="stats-container">
            <table class="small-table">
                <thead>
                    <tr><th>Average Stats</th><th>Performance Graph</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="big-table-container">
            <table class="big-table">
                <thead>
                    <tr><th>Game Logs</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;

    document.getElementById("live-scores-container").style.display = "block";

    fetchLiveNBAScore();  // Fetch live NHL scores

    }

    // Show content for the MLB page
    function showMLBPage() {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""
    contentArea.innerHTML = `
        <div class="box-container">
            <div class="sport-box">Home Run Leaders</div>
            <div class="sport-box">Batting Averages</div>
            <div class="sport-box">Pitching Stats</div>
            <div class="sport-box">Game Schedule</div>
        </div>
    `;
    }

    // Show content for the NFL page
    function showNFLPage() {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""
    contentArea.innerHTML = `
        <div class="box-container">
            <div class="sport-box">Passing Yards</div>
            <div class="sport-box">Rushing Leaders</div>
            <div class="sport-box">Defensive Rankings</div>
            <div class="sport-box">Upcoming Matchups</div>
        </div>
    `;
    }





    // Function to fetch live NHL scores (only for the NHL page)
    function fetchLiveNBAScore() {
        const apiKey = API_key;  // Replace with your actual API key
        const apiUrl = `https://api.the-odds-api.com/v4/sports/basketball_nba/scores/?daysFrom=1&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);  // Log the entire response to check the structure
                if (Array.isArray(data) && data.length > 0) {
                    displayLiveNBAScores(data);
                } else {
                    displayLiveNBAScores([]);  // Pass an empty array if no games are found
                }
            })
            .catch(error => {
                console.error('Error fetching live scores:', error);
                document.getElementById('live-scores').innerHTML = 'Unable to fetch live scores at the moment.';
            });
    }

    function displayLiveNBAScores(data) {
        const scoresContainer = document.getElementById("live-scores");
        scoresContainer.innerHTML = ''; // Clear existing content

        data.forEach(game => {
            const gameElement = document.createElement("div");
            gameElement.classList.add("score-item");

            if (game.scores && game.scores.length >= 2) {
                // **LIVE OR COMPLETED GAME**
                const homeTeamAbbr = abbrTeam[game.scores[0].name] || 'default';
                const awayTeamAbbr = abbrTeam[game.scores[1].name] || 'default';

                const homeTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NBA/500/scoreboard/${homeTeamAbbr}.png&h=27&w=27`;
                const awayTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NBA/500/scoreboard/${awayTeamAbbr}.png&h=27&w=27`;

                const homeTeamScore = game.scores[0].score ?? "N/A";
                const awayTeamScore = game.scores[1].score ?? "N/A";

                gameElement.innerHTML = `
                    <div class="score-item-header">
                        <span class="game-status-present">${game.completed ? 'Final' : 'In Progress'}</span>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 0px 0;">
                    </div>
                    <div class="score-item-body">
                        <div class="team">
                            <img src="${homeTeamLogo}" alt="${homeTeamAbbr}" class="team-logo">
                            <span class="team-name">${homeTeamAbbr}</span>
                            <span class="score">${homeTeamScore}</span>
                        </div>
                        <div class="team">
                            <img src="${awayTeamLogo}" alt="${awayTeamAbbr}" class="team-logo">
                            <span class="team-name">${awayTeamAbbr}</span>
                            <span class="score">${awayTeamScore}</span>
                        </div>
                    </div>
                `;
            } else if (!game.scores) {
                // **FUTURE GAME**
                const gameDate = new Date(game.commence_time); // Parse the ISO string
                // Get today's date
                const today = new Date();

                // Check if the game date is today
                const isToday = gameDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                }) === today.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                });

                // Format the game date if it's not today
                const formattedDate = isToday ? '' : gameDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                }); // e.g., "02/27" or ""

                console.log(formattedDate);

                
                const formattedTime = gameDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }); // e.g., "7:00 PM"
            
                const homeTeamAbbr = abbrTeam[game.home_team] || 'default';
                const awayTeamAbbr = abbrTeam[game.away_team] || 'default';

                const homeTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NBA/500/scoreboard/${homeTeamAbbr}.png&h=27&w=27`;
                const awayTeamLogo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/NBA/500/scoreboard/${awayTeamAbbr}.png&h=27&w=27`;

                gameElement.innerHTML = `
                    <div class="score-item-header">
                        <span class="game-status-future">${formattedDate} ${formattedTime}</span>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 0px 0;">
                    </div>
                    <div class="score-item-body">
                        <div class="team">
                            <img src="${homeTeamLogo}" alt="${homeTeamAbbr}" class="team-logo">
                            <span class="team-name">${homeTeamAbbr}</span>
                        </div>
                        <div class="team">
                            <img src="${awayTeamLogo}" alt="${awayTeamAbbr}" class="team-logo">
                            <span class="team-name">${awayTeamAbbr}</span>
                        </div>
                    </div>
                `;
            }

            scoresContainer.appendChild(gameElement);
        });
}
});