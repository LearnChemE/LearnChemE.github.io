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
  
  const subtopics = Object.keys(data[topic]);
  
  for ( let j = 0; j < subtopics.length; j++ ) {
    
    const subtopic = subtopics[j];
    
    const dropdown = document.createElement("div");
    dropdown.classList.add("screencasts-dropdown");
    accordion.appendChild(dropdown);
    
    const dropdownTitle = document.createElement("div");
    dropdownTitle.classList.add("screencasts-dropdown-title");
    
    if (subtopic == "blank") {
      dropdownTitle.innerHTML = "Other Screencasts";
    } else {
      dropdownTitle.innerHTML = subtopics[j];
    }
    
    dropdown.appendChild(dropdownTitle);
    
    const dropdownListWrapper = document.createElement("div");
    dropdownListWrapper.classList.add("screencasts-dropdown-list-wrapper");
    dropdown.appendChild(dropdownListWrapper);
    
    const screencastsList = document.createElement("ul");
    dropdownListWrapper.appendChild(screencastsList);
    
    const videos = data[topic][subtopic];
    
    for ( let k = 0; k < videos.length; k++ ) {
      const video = videos[k];
      const anchor = document.createElement("a");
      anchor.setAttribute("href", video.url);
      anchor.setAttribute("title", video.description);
      anchor.setAttribute("target", "_blank");
      anchor.innerHTML = video.title;

      const li = document.createElement("li");
      screencastsList.appendChild(li);
      li.appendChild(anchor);
    }

    dropdownTitle.addEventListener("click", function() {
    if( dropdownListWrapper.style.display !== "block" ) {
      dropdownListWrapper.style.display = "block";
    } else {
      dropdownListWrapper.style.display = "none";
    }
  });
  }
}