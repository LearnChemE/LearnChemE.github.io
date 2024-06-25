pistonBtn = $("#piston-btn");
barBtn = $("#bar-btn")
labelsBtn = $("#label-btn");
loBtn = $("#comp-btn-lo");
mdBtn = $("#comp-btn-md");
hiBtn = $("#comp-btn-hi");
resetBtn = $("#reset-piston-btn");

$(() => {
    pistonBtn.click(() => {
        pistonBtn.addClass("btn-success");
        pistonBtn.removeClass("btn-outline-success");

        barBtn.removeClass("btn-success");
        barBtn.addClass("btn-outline-success");

        g.display = PISTON;
    });
    barBtn.click(() => {
        barBtn.addClass("btn-success");
        barBtn.removeClass("btn-outline-success");

        pistonBtn.removeClass("btn-success");
        pistonBtn.addClass("btn-outline-success");

        g.display = BAR;
    });

    labelsBtn.click(() => {
        g.labels = !g.labels;
        if (g.labels) {
            labelsBtn.addClass("btn-secondary");
            labelsBtn.removeClass("btn-outline-secondary");
        }
        else {
            labelsBtn.removeClass("btn-secondary");
            labelsBtn.addClass("btn-outline-secondary");
        }
    });

    loBtn.click(() => {
        loBtn.addClass("btn-success");
        loBtn.removeClass("btn-outline-success");

        mdBtn.removeClass("btn-success");
        mdBtn.addClass("btn-outline-success");

        hiBtn.removeClass("btn-success");
        hiBtn.addClass("btn-outline-success");

        g.x_b = .25;
    });
    mdBtn.click(() => {
        mdBtn.addClass("btn-success");
        mdBtn.removeClass("btn-outline-success");

        loBtn.removeClass("btn-success");
        loBtn.addClass("btn-outline-success");

        hiBtn.removeClass("btn-success");
        hiBtn.addClass("btn-outline-success");

        g.x_b = .60;
    });
    hiBtn.click(() => {
        hiBtn.addClass("btn-success");
        hiBtn.removeClass("btn-outline-success");

        mdBtn.removeClass("btn-success");
        mdBtn.addClass("btn-outline-success");

        loBtn.removeClass("btn-success");
        loBtn.addClass("btn-outline-success");

        g.x_b = .85;
    });

    resetBtn.click(() => {
        g.pistonHeight = 0;
        document.getElementById("piston-slider-form").reset();
    });
});