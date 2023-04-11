const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');
const textArea = document.querySelector('#textArea');
let userTime = 59
time.textContent = "Time : " + userTime
let quote;

async function generateRandomQuote(){
    try {
        const response = await fetch(APIEndpoint);
        if (response.ok){
            const data = await response.json();
            quote = data.content;
        } else {
            quote = "Server error: " + response.status;
            throw new Error('server error' , response.status);
        }
    } catch (error){
        console.error(error);
        quote = "You must welcome change as the rule but not as your ruler";
    }

}
// generate quote string
generateRandomQuote().then(()=> {
    playGame()
})
// show quote in html and verifiy the quote word by word equal user's keypress
let scoreGame = 0;
let previousLength = textArea.value.length;
let scoreForQuote = 0;

function playGame(){
    console.log(quote);
    console.log(quote.length);
    textArea.setAttribute('maxlength' , `${quote.length}`);
    showQuote();
    if(lock) return;
    textArea.addEventListener('input' , handleEventInputUser);
}

function showQuote(){
    for (let i = 0; i < quote.length; i++){
        const span = document.createElement('span');
        span.textContent = quote[i];
        quoteEl.appendChild(span);
    }
    lock = false;
}
// handle score validation and mark quote as the correct
function addMarkDownAndScore(check , trueColor , wrongColor, parentEl , childItem) {
    do {
        if(check){
            scoreGame++;
            scoreForQuote++;
            score.textContent = `Score : ${scoreGame}`;
        }
        parentEl.children[childItem].style.background = trueColor;
        parentEl.children[childItem].classList.add(trueColor);
        if(parentEl.children[childItem].classList.contains(wrongColor)){
            parentEl.children[childItem].classList.remove(wrongColor);
        }
        check = false;
    } while (check == true);
}
// handle  user input
function handleEventInputUser(e){
    let userInput_string = e.target.value;
    let i = userInput_string.length -1;
    let currentLength = e.target.value.length;
    // verify if user backspace or deleted word
    if (currentLength < previousLength) {
        console.log("item deleted");
        for (let j = quoteEl.children.length - 1; j >= currentLength; j--) {
            if (quoteEl.children[j].classList.contains("green")) {
                scoreGame--;
                scoreForQuote--;
                score.textContent = `Score : ${scoreGame}`
            }
            quoteEl.children[j].style.background = "none";
            quoteEl.children[j].className = "";
        }
    } else {
        if(userInput_string.length > 0) {
            if(userInput_string.charAt(i) === quote.charAt(i)) {
                // green if true , red if false
                addMarkDownAndScore(true , "green" , "red" , quoteEl , i)
            } else {
                addMarkDownAndScore(false , "red" , "green" , quoteEl , i)
            }
        } else {
            scoreGame = scoreGame;
            scoreForQuote = scoreForQuote;
            score.textContent = `Score : ${scoreGame}`
        }
    }

    previousLength = currentLength;
    // if we finished the previous string and is correct we generate new string
    // #######################################
    if(scoreForQuote == quote.length){
        console.log("mytimer" , currentTime + 10)
        mytimer = addTimer(currentTime + 10)
        lock = true;
        continueGame();
    }
}
// lock variable for handling spaming when quotes is finished and API is fetching to avoid user to spam
let lock = false;
function continueGame(){
    // if we not restart the game 
    quoteEl.textContent= "";
    textArea.value = "";
    previousLength = 0;
    scoreForQuote = 0;
    console.log("Score for quote at the end" ,scoreForQuote);
    // generate quote string
        generateRandomQuote().then(()=> {
            playGame()
        })
}
// restart reset game state
function restartGame (){
    clearInterval(myInterval);
    mytimer = addTimer(userTime)
    scoreGame = 0;
    formatDataAndShowDOM(userTime)
    score.textContent = "Score : " + scoreGame
    textArea.addEventListener('input' , verifyLength)
    document.querySelector('.timeout').classList.remove('visible')
    // restore defaut style in css before timer style like when we loaded the page
    // element time and score in HTML
    styleTimerAndScoreElement(90 , time , "rgb(0, 0, 0)" , "rgb(82, 82, 81)")
    // styleTimerAndScoreElement(90 , score , "rgb(0, 0, 0)", "rgb(82, 82, 81)")
    continueGame();
}
// handle timer
function addTimer(timer){
    let mytimer = timer
    const updateTimer = (timer)=> {
        return mytimer--;
    }
    return updateTimer;
}
// add timer 
let mytimer = addTimer(userTime);
let myInterval;
let currentTime;
function activeTimer(){
         myInterval = setInterval(()=>{
         currentTime = mytimer()
        formatDataAndShowDOM(currentTime) ;
        // style our timer && score element
        styleTimerAndScoreElement(currentTime , time , "rgb(248, 137, 15)" , "rgb(105, 63, 144)")
        // styleTimerAndScoreElement(currentTime , score , "rgb(166, 3, 105)", "rgb(232, 180, 0)")
        if(currentTime == 0) {
            clearInterval(myInterval);
            textArea.removeEventListener('input', handleEventInputUser)
            // show time is out pop up timer
            document.querySelector('.timeout').classList.add('visible')
        }
    } , 1000);
}
// format data time
function formatDataAndShowDOM(timer){
    if(timer <= 60) {
        time.textContent = "Time : " + timer
    } else {
        let minute = Math.floor(timer / 60);
        let remainingSecond = Math.floor(timer % 60);
        remainingSecond > 10 ? rehandleEventInputUsermainingSecond : "0" + remainingSecond;
        time.textContent = "Time " + minute + ":" + remainingSecond
    }
}
// add style when timer start
function styleTimerAndScoreElement(deg, el , color1 , color2) {
    let degValue = Math.floor(Math.random()* (deg / 360) * 360);
    el.style.background = "linear-gradient("+degValue+"deg"+ "," + color1 + ","+color2 + ")";
}
// handle button esc when user presses for restart game
document.addEventListener('keydown' , restartHandler)

function restartHandler(e){
    if (e.key === "Escape" || e.key === "Esc") {
        textArea.focus()
        restartGame();
        e.preventDefault()
    } 
}

// start timer when writing text
textArea.addEventListener('input' , verifyLength)
function verifyLength (e){
    if (textArea === document.activeElement && textArea.value.length == 1){
    activeTimer();
}   textArea.removeEventListener('input', verifyLength)
}