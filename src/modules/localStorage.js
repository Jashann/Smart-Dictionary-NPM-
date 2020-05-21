//Start of LocalStorage
class LocalStorage{
    
    constructor(){
        this.bookmarkArray = null;
    }


    bookmarkAdd(text,meaning){
        if(localStorage.getItem("bookmarked")) // if already present this would run. 
        {
            this.bookmarkArray = JSON.parse(localStorage.getItem("bookmarked"));
            this.bookmarkArray.push([text,meaning]);
        }
        else // if nothing is stored, this would run, as null has been returned
            this.bookmarkArray = [[text,meaning]];
        
        localStorage.setItem("bookmarked", JSON.stringify(this.bookmarkArray));
    }

    bookmarkGet(){
        return JSON.parse(localStorage.getItem("bookmarked"));
    }

    dictatorAdd(voiceName,rate,pitch){
        let object = {
            voiceName,
            rate,
            pitch
        }
        localStorage.setItem("dictator",JSON.stringify(object));
    }

    dictatorGet(){
        return JSON.parse(localStorage.getItem("dictator"));
    }

    bookmarkDelete(nummbers){
        let array2d = JSON.parse(localStorage.getItem("bookmarked"));// [["desire", "to long or hope for : exhibit or feel desire for"],]
        let newArray2d = [];

        nummbers.forEach(function(number,index){
            newArray2d.push(array2d.slice(number-1, number)) ;
        });

        array2d = array2d.filter(function(arr1){
            let toBeDeleted = false;

            // arr1 = ["desire", "to long or hope for : exhibit or feel desire for"]... till all present words
            // arr2 = ["crave", " to ask for earnestly : beg, demand "], those which are to be deleted

            newArray2d.forEach(function(arr2){ 
                
                if(arr1[0] === arr2[0][0]){
                    toBeDeleted = true;
                }
            })
            if(!toBeDeleted)
                return arr1;
        });
        localStorage.setItem("bookmarked", JSON.stringify(array2d) );
    }
}
//End of LocalStorage


export {LocalStorage};