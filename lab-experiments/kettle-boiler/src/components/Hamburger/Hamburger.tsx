import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import "./Hamburger.css";

interface WorksheetProps {
    path: string;
    downloadName: string;
}

export const HamburgerMenu: Component<WorksheetProps> = ({ path, downloadName }) => {
    const [showMenu, setShowMenu] = createSignal(false);

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

    return (
        <div class="hamburger-menu" ref={ref}>
            <div class="menu-btn" onclick={() => setShowMenu(!showMenu())}>
                <i class="fas fa-bars"></i>
            </div>
            <div class={`menu-content ${showMenu() ? "show" : ""}`}>
                <div class={"menu-item"} data-modal="directions">
                    <i class="fas fa-book"></i>
                    <span>Directions</span>
                </div>
                <a id="worksheet-download" download={downloadName} href={path}>
                    <div class="menu-item" data-modal="details">
                        <i class="fas fa-download"></i>
                        <span>Worksheet</span>
                    </div>
                </a>
                <div class="menu-item" data-modal="about">
                    <i class="fas fa-info-circle"></i>
                    <span>About</span>
                </div>
            </div>
        </div>);
}
