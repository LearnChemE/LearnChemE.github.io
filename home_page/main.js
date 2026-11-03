const grid = document.getElementById('simulations-grid');
const filters = document.getElementById('simulation-filters');

const simulationSources = [
  {
    id: 'from spreadsheet',
    label: 'From Spreadsheet JSON',
    load: async () => simulation_list
  },
  {
    id: 'lab-experiments',
    label: 'Lab Experiments',
    url: './home_page/output/lab-experiments.json',
    key: 'experiments'
  },
  {
    id: 'demos',
    label: 'Demos',
    url: './home_page/output/demos.json',
    key: 'demos'
  },
  {
    id: 'under-review',
    label: 'Under Review',
    url: './home_page/output/under-review.json',
    key: 'under_review'
  }
];

async function loadJSONList(source) {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to load ${source.label}: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : Array.isArray(data[source.key]) ? data[source.key] : [];
}

(async () => {
  const loadedSources = await Promise.all(simulationSources.map(async source => {
    try {
      return {
        ...source,
        simulations: source.load ? await source.load() : await loadJSONList(source)
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }));
  const sources = loadedSources.filter(source => source !== null);
  const sorted_list = sources.flatMap(source =>
    source.simulations
      .filter(sim => !sim.title.includes("PhET"))
      .map(sim => ({ simulation: sim, sourceId: source.id }))
  ).sort((a, b) => {
    if (a.simulation.title > b.simulation.title) { return 1; }
    if (a.simulation.title < b.simulation.title) { return -1; }
    return 0;
  });

  createFilters(sources);
  sorted_list.forEach(({ simulation: sim, sourceId }) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.sourceId = sourceId;

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
})();

function createFilters(sources) {
  const options = [{ id: 'all', label: 'All' }, ...sources];

  options.forEach((option, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'simulation-filter';
    input.value = option.id;
    input.checked = index === 0;
    input.addEventListener('change', () => {
      if (input.checked) {
        grid.querySelectorAll('.card').forEach(card => {
          card.hidden = option.id !== 'all' && card.dataset.sourceId !== option.id;
        });
      }
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(option.label));
    filters.appendChild(label);
  });
}

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