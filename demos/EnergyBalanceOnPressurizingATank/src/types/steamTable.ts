type Row = Record<string, number>;

export class SteamTable {
    private data: Row[] = [];
    private headers: string[] = [];

    /**
     * Create a SteamTable object using csv contents
     */
    constructor(csvContents: string) {
        this.parseCSV(csvContents);
    }

    /**
     * Create a new SteamTable object asynchronously using a file URL
     * @param fileURL URL for steam table csv file
     * @returns new SteamTable object using the csv URL for data initialisation
     */
    static async create(fileURL: string): Promise<SteamTable> {
        const response = await fetch(fileURL);
        const csv = await response.text();
        return new SteamTable(csv);
    }

    /**
     * Parse the contents of the csv used to initialize the data tables
     * @param csv string containing pipe delimited steam tables
     */
    private parseCSV = (csv: string) => {
        // Break the csv into lines
        var lines = csv.trim().split('\n');

        // Store the headers
        this.headers = lines[0].split('|').map((val:string) => val.trim());
        // Remove the headers line
        lines = lines.slice(1);

        // Parse the data line by line
        this.data = lines.map((line:string) => {
            // Parse the values from the line
            const vals: number[] = line.split('|').map((strVal:string) => {
                return parseFloat(strVal.trim());
            });
            // Initialize the row
            const row: Row = {};

            // Attach the values to corresponding headers
            this.headers.forEach((header: string, i: number) => {
                row[header] = vals[i];
            });
            // Return the appropriate row of data
            return row;
        });
    }

    /**
     * Get the header values from the steam table
     * @returns Steam table headers as a string array
     */
    getHeaders = () => {
        return this.headers;
    }

    /**
     * Linearly interpolate for the specified parameter at a given pressure
     * @param pressure Pressure in bar to search for parameter at
     * @param targetCol Parameter name to search for
     */
    interpolate = (pressure: number, targetCol: string): number | null => {
        const xCol = 'P(bar)';
        const data = this.data;
        let x = pressure;

        // Loop through to search for the correct values
        for (let i=0;i<data.length - 1;i++) {
            const x0 = data[i][xCol];
            const x1 = data[i+1][xCol];
            const y0 = data[i][targetCol];
            const y1 = data[i+1][targetCol];

            if (x >= x0 && x <= x1) {
                // Lever rule
                const t = (x - x0) / (x1 - x0);
                // return interpolated values
                return y0 + t * (y1 - y0);
            }
        }

        // If control reaches this point, the data is out of range
        console.warn(`Value ${pressure} out of range for table ${targetCol}`);
        return null;
    }
}