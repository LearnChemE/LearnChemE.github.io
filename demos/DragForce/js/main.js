//code for drag force calculation will go in here. 
let Acolor = 'rgb(80, 0, 180)';
let Bcolor = 'rgb(130, 180, 0)';


window.onload = (event) => {
    //alert("onload");
    mainDiv = document.getElementById('main');
    addFreefall();
    addVTD();
    addModify();  
    resize();
};


