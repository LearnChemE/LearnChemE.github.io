const ul = document.getElementById("list");

let sorted_list = simulation_list.sort((a, b) => {
  if (a.title > b.title) { return 1 } else if (a.title < b.title) { return -1 } else { return 0 }
});

sorted_list = sorted_list.filter(sim => {
  return !sim.title.includes("PhET");
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

  const source = document.createElement('a');
  source.href = sim.src;
  source.target = "_blank";
  source.classList.add('source');
  source.title = 'View source code on GitHub';

  const source_img = document.createElement('img');
  source_img.src = './home_page/github.svg';
  source_img.alt = 'GitHub';
  source_img.classList.add('source-img');
  source.appendChild(source_img);

  card.appendChild(link);
  card.appendChild(source);
  grid.appendChild(card);

  card.addEventListener('mouseover', () => showTooltip(card, sim));
  card.addEventListener('mouseleave', () => removeTooltip(card));
});

function showTooltip(card, sim) {
  if (!document.getElementById('tooltip')) {

    card.style.zIndex = 1;
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.innerHTML = sim.tooltip;
    document.body.appendChild(tooltip);

    const rect = card.getBoundingClientRect();
    const x = rect.left;
    let y = rect.top;
    const width = rect.width;
    const height = rect.height;
    const x_right = window.innerWidth - x - width;

    if (y > window.innerHeight / 2) {
      const tooltipHeight = tooltip.getBoundingClientRect().height;
      tooltip.style.top = y + window.scrollY - tooltipHeight - 15 + 'px';
    } else {
      tooltip.style.top = y + window.scrollY + height + 20 + 'px';
    }

    if (x < 175) {
      tooltip.style.left = x + 'px';
    } else if (x < window.innerWidth - 350) {
      tooltip.style.left = x + width / 2 - 160 - 20 + 'px';
    } else {
      tooltip.style.right = x_right + 'px';
    }
  }
}

function removeTooltip(card) {
  if (document.getElementById('tooltip')) {
    document.getElementById('tooltip').remove();
  }
  card.style.zIndex = 0;
}