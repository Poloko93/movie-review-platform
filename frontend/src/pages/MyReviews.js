import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Badge, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUserReviews, deleteReview } from '../services/api';

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const userId = 'user123'; // For demo

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const data = await getUserReviews(userId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setError('Failed to load your reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    setDeleting(true);
    try {
      await deleteReview(reviewToDelete.id);
      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      setSuccess('Review deleted successfully!');
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your reviews...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Reviews</h1>
        <Badge bg="primary" className="fs-6">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </Badge>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {reviews.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <h4>No reviews yet</h4>
          <p className="mb-3">You haven't written any reviews yet. Start sharing your thoughts about movies!</p>
          <Link to="/movies" className="btn btn-success btn-lg">
            Browse Movies
          </Link>
        </Alert>
      ) : (
        <Row>
          {reviews.map(review => (
            <Col key={review.id} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{review.movieTitle}</h5>
                    <Badge bg={getRatingColor(review.rating)} className="fs-6">
                      {review.rating}/5
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      Reviewed on {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </small>
                  </div>
                  
                  <p className="flex-grow-1">{review.comment}</p>
                  
                  <div className="mt-auto">
                    <div className="d-flex gap-2 flex-wrap">
                      <Link 
                        to={`/create-review/${review.movieId}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        Edit Review
                      </Link>
                      <Link 
                        to={`/movie/${review.movieId}`} 
                        className="btn btn-outline-secondary btn-sm"
                      >
                        View Movie
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(review)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your review for "{reviewToDelete?.movieTitle}"?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete Review'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyReviews;