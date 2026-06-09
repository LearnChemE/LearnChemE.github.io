import { createSignal, type Accessor, type Setter } from "solid-js";

function getTime() {
    const now = new Date();
    return now.toISOString();
}

export class DataRecorder {
    private data: Array<Object> = [];
    private dataAccessor: () => Object;
    private interval = 1000; // Record every 1 second
    public recording: Accessor<boolean>;
    private setRecording: Setter<boolean>;

    constructor(dataAccessor: () => Object, interval?: number) {
        this.dataAccessor = dataAccessor;
        if (interval !== undefined) {
            this.interval = interval;
        }
        [this.recording, this.setRecording] = createSignal(false);
    }

    record() {
        if (this.recording()) return;
        this.setRecording(true);
        
        const recordLoop = () => {
            if (!this.recording()) return;
            const timestamp = getTime();
            const dataPoint = this.dataAccessor();
            this.data.push({ timestamp, ...dataPoint });
            setTimeout(recordLoop, this.interval);
        }

        setTimeout(recordLoop, this.interval);
    }

    stop() {
        this.setRecording(false);
    }

    reset() {
        this.setRecording(false);
        this.data = [];
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