const parentElement = document.querySelector('.main');
const searchInput = document.querySelector('.input');
const ratingInput = document.querySelector('.rating-select');

let searchValue = "";
let ratings = 0;
let filteredMovies = [];

const URL = 'https://api.github.com/users/bhramarv021';
import moviesDummyData from './moviesDummyData.json' with {type: 'json'};
// console.log("Movies JSON : ",moviesDummyData);

const getMovies = async(url) => {
    try{
        const { data, status } = await axios.get(url);;
        // console.log(data, status);
        if (status === 200)
            return data;
        else {
            throw new Error("Failed to fetch data");
        }
    }catch(e){
        console.error("axios err : ",e);
    }
}

async function loadJSON() {
  const response = await fetch('./moviesDummyData.json');
  const data = await response.json();
//   console.log("loadJSON: ",data);
  return data;
}

const d = await loadJSON();
// console.log("loadJSON ddd: ",d);

const moviesData = await getMovies(URL);
// console.log("Movies Data is : ",moviesData);

const createElement = (element) => document.createElement(element);

const createMovieCard = (movies) => {
    for (let movie of movies) {
        // creating parent container
        const cardContainer = createElement('div');
        cardContainer.classList.add("card", "shadow");

        // creating image container
        const imageContainer = createElement('div');
        imageContainer.classList.add("card-image-container");

        // creating card image
        const imageEle = createElement('img');
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src", movie.img || "https://www.shutterstock.com/image-vector/online-cinema-art-movie-watching-260nw-584655766.jpg");
        imageEle.setAttribute("alt", movie.name || "Movie poster");
        
        imageContainer.appendChild(imageEle);

        cardContainer.appendChild(imageContainer);

        //card details container
        const movieDetailsCont = createElement('div');
        movieDetailsCont.classList.add("movie-details");

        //title in card details container
        const movieTitle = createElement('p');
        movieTitle.classList.add("title");
        movieTitle.innerText = movie.name;
        movieDetailsCont.appendChild(movieTitle)

        //release status section in card details
        const movieReleaseStatus = createElement('p');
        movieReleaseStatus.classList.add("genre");
        movieReleaseStatus.innerText = `Release Status: ${movie.releaseStatus}`;
        movieDetailsCont.appendChild(movieReleaseStatus);

        //rating in card details
        const movieRatingContainer = createElement('div');
        movieRatingContainer.classList.add('ratings');
        
        const movieRatingStarImg = createElement('div');
        movieRatingStarImg.classList.add('start-ratings');

        const starImgSpan = createElement('span');
        starImgSpan.classList.add('material-symbols-outlined', 'cmcm');
        starImgSpan.innerText = 'star';
        movieRatingStarImg.appendChild(starImgSpan)
        
        const starRate = createElement('span');
        starRate.innerText = `${movie.rating}`
        movieRatingStarImg.appendChild(starRate)
        
        movieRatingContainer.appendChild(movieRatingStarImg);

        const movieDuration = createElement('p');
        movieDuration.innerText = movie.runtime;

        movieRatingContainer.appendChild(movieDuration);

        movieDetailsCont.appendChild(movieRatingContainer);
        cardContainer.appendChild(movieDetailsCont);
        parentElement.appendChild(cardContainer);
    }
}

function getFilteredData() {
    filteredMovies = searchValue?.length > 0 ? moviesDummyData.filter((val) => {
        let movieName = val.name.toLowerCase();
        let actorsName = val.actors.map(val => val.toLowerCase());
        return movieName.includes(searchValue) || actorsName.includes(searchValue);
    }) : moviesDummyData ;
    // console.log("filteredMovies ss : ",filteredMovies, ratings);
    if (ratings > 0) {
        filteredMovies = filteredMovies.filter(val => val.rating >= ratings)
    }
    //  else {
    //     filteredMovies.filter(val => val.rating >= ratings)
    // }
    parentElement.innerHTML = "";
    createMovieCard(filteredMovies);
    // return filteredMovies;
}

function handleSearch(event) {
    // console.log(event.target.value);
    searchValue = event.target.value.toLowerCase();
    getFilteredData();
    // let filterBySearch = getFilteredData();
    // parentElement.innerHTML = "";
    // createMovieCard(filterBySearch);
}

function debounce (callback, delay) {
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        },delay)
    }
}

function handleRatingSelector(event) {
    ratings = event.target.value;
    // console.log("ratingFilter : ",ratings);
    getFilteredData();
}

const debounceSearch = debounce(handleSearch, 500);
searchInput.addEventListener("keyup", debounceSearch);
ratingInput.addEventListener("change", handleRatingSelector);


createMovieCard(moviesDummyData);