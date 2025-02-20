const ul = document.getElementById("list");

const sorted_list = simulation_list.sort((a, b) => {
  if (a.title > b.title) { return 1 } else if (a.title < b.title) { return -1 } else { return 0 }
});


const grid = document.getElementById('simulations-grid');

sorted_list.forEach(sim => {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = sim.image;
  img.alt = sim.title;
  img.setAttribute('loading', 'lazy');

  const title = document.createElement('h2');
  title.textContent = sim.title;

  const img_container = document.createElement('div');
  img_container.classList.add('img-container');
  img_container.appendChild(img);

  const link = document.createElement('a');
  link.href = sim.href;
  link.target = "_blank";
  link.appendChild(img_container);
  link.appendChild(title);

  card.appendChild(link);
  grid.appendChild(card);
});