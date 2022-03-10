require("bootstrap");
require("./style/style.scss");
// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    topics: undefined,
    bubble_selected: false,
};

require("./js/topics.js");

const map_container = document.getElementById("map-container");
const map_container_rect = map_container.getBoundingClientRect();
const map_container_width = map_container_rect.width;
const map_container_height = map_container_rect.height;

const topics_list = Object.keys(gvs.topics);
// sort the topics alphabetically
topics_list.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
});
const topics_length = topics_list.length;

const bubble_width = 180; // width of each map topic (a.k.a. bubble) (px)
const margins = [
    [20, 20],
    [80, 30]
]; // margins on each side of the map container [[left, right], [top, bottom]] (px)
const gap = 10; // gap between each bubble: [left/right, top/bottom] (px)

const width_between_margins = map_container_width - margins[0][0] - margins[0][1] - 2 * gap;
const columns = Math.floor(width_between_margins / (bubble_width + gap));

map_container.style.paddingLeft = `${margins[0][0]}px`;
map_container.style.paddingRight = `${margins[0][1]}px`;
map_container.style.paddingTop = `${margins[1][0]}px`;
map_container.style.paddingBottom = `${margins[1][1]}px`;
const rows = Math.ceil(topics_length / columns);

map_container.style.gridTemplateColumns = `repeat(${columns}, ${bubble_width}px)`

let topic_index = 0; // index of each bubble in the topics list, i.e. topics_list[i]

for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
        if (topics_list[topic_index] !== undefined) {
            const bubble = document.createElement("div");
            bubble.classList.add("bubble", "unselected");
            const topic_key = topics_list[topic_index];
            const topic_innerText = topic_key[0].toUpperCase() + topic_key.slice(1, topic_key.length);
            const topic_id =
                topic_key.toLowerCase()
                .replaceAll("'", "")
                .replaceAll(/[^a-z0-9]/gi, "-")
                .replaceAll("--", "-")
                .replaceAll("--", "-");
            gvs.topics[topic_key].id = topic_id;
            bubble.id = topic_id;
            bubble.innerHTML = `
            <div class="exit-topic" id="exit-${topic_id}"><b>&#9587;</b></div>
            <div class="topic-innertext">${topic_innerText}</div>
            `;

            map_container.appendChild(bubble);

            bubble.addEventListener("click", () => {
                const page_width = window.innerWidth;
                const container_rect = document.getElementById("map-container").getBoundingClientRect();
                const bubble_rect = bubble.getBoundingClientRect();
                const container_height = container_rect.height;
                const container_margin_top = container_rect.top;
                const start_left = bubble_rect.left;
                const start_top = bubble_rect.top;
                const end_left = page_width / 2 - start_left;
                const end_top = container_margin_top + container_height / 2 - start_top;

                const topic_data = gvs.topics[topic_key];
                const topics_to_learn_beforehand = topic_data.topics_to_learn_beforehand;
                const topics_to_learn_afterwards = topic_data.topics_to_learn_afterwards;
                const total_to_learn = topics_to_learn_beforehand.length + topics_to_learn_afterwards.length - 1;

                for (let i = 0; i < topics_length; i++) {
                    const topic_id_i = gvs.topics[topics_list[i]].id;
                    const topic_i_elt = document.getElementById(topic_id_i);
                    
                    if (topic_id_i !== topic_id && gvs.bubble_selected == false) {
                        topic_i_elt.classList.add("hide");
                    } else if (gvs.bubble_selected == false) {
                        topic_i_elt.classList.add("selected");
                        topic_i_elt.classList.remove("unselected");
                        topic_i_elt.style.left = `${end_left}px`;
                        topic_i_elt.style.top = `${end_top}px`;
                        topic_i_elt.style.transform = `translate(-50%, -50%)`;

                        const exit = document.getElementById(`exit-${topic_id}`);
                        exit.style.display = "block";
                        exit.style.cursor = "pointer";
                        exit.style.pointerEvents = "all";
                        const radius_x = container_rect.width / 3.5;
                        const radius_y = container_rect.width / 5.5;
                        let angle = 0;
                        let angle_increment = Math.PI * 2 / (total_to_learn + 1);
                        for(let j = 0; j < topics_to_learn_beforehand.length; j++) {
                            const topic_to_learn_beforehand = topics_to_learn_beforehand[j];
                            const id = gvs.topics[topic_to_learn_beforehand].id;
                            const elt = document.getElementById(id);
                            const rect = elt.getBoundingClientRect();
                            const start_left = rect.left;
                            const start_top = rect.top;
                            const end_left = page_width / 2 - start_left + radius_x * Math.cos(angle);
                            const end_top = container_margin_top + container_height / 2 - start_top + radius_y * Math.sin(angle);
                            window.setTimeout(() => {
                                elt.classList.remove("hide");
                                elt.classList.remove("unselected");
                                elt.classList.add("selected");
                                document.getElementById(`exit-${id}`).style.display = "none";
                                elt.style.transform = `translate(-50%, -50%)`;
                                elt.style.left = `${end_left}px`;
                                elt.style.top = `${end_top}px`;
                            }, 100)
                            angle += angle_increment;
                        }

                        for(let j = 0; j < topics_to_learn_afterwards.length; j++) {
                            const topic_to_learn_afterwards = topics_to_learn_afterwards[j];
                            const id = gvs.topics[topic_to_learn_afterwards].id;
                            const elt = document.getElementById(id);
                            const rect = elt.getBoundingClientRect();
                            const start_left = rect.left;
                            const start_top = rect.top;
                            const end_left = page_width / 2 - start_left + radius_x * Math.cos(angle);
                            const end_top = container_margin_top + container_height / 2 - start_top + radius_y * Math.sin(angle);
                            window.setTimeout(() => {
                                elt.classList.remove("hide");
                                elt.classList.remove("unselected");
                                elt.classList.add("selected");
                                document.getElementById(`exit-${id}`).style.display = "none";
                                elt.style.transform = `translate(-50%, -50%)`;
                                elt.style.left = `${end_left}px`;
                                elt.style.top = `${end_top}px`;
                            }, 100)
                            angle += angle_increment;
                        }
                    }
                }
                gvs.bubble_selected = true;
            });

            const bubble_exit = document.getElementById(`exit-${topic_id}`); bubble_exit.addEventListener("click", () => {
                for (let i = 0; i < topics_length; i++) {
                    const topic_id_i = gvs.topics[topics_list[i]].id;
                    const topic_i_elt = document.getElementById(topic_id_i);
                    const topic_exit_id = `exit-${topic_id_i}`;
                    const topic_exit_elt = document.getElementById(topic_exit_id);
                    topic_exit_elt.style.display = "none";
                    topic_exit_elt.style.pointerEvents = "none";
                    topic_exit_elt.style.removeProperty("display");
                    topic_i_elt.classList.remove("hide");
                    topic_i_elt.classList.remove("selected");
                    topic_i_elt.classList.add("unselected");
                    topic_i_elt.style.left = "0px";
                    topic_i_elt.style.top = "0px";
                    topic_i_elt.style.transform = "translate(0px, 0px)";
                }
                window.setTimeout(() => {
                    gvs.bubble_selected = false;
                }, 100);
            });
        }
        topic_index++
    }
}

    window.onresize = function () {
        const map_container = document.getElementById("map-container");
        const map_container_rect = map_container.getBoundingClientRect();
        const map_container_width = map_container_rect.width;
        const width_between_margins = map_container_width - margins[0][0] - margins[0][1] - 2 * gap;
        const columns = Math.floor(width_between_margins / (bubble_width + gap));
        map_container.style.gridTemplateColumns = `repeat(${columns}, ${bubble_width}px)`
    }