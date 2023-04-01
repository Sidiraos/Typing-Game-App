const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');
const textArea = document.querySelector('#textArea');

async function generateRandomQuote(){
    try {
        const response = await fetch(APIEndpoint);
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

    textArea.addEventListener('input' , (e)=>{
        let userInput = e.target.value;
        let i = userInput.length -1
        if(userInput.length > 0) {
            if(userInput.charAt(i) === quote.charAt(i)) {
                console.log("checked")
                console.log(quoteEl.children[i]);
                quoteEl.children[i].style.background = "green";
        
            } else {
                console.log("unchecked")
                console.log(quoteEl.children[i]);
                quoteEl.children[i].style.background = "red";

            }
        }
    })
}