import {UISelectors} from "./base";

//Start of Dictator (Rule Broken -> UIselector used here)
class Dictator
{

    constructor(){
        this.speechSyn = null;
    }
    

    populateSelect(){

        // setTimeout(function(){ //To make browser wait so voices have been loaded
        this.speechSyn = window.speechSynthesis;

        if(UISelectors.select_voices.options.length === 0 )
        {
            const voices = this.speechSyn.getVoices();
            voices.forEach(voice=>{
                // Creating option with textContent and value Attribute
                if(voice.lang.includes("en"))// Filtering English Voices
                {
                    let option = document.createElement("option");
                    option.textContent = voice.name;
                    option.setAttribute("value",voice.name);
                    UISelectors.select_voices.appendChild(option);
                }        
            });
        }
        
        // },50);       
    }

    speak(text){   
        // New keyword is needed for Utterance not for speechSynthesis above 
        const utterance = new window.SpeechSynthesisUtterance();
        let selectedVoiceName = UISelectors.select_voices.selectedOptions[0].value;
        let selectedVoice;
        const voices = this.speechSyn.getVoices();
        voices.forEach((voice)=>{
            if(voice.name === selectedVoiceName)
                selectedVoice = voice;
        })
        utterance.text = text;
        utterance.voice = selectedVoice;
        utterance.pitch = UISelectors.pitch_range.value;
        utterance.rate = UISelectors.rate_range.value;
        this.speechSyn.speak(utterance);
    }
    pitch_range_OnChange(e){
        UISelectors.pitch_value.textContent = "Pitch: "+UISelectors.pitch_range.value;
    }
    rate_range_OnChange(e){
        UISelectors.rate_value.textContent = "Rate: "+UISelectors.rate_range.value;
    }

    //Local Storage
    changeVoice(voiceName){

        // setTimeout(function(){ //To make browser wait so voices have been loaded

            let options = UISelectors.select_voices.children; //options = html collection of all options
            options = Array.from(options);

            let selectedOption;
            options.forEach((option)=>{
                if(option.getAttribute("value") === voiceName)
                    selectedOption = option;
            })

            selectedOption.selected = "selected";



        // },50)

    }
    stop(){
        this.speechSyn.cancel();
    }

}
//End of Dictator


export {Dictator};