// const axios = require("axios");
// const fs = require("fs");

// // Update the path to the uploaded image
// const image = fs.readFileSync("OIP.jpg", {
//     encoding: "base64"
// });

// axios({
//     method: "POST",
//     url: "https://detect.roboflow.com/plantsdetector/1",
//     params: {
//         api_key: "eoF3dHN6vYVl7mStkt2I"
//     },
//     data: image,
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// })
// .then(function(response) {
//     console.log(response.data);
   
// })
// .catch(function(error) {
//     console.log(error.message);
// });

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));  // Serve static files (for frontend)

// Endpoint to handle the image upload and classification
app.post('/api/detect-plant', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded image and convert it to base64
    const imagePath = path.join(__dirname, req.file.path);
    const image = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Send the image to Roboflow API for classification
    axios({
        method: 'POST',
        url: 'https://detect.roboflow.com/plantsdetector/1',
        params: {
            api_key: 'eoF3dHN6vYVl7mStkt2I'
        },
        data: image,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(function(response) {
        // Send the response data back to the frontend
        res.json(response.data);
    })
    .catch(function(error) {
        // Handle error and send a response back to the frontend
        res.status(500).json({ error: error.message });
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

