interface Props {
  okString: string;
  onClickCancel: () => void;
}

const OKCancelButton = ({ okString, onClickCancel }: Props) => {
  return (
    <>
      <div className="row">
        <div className="d-grid col-sm">
          <button className="btn btn-success btn-lg btn-block" type="submit">
            {okString}
          </button>
        </div>
        <div className="d-grid col-sm">
          <button
            className="btn btn-danger btn-lg btn-block"
            type="button"
            onClick={onClickCancel}
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

export default OKCancelButton;
