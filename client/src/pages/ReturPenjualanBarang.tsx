import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  addReturRecord,
  deleteReturRecord,
  fetchReturData,
  fetchReturDataDetails,
  updateReturRecord,
} from '../dataHandling/API_retur'
import {
  CustomersData,
  ReturData,
  SalesData,
  OrderData,
  ReturDataDetails,
  OrderDataDetails,
  Pagination,
} from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  ReturColumns,
  ReturItemsColumns,
} from '../dataHandling/Constants'
import {
  dateToEpochmillis,
  epochmillisToDate,
  epochmillisToInputDate,
} from '../utils/DateFunction'
import { fetchCustomersData } from '../dataHandling/API_customers'
import { fetchSalesData } from '../dataHandling/API_sales'
import {
  fetchOrderData,
  fetchOrderDataDetails,
} from '../dataHandling/API_order'
import { AxiosError } from 'axios'
import { useUserContext } from '../components/UserContext'
import { useNavigate, useParams } from 'react-router-dom'

const componentTitle = 'Retur Penjualan Barang'

const PenjualanBarang = () => {
  const [returData, setReturData] = useState<Pagination<ReturData> | null>(null)
  const [selectedRetur, setSelectedRetur] = useState<ReturDataDetails[]>([])
  const [orderItemList, setOrderItemList] = useState<OrderDataDetails[]>([])
  const [customersList, setCustomersList] = useState<CustomersData[]>([])
  const [salesList, setSalesList] = useState<SalesData[]>([])
  const [orderList, setOrderList] = useState<OrderData[]>([])
  const [selectedNomorCustomer, setSelectedNomorCustomer] = useState<
    number | null
  >(null)
  const [selectedNomorFaktur, setSelectedNomorFaktur] = useState<number | null>(
    null
  )

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)

  const [searchCategory, setSearchCategory] = useState<string | undefined>(
    undefined
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [searchItemObject, setsearchItemObject] = useState<any | null>(null)

  const [showAddItemRow, setShowAddItemRow] = useState(false)
  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const [productSoldCheckStock, setProductSoldCheckStock] = useState(0)
  const [productSoldCheckStockID, setProductSoldCheckStockID] = useState<
    string | null
  >(null)

  const idFormComponentList = [
    'checkNomorFaktur',
    'checkTglFaktur',
    'checkTglRetur',
    'checkNamaCustomerForAction',
  ]
  const labelFormComponentList = [
    'Nomor Faktur Penjualan',
    'Tanggal Faktur Penjualan',
    'Tanggal Retur',
    'Pelanggan',
  ]

  const idFormComponentListItem = ['checkOrderItemID', 'checkJumlahBarang']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReturData(
          searchCategory,
          searchTerm,
          Number(params.page),
          false
        )
        setReturData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [params, IDToChange, toggleDimScreen, searchTerm, setUserName])

  useEffect(() => {
    const fetchDataItems = async () => {
      try {
        let data = {} as ReturDataDetails[]
        if (IDToChange != null) {
          data = await fetchReturDataDetails(IDToChange)
          setSelectedRetur(data)
        } else setSelectedRetur([])
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
        if (selectedNomorFaktur != null) {
          const data = await fetchOrderDataDetails(selectedNomorFaktur)
          setOrderItemList(data)
        } else setOrderItemList([])
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [selectedNomorFaktur, setUserName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSalesData()
        setSalesList(data.result)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [setUserName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomersData()
        setCustomersList(data.result)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [setUserName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = null
        if (selectedNomorCustomer == null) data = setOrderList([])
        else {
          data = await fetchOrderData('customer', String(selectedNomorCustomer))
          setOrderList(data.result)
        }
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [setUserName, selectedNomorCustomer])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productSoldCheckStockID == null) {
          setProductSoldCheckStock(0)
        } else {
          const data = orderItemList.find(
            (productorder) =>
              productorder.id === Number(productSoldCheckStockID)
          )
          if (data) setProductSoldCheckStock(data.remainingRetur)
          else setProductSoldCheckStock(0)
        }
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [productSoldCheckStockID, selectedNomorFaktur, setUserName])

  const selectItemColumns = () => (
    <>
      <option key={1} value="nomor_faktur">
        Nomor Penjualan
      </option>
      <option key={2} value="nomor_retur">
        Nomor Retur
      </option>
      <option key={3} value="sales">
        Nama Sales
      </option>
      <option key={4} value="customer">
        Nama Customer
      </option>
    </>
  )

  const orderItemListOptions = () =>
    orderItemList.map((orderItem) => {
      return (
        <option key={orderItem.id} value={orderItem.id}>
          {orderItem.id} : {orderItem.nama_barang}
        </option>
      )
    })

  const customersListToSearchOptions = () =>
    customersList.map((CustomerData) => {
      return (
        <option key={CustomerData.id} value={CustomerData.id}>
          {CustomerData.nama_toko}
        </option>
      )
    })

  const salesListOptions = () =>
    salesList.map((SalesData) => {
      return (
        <option key={SalesData.id} value={SalesData.id}>
          {SalesData.nama}
        </option>
      )
    })

  const orderListOptions = () =>
    orderList.map((OrderData) => {
      return (
        <option key={OrderData.nomor_faktur} value={OrderData.nomor_faktur}>
          {OrderData.nomor_faktur}
        </option>
      )
    })

  const handleOnChangeCheckSoldProduct = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value
    setProductSoldCheckStockID(selectedValue)
  }

  const addItemRow = () => (
    <>
      <tr key={999}>
        <td>
          <select
            className="form-select form-select-sm"
            id={idFormComponentListItem[0]}
            {...register('checkOrderItemID', {
              required: true,
            })}
            onChange={handleOnChangeCheckSoldProduct}
          >
            {orderItemListOptions()}
          </select>
        </td>
        <td> </td>
        <td>
          <input
            type="text"
            id={idFormComponentListItem[1]}
            className="form-control form-control-sm"
            autoComplete="off"
            placeholder={'Max: ' + productSoldCheckStock}
            {...register('checkJumlahBarang', {
              required: true,
            })}
          />
        </td>
        <td> </td>
        <td> </td>
        <td className="text-center" width={100}>
          {/* <ActionButton
            buttonCaption="Delete"
            buttonSize={20}
            showCaption={false}
            onClick={() => onClickItemAction(DELETE_DIMSCREEN, index)}
          /> */}
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
    ReturColumns?.map((ReturColumns, index) => {
      return <th key={index}>{ReturColumns}</th>
    })

  const tableItemsColumns = () =>
    ReturItemsColumns?.map((ReturItemsColumns, index) => {
      return <th key={index}>{ReturItemsColumns}</th>
    })

  const tableData = () =>
    returData?.result.map((ReturPenjualanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{ReturPenjualanBarangData?.nomor_faktur}</td>
          <td>{ReturPenjualanBarangData?.id}</td>
          <td>{epochmillisToDate(ReturPenjualanBarangData?.tanggal)}</td>
          <td>{ReturPenjualanBarangData?.nama_toko}</td>
          <td>{ReturPenjualanBarangData?.nama_sales}</td>
          <td>
            Rp. {Number(ReturPenjualanBarangData?.total).toLocaleString()}
          </td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, ReturPenjualanBarangData?.id)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(DELETE_DIMSCREEN, ReturPenjualanBarangData?.id)
              }
            />
          </td>
        </tr>
      )
    })

  const tableDataItems = () =>
    selectedRetur?.map((returItemDetails, index) => {
      return (
        <tr key={index}>
          <td>{returItemDetails.order_item_id}</td>
          <td>{returItemDetails.nama_barang}</td>
          <td>
            {returItemDetails.jumlah_barang} {returItemDetails.satuan_terkecil}
          </td>
          <td>Rp. {Number(returItemDetails?.harga_satuan).toLocaleString()}</td>
          <td>Rp. {Number(returItemDetails?.subtotal).toLocaleString()}</td>
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
    selectedRetur?.map((returItemDetails) => {
      tempTotal += Number(returItemDetails.subtotal)
    })
    return tempTotal
  }

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    switch (dimScreenName) {
      case ADD_DIMSCREEN:
        setIDToChange(null)
        setSelectedNomorCustomer(null)
        setSelectedNomorFaktur(null)
        setProductSoldCheckStockID(null)
        setProductSoldCheckStock(0)

        idFormComponentList.forEach((id) => {
          setValue(id, '')
        })
        idFormComponentListItem.forEach((id) => {
          setValue(id, '')
        })
        break
      case EDIT_DIMSCREEN:
      case DELETE_DIMSCREEN:
        setIDToChange(IDToChangeParam)
        const selectedReturID = returData?.result.find(
          (order) => order.id === IDToChangeParam
        ) as ReturData
        const dateToChange = epochmillisToInputDate(selectedReturID.tanggal)

        setValue(idFormComponentList[0], selectedReturID.nomor_faktur)
        setValue(
          idFormComponentList[1],
          epochmillisToInputDate(selectedReturID.tanggal_faktur)
        )
        setValue(idFormComponentList[2], dateToChange)
        setNameToChange(dateToChange)

        setSelectedNomorFaktur(selectedReturID.nomor_faktur)
        idFormComponentListItem.forEach((id) => {
          setValue(id, '')
        })
        break
      case HIDE_DIMSCREEN:
        setShowAddItemRow(false)
        setProductSoldCheckStockID(null)
        setProductSoldCheckStock(0)
        reset({
          checkSearch: getValues('checkSearch'),
          checkSearchItemObject: getValues('checkSearchItemObject'),
          checkSearchColumns: getValues('checkSearchColumns'),
        })
        break
    }
  }

  const onClickItemAction = (itemAction: string, indexToChangeParam?: any) => {
    switch (itemAction) {
      case ADD_DIMSCREEN:
        if (selectedNomorFaktur == null) {
          setError('checkNomorFaktur', { type: 'manual' })
        } else {
          setShowAddItemRow(true)
          setProductSoldCheckStockID(null)
          setProductSoldCheckStock(0)
          idFormComponentListItem.forEach((id) => {
            setValue(id, '')
          })
          clearErrors()
        }

        break
      case EDIT_DIMSCREEN:
        break
      case DELETE_DIMSCREEN:
        if (selectedRetur != null) {
          const newData = [...selectedRetur]
          newData.splice(indexToChangeParam, 1)
          setSelectedRetur(newData)
        }
        break
      case HIDE_DIMSCREEN:
        setProductSoldCheckStockID(null)
        setProductSoldCheckStock(0)
        setShowAddItemRow(false)
        idFormComponentList.forEach((id) => {
          setValue(id, '')
        })
        idFormComponentListItem.forEach((id) => {
          setValue(id, '')
        })
        clearErrors()
        break
    }
  }

  const onClickItemOK = () => {
    const added_orderItemID = getValues('checkOrderItemID')
    const added_jumlah_barang = getValues('checkJumlahBarang')
    if (added_orderItemID == '' || added_jumlah_barang == '') {
      setError('checkJumlahBarang', { type: 'manual' })
      return
    }
    if (Number(added_jumlah_barang) > Number(productSoldCheckStock)) {
      setError('checkJumlahBarang', { type: 'manual' })
      return
    }
    const selectedOrderItem = orderItemList.find(
      (orderItem) => orderItem.id === Number(added_orderItemID)
    ) as OrderDataDetails

    const subTotalTemp =
      Number(added_jumlah_barang) * selectedOrderItem.harga_satuan

    const newRow: ReturDataDetails = {
      order_item_id: Number(added_orderItemID),
      product_id: selectedOrderItem.product_id,
      kode_barang: selectedOrderItem.kode_barang,
      nama_barang: selectedOrderItem.nama_barang,
      jumlah_barang: Number(added_jumlah_barang),
      satuan_terkecil: selectedOrderItem.satuan_terkecil,
      harga_satuan: selectedOrderItem.harga_satuan,
      subtotal: subTotalTemp,
    }

    setSelectedRetur([...selectedRetur, newRow])
    setProductSoldCheckStockID(null)
    setProductSoldCheckStock(0)
    setShowAddItemRow(false)
    resetField('checkOrderItemID')
    resetField('checkJumlahBarang')
    idFormComponentListItem.forEach((id) => {
      setValue(id, '')
    })
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
        const dateToChange = dateToEpochmillis(data.checkTglRetur)
        const data_to_change: ReturData = {
          // id, nomor_faktur, tanggal_faktur, customerId, nama_toko, sales_id, nama_sales, total as dummy value
          id: 0,
          nomor_faktur: data.checkNomorFaktur,
          tanggal_faktur: 0,
          tanggal: dateToChange,
          customer_id: 0,
          nama_toko: '',
          sales_id: 0,
          nama_sales: '',
          total: 0,
          items: selectedRetur,
        }

        if (toggleDimScreen == ADD_DIMSCREEN) {
          if (data.checkNomorFaktur == '0') {
            setError('checkNomorFaktur', { type: 'manual' })
            return
          }
          if (selectedRetur.length == 0) {
            setError('checkOrderItemID', { type: 'manual' })
            return
          }
          await addReturRecord(data_to_change)
        }

        if (toggleDimScreen == EDIT_DIMSCREEN) {
          if (IDToChange != null)
            await updateReturRecord(IDToChange, data_to_change)
        }
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteReturRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '' && data.checkSearchItemObject == '') {
      setSearchTerm(undefined)
      setSearchCategory(undefined)
      setsearchItemObject(null)
      reset()
    } else {
      navigate('./1')
      reset({
        checkSearch: getValues('checkSearch'),
        checkSearchItemObject: getValues('checkSearchItemObject'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })
      setSearchCategory(data.checkSearchColumns)
      if (
        data.checkSearchColumns == 'nomor_faktur' ||
        data.checkSearchColumns == 'nomor_retur'
      )
        setSearchTerm(data.checkSearch)
      else if (
        data.checkSearchColumns == 'sales' ||
        data.checkSearchColumns == 'customer'
      )
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
  }

  const handleOnChangeNamaCustomer = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value
    setSelectedNomorCustomer(Number(selectedValue))
    setSelectedNomorFaktur(null)
    setProductSoldCheckStockID(null)
    setProductSoldCheckStock(0)
    setShowAddItemRow(false)
    clearErrors()
    idFormComponentListItem.forEach((id) => {
      setValue(id, '')
    })
  }

  const handleOnChangeNoFaktur = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue != '0') setSelectedNomorFaktur(Number(selectedValue))
    else setSelectedNomorFaktur(null)
    setProductSoldCheckStockID(null)
    setProductSoldCheckStock(0)
    setShowAddItemRow(false)
    clearErrors()
    idFormComponentListItem.forEach((id) => {
      setValue(id, '')
    })
  }

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue == 'nomor_faktur' || selectedValue == 'nomor_retur')
      setsearchItemObject(null)
    else if (selectedValue == 'customer')
      setsearchItemObject(customersListToSearchOptions)
    else if (selectedValue == 'sales') setsearchItemObject(salesListOptions)
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
          handleOnChangeCategory={handleOnChangeCategory}
          searchItemObject={searchItemObject}
          register={register}
          pages={returData?.pages}
          currentPage={Number(params.id) | 1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          widthScreen="9"
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
                {toggleDimScreen === ADD_DIMSCREEN && (
                  <>
                    <FloatingLabelFormComponent
                      idInputComponent={idFormComponentList[3]}
                      labelName={labelFormComponentList[3]}
                    >
                      <select
                        className="form-select"
                        id={idFormComponentList[3]}
                        {...register('checkNamaCustomerForAction', {
                          required: true,
                        })}
                        onChange={handleOnChangeNamaCustomer}
                      >
                        {customersListToSearchOptions()}
                      </select>
                    </FloatingLabelFormComponent>
                    <FloatingLabelFormComponent
                      idInputComponent={idFormComponentList[0]}
                      labelName={labelFormComponentList[0]}
                    >
                      <select
                        className="form-select"
                        id={idFormComponentList[0]}
                        {...register('checkNomorFaktur', {
                          required: true,
                        })}
                        onChange={handleOnChangeNoFaktur}
                      >
                        {orderList.length > 0 ? (
                          <option key={0} value={0}>
                            Pilih nomor faktur
                          </option>
                        ) : (
                          ''
                        )}
                        {orderListOptions()}
                      </select>
                    </FloatingLabelFormComponent>
                  </>
                )}
                {toggleDimScreen === EDIT_DIMSCREEN && (
                  <div className="input-group">
                    <FloatingLabelFormComponent
                      idInputComponent={idFormComponentList[0]}
                      labelName={labelFormComponentList[0]}
                    >
                      <input
                        type="text"
                        id={idFormComponentList[0]}
                        className="form-control"
                        autoComplete="off"
                        {...register('checkNomorFaktur')}
                        disabled={true}
                      />
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
                        {...register('checkTglFaktur')}
                        disabled={true}
                      />
                    </FloatingLabelFormComponent>
                  </div>
                )}

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <input
                    type="date"
                    id={idFormComponentList[2]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkTglRetur', {
                      required: 'Tanggal retur harus diisi',
                    })}
                  />
                </FloatingLabelFormComponent>
                <div id="invalid-feedback">
                  {errors.checkNamaCustomerForAction &&
                    'Nama Pelanggan harus dipilih'}
                </div>
                <div id="invalid-feedback">
                  {errors.checkNomorFaktur &&
                    'Nomor Faktur Penjualan harus dipilih'}
                </div>
                <div id="invalid-feedback">
                  {errors.checkTglRetur &&
                    errors.checkTglRetur.message?.toString()}
                </div>
                <div id="invalid-feedback">
                  {errors.checkJumlahBarang &&
                    'Jumlah Barang Retur tidak boleh lebih dari Penjualan'}
                </div>
                <div id="invalid-feedback">
                  {errors.checkOrderItemID && 'Data Retur Penjualan harus ada'}
                  <br />
                </div>

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
                        {selectedRetur && tableDataItems()}
                      </tbody>
                      <tfoot>
                        <tr className="table-dark fw-bold">
                          <td colSpan={4}>Total</td>
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

export default PenjualanBarang
