//Start of Api
class Api{

    constructor(word){
        this.apiKey = "e1fc09e6-9722-4699-9353-2d99d4668fbd";
    }
    
    async get(word){
        let response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${this.apiKey}`);
        let json = response.json();
        return json;
    }

}
//End of Api

export {Api};