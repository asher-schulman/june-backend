const { Router, response } = require("express");
const router = Router();
const axios = require('axios').default;

const apiKey = process.env.OPENWEATHERMAP_API_KEY

//index route
router.get("/", async (req, res) => {
    try {
        res.status(200).json( await {
            response: "welcome to the my weather api",
            how_to_use: "enter route '/api/zipcode' to make an API call to openweathermap to get current weather for queried zip code"
        })
    } catch (err) {
        res.status(400).json(err)
    }
})

// zipcode route
router.get("/:search", async (req, res) => {
    const query = req.params.search;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query},us&units=imperial&appid=${apiKey}`
    console.log('API request: ' + url)
    const response = await axios.get(url)
    // console.log(response.data)
    // console.log(`DATA: ${data}`)
    // let final;
    try {
        console.log('LAT: ' + response.data.coord.lon)
        console.log('LONG: ' + response.data.coord.lat)
        // console.log(response.data)
        res.status(200).json(response.data)
        // res.status(200).json(response)
    } catch (err) {
        res.status(400).json(err)
    }
});

// RETURN only long and lat by zipcode for other api
router.get("/:search/ll", async (req, res) => {
    const query = req.params.search;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query},us&units=imperial&appid=${apiKey}`
    const lat = await axios.get(url).then(console.log(response.data.coord.lat));
    const lon = await axios.get(url).then(console.log(response.data.coord.lon));
    lat = axios.get(url).then(lat = response.data.coord.lat)
    lon = axios.get(url).then(lon = response.data.coord.lon)
    const url2 = `pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}`
    // console.log(url)
    // data = await axios.get(url)
    // console.log(`DATA: ${data}`)
    try {
        
        const response = await axios.get(url)
        console.log(response)
        res.status(200).json(response)
       
    } catch (err) {
        res.status(400).json(err)
    }
});

module.exports = router;