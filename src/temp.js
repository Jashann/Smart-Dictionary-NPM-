//Start of App
const App = (function(Api,LocalStorage,UI,Dictator,Bookmarker){
    //Private Variables & functions
    const UISelectors = UI.getUISelectors();

    


    // Start of loadEventListener
    function loadEventListener(){

        


        
    
        


        

        
        
        
        
        
    }
    // End of loadEventListener


    // Start of loadDataFromLocalStorage
    function loadDataFromLocalStorage(){

        loadBookmarker();
        loadDictator();
        loadTheme();
        
        

        

        
        //Returning to use in deleteBookmark 
        return{
            loadBookmarker,
        }
    }
    // End of loadDataFromLocalStorage

    //Public functions
    return{
        init: function(){
            loadEventListener();
            loadDataFromLocalStorage();
        }
    }
})(Api,LocalStorage,UI,Dictator,Bookmarker);
//End of App

//Calling init
App.init();