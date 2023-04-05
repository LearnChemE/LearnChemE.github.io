const inputsBox = document.getElementById("inputs-box");

for(let i = 0; i <= 200; i++) {
  let R = Math.round(200 * Math.random());
  let G = Math.round(200 * Math.random());
  let B = Math.round(200 * Math.random());
  if(R > 150 & G > 150 & B > 150) {
    R = 150;
    G = 150;
    B = 150;
  }
  const color = `rgb(${R}, ${G}, ${B})`;
  gvs.colors.push(color);
}

for(let i = 0; i <= 20; i++) {
  if(i == 10) {i++}
  const k = Math.round(-10 + i);
  const container = document.createElement("div");
  const numberDiv = document.createElement("div");
  const kDiv = document.createElement("input");
  const CkDiv = document.createElement("input");
  container.classList.add("inputs-container");
  numberDiv.classList.add("list-number");
  kDiv.classList.add("k-input");
  CkDiv.classList.add("ck-input");
  kDiv.setAttribute("type", "number");
  CkDiv.setAttribute("type", "number");
  let number;
  if(k < 0) {number = i + 1} else {number = i}
  if(number % 2 === 0) {
    container.classList.add("even");
  }
  numberDiv.innerHTML = `${Math.round(number)}`;
  kDiv.value = `${k}`;
  CkDiv.value = k === -2 || k === 2 ? "1" : "0"; 
  container.appendChild(numberDiv);
  container.appendChild(numberDiv);
  container.appendChild(kDiv);
  container.appendChild(CkDiv);
  inputsBox.appendChild(container);
  kDiv.id = `k-${number}-input`;
  CkDiv.id = `ck-${number}-input`;
  gvs.coefficients[`${number}`] = {
    k : k,
    ck : Number(CkDiv.value),
  }
  kDiv.addEventListener("change", () => {
    const k = Math.max(-100, Math.min(100, Math.round(kDiv.value)));
    kDiv.value = `${k}`;
    gvs.coefficients[`${number}`].k = k;
    gvs.p.redraw();
  });
  CkDiv.addEventListener("change", () => {
    const ck = Math.max(0, Number(CkDiv.value));
    CkDiv.value = `${ck}`;
    gvs.coefficients[`${number}`].ck = ck;
    gvs.p.redraw();
  })
}