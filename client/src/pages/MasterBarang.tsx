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
import { Pagination, ProductsData } from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  FAST_MOVING,
  SLOW_MOVING,
  ProductsColumns,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const componentTitle = 'Master Barang'

const MasterBarang = () => {
  const [productsData, setProductsData] =
    useState<Pagination<ProductsData> | null>(null)
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchCategory, setSearchCategory] = useState<string | undefined>(
    undefined,
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [disableStateBatasFastMoving, setdisableStateBatasFastMoving] =
    useState(false)
  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = [
    'checkProductCode',
    'checkProductName',
    'checkProductPrice',
    'checkStock',
    'checkBarangLaku',
    'checkBatasFastMoving',
  ]
  const labelFormComponentList = [
    'Kode Barang',
    'Nama Barang',
    'Harga',
    'Stok Barang',
    'Barang Laku',
    'Jatuh Tempo Barang Laku',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsData(
          searchCategory,
          searchTerm,
          Number(params.page),
          false,
        )
        setProductsData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [
    params,
    IDToChange,
    toggleDimScreen,
    searchTerm,
    searchCategory,
    setUserName,
  ])

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
    productsData?.result.map((ProductData, index) => {
      return (
        <tr key={index}>
          <td>{ProductData?.id}</td>
          <td>{ProductData?.kode_barang}</td>
          <td>{ProductData?.nama_barang}</td>
          <td>Rp. {Number(ProductData?.harga).toLocaleString()}</td>
          <td>{ProductData?.stok_barang} Pak</td>
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
    dimScreenName == HIDE_DIMSCREEN &&
      reset({
        checkSearch: getValues('checkSearch'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })

    if (dimScreenName == EDIT_DIMSCREEN || dimScreenName == DELETE_DIMSCREEN) {
      const selectedSale = productsData?.result.find(
        (sale) => sale.id === IDToChangeParam,
      ) as ProductsData
      setValue(idFormComponentList[0], selectedSale.kode_barang)
      setValue(idFormComponentList[1], selectedSale.nama_barang)
      setValue(idFormComponentList[2], selectedSale.harga)
      setValue(idFormComponentList[3], selectedSale.stok_barang)
      setValue(idFormComponentList[4], selectedSale.jenis_barang)
      setValue(idFormComponentList[5], selectedSale.batas_fast_moving)
      setNameToChange(selectedSale.nama_barang)
      if (selectedSale.jenis_barang == SLOW_MOVING)
        setdisableStateBatasFastMoving(true)
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
      satuan_terkecil: 'Pak',
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
      setSearchTerm(undefined)
      setSearchCategory(undefined)
      reset()
    } else {
      navigate('./1')
      reset({
        checkSearch: getValues('checkSearch'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })
      setSearchTerm(data.checkSearch)
      setSearchCategory(data.checkSearchColumns)
    }

    setToogle(HIDE_DIMSCREEN)
  }

  const handleOnChangeBarangLaku = (
    e: React.ChangeEvent<HTMLSelectElement>,
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
          pages={productsData?.pages}
          currentPage={Number(params.page) || 1}
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
                    step={1}
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
                  <select
                    className="form-select"
                    id={idFormComponentList[4]}
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
                  idInputComponent={idFormComponentList[5]}
                  labelName={labelFormComponentList[5]}
                >
                  <input
                    type="number"
                    id={idFormComponentList[5]}
                    className="form-control"
                    step={1}
                    min={0}
                    autoComplete="off"
                    disabled={disableStateBatasFastMoving}
                    {...register('checkBatasFastMoving', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkBatasFastMoving &&
                      'Batas Jatuh Tempo Barang Laku harus diisi'}
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
