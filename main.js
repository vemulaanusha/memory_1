
// Preload images
var images = []; // Add paths to your card images
var backOfCardImage = 'images/back.png';
var blankCardImage = 'images/blank.png';

// Set up initial game settings
var player = '';
var numCards = 48;

// Load settings from session storage
if (sessionStorage.getItem('player')) {
    player = sessionStorage.getItem('player');
    numCards = sessionStorage.getItem('numCards');
    updateDisplay();
}

// Load images array with card images
for (var i = 1; i <= 24; i++) {
    images.push("images/card_"+i+".png");
}


// Load cards array with the src attributes of the images for the cards
var cards = [];
for (var image in images) {
    cards.push(images[image]);
    cards.push(images[image]);
    
}

// Function to update the display with player information
function updateDisplay() {
    $('#player').text('Player: ' + player);
    $('#high_score').text('High Score: ' + getHighScore());
    // Additional display updates as needed
}

// Function to get the high score from local storage
function getHighScore() {
    // Implement logic to retrieve high score from local storage
    var storedHighScore = localStorage.getItem('highScore') || 0;
    return 'High Score'; // Replace with actual high score value
}
// Function to set the high score in local storage
function setHighScore(score) {
    localStorage.setItem('highScore', score);
}
// Function to start a new game
function startNewGame() {
    // Implement logic to start a new game
    initializeGame();
    updateDisplay();
}
// Function to initialize the game
function initializeGame(numCards) {
        // Shuffle the cards
        var shuffledCards = shuffleArray(cards.slice(0,numCards));
        console.log(shuffledCards);
        // Get the number of cards from session storage
        var numCards = parseInt(sessionStorage.getItem("numCards")) || 48;
        
        // Generate HTML for cards based on the specified number
        var cardHtml = generateCardHtml(shuffledCards);

        // Append cards to the "cards" div
        $("#cards").html(cardHtml);

        // Game logic
        var flippedCards = [];

        $(".card").on("click", function () {
            var cardIndex = $(this).index();

            // Check if the card is already flipped or matched
            if (!$(this).hasClass("flipped") && flippedCards.length < 2) {
                // Flip the card
                $(this).children("img").attr("src", shuffledCards[cardIndex]);
                $(this).addClass("flipped");
                flippedCards.push({ index: cardIndex, image: shuffledCards[cardIndex] });

                // Check for a match after 2 cards are flipped
                if (flippedCards.length === 2) {
                    setTimeout(function () {
                        if (flippedCards[0].image === flippedCards[1].image) {
                            // Matched
                            $(".flipped").addClass("matched").slideUp(500);
                        } else {
                            // Not matched
                            
                            $(".flipped img").delay(500).fadeOut(500,function() {
                                       $(this).attr('src', backOfCardImage).fadeIn(500);
                            });
                            
                            $(".flipped").removeClass("flipped");
                        }
                        flippedCards = [];

                        // Update score after each move
                        updateScore();
                    }, 1000);
                }
            }
        });

        // Save settings and reload page
        // $("#save_settings").on("click", function () {
            
        // });

        // Display player name and high score
        var playerName = sessionStorage.getItem("playerName") || "Player";
        var highScore = localStorage.getItem("highScore") || 0;

        $("#player").text("Player: " + playerName);
        $("#high_score").text("High Score: " + highScore);

        // Update high score and percentage
        updateScore();
    }
    
    function generateCardHtml(cards) {
        var cardHtml = "";
        for (var i = 0; i < cards.length; i++) {
            cardHtml += '<div class="card"><img src="images/back.png" alt="" /></div>';
        }
        return cardHtml;
    }
    function updateScore() {
        var correctSelections = $(".matched").length;
        var totalCards = $(".card").length;
        var percentage = (correctSelections / totalCards) * 100;
        var highScore = localStorage.getItem("highScore") || 0;

        $("#correct").text("Percentage: " + percentage.toFixed(2) + "%");

        if (percentage > highScore) {
            localStorage.setItem("highScore", percentage);
            $("#high_score").text("High Score: " + percentage.toFixed(2) + "%");
        }

        if (correctSelections === totalCards) {
            // All cards matched, end of the game
            alert("Congratulations! You completed the game.");
            initializeGame(); // Restart the game
        }
    }
// Function to shuffle an array
function shuffleArray(array) {
    var currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
}

function saveSettings(){
    var playerName = $("#player_name").val();
    var numCards = $("#num_cards").val();

            // Save settings in session storage
            sessionStorage.setItem("playerName", playerName);
            sessionStorage.setItem("numCards", numCards);

            // Restart the game with new settings
            initializeGame(numCards);
}

// Attach event listeners
$(document).ready(function() {
    // Initialize tabs
    $('#tabs').tabs();
   
    initializeGame();

    // Attach click event to Save Settings button
    $('#save_settings').click(saveSettings);

    // Attach click event to New Game link
    $('#new_game a').click(startNewGame);
});
