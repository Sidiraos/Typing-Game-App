const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');
const textArea = document.querySelector('#textArea');
let userTime = 59
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

function showQuote(){
    for (let i = 0; i < quote.length; i++){
        const span = document.createElement('span');
        span.textContent = quote[i];
        quoteEl.appendChild(span);
    }
}
// handle score validation and mark quote as the correct
function addMarkDownAndScore(check , trueColor , wrongColor, parentEl , i) {
    do {
        if(check){
            scoreGame++;
            scoreForQuote++;
            score.textContent = `Score : ${scoreGame}`;
        }
        parentEl.children[i].style.background = trueColor;
        parentEl.children[i].classList.add(trueColor);
        if(parentEl.children[i].classList.contains(wrongColor)){
            parentEl.children[i].classList.remove(wrongColor);
        }
        check = false;
    } while (check == true);
}
// handle  user input
function handleEventInputUser(e){
    let userInput_string = e.target.value;
    let i = userInput_string.length -1;
    let currentLength = e.target.value.length;
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

    if(scoreForQuote == quote.length){
        continueGame(); 
    }
}

function playGame(){
    console.log(quote);
    console.log(quote.length);
    textArea.setAttribute('maxlength' , `${quote.length}`);
    showQuote();
    textArea.addEventListener('input' , handleEventInputUser);
}

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

let mytimer = addTimer(userTime);
let myInterval;
let timer;
function activeTimer(){
         myInterval = setInterval(()=>{
         timer = mytimer()
        formatDataAndShowDOM(timer) ;
        // style our timer && score element
        styleTimerAndScoreElement(timer , score , time)
        if(timer == 0) {
            clearInterval(myInterval);
            textArea.removeEventListener('input', handleEventInputUser)
            document.querySelector('.timeout').classList.add('visible')
            setTimeout(()=>{
                document.querySelector('.timeout').classList.remove('visible')
            } , 3000)
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
function styleTimerAndScoreElement(timer, scoreElement , timerEl) {
    let degValue = Math.floor(Math.random()* (timer / 360) * 360);
    scoreElement.style.background = "linear-gradient("+degValue+"deg"+", rgb(166, 3, 105), rgb(232, 180, 0))"
    timerEl.style.background = "linear-gradient("+degValue+"deg"+", rgb(248, 137, 15), rgb(105, 63, 144))"
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


textArea.addEventListener('input' , verifyLength)
function verifyLength (e){
    if (textArea === document.activeElement && textArea.value.length == 1){
    activeTimer();
}   textArea.removeEventListener('input', verifyLength)
}