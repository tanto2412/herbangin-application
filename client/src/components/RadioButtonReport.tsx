interface Props {
  radioID: string;
  radioLabel: string;
}

const RadioButtonReport = ({ radioID, radioLabel }: Props) => {
  return (
    <>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="laporanRadio"
          id={radioID}
          value={radioLabel}
        />
        <label className="form-check-label" htmlFor={radioID}>
          {radioLabel}
        </label>
      </div>
    </>
  );
};

export default RadioButtonReport;
