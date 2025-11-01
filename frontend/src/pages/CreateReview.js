import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { getMovieDetails, createReview } from '../services/api';

function CreateReview() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    try {
      const data = await getMovieDetails(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!comment.trim()) {
      setError('Please write a comment for your review.');
      setSubmitting(false);
      return;
    }

    try {
      const userId = 'user123';
      await createReview({
        movieId,
        userId,
        rating: parseInt(rating),
        comment: comment.trim(),
        movieTitle: movie?.title || 'Unknown Movie'
      });
      
      setSuccess('Review submitted successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/movie/${movieId}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Write a Review</h2>
              
              {movie && (
                <Card className="mb-4">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                        alt={movie.title}
                        className="me-3 rounded"
                        style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                        }}
                      />
                      <div>
                        <h4 className="mb-1">{movie.title}</h4>
                        <p className="text-muted mb-0">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'} 
                          {movie.genres && movie.genres.length > 0 && ` • ${movie.genres.map(g => g.name).join(', ')}`}
                        </p>
                        {movie.overview && (
                          <p className="mt-2 mb-0 small text-muted">
                            {movie.overview.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Your Rating</strong>
                  </Form.Label>
                  <Form.Select 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="1">1 Star - Poor</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="5">5 Stars - Excellent</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>Your Review</strong>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this movie... What did you like or dislike? How was the acting, story, and direction?"
                    disabled={submitting}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateReview;