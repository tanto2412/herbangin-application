import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  addProductsRecord,
  deleteProductsRecord,
  fetchProductsData,
  updateProductsRecord,
} from '../dataHandling/API_products'
import { ProductsData } from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  FAST_MOVING,
  SLOW_MOVING,
  ProductsColumns,
} from '../dataHandling/Constants'

const componentTitle = 'Master Barang'

const MasterBarang = () => {
  const [productsList, setProductsList] = useState<ProductsData[]>([])
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchCategory, setSearchCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [disableStateBatasFastMoving, setdisableStateBatasFastMoving] =
    useState(false)

  const idFormComponentList = [
    'checkProductCode',
    'checkProductName',
    'checkProductPrice',
    'checkStock',
    'checkSatuanTerkecil',
    'checkBarangLaku',
    'checkBatasFastMoving',
  ]
  const labelFormComponentList = [
    'Kode Barang',
    'Nama Barang',
    'Harga',
    'Stok Barang',
    'Satuan Terkecil',
    'Barang Laku',
    'Batas Fast Moving',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = {} as ProductsData[]
        if (searchTerm != null && searchCategory != null)
          data = await fetchProductsData(searchCategory, searchTerm)
        else data = await fetchProductsData()

        setProductsList(data)
      } catch (error) {
        // Handle error if needed
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, searchTerm, searchCategory])

  const selectItemColumns = () => (
    <>
      <option key={1} value="nama_barang">
        Nama Barang
      </option>
      <option key={2} value="kode_barang">
        Kode Barang
      </option>
    </>
  )

  const tableColumns = () =>
    ProductsColumns?.map((ProductColumns, index) => {
      return <th key={index}>{ProductColumns}</th>
    })

  const tableData = () =>
    productsList?.map((ProductData, index) => {
      return (
        <tr key={index}>
          <td>{ProductData?.id}</td>
          <td>{ProductData?.kode_barang}</td>
          <td>{ProductData?.nama_barang}</td>
          <td>Rp. {Math.round(ProductData?.harga).toLocaleString()}</td>
          <td>
            {ProductData?.stok_barang} {ProductData?.satuan_terkecil}
          </td>
          <td>{ProductData?.jenis_barang == FAST_MOVING ? 'Yes' : 'No'}</td>
          <td>{ProductData?.batas_fast_moving}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(EDIT_DIMSCREEN, ProductData?.id)}
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, ProductData?.id)}
            />
          </td>
        </tr>
      )
    })

  const onClickAction = (dimScreenName: string, IDToChangeParam?: number) => {
    setToogle(dimScreenName)
    IDToChangeParam && setIDToChange(IDToChangeParam)
    dimScreenName == HIDE_DIMSCREEN && reset()

    if (dimScreenName == EDIT_DIMSCREEN || dimScreenName == DELETE_DIMSCREEN) {
      const selectedSale = productsList.find(
        (sale) => sale.id === IDToChangeParam
      ) as ProductsData
      setValue(idFormComponentList[0], selectedSale.kode_barang)
      setValue(idFormComponentList[1], selectedSale.nama_barang)
      setValue(idFormComponentList[2], selectedSale.harga)
      setValue(idFormComponentList[3], selectedSale.stok_barang)
      setValue(idFormComponentList[4], selectedSale.satuan_terkecil)
      setValue(idFormComponentList[5], selectedSale.jenis_barang)
      setValue(idFormComponentList[6], selectedSale.batas_fast_moving)
      setNameToChange(selectedSale.nama_barang)
      if (selectedSale.jenis_barang == SLOW_MOVING)
        setdisableStateBatasFastMoving(true)
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    const data_to_change: ProductsData = {
      // id and stok_barang as dummy value
      id: 0,
      kode_barang: data.checkProductCode,
      nama_barang: data.checkProductName,
      harga: data.checkProductPrice,
      stok_barang: 0,
      satuan_terkecil: data.checkSatuanTerkecil,
      jenis_barang: data.checkBarangLaku,
      batas_fast_moving: data.checkBatasFastMoving,
    }

    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        await addProductsRecord(data_to_change)
        break
      case EDIT_DIMSCREEN:
        if (IDToChange != null)
          await updateProductsRecord(IDToChange, data_to_change)
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteProductsRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '') {
      setSearchTerm(null)
      setSearchCategory(null)
    } else {
      setSearchTerm(data.checkSearch)
      setSearchCategory(data.checkSearchColumns)
    }

    setToogle(HIDE_DIMSCREEN)
    reset()
  }

  const handleOnChangeBarangLaku = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value

    if (selectedValue == SLOW_MOVING) {
      setValue(idFormComponentList[6], 0)
      setdisableStateBatasFastMoving(true)
    } else if (selectedValue == FAST_MOVING) {
      setdisableStateBatasFastMoving(false)
    }
  }

  return (
    <>
      <form id="actionForm" name="actionForm" onSubmit={handleSubmit(onSubmit)}>
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
          {(toggleDimScreen === ADD_DIMSCREEN ||
            toggleDimScreen === EDIT_DIMSCREEN) && (
            <>
              <div className="pb-2">
                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[0]}
                  labelName={labelFormComponentList[0]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[0]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkProductCode', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkProductCode && 'Kode Barang harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[1]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkProductName', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkProductName && 'Nama Barang harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <input
                    type="number"
                    id={idFormComponentList[2]}
                    className="form-control"
                    step={0.01}
                    min={0}
                    autoComplete="off"
                    {...register('checkProductPrice', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkProductPrice && 'Harga Barang harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[3]}
                  labelName={labelFormComponentList[3]}
                >
                  <input
                    type="hidden"
                    id={idFormComponentList[3]}
                    className="form-control"
                    autoComplete="off"
                    disabled
                    {...register('checkStock')}
                  />
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[4]}
                  labelName={labelFormComponentList[4]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[4]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkSatuanTerkecil', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkSatuanTerkecil &&
                      'Satuan terkecil harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[5]}
                  labelName={labelFormComponentList[5]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[5]}
                    {...register('checkBarangLaku', {
                      required: true,
                    })}
                    onChange={handleOnChangeBarangLaku}
                  >
                    <option value={SLOW_MOVING}>No</option>
                    <option value={FAST_MOVING}>Yes</option>
                  </select>
                  <br />
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[6]}
                  labelName={labelFormComponentList[6]}
                >
                  <input
                    type="number"
                    id={idFormComponentList[6]}
                    className="form-control"
                    step={0.01}
                    min={0}
                    autoComplete="off"
                    disabled={disableStateBatasFastMoving}
                    {...register('checkBatasFastMoving', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkBatasFastMoving &&
                      'Batas Fast Moving harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>
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
        </DimScreenTemplate>
      </form>
    </>
  )
}

export default MasterBarang
