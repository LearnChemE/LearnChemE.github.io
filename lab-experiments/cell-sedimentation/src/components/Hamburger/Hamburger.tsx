import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import "./Hamburger.css";
import { Modal } from "../Modal/Modal";
interface WorksheetProps {
    path: string;
    downloadName: string;
    Directions: Component;
    About: Component;
}

export const HamburgerMenu: Component<WorksheetProps> = ({ path, downloadName, Directions, About }) => {
    const [showMenu, setShowMenu] = createSignal(false);
    const [showDirections, setShowDirections] = createSignal(false);
    const [showAbout, setShowAbout] = createSignal(false);

    // Click outside to close
    let ref!: HTMLDivElement;

    // Add a listener for when the user clicks outside
    onMount(() => {
        document.addEventListener("click", (e) => {
            if (!ref.contains(e.target as Node)) {
                setShowMenu(false);
            }
        });
    });

    return (<>
        <div class="hamburger-menu" ref={ref}>
            <div class="menu-btn" onclick={() => setShowMenu(!showMenu())}>
                <i class="fas fa-bars"></i>
            </div>
            <div class={`menu-content ${showMenu() ? "show" : ""}`}>
                <div class={"menu-item"} data-modal="directions" onClick={() => {setShowDirections(true); setShowMenu(false)}}>
                    <i class="fas fa-book"></i>
                    <span>Directions</span>
                </div>
                <a id="worksheet-download" download={downloadName} href={path}>
                    <div class="menu-item" data-modal="details">
                        <i class="fas fa-download"></i>
                        <span>Worksheet</span>
                    </div>
                </a>
                <div class="menu-item" data-modal="about" onClick={() => {setShowAbout(true); setShowMenu(false)}}>
                    <i class="fas fa-info-circle"></i>
                    <span>About</span>
                </div>
            </div>
        </div>
        <Modal key="directions" title="Directions" BodyHTML={Directions} show={[showDirections, setShowDirections]} />
        <Modal key="about" title="About" BodyHTML={About} show={[showAbout, setShowAbout]} />
        </>);
}
