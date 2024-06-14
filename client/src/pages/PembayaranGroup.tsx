import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  fetchPaymentGroupList,
  deletePaymentGroupRecord,
  updatePaymentGroupRecord,
  addPaymentGroupRecord,
} from '../dataHandling/API_payment'
import {
  CustomersData,
  Pagination,
  PaymentGroup,
  SalesData,
} from '../dataHandling/interfaces'
import {
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  DELETE_DIMSCREEN,
  PaymentGroupColumns,
  ADD_DIMSCREEN,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCustomersData } from '../dataHandling/API_customers'
import { fetchSalesData } from '../dataHandling/API_sales'

const componentTitle = 'Pembayaran Jual Barang'

const PembayaranGroup = () => {
  const [paymentGroupData, setPaymentGroupData] =
    useState<Pagination<PaymentGroup> | null>(null)
  const [customersList, setCustomersList] = useState<CustomersData[]>([])
  const [customersListToSearch, setCustomersListToSearch] = useState<
    CustomersData[]
  >([])
  const [salesList, setSalesList] = useState<SalesData[]>([])
  const [searchSalesCustomer, setSearchSalesCustomer] = useState<string | null>(
    null,
  )
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [customerOption, setCustomerOptions] = useState<string | undefined>(
    undefined,
  )

  const [searchCategory, setSearchCategory] = useState<string | undefined>(
    undefined,
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [searchItemObject, setsearchItemObject] = useState<any | null>(null)

  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = ['checkNamaSales', 'checkNamaToko']
  const labelFormComponentList = ['Nama Sales', 'Pelanggan']

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
        setCustomersListToSearch(data.result)
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
        if (searchSalesCustomer != null) {
          const data = await fetchCustomersData('sales', searchSalesCustomer)
          setCustomersList(data.result)
        } else setCustomersList([])
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [searchSalesCustomer, setUserName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPaymentGroupList(
          searchCategory,
          searchTerm,
          Number(params.page),
          false,
        )
        setPaymentGroupData(data)
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

  const salesListToSearchOptions = () =>
    salesList.map((sales) => {
      return (
        <option key={sales.id} value={sales.id}>
          {sales.nama}
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

  const selectItemColumns = () => (
    <>
      <option key={1} value="nomor">
        Nomor Pembayaran
      </option>
      <option key={1} value="customer">
        Nama Pelanggan
      </option>
      <option key={2} value="sales">
        Nama Sales
      </option>
    </>
  )

  const tableColumns = () =>
    PaymentGroupColumns?.map((PaymentColumns, index) => {
      return <th key={index}>{PaymentColumns}</th>
    })

  const tableData = () =>
    paymentGroupData?.result.map((paymentGroup, index) => {
      return (
        <tr key={index}>
          <td>{paymentGroup?.id}</td>
          <td>{paymentGroup?.nama_sales}</td>
          <td>{paymentGroup?.nama_toko}</td>
          <td className="text-center" width={130}>
            <ActionButton
              buttonCaption="List"
              buttonSize={20}
              showCaption={false}
              onClick={() => navigate('./edit/' + paymentGroup?.id)}
            />
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(EDIT_DIMSCREEN, paymentGroup?.id)}
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, paymentGroup?.id)}
            />
          </td>
        </tr>
      )
    })

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    setIDToChange(IDToChangeParam)
    dimScreenName == HIDE_DIMSCREEN &&
      reset({
        checkSearchItemObject: getValues('checkSearchItemObject'),
        checkSearchColumns: getValues('checkSearchColumns'),
        checkSearch: getValues('checkSearch'),
      })

    if (dimScreenName == ADD_DIMSCREEN) {
      setSearchSalesCustomer(null)
      setCustomerOptions('0')
      idFormComponentList.forEach((id) => {
        setValue(id, '')
      })
    } else if (
      dimScreenName == EDIT_DIMSCREEN ||
      dimScreenName == DELETE_DIMSCREEN
    ) {
      const selectedPaymentGroup = paymentGroupData?.result.find(
        (paymentGroup) => paymentGroup.id === IDToChangeParam,
      ) as PaymentGroup
      setValue(idFormComponentList[0], selectedPaymentGroup.sales_id)
      setValue(idFormComponentList[1], selectedPaymentGroup.customer_id)

      setSearchSalesCustomer(selectedPaymentGroup.sales_id.toString())
      setCustomerOptions(selectedPaymentGroup.customer_id.toString())
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    let result = null
    switch (toggleDimScreen) {
      // @ts-ignore
      case ADD_DIMSCREEN:
      case EDIT_DIMSCREEN:
        if (!data.checkNamaSales || data.checkNamaSales == '0') {
          setError('checkNamaSales', { type: 'manual' })
          return
        }
        if (!data.checkNamaToko || data.checkNamaToko == '0') {
          setError('checkNamaToko', { type: 'manual' })
          return
        }

        const data_to_change: PaymentGroup = {
          id: 0,
          customer_id: data.checkNamaToko,
          sales_id: data.checkNamaSales,
          nama_sales: '',
          nama_toko: '',
        }

        if (toggleDimScreen == ADD_DIMSCREEN) {
          result = await addPaymentGroupRecord(data_to_change)
        }

        if (toggleDimScreen == EDIT_DIMSCREEN) {
          if (IDToChange != null)
            result = await updatePaymentGroupRecord(IDToChange, data_to_change)
        }

        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deletePaymentGroupRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '' && data.checkSearchItemObject == '') {
      setSearchTerm(undefined)
      setSearchCategory(undefined)
      setsearchItemObject(null)
      reset()
    } else {
      if (
        (toggleDimScreen == ADD_DIMSCREEN ||
          toggleDimScreen == EDIT_DIMSCREEN) &&
        result
      ) {
        navigate('./edit/' + result.id)
      } else navigate('./1')
      reset({
        checkSearch: getValues('checkSearch'),
        checkSearchItemObject: getValues('checkSearchItemObject'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })
      setSearchCategory(data.checkSearchColumns)
      if (data.checkSearchColumns == 'nomor') setSearchTerm(data.checkSearch)
      else if (
        data.checkSearchColumns == 'sales' ||
        data.checkSearchColumns == 'customer'
      )
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
    setSearchSalesCustomer(null)
  }

  const handleOnChangeNamaSales = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSearchSalesCustomer(selectedValue)
  }

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue == 'nomor') setsearchItemObject(null)
    else if (selectedValue == 'customer')
      setsearchItemObject(customersListToSearchOptions)
    else if (selectedValue == 'sales')
      setsearchItemObject(salesListToSearchOptions)
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setCustomerOptions(selectedValue)
  }

  return (
    <>
      <form id="actionForm" name="actionForm" onSubmit={handleSubmit(onSubmit)}>
        <ShowDataTemplate
          titleNameString={'Pembayaran Jual Barang'}
          selectItemObject={selectItemColumns()}
          tableColumnsObject={tableColumns()}
          tableDataObject={tableData()}
          onClickAdd={() => onClickAction(ADD_DIMSCREEN)}
          handleOnChangeCategory={handleOnChangeCategory}
          searchItemObject={searchItemObject}
          register={register}
          pages={paymentGroupData?.pages}
          currentPage={Number(params.id) | 1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          widthScreen="8"
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
                  Mengedit nomor Pembayaran ini akan menghapus semua pembayaran
                  yang berhubungan dengan nomor pembayaran ini
                  <br />
                </div>
              )}
              <div className="pb-2">
                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[0]}
                  labelName={labelFormComponentList[0]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[0]}
                    {...register(idFormComponentList[0], {
                      required: true,
                    })}
                    onChange={handleOnChangeNamaSales}
                  >
                    {salesListToSearchOptions()}
                  </select>
                  <div id="invalid-feedback">
                    {errors.checkNamaSales && 'Nama sales harus dipilih'}
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[1]}
                    {...register(idFormComponentList[1], {
                      required: true,
                    })}
                    value={customerOption}
                    onChange={handleCustomerChange}
                  >
                    {customersList.length > 0 ? (
                      <option key={0} value={0}></option>
                    ) : (
                      ''
                    )}
                    {customersListToSearchOptions()}
                  </select>
                  <div id="invalid-feedback">
                    {errors.checkNamaToko && 'Nama pelanggan harus dipilih'}
                  </div>
                </FloatingLabelFormComponent>
              </div>
            </>
          )}
          {toggleDimScreen === DELETE_DIMSCREEN && (
            <DeleteScreenContent itemID={IDToChange} />
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

export default PembayaranGroup
