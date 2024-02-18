import { useState } from "react";
import { useForm } from "react-hook-form";

import DimScreenTemplate from "../components/DimScreenTemplate";
import ShowDataTemplate from "../components/ShowDataTemplate";

import FloatingLabelFormComponent from "../components/FloatingLabelFormComponent";
import DeleteScreenContent from "../components/DeleteScreenContent";
import ActionButton from "../components/ActionButton";
import OKCancelButton from "../components/OKCancelButton";

import ReturPenjualanColumns from "../dataTable/ReturPenjualanColumns.json";
import ReturPenjualanData from "../dataTable/ReturPenjualanData.json";

const componentTitle = "Retur Penjualan Barang";

const HIDE_DIMSCREEN = "NULL";
const ADD_DIMSCREEN = "Add";
const EDIT_DIMSCREEN = "Edit";
const DELETE_DIMSCREEN = "Delete";
const selectItemColumns = () =>
  ReturPenjualanColumns?.map((ReturPenjualanColumns, index) => {
    return (
      <option key={index} value={ReturPenjualanColumns?.header}>
        {ReturPenjualanColumns?.header}
      </option>
    );
  });

const ReturPenjualanBarang = () => {
  const tableColumns = () =>
    ReturPenjualanColumns?.map((ReturPenjualanColumns, index) => {
      return <th key={index}>{ReturPenjualanColumns?.header}</th>;
    });

  const tableData = () =>
    ReturPenjualanData?.map((ReturPenjualanData, index) => {
      return (
        <tr key={index}>
          <td>{ReturPenjualanData?.nomorFaktur}</td>
          <td>{ReturPenjualanData?.nomorRetur}</td>
          <td>{ReturPenjualanData?.tglRetur}</td>
          <td>{ReturPenjualanData?.customerName}</td>
          <td>{ReturPenjualanData?.salesName}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, ReturPenjualanData?.nomorRetur)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(DELETE_DIMSCREEN, ReturPenjualanData?.nomorRetur)
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
    "checkNoFaktur",
    "checkTglRetur",
    "checkCustomerName",
    "checkSalesName",
  ];
  const labelFormComponentList = [
    "Nomor Faktur",
    "Tanggal Retur",
    "Customer Name",
    "Sales Name",
  ];

  return (
    <>
      <ShowDataTemplate
        titleNameString={componentTitle}
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
                    {...register("checkNoFaktur", {
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
                  <input
                    type="date"
                    id={idFormComponentList[1]}
                    className="form-control"
                    autoComplete="off"
                    {...register("checkTglRetur", {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglRetur && "Tanggal Retur harus diisi"}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[2]}
                    {...register("checkCustomerName", {
                      required: true,
                    })}
                  >
                    <option value="Customer 1">Customer 1</option>
                    <option value="Customer 2">Customer 2</option>
                    <option value="Customer 3">Customer 3</option>
                  </select>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[3]}
                  labelName={labelFormComponentList[3]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[3]}
                    {...register("checkSalesName", {
                      required: true,
                    })}
                  >
                    <option value="Sales 1">Sales 1</option>
                    <option value="Sales 2">Sales 2</option>
                    <option value="Sales 3">Sales 3</option>
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

export default ReturPenjualanBarang;
