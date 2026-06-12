import { createSignal, type Accessor, type Setter } from "solid-js";

export class DataRecorder {
    private data: Array<Object> = [];
    private dataAccessor: () => Object;
    private interval = 1000; // Record every 1 second
    public recording: Accessor<boolean>;
    public exportReady: Accessor<boolean>;
    private setRecording: Setter<boolean>;
    private setExportReady: Setter<boolean>;

    constructor(dataAccessor: () => Object, interval?: number) {
        this.dataAccessor = dataAccessor;
        if (interval !== undefined) {
            this.interval = interval;
        }
        [this.recording, this.setRecording] = createSignal(false);
        [this.exportReady, this.setExportReady] = createSignal(false);
    }

    record() {
        if (this.recording()) return;
        this.setRecording(true);
        this.setExportReady(true);
        let startTime: number | null = null;
        
        const recordLoop = () => {
            if (!this.recording()) return;
            if (startTime === null) startTime = Date.now();

            const elapsed = (Date.now() - startTime) / 1000;
            const dataPoint = this.dataAccessor();
            this.data.push({ "simulation time (min)": elapsed.toFixed(1), ...dataPoint });
            console.table(this.data.at(-1));
            setTimeout(recordLoop, this.interval);
        }

        setTimeout(recordLoop, 100);
    }

    stop() {
        this.setRecording(false);
    }

    reset() {
        this.setRecording(false);
        this.data = [];
        this.setExportReady(false);
    }

    export(filename: string) {
        // Remove '.csv'
        if (filename.endsWith('.csv')) {
            filename = filename.slice(0, -4);
        }
        // Append timestamp and .csv extension
        const timestamp = new Date().toLocaleTimeString().replace(/:/g, '_');
        filename = `${filename}_${timestamp}.csv`;
        const csvHeader = Object.keys(this.data[0]).join(',') + '\n';
        const csvRows = this.data.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = csvHeader + csvRows;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }
}