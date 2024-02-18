import { ReactNode } from "react";

interface Props {
  idInputComponent: string;
  labelName: string;
  children: ReactNode;
}

const FloatingLabelFormComponent = ({
  idInputComponent,
  labelName,
  children,
}: Props) => {
  return (
    <>
      <div className="form-outline mb-4 form-floating">
        {children}
        <label className="form-label" htmlFor={idInputComponent}>
          {labelName}
        </label>
      </div>
    </>
  );
};

export default FloatingLabelFormComponent;
