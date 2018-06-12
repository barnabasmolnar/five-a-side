const epkGoals = [
    {playerName: "Bognár Áron", playerGoals: 4},
    {playerName: "Buzai Patrik", playerGoals: 3},
    {playerName: "Csiszár Dávid", playerGoals: 5},
    {playerName: "Csonka Balázs", playerGoals: 1},
    {playerName: "Csonka Dávid", playerGoals: 1},
    {playerName: "Farkas Bence", playerGoals: 3},
    {playerName: "Horváth Csaba", playerGoals: 6},
    {playerName: "Kámán Dániel", playerGoals: 3},
    {playerName: "Kustor Tamás", playerGoals: 5},
    {playerName: "Láng Tamás", playerGoals: 0},
    {playerName: "Molnár Barnabás", playerGoals: 0},
    {playerName: "Molnár Zoltán", playerGoals: 10},
    {playerName: "Radics Bálint", playerGoals: 1},
    {playerName: "Szabó Áron", playerGoals: 0},
    {playerName: "Szabó Bálint", playerGoals: 7}
]

const app = new Vue({
    el: "#app",

    data: {
        autumnTable: [],
        springTable: [],
        finalTable: [],
        epkGoalScorers: epkGoals.slice().sort( (a,b) => b.playerGoals - a.playerGoals )
    },

    mounted: function () {
        fetch("output.json")
            .then(response => response.json())
            .then(jsonData => {
                const autumn = jsonData.slice().sort((a, b) => b.autumnPts === a.autumnPts ? b.autumnGD - a.autumnGD : b.autumnPts - a.autumnPts);
                const spring = jsonData.slice().sort((a, b) => b.springPts === a.springPts ? b.springGD - a.springGD : b.springPts - a.springPts);

                this.autumnTable.push(...autumn);
                this.springTable.push(...spring);

                this.finalTable.push(...jsonData);
            });
    }
});

// jquery smooth scroll
// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function () {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });