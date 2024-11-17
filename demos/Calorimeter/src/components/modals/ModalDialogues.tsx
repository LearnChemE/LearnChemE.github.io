interface ModalDialogueProps {
  title: string;
  innerHTML: JSX.Element;
}

const ModalDialogue: React.FC<ModalDialogueProps> = ({ title, innerHTML }) => {
  let key = title.toLowerCase();
  let labelId: string = key + "ModalLabel";
  console.log(key);

  return (
    <>
      <div
        className="modal fade"
        id={`${key}-modal`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={labelId}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-l" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={labelId}>
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{innerHTML}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ModalDialogues: React.FC = () => {
  return (
    <>
      <ModalDialogue
        title="Directions"
        innerHTML={
          <p>
            This digital lab, which represents a static calorimeter with
            adiabatic walls, is designed to be used with{" "}
            <a href="">this worksheet</a>. Use the sliders to set the initial
            conditions of the experiment, then press the "drop metal" button and
            watch the system equilibriate. To record the temperature of the
            water, hover your mouse over the thermometer.
          </p>
        }
      />
      <ModalDialogue
        title="Details"
        innerHTML={
          <p>
            This simulation uses an energy balance to calculate the final
            temperature of the closed system. It then uses a hypothetical UA
            value to calculate the time constant of the transient temperature
            function and plays an animation to show the quenching of the block.
            {/* TODO: More on equations */}
          </p>
        }
      />
      <ModalDialogue
        title="About"
        innerHTML={
          <p>
            This digital experiment was created in the{" "}
            <a href="https://www.colorado.edu/chbe">
              Department of Chemical and Biological Engineering
            </a>
            , at University of Colorado Boulder for{" "}
            <a href="http://www.learncheme.com">LearnChemE.com</a> by Drew Smith
            under the direction of Professor John L. Falconer and Michelle
            Medlin. It was prepared with financial support from the National
            Science Foundation (DUE 2336987 and 2336988) and is based on a
            Static Calorimeter experimental kit and accompanying worksheet
            protocol developed with separate support under NSF 1821578 led by
            Washington State University. Address any questions or comments to
            LearnChemE@gmail.com. Our simulations are open source at{" "}
            <a href="https://github.com/LearnChemE/LearnChemE.github.io/">
              LearnChemE GitHub repository
            </a>
            . If this simulation is too big or too small for your screen, zoom
            out or in using command - or command + on Mac or ctrl - or ctrl + on
            Windows.
          </p>
        }
      />
    </>
  );
};
