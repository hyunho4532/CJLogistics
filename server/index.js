const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/reverse/geocode", async (req, res) => {

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    try {
        const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': '6dqjmlyppv',
            'X-NCP-APIGW-API-KEY': 'BRR4QIDkcd9Ilj2uos8MNv214t7a5dJioSZ3HZXc'
          },
          params: {
            coords: `${longitude},${latitude}`,
            orders: 'roadaddr',
            output: 'json'
          }
        });
        res.json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Naver API' });
      }
})

app.post('/direction/driving', async (req, res) => {

  const location = req.body.location;
  const position = req.body.locationPosition;

  try {
      const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving', {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': '6dqjmlyppv',
          'X-NCP-APIGW-API-KEY': 'BRR4QIDkcd9Ilj2uos8MNv214t7a5dJioSZ3HZXc'
        },
        params: {
          start: `${location[1]},${location[0]}`,
          goal: `${position._lng},${position._lat}`
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data from Naver API' });
    }
});

app.listen(3000, (req, res) => {
    console.log("3000번 포트 연결 완료");
})