import { createEffect, onMount, type Component, type Signal } from "solid-js";
import "./Modal.css"

interface ModalProps {
    key: string;
    title: string;
    BodyHTML: Component;
    show: Signal<boolean>;
};

export const Modal: Component<ModalProps> = ({ key, title, BodyHTML, show }) => {
    const [getShow, setShow] = show;

    const hideIfClickedOut = (e: MouseEvent) => {
        if (!ref.contains(e.target as Node)) {
            setShow(false);
        }
    }

    let ref!: HTMLDivElement;
    // Hide when clicked 
    // On mount to make sure ref is defined
    onMount(() => {
        // Create effect to make sure show is subscribed
        createEffect(() => {    
            // If showing, attach an event listener to leave
            var showing = getShow();
            if (showing) {
                document.addEventListener("click", hideIfClickedOut);
            }
            else {
                document.removeEventListener("click", hideIfClickedOut);
            }
        })
    });

    return (
    <div id={`${key}-modal`} class="modal" style={`display: ${getShow() ? "block" : "none"};`}>
        <div ref={ref} class="modal-content">
            <span class="close-btn" onclick={() => setShow(false)}>&times;</span>
            <div class="modal-header">
                <h2> { title } </h2>
            </div>
            <div class="modal-body">
                <BodyHTML />
            </div>
        </div>
    </div>
    );
}