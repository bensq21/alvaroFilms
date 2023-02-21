const API_KEY = "5e940a4ba4d5e8671001efc3291ced08";
const LANG = "&language=es-ES";
const API_BASE_URL = "https://api.themoviedb.org/3/";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";

async function getTrendingMovies() {
    let data = [];
    try {
        const response = await fetch(
            `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}${LANG}`
        )
        const responseData = await response.json();
        for (let item of responseData?.results) {
            data.push(await findMovieById(item['id']));
        }

    }
    catch (error) {
        console.log(`Goku murio al intentar ejecutar el código ${error}:( `);
    }
    return data;
}

async function findMovieById(id) {
    let responseData;
    try {
        const response = await fetch(
            `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}${LANG}`
        )
        responseData = await response.json();
    }
    catch (error) {
        console.log(`Goku murió al intentar ejecutar el código ${error}:( `);
    }
    return responseData;
}

async function findMovieByName(name) {
    let data = [];
    try {
        const response = await fetch(
            `${API_BASE_URL}/search/movie?api_key=${API_KEY}${LANG}&query=${name.trim()}`
        )
        const responseData = await response.json();
        data = responseData?.results;
    }
    catch (error) {
        console.log(`Goku murio al intentar ejecutar el código ${error}:( `);
    }
    return data;
}

async function onLoadFunction() {

    let movies = [];
    switch ($('main div').attr('id')) {
        case 'destacados':
            $('.buscador').attr('placeholder', 'Buscando en destacados...');
            movies = await getTrendingMovies();
            showMovies(movies);
            break;

        case 'favoritos':
            $('.buscador').attr('placeholder', 'Buscando en favoritos...');
            for (let id of getFavorites()) {
                movies.push(await findMovieById(id));
            }
            movies.reverse();
            showMovies(movies);

            break;

        case 'aventura':

        default:

            break;
    }

    $('.buscador').keyup(async function () {
        var buscando = $(this).val().trim();
        if (buscando.length >= 3) {
            var item = '';
            for (let movie of movies) {
                item = movie['title'].toLowerCase();
                for (var x = 0; x < item.length; x++) {
                    if (buscando.length == 0 || item.indexOf(buscando) > -1) {
                        $('#' + movie['id']).show();
                    } else {
                        $('#' + movie['id']).hide();
                    }
                }
            }
        } else {
            if ($(this).parent().attr('id') != 'goku') {
                $('#paste div').show();
            }
        }
    });

    

    $("#orden").click(function (e) {
        let ordena = $(e.target).val(); // obtiene la opción seleccionada del select

        switch (ordena) {
            case "puntuacion_desc":
                movies.sort(function (a, b) {
                    return b.vote_average - a.vote_average;
                });
                break;
            case "puntuacion_asc":
                movies.sort(function (a, b) {
                    return b.vote_average - a.vote_average;
                }).reverse();
                break;
            case "estreno_desc":
                movies.sort(function (a, b) {
                    return b.release_date - a.release_date;
                });
                break;
            case "estreno_asc":
                movies.sort(function (a, b) {
                    return b.release_date + a.release_date;
                });
                break;
            case "vocabulario_desc":
                movies.sort(function (a, b) {
                    if ( a.title > b.title ) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                break;
            case "vocabulario_asc":
                movies.sort(function (a, b) {
                    if ( a.title < b.title ) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                break;
            default:
                break;
        }

        $('#paste div').remove();
        showMovies(movies);
    });
}

function showMovies(movies) {
    for (let item of movies) {
        let imagen = IMG_BASE_URL + item['poster_path'];
        if (item['poster_path'] == null) {
            imagen = "./img/no-found.png";
        }

        $('#paste').append
            (
                '<div id="' + item['id'] + '" class="col-md-4 mb-4">' +
                    '<div class="card">' +
                    '<h5 class="card-title p-2 d-flex justify-content-center">' + item['title'] + '</h5>' +
                        '<img src="' + imagen + '" class="card-img-top" alt="' + item['title'] + '"/>' +
                        '<div class="card-body">' +
                            '<p class="card-text">' +
                            item['overview'].substring(0, 154) +
                            '<a href="#" id="mas_' + item['id'] + '">Leer más</a><text id="fullOverview_' + item['id'] + '">' + item['overview'].substring(154) + '</text><a href="#" id="menos_' + item['id'] + '">Leer menos</a>' +
                            '<br><a href="#" id="verMas_' + item['id'] + '" class="btn btn-primary my-2 verMas">Ver más</a>' +
                            '<div class="puntuacion"> <span class="puntuacion-numero">' + item['vote_average'] + '</span></div>' +
                            '<button class="btn col-12"></button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

        $('#fullOverview_' + item['id']).hide();
        $('#menos_' + item['id']).hide();
        $('#mas_' + item['id']).click(function (e) {
            e.preventDefault();

            $('#mas_' + item['id']).hide();

            $('#fullOverview_' + item['id']).show();
            $('#menos_' + item['id']).show();
            
            $('#fullOverview_' + item['id']).css('opacity', '0');
            $('#menos_' + item['id']).css('opacity', '0');
            
            $('#fullOverview_' + item['id']).css('transition', 'visibility 0s linear 0.33s, opacity 0.33s linear');
            $('#menos_' + item['id']).css('transition', 'visibility 0s linear 0.33s, opacity 0.33s linear');

            $('#fullOverview_' + item['id']).css('opacity', '1');
            $('#menos_' + item['id']).css('opacity', '1');
        });
        $('#menos_' + item['id']).click(function (e) {
            e.preventDefault();
            $('#fullOverview_' + item['id']).hide();
            $('#menos_' + item['id']).hide();
            $('#mas_' + item['id']).show();
        });

        if (inArray(localStorage.getItem('favorites'), item['id'])) {
            $('#' + item['id'] + ' button span').remove();
            $('#' + item['id'] + ' button').append("<span>💜</span>");
        }
        else {
            $('#' + item['id'] + ' button span').remove();
            $('#' + item['id'] + ' button').append("<span>🤍</span>");
        }

        $('#' + item['id'] + ' button').click(function () {
            if (inArray(localStorage.getItem('favorites'), item['id'])) {
                deleteFromFavorites(item['id']);
                $('#' + item['id'] + ' button span').remove();
                $('#' + item['id'] + ' button').append("<span>🤍</span>");
            }
            else {
                addToFavorites(item['id']);
                $('#' + item['id'] + ' button span').remove();
                $('#' + item['id'] + ' button').append("<span>💜</span>");
            }
        });

        for (let genre of item['genres']) {
            $('#' + item['id'] + '_genre').append(genre['name'] + ' ');
        }
    }
}

$(document).ready(function () {
    onLoadFunction();
});