# Five-a-side football league

This application calculates and displays the autumn and spring tables of our local five-a-side football league.

I thought it would be interesting to see how much our team improved in the spring period but I certainly wasn't about to calculate it by hand. Thus came into existence this app.

The local league has a website with all kinds of information readily available.

Navigating to http://www.kispalyasopron.hu/tabellak#osztaly4, you will find the final table. Clicking on a team will take you to a page where its match results are displayed.

The idea is to take each team and calculate the number of points they got in the autumn and spring periods respectively.

Take for instance, our team: http://www.kispalyasopron.hu/csapat/881. As can be seen the autumn period took place in 2017 while the spring one took place in 2018.

We need to get this data and process it somehow. This is done via web-scraping. Once that's done, displaying the processed data is fairly trivial.

## Server side

This is where we scrape the relevant data.
As already seen, match results are readily available for all teams. But first, we need a list of the participating teams and we need to know their respective URLs where this data is available as well.

A quick and dirty way to get the team names and IDs from here:
http://www.kispalyasopron.hu/tabellak

I'm just copy + pasting the code below into the browser console

And then copy + pasting the result of... well, result... into the app.js file as the allTeams array

```javascript
const teams = Array.from( document.querySelectorAll("#osztaly4 a[href*=csapat]") );
const result = teams.map( team => ({ team: team.innerText.trim(), teamID: team.href }) );
```

This gives us an array of each team's name and their respective IDs from which we can easily construct the relevant URLs (which follow the http://www.kispalyasopron.hu/csapat/{teamID} pattern).

We map through each team and construct an object with all the relevant data. We save this data as json using the node filesystem module. You can find an output.json in the client folder for reference.

To generate an output.json, just:
* cd into server directory
* npm install
* node app.js

## Client side

On the client side, we use Vue.js to process and display the contents of this output.json file.

Goalscorers have also been added for our team, just to make this a nice little complete package.

Once again, a quick and dirty way to get goal scorers from our own team, EPK:

Go to http://www.kispalyasopron.hu/csapat/881 and just copy + paste the result into the client.

```javascript
const players = Array.from( document.querySelectorAll(".col-lg-4 tbody tr") );
const playerGoals = players.map(player => ({
    playerName: player.children[0].innerText.trim(),
    playerGoals: parseInt(player.children[3].innerText.trim())
}));
```

Sorting and appending it to the vue data object was fairly trivial.

## Live demo:

A live, working demo can be found here:

http://barnabas.uw.hu/kispalya/index.html