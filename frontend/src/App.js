import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import MyReviews from './pages/MyReviews';
import CreateReview from './pages/CreateReview';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/create-review/:movieId" element={<CreateReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;