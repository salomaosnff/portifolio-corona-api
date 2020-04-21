const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get("/", async (req, res) => {
    const url = 'https://api.thevirustracker.com/free-api?countryTotal=BR'
    const response = 
         await axios.get(url)
                    .then((response) => {

                        // response.data.countrydata.foreach((element) => {
                        
                        //     console.log(element.data)

                        //     // const dados = {
                        //     //     titulo: element.info.title,
                        //     //     code: element.info.code,
                        //     //     source: element.info.source,
                        //     //     cases: element.total_cases,
                        //     //     recovered: element.total_recovered,
                        //     //     deaths: element.total_deaths,
                        //     //     newCasesToday: element.total_new_cases_today,
                        //     //     newDeathsToday: element.total_new_deaths_today,
                        //     //     activeCases: element.total_active_cases,
                        //     //     seriousCases: element.total_serious_cases,
                        //     //     rank: element.total_danger_rank,
                        //     // }

                        //     // console.log(dados)

                        // })

                        const dados = {
                            titulo: response.data.countrydata[0].info.title,
                            code: response.data.countrydata[0].info.code,
                            source: response.data.countrydata[0].info.source,
                            cases: response.data.countrydata[0].total_cases,
                            recovered: response.data.countrydata[0].total_recovered,
                            deaths: response.data.countrydata[0].total_deaths,
                            newCasesToday: response.data.countrydata[0].total_new_cases_today,
                            newDeathsToday: response.data.countrydata[0].total_new_deaths_today,
                            activeCases: response.data.countrydata[0].total_active_cases,
                            seriousCases: response.data.countrydata[0].total_serious_cases,
                            rank: response.data.countrydata[0].total_danger_rank,
                        }
                        
                        res.status(201).json(dados)
                    })
                    .catch((err) => res.status(500).json({ error: err }));
})

module.exports = router;
