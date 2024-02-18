import { useState } from "react";
import { useForm } from "react-hook-form";

import DimScreenTemplate from "../components/DimScreenTemplate";
import ShowDataTemplate from "../components/ShowDataTemplate";

import FloatingLabelFormComponent from "../components/FloatingLabelFormComponent";
import DeleteScreenContent from "../components/DeleteScreenContent";
import ActionButton from "../components/ActionButton";
import OKCancelButton from "../components/OKCancelButton";

import GiroPenjualanColumns from "../dataTable/GiroPenjualanColumns.json";
import GiroPenjualanData from "../dataTable/GiroPenjualanData.json";

const componentTitle = "Giro Penjualan";

const HIDE_DIMSCREEN = "NULL";
const ADD_DIMSCREEN = "Add";
const EDIT_DIMSCREEN = "Edit";
const DELETE_DIMSCREEN = "Delete";

const GiroPenjualan = () => {
  const selectItemColumns = () =>
    GiroPenjualanColumns?.map((PenjualanBarangColumns, index) => {
      return (
        <option key={index} value={PenjualanBarangColumns?.header}>
          {PenjualanBarangColumns?.header}
        </option>
      );
    });

  const tableColumns = () =>
    GiroPenjualanColumns?.map((PenjualanBarangColumns, index) => {
      return <th key={index}>{PenjualanBarangColumns?.header}</th>;
    });

  const tableData = () =>
    GiroPenjualanData?.map((PenjualanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{PenjualanBarangData?.nomorGiro}</td>
          <td>{PenjualanBarangData?.nomorPembayaran}</td>
          <td>{PenjualanBarangData?.nomorPenjualan}</td>
          <td>{PenjualanBarangData?.namaBank}</td>
          <td>{PenjualanBarangData?.tglJatuhTempo}</td>
          <td>{PenjualanBarangData?.tglPencairan}</td>
          <td>{PenjualanBarangData?.statusPembayaran}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, PenjualanBarangData?.nomorGiro)
              }
            />
          </td>
        </tr>
      );
    });

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN);
  const [IDToChange, setIDToChange] = useState<number | null>(null);

  const onClickAction = (dimScreenName: string, IDToChange?: any) => {
    setToogle(dimScreenName);
    setIDToChange(IDToChange);
    dimScreenName == HIDE_DIMSCREEN && reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        break;
      case EDIT_DIMSCREEN:
        break;
      case DELETE_DIMSCREEN:
        break;
    }
    setToogle(HIDE_DIMSCREEN);
    reset();
  };

  const idFormComponentList = [
    "checkNoPembayaran",
    "checkNoPenjualan",
    "checkNamaBank",
    "checkTglJatuhTempo",
    "checkTglPencairan",
    "checkStatusBayar",
  ];
  const labelFormComponentList = [
    "Nomor Pembayaran",
    "Nomor Penjualan",
    "Nama Bank",
    "Tanggal Jatuh Tempo",
    "Tanggal Pencairan",
    "Status Pembayaran",
  ];

  return (
    <>
      <ShowDataTemplate
        titleNameString="Giro Penjualan"
        selectItemObject={selectItemColumns()}
        tableColumnsObject={tableColumns()}
        tableDataObject={tableData()}
        onClickAdd={() => onClickAction(ADD_DIMSCREEN)}
        register={register}
      />
      <DimScreenTemplate
        idScreenFormat="dimScreen"
        titleScreen={toggleDimScreen + " " + componentTitle}
        onClickClose={() => onClickAction(HIDE_DIMSCREEN)}
        toggleClassName={
          toggleDimScreen === HIDE_DIMSCREEN ? "invisible" : "visible"
        }
      >
        <form
          id="actionForm"
          name="actionForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          {(toggleDimScreen === ADD_DIMSCREEN ||
            toggleDimScreen === EDIT_DIMSCREEN) && (
            <>
              <div className="pb-2">
                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[0]}
                  labelName={labelFormComponentList[0]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[0]}
                    {...register("checkNoPembayaran", {
                      required: true,
                    })}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[1]}
                    {...register("checkNoPenjualan", {
                      required: true,
                    })}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[2]}
                    className="form-control"
                    autoComplete="off"
                    {...register("checkNamaBank", {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkNamaBank && "Nama Bank harus diisi"}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[3]}
                  labelName={labelFormComponentList[3]}
                >
                  <input
                    type="date"
                    id={idFormComponentList[3]}
                    className="form-control"
                    autoComplete="off"
                    {...register("checkTglJatuhTempo", {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglJatuhTempo && "Tanggal Jatuh Tempo harus diisi"}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[4]}
                  labelName={labelFormComponentList[4]}
                >
                  <input
                    type="date"
                    id={idFormComponentList[4]}
                    className="form-control"
                    autoComplete="off"
                    {...register("checkTgcheckTglPencairanlJatuhTempo", )}
                  />
                </FloatingLabelFormComponent>

                
                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[5]}
                  labelName={labelFormComponentList[5]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[5]}
                    {...register("checkStatusBayar", {
                      required: true,
                    })}
                  >
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </FloatingLabelFormComponent>
              </div>
            </>
          )}
          {toggleDimScreen === DELETE_DIMSCREEN && (
            <DeleteScreenContent
              itemTable={componentTitle}
              itemID={IDToChange}
            />
          )}
          {toggleDimScreen != HIDE_DIMSCREEN && (
            <OKCancelButton
              okString={toggleDimScreen.toUpperCase()}
              onClickCancel={() => onClickAction(HIDE_DIMSCREEN)}
            />
          )}
        </form>
      </DimScreenTemplate>
    </>
  );
};

export default GiroPenjualan;
