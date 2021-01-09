require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const open = require('open');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// External API calls

// APOD
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`).then((res) => res.json());
        res.send({ image });
    } catch (err) {
        console.log('error:', err);
    }
});

// MARS Rovers
app.get('/marsRovers', async (req, res) => {
    let roversPhotos = {};
    await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${process.env.API_KEY}`)
        .then((res) => res.json())
        .then(({ latest_photos }) => {
            Object.assign(roversPhotos, { curiosity: latest_photos });
            return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos?api_key=${process.env.API_KEY}`);
        })
        .then((res) => res.json())
        .then(({ latest_photos }) => {
            Object.assign(roversPhotos, { opportunity: latest_photos });
            return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos?api_key=${process.env.API_KEY}`);
        })
        .then((res) => res.json())
        .then(({ latest_photos }) => {
            Object.assign(roversPhotos, { spirit: latest_photos });
            res.send(roversPhotos);
        })
        .catch((error) => console.log('error', error));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    open(`http://localhost:${port}`, { app: 'google chrome' });
});

// Adjust API Data
const groupByRovers = (data) => {
    const { photos } = data;
    return photos.reduce((acc, curr, index, arr) => {
        if (acc[curr.rover.name] === undefined) {
            acc[curr.rover.name] = {
                name: curr.rover.name,
                landing_date: curr.rover.launch_date,
                launch_date: curr.rover.landing_date,
                status: curr.rover.status,
                photos: [],
            };
        }
        acc[curr.rover.name].photos.push({ camera: curr.camera, img_src: curr.img_src, earth_date: curr.earth_date });

        if (arr.length === index + 1) {
            return { rovers: acc };
        }
        return acc;
    }, {});
};
