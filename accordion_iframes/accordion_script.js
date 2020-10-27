const list = document.getElementById("screencasts-list");
const topics = Object.keys(window.screencasts_json);

for (let i = 0; i < topics.length; i++) {
  const topic = topics[i];
  const topicHeader = document.createElement("div");
  topicHeader.classList.add("screencasts-topic-header");
  
  if(topic == "blank") {
    topicHeader.innerHTML = "";
    topicHeader.style.display = "none";
  } else {
    topicHeader.innerHTML = topic; 
  }

  list.appendChild(topicHeader);
  
  const accordion = document.createElement("div");
  accordion.classList.add("screencasts-accordion");
  list.appendChild(accordion);
  
  const subtopics = Object.keys(window.screencasts_json[topic]);
  
  for ( let j = 0; j < subtopics.length; j++ ) {
    
    const subtopic = subtopics[j];
    
    const dropdown = document.createElement("div");
    dropdown.classList.add("screencasts-dropdown");
    accordion.appendChild(dropdown);
    
    const dropdownTitle = document.createElement("div");
    dropdownTitle.classList.add("screencasts-dropdown-title");

    const upDownArrow = document.createElement("div");
    upDownArrow.innerHTML = "^";
    upDownArrow.classList.add("up-down-arrow");
    dropdown.appendChild(upDownArrow);
    
    if (subtopic == "blank") {
      dropdownTitle.innerHTML = "Other Screencasts";
    } else {
      dropdownTitle.innerHTML = subtopics[j];
    }
    
    dropdown.appendChild(dropdownTitle);
    
    const dropdownListWrapper = document.createElement("div");
    dropdownListWrapper.classList.add("screencasts-dropdown-list-wrapper");
    dropdown.appendChild(dropdownListWrapper);
    
    const screencastsList = document.createElement("div");
    screencastsList.classList.add("screencasts-list");
    screencastsList.setAttribute("toggle-state", "closed");
    dropdownListWrapper.appendChild(screencastsList);
    
    const videos = window.screencasts_json[topic][subtopic];
    
    for ( let k = 0; k < videos.length; k++ ) {
      const video = videos[k];
      const youTubeId = video.id;

      const youTubeAnchor = document.createElement("a");
      youTubeAnchor.setAttribute("href", video.url);
      youTubeAnchor.setAttribute("title", video.description);
      youTubeAnchor.setAttribute("target", "_blank");
      youTubeAnchor.classList.add("yt-link");
      youTubeAnchor.innerHTML = video.title;

      const videoSrc = `https://www.lcedevelopment.com/wp-content/uploads/screencasts/video_${youTubeId}.mp4`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.innerHTML = "mirror";
      downloadAnchor.classList.add("dl-link");
      downloadAnchor.href = videoSrc;
      downloadAnchor.setAttribute("download", "");
      downloadAnchor.setAttribute("target", "_blank");

      const listItem = document.createElement("div");
      listItem.classList.add("list-item");
      
      listItem.appendChild(youTubeAnchor);
      listItem.appendChild(downloadAnchor);
      screencastsList.appendChild(listItem);
    }

    dropdownTitle.addEventListener("click", function() {
      const margin = 15;
      const height = Number(screencastsList.getBoundingClientRect().height) + (2 * margin);
      if( screencastsList.getAttribute("toggle-state") == "closed" ) {
        screencastsList.setAttribute("toggle-state", "open");
        upDownArrow.style.transform = "rotate(0deg)";
        dropdownListWrapper.style.height = `${height}px`;
      } else {
        screencastsList.setAttribute("toggle-state", "closed");
        upDownArrow.style.transform = "rotate(180deg)";
        dropdownListWrapper.style.height = "0px";
      }
    });
  }
}