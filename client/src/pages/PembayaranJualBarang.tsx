import { useState } from "react";
import { useForm } from "react-hook-form";

import DimScreenTemplate from "../components/DimScreenTemplate";
import ShowDataTemplate from "../components/ShowDataTemplate";

import FloatingLabelFormComponent from "../components/FloatingLabelFormComponent";
import DeleteScreenContent from "../components/DeleteScreenContent";
import ActionButton from "../components/ActionButton";
import OKCancelButton from "../components/OKCancelButton";

import PembayaranPenjualanColumns from "../dataTable/PembayaranPenjualanColumns.json";
import PembayaranPenjualanData from "../dataTable/PembayaranPenjualanData.json";

const componentTitle = "Pembayaran Jual Barang";

const HIDE_DIMSCREEN = "NULL";
const ADD_DIMSCREEN = "Add";
const EDIT_DIMSCREEN = "Edit";
const DELETE_DIMSCREEN = "Delete";

const PembayaranJualBarang = () => {
  const selectItemColumns = () =>
    PembayaranPenjualanColumns?.map((PembayaranPenjualanColumns, index) => {
      return (
        <option key={index} value={PembayaranPenjualanColumns?.header}>
          {PembayaranPenjualanColumns?.header}
        </option>
      );
    });

  const tableColumns = () =>
    PembayaranPenjualanColumns?.map((PembayaranPenjualanColumns, index) => {
      return <th key={index}>{PembayaranPenjualanColumns?.header}</th>;
    });

  const tableData = () =>
    PembayaranPenjualanData?.map((PembayaranPenjualanData, index) => {
      return (
        <tr key={index}>
          <td>{PembayaranPenjualanData?.nomorPembayaran}</td>
          <td>{PembayaranPenjualanData?.salesName}</td>
          <td>{PembayaranPenjualanData?.customerName}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(
                  EDIT_DIMSCREEN,
                  PembayaranPenjualanData?.nomorPembayaran
                )
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(
                  DELETE_DIMSCREEN,
                  PembayaranPenjualanData?.nomorPembayaran
                )
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
    "checkSalesName",
    "checkCustomerName",
  ];
  const labelFormComponentList = [
    "Nama Sales",
    "Nama Customer",
  ];

  return (
    <>
      <ShowDataTemplate
        titleNameString="Pembayaran Jual Barang"
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
                    {...register("checkSalesName", {
                      required: true,
                    })}
                  >
                    <option value="Sales 1">Sales 1</option>
                    <option value="Sales 2">Sales 2</option>
                    <option value="Sales 3">Sales 3</option>
                  </select>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[1]}
                    {...register("checkCustomerName", {
                      required: true,
                    })}
                  >
                    <option value="Customer 1">Customer 1</option>
                    <option value="Customer 2">Customer 2</option>
                    <option value="Customer 3">Customer 3</option>
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

export default PembayaranJualBarang;
