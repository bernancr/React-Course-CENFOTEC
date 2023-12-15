import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
  doc as firestoreDoc,
} from 'firebase/firestore';
import Header from '../Header/Header';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  genre_ids: number[];
}

interface MovieData {
  id: string;
  movieId: number;
  userId: string;
}

const TMDB_API_KEY = 'cbd9cb506a625036bd2b029481d9d2b0';

const fetchMovieData = async (movie: MovieData) => {
  const tmdbMovieQuery = `https://api.themoviedb.org/3/movie/${movie.movieId}?api_key=${TMDB_API_KEY}&language=es`;
  const tmdbMovieResponse = await fetch(tmdbMovieQuery);
  const tmdbMovie = await tmdbMovieResponse.json();
  return {
    ...tmdbMovie,
    id: movie.movieId,
  };
};

const handleImageLoad = (movieId: number) => {
  // Tu lógica para manejar la carga de imágenes
};

const MovieCard: React.FC<{
  movieId: number;
  loadedImages: number[];
  onDelete: (movieId: number) => void;
}> = ({ movieId, loadedImages, onDelete }) => {
  const [movieInfo, setMovieInfo] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const movieDocQuery = query(collection(db, 'peliculas'), where('movieId', '==', movieId));
        const movieDocSnapshot = await getDocs(movieDocQuery);

        if (!movieDocSnapshot.empty) {
          const movieData = movieDocSnapshot.docs[0].data() as MovieData;
          const fetchedMovie = await fetchMovieData(movieData);
          setMovieInfo(fetchedMovie);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchData();
  }, [movieId]);

  if (!movieInfo) {
    return null; // Puedes mostrar un componente de carga aquí si es necesario
  }

  return (
    <div className="card m-2">
      <img
        className="card-img-top"
        onLoad={() => handleImageLoad(movieId)}
        src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
        alt={movieInfo.title}
        style={{ display: loadedImages.includes(movieId) ? 'inline' : 'none' }}
      />
      <div className="card-body">
        <h5 className="card-title">{movieInfo.title}</h5>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(movieId)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

const Favoritas: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const fetchData = async (user: any) => {
      try {
        if (user) {
          const db = getFirestore();

          const allMoviesQuery = query(collection(db, 'peliculas'), where('userId', '==', user.email));
          const allMoviesSnapshot = await getDocs(allMoviesQuery);
          const allMoviesData: MovieData[] = allMoviesSnapshot.docs.map((doc) => doc.data() as MovieData);

          const allMovies = await Promise.all(allMoviesData.map(fetchMovieData));

          setFavoriteMovies(allMoviesData.map((movie) => movie.movieId));
          setLoadedImages(allMoviesData.map((movie) => movie.movieId));
          setDataReady(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      } else {
        console.log('El usuario no está autenticado');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteMovie = async (movieId: number) => {
    try {
      const db = getFirestore();
      const movieDocQuery = query(collection(db, 'peliculas'), where('movieId', '==', movieId));
      const movieDocSnapshot = await getDocs(movieDocQuery);

      if (!movieDocSnapshot.empty) {
        const movieDoc = movieDocSnapshot.docs[0];
        await deleteDoc(firestoreDoc(db, 'peliculas', movieDoc.id));
        setFavoriteMovies((prevMovies) => prevMovies.filter((id) => id !== movieId));
        setLoadedImages((prevImages) => prevImages.filter((id) => id !== movieId));
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  if (!dataReady) {
    return <p>Cargando...</p>;
  }

  console.log('Favorite movies state:', favoriteMovies);

  return (
    <>
      <Header />
    
    <div className='mt-5'>
      <h2 className="container col-12 text-center">Lista de Películas Favoritas:</h2>
      <ul className="container d-flex flex-wrap">
        {favoriteMovies.map((movieId, index) => (
          <li key={index} className="col-lg-3 col-md-4 col-sm-4 col-6">
            <MovieCard movieId={movieId} loadedImages={loadedImages} onDelete={handleDeleteMovie} />
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default Favoritas;
