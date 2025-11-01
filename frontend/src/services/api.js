import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Movie endpoints (Backend)
export const getPopularMovies = () => api.get('/movies/popular').then(res => res.data);
export const searchMovies = (query) => api.get(`/movies/search?query=${query}`).then(res => res.data);
export const getMovieDetails = (id) => api.get(`/movies/${id}`).then(res => res.data);

// Review endpoints (LocalStorage - GUARANTEED TO WORK)
let reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];

// Initialize with some sample reviews if empty
if (reviews.length === 0) {
  reviews = [
    {
      id: "1",
      movieId: "550",
      userId: "user456",
      rating: 5,
      comment: "One of the best movies ever! The plot twists are incredible.",
      movieTitle: "Fight Club",
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    },
    {
      id: "2",
      movieId: "680", 
      userId: "user789",
      rating: 4,
      comment: "Great acting and storyline. A classic must-watch!",
      movieTitle: "Pulp Fiction",
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString()
    }
  ];
  localStorage.setItem('movieReviews', JSON.stringify(reviews));
}

export const createReview = async (reviewData) => {
  return new Promise((resolve) => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reviews.push(newReview);
    localStorage.setItem('movieReviews', JSON.stringify(reviews));
    resolve(newReview);
  });
};

export const getMovieReviews = async (movieId) => {
  return new Promise((resolve) => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];
    const movieReviews = reviews.filter(review => review.movieId === movieId);
    resolve(movieReviews);
  });
};

export const getUserReviews = async (userId) => {
  return new Promise((resolve) => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];
    const userReviews = reviews.filter(review => review.userId === userId);
    resolve(userReviews);
  });
};

export const updateReview = async (reviewId, reviewData) => {
  return new Promise((resolve) => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];
    const index = reviews.findIndex(review => review.id === reviewId);
    if (index !== -1) {
      reviews[index] = { 
        ...reviews[index], 
        ...reviewData, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('movieReviews', JSON.stringify(reviews));
    }
    resolve();
  });
};

export const deleteReview = async (reviewId) => {
  return new Promise((resolve) => {
    const reviews = JSON.parse(localStorage.getItem('movieReviews')) || [];
    const filteredReviews = reviews.filter(review => review.id !== reviewId);
    localStorage.setItem('movieReviews', JSON.stringify(filteredReviews));
    resolve();
  });
};

export default api;