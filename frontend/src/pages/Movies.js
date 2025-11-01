import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPopularMovies, searchMovies } from '../services/api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const data = await getPopularMovies();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPopularMovies();
      return;
    }

    setLoading(true);
    try {
      const data = await searchMovies(searchQuery);
      setMovies(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to search movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPopularMovies();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Browse Movies</h1>
        <Form onSubmit={handleSearch} className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px' }}
          />
          <Button variant="outline-primary" type="submit" className="ms-2">
            Search
          </Button>
          {searchQuery && (
            <Button variant="outline-secondary" onClick={handleClearSearch} className="ms-2">
              Clear
            </Button>
          )}
        </Form>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {searchQuery && (
            <div className="mb-3">
              <p>
                Showing results for: <strong>"{searchQuery}"</strong> 
                <Badge bg="primary" className="ms-2">{movies.length} movies</Badge>
              </p>
            </div>
          )}
          
          <Row>
            {movies.length === 0 ? (
              <Col className="text-center py-5">
                <h4>No movies found</h4>
                <p>Try a different search term or browse popular movies.</p>
                <Button onClick={fetchPopularMovies} variant="primary">
                  Show Popular Movies
                </Button>
              </Col>
            ) : (
              movies.map(movie => (
                <Col key={movie.id} lg={3} md={4} sm={6} className="mb-4">
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
                      <Card.Title className="fs-6">{movie.title}</Card.Title>
                      <Card.Text className="flex-grow-1 small text-muted">
                        <strong>Release:</strong> {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                        <br />
                        <strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : 'No ratings'}
                      </Card.Text>
                      <div className="mt-auto">
                        <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100 mb-2">
                          View Details
                        </Link>
                        <Link to={`/create-review/${movie.id}`} className="btn btn-outline-success w-100">
                          Write Review
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Movies;