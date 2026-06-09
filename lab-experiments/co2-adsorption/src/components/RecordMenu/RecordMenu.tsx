import { createSignal, Show, type Component } from "solid-js";
import { DataRecorder } from "./record";
import { ControlButton } from "../ControlButton/ControlButton";
import "./RecordMenu.css";

type RecordMenuProps = {
  exportData: () => Record<string, any>;
};

export const RecordMenu: Component<RecordMenuProps> = (props) => {
    const [showing, setShowing] = createSignal(false);
    const recorder = new DataRecorder(props.exportData);

    const toggleRecording = () => {
        if (recorder.recording()) {
        recorder.stop();
        recorder.export("co2_adsorption_data.csv");
        }
        else {
        recorder.reset();
        recorder.record();
        }
    }

    return <>
        <ControlButton left={155} label="record data" icon="fa-solid fa-file-waveform" onClick={() => setShowing(s => !s)} active={showing}  />
        <Show when={showing()}>
            <div class="record-menu">
            <button 
                class="control-button active"
                onClick={toggleRecording} 
                title={"record data"}
                >
                <i class="fa-solid fa-play" />
                
            </button> 
            </div>
        </Show>
    </>;

}