

const searchForm = document.querySelector (".search-form");
const searchFormInput = document.querySelector (".search-form__input");
const searchFormClose = document.querySelector (".search-form__close");
const magnifyingGlass = document.querySelector (".magnifying-glass");
const url = "https://api.themoviedb.org/3/discover/movie?"+
"sort_by=popularity.desc&api_key=888e470488d61ffa8297108bbb2b553c";

searchFormInput.addEventListener ('input', toggleCloseButton);
searchFormClose.addEventListener ('click', clearSearch);
searchForm.addEventListener ('submit', search);
searchFormInput.addEventListener ('focus', addFocusClass);
searchFormInput.addEventListener ('blur', removeFocusClass);
magnifyingGlass.addEventListener ('click', setFocus);

searchFormInput.focus ();
getData (url);


function setFocus () {
    searchFormInput.focus ();
}

function addFocusClass () {
    searchForm.classList.add ("focus");
}

function removeFocusClass () {
    searchForm.classList.remove ("focus");
}

async function getData (url, isTrailer = false) {
    const response = await fetch (url);
    const data = await response.json();
    if (isTrailer) showTrailer (data);
    else showData (data);
}

function clearSearch () {
	searchFormInput.value = '';
	searchFormInput.focus ();
	searchFormClose.classList.add ("hide");
  magnifyingGlass.classList.remove ("hide");
}

function toggleCloseButton () {
	if (searchFormInput.value.length > 0) {
      searchFormClose.classList.remove ("hide");
      magnifyingGlass.classList.add ("hide");
  }
	else {
      searchFormClose.classList.add ("hide");
      magnifyingGlass.classList.remove ("hide");
  }
}

function search (e){
	  const searchFormInput = searchForm.querySelector ('.search-form__input');
    const keyword = searchFormInput.value;
  	const url = "https://api.themoviedb.org/3/search/movie?"+
                `query=${keyword}&api_key=888e470488d61ffa8297108bbb2b553c`;	
	  e.preventDefault();
    if (keyword.length < 3) return false;  
    getData (url);
}

function connectLinks () {
    const movieLinks = document.querySelectorAll (".movie-link");
    movieLinks.forEach (el => {
        el.addEventListener ('click', function (e){
            const url = `https://api.themoviedb.org/3/movie/${el.dataset.movie}}/videos?api_key=888e470488d61ffa8297108bbb2b553c`;
            // const url = `https://api.themoviedb.org/3/movie/${el.dataset.movie}}`+
            //       "/videos?api_key=888e470488d61ffa8297108bbb2b553c&append_to_response=videos";
            getData (url, true);
        });
    });  
}

function showTrailer (data) {
		if (!data.results.length) return false;
    let url = `https://www.youtube.com/watch?v=${data.results[0].key}`
    window.open (url,'_blank');
}

function showData (data) {
	const mainContainer = document.querySelector (".main__container");
	mainContainer.innerHTML = '';
	
	if (!data || !data.results || !data.results.length) {	
		const movie = document.createElement ('div');
		movie.classList.add ('no-results');

    if(data && data.status_message) movie.textContent = data.status_message;
		else movie.textContent = "Ничего не найдено";

		mainContainer.append (movie);
		return false;
	}
	
	for (let i=0; i<data.results.length; i++) {
		  if (!data.results[i].poster_path || !data.results[i].vote_average) continue;
		  const movie = document.createElement ('div');
		  movie.classList.add ('movie');
		  mainContainer.append (movie);

		  const a = document.createElement ('a');
		  a.dataset.movie = data.results[i].id;
		  a.href = "javascript:void(0);";
			//a.title = "Watch movie";
		  a.classList.add ('movie-link');
		  movie.append (a);

		  const img = document.createElement ('img');
		  img.src = "https://image.tmdb.org/t/p/w1280"+ data.results[i].poster_path;
		  img.alt = "video-poster";
		  // img.dataset.movie = data.results[i].id;
		  a.append (img);

		  const movieInfo = document.createElement ('div');
		  movieInfo.classList.add ('movie__info');
		  movie.append (movieInfo);

		  const movieTitle = document.createElement ('h3');
			if (data.results[i].title.length > 25) movieTitle.classList.add ("small-text");
		  movieTitle.textContent = data.results[i].title;
		  movieInfo.append (movieTitle);
		  
		  const movieRating = getRating (data.results[i].vote_average);
		  movieInfo.append (movieRating);
	}
	connectLinks();
}

function getRating (grade){
	const movieRating = document.createElement ('div');
	const ratingValue = grade / 2;
	let type;	
	
	movieRating.classList.add ('movie__rating');

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
