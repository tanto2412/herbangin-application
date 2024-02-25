import { useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import UserColumns from '../dummyDataTable/UserColumns.json'
import UserData from '../dummyDataTable/UserData.json'

const componentTitle = 'Master User'

const HIDE_DIMSCREEN = 'NULL'
const ADD_DIMSCREEN = 'Add'
const EDIT_DIMSCREEN = 'Edit'
const DELETE_DIMSCREEN = 'Delete'

const MasterUser = () => {
  const selectItemColumns = () =>
    UserColumns?.map((UserColumns, index) => {
      return (
        <option key={index} value={UserColumns?.header}>
          {UserColumns?.header}
        </option>
      )
    })

  const tableColumns = () =>
    UserColumns?.map((UserColumns, index) => {
      return <th key={index}>{UserColumns?.header}</th>
    })

  const tableData = () =>
    UserData?.map((UserData, index) => {
      return (
        <tr key={index}>
          <td>{UserData?.userId}</td>
          <td>{UserData?.username}</td>
          <td>{UserData?.isAdmin}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption={EDIT_DIMSCREEN}
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(EDIT_DIMSCREEN, UserData?.userId)}
            />
            <ActionButton
              buttonCaption={DELETE_DIMSCREEN}
              buttonSize={20}
              showCaption={false}
              onClick={() => onClickAction(DELETE_DIMSCREEN, UserData?.userId)}
            />
          </td>
        </tr>
      )
    })

  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)

  const onClickAction = (dimScreenName: string, IDToChange?: any) => {
    setToogle(dimScreenName)
    setIDToChange(IDToChange)
    dimScreenName == HIDE_DIMSCREEN && reset()
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
        break
      case EDIT_DIMSCREEN:
        break
      case DELETE_DIMSCREEN:
        break
    }
    setToogle(HIDE_DIMSCREEN)
    reset()
  }

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

  return (
    <>
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
        <form
          id="actionForm"
          name="actionForm"
          onSubmit={handleSubmit(onSubmit)}
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
                      'Panjang password minimal 6 karakter'}
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
                    {...register('checkIsAdmin', {
                      required: true,
                    })}
                  >
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </FloatingLabelFormComponent>
              </div>
            </>
          )}
          {toggleDimScreen === DELETE_DIMSCREEN && (
            <DeleteScreenContent itemID={IDToChange} itemName={''} />
          )}
          {toggleDimScreen != HIDE_DIMSCREEN && (
            <OKCancelButton
              okString={toggleDimScreen.toUpperCase()}
              onClickCancel={() => onClickAction(HIDE_DIMSCREEN)}
            />
          )}
        </form>
      </DimScreenTemplate>
    </>
  )
}

export default MasterUser
