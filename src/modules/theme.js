import {UISelectors} from "./base";
//Start of Themes
class Theme{//UII is parameter

    showBtn(){
        UISelectors.theme_btn_apply.style = 
        "display:inline-block";
    }
    
    change(id){
        UISelectors.body.classList.remove("light");
        UISelectors.body.classList.remove("colorful");
        UISelectors.body.classList.remove("dark");
        UISelectors.body.classList.add(id)
        this.saveToLocalStorage(id);

    }

    saveToLocalStorage(id){
        localStorage.setItem("theme", id);
    }

    getThemeLocalStorage(){
        return localStorage.getItem("theme");
    }

}
//End of Themes

export {Theme};