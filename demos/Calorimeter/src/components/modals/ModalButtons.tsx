import "./ModalButtons.css";

export const ModalButtons: React.FC = () => {
  return (
    <div className="modal-buttons-container" id="modal-buttons-container">
      <button
        type="button"
        id="directions-button"
        className="btn btn-primary"
        title="Directions"
        data-bs-toggle="modal"
        data-bs-target="#directions-modal"
      >
        Directions
      </button>
      <button
        type="button"
        id="worksheet-button"
        className="btn btn-primary"
        title="View Worksheet"
        data-bs-toggle="modal"
        data-bs-target="#worksheet-modal"
      >
        Worksheet
      </button>
      <button
        type="button"
        id="details-button"
        className="btn btn-primary"
        title="Simulation Details"
        data-bs-toggle="modal"
        data-bs-target="#details-modal"
      >
        Details
      </button>
      <button
        type="button"
        id="about-button"
        className="btn btn-primary"
        title="About this program"
        data-bs-toggle="modal"
        data-bs-target="#about-modal"
      >
        About
      </button>
    </div>
  );
};
