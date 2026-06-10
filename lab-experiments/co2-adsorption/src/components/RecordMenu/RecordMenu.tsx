import { createEffect, createMemo, createSignal, Show, type Component } from "solid-js";
import { DataRecorder } from "./record";
import { ControlButton } from "../ControlButton/ControlButton";
import "./RecordMenu.css";

type RecordMenuProps = {
  exportData: () => Record<string, any>;
};

const defaultCoords = { x: 150, y: 85 };

export const RecordMenu: Component<RecordMenuProps> = (props) => {
    const [showing, setShowing] = createSignal(false);
    const [coords, setCoords] = createSignal(defaultCoords);
    const recorder = new DataRecorder(props.exportData);

    const state = createMemo(() => recorder.recording() ? "playing" : 
        recorder.exportReady() ? "finished" : 
        "initial");

    const toggleRecording = () => {
        if (state() === "initial") {
            recorder.record();
        }
        else if (state() === "playing") {
            recorder.stop();
        }
        else {
            recorder.reset();
        }
    }

    const icon = createMemo(() => state() === "initial" ? "fa-play" :
        state() === "playing" ? "fa-square" :
        "fa-arrows-rotate");
    const btnClass = createMemo(() => state() === "initial" ? "play" :
        "pause");
    const playBtnTitle = createMemo(() => state() === "initial" ? "start recording data" :
        state() === "playing" ? "finish recording data" :
        "reset for next recording");

    let px: number | null = null;
    let py: number | null = null;
    const handleDrag = (e: PointerEvent) => {
        if (px === null || py === null) {
            px = e.clientX;
            py = e.clientY;
            return;
        }

        const dx = e.clientX - px;
        const dy = e.clientY - py;
        const {x, y} = coords();
        px = e.clientX;
        py = e.clientY;
        setCoords({ x: x + dx, y: y + dy });
    }
    const endDrag = () => {
        window.removeEventListener("pointermove", handleDrag);
        px = null;
        py = null;
    }
    const beginDrag = () => {
        window.addEventListener("pointermove", handleDrag);
        window.addEventListener("pointerup", endDrag);
    }

    createEffect(() => {
        if (!showing()) setCoords(defaultCoords);
    });

    return <>
        <ControlButton left={155} label="record data" icon="fa-solid fa-file-waveform" onClick={() => setShowing(s => !s)} active={showing}  />
        <Show when={showing()}>
            <div class="record-menu" style={`top: ${coords().y}px; left: ${coords().x}px`}>  
                <div class="menu-header" onPointerDown={beginDrag}>
                    <span style="margin-top: 10px; pointer-events: none;">record data</span>
                </div>
                <hr/>
                <span class="close-btn" style="top: -2px; right: 12px;" onClick={() => setShowing(false)}>&times;</span>
                <div class="record-btn-container">
                    <button 
                        class={`record-btn ${btnClass()}`}
                        onClick={toggleRecording} 
                        title={playBtnTitle()}
                        >
                        <i class={`fa-solid ${icon()}`} />
                        
                    </button> 
                    <button 
                        class={`record-btn` + (state() !== "finished" ? " disabled" : "")}
                        onClick={() => recorder.export("co2_adsorption_data.csv")} 
                        title={"download recorded data"}
                        disabled={state() !== "finished"}
                        aria-disabled={state() !== "finished"}
                        >
                        <i class={`fa-solid fa-file-download`} />
                        
                    </button> 
                </div>
            </div>
        </Show>
    </>;

}