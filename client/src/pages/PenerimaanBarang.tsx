import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DimScreenTemplate from "../components/DimScreenTemplate";
import ShowDataTemplate from "../components/ShowDataTemplate";

import FloatingLabelFormComponent from "../components/FloatingLabelFormComponent";
import DeleteScreenContent from "../components/DeleteScreenContent";
import ActionButton from "../components/ActionButton";
import OKCancelButton from "../components/OKCancelButton";

import {
  addReceivingRecord,
  deleteReceivingRecord,
  fetchReceivingData,
  updateReceivingRecord,
} from "../dataHandling/API_receiving";
import {
  PenerimaanData,
  PenerimaanDataDetails,
} from "../dataHandling/interfaces";
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  ReceivingColumns,
  ReceivingItemsColumns,
  epochmillisToDate,
} from "../dataHandling/Constants";

const componentTitle = "Penerimaan Barang";

const PenerimaanBarang = () => {
  const [receivingList, setReceivingList] = useState<PenerimaanData[]>([]);
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN);
  const [IDToChange, setIDToChange] = useState<number | null>(null);
  const [nameToChange, setNameToChange] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const idFormComponentList = ["checkTglFaktur"];
  const labelFormComponentList = ["Tanggal Faktur"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReceivingData(searchTerm);
        setReceivingList(data);
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchData();
  }, [IDToChange, toggleDimScreen, searchTerm]);

  const selectItemColumns = () => (
    <>
      <option key={1} value="id">
        Nomor Faktur
      </option>
    </>
  );

  const tableColumns = () =>
    ReceivingColumns?.map((ReceivingColumns, index) => {
      return <th key={index}>{ReceivingColumns}</th>;
    });

  const tableItemsColumns = () =>
    ReceivingItemsColumns?.map((ReceivingItemsColumns, index) => {
      return <th key={index}>{ReceivingItemsColumns}</th>;
    });

  const tableData = () =>
    receivingList?.map((PenerimaanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{PenerimaanBarangData?.id}</td>
          <td>{epochmillisToDate(PenerimaanBarangData?.tanggal)}</td>
          <td>
            Rp. {Math.round(PenerimaanBarangData?.total).toLocaleString()}
          </td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, PenerimaanBarangData?.id)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(DELETE_DIMSCREEN, PenerimaanBarangData?.id)
              }
            />
          </td>
        </tr>
      );
    });

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    
    setToogle(dimScreenName);
    IDToChangeParam && setIDToChange(IDToChangeParam);
    dimScreenName == HIDE_DIMSCREEN && reset();

    if (dimScreenName == EDIT_DIMSCREEN || dimScreenName == DELETE_DIMSCREEN) {
      const selectedSale = receivingList.find(
        (sale) => sale.id === IDToChangeParam
      ) as PenerimaanData;
      setValue(idFormComponentList[0], selectedSale.tanggal); //need epoch conversion
      setNameToChange(selectedSale.tanggal.toString());
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
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
        widthScreen="8"
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
                  <input
                    type="date"
                    id={idFormComponentList[0]}
                    className="form-control"
                    autoComplete="off"
                    {...register("checkTglFaktur", {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglFaktur && "Tanggal Faktur harus diisi"}
                    <br />
                  </div>
                </FloatingLabelFormComponent>
                <div className="row pb-2">
                  <div className="col-12">
                    <table className="table table-hover table-striped table-bordered">
                      <thead>
                        <tr className="text-center">
                          {tableItemsColumns()}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {/* {tableItemsDataObject} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          {toggleDimScreen === DELETE_DIMSCREEN && (
            <DeleteScreenContent itemID={IDToChange} itemName={nameToChange} />
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

export default PenerimaanBarang;
