const express = require('express');
const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const app = express();
const h = require('./helpers');

app.get('/scrape', function (req, res) {

    const allTeams = [
        {team: "EXVAX", teamID: "878"},
        {team: "Soproni RK-SRSE", teamID: "865"},
        {team: "Soproni Vízmű SE", teamID: "880"},
        {team: "Fidelissima", teamID: "877"},
        {team: "Let’s Move Team", teamID: "879"},
        {team: "Tanqok", teamID: "876"},
        {team: "Végetech Bt.", teamID: "867"},
        {team: "EPK", teamID: "881"},
        {team: "VIAD", teamID: "864"},
        {team: "JOMA Sport", teamID: "870"},
        {team: "Golgota FC", teamID: "872"},
        {team: "Csaknorisz", teamID: "868"},
        {team: "Esély SE", teamID: "873"},
        {team: "Soccers Team", teamID: "869"},
        {team: "Drink Team", teamID: "871"},
        {team: "Padlás Club Sopron", teamID: "875"},
        {team: "Ünneprontók", teamID: "874"}
    ]

    const promises = allTeams.map(team => {
        const currentTeam = team.team;
        const url = `http://www.kispalyasopron.hu/csapat/${team.teamID}`;
        return request(url).then(html => {
            
            const $ = cheerio.load(html);
            const table = $(".col-lg-8 .table");
            const matches = $(".col-lg-8 .table tr");
            
            const autumn = [];
            const spring = [];

            matches.each((idx, match) => {
                const $match = $(match);

                if ( h.isAutumn($match) ) {
                    if ( h.isTeam($match, currentTeam) ) {
                        h.pushToAsHomeTeam($match, autumn, currentTeam);
                    } else {
                        h.pushToAsAwayTeam($match, autumn, currentTeam);
                    }
                } else {
                    if ( h.isTeam($match, currentTeam) ) {
                        h.pushToAsHomeTeam($match, spring, currentTeam);
                    } else {
                        h.pushToAsAwayTeam($match, spring, currentTeam);
                    }
                }
            });

            const autumnStats = h.incrementPeriod(autumn, currentTeam);
            const springStats = h.incrementPeriod(spring, currentTeam);

            const teamInfo = {
                team: currentTeam,

                // matches: [...autumn, ...spring],
                autumnPts: autumnStats.pts,
                springPts: springStats.pts,
                finalPts: autumnStats.pts + springStats.pts,
                
                autumnWins: autumnStats.wins,
                autumnDraws: autumnStats.draws,
                autumnLosses: autumnStats.losses,
                autumnGF: autumnStats.gf,
                autumnGA: autumnStats.ga,
                autumnGD: autumnStats.gd,
                
                springWins: springStats.wins,
                springDraws: springStats.draws,
                springLosses: springStats.losses,
                springGF: springStats.gf,
                springGA: springStats.ga,
                springGD: springStats.gd,

                
                finalWins: autumnStats.wins + springStats.wins,
                finalDraws: autumnStats.draws + springStats.draws,
                finalLosses: autumnStats.losses + springStats.losses,
                finalGF: autumnStats.gf + springStats.gf,
                finalGA: autumnStats.ga + springStats.ga,
                finalGD: autumnStats.gd + springStats.gd
            };

            return teamInfo;
        });
    });
    
    Promise.all(promises).then(data => {
        fs.writeFile('output-v11.json', JSON.stringify(data, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        });

        res.send('Check your console!');
    });

});

app.listen('8081');