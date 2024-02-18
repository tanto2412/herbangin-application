import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import DimScreenTemplate from "../components/DimScreenTemplate";
import FloatingLabelFormComponent from "../components/FloatingLabelFormComponent";
import { useUserContext } from "../components/UserContext";
import { fetchLogin } from "../dataHandling/API_login_user";

const LoginLayout: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const { setUserName } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await fetchLogin(data.username, data.password);
      setLoginError(false);
      setUserName(data.username);
      navigate("/home");
    } catch (error) {
      setLoginError(true);
    }
  };

  const idFormComponentList = ["loginUsername", "loginPassword"];
  const labelFormComponentList = ["Username", "Password"];

  return (
    <>
      <DimScreenTemplate
        idScreenFormat="loginScreen"
        titleScreen="Sign into your account"
      >
        <form id="loginForm" name="loginForm" onSubmit={handleSubmit(onSubmit)}>
          <FloatingLabelFormComponent
            idInputComponent={idFormComponentList[0]}
            labelName={labelFormComponentList[0]}
          >
            <input
              type="text"
              id={idFormComponentList[0]}
              className="form-control form-control-lg"
              autoComplete="off"
              onKeyDown={() => setLoginError(false)}
              {...register("username", {
                required: true,
              })}
            />
            <div id="invalid-feedback">
              {errors.username && "Username harus diisi"}
              {loginError && "Username atau password salah. Login gagal"}
              <br />
            </div>
          </FloatingLabelFormComponent>

          <FloatingLabelFormComponent
            idInputComponent={idFormComponentList[1]}
            labelName={labelFormComponentList[1]}
          >
            <input
              type="password"
              id={idFormComponentList[1]}
              className="form-control form-control-lg"
              autoComplete="off"
              {...register("password", {
                required: true,
                minLength: 5,
              })}
            />
            <div id="invalid-feedback">
              {errors.password &&
                errors.password.type === "required" &&
                "Password harus diisi"}
              {errors.password &&
                errors.password.type === "minLength" &&
                "Panjang password minimal 5 karakter"}
              <br />
            </div>
          </FloatingLabelFormComponent>

          <div className="d-grid gap-2">
            <button className="btn btn-success btn-lg btn-block" type="submit">
              LOGIN
            </button>
          </div>
        </form>
      </DimScreenTemplate>
    </>
  );
};

export default LoginLayout;
