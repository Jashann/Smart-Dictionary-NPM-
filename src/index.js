import {Api} from "./modules/api";
import {UISelectors} from "./modules/base";
import {UI} from "./modules/dictionary";
import {Dictator} from "./modules/dictator";
import {Bookmarker} from "./modules/bookmarker";
import {Theme} from "./modules/theme";
import QuickSuggestions from "./modules/quickSearch";
import {LocalStorage} from "./modules/localStorage";






class App {

    constructor(){
        this.api = new Api();
        this.quickSuggestions = new QuickSuggestions();
        this.ui = new UI();
        this.dictator = new Dictator();
        this.localStorage = new LocalStorage();
        this.bookmarker = new Bookmarker();
        this.theme = new Theme();
    }


    // Start of getData
    getData(word){
        this.ui.clearResults();
        this.ui.toggleLoader();

        this.api.get(word)
        .then(res=>{
            if(res[0].fl !== undefined)//Correct word spelling has been entered
            {
                this.ui.paintMeaning(res); //Called with arguments of array/arrays returned by api
            }
            else // Word entered is wrong spelt;
                this.ui.paintDidYouMean(res);// Called with array of words:["Coire", "desire", "Zaire", "sire"]
            this.ui.toggleLoader();
        })
        .catch(err=>{
            this.ui.paintError(err); //If Something goes wrong (Internet Connection is down.)
            this.ui.toggleLoader();
        })

    }
    // End of getData


    // Start of loadEventListener
    loadEventListener(){

        const globalC = this;

        // Start of Searching Listeners
        // Adding event Listener for Searching to btn and input
        UISelectors.btn_search.addEventListener("click",checkValid);
        UISelectors.input_lookup.addEventListener("keypress",function(e){
            if(e.key ==="Enter")
                checkValid();
        });
        // Check if input is not empty
        function checkValid(){
            let inputValue = UISelectors.input_lookup.value;
            UISelectors.input_lookup.value = "";


            if(inputValue !== ""){
                globalC.quickSuggestions.clearSuggestions(); //Clearing Suggestions when a word is searched.
                globalC.getData(inputValue); //Calling this call or App class function
                
            }
            
        }
        // End of Searching Listeners


        //Start of QuickSuggestions EventListeners
        UISelectors.suggestions.addEventListener("click", function(e){// on clicking on suggested word enters it into input box
            if(e.target.tagName==="LI"){
                //Clearing Suggestions
                globalC.quickSuggestions.clearSuggestions();
        
                let li = e.target;
                globalC.getData(li.textContent);
                UISelectors.input_lookup.value = "";
            }
        })
        UISelectors.input_lookup.addEventListener("keyup",function(e){ // Gets Suggestions
            let value = UISelectors.input_lookup.value;

            if(e.key === "Enter")
                globalC.quickSuggestions.clearSuggestions();
        
            if(value!==""){
                globalC.quickSuggestions.getSuggestions(value)
                .then(function(res){
                    if(res)
                        globalC.quickSuggestions.createSuggestions(res);
                })
                .catch();
            }
            else //When Empty then clear suggestions
                globalC.quickSuggestions.clearSuggestions();
        })
        //End of QuickSuggestions EventListeners


        // Start of Dictating Related 
        speechSynthesis.addEventListener("voiceschanged", globalC.dictator.populateSelect); // Runs when voices are loaded.
        globalC.dictator.populateSelect();
    
        UISelectors.pitch_range.addEventListener("change", globalC.dictator.pitch_range_OnChange);
        UISelectors.rate_range.addEventListener("change", globalC.dictator.rate_range_OnChange);

        UISelectors.btn_speak.addEventListener("click", function(){
            globalC.dictator.speak(UISelectors.input_to_speak.value);

            // For Storing in Local Storage
            let voiceName = UISelectors.select_voices.selectedOptions[0].value;
            let pitch = UISelectors.pitch_range.value;
            let rate = UISelectors.rate_range.value;

            globalC.localStorage.dictatorAdd(voiceName,rate,pitch);
        })
        UISelectors.btn_stop.addEventListener("click",function(e){
            globalC.dictator.stop();
        });

        UISelectors.result.addEventListener('click',function(e){ //When a word is clicked from results
            e.preventDefault();
            if(e.target.tagName === "IMG"){
                let text = e.target.parentElement.parentElement.textContent; //desire  [di-ˈzī(-ə)r] || desire

                let index = text.indexOf("[");
                if(index>-1) // desire  [di-ˈzī(-ə)r] to remove '[di-ˈzī(-ə)r]' result after this 'desire ' 
                    text = text.substring(0,index-2);
                text = text.trim(); // removes extra spaces
                globalC.dictator.speak(text);
            }
        })

        UISelectors.select_voices.addEventListener('change', (e)=>{
            let selectedVoiceName = UISelectors.select_voices.selectedOptions[0].value;
            globalC.dictator.changeVoice(selectedVoiceName);
        });
        // End of Dictating Related 

        
        // Start of Bookmark
        // Start of addBookmark
        UISelectors.result.addEventListener("click", function(e){
            e.preventDefault();
            if(e.target.id==="bookmark-icon")
            {
                let alreadyPresent = false;
                let h1 = e.target.parentElement.parentElement; 
                let text = h1.getAttribute("value"); // h2.value = word i.e: desire
                let meaning = h1.parentElement.querySelector("ol li").textContent;
                // meaning = to long or hope for : exhibit or feel desire for

                //Getting Data from LocalStorage
                let array2d = globalC.localStorage.bookmarkGet();
                if(array2d){
                    array2d.forEach((array)=>{
                        if(array[0] === text)
                            alreadyPresent = true
                    })
                }

                if(alreadyPresent){
                    globalC.bookmarker.showAlreadyAddedToBookmark(text);
                }
                else{ //if already is false then this runs
                    globalC.bookmarker.showAddedToBookmark(text);
                    globalC.bookmarker.addToBookmarker(text,meaning);
                    globalC.localStorage.bookmarkAdd(text,meaning);
                }
            }
        })
        // End of addBookmark

        // Start of deleteBookmark
        UISelectors.btn_delete.addEventListener("click",function(e){
            e.preventDefault();
            if(UISelectors.btn_delete.textContent==="Select Delete")
                globalC.bookmarker.showState();
            else // when textContent = Delete
            {
                let checkboxes = document.querySelectorAll(UISelectors.checkbox_ADDRESS);
                checkboxes = Array.from(checkboxes);
                let numbers = [];

                checkboxes.forEach(function(checkbox){
                    let input = checkbox.querySelector("input");
                    let id = input.id; //customCheck1 || customCheck2 ...
                    let number = id.charAt(id.length -1); // 1 || 2..
                    if(input.checked){
                        numbers.push(parseInt(number)); // checked number = [1,2] is stored in array
                    }
                });
                globalC.localStorage.bookmarkDelete(numbers);
                globalC.bookmarker.hideState();
                const loadDataFromLocalStorageFNS = globalC.loadDataFromLocalStorage(); //returns object containing loadBookmarker function
                loadDataFromLocalStorageFNS.loadBookmarker();
            }
        })
        // End of deleteBookmark
        // Start of goBackBookmark
        UISelectors.btn_back.addEventListener("click",function(e){
            e.preventDefault();
            globalC.bookmarker.hideState();
        })
        // End of goBackBookmark
        // End of Bookmark


        //Start of Themes EventListeners
        UISelectors.theme_checkboxes.forEach(function(checkbox){
            checkbox.addEventListener( 'change', function() {
            if(this.checked)
                globalC.theme.showBtn();
        });
        });
        UISelectors.theme_btn_apply.addEventListener("click",function(e){
            e.preventDefault();
            let checked = "";
            UISelectors.theme_checkboxes.forEach(function(checkbox){
                if(checkbox.checked){
                    checked = checkbox;
                }   
            })
            globalC.theme.change(checked.id);
        })
        //End of Themes EventListeners

        //Start of Searchable
        document.body.addEventListener("click", function(e){
            if(e.target.classList.contains(UISelectors.searchable_ADDRESS))
            {
                e.preventDefault();
                let word = e.target.textContent; //word = desire
                $('#bookmarker').modal('hide'); //to Hide modal popup if shown
                globalC.getData(word);
            }
        })
        //End of Searchable


        //Start of Highlight
        let highlightedText = "";
        //Start of Showing and Hiding of highlightBox
        document.addEventListener("selectionchange", function(){
            let selection = window.getSelection();

            if(selection.isCollapsed===true) //If nothing is selected so hide.
                globalC.ui.hideHighlight();
            else{
                try{ // to get rid of error showing in console
                    let text = selection.focusNode.data;
                    let anchor_Offset = selection.anchorOffset;
                    let offset = selection.focusOffset;

                    highlightedText = text.substring(anchor_Offset,offset);
                    globalC.ui.showHighlight(highlightedText);
                }
                catch(error){}
            }
        })
        //End of Showing and Hiding of highlightBox

        //Hide highlightBox if already showing
        document.addEventListener('scroll',function(){
            globalC.ui.hideHighlight();
        })
        //Searching by btn-highlight-search
        UISelectors.highlight_btn_search.addEventListener('click',function(){
            globalC.getData(highlightedText);
        });
        //Searching by btn-highlight-pronounce
        UISelectors.highlight_btn_pronounce.addEventListener('click',function(){
            globalC.dictator.speak(highlightedText);
        });
        //End of Highlight

    }
    // End of loadEventListener



    // Start of loadDataFromLocalStorage
    loadDataFromLocalStorage(){

        const globalC = this;

        //Calling functions automatically at initializing
        loadDictator();
        loadBookmarker();
        loadTheme();

        function loadDictator(){
            let object = globalC.localStorage.dictatorGet();
            if(object) //if object is not null
            {
                speechSynthesis.addEventListener("voiceschanged", function(){ // runs once voices are loaded.
                    UISelectors.rate_range.value = object.rate;
                    UISelectors.pitch_range.value = object.pitch;
                    globalC.dictator.pitch_range_OnChange();
                    globalC.dictator.rate_range_OnChange();
                    globalC.dictator.changeVoice(object.voiceName);
                })
            }
        }

        function loadBookmarker(){
            UISelectors.bookmarker_words.innerHTML = "";
            let bookmarkedArray = JSON.parse(localStorage.getItem("bookmarked"));
            if(bookmarkedArray) //if bookmarked is not null
            {
                bookmarkedArray.forEach(function(array){
                    globalC.bookmarker.addToBookmarker(array[0],array[1]); // array[0] = word, array[1]=text
                })
            }
        }

        function loadTheme(){
            let theme = globalC.theme.getThemeLocalStorage();
            globalC.theme.change(theme);
        }

        return{
            loadBookmarker,
        }

    }
    // End of loadDataFromLocalStorage



    init(){
        this.loadEventListener();
        this.loadDataFromLocalStorage();
    }

}

const app = new App();
app.init();