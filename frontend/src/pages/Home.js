import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPopularMovies } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const data = await getPopularMovies();
      setMovies(data.results.slice(0, 6));
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="hero-section text-center py-5 mb-4">
        <h1 className="display-4">Welcome to MovieReviews</h1>
        <p className="lead">Discover, Review, and Share Your Favorite Movies</p>
        <Button as={Link} to="/movies" variant="light" size="lg" className="mt-3">
          Browse All Movies
        </Button>
      </div>

      <h2 className="mb-4">Popular Movies</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {movies.map(movie => (
            <Col key={movie.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={movie.title}
                  style={{ height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available'}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Link to={`/movie/${movie.id}`}>
                      <Button variant="primary">View Details</Button>
                    </Link>
                    <Link to={`/create-review/${movie.id}`}>
                      <Button variant="outline-success">Write Review</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;