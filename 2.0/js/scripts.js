document.addEventListener("DOMContentLoaded", () => {

    const teamAbbreviations = {"Ottawa Senators":"OTT","Winnipeg Jets":"WPG","Colorado Avalanche":"COL","New Jersey Devils":"NJ","Los Angeles Kings":"LA","Vancouver Canucks":"VAN","Toronto Maple Leafs":"TOR","Montréal Canadiens":"MTL","Calgary Flames":"CGY","Edmonton Oilers":"EDM","Boston Bruins":"BOS","Buffalo Sabres":"BUF","Detroit Red Wings":"DET","Florida Panthers":"FLA","Chicago Blackhawks":"CHI","Minnesota Wild":"MIN","Carolina Hurricanes":"CAR","Dallas Stars":"DAL","Anaheim Ducks":"ANA","Columbus Blue Jackets":"CBJ","Philadelphia Flyers":"PHI","Nashville Predators":"NSH","St Louis Blues":"STL","Pittsburgh Penguins":"PIT","Arizona Coyotes":"ARI","Tampa Bay Lightning":"TB","San Jose Sharks":"SJ","Washington Capitals":"WSH","New York Rangers":"NYR","New York Islanders":"NYI","Seattle Kraken":"SEA","Vegas Golden Knights":"VGK","Utah Hockey Club":"UTAH","Arizona Cardinals":"ARI","Atlanta Falcons":"ATL","Baltimore Ravens":"BAL","Buffalo Bills":"BUF","Carolina Panthers":"CAR","Chicago Bears":"CHI","Cincinnati Bengals":"CIN","Cleveland Browns":"CLE","Dallas Cowboys":"DAL","Denver Broncos":"DEN","Detroit Lions":"DET","Green Bay Packers":"GB","Houston Texans":"HOU","Indianapolis Colts":"IND","Jacksonville Jaguars":"JAX","Kansas City Chiefs":"KC","Las Vegas Raiders":"LV","Los Angeles Chargers":"LAC","Los Angeles Rams":"LAR","Miami Dolphins":"MIA","Minnesota Vikings":"MIN","New England Patriots":"NE","New Orleans Saints":"NO","New York Giants":"NYG","New York Jets":"NYJ","Philadelphia Eagles":"PHI","Pittsburgh Steelers":"PIT","San Francisco 49ers":"SF","Seattle Seahawks":"SEA","Tampa Bay Buccaneers":"TB","Tennessee Titans":"TEN","Washington Football Team":"WAS","Atlanta Hawks":"ATL","Boston Celtics":"BOS","Brooklyn Nets":"BKN","Charlotte Hornets":"CHA","Chicago Bulls":"CHI","Cleveland Cavaliers":"CLE","Dallas Mavericks":"DAL","Denver Nuggets":"DEN","Detroit Pistons":"DET","Golden State Warriors":"GSW","Houston Rockets":"HOU","Indiana Pacers":"IND","Los Angeles Clippers":"LAC","Los Angeles Lakers":"LAL","Memphis Grizzlies":"MEM","Miami Heat":"MIA","Milwaukee Bucks":"MIL","Minnesota Timberwolves":"MIN","New Orleans Pelicans":"NO","New York Knicks":"NYK","Oklahoma City Thunder":"OKC","Orlando Magic":"ORL","Philadelphia 76ers":"PHI","Phoenix Suns":"PHX","Portland Trail Blazers":"POR","Sacramento Kings":"SAC","San Antonio Spurs":"SAS","Toronto Raptors":"TOR","Utah Jazz":"UTAH","Washington Wizards":"WAS","Arizona Diamondbacks":"ARI","Atlanta Braves":"ATL","Baltimore Orioles":"BAL","Boston Red Sox":"BOS","Chicago Cubs":"CHC","Chicago White Sox":"CWS","Cincinnati Reds":"CIN","Cleveland Indians":"CLE","Colorado Rockies":"COL","Detroit Tigers":"DET","Houston Astros":"HOU","Kansas City Royals":"KC","Los Angeles Angels":"LAA","Los Angeles Dodgers":"LAD","Miami Marlins":"MIA","Milwaukee Brewers":"MIL","Minnesota Twins":"MIN","New York Mets":"NYM","New York Yankees":"NYY","Oakland Athletics":"OAK","Philadelphia Phillies":"PHI","Pittsburgh Pirates":"PIT","San Diego Padres":"SD","San Francisco Giants":"SF","Seattle Mariners":"SEA","St. Louis Cardinals":"STL","Tampa Bay Rays":"TB","Texas Rangers":"TEX","Toronto Blue Jays":"TOR","Washington Nationals":"WSH"};

    const API_key = "5be9118d712dcce89e543dbfa3a1de2"

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

        contentArea.innerHTML = "";  // Clear any previous content
        document.getElementById("section-title").innerText = sportsData[sport].title;
        
        liveScoresContainer.style.display = "none";

        sportsData[sport].contentFunction();
    }

    // Show content for the NHL page
    function showNHLPage() {
        const contentArea = document.getElementById("content-area");
        contentArea.innerHTML = `
            <div class="box-container">
                <div class="sport-box">Goal Leaders</div>
                <div class="sport-box">Fantasy Rankings</div>
                <div class="sport-box">Goalie Stats</div>
                <div class="sport-box">Game Schedule</div>
            </div>
        `;
        document.getElementById("live-scores-container").style.display = "block";

        fetchLiveNHLScore();  // Fetch live NHL scores
    }

    // Show content for the NBA page
    function showNBAPage() {
        const contentArea = document.getElementById("content-area");
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
                document.getElementById('live-scores').innerHTML = 'Unable to fetch live scores at the moment.';
            });
    }

    function displayLiveNHLScores(data) {
        const scoresContainer = document.getElementById("live-scores");
        scoresContainer.innerHTML = ''; // Clear existing content
    
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

                console.log(formattedDate);

                
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
