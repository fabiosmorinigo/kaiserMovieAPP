async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;
    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieIMG = document.createElement('img');
        movieIMG.classList.add('movie-img');
        movieIMG.setAttribute('alt', movie.title);
        movieIMG.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        
        movieContainer.appendChild(movieIMG);
        trendingPreviewMoviesContainer.appendChild(movieContainer)
    });
}


async function getCategoryPreview() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    const data = await res.json();

    const categories = data.genres;
    categories.forEach(category => {

        const previewCategoryContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');


        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id);

        categoryContainer.appendChild(categoryTitle);
        previewCategoryContainer.appendChild(categoryContainer);
    });
}

getTrendingMoviesPreview();
getCategoryPreview();