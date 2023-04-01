const APIEndpoint = "http://api.quotable.io/random";

const time = document.querySelector('.time');
const score = document.querySelector('.score');
const quoteEl = document.querySelector('.quote');

async function generateRandomQuote(){
    try {
        const response = await fetch(APIEndpoint);
        if (response.ok){
            const data = await response.json();
            let quote = data.content;
            showQuote(quote);
        }
    } catch (error){
        console.log(error , response.status)
    }
}

generateRandomQuote()

function showQuote(quote){
    quoteEl.textContent = quote
}