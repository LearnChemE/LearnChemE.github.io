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
      <a href="Calorimeter worksheet.pdf" download>
        <button
          type="button"
          id="worksheet-button"
          className="btn btn-primary"
          title="Download Worksheet"
        >
          Worksheet
        </button>
      </a>
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
