export function setDefaults() {
  state = {
    ...state,
    tanks: {
      maxP: 15,
      h2: {
        m: 0,
        P: 10,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#ff0000",
        label1: "H",
        label2: "2",
      },
      n2: {
        m: 0,
        P: 10,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#0000ff",
        label1: "N",
        label2: "2",
      },
      nh3: {
        m: 0,
        P: 10,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#00ff00",
        label1: "NH",
        label2: "3",
      },
    }
  }
}

export function calcAll() {

}