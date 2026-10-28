import { createSignal, For, type Accessor, type Component } from "solid-js";
import "./ResultsList.css";

type ResultsListProps = {
    // results: Accessor<Array<GCResult>>
};

// later calcs
type GCResult = {
    t: Array<number>,
    y: Array<number>,
    progress: Accessor<number>,
};

// later props
const results = (): Array<GCResult> => [{
    t: [0, 1, 2],
    y: [0, 4, 2],
    progress: () => 3
}, {
    t: [0, 1, 2],
    y: [0, 4, 2],
    progress: () => 2
}, {
    t: [0, 1, 2],
    y: [0, 4, 2],
    progress: () => 0
}];

export const ResultsList: Component<ResultsListProps> = ({}) => {
    return (<div id="results-wrapper">
        <For each={results()}>{(res, index) => {
            const [expanded, setExpanded] = createSignal(true);
            const panelId = `result-panel-${index()}`;

            return (<div class="result-box">
                <div class="result-card-header">
                    <h2>Result {index() + 1}</h2>
                    <button
                        class="result-toggle"
                        type="button"
                        aria-label={`${expanded() ? "Collapse" : "Expand"} result ${index() + 1}`}
                        aria-expanded={expanded()}
                        aria-controls={panelId}
                        onClick={() => setExpanded(!expanded())}
                    >
                        <span class="result-toggle-icon" aria-hidden="true" />
                    </button>
                </div>
                <div id={panelId} class="result-content" hidden={!expanded()}>
                    <div
                        class="result-chart"
                        role="img"
                        aria-label={`Placeholder chromatogram with ${res.t.length} samples`}
                    >
                        <svg viewBox="0 0 320 150" aria-hidden="true">
                            <path class="result-chart-axis" d="M32 12V124H308" />
                            <path class="result-chart-line" d="M33 112C72 112 77 103 104 104S136 109 155 94 174 35 193 38 209 108 231 102 262 82 307 82" />
                        </svg>
                    </div>
                    <p class="result-description">
                        A brief summary of this result will appear here.
                    </p>
                </div>
            </div>);
        }}</For>
    </div>);
}