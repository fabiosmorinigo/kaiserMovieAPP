

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    Headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    params: {
        'api_key': API_KEY,
        language: Navigator.language || 'es',
        
    }
});


function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'))
    let movies;

    if(item){
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();


    if(likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
  

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
    getTrendingMoviesPreview()
    getLikedMovies()
}
//call to APIs
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entrie) => {
        if(entrie.isIntersecting) {
            const url = entrie.target.getAttribute('data-img')
            entrie.target.setAttribute('src', url)
        }
    })
});

function createMovies(movies, container, {lazyLoad = false, clean = true} = {}) {
    
    if(clean) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
   

        const movieIMG = document.createElement('img');
        movieIMG.classList.add('movie-img');
        movieIMG.setAttribute('alt', movie.title);
        movieIMG.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path);

            movieIMG.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
            });
            
            movieIMG.addEventListener('error', () => {
                movieIMG.setAttribute('src', 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress')
            });
            
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        }); 

        if(lazyLoad) {
            lazyLoader.observe(movieIMG)
        }
        document.body.scrollLeft = 0;
        document.documentElement.scrollLeft = 0;
        movieContainer.appendChild(movieIMG);
        movieContainer.appendChild(movieBtn)
        container.appendChild(movieContainer)
    });
}

function createCategories(categories, container) {
    container.innerHTML = '';

    categories.forEach(category => {

        
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');


        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        categoryTitle.classList.add('category-title');
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
            console.log(category.id)
        })
        categoryTitle.setAttribute('id', 'id' + category.id);

        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

async function getTrendingMoviesPreview() {
    const { data } = await api('/trending/movie/day');

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, trendingMoviesPreviewList, true)
}

async function getCategoryPreview() {
    const { data } = await api('/genre/movie/list', {
        params: {
            // language:'es',
        }
    });
    // '&language=es-Mx
    const categories = data.genres;

    categoriesPreviewList.innerHTML = ''

    createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection, {lazyLoad: true});
}
function getPageTrendingMovieByCategory(id) {
    return async function () {
     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
 
     const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 50);
     const pageIsNotMax = page < maxPage;
 
     if(scrollIsBottom && pageIsNotMax) {
         page++;
         const { data } = await api('/discover/movie', {
             params: {
                with_genres: id,
                page,
             },
         });
         const movies = data.results;
         createMovies(movies, genericSection, {lazyLoad: true, clean: false},);
 
         }
     }
 };

async function getMoviesBySearch(query) {
    const { data } = await api('/search/movie', {
        params: {
            query,
        }
    });

    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection);
}

function getPageTrendingMovieBySearch(query) {
   return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('/search/movie', {
            params: {
                query,
                page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {lazyLoad: true, clean: false},);

        }
    }
};

async function getTrendingMovies() {
    const { data } = await api('/trending/movie/day');

    const movies = data.results;

    maxPage = data.total_pages;
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}


async function getPageTrendingMovie() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('/trending/movie/day', {
            params: {
                page,
                
            },
        });
    
        const movies = data.results;
    
        createMovies(movies, genericSection, {lazyLoad: true, clean: false},);

    }

};

async function getMovieById(id) {
    const { data: movie } = await api('/movie/' + id, {
        params: {
            // language:'es',
            // include_image_language: 'en,null',
        }
    });

    const movieImgUrl =  'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = 
    
    `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0,0,0,0) 29.17%),

    
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
    const {data} = await api('/movie/' + id + '/recommendations');

    const relatedMovies = data.results;
    createMovies(relatedMovies, relatedMoviesContainer);
    
}


function getLikedMovies() {
    const likedMovies  = likedMoviesList();

    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likeMoviesListFav, {lazyLoad: true, clean: true})
}

