
// document.addEventListener("load", function(){
 
// });

const searchForm = document.querySelector (".search-form");
const searchFormInput = document.querySelector (".search-form__input");
const searchFormClose = document.querySelector (".search-form__close");

searchFormInput.focus();
searchFormClose.addEventListener ('click', function () {
   searchFormInput.value = '';
   searchFormInput.focus ();
   searchFormClose.classList.add ("hide");
   //searchFormInput.blur ();
});

searchFormInput.addEventListener ('input', function () {
  // console.log ('!!!');
  if (searchFormInput.value.length > 0) searchFormClose.classList.remove ("hide");
  else searchFormClose.classList.add ("hide");
  //searchFormInput.focus ();
  //searchFormInput.blur ();
});

searchForm.addEventListener ('submit', function(e){
    e.preventDefault();
    const searchFormInput = searchForm.querySelector ('.search-form__input');
    const value = searchFormInput.value;
    if (value.length < 3) return false;

    const url = "https://api.themoviedb.org/3/search/movie?" +
    `query=${value}&api_key=888e470488d61ffa8297108bbb2b553c`;
    //console.log (url);
    getData (url);
});


const url = "https://api.themoviedb.org/3/discover/movie?"+
"sort_by=popularity.desc&api_key=888e470488d61ffa8297108bbb2b553c";

async function getData (url) {
  const res = await fetch (url);
  const data = await res.json();
  showData (data);
}

// getData (url);

function showData (data) {
  //console.log (data);
  const mainContainer = document.querySelector (".main__container");
  mainContainer.innerHTML = '';

  for (let i=0; i<data.results.length; i++) {
      const movie = document.createElement ('div');
      movie.classList.add ('movie');
      mainContainer.append (movie);

      const img = document.createElement ('img');
      img.src = "https://image.tmdb.org/t/p/w1280"+ data.results[i].poster_path;
      img.alt = "video-poster";
      movie.append (img);

      const movieInfo = document.createElement ('div');
      movieInfo.classList.add ('movie__info');
      movie.append (movieInfo);

      const movieTitle = document.createElement ('h3');
      movieTitle.textContent = data.results[i].title;
      movieInfo.append (movieTitle);
      
      const movieRating = getRating (data.results[i].vote_average);
      movieInfo.append (movieRating);
  }
}

function getRating (vote){
  
  let type;
  const movieRating = document.createElement ('div');
  movieRating.classList.add ('movie__rating');

  const ratingValue = vote / 2;

  for (let i=1; i<=5; i++) {
      if (i <= Math.ceil (ratingValue) ) {      
        if ( Math.ceil (ratingValue) == i && (ratingValue % 1) < 0.5) type = 'half';
        else type = 'full';
      }
      else type = 'empty';

      const star = `<svg><use xlink:href="#star-${type}"></use></svg>`
      movieRating.insertAdjacentHTML ('beforeend', star);
  }

  return movieRating;
}


// function getRating (vote){
//   //const ratingValue = Math.ceil (vote / 10);
//   const ratingValue = vote / 10 / 2;
//   const ratings = querySelectorAll (".rating");

//   ratings.forEach (rating => {
//     stars = rating.querySelectorAll (".star");	
//     stars.forEach ( (star, index) => {
        
//       if(index+1 <= ratingValue){
//           const leftPoly = star.querySelector ("[data-side='left']");
//           leftPoly.classList.add ("active");
//           if (ratingValue % 1 > 0.5) {
//               rightPoly.classList.add ("active");
//           }
//       }
//     });
//   });
// }