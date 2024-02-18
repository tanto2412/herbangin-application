interface Props {
  okString: string
  okButtonType?: 'submit' | 'button'
  onClickOK?: () => void
  cancelString?: string
  onClickCancel: () => void
  buttonSize?: string
  gutterSize?: string
}

const OKCancelButton = ({
  okString,
  okButtonType = 'submit',
  onClickOK,
  cancelString = 'CANCEL',
  onClickCancel,
  buttonSize = 'btn-lg',
  gutterSize,
}: Props) => {
  return (
    <>
      <div className={'row ' + gutterSize}>
        <div className="d-grid col-sm">
          {okButtonType === 'submit' && (
            <button
              className={'btn btn-success btn-block ' + buttonSize}
              type={okButtonType}
            >
              {okString}
            </button>
          )}
          {okButtonType === 'button' && (
            <button
              className={'btn btn-success btn-block ' + buttonSize}
              type={okButtonType}
              onClick={onClickOK}
            >
              {okString}
            </button>
          )}
        </div>
        <div className="d-grid col-sm">
          <button
            className={'btn btn-danger btn-block ' + buttonSize}
            type="button"
            onClick={onClickCancel}
          >
            {cancelString}
          </button>
        </div>
      </div>
    </>
  )
}

export default OKCancelButton
