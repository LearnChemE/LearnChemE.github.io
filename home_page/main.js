const ul = document.getElementById("list");

const sorted_list = simulation_list.sort((a, b) => {
  if (a.title > b.title) { return 1 } else if (a.title < b.title) { return -1 } else { return 0 }
});

sorted_list.forEach((item) => {
  const li = document.createElement("li");
  li.innerHTML = `<a href="${item.href}">${item.title}</a>`;
  ul.appendChild(li);
});