//Sacar a favoritos
const getFavorites = () => {
    let favs = [];
    if (localStorage["favorites"] != undefined) {
        favs = localStorage["favorites"].split(',');
    }
    return favs;
};

//Añadir a favoritos
const addToFavorites = (id) => {
    let favs = getFavorites();
    if (favs.indexOf(id) < 0) {
        favs.push(id);
    }
    localStorage["favorites"] = favs.toString();
}

//Borrar de favoritos
const deleteFromFavorites = (id) => {
    let favs = getFavorites();
    favs = favs.filter(function (value, index, arr) {
        return value != id;
    });
    (favs.length === 0) ? delete localStorage["favorites"] : localStorage["favorites"] =
        favs.toString();
}



function inArray(array, id) {
    let fav;
    if (!array) {
        array = [];
    }
    
        if (array.indexOf(id) === -1) {
            
            fav = false;
        } 
            

        else{
        if (array.indexOf(id) > -1) {
            fav = true;
        }
    }
    return fav;
}
