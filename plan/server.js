const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const logEvents = require('./logEvents');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3500;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Middleware
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// List files
app.get('/files', async (req, res) => {
    try {
        const files = await fs.readdir('uploads');
        res.json(files);
    } catch (err) {
        logEvents(err.message);
        res.status(500).send('Error reading files');
    }
});

// Upload a file
app.post('/upload', upload.single('file'), (req, res) => {
    logEvents(`File uploaded: ${req.file.originalname}`);
    res.redirect('/');
});

// Delete a file
app.delete('/files/:filename', async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    try {
        await fs.unlink(filePath);
        logEvents(`File deleted: ${req.params.filename}`);
        res.status(204).send();
    } catch (err) {
        logEvents(err.message);
        res.status(500).send('Error deleting file');
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
