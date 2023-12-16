import React, { useEffect, useState } from 'react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EditReview from './EditReview'; // Asegúrate de importar el componente EditReview
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import ReactStars from 'react-rating-stars-component';
import Header from '../Header/Header';

interface Review {
  id?: string;
  calificacion: number;
  movieId: number;
  reviewText: string;
  userId: string;
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  genre_ids: number[];
}

const TMDB_API_KEY = 'cbd9cb506a625036bd2b029481d9d2b0';

const fetchMovieData = async (movieId: number): Promise<Movie | null> => {
  try {
    const tmdbMovieQuery = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es`;
    const tmdbMovieResponse = await fetch(tmdbMovieQuery);
    const tmdbMovie = await tmdbMovieResponse.json();
    return {
      ...tmdbMovie,
      id: movieId,
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return null;
  }
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataArray, setMovieDataArray] = useState<(Movie | null)[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalReview, setModalReview] = useState<Review | null>(null);
  const [rating, setRating] = useState<number>(1);

  const openModal = (index: number) => {
    setModalReview(reviews[index]);
    setEditingIndex(index);
    setRating(reviews[index]?.calificacion || 1);

    const modalElement = document.getElementById('editReviewModal');
    const backdropElement = document.createElement('div');
    backdropElement.classList.add('modal-backdrop');
    document.body.appendChild(backdropElement);

    try {
      const modal = new Modal(modalElement!, {
        backdrop: false,
      });
      modal.show();
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  };

  const closeModal = () => {
    setModalReview(null);
    setEditingIndex(null);
    setRating(1);

    const modalElement = document.getElementById('editReviewModal');
    const backdropElement = document.querySelector('.modal-backdrop');
    document.body.removeChild(backdropElement!);

    try {
      const modal = Modal.getInstance(modalElement!);
      modal?.hide();
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  const handleDelete = async (indexToDelete: number) => {
    try {
      const db = getFirestore();
      const reviewToDelete = reviews[indexToDelete];
      console.log('Deleting review with ID:', reviewToDelete.userId);

      const reviewDocId = reviewToDelete.id;
      const reviewsCollection = collection(db, 'reviews');
      const reviewDoc = doc(reviewsCollection, reviewDocId);

      await deleteDoc(reviewDoc);
      console.log('Review deleted successfully.');

      setReviews((prevReviews) => prevReviews.filter((_, i) => i !== indexToDelete));
      setMovieDataArray((prevMovieData) => prevMovieData.filter((_, i) => i !== indexToDelete));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleSaveEdit = async (index: number, editedText: string, rating: number) => {
    try {
      const db = getFirestore();
      const reviewToEdit = reviews[index];
      const reviewDocId = reviewToEdit.id;
      const reviewsCollection = collection(db, 'reviews');
      const reviewDoc = doc(reviewsCollection, reviewDocId);

      await updateDoc(reviewDoc, { reviewText: editedText, calificacion: rating });
      console.log('Review edited successfully.');

      setReviews((prevReviews) =>
        prevReviews.map((r, i) => (i === index ? { ...r, reviewText: editedText, calificacion: rating } : r))
      );
      setEditingIndex(null);
      closeModal();
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  // Nuevo: UseEffect para cargar datos después de la autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchData(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchData = async (user: any) => {
    try {
      const userId = user.email;
      const db = getFirestore();
      const reviewsCollection = collection(db, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsData: Review[] = reviewsSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }) as Review)
        .filter((review) => review.userId === userId); // Filtrar reseñas por usuario actual

      console.log('Fetching data from Firestore...');
      const movieIds: number[] = [];
      const movieDataPromises = reviewsData.map(async (review) => {
        const movieId = review.movieId;
        movieIds.push(movieId);
        return fetchMovieData(movieId);
      });

      const movieDataResults = await Promise.all(movieDataPromises);
      const filteredMovieData = movieDataResults.filter((data) => data !== null) as Movie[];

      setReviews(reviewsData);
      setMovieDataArray(filteredMovieData);
      setDataReady(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!dataReady) {
    return <p>Cargando...</p>;
  }

  return (
    <>
    <Header />
    <div className='mt-5'>
      <h2 className="container col-12 text-center">Listado de Reseñas:</h2>
      <ul className="container d-flex flex-wrap">
        {reviews.map((review, index) => {
          const movieData = movieDataArray[index];
          if (!movieData) {
            return null;
          }

          return (
            <li key={index} className="col-lg-3 col-md-6 col-sm-12">
              <div className="card m-2">
                <>
                  <img
                    className="card-img-top"
                    src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                    alt={movieData.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movieData.title}</h5>
                    <p>{review.reviewText}</p>
                    <p>Calificación: {Array(review.calificacion).fill('⭐️').join('')}</p>
                    <button className="d-flex col-12 btn btn-danger mr-2 mb-3 p-2" onClick={() => handleDelete(index)}>
                      Eliminar
                    </button>
                    <button className="d-flex col-12 btn btn-primary mr-2 mb-3 p-2" onClick={() => openModal(index)}>
                      Editar Reseña
                    </button>
                  </div>
                </>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal para editar reseñas */}
      <div className="modal" id="editReviewModal" tabIndex={-1} aria-labelledby="editReviewModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
          {modalReview && typeof editingIndex === 'number' && movieDataArray[editingIndex] && (
            <>
              <div className="modal-header">
                <h5 className="modal-title" id="editReviewModalLabel">
                  Editar Reseña - {movieDataArray[editingIndex]!.title ?? 'Título no disponible'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {movieDataArray[editingIndex] && (
                  <img
                    className="img-fluid mb-3"
                    src={`https://image.tmdb.org/t/p/w500${movieDataArray[editingIndex]!.poster_path ?? ''}`}
                    alt={movieDataArray[editingIndex]!.title ?? 'Título no disponible'}
                  />
                )}
                <EditReview
                  initialText={modalReview.reviewText}
                  initialRating={modalReview.calificacion}
                  onSave={(editedText, rating) => handleSaveEdit(editingIndex!, editedText, rating)}
                  onCancel={() => {
                    setEditingIndex(null);
                    closeModal();
                  }}
                />
              </div>
            </>
          )}


          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Reviews;
