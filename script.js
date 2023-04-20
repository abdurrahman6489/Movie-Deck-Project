const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const movieContainer = document.querySelector(".movie-container");
const inputSearch = document.querySelector(".search");
let searchedMovie = "";
let favoriteMovies = [];
// console.log(movieContainer);
let movies = [];
let newMovies = [];
async function makeApiCall(sortBy_Index=4,string = ""){
    const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1");
    const data = await response.json();
    movies.length = 0;
    newMovies.length = 0;
    movies.push(...data.results);
    newMovies.push(...data.results);
    console.log(newMovies);
    console.log("from api call",string);
    if(string!=="") {
        let newArray = newMovies.filter(movie=>movie.title.toLowerCase().includes(string.toLowerCase()));
        console.log(newArray);
        createMovieCards(newArray);
    }
    else{
        if(sortBy_Index<4){
            newMovies.sort((a,b)=>{
                if(sortBy_Index === 0){
                    return b.vote_average - a.vote_average;
                }
                else if(sortBy_Index === 1){
                    return a.vote_average - b.vote_average;
                }
                else if(sortBy_Index === 2){
                    return b.release_date.localeCompare(a.release_date)  ;
                }
                else if(sortBy_Index === 3){
                    return a.release_date.localeCompare(b.release_date);
                }
            })
        }
        createMovieCards(newMovies);
    }   
}
function createMovieCards(data){
    data.forEach(movie=>{
        let {title,poster_path,vote_average, vote_count,id,release_date} = movie;
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${IMAGE_URL+poster_path}" alt=${title}/>
        <div class="title">${title}</div>
        <div class="other-details hide">
        <div class="vote-count">Release date : ${release_date}</div>
        <div class="vote-count">No. of rating : ${vote_count}</div>
        <div class="vote-average">Rating : ${vote_average}</div>
        </div>
        <div class="show-details-favorite">
        <button class="show-details" >Show More</button>
        <button class="favorite" id="${id}" onclick=addFavorite(this)><i class="fa-sharp fa-regular fa-bookmark"></i></button>
        </div>`;
        movieContainer.appendChild(card);
    })
    const showMoreBtn = document.querySelectorAll(".show-details");
    let btnClickedStatus = new Array(showMoreBtn.length).fill("true");
    showMoreBtn.forEach((btn,index)=>{
        btn.addEventListener("click",(e)=>{
            const currentCard = e.currentTarget.closest(".card");
            const otherDetailsElem = currentCard.querySelector(".other-details");
            otherDetailsElem.classList.toggle("hide");
            if(btnClickedStatus[index]) {
                e.currentTarget.innerHTML = "Show less";
                btnClickedStatus[index] = false;
                e.currentTarget.classList.add("active");
            }
            else {
                e.currentTarget.innerHTML = "Show More";
                e.currentTarget.classList.remove("active");
                btnClickedStatus[index] = true;
            }
        })
    })
}
function deleteMovieCards(){
    while(movieContainer.firstChild){
        movieContainer.removeChild(movieContainer.firstChild);
    }
}
function sortMovies(sortBy_index,array){
    array.sort((a,b)=>{
        if(sortBy_index === 0){
            return b.vote_average - a.vote_average;
        }
        else if(sortBy_index === 1){
            return a.vote_average - b.vote_average;
        }
        else if(sortBy_index === 2){
            return b.release_date.localeCompare(a.release_date)  ;
        }
        else if(sortBy_index === 3){
            return a.release_date.localeCompare(b.release_date);
        }
    })
    return array;
}
const sortElem = document.querySelector(".rating-release");
sortByRatingRelease();
function sortByRatingRelease(){
    let selectedIndex = 4;
    sortElem.addEventListener("change",(event) => {
        selectedIndex = event.currentTarget.options.selectedIndex;
        console.log(`selected Index is ${selectedIndex}`);
        deleteMovieCards();
        makeApiCall(selectedIndex);
    })
    if(selectedIndex>3)
    {
    deleteMovieCards();
    makeApiCall(selectedIndex);
    }
}
inputSearch.addEventListener("input",(event) => {
    searchedMovie = event.currentTarget.value;
    console.log(searchedMovie);
    updateDebounce(searchedMovie);
})
function debounce(cb, delay = 1000){
    let timeout;
    return (...args)=>{
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            cb(...args);
        },delay);
    }
}
const updateDebounce = debounce((text)=>{
    console.log("from debounce",text);
    deleteMovieCards();
    makeApiCall(4,text);
})
function addFavorite(favoriteBtn){
    // console.log(favoriteBtn);
    const iconElem = favoriteBtn.querySelector(".fa-bookmark");
    let movieId = favoriteMovies.indexOf(favoriteBtn.id);
    if(movieId===-1){
        favoriteBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
        favoriteMovies.push(favoriteBtn.id);
        // console.log(favoriteMovies);
    }
    else{
        favoriteBtn.innerHTML = `<i class="fa-sharp fa-regular fa-bookmark"></i>`;
        favoriteMovies.splice(movieId,1);
        // console.log(favoriteMovies);
    } 
}