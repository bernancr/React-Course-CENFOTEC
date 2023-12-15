import React, { useState, useEffect, useCallback } from 'react';
import GenreButtons from './GenreButtons';
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Header from '../Header/Header';
import { format, subMonths } from 'date-fns';
import Rating from 'react-rating-stars-component';


interface Movie {
  id: number;
  title: string;
  overview: string;
  genre_ids: number[];
  poster_path: string;
  release_date: string;
  review?: {
    calificacion: number;
  };
}

interface Genre {
  id: number;
  name: string;
}

const Pelis: React.FC = () => {
  const apiKey = 'cbd9cb506a625036bd2b029481d9d2b0';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [moviesData, setMoviesData] = useState<any>(null);
  const [showNewReleases, setShowNewReleases] = useState(false);
  const [isOpenReviewForm, setIsOpenReviewForm] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Nuevo estado para controlar la carga

  
  const loadReviews = useCallback(async () => {
    try {
      const db = getFirestore();
      const reviewsCollection = collection(db, 'reviews');
      const querySnapshot = await getDocs(reviewsCollection);
      const reviewsData = querySnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);

      if (!loadedPages.includes(page)) {
        // Solo carga la página si aún no se ha cargado previamente
        setLoadedPages((prevLoadedPages) => [...prevLoadedPages, page]);

        let apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=${page}&sort_by=popularity.desc&api_key=${apiKey}`;

        if (showNewReleases) {
          // Si se selecciona "Estrenos", filtra por películas lanzadas en los últimos tres meses
          const threeMonthsAgo = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
          apiUrl += `&primary_release_date.gte=${threeMonthsAgo}`;
        }

        const moviesURL = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        const moviesData = await moviesURL.json();

        if (moviesData && moviesData.total_pages) {
          // Verifica que moviesData y total_pages no sean null
          const newMovies = moviesData.results || [];

          if (page === 1) {
            // Si es la página 1, establece las películas en lugar de agregarlas
            setMovies(newMovies);
          } else {
            // Si no es la página 1, agrega las películas a las existentes
            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
          }
          setMoviesData(moviesData);
        }
      }
    } catch (error) {
      console.error('Error al obtener datos de películas:', error);
    } finally {
      setLoading(false);
    }
  }, [page, apiKey, setMovies, setLoading, showNewReleases, movies, loadedPages]);


  const loadMoviesOnScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
  
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && !isLoadingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', loadMoviesOnScroll);
  
    return () => {
      window.removeEventListener('scroll', loadMoviesOnScroll);
    };
  }, [loading, loadMoviesOnScroll]);
  

  const loadFavoriteMovies = useCallback(async () => {
    try {
      const db = getFirestore();
      const peliculasCollection = collection(db, 'peliculas');
      const querySnapshot = await getDocs(peliculasCollection);
      const favoriteMovieIds = querySnapshot.docs.map((doc) => doc.data().movieId);
      setFavoriteMovies(favoriteMovieIds);
    } catch (error) {
      console.error('Error al cargar las películas favoritas:', error);
    }
  }, []);

  useEffect(() => {
    loadFavoriteMovies();
  }, [loadFavoriteMovies]);

  const loadGenres = useCallback(async () => {
    try {
      const genresURL = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=es&api_key=${apiKey}`
      );
      const genresData = await genresURL.json();

      setGenres(genresData.genres);
    } catch (error) {
      console.error('Error al obtener datos de géneros:', error);
    }
  }, [apiKey]);

  useEffect(() => {
    loadMovies();
    loadGenres();
  }, [page, apiKey, loadGenres]);

  const handleSelectGenre = useCallback((genreId: number | null) => {
    setPage(1);
    setSelectedGenre(genreId);
    setLoadedPages([]);
  }, []);
  
  const handleShowNewReleases = async () => {
    setPage(1);
    setMovies([]);
    setLoadedPages([]);
    setShowNewReleases(true);
    console.log(showNewReleases); // Agregar este console.log
  };

  const getGenreName = useCallback(
    (genreIds: number[]) => {
      if (!genres || !genres.length) {
        return 'Género desconocido';
      }

      const genreNames = genreIds.map((genreId) => {
        const genre = genres.find((g) => g.id === genreId);
        return genre ? genre.name : 'Desconocido';
      });

      return genreNames.join(', ');
    },
    [genres]
  );

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.email || '';
  console.log(userId);

  const isMovieFavorite = useCallback(
    (movieId: number) => favoriteMovies.includes(movieId),
    [favoriteMovies]
  );

  const toggleFavorite = useCallback(
    async (movieId: number, userId: string) => {
      try {
        const db = getFirestore();
        const peliculasCollection = collection(db, 'peliculas');
        const isFavorite = isMovieFavorite(movieId);

        if (isFavorite) {
          const querySnapshot = await getDocs(peliculasCollection);
          const docId = querySnapshot.docs.find(
            (doc) => doc.data().movieId === movieId
          )?.id;

          if (docId) {
            await deleteDoc(doc(peliculasCollection, docId));
          }
        } else {
          await addDoc(peliculasCollection, { movieId, userId });
        }

        loadFavoriteMovies();
      } catch (error) {
        console.error('Error al agregar o quitar de favoritos:', error);
      }
    },
    [isMovieFavorite, loadFavoriteMovies]
  );

  const openReviewForm = useCallback(
    (movieId: number) => {
      setIsOpenReviewForm(true);
      setCurrentMovieId(movieId);
    },
    []
  );

  const closeReviewForm = useCallback(() => {
    setIsOpenReviewForm(false);
    setCurrentMovieId(null);
    setReviewText('');
  }, []);

  const handleReviewSubmit = useCallback(
    async (movieId: number, reviewText: string, selectedRating: number) => {
      try {
        const db = getFirestore();
        const reviewsCollection = collection(db, 'reviews');

        // Verificar si ya existe una reseña para esta película y usuario
        const existingReviewQuery = query(
          reviewsCollection,
          where('movieId', '==', movieId),
          where('userId', '==', userId)
        );
        const existingReviewSnapshot = await getDocs(existingReviewQuery);

        if (!existingReviewSnapshot.empty) {
          // Si ya existe una reseña, actualizar el campo 'reviewText' y 'calificacion'
          const existingReviewDocId = existingReviewSnapshot.docs[0].id;
          await updateDoc(doc(reviewsCollection, existingReviewDocId), {
            reviewText: reviewText,
            calificacion: selectedRating,
          });
        } else {
          // Si no existe una reseña, agregar una nueva
          await addDoc(reviewsCollection, {
            movieId: movieId,
            userId: userId,
            reviewText: reviewText,
            calificacion: selectedRating,
          });
        }

        // Después de enviar la reseña, actualiza la lista de reseñas
        loadReviews();

        closeReviewForm();
      } catch (error) {
        console.error('Error al enviar reseña:', error);
      }
    },
    [userId, closeReviewForm, loadReviews]
  );
  
  return (
    <>
      <Header />
      <div className='container d-flex flex-wrap'>
        <div className='col-12 d-flex column justify-content-center'>
          <div className='text-center'>
            {/* Botones de género */}
            <GenreButtons genres={genres} onSelectGenre={handleSelectGenre} />
            <button
              className={`btn btn-outline-primary mx-1 ${
                showNewReleases ? 'active' : ''
              }`}
              onClick={handleShowNewReleases}
            >
              Estrenos
            </button>
          </div>
        </div>

        {movies
          .filter((movie) =>
            selectedGenre ? movie.genre_ids.includes(selectedGenre) : true
          )
          .map((movie, index) => {
        const userHasReview = reviews.find(
          (review) =>
            review.movieId === movie.id &&
            review.userId.trim().toLowerCase() === userId.trim().toLowerCase()
        );
        console.log(userHasReview);
          return (
            <div key={`${movie.id}-${index}`} className='col-lg-3 col-md-6'>
              <div className='card m-2'>
                <img
                  className='card-img-top'
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className='card-body card-relative'>
                  <h5 className='card-title'>{movie.title}</h5>
                  <p className='card-text'>{movie.overview}</p>
                  <p className='card-text'>
                    Género: {getGenreName(movie.genre_ids)}
                  </p>
                  <p>
                    Calificación:{' '}
                    {userHasReview ? (
                      Array.from(
                        { length: Number(userHasReview.calificacion) || 0 },
                        (_, index) => <span key={index}>⭐️</span>
                      )
                    ) : (
                      'Sin calificación'
                    )}
                  </p>
                  <p className='card-text'>
                    Fecha de lanzamiento: {movie.release_date}
                  </p>
                  {userHasReview ? (
                    <p>Ya tiene reseña</p>
                  ) : (
                    <button
                      className='btn btn-primary mr-1'
                      onClick={() => openReviewForm(movie.id)}
                    >
                      Agregar Reseña
                    </button>
                  )}
                  <button
                    type='button'
                    className={`btn btn-outline-danger ml-1 ${
                      isMovieFavorite(movie.id) ? 'active' : ''
                    }`}
                    onClick={() => toggleFavorite(movie.id, userId)}
                  >
                    <span className='p-2'>
                      {isMovieFavorite(movie.id)
                        ? 'Pelicula favorita'
                        : 'Agregar a Mis Favoritas'}
                    </span>
                  </button>
                  {isOpenReviewForm && currentMovieId === movie.id && (
                    <form id='review-form' className='review-form'>
                      <div className='p-3'>
                        <label className='form-label col-12'>
                          <h5 className='card-title'>{movie.title}</h5>
                          <input
                            className='form-control'
                            id='resenaInput'
                            name='resena'
                            type='text'
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder='Escribe tu reseña'
                          />
                        </label>
                        <div className='d-flex justify-content-center'>
                          <Rating
                            count={5}
                            value={selectedRating}
                            size={24}
                            activeColor='#ffd700'
                            onChange={(newRating) =>
                              setSelectedRating(newRating)
                            }
                          />
                        </div>
                        <div className='d-flex justify-content-center'>
                          <button
                            type='button'
                            className='btn btn-primary col-5 m-1'
                            onClick={() =>
                              handleReviewSubmit(
                                movie.id,
                                reviewText,
                                selectedRating
                              )
                            }
                          >
                            Enviar Reseña
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary col-5 m-1'
                            onClick={closeReviewForm}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pelis;