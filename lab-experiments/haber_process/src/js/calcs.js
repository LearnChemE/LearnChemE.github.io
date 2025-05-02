export function setDefaults() {
  state = {
    ...state,
    T: 773,
    purging: false,
    purgingTime: 0,
    takingSample: false,
    takingSampleTime: 0,
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
      he: {
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#ffffff",
        label: "He"
      }
    },
    outlet: {
      yH2: 0.5,
      yN2: 0.3,
      yNH3: 0.2,
    }
  }
}

export function calcAll() {
  console.log("calcing..")
}