import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  fetchUsersData,
  addUsersRecord,
  deleteUsersRecord,
} from '../dataHandling/API_login_user'
import { Pagination, UsersData } from '../dataHandling/interfaces'
import {
  ADD_DIMSCREEN,
  DELETE_DIMSCREEN,
  HIDE_DIMSCREEN,
  UsersColumns,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

const componentTitle = 'Master User'

const MasterUser = () => {
  const [usersData, setUsersData] = useState<Pagination<UsersData> | null>(null)
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const { setUserName } = useUserContext()
  const params = useParams()

  const idFormComponentList = [
    'checkUsername',
    'checkPassword',
    'checkSelectIsAdmin',
  ]
  const labelFormComponentList = [
    'Username',
    'Password',
    'Administrator status',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsersData()
        setUsersData(data)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [IDToChange, toggleDimScreen, setUserName, params])

  const tableColumns = () =>
    UsersColumns?.map((UserColumns, index) => {
      return <th key={index}>{UserColumns}</th>
    })

  const tableData = () =>
    usersData?.result.map((UserData, index) => {
      return (
        <tr key={index}>
          <td>{UserData?.id}</td>
          <td>{UserData?.nama}</td>
          <td>{UserData?.administrator == true ? 'Ya' : 'Tidak'}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption={DELETE_DIMSCREEN}
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, UserData?.id)}
            />
          </td>
        </tr>
      )
    })

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    IDToChangeParam && setIDToChange(IDToChangeParam)
    dimScreenName == HIDE_DIMSCREEN && reset()

    if (dimScreenName == DELETE_DIMSCREEN) {
      const selectedSale = usersData?.result.find(
        (user) => user.id === IDToChangeParam
      ) as UsersData
      setNameToChange(selectedSale.nama)
    }

    setValue(idFormComponentList[0], '')
    setValue(idFormComponentList[1], '')
    setValue(idFormComponentList[2], '')
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    const data_to_change: UsersData = {
      // id and nama_sales as dummy value
      id: 0,
      nama: data.checkUsername,
      password: data.checkPassword,
      administrator: data.checkSelectIsAdmin,
    }

    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        await addUsersRecord(data_to_change)
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deleteUsersRecord(IDToChange)
        setIDToChange(null)
        break
    }

    setToogle(HIDE_DIMSCREEN)
  }

  return (
    <>
      <form id="actionForm" name="actionForm" onSubmit={handleSubmit(onSubmit)}>
        <ShowDataTemplate
          titleNameString={componentTitle}
          selectItemObject={null}
          tableColumnsObject={tableColumns()}
          tableDataObject={tableData()}
          onClickAdd={() => onClickAction(ADD_DIMSCREEN)}
          register={register}
          pages={1}
          currentPage={1}
        />
        <DimScreenTemplate
          idScreenFormat="dimScreen"
          titleScreen={toggleDimScreen + ' ' + componentTitle}
          onClickClose={() => onClickAction(HIDE_DIMSCREEN)}
          toggleClassName={
            toggleDimScreen === HIDE_DIMSCREEN ? 'invisible' : 'visible'
          }
        >
          {toggleDimScreen === ADD_DIMSCREEN && (
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
                    {...register('checkUsername', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkUsername && 'Username harus diisi'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[1]}
                  labelName={labelFormComponentList[1]}
                >
                  <input
                    type="password"
                    id={idFormComponentList[1]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkPassword', {
                      required: true,
                      minLength: 6,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkPassword &&
                      errors.checkPassword.type === 'required' &&
                      'Password harus diisi'}
                    {errors.checkPassword &&
                      errors.checkPassword.type === 'minLength' &&
                      'Panjang password minimal 5 karakter'}
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
                    {...register('checkSelectIsAdmin', {
                      required: true,
                    })}
                  >
                    <option value="false">Tidak</option>
                    <option value="true">Ya</option>
                  </select>{' '}
                  <div id="invalid-feedback">
                    {errors.checkSelectIsAdmin &&
                      'Adminstrator status harus dipilih'}
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

export default MasterUser
