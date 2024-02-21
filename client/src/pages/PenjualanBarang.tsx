import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  addOrderRecord,
  deleteOrderRecord,
  fetchOrderData,
  fetchOrderDataDetails,
  updateOrderRecord,
} from '../dataHandling/API_order'
import {
  CustomersData,
  OrderData,
  OrderDataDetails,
  ProductsData,
  SalesData,
} from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  OrderColumns,
  OrderItemsColumns,
  dateToEpochmillis,
  epochmillisToDate,
  epochmillisToInputDate,
} from '../dataHandling/Constants'
import { fetchProductsData } from '../dataHandling/API_products'
import { fetchCustomersData } from '../dataHandling/API_customers'
import { fetchSalesData } from '../dataHandling/API_sales'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'

const componentTitle = 'Penjualan Barang'

const PenjualanBarang = () => {
  const [orderList, setOrderList] = useState<OrderData[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDataDetails[]>([])
  const [productList, setProductList] = useState<ProductsData[]>([])
  const [customersList, setCustomersList] = useState<CustomersData[]>([])
  const [customersListToSearch, setCustomersListToSearch] = useState<
    CustomersData[]
  >([])
  const [salesList, setSalesList] = useState<SalesData[]>([])

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)

  const [searchCategory, setSearchCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchSalesCustomer, setSearchSalesCustomer] = useState<string | null>(
    null
  )
  const [searchItemObject, setsearchItemObject] = useState<any | null>(null)

  const [showAddItemRow, setShowAddItemRow] = useState(false)
  const { setUserName } = useUserContext()

  const idFormComponentList = [
    'checkTglFaktur',
    'checkSalesName',
    'checkCustomerNameAddr',
  ]
  const labelFormComponentList = ['Tanggal Faktur', 'Nama Sales', 'Pelanggan']

  const idFormComponentListItem = ['checkProductID', 'checkJumlahBarang']

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = {} as OrderData[]
        if (searchTerm != null && searchCategory != null)
          data = await fetchOrderData(searchCategory, searchTerm)
        else data = await fetchOrderData()
        setOrderList(data)
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
        let data = {} as OrderDataDetails[]
        if (IDToChange != null) {
          data = await fetchOrderDataDetails(IDToChange)
          setSelectedOrder(data)
        } else setSelectedOrder([])
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
        setProductList(data)
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
        const data = await fetchSalesData()
        setSalesList(data)
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
        setCustomersListToSearch(data)
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
        const data = await fetchCustomersData('sales', searchSalesCustomer)
        setCustomersList(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [searchSalesCustomer, setUserName])

  const selectItemColumns = () => (
    <>
      <option key={1} value="nomor">
        Nomor Penjualan
      </option>
      <option key={2} value="sales">
        Nama Sales
      </option>
      <option key={3} value="customer">
        Nama Customer
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

  const customersListToSearchOptions = () =>
    customersListToSearch.map((CustomerData) => {
      return (
        <option key={CustomerData.id} value={CustomerData.id}>
          {CustomerData.nama_toko}
        </option>
      )
    })

  const customersListOptions = () =>
    customersList?.map((CustomerData) => {
      return (
        <option key={CustomerData.id} value={CustomerData.id}>
          {CustomerData.nama_toko}: {CustomerData.alamat}
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

  const addItemRow = () => (
    <>
      <tr key={999}>
        <td> </td>
        <td>
          <select
            className="form-select form-select-sm"
            id={idFormComponentList[0]}
            {...register('checkProductID', {
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
    OrderColumns?.map((OrderColumns, index) => {
      return <th key={index}>{OrderColumns}</th>
    })

  const tableItemsColumns = () =>
    OrderItemsColumns?.map((OrderItemsColumns, index) => {
      return <th key={index}>{OrderItemsColumns}</th>
    })

  const tableData = () =>
    orderList?.map((PenjualanBarangData, index) => {
      return (
        <tr key={index}>
          <td>{PenjualanBarangData?.nomor_faktur}</td>
          <td>{epochmillisToDate(PenjualanBarangData?.tanggal_faktur)}</td>
          <td>{PenjualanBarangData?.nama_toko}</td>
          <td>{PenjualanBarangData?.nama_sales}</td>
          <td>Rp. {Number(PenjualanBarangData?.total).toLocaleString()}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, PenjualanBarangData?.nomor_faktur)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(
                  DELETE_DIMSCREEN,
                  PenjualanBarangData?.nomor_faktur
                )
              }
            />
          </td>
        </tr>
      )
    })

  const tableDataItems = () =>
    selectedOrder?.map((orderItemDetails, index) => {
      return (
        <tr key={index}>
          <td>{orderItemDetails.kode_barang}</td>
          <td>{orderItemDetails.nama_barang}</td>
          <td>
            {orderItemDetails.jumlah_barang} {orderItemDetails.satuan_terkecil}
          </td>
          <td>Rp. {Number(orderItemDetails?.harga_satuan).toLocaleString()}</td>
          <td>Rp. {Number(orderItemDetails?.subtotal).toLocaleString()}</td>
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

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    switch (dimScreenName) {
      case ADD_DIMSCREEN:
        setIDToChange(null)
        setValue(idFormComponentList[1], '')
        setValue(idFormComponentList[2], '')
        setSearchSalesCustomer(null)
        break
      case EDIT_DIMSCREEN:
      case DELETE_DIMSCREEN:
        setIDToChange(IDToChangeParam)
        const selectedOrderID = orderList.find(
          (order) => order.nomor_faktur === IDToChangeParam
        ) as OrderData
        const dateToChange = epochmillisToInputDate(
          selectedOrderID.tanggal_faktur
        )
        setValue(idFormComponentList[0], dateToChange)
        setValue(idFormComponentList[1], selectedOrderID.sales_id)
        setValue(idFormComponentList[2], selectedOrderID.customer_id)
        setNameToChange(dateToChange)
        setSearchSalesCustomer(String(selectedOrderID.sales_id))
        break
      case HIDE_DIMSCREEN:
        setShowAddItemRow(false)
        setSearchSalesCustomer(null)
        reset()
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
        if (selectedOrder != null) {
          const newData = [...selectedOrder]
          newData.splice(indexToChangeParam, 1)
          setSelectedOrder(newData)
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
    if (added_product_id == '' || added_jumlah_barang == '') {
      setError('checkJumlahBarang', { type: 'manual' })
      return
    }
    const selectedProduct = productList.find(
      (product) => product.id === Number(added_product_id)
    ) as ProductsData

    const subTotalTemp = Number(added_jumlah_barang) * selectedProduct.harga

    const newRow: OrderDataDetails = {
      product_id: Number(added_product_id),
      kode_barang: selectedProduct.kode_barang,
      nama_barang: selectedProduct.nama_barang,
      jumlah_barang: Number(added_jumlah_barang),
      satuan_terkecil: selectedProduct.satuan_terkecil,
      harga_satuan: selectedProduct.harga,
      subtotal: subTotalTemp,
    }

    setSelectedOrder([...selectedOrder, newRow])
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
        const dateToChange = dateToEpochmillis(data.checkTglFaktur)
        const data_to_change: OrderData = {
          // nomor_faktur, nama_toko, sales_id, nama_sales, total and alamat as dummy value
          nomor_faktur: 0,
          tanggal_faktur: dateToChange,
          customer_id: Number(data.checkCustomerNameAddr),
          nama_toko: '',
          sales_id: 0,
          nama_sales: '',
          total: 0,
          alamat: '',
          items: selectedOrder,
        }

        if (toggleDimScreen == ADD_DIMSCREEN) {
          if (selectedOrder.length == 0) {
            setError('checkProductID', { type: 'manual' })
            return
          }
          await addOrderRecord(data_to_change)
        }

        if (toggleDimScreen == EDIT_DIMSCREEN) {
          if (IDToChange != null)
            await updateOrderRecord(IDToChange, data_to_change)
        }
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteOrderRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '' && data.checkSearchItemObject == '') {
      setSearchTerm(null)
      setSearchCategory(null)
      setsearchItemObject(null)
      reset()
    } else {
      setSearchCategory(data.checkSearchColumns)
      if (data.checkSearchColumns == 'nomor') setSearchTerm(data.checkSearch)
      else if (
        data.checkSearchColumns == 'sales' ||
        data.checkSearchColumns == 'customer'
      )
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
  }

  const handleOnChangeSalesCustomer = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value
    setSearchSalesCustomer(selectedValue)
  }

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue == 'nomor') setsearchItemObject(null)
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
              {toggleDimScreen === EDIT_DIMSCREEN && (
                <div className="pb-3 fst-italic text-center text-decoration-underline">
                  Mengedit Penjualan akan menghapus Pembayaran dan Retur yang
                  berhubungan dengan Penjualan ini
                  <br />
                </div>
              )}

              <div className="pb-2">
                <div className="input-group">
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
                  </FloatingLabelFormComponent>

                  <FloatingLabelFormComponent
                    idInputComponent={idFormComponentList[1]}
                    labelName={labelFormComponentList[1]}
                  >
                    <select
                      className="form-select"
                      id={idFormComponentList[1]}
                      {...register('checkSalesName', {
                        required: true,
                      })}
                      onChange={handleOnChangeSalesCustomer}
                    >
                      {salesListOptions()}
                    </select>
                  </FloatingLabelFormComponent>
                </div>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[2]}
                    {...register('checkCustomerNameAddr', {
                      required: true,
                    })}
                  >
                    {customersListOptions()}
                  </select>
                </FloatingLabelFormComponent>
                <div id="invalid-feedback">
                  {errors.checkTglFaktur
                    ? 'Tanggal Faktur harus diisi'
                    : errors.checkSalesName
                    ? 'Nama Sales harus dipilih'
                    : errors.checkCustomerNameAddr
                    ? 'Nama Pelanggan harus dipilih'
                    : errors.checkJumlahBarang
                    ? 'Nama dan Jumlah barang harus diisi'
                    : errors.checkProductID
                    ? 'Data Penjualan harus ada'
                    : ''}
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
                        {selectedOrder && tableDataItems()}
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
        </DimScreenTemplate>
      </form>
    </>
  )
}

export default PenjualanBarang
