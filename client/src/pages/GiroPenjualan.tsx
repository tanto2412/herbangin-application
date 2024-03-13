import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import OKCancelButton from '../components/OKCancelButton'

import {
  fetchGiroData,
  updateGiroRecord_Lunas,
  updateGiroRecord_Tolak,
} from '../dataHandling/API_giro'
import { Pagination, GiroData } from '../dataHandling/interfaces'
import {
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  GiroColumns,
  BELUM_LUNAS,
  DELETE_DIMSCREEN,
  DITOLAK,
  LUNAS,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { dateToEpochmillis, epochmillisToDate } from '../utils/DateFunction'

const componentTitle = 'Giro Penjualan'

const GiroPenjualan = () => {
  const [giroData, setGiroData] = useState<Pagination<GiroData> | null>(null)
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

  const idFormComponentList = ['checkNomorGiro', 'checkTglPencairan']
  const labelFormComponentList = ['Nomor Giro', 'Tanggal Pencairan']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGiroData(
          searchCategory,
          searchTerm,
          undefined,
          false
        )
        setGiroData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, searchTerm, searchCategory, setUserName])

  const selectItemColumns = () => (
    <>
      <option key={1} value="nomor_giro">
        Nomor Giro
      </option>
      <option key={2} value="nomor_faktur">
        Nomor Penjualan
      </option>
      <option key={3} value="nomor_pembayaran">
        Nomor Pembayaran
      </option>
      <option key={4} value="status_pembayaran">
        Status Pembayaran
      </option>
    </>
  )

  const statusBayarToSearchOptions = () => (
    <>
      <option key={1} value={BELUM_LUNAS}>
        {BELUM_LUNAS}
      </option>
      <option key={2} value={DITOLAK}>
        {DITOLAK}
      </option>
      <option key={3} value={LUNAS}>
        {LUNAS}
      </option>
    </>
  )

  const tableColumns = () =>
    GiroColumns?.map((GiroColumns, index) => {
      return <th key={index}>{GiroColumns}</th>
    })

  const tableData = () =>
    giroData?.result.map((giroData, index) => {
      return (
        <tr key={index}>
          <td>{giroData?.nomor_giro}</td>
          <td>{giroData?.nomor_pembayaran}</td>
          <td>{giroData?.nomor_faktur}</td>
          <td>{giroData?.nama_bank}</td>
          <td>{epochmillisToDate(giroData?.tanggal_jatuh_tempo)}</td>
          <td>
            {giroData?.tanggal_pencairan &&
              epochmillisToDate(giroData?.tanggal_pencairan)}
          </td>
          <td>{giroData?.status_pembayaran}</td>
          <td className="text-center" width={150}>
            {giroData?.status_pembayaran == BELUM_LUNAS && (
              <OKCancelButton
                okString={LUNAS}
                okButtonType="button"
                cancelString="TOLAK"
                onClickOK={() => onClickAction(EDIT_DIMSCREEN, giroData?.id)}
                onClickCancel={() =>
                  onClickAction(DELETE_DIMSCREEN, giroData?.id)
                }
                buttonSize="btn-sm"
                gutterSize="g-1"
              />
            )}
          </td>
        </tr>
      )
    })

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    setIDToChange(IDToChangeParam)
    dimScreenName == HIDE_DIMSCREEN &&
      reset({
        checkSearch: getValues('checkSearch'),
        checkSearchItemObject: getValues('checkSearchItemObject'),
        checkSearchColumns: getValues('checkSearchColumns'),
      })

    if (dimScreenName == EDIT_DIMSCREEN || dimScreenName == DELETE_DIMSCREEN) {
      const selectedGiro = giroData?.result.find(
        (giro) => giro.id === IDToChangeParam
      ) as GiroData
      setValue(idFormComponentList[0], selectedGiro.nomor_giro)
      setValue(idFormComponentList[1], '')
      setNameToChange(selectedGiro.nomor_giro)
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
    switch (toggleDimScreen) {
      case EDIT_DIMSCREEN:
        if (IDToChange != null)
          await updateGiroRecord_Lunas(
            IDToChange,
            dateToEpochmillis(data.checkTglPencairan)
          )
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await updateGiroRecord_Tolak(IDToChange)
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
      if (
        data.checkSearchColumns == 'nomor_giro' ||
        data.checkSearchColumns == 'nomor_faktur' ||
        data.checkSearchColumns == 'nomor_pembayaran'
      )
        setSearchTerm(data.checkSearch)
      else if (data.checkSearchColumns == 'status_pembayaran')
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
  }

  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (
      selectedValue == 'nomor_giro' ||
      selectedValue == 'nomor_faktur' ||
      selectedValue == 'nomor_pembayaran'
    )
      setsearchItemObject(null)
    else if (selectedValue == 'status_pembayaran')
      setsearchItemObject(statusBayarToSearchOptions)
  }

  return (
    <>
      <form id="actionForm" name="actionForm" onSubmit={handleSubmit(onSubmit)}>
        <ShowDataTemplate
          titleNameString="Giro Penjualan"
          selectItemObject={selectItemColumns()}
          tableColumnsObject={tableColumns()}
          tableDataObject={tableData()}
          handleOnChangeCategory={handleOnChangeCategory}
          searchItemObject={searchItemObject}
          register={register}
          pages={giroData?.pages}
          currentPage={Number(params.id) | 1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          titleScreen={'Pelunasan' + ' ' + componentTitle}
          onClickClose={() => onClickAction(HIDE_DIMSCREEN)}
          toggleClassName={
            toggleDimScreen === HIDE_DIMSCREEN ? 'invisible' : 'visible'
          }
        >
          {toggleDimScreen === EDIT_DIMSCREEN && (
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
                    {...register('checkNomorGiro')}
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
                    {...register('checkTglPencairan', {
                      required: true,
                    })}
                  />
                </FloatingLabelFormComponent>

                <div id="invalid-feedback">
                  {errors.checkTglPencairan && 'Tanggal Pencairan harus diisi'}
                  <br />
                </div>
              </div>
            </>
          )}
          {toggleDimScreen === DELETE_DIMSCREEN && (
            <DeleteScreenContent
              itemName={nameToChange}
              actionString="menolak giro"
            />
          )}
          {toggleDimScreen != HIDE_DIMSCREEN && (
            <OKCancelButton
              okString={'OK'}
              onClickCancel={() => onClickAction(HIDE_DIMSCREEN)}
            />
          )}
        </DimScreenTemplate>
      </form>
    </>
  )
}

export default GiroPenjualan
