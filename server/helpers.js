module.exports = {
    isAutumn: (matchObj) => {
        return new Date(matchObj.children().first().text()).getFullYear() < 2018;
    },
    
    isTeam: (matchObj, team) => {
        return matchObj.children().eq(3).text().trim() === team;
    },
    
    pushToAsHomeTeam: (matchObj, arr, team) => {
        const score = matchObj.children().eq(5).text().trim();
        const [homeScore, awayScore] = score.split(":");
        if (score !== "-") {
            arr.push({
                [team]: parseInt(homeScore),
                oppo: parseInt(awayScore)
            });
        }
    },
    
    pushToAsAwayTeam: (matchObj, arr, team) => {
        const score = matchObj.children().eq(5).text().trim();
        const [homeScore, awayScore] = score.split(":");
        if (score !== "-") {
            arr.push({
                [team]: parseInt(awayScore),
                oppo: parseInt(homeScore)
            });
        }
    },

    incrementPeriod: (period, currentTeam) => {
        let pts = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let gf = 0;
        let ga = 0;

        for (const item of period) {

            gf += item[currentTeam];
            ga += item["oppo"];

            if ( item[currentTeam] > item["oppo"] ) {
                pts += 3;
                wins++;
            } else if ( item[currentTeam] === item["oppo"] ) {
                pts += 1;
                draws++;
            } else if ( item[currentTeam] < item["oppo"] ) {
                losses++;
            }
        }

        return {
            pts,
            wins,
            draws,
            losses,
            gf,
            ga,
            gd: gf - ga
        }
    }
}