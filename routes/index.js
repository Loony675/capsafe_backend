var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
/* GET home page. */
router.get("/displayJourney", function (req, res) {

  const options = {
    headers: {
      Authorization: "a3241d36-8169-4f8b-840c-214b769f3771"
    }
  };
 fetch(`https://api.navitia.io/v1/journeys?from=2.3036095;48.8877713&to=2.655400;48.542107`, options).then(
  reponseAPI => reponseAPI.json().then(
    reponseAPIJson =>{ 
      if(reponseAPIJson.journeys[0].sections){
        let test = reponseAPIJson.journeys[0].sections.map(data =>{
          console.log(data);
        })
        res.json({ result: true, journey: test });
      }else{
        res.json({ result: false});
      }
    }
  )
)
});

module.exports = router;
