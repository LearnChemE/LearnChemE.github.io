import type { Component } from "solid-js";

interface FillerProps {
    id: string;
};

export const Filler: Component<FillerProps> = ({ id }) => {
    return (<>
        <mask id={id}>
            
        </mask>
    </>);
}

// <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
//   <defs>
//     <!-- Mask definition -->
//     <mask id="hide-under-circle">
//       <!-- White = visible, black = hidden -->
//       <rect width="100%" height="100%" fill="white" />
//       <circle cx="100" cy="100" r="50" fill="black" />
//     </mask>
//   </defs>

//   <!-- Background -->
//   <rect width="200" height="200" fill="lightblue" />

//   <!-- The element that will be hidden only under the circle -->
//   <rect width="200" height="200" fill="red" mask="url(#hide-under-circle)" />

//   <!-- The transparent circle itself -->
//   <circle cx="100" cy="100" r="50" fill="rgba(255,255,255,0.5)" />
// </svg>
