import { ReactNode } from "react";

interface Props {
  idScreenFormat: string;
  titleScreen: string;
  widthScreen?: string;
  toggleClassName?: string;
  onClickClose?: () => void;
  children: ReactNode;
}

const DimScreenTemplate = ({
  idScreenFormat,
  titleScreen,
  widthScreen = "5",
  toggleClassName,
  onClickClose,
  children,
}: Props) => {
  const titleAlignment =
    idScreenFormat === "loginScreen" ? "text-center" : "text-start";
  const closeButtonVisibility =
    idScreenFormat === "loginScreen" ? "invisible" : "";

  return (
    <>
      <div id={idScreenFormat} className={toggleClassName}>
        <div className="container py-4 h-100 vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className={"col-12 col-md-8 col-lg-6 col-xl-" + widthScreen}>
              <div className="card shadow-2-strong">
                <div className="card-body p-5 text-center">
                  <div className="row justify-content-between">
                    <div className={"col-11 " + titleAlignment}>
                      <h4 className="mb-4">{titleScreen}</h4>
                    </div>
                    <div className={"col-1 text-end " + closeButtonVisibility}>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={onClickClose}
                      ></button>
                    </div>
                  </div>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DimScreenTemplate;
