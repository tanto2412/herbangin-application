interface Props {
  buttonCaption: string
  buttonSize: number
  showCaption: boolean
  hideBorder?: boolean
  buttonType?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
  onClick?: () => void
}

const ActionButton = ({
  buttonCaption,
  buttonSize,
  showCaption,
  buttonType = 'button',
  hideBorder = true,
  disabled = false,
  onClick,
}: Props) => {
  return (
    <>
      <button
        type={buttonType}
        className={
          'btn btn-sm btn-outline-secondary ' + (hideBorder && 'border-0')
        }
        onClick={onClick}
        disabled={disabled}
      >
        <div className="d-flex align-items-center">
          <img
            src={'/' + buttonCaption + '.svg'}
            alt={buttonCaption}
            width={buttonSize}
            height={buttonSize}
          />
          {showCaption && <div className="ms-1">{buttonCaption}</div>}
        </div>
      </button>
    </>
  )
}

export default ActionButton
