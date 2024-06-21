lin = $("#lin-btn");
mic = $("#mic-btn");

com = $("#competitive-btn");
unc = $("#uncompetitive-btn");
non = $("#noncompetitive-btn");
self = $("#self-btn");

$(() => {

    // Toggle plot type
    lin.click(() => {
        lin.removeClass("btn-outline-success");
        lin.addClass("btn-success");

        mic.removeClass("btn-success");
        mic.addClass("btn-outline-success");

        g.plotType = LINE_BURKE;
        findGraphAxesRange();
    });
    mic.click(() => {
        lin.removeClass("btn-success");
        lin.addClass("btn-outline-success");

        mic.removeClass("btn-outline-success");
        mic.addClass("btn-success");

        g.plotType = MICH_MENT;
        findGraphAxesRange();
    });

    com.click(() => {
        com.addClass("btn-secondary");
        com.removeClass("btn-outline-secondary");

        unc.removeClass("btn-secondary");
        unc.addClass("btn-outline-secondary");

        non.removeClass("btn-secondary");
        non.addClass("btn-outline-secondary");

        self.removeClass("btn-secondary");
        self.addClass("btn-outline-secondary");

        g.mechType = COMPETITIVE;
        findGraphAxesRange();
    });
    unc.click(() => {
        unc.addClass("btn-secondary");
        unc.removeClass("btn-outline-secondary");

        com.removeClass("btn-secondary");
        com.addClass("btn-outline-secondary");

        non.removeClass("btn-secondary");
        non.addClass("btn-outline-secondary");

        self.removeClass("btn-secondary");
        self.addClass("btn-outline-secondary");

        g.mechType = UNCOMPETITIVE;
        findGraphAxesRange();
    });
    non.click(() => {
        non.addClass("btn-secondary");
        non.removeClass("btn-outline-secondary");

        unc.removeClass("btn-secondary");
        unc.addClass("btn-outline-secondary");

        com.removeClass("btn-secondary");
        com.addClass("btn-outline-secondary");

        self.removeClass("btn-secondary");
        self.addClass("btn-outline-secondary");

        g.mechType = NONCOMPETITIVE;
        findGraphAxesRange();
    });
    self.click(() => {
        self.addClass("btn-secondary");
        self.removeClass("btn-outline-secondary");

        unc.removeClass("btn-secondary");
        unc.addClass("btn-outline-secondary");

        com.removeClass("btn-secondary");
        com.addClass("btn-outline-secondary");

        non.removeClass("btn-secondary");
        non.addClass("btn-outline-secondary");

        g.mechType = SELF_INHIBITED;
        findGraphAxesRange();
    });

});
