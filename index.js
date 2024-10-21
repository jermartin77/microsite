const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const app = express();
const port = 3000;

// Create a livereload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'docs'));

// Use connect-livereload middleware to inject livereload script into HTML
app.use(connectLivereload());

// Serve static files from the "docs" directory
app.use(express.static(path.join(__dirname, 'docs')));

// Fallback route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Reload the browser when changes are detected
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
