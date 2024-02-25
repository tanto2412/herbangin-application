import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  fetchSalesData,
  addSalesRecord,
  updateSalesRecord,
  deleteSalesRecord,
} from '../dataHandling/API_sales'
import { Pagination, SalesData } from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  SalesColumns,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const componentTitle = 'Master Sales'

const MasterSales = () => {
  const [salesData, setSalesData] = useState<Pagination<SalesData> | null>(null)
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = ['checkSalesName']
  const labelFormComponentList = ['Sales Name']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSalesData(
          searchTerm,
          Number(params.page),
          false
        )
        setSalesData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, searchTerm, setUserName, params])

  const selectItemColumns = () => (
    <option key={1} value="nama">
      Nama Sales
    </option>
  )

  const tableColumns = () =>
    SalesColumns?.map((SalesColumns, index) => {
      return <th key={index}>{SalesColumns}</th>
    })

  const tableData = () =>
    salesData?.result.map((SalesData) => {
      return (
        <tr key={SalesData.id}>
          <td>{SalesData?.id}</td>
          <td>{SalesData?.nama}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(EDIT_DIMSCREEN, SalesData?.id)}
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, SalesData?.id)}
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
      const selectedSale = salesData?.result.find(
        (sale) => sale.id === IDToChangeParam
      ) as SalesData
      setValue(idFormComponentList[0], selectedSale.nama)
      setNameToChange(selectedSale.nama)
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
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        await addSalesRecord(data.checkSalesName)
        break
      case EDIT_DIMSCREEN:
        if (IDToChange != null)
          await updateSalesRecord(IDToChange, data.checkSalesName)
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteSalesRecord(IDToChange)
        setIDToChange(null)
        break
    }

    if (data.checkSearch == '') {
      setSearchTerm(null)
      reset()
    } else {
      navigate('./1')
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
          pages={salesData?.pages}
          currentPage={Number(params.id) | 1}
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
                    {...register('checkSalesName', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkSalesName && 'Sales Name harus diisi'}
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

export default MasterSales
