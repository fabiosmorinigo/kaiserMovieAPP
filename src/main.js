const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

async function getTrendingMoviesPreview() {
    const { data } = await api('/trending/movie/day');

    const movies = data.results;
    movies.forEach(movie => {
        const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieIMG = document.createElement('img');
        movieIMG.classList.add('movie-img');
        movieIMG.setAttribute('alt', movie.title);
        movieIMG.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        
        movieContainer.appendChild(movieIMG);
        trendingMoviesPreviewList.appendChild(movieContainer)
    });
}


async function getCategoryPreview() {
    const { data } = await api('/genre/movie/list');
    // '&language=es-Mx
    const categories = data.genres;
    categories.forEach(category => {

        const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');


        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id);

        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewList.appendChild(categoryContainer);
    });
}

