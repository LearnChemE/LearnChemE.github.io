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


function addFreefall(){
    bc = document.createElement('div');
    bc.id = 'barchart';
    document.body.appendChild(bc);
    bc = document.getElementById('barchart');
    bc.style.display = 'block';
    bc.style.position = 'absolute';
    bc.style.background = `rgba(255, 255, 255, 1)`;
    //bc.style.border = `1px solid black`
    leftBarBottom = document.createElement('div');
    leftBarBottom.id = 'lbb';
    leftBarTop = document.createElement('div');
    leftBarTop.id = 'lbt';
    rightBarBottom = document.createElement('div');
    rightBarBottom.id = 'rbb';
    rightBarTop = document.createElement('div');
    rightBarTop.id = 'rbt';
    leftBarLabel = document.createElement('div');
    rightBarLabel = document.createElement('div');
    leftBarLabel.id= 'lbl';
    rightBarLabel.id = 'rbl';
    bc.appendChild(leftBarBottom);
    bc.appendChild(leftBarTop);
    bc.appendChild(rightBarBottom);
    bc.appendChild(rightBarTop);
    bc.appendChild(leftBarLabel);
    bc.appendChild(rightBarLabel);
    leftBarBottom = document.getElementById('lbb');
    leftBarTop = document.getElementById('lbt');
    rightBarBottom = document.getElementById('rbb');
    rightBarTop = document.getElementById('rbt');
    leftBarLabel = document.getElementById('lbl');
    rightBarLabel = document.getElementById('rbl');
    leftBarBottom.style.background = `${Acolor}`;
    rightBarBottom.style.background = `${Acolor}`;
    leftBarTop.style.background = `${Bcolor}`;
    rightBarTop.style.background = `${Bcolor}`;
    leftBarBottom.style.position = 'absolute';
    leftBarTop.style.position = 'absolute';
    rightBarBottom.style.position = 'absolute';
    rightBarTop.style.position = 'absolute';
    leftBarLabel.style.position = 'absolute';
    rightBarLabel.style.position = 'absolute';
    leftBarLabel.innerText = 'liquid';
    leftBarLabel.classList.add('label');
    rightBarLabel.innerText = 'vapor';
    rightBarLabel.classList.add('label');
    leftBarLabel.style.textAlign = 'center';
    rightBarLabel.style.textAlign = 'center';
    let transitionTime = 1;
    leftBarTop.style.transition = `height ${transitionTime}s`;
    rightBarTop.style.transition = `height ${transitionTime}s`;
}

function drawBarChart() {
    leftBarTop.style.height = `${barHeight * (1 - xAtarget)}px`;
    rightBarTop.style.height = `${barHeight * (1 - yAtarget)}px`;
}
