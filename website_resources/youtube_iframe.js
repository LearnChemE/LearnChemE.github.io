const video_frame = document.getElementById("video-frame");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
const video_url = `https://www.youtube.com/embed/${id}`;
const options = `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`;

video_frame.setAttribute("allowfullscreen", "true");
video_frame.setAttribute("allow", options);
video_frame.setAttribute("src", video_url);