const list = document.getElementById("screencasts-list");
const topics = Object.keys(window.screencasts_json);

const getVideo = function(id, title) {
  const dllinks = document.getElementsByClassName("dl-link");
  const inProgressElts = document.getElementsByClassName("in-progress");
  for ( let i = 0; i < dllinks.length; i++ ) {
    dllinks[i].style.display = "none";
  }

  fetch('https://learncheme-dl.herokuapp.com/download', {
  method: 'POST',
  credentials: 'omit',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({"id" : id}),
  }).then(response => {
    return response.body
  }).then(body => {
    const reader = body.getReader();
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
                controller.close();
                return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      }  
    })
  })
  .then(stream => new Response(stream))
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  .then(url => {
    const fileName = String(title).replace(/[^a-zA-Z\d]/gi,"").substr(0, 24);
    for ( let i = 0; i < dllinks.length; i++ ) {
      dllinks[i].style.display = "inline";
    };
    for ( let i = 0; i < inProgressElts.length; i++ ) {
      inProgressElts[i].style.display = "none";
    };
    const a = document.createElement("a");
    a.textContent = 'video/mp4';
    a.setAttribute("href", url);
    a.style.display = "none";
    a.setAttribute("download", `${fileName}.mp4`);
    document.body.appendChild(a);
    a.click();
  });
}

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
    
    const screencastsList = document.createElement("ul");
    screencastsList.setAttribute("toggle-state", "closed");
    dropdownListWrapper.appendChild(screencastsList);
    
    const videos = window.screencasts_json[topic][subtopic];
    
    for ( let k = 0; k < videos.length; k++ ) {
      const video = videos[k];
      const anchor = document.createElement("a");
      anchor.setAttribute("href", video.url);
      anchor.setAttribute("title", video.description);
      anchor.setAttribute("target", "_blank");
      anchor.innerHTML = video.title;

      const ytid = video.id;

      const dllink = document.createElement("div");
      dllink.classList.add("dl-link");
      dllink.innerHTML = "- download";

      const inProgress = document.createElement("div");
      inProgress.classList.add("in-progress");
      inProgress.innerHTML = "retrieving the requested resource...this may take a minute";

      dllink.addEventListener("click", () => {inProgress.style.display="inline"; getVideo(ytid, video.title)})

      const li = document.createElement("li");
      screencastsList.appendChild(li);
      li.appendChild(anchor);
      li.appendChild(dllink);
      li.appendChild(inProgress);
    }

    const margin = 30;
    const height = Number(screencastsList.getBoundingClientRect().height) + margin;

    dropdownTitle.addEventListener("click", function() {
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