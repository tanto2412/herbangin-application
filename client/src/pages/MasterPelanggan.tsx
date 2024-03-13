import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  addCustomersRecord,
  deleteCustomersRecord,
  fetchCustomersData,
  updateCustomersRecord,
} from '../dataHandling/API_customers'
import { fetchSalesData } from '../dataHandling/API_sales'
import {
  CustomersData,
  Pagination,
  SalesData,
} from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  CustomerColumns,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const componentTitle = 'Master Pelanggan'

const MasterPelanggan = () => {
  const [customersData, setCustomersData] =
    useState<Pagination<CustomersData> | null>(null)
  const [salesList, setSalesList] = useState<SalesData[]>([])
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchCategory, setSearchCategory] = useState<string | undefined>(
    undefined
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [searchItemObject, setsearchItemObject] = useState<any | null>(null)
  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = [
    'checkCustomerName',
    'checkCustomerAddress',
    'checkCustomerPhone',
    'checkCustomerCellphone',
    'checkCustomerEmail',
    'checkCustomerSalesName',
    'checkCustomerMaxPiutang',
  ]
  const labelFormComponentList = [
    'Customer Name',
    'Customer Address',
    'Customer Phone',
    'Customer Handphone',
    'Customer Email',
    'Sales Name',
    'Batas Maksimum Piutang',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomersData(
          searchCategory,
          searchTerm,
          Number(params.page),
          false
        )
        setCustomersData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, searchTerm, searchCategory, setUserName])

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

  const salesListOptions = () =>
    salesList.map((SalesData) => {
      return (
        <option key={SalesData.id} value={SalesData.id}>
          {SalesData.nama}
        </option>
      )
    })

  const selectItemColumns = () => (
    <>
      <option key={1} value="nama_toko">
        Nama Pelanggan
      </option>
      <option key={2} value="sales">
        Nama Sales
      </option>
    </>
  )

  const tableColumns = () =>
    CustomerColumns?.map((CustomerColumns, index) => {
      return <th key={index}>{CustomerColumns}</th>
    })

  const tableData = () =>
    customersData?.result.map((CustomerData, index) => {
      return (
        <tr key={index}>
          <td>{CustomerData?.id}</td>
          <td>{CustomerData?.nama_toko}</td>
          <td>{CustomerData?.alamat}</td>
          <td>{CustomerData?.nomor_telepon}</td>
          <td>{CustomerData?.nomor_handphone}</td>
          <td>{CustomerData?.email}</td>
          <td>{CustomerData?.nama_sales}</td>
          <td>Rp. {Number(CustomerData?.batas_piutang).toLocaleString()}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(EDIT_DIMSCREEN, CustomerData?.id)}
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, CustomerData?.id)}
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
        checkSearchItemObject: getValues('checkSearchItemObject'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })

    if (dimScreenName == EDIT_DIMSCREEN || dimScreenName == DELETE_DIMSCREEN) {
      const selectedSale = customersData?.result.find(
        (sale) => sale.id === IDToChangeParam
      ) as CustomersData
      setValue(idFormComponentList[0], selectedSale.nama_toko)
      setValue(idFormComponentList[1], selectedSale.alamat)
      setValue(idFormComponentList[2], selectedSale.nomor_telepon)
      setValue(idFormComponentList[3], selectedSale.nomor_handphone)
      setValue(idFormComponentList[4], selectedSale.email)
      setValue(idFormComponentList[5], selectedSale.sales_id)
      setValue(idFormComponentList[6], selectedSale.batas_piutang)
      setNameToChange(selectedSale.nama_toko)
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
    const data_to_change: CustomersData = {
      // id and nama_sales as dummy value
      id: 0,
      nama_toko: data.checkCustomerName,
      sales_id: data.checkCustomerSalesName,
      alamat: data.checkCustomerAddress,
      nomor_telepon: data.checkCustomerPhone,
      nomor_handphone: data.checkCustomerCellphone,
      email: data.checkCustomerEmail,
      batas_piutang: data.checkCustomerMaxPiutang,
      nama_sales: '',
    }

    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        await addCustomersRecord(data_to_change)
        break
      case EDIT_DIMSCREEN:
        if (IDToChange != null)
          await updateCustomersRecord(IDToChange, data_to_change)
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteCustomersRecord(IDToChange)
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
      setSearchCategory(data.checkSearchColumns)
      if (data.checkSearchColumns == 'nama_toko')
        setSearchTerm(data.checkSearch)
      else if (data.checkSearchColumns == 'sales')
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
  }

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue == 'nama_toko') setsearchItemObject(null)
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
          pages={customersData?.pages}
          currentPage={Number(params.id) | 1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          titleScreen={toggleDimScreen + ' ' + componentTitle}
          widthScreen="6"
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
                    {...register('checkCustomerName', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkCustomerName && 'Customer Name harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <textarea
                    className="form-control form-control-sm"
                    autoComplete="off"
                    id={idFormComponentList[1]}
                    {...register('checkCustomerAddress', {
                      required: true,
                    })}
                  ></textarea>
                  <div id="invalid-feedback">
                    {errors.checkCustomerAddress &&
                      'Customer Address harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[2]}
                  labelName={labelFormComponentList[2]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[2]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkCustomerPhone')}
                  />
                  <br />
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[3]}
                  labelName={labelFormComponentList[3]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[3]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkCustomerCellphone')}
                  />
                  <br />
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
                    {...register('checkCustomerEmail')}
                  />
                  <br />
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[5]}
                  labelName={labelFormComponentList[5]}
                >
                  <select
                    className="form-select"
                    id={idFormComponentList[5]}
                    {...register('checkCustomerSalesName', {
                      required: true,
                    })}
                  >
                    {salesListOptions()}
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
                    step={1000}
                    min={0}
                    autoComplete="off"
                    {...register('checkCustomerMaxPiutang', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkCustomerMaxPiutang &&
                      'Batas Maksimum Piutang harus diisi'}
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

export default MasterPelanggan
