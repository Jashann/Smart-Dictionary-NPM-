import {UISelectors}  from "./base";

//Start of QuickSuggestions
class QuickSuggestions {

    constructor(){

    }

    async getSuggestions(word){
        try{
            const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
            const json = await response.json();
            return json;
        }
        catch(err){}

        
    }

    clearSuggestions(){
        UISelectors.suggestions.innerHTML = "";
    }

    createSuggestions(wordsArr,limit=10){
        //Clearing Suggestions
        this.clearSuggestions();

        wordsArr.forEach(function(wordObj,index){
            if(index < limit)
            {
                let div = document.createElement("li");
                div.classList.add("lead");
                div.textContent = wordObj.word;
                UISelectors.suggestions.append(div);
            }
        })
    }


}
//End of QuickSuggestions

export default QuickSuggestions;