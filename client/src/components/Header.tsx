import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DimScreenTemplate from './DimScreenTemplate'
import FloatingLabelFormComponent from './FloatingLabelFormComponent'
import { useUserContext } from './UserContext'
import { changePassword, fetchLogin } from '../dataHandling/API_login_user'

const Header = () => {
  const onClickLogout = () => {
    setUserName('')
  }

  const { username, setUserName } = useUserContext()

  const [toggleChangePwd, setToogle] = useState(false)
  const onClickChangePwd = () => {
    toggleChangePwd ? setToogle(false) : setToogle(true)
    reset()
  }

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const loginData = await fetchLogin(username, data.oldPassword)
      await changePassword(loginData.id, data.newPassword)
      onClickChangePwd()
    } catch (error) {
      setError('oldPassword', { type: 'wrongpassword' })
    }
  }

  const idFormComponentList = [
    'oldPassword',
    'newPassword',
    'confirmNewPassword',
  ]
  const labelFormComponentList = [
    'Password Lama',
    'Password Baru',
    'Confirm Password Baru',
  ]

  return (
    <>
      <nav id="headerNav" className="navbar sticky-top bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">
            <img src="/Herba.svg" alt="Herba" width="30" height="24" /> Herba
            Store Application
          </a>
          <div>
            Hello, {username}{' '}
            <button
              className="btn btn-sm btn-outline-success"
              type="button"
              onClick={onClickChangePwd}
            >
              Ubah Password
            </button>{' '}
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              onClick={onClickLogout}
            >
              LOGOUT
            </button>
          </div>
        </div>

        <DimScreenTemplate
          idScreenFormat="dimScreen"
          titleScreen="Change Password"
          onClickClose={onClickChangePwd}
          toggleClassName={toggleChangePwd ? 'visible' : 'invisible'}
        >
          <form
            id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FloatingLabelFormComponent
              idInputComponent={idFormComponentList[0]}
              labelName={labelFormComponentList[0]}
            >
              <input
                type="password"
                id={idFormComponentList[0]}
                className="form-control form-control-lg"
                autoComplete="off"
                {...register('oldPassword', {
                  required: true,
                  minLength: 5,
                })}
              />
              <div id="invalid-feedback">
                {errors.oldPassword &&
                  errors.oldPassword.type === 'required' &&
                  'Password lama harus diisi'}
                {errors.oldPassword &&
                  errors.oldPassword.type === 'minLength' &&
                  'Panjang password minimal 5 karakter'}
                {errors.oldPassword &&
                  errors.oldPassword.type === 'wrongpassword' &&
                  'Password lama salah'}
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
                className="form-control form-control-lg"
                autoComplete="off"
                {...register('newPassword', {
                  required: true,
                  minLength: 5,
                })}
              />
              <div id="invalid-feedback">
                {errors.newPassword &&
                  errors.newPassword.type === 'required' &&
                  'Password baru harus diisi'}
                {errors.newPassword &&
                  errors.newPassword.type === 'minLength' &&
                  'Panjang password minimal 5 karakter'}
                <br />
              </div>
            </FloatingLabelFormComponent>

            <FloatingLabelFormComponent
              idInputComponent={idFormComponentList[2]}
              labelName={labelFormComponentList[2]}
            >
              <input
                type="password"
                id={idFormComponentList[2]}
                className="form-control form-control-lg"
                autoComplete="off"
                {...register('confirmNewPassword', {
                  required: true,
                  validate: (value) =>
                    value === watch('newPassword') ||
                    'Confirm Password Baru tidak match',
                })}
              />
              <div id="invalid-feedback">
                {errors.confirmNewPassword &&
                  errors.confirmNewPassword.type === 'required' &&
                  'Confirm Password Baru harus diisi'}
                {watch('confirmNewPassword') !== watch('newPassword') &&
                getValues('confirmNewPassword')
                  ? 'Confirm Password Baru tidak match'
                  : null}
                <br />
              </div>
            </FloatingLabelFormComponent>

            <div className="d-grid gap-2">
              <button
                className="btn btn-success btn-lg btn-block"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </DimScreenTemplate>
      </nav>
    </>
  )
}

export default Header
