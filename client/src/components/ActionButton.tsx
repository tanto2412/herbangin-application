interface Props {
  buttonCaption: string;
  buttonSize: number;
  showCaption: boolean;
  hideBorder?: boolean;
  buttonType?: "button" | "submit" | "reset" | undefined ;
  onClick?: () => void;
}

const ActionButton = ({
  buttonCaption,
  buttonSize,
  showCaption,
  buttonType ="button",
  hideBorder = true,
  onClick,
}: Props) => {
  return (
    <>
      <button
        type={buttonType}
        className={
          "btn btn-sm btn-outline-secondary " + (hideBorder && "border-0")
        }
        onClick={onClick}
      >
        <img
          src={"/" + buttonCaption + ".svg"}
          alt={buttonCaption}
          width={buttonSize}
          height={buttonSize}
        />{" "}
        {showCaption && buttonCaption}
      </button>
    </>
  );
};

export default ActionButton;
