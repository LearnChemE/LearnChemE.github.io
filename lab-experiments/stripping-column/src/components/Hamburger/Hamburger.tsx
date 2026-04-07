import type { Component } from "solid-js";
import { createSignal, Match, onMount, Switch } from "solid-js";
import "./Hamburger.css";
import { Modal } from "../Modal/Modal";
import { SIM_MODE } from "../../globals";

interface WorksheetProps {
    abspath: string;
    strpath: string;
    absmebpath: string;
    strmebpath: string;
    Directions: Component;
    About: Component;
}

export const HamburgerMenu: Component<WorksheetProps> = ({ abspath, strpath, absmebpath, strmebpath, Directions, About }) => {
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
                <Switch>
                    <Match when={SIM_MODE === "meb"}>
                        <a id="worksheet-download" download={"stripping-column-meb-worksheet.pdf"} href={strmebpath}>
                            <div class="menu-item" data-modal="details">
                                <i class="fas fa-download"></i>
                                <span>Worksheet (stripping)</span>
                            </div>
                        </a>
                        <a id="worksheet-download" download={"absorption-column-meb-worksheet.pdf"} href={absmebpath}>
                            <div class="menu-item" data-modal="details">
                                <i class="fas fa-download"></i>
                                <span>Worksheet (absorption)</span>
                            </div>
                        </a>
                    </Match>
                    <Match when={SIM_MODE === "stripping"}>
                        <a id="worksheet-download" download={"stripping-efficiency-worksheet.pdf"} href={strpath}>
                            <div class="menu-item" data-modal="details">
                                <i class="fas fa-download"></i>
                                <span>Worksheet</span>
                            </div>
                        </a>
                    </Match>
                    <Match when={SIM_MODE === "absorption"}>
                        <a id="worksheet-download" download={"absorption-efficiency-worksheet.pdf"} href={abspath}>
                            <div class="menu-item" data-modal="details">
                                <i class="fas fa-download"></i>
                                <span>Worksheet</span>
                            </div>
                        </a>
                    </Match>
                </Switch>
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
