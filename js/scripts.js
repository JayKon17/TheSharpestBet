document.addEventListener("DOMContentLoaded", () => {
    
    const teamAbbreviations = {"Ottawa Senators":"OTT","Winnipeg Jets":"WPG","Colorado Avalanche":"COL","New Jersey Devils":"NJ","Los Angeles Kings":"LA","Vancouver Canucks":"VAN","Toronto Maple Leafs":"TOR","Montréal Canadiens":"MTL","Calgary Flames":"CGY","Edmonton Oilers":"EDM","Boston Bruins":"BOS","Buffalo Sabres":"BUF","Detroit Red Wings":"DET","Florida Panthers":"FLA","Chicago Blackhawks":"CHI","Minnesota Wild":"MIN","Carolina Hurricanes":"CAR","Dallas Stars":"DAL","Anaheim Ducks":"ANA","Columbus Blue Jackets":"CBJ","Philadelphia Flyers":"PHI","Nashville Predators":"NSH","St Louis Blues":"STL","Pittsburgh Penguins":"PIT","Arizona Coyotes":"ARI","Tampa Bay Lightning":"TB","San Jose Sharks":"SJ","Washington Capitals":"WSH","New York Rangers":"NYR","New York Islanders":"NYI","Seattle Kraken":"SEA","Vegas Golden Knights":"VGK","Utah Hockey Club":"UTAH","Arizona Cardinals":"ARI","Atlanta Falcons":"ATL","Baltimore Ravens":"BAL","Buffalo Bills":"BUF","Carolina Panthers":"CAR","Chicago Bears":"CHI","Cincinnati Bengals":"CIN","Cleveland Browns":"CLE","Dallas Cowboys":"DAL","Denver Broncos":"DEN","Detroit Lions":"DET","Green Bay Packers":"GB","Houston Texans":"HOU","Indianapolis Colts":"IND","Jacksonville Jaguars":"JAX","Kansas City Chiefs":"KC","Las Vegas Raiders":"LV","Los Angeles Chargers":"LAC","Los Angeles Rams":"LAR","Miami Dolphins":"MIA","Minnesota Vikings":"MIN","New England Patriots":"NE","New Orleans Saints":"NO","New York Giants":"NYG","New York Jets":"NYJ","Philadelphia Eagles":"PHI","Pittsburgh Steelers":"PIT","San Francisco 49ers":"SF","Seattle Seahawks":"SEA","Tampa Bay Buccaneers":"TB","Tennessee Titans":"TEN","Washington Football Team":"WAS","Atlanta Hawks":"ATL","Boston Celtics":"BOS","Brooklyn Nets":"BKN","Charlotte Hornets":"CHA","Chicago Bulls":"CHI","Cleveland Cavaliers":"CLE","Dallas Mavericks":"DAL","Denver Nuggets":"DEN","Detroit Pistons":"DET","Golden State Warriors":"GSW","Houston Rockets":"HOU","Indiana Pacers":"IND","Los Angeles Clippers":"LAC","Los Angeles Lakers":"LAL","Memphis Grizzlies":"MEM","Miami Heat":"MIA","Milwaukee Bucks":"MIL","Minnesota Timberwolves":"MIN","New Orleans Pelicans":"NO","New York Knicks":"NYK","Oklahoma City Thunder":"OKC","Orlando Magic":"ORL","Philadelphia 76ers":"PHI","Phoenix Suns":"PHX","Portland Trail Blazers":"POR","Sacramento Kings":"SAC","San Antonio Spurs":"SAS","Toronto Raptors":"TOR","Utah Jazz":"UTAH","Washington Wizards":"WAS","Arizona Diamondbacks":"ARI","Atlanta Braves":"ATL","Baltimore Orioles":"BAL","Boston Red Sox":"BOS","Chicago Cubs":"CHC","Chicago White Sox":"CWS","Cincinnati Reds":"CIN","Cleveland Indians":"CLE","Colorado Rockies":"COL","Detroit Tigers":"DET","Houston Astros":"HOU","Kansas City Royals":"KC","Los Angeles Angels":"LAA","Los Angeles Dodgers":"LAD","Miami Marlins":"MIA","Milwaukee Brewers":"MIL","Minnesota Twins":"MIN","New York Mets":"NYM","New York Yankees":"NYY","Oakland Athletics":"OAK","Philadelphia Phillies":"PHI","Pittsburgh Pirates":"PIT","San Diego Padres":"SD","San Francisco Giants":"SF","Seattle Mariners":"SEA","St. Louis Cardinals":"STL","Tampa Bay Rays":"TB","Texas Rangers":"TEX","Toronto Blue Jays":"TOR","Washington Nationals":"WSH"};
    const API_key = "5be9118d712dcce89e543dbfa3a1de2" // 7 is last digit

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

    // Handle sidebar clicks
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sport = event.target.dataset.sport;
            if (sport && sportsData[sport]) {
                updateContent(sport);  // Now call updateContent instead of the direct content function
            }
        });
    });

    // Display content for the selected sport
    function updateContent(sport) {
        const contentArea = document.getElementById("content-area");
        const liveScoresContainer = document.getElementById("live-scores-container");
        const shotAnalysisContainer = document.getElementById("shot-analysis-container");
        const gameLogContainer = document.getElementById("game-log-container");

        contentArea.innerHTML = "";  // Clear any previous content
        document.getElementById("section-title").innerText = sportsData[sport].title;
        
        liveScoresContainer.style.display = "none";
        gameLogContainer.style.display = "none";
        shotAnalysisContainer.style.display = "none";

        sportsData[sport].contentFunction();
    }

    // NHL Stuff 

    let playerIDConverter = {};

    /* NHL Player ID Map */
    let playerData = [];  // Initialize as an empty array

    fetch('data/NHL_playerIDconverter.json')
        .then(response => response.json())
        .then(data => {
            playerData = Object.keys(data).map(name => ({
                name: name, 
                id: data[name]  // Preserve the ID if needed
            }));
            console.log("Player data loaded", playerData);  // Debugging log
        })
        .catch(error => console.error('Error loading player data:', error));
    
    // Show content for the NHL page
    function showNHLPage() {
        const contentArea = document.getElementById("content-area");
        contentArea.innerHTML = `
            <div class="search-bar-container">
            <input type="text" id="search-bar" placeholder="Search for players..." onkeyup="showSuggestions(this.value)">
            <div id="suggestions-container" class="suggestions-container"></div>
        `;
        document.getElementById("live-scores-container").style.display = "block";
        fetchLiveNHLScore();  // Fetch live NHL scores
    }

    // Show suggestions based on the search input
    window.showSuggestions = function (query) {
        const suggestionsContainer = document.getElementById("suggestions-container");
        suggestionsContainer.innerHTML = '';  // Clear previous suggestions
    
        if (query.length > 2) {
            const filteredPlayers = playerData.filter(player =>
                player.name.toLowerCase().includes(query.toLowerCase())
            );
    
            filteredPlayers.forEach(player => {
                const suggestionItem = document.createElement("div");
                suggestionItem.classList.add("suggestion-item");
                suggestionItem.textContent = player.name;
                suggestionItem.onclick = function () {
                    selectPlayer(player.name);
                };
                suggestionsContainer.appendChild(suggestionItem);
            });
        }
    };
    
    window.selectPlayer = function (playerName) {
        document.getElementById("search-bar").value = playerName;
        document.getElementById("suggestions-container").innerHTML = '';  // Clear suggestions
        console.log(`Player selected: ${playerName}`);  // Replace with actual functionality
    };

    function selectPlayer(playerName) {
        document.getElementById("search-bar").value = playerName;
        document.getElementById("suggestions-container").innerHTML = '';  // Clear suggestions
    
        // Normalize the player name (case insensitive)
        const normalizedPlayerName = playerName.trim().toLowerCase();
    
        // Check if playerData is an array
        if (!Array.isArray(playerData)) {
            console.error("Player data is not an array. Please check its structure.");
            return;
        }
    
        // Loop through playerData array to find the correct player ID
        let playerId = null;
        for (let i = 0; i < playerData.length; i++) {
            if (playerData[i].name.toLowerCase() === normalizedPlayerName) {
                playerId = playerData[i].id;
                break;  // Exit the loop once the correct player is found
            }
        }
    
        // If player ID was found, proceed; otherwise, display an error
        if (!playerId) {
            console.error(`Player ID not found for: ${playerName}`);
            document.getElementById("game-log-container").innerHTML = `Player ID not found for: ${playerName}`;
            return;  // Stop the function if ID is not found
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
        tableContainer.innerHTML = '';  // Clear previous content
    
        // Create table
        const table = document.createElement('table');
        table.classList.add('game-log-table');  // Add a class for styling
    
        // Create table header
        const header = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Date', '@', 'Opponent', 'Goals', 'Assists', 'Points', 'Shots', 'PIM', 'TOI'];
    
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        header.appendChild(headerRow);
        table.appendChild(header);
    
        // Create table body
        const tbody = document.createElement('tbody');
        gameLog.forEach(game => {
            const row = document.createElement('tr');
            
            // Game Date
            const dateCell = document.createElement('td');
            dateCell.textContent = game.gameDate;
            row.appendChild(dateCell);

            // @
            let atCell = document.createElement('td');
            if (game.homeRoadFlag == "R") {
                atCell.textContent = "@";
            } else {
                atCell.textContent = "";
            }
            row.appendChild(atCell);
    
            // Opponent
            const opponentCell = document.createElement('td');
            opponentCell.textContent = game.opponentCommonName.default;
            row.appendChild(opponentCell);
    
            // Goals
            const goalsCell = document.createElement('td');
            goalsCell.textContent = game.goals;
            row.appendChild(goalsCell);
    
            // Assists
            const assistsCell = document.createElement('td');
            assistsCell.textContent = game.assists;
            row.appendChild(assistsCell);
    
            // Points
            const pointsCell = document.createElement('td');
            pointsCell.textContent = game.points;
            row.appendChild(pointsCell);
    
            // Shots
            const shotsCell = document.createElement('td');
            shotsCell.textContent = game.shots;
            row.appendChild(shotsCell);
    
            // PIM
            const pimCell = document.createElement('td');
            pimCell.textContent = game.pim;
            row.appendChild(pimCell);
    
            // TOI (Time on Ice)
            const toiCell = document.createElement('td');
            toiCell.textContent = game.toi;
            row.appendChild(toiCell);
    
            tbody.appendChild(row);
        });
    
        table.appendChild(tbody);
        tableContainer.appendChild(table);  // Append the table to the container
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

 
    function getGameLogData() {
        const gameLogContainer = document.getElementById("game-log-container");
        const rows = gameLogContainer.querySelectorAll("table tbody tr");
    
        const gameLogData = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const game = {
                gameDate: cells[0].textContent,
                homeRoadFlag: cells[1].textContent,
                opponent: cells[2].textContent,
                goals: parseInt(cells[3].textContent),
                assists: parseInt(cells[4].textContent),
                points: parseInt(cells[5].textContent),
                shots: parseInt(cells[6].textContent),
                pim: parseInt(cells[7].textContent),
                toi: cells[8].textContent
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
                    counts.over[index]++;
                }
                if (game.shots < threshold) {
                    counts.under[index]++;
                }
            });
        });
    
        thresholds.forEach((threshold, index) => {
            const overCount = counts.over[index];
            const underCount = counts.under[index];
    
            // Percentage
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
    
    function displayLiveNHLScores(data) {
        const scoresContainer = document.getElementById("live-scores");
        scoresContainer.innerHTML = ''; // Clear existing content
        
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
                    const homeTeamAbbr = teamAbbreviations[game.scores[0].name] || 'default';
                    const awayTeamAbbr = teamAbbreviations[game.scores[1].name] || 'default';
    
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
                
                    const homeTeamAbbr = teamAbbreviations[game.home_team] || 'default';
                    const awayTeamAbbr = teamAbbreviations[game.away_team] || 'default';
    
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
                    const homeTeamAbbr = teamAbbreviations[game.scores[0].name] || 'default';
                    const awayTeamAbbr = teamAbbreviations[game.scores[1].name] || 'default';
        
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
                
                    const homeTeamAbbr = teamAbbreviations[game.home_team] || 'default';
                    const awayTeamAbbr = teamAbbreviations[game.away_team] || 'default';
        
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
