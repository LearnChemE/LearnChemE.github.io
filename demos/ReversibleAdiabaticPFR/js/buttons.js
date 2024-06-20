$(() => {
  // Toggle reaction type
  $("#exothermic-btn").click(() => {
    // Make clicked button green
    $("#exothermic-btn").removeClass("btn-outline-danger");
    $("#exothermic-btn").addClass("btn-danger");
    // Make other button grey
    $("#endothermic-btn").removeClass("btn-success");
    $("#endothermic-btn").addClass("btn-outline-success");
  });
  $("#endothermic-btn").click(() => {
    // Make clicked button green
    $("#endothermic-btn").removeClass("btn-outline-success");
    $("#endothermic-btn").addClass("btn-success");
    // Make other button grey
    $("#exothermic-btn").removeClass("btn-danger");
    $("#exothermic-btn").addClass("btn-outline-danger");
  });

});
