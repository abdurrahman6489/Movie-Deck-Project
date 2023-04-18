const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const movieContainer = document.querySelector(".movie-container");
// console.log(movieContainer);
let movies = [];
let newMovies = [];
async function makeApiCall(){
    const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1");
    const data = await response.json();
    movies.push(...data.results);
    newMovies.push(...data.results);
    // console.log(movies);
    createMovieCards(movies);
}
makeApiCall();
function createMovieCards(data){
    data.forEach(movie=>{
        let {original_title,poster_path,vote_average, vote_count,id} = movie;
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${IMAGE_URL+poster_path}" alt=${original_title}/>
        <div class="title">${original_title}</div>
        <div class="other-details hide">
        <div class="vote-count">vote count : ${vote_count}</div>
        <div class="vote-average">vote average : ${vote_average}</div>
        </div>
        <button class="show-details" id="${id}">Show More</button>`;
        movieContainer.append(card);
    })
    const showMoreBtn = document.querySelectorAll(".show-details");
    let btnClickedStatus = new Array(showMoreBtn.length).fill("true");
    showMoreBtn.forEach((btn,index)=>{
        btn.addEventListener("click",(e)=>{
            const currentCard = e.currentTarget.closest(".card");
            const otherDetailsElem = currentCard.querySelector(".other-details");
            // console.log(otherDetailsElem);
            otherDetailsElem.classList.toggle("hide");
            if(btnClickedStatus[index]) {
                e.currentTarget.innerHTML = "Hide";
                btnClickedStatus[index] = false;
            }
            else {
                e.currentTarget.innerHTML = "Show More";
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
sortMovies(2,newMovies);
sortMovies(3,newMovies);
function sortMovies(sortBy_index,array){
    array.sort((a,b)=>{
        if(sortBy_index === 0){
            return b.vote_count - a.vote_count;
        }
        else if(sortBy_index === 1){
            return a.vote_count - b.vote_count;
        }
        else if(sortBy_index === 2){
            return b.release_date - a.release_date;
        }
        else if(sortBy_index === 3){
            return a.release_date - b.release_date;
        }
    })
    console.log("from function",array);
}
