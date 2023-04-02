const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');
const textArea = document.querySelector('#textArea');

async function generateRandomQuote(){
    try {
        // const response = await fetch(APIEndpoint);
        if (response.ok){
            const data = await response.json();
            let quote = data.content;
            showQuote(quote);
        } else {
            throw new Error('server error');
        }
    } catch (error){
        console.error(error);
        let quote = "You must welcome change as the rule but not as your ruler";
        showQuote(quote);
    }
}
// generate quote string
generateRandomQuote()
// show quote in html and verifiy the quote word by word equal user's keypress
function showQuote(quote){
    console.log(quote)
    for (let i = 0; i < quote.length; i++){
        const span = document.createElement('span');
        span.textContent = quote[i];
        quoteEl.appendChild(span);
    }
    let scoreGame = 0;
    let previousLength = textArea.value.length;
    let check = false;
    textArea.addEventListener('input' , (e)=>{
        let userInput = e.target.value;
        let i = userInput.length -1;
        let currentLength = e.target.value.length;
        if (currentLength < previousLength) {
            console.log("item deleted");
            if(quoteEl.children[i+1].classList.contains("green")) {
                scoreGame--
                score.textContent = `Score : ${scoreGame}`
            }
            quoteEl.children[i+1].style.background = "none";
            quoteEl.children[i+1].className = "";
        } else {
            if(userInput.length > 0) {
                if(userInput.charAt(i) === quote.charAt(i)) {
                    check = true;
                    do {
                        scoreGame++;
                        score.textContent = `Score : ${scoreGame}`;
                        quoteEl.children[i].style.background = "green";
                        quoteEl.children[i].classList.add("green");
                        if(quoteEl.children[i].classList.contains("red")){
                            quoteEl.children[i].classList.remove("red");
                        }
                        check = false;
                    } while (check == true);
    
                } else {
                    quoteEl.children[i].style.background = "red";
                    quoteEl.children[i].classList.add("red");
                    if(quoteEl.children[i].classList.contains("green")){
                        quoteEl.children[i].classList.remove("green");
                    }
                }
            } else {
                scoreGame = 0;
                score.textContent = `Score : ${scoreGame}`
            }
        }

        previousLength = currentLength;
    })
}