$(() => {

    lin = $("#lin-btn");
    mic = $("#mic-btn");

    // Toggle plot type
    lin.click(() => {

        lin.removeClass("btn-outline-success");
        lin.addClass("btn-success");

        mic.removeClass("btn-success");
        mic.addClass("btn-outline-success");
    });
    mic.click(() => {

        lin.removeClass("btn-success");
        lin.addClass("btn-outline-success");

        mic.removeClass("btn-outline-success");
        mic.addClass("btn-success");
    });

});
