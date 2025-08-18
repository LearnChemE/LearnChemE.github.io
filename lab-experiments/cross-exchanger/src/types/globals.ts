export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}

export class GlobalState {
    private pumpIsOn: boolean = false;
    private fanIsOn: boolean = false;
    private lift: number = 0;
    
    /**
     * Getters 
     */
    public getPumpStatus = () => { return this.pumpIsOn }
    public getFanStatus = () => { return this.fanIsOn }
    public getLift = () => { return this.lift }

    /**
     * Setters
     */
    public setPumpStatus = (isOn: boolean) => { this.pumpIsOn = isOn }
    public setFanStatus = (isOn: boolean) => { this.fanIsOn = isOn }
    public setLiftStatus = (lift: number) => { this.lift = lift }
}

