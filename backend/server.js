const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// TMDB API - Replace with your real key
const TMDB_API_KEY = '8cc93a5173b66fbfa5e361fbc65a4c87'; // ← REPLACE WITH YOUR REAL KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Test TMDB connection
const testTMDBConnection = async () => {
  try {
    console.log('🔗 Testing TMDB API connection...');
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    console.log('✅ TMDB API connected successfully!');
    console.log(`📊 Loaded ${response.data.results.length} movies`);
    return true;
  } catch (error) {
    console.log('❌ TMDB API connection failed:', error.message);
    console.log('💡 Make sure you have a valid TMDB API key in server.js');
    return false;
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Movie Review Platform API is running!',
    tmdb_status: 'connected'
  });
});

// Get popular movies
app.get('/api/movies/popular', async (req, res) => {
  try {
    console.log('🎬 Fetching popular movies from TMDB...');
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    console.log(`✅ Successfully loaded ${response.data.results.length} movies`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ TMDB API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch movies from TMDB',
      details: 'Check your API key in server.js'
    });
  }
});

// Get movie details
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🎬 Fetching movie details for ID: ${id}`);
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
    console.log(`✅ Successfully loaded: ${response.data.title}`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ TMDB API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch movie details',
      details: 'Check your API key in server.js'
    });
  }
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`🔍 Searching movies: "${query}"`);
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
    console.log(`✅ Search found ${response.data.results.length} results`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ TMDB API Error:', error.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Starting Movie Review Platform Backend...`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  
  // Test TMDB connection on startup
  const tmdbConnected = await testTMDBConnection();
  
  if (tmdbConnected) {
    console.log(`\n🎉 Backend is fully operational!`);
    console.log(`📝 Test: http://localhost:${PORT}/`);
    console.log(`🎬 Movies: http://localhost:${PORT}/api/movies/popular`);
  } else {
    console.log(`\n⚠️  Backend running but TMDB API not connected`);
    console.log(`💡 Replace the TMDB_API_KEY in server.js with your real key`);
  }
});