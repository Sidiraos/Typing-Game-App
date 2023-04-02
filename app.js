const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');
const textArea = document.querySelector('#textArea');

let quote;

async function generateRandomQuote(){
    try {
        // const response = await fetch(APIEndpoint);
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
function addMarkDownAndScore(check , trueColor , wrongColor, parentEl , i) {
    do {
        if(check){
            scoreGame++;
            scoreForQuote++;
            console.log("scoreGame" ,scoreGame)
            console.log("Score for quote" ,scoreForQuote);
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

function handleEventInputUser(e){
    let userInput_string = e.target.value;
    let i = userInput_string.length -1;
    let currentLength = e.target.value.length;
    if (currentLength < previousLength) {
        console.log("item deleted");
        if(quoteEl.children[i+1].classList.contains("green")) {
            scoreGame--;
            scoreForQuote--;
            score.textContent = `Score : ${scoreGame}`
        }
        quoteEl.children[i+1].style.background = "none";
        quoteEl.children[i+1].className = "";
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

function restartGame (){
    // restart timer
    scoreGame = 0;
    continueGame();
}

function addTimer(timer){
    let mytimer = timer
    const updateTimer = (timer)=> {
        return mytimer--;
    }
    return updateTimer;
}

let mytimer = addTimer(60);

let myInterval = setInterval(()=>{
    let timer = mytimer()
    formatDataAndShowDOM(timer) ;
    // style our timer && score element
    styleTimerAndScoreElement(timer , score , time)
    if(timer == 0) {
        clearInterval(myInterval);
        textArea.removeEventListener('input', handleEventInputUser)
    }
} , 1000);

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

function styleTimerAndScoreElement(timer, scoreElement , timerEl) {
    let degValue = Math.floor(Math.random()* (timer / 360) * 360);
    scoreElement.style.background = "linear-gradient("+degValue+"deg"+", rgb(248, 137, 15), rgb(105, 63, 144))"
    timerEl.style.background = "linear-gradient("+degValue+"deg"+", rgb(248, 137, 15), rgb(105, 63, 144))"
   
}
