import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMovieDetails, getMovieReviews } from '../services/api';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovieData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const movieData = await getMovieDetails(id);
      const reviewsData = await getMovieReviews(id);
      
      setMovie(movieData);
      setReviews(reviewsData);
      
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setError('Failed to load movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading movie details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <h5>Error Loading Movie</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Link to="/movies" className="btn btn-primary me-2">Back to Movies</Link>
            <Button variant="outline-secondary" onClick={fetchMovieData}>
              Try Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert variant="warning">
          <h5>Movie Not Found</h5>
          <p>The movie you're looking for doesn't exist.</p>
          <Link to="/movies" className="btn btn-primary">Back to Movies</Link>
        </Alert>
      </Container>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Container>
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
            alt={movie.title}
            className="img-fluid rounded shadow movie-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
            }}
          />
        </Col>
        <Col md={8}>
          <div className="d-flex align-items-start mb-3">
            <h1 className="me-3">{movie.title}</h1>
            <Badge bg="secondary" className="fs-6">
              {movie.adult ? 'R' : 'PG'}
            </Badge>
          </div>
          
          {movie.tagline && (
            <p className="lead text-muted mb-4">"{movie.tagline}"</p>
          )}
          
          <p className="mb-4">{movie.overview}</p>
          
          <Row className="mb-4">
            <Col sm={6}>
              <strong>Release Date:</strong><br />
              {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'TBA'}
            </Col>
            <Col sm={6}>
              <strong>Runtime:</strong><br />
              {formatRuntime(movie.runtime)}
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col sm={6}>
              <strong>Genres:</strong><br />
              {movie.genres && movie.genres.length > 0 
                ? movie.genres.map(genre => genre.name).join(', ')
                : 'N/A'
              }
            </Col>
            <Col sm={6}>
              <strong>Language:</strong><br />
              {movie.original_language ? movie.original_language.toUpperCase() : 'N/A'}
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col sm={6}>
              <strong>TMDB Rating:</strong><br />
              {movie.vote_average ? `${movie.vote_average}/10 (${movie.vote_count} votes)` : 'No ratings'}
            </Col>
            <Col sm={6}>
              <strong>Our Reviews:</strong><br />
              {reviews.length > 0 
                ? `${averageRating}/5 (${reviews.length} reviews)`
                : 'No reviews yet'
              }
            </Col>
          </Row>

          <div className="d-flex gap-3 flex-wrap">
            <Link to={`/create-review/${id}`}>
              <Button variant="success" size="lg">
                Write a Review
              </Button>
            </Link>
            <Link to="/movies">
              <Button variant="outline-primary" size="lg">
                Back to Movies
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>User Reviews ({reviews.length})</h3>
            {reviews.length > 0 && (
              <Badge bg="primary" className="fs-6">
                Average: {averageRating}/5
              </Badge>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No reviews yet</h5>
              <p>Be the first to share your thoughts about this movie!</p>
              <Link to={`/create-review/${id}`} className="btn btn-success">
                Write First Review
              </Link>
            </Alert>
          ) : (
            reviews.map(review => (
              <Card key={review.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">
                        <Badge bg="warning" text="dark">
                          {review.rating}/5 Stars
                        </Badge>
                      </h5>
                    </div>
                    <small className="text-muted">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                    </small>
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MovieDetail;