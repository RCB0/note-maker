const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const logEvent = require('./logevents'); // Import log events module
const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    logEvent(`File uploaded: ${fileName}`);
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Middleware to serve static files
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Upload file endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully: ' + req.file.filename);
  logEvent(`File successfully handled: ${req.file.filename}`);
});

// List files endpoint
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      logEvent('Error listing files');
      return res.status(500).send('Unable to scan files!');
    }

    const fileList = files.map(file => ({
      name: file,
      url: `/uploads/${file}`,
    }));
    res.json(fileList);
    logEvent('File list retrieved');
  });
});

// Delete file endpoint
app.delete('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      logEvent(`Error deleting file: ${req.params.filename}`);
      return res.status(500).send('Unable to delete file!');
    }
    res.send('File deleted successfully');
    logEvent(`File deleted: ${req.params.filename}`);
  });
});

// Rename file endpoint
app.put('/files/:oldName', (req, res) => {
  const oldPath = path.join(__dirname, 'uploads', req.params.oldName);
  const newPath = path.join(__dirname, 'uploads', req.body.newName);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      logEvent(`Error renaming file: ${req.params.oldName} to ${req.body.newName}`);
      return res.status(500).send('Unable to rename file!');
    }
    res.send('File renamed successfully to: ' + req.body.newName);
    logEvent(`File renamed from ${req.params.oldName} to ${req.body.newName}`);
  });
});

// Share file endpoint (returning a public URL)
app.get('/share/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logEvent(`Error sharing file: ${fileName}`);
      return res.status(404).send('File not found!');
    }
    const shareUrl = `http://localhost:${PORT}/uploads/${fileName}`;
    res.json({ shareUrl });
    logEvent(`File shared: ${fileName}`);
  });
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    logEvent('HTML file served');
});

// Start the server and log it
app.listen(PORT, () => {
  logEvent(`Server is running on http://localhost:${PORT}`);
});
