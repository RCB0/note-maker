const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { logEvent } = require('./logEvents'); // Correctly import logEvent

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Middleware to serve static files
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Upload file endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully: ' + req.file.filename);
});

// List files endpoint
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) return res.status(500).send('Unable to scan files!');
        const fileList = files.map(file => ({
            name: file,
            url: `/uploads/${file}`,
        }));
        res.json(fileList);
    });
});

// Delete file endpoint
app.delete('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).send('Unable to delete file!');
        res.send('File deleted successfully');
    });
});

// Rename file endpoint
app.put('/files/:oldName', (req, res) => {
    const oldPath = path.join(__dirname, 'uploads', req.params.oldName);
    const newPath = path.join(__dirname, 'uploads', req.body.newName);

    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.status(500).send('Unable to rename file!');
        res.send('File renamed successfully to: ' + req.body.newName);
    });
});

// Share file endpoint (returning a public URL)
app.get('/share/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).send('File not found!');
        const shareUrl = `http://localhost:${PORT}/uploads/${fileName}`;
        res.json({ shareUrl });
    });
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    logEvent(`Server is running on http://localhost:${PORT}`); // Log server start event
});
