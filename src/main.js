const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});


const ip = axios.create({
    baseURL: 'http://ip-api.com/json/',
    Headers: {
        'Content-Type': 'application/json',
    },
})

window.addEventListener('load', getIP)

async function getIP() {
    const {data} = await ip();
    const message = document.createElement('div');
    footerIP.innerHTML = ''
    message.innerHTML = 
    `
    <h2>Tu ubicacion es ${data.country} <sup>${data.countryCode}</sup> - ${data.regionName} region nº ${data.region} en la ciudad de ${data.city}. Tu proveedor de servicio es ${data.isp}. Gracias por visitar mi proyecto 😎</h2>
    
    `

    footerIP.appendChild(message)
}

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entrie) => {
        if(entrie.isIntersecting) {
            const url = entrie.target.getAttribute('data-img')
            entrie.target.setAttribute('src', url)
        }
    })
});


function createMovies(movies, container, lazyLoad = false) {
    container.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieIMG = document.createElement('img');
        movieIMG.classList.add('movie-img');
        movieIMG.setAttribute('alt', movie.title);
        movieIMG.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path);
            
            movieIMG.addEventListener('error', () => {
                movieIMG.setAttribute('src', 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress')
            });    
        if(lazyLoad) {
            lazyLoader.observe(movieIMG)
        }
        document.body.scrollLeft = 0;
        document.documentElement.scrollLeft = 0;
        movieContainer.appendChild(movieIMG);
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

    createMovies(movies, trendingMoviesPreviewList, true)
}


async function getCategoryPreview() {
    const { data } = await api('/genre/movie/list', {
        params: {
            language: 'es-MX'
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

    createMovies(movies, genericSection, true);
}

async function getMoviesBySearch(query) {
    const { data } = await api('/search/movie', {
        params: {
            query: query,
        }
    });

    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getTrendingMovies() {
    const { data } = await api('/trending/movie/day');

    const movies = data.results;

    createMovies(movies, genericSection)
}

async function getMovieById(id) {
    const { data: movie } = await api('/movie/' + id, {
        params: {
            language: 'es',
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
