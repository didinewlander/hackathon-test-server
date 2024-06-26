const path = require('path');
const fs = require('fs');

const uploadFile = (req, res) => {
  const file = req.file;
  const originalName = req.body.fileName;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const targetPath = path.join(__dirname, '../uploads', originalName);

  fs.rename(file.path, targetPath, (err) => {
    if (err) {
        console.log(err);
      return res.status(500).json({ message: 'Error saving file' });
    }
    res.download(targetPath, originalName, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending file' });
      }
      // Remove the file after sending it to the user
      fs.unlink(targetPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    });
  });
};

const downloadFile = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, '../uploads', filename);
  res.download(file, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error downloading file' });
    }
    // Remove the file after sending it to the user
    fs.unlink(file, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    });
  });
};

module.exports = {
  uploadFile,
  downloadFile,
};
