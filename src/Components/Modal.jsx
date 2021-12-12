import '../modal.css';

const Modal = ({ handleClose, show,submitForm,nameInput,emailInput }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title">Add user</h5>
        <button type="button" className="close btn-light" data-dismiss="modal" onClick={handleClose}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="form-group">
      <label>Name</label>
      <input type="text" className="form-control" id="LabelName" onChange={e => nameInput(e)} aria-describedby="name" placeholder="Enter name" />
      </div>
      <div className="form-group">
      <label>Email address</label>
      <input type="email" className="form-control" id="LabelEmail" onChange={e => emailInput(e)} aria-describedby="email" placeholder="Enter email" />
      </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={submitForm}>Save changes</button>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
      </div>
      </div>
      </section>
    </div>
  );
};

export default Modal;