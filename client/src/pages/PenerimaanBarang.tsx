import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  addReceivingRecord,
  deleteReceivingRecord,
  fetchReceivingData,
  fetchReceivingDataDetails,
  updateReceivingRecord,
} from '../dataHandling/API_receiving'
import {
  Pagination,
  ProductsData,
  ReceivingData,
  ReceivingDataDetails,
} from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  ReceivingColumns,
  ReceivingItemsColumns,
} from '../dataHandling/Constants'
import {
  dateToEpochmillis,
  epochmillisToDate,
  epochmillisToInputDate,
} from '../utils/DateFunction'
import { fetchProductsData } from '../dataHandling/API_products'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const componentTitle = 'Penerimaan Barang'

const PenerimaanBarang = () => {
  const [receivingData, setReceivingData] =
    useState<Pagination<ReceivingData> | null>(null)
  const [selectedReceiving, setSelectedReceiving] = useState<
    ReceivingDataDetails[]
  >([])
  const [productList, setProductList] = useState<ProductsData[]>([])

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [showAddItemRow, setShowAddItemRow] = useState(false)
  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = ['checkTglPenerimaan']
  const labelFormComponentList = ['Tanggal Penerimaan']

  const idFormComponentListItem = [
    'checkProductID',
    'checkJumlahBarang',
    'checkHargaSatuan',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReceivingData(searchTerm, undefined, false)
        setReceivingData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, searchTerm, setUserName])

  useEffect(() => {
    const fetchDataItems = async () => {
      try {
        let data = {} as ReceivingDataDetails[]
        if (IDToChange != null) {
          data = await fetchReceivingDataDetails(IDToChange)
          setSelectedReceiving(data)
        } else setSelectedReceiving([])
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchDataItems()
  }, [IDToChange, toggleDimScreen, setUserName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsData()
        setProductList(data.result)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [setUserName])

  const selectItemColumns = () => (
    <>
      <option key={1} value="id">
        Nomor Penerimaan
      </option>
    </>
  )

  const productListOptions = () =>
    productList.map((ProductData) => {
      return (
        <option key={ProductData.id} value={ProductData.id}>
          {ProductData.nama_barang}
        </option>
      )
    })

  const addItemRow = () => (
    <>
      <tr key={999}>
        <td>
          <select
            className="form-select form-select-sm"
            id={idFormComponentList[0]}
            {...register(idFormComponentListItem[0], {
              required: true,
            })}
          >
            {productListOptions()}
          </select>
        </td>
        <td>
          <input
            type="text"
            id={idFormComponentListItem[1]}
            className="form-control form-control-sm"
            autoComplete="off"
            {...register(idFormComponentListItem[1], {
              required: true,
            })}
          />
        </td>
        <td>
          <input
            type="text"
            id={idFormComponentListItem[2]}
            className="form-control form-control-sm"
            autoComplete="off"
            {...register(idFormComponentListItem[2], {
              required: true,
            })}
          />
        </td>
        <td> </td>
        <td className="text-center" width={100}>
          <OKCancelButton
            okString={'OK'}
            okButtonType={'button'}
            onClickOK={() => onClickItemOK()}
            cancelString={'X'}
            onClickCancel={() => onClickItemAction(HIDE_DIMSCREEN)}
            buttonSize="btn-sm"
            gutterSize="g-1"
          />
        </td>
      </tr>
    </>
  )

  const tableColumns = () =>
    ReceivingColumns?.map((ReceivingColumns, index) => {
      return <th key={index}>{ReceivingColumns}</th>
    })

  const tableItemsColumns = () =>
    ReceivingItemsColumns?.map((ReceivingItemsColumns, index) => {
      return <th key={index}>{ReceivingItemsColumns}</th>
    })

  const tableData = () =>
    receivingData?.result.map((PenerimaanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{PenerimaanBarangData?.id}</td>
          <td>{epochmillisToDate(PenerimaanBarangData?.tanggal)}</td>
          <td>Rp. {Number(PenerimaanBarangData?.total).toLocaleString()}</td>
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
      )
    })

  const tableDataItems = () =>
    selectedReceiving?.map((receivingItemDetails, index) => {
      return (
        <tr key={index}>
          <td>{receivingItemDetails.nama_barang}</td>
          <td>
            {receivingItemDetails.jumlah_barang}{' '}
            {receivingItemDetails.satuan_terkecil}
          </td>
          <td>
            Rp. {Number(receivingItemDetails?.harga_satuan).toLocaleString()}
          </td>
          <td>Rp. {Number(receivingItemDetails?.subtotal).toLocaleString()}</td>
          <td className="text-center" width={90}>
            {/* <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
            /> */}
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickItemAction(DELETE_DIMSCREEN, index)}
            />
          </td>
        </tr>
      )
    })

  const getTotalFromItems = () => {
    let tempTotal = 0
    selectedReceiving?.map((receivingItemDetails) => {
      tempTotal += Number(receivingItemDetails.subtotal)
    })
    return tempTotal
  }

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    switch (dimScreenName) {
      case ADD_DIMSCREEN:
        setIDToChange(null)
        break
      case EDIT_DIMSCREEN:
      case DELETE_DIMSCREEN:
        setIDToChange(IDToChangeParam)
        const selectedReceivingID = receivingData?.result.find(
          (receiving) => receiving.id === IDToChangeParam
        ) as ReceivingData
        const dateToChange = epochmillisToInputDate(selectedReceivingID.tanggal)
        setValue(idFormComponentList[0], dateToChange)
        setNameToChange(dateToChange)
        break
      case HIDE_DIMSCREEN:
        setShowAddItemRow(false)
        reset({
          checkSearch: getValues('checkSearch'),
        })
        break
    }
  }

  const onClickItemAction = (itemAction: string, indexToChangeParam?: any) => {
    switch (itemAction) {
      case ADD_DIMSCREEN:
        setShowAddItemRow(true)
        clearErrors()
        break
      case EDIT_DIMSCREEN:
        break
      case DELETE_DIMSCREEN:
        if (selectedReceiving != null) {
          const newData = [...selectedReceiving]
          newData.splice(indexToChangeParam, 1)
          setSelectedReceiving(newData)
        }
        break
      case HIDE_DIMSCREEN:
        setShowAddItemRow(false)
        clearErrors()
        break
    }
  }

  const onClickItemOK = () => {
    const added_product_id = getValues('checkProductID')
    const added_jumlah_barang = getValues('checkJumlahBarang')
    const added_harga_satuan = getValues('checkHargaSatuan') | 0
    if (added_product_id == '' || added_jumlah_barang == '') {
      setError('checkJumlahBarang', { type: 'manual' })
      return
    }
    const selectedProduct = productList.find(
      (product) => product.id === Number(added_product_id)
    ) as ProductsData

    const subTotalTemp = Number(added_jumlah_barang) * added_harga_satuan

    const newRow: ReceivingDataDetails = {
      product_id: Number(added_product_id),
      nama_barang: selectedProduct.nama_barang,
      jumlah_barang: Number(added_jumlah_barang),
      satuan_terkecil: selectedProduct.satuan_terkecil,
      harga_satuan: added_harga_satuan,
      subtotal: subTotalTemp,
    }

    setSelectedReceiving([...selectedReceiving, newRow])
    setShowAddItemRow(false)
    resetField('checkProductID')
    resetField('checkJumlahBarang')
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    resetField,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
      case EDIT_DIMSCREEN:
        const dateToChange = dateToEpochmillis(data.checkTglPenerimaan)
        const data_to_change: ReceivingData = {
          // id and total as dummy value
          id: 0,
          tanggal: dateToChange,
          total: 0,
          items: selectedReceiving,
        }

        if (toggleDimScreen == ADD_DIMSCREEN) {
          if (selectedReceiving.length == 0) {
            setError('checkProductID', { type: 'manual' })
            return
          }
          await addReceivingRecord(data_to_change)
        }

        if (toggleDimScreen == EDIT_DIMSCREEN) {
          if (IDToChange != null)
            await updateReceivingRecord(IDToChange, data_to_change)
        }
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteReceivingRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '') {
      setSearchTerm(null)
      reset()
    } else {
      navigate('./1')
      reset({
        checkSearch: getValues('checkSearch'),
      })
      setSearchTerm(data.checkSearch)
    }

    setToogle(HIDE_DIMSCREEN)
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
          pages={receivingData?.pages}
          currentPage={Number(params.id) | 1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          titleScreen={toggleDimScreen + ' ' + componentTitle}
          widthScreen="9"
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
                    type="date"
                    id={idFormComponentList[0]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkTglPenerimaan', {
                      required: 'Tanggal penerimaan harus diisi',
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglPenerimaan &&
                      errors.checkTglPenerimaan.message?.toString()}
                  </div>
                  <div id="invalid-feedback">
                    {errors.checkJumlahBarang &&
                      'Nama dan jumlah barang harus diisi'}
                  </div>
                  <div id="invalid-feedback">
                    {errors.checkProductID && 'Data penerimaan harus ada'}
                  </div>
                </FloatingLabelFormComponent>

                <div className="row justify-content-end">
                  <div className="col-2">
                    <ActionButton
                      buttonCaption="Add"
                      buttonSize={15}
                      showCaption={true}
                      onClick={() => onClickItemAction(ADD_DIMSCREEN)}
                    />
                  </div>
                </div>

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
                        {showAddItemRow && addItemRow()}
                        {selectedReceiving && tableDataItems()}
                      </tbody>
                      <tfoot>
                        <tr className="table-dark fw-bold">
                          <td colSpan={3}>Total</td>
                          <td>
                            Rp. {Number(getTotalFromItems()).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
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
        </DimScreenTemplate>
      </form>
    </>
  )
}

export default PenerimaanBarang
