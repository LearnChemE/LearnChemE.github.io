export const DualSelected = {
    FIRST: 0,
    SECOND: 1
};
export type DualSelected = (typeof DualSelected)[keyof typeof DualSelected];

export type SelectorStyle = {
    unclicked: string;
    clicked: string;
}

export type DualButtonSelectorDescriptor = {
    btnId1: string;
    btnId2: string;
    style1: SelectorStyle;
    style2: SelectorStyle;
    callback?: (selected: DualSelected) => void;
}

export class DualButtonSelector {
    private btn1: HTMLButtonElement;
    private btn2: HTMLButtonElement;
    private style1: SelectorStyle;
    private style2: SelectorStyle;
    private callback: ((s: DualSelected) => void) | undefined;

    constructor (descriptor: DualButtonSelectorDescriptor) {
        // Get elements
        this.btn1 = document.getElementById(descriptor.btnId1) as unknown as HTMLButtonElement;
        this.btn2 = document.getElementById(descriptor.btnId2) as unknown as HTMLButtonElement;
        // Get styles
        this.style1 = descriptor.style1;
        this.style2 = descriptor.style2;
        this.callback = descriptor.callback;

        // Add callbacks
        this.btn1.addEventListener("click", () => {this.button1press()});
        this.btn2.addEventListener("click", () => (this.button2press()));
    }

    private button1press = () => {
        let btn1 = this.btn1;
        let btn2 = this.btn2;
        // Update styles
        btn1.setAttribute("class", this.style1.clicked);
        btn2.setAttribute("class", this.style2.unclicked);
        // Callback
        this.callback?.(DualSelected.FIRST);
    }

    private button2press = () => {
        let btn1 = this.btn1;
        let btn2 = this.btn2;
        // Update styles
        btn1.setAttribute("class", this.style1.unclicked);
        btn2.setAttribute("class", this.style2.clicked);
        // Callback
        this.callback?.(DualSelected.SECOND);
    }
}