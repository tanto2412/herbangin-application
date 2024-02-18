import { useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import PenjualanBarangColumns from '../dataTable/PenjualanBarangColumns.json'
import PenjualanBarangData from '../dataTable/PenjualanBarangData.json'

const componentTitle = 'Penjualan Barang'

const HIDE_DIMSCREEN = 'NULL'
const ADD_DIMSCREEN = 'Add'
const EDIT_DIMSCREEN = 'Edit'
const DELETE_DIMSCREEN = 'Delete'

const PenjualanBarang = () => {
  const selectItemColumns = () =>
    PenjualanBarangColumns?.map((PenjualanBarangColumns, index) => {
      return (
        <option key={index} value={PenjualanBarangColumns?.header}>
          {PenjualanBarangColumns?.header}
        </option>
      )
    })

  const tableColumns = () =>
    PenjualanBarangColumns?.map((PenjualanBarangColumns, index) => {
      return <th key={index}>{PenjualanBarangColumns?.header}</th>
    })

  const tableData = () =>
    PenjualanBarangData?.map((PenjualanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{PenjualanBarangData?.nomorFaktur}</td>
          <td>{PenjualanBarangData?.tglFaktur}</td>
          <td>{PenjualanBarangData?.piutangBelumLunas}</td>
          <td>{PenjualanBarangData?.customerName}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, PenjualanBarangData?.nomorFaktur)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(
                  DELETE_DIMSCREEN,
                  PenjualanBarangData?.nomorFaktur
                )
              }
            />
          </td>
        </tr>
      )
    })

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)

  const onClickAction = (dimScreenName: string, IDToChange?: any) => {
    setToogle(dimScreenName)
    setIDToChange(IDToChange)
    dimScreenName == HIDE_DIMSCREEN && reset()
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        break
      case EDIT_DIMSCREEN:
        break
      case DELETE_DIMSCREEN:
        break
    }
    setToogle(HIDE_DIMSCREEN)
    reset()
  }

  const idFormComponentList = [
    'checkTglFaktur',
    'checkPiutangBelumLunas',
    'checkCustomerName',
  ]
  const labelFormComponentList = [
    'Tanggal Faktur',
    'Piutang Belum Lunas',
    'Nama Customer',
  ]

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
        titleScreen={toggleDimScreen + ' ' + componentTitle}
        onClickClose={() => onClickAction(HIDE_DIMSCREEN)}
        toggleClassName={
          toggleDimScreen === HIDE_DIMSCREEN ? 'invisible' : 'visible'
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
                    {...register('checkTglFaktur', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglFaktur && 'Tanggal Faktur harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <input
                    type="number"
                    id={idFormComponentList[1]}
                    step={0.01}
                    min={0}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkPiutangBelumLunas', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkPiutangBelumLunas &&
                      'Piutang Belum Lunas harus diisi'}
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
                    {...register('checkCustomerName', {
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
            <DeleteScreenContent itemID={IDToChange} itemName={''} />
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
  )
}

export default PenjualanBarang
