export function setDefaults() {
  state = {
    ...state,
    T: 773,
    minT: 298,
    maxT: 1023,
    tanks: {
      maxP: 15,
      h2: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 5,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#ff0000",
        label1: "H",
        label2: "2",
      },
      n2: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 5,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#0000ff",
        label1: "N",
        label2: "2",
      },
      nh3: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 5,
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