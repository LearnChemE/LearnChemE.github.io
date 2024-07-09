dtBtn = $("#double-tube-btn");
stBtn = $("#shell-tube-btn");

$(() => {
    dtBtn.click(() => {
        dtBtn.addClass("btn-primary");
        dtBtn.removeClass("btn-outline-primary");

        stBtn.addClass("btn-outline-primary");
        stBtn.removeClass("btn-primary");

        g.hexType = DOUBLE_TUBE;
    });
    stBtn.click(() => {
        stBtn.addClass("btn-primary");
        stBtn.removeClass("btn-outline-primary");

        dtBtn.addClass("btn-outline-primary");
        dtBtn.removeClass("btn-primary");

        g.hexType = SHELL_TUBE;
    });
});