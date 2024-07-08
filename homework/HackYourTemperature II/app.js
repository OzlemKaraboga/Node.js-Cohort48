import express from 'express';
import keys from "./sources/keys.js";
import fetch from 'node-fetch';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello from backend to frontend!');
});

app.post('/weather', async (req, res) => {
    const { cityName } = req.body;

    if (!cityName) {
        return res.status(400).json({ error: "City name is required" });
    }
    if (cityName.length > 100) {
        return res.status(400).json({ error: "City name is too long" });
    }
    if (typeof cityName !== 'string') {
        return res.status(400).json({ error: "City name must be a string" });
    }

    try {
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${keys.API_KEY}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.cod === '404') {
            res.json({ weatherText: "City is not found!" });
        } else {
            const temperature = data.main.temp;
            const city = data.name;
            const weatherText = `The current temperature in ${city} is ${temperature}°C`;

            res.json({ weatherText });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default app;