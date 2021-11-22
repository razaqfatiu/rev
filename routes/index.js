const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const arts = await axios.default.get(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects?metadataDate=2021-11-19'
    );
    const response = await resolveArts(arts.data);
    res.render('index', { title: 'REV Artwork', arts: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const resolveArts = async (arts) => {
  const response = [];
  if (arts) {
    arts.objectIDs = arts.objectIDs.slice(1, 10)
    for (let i in arts.objectIDs) {
      const art = await axios.default.get(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${arts.objectIDs[i]}`
      );
      if (art.data && art.data.primaryImage) {
        response.push(art.data);
      }
    }
  }
  return response;
};
module.exports = router;
