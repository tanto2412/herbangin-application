import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import DimScreenTemplate from '../components/DimScreenTemplate'
import ShowDataTemplate from '../components/ShowDataTemplate'

import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import DeleteScreenContent from '../components/DeleteScreenContent'
import ActionButton from '../components/ActionButton'
import OKCancelButton from '../components/OKCancelButton'

import {
  fetchPaymentData,
  addPaymentRecord,
  updatePaymentRecord,
  deletePaymentRecord,
} from '../dataHandling/API_payment'
import { OrderData, Pagination, PaymentData } from '../dataHandling/interfaces'
import {
  EDIT_DIMSCREEN,
  HIDE_DIMSCREEN,
  DELETE_DIMSCREEN,
  PaymentColumns,
  TUNAI,
  GIRO,
  TRANSFER,
  LAIN_LAIN,
  ADD_DIMSCREEN,
} from '../dataHandling/Constants'
import { useUserContext } from '../components/UserContext'
import { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
  dateToEpochmillis,
  epochmillisToDate,
  epochmillisToInputDate,
} from '../utils/DateFunction'
import {
  fetchOrderData,
  fetchOrderRemainingAmount,
} from '../dataHandling/API_order'

const componentTitle = 'Pembayaran Jual Barang'

const PembayaranJualBarang = () => {
  const [paymentData, setPaymentData] =
    useState<Pagination<PaymentData> | null>(null)
  const [orderList, setOrderList] = useState<OrderData[]>([])
  const [toggleDimScreen, setToogle] = useState(HIDE_DIMSCREEN)
  const [IDToChange, setIDToChange] = useState<number | null>(null)
  const [nameToChange, setNameToChange] = useState<string | null>(null)
  const [searchCategory, setSearchCategory] = useState<string | undefined>(
    undefined
  )
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [searchItemObject, setsearchItemObject] = useState<any | null>(null)

  const [jenisPembayaran, setJenisPembayaran] = useState<string | undefined>(
    undefined
  )
  const [selectedNomorFaktur, setSelectedNomorFaktur] = useState<number | null>(
    null
  )
  const [fakturRemaininingAmount, setFakturRemaininingAmount] = useState(0)
  const [editFakturAmount, setEditFakturAmount] = useState(0)

  const { setUserName } = useUserContext()
  const params = useParams()
  const navigate = useNavigate()

  const idFormComponentList = [
    'checkNomorFaktur',
    'checkTglPembayaran',
    'checkCaraPembayaran',
    'checkNomorGiro',
    'checkTglJatuhTempo',
    'checkNamaBank',
    'checkBesarBayar',
    'checkKeterangan',
  ]
  const labelFormComponentList = [
    'Nomor Faktur',
    'Tanggal Pembayaran',
    'Cara Pembayaran',
    'Nomor Giro',
    'Tanggal Jatuh Tempo',
    'Nama Bank',
    'Besar Pembayaran',
    'Keterangan',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPaymentData(
          searchCategory,
          searchTerm,
          undefined,
          false
        )
        setPaymentData(data)
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
        if (selectedNomorFaktur != null) {
          const data = await fetchOrderRemainingAmount(selectedNomorFaktur)
          setFakturRemaininingAmount(data)
        }
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
        const data = await fetchOrderData()
        setOrderList(data.result)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          setUserName('')
        }
      }
    }

    fetchData()
  }, [setUserName])

  const orderListOptions = () =>
    orderList.map((OrderData) => {
      return (
        <option key={OrderData.nomor_faktur} value={OrderData.nomor_faktur}>
          {OrderData.nomor_faktur}
        </option>
      )
    })

  const selectItemColumns = () => (
    <>
      <option key={1} value="nomor_faktur">
        Nomor Penjualan
      </option>
      <option key={2} value="jenis_pembayaran">
        Cara Pembayaran
      </option>
    </>
  )

  const jenisBayarOptions = () => (
    <>
      <option key={1} value={TUNAI}>
        {TUNAI}
      </option>
      <option key={2} value={GIRO}>
        {GIRO}
      </option>
      <option key={3} value={TRANSFER}>
        {TRANSFER}
      </option>
      <option key={4} value={LAIN_LAIN}>
        {LAIN_LAIN}
      </option>
    </>
  )

  const tableColumns = () =>
    PaymentColumns?.map((PaymentColumns, index) => {
      return <th key={index}>{PaymentColumns}</th>
    })

  const tableData = () =>
    paymentData?.result.map((PembayaranPenjualanData, index) => {
      return (
        <tr key={index}>
          <td>{PembayaranPenjualanData?.id}</td>
          <td>{PembayaranPenjualanData?.nomor_faktur}</td>
          <td>{epochmillisToDate(PembayaranPenjualanData?.tanggal)}</td>
          <td>{PembayaranPenjualanData?.nama_sales}</td>
          <td>{PembayaranPenjualanData?.nama_toko}</td>
          <td>
            Rp.{' '}
            {Number(
              PembayaranPenjualanData?.jumlah_pembayaran
            ).toLocaleString()}
          </td>
          <td>{PembayaranPenjualanData?.jenis_pembayaran}</td>
          <td>{PembayaranPenjualanData?.nomor_giro}</td>
          <td>
            {PembayaranPenjualanData?.tanggal_jatuh_tempo &&
              epochmillisToDate(PembayaranPenjualanData?.tanggal_jatuh_tempo)}
          </td>
          <td>{PembayaranPenjualanData?.nama_bank}</td>
          <td>{PembayaranPenjualanData?.remarks}</td>
          <td className="text-center" width={90}>
            <ActionButton
              buttonCaption="Edit"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(EDIT_DIMSCREEN, PembayaranPenjualanData?.id)
              }
            />
            <ActionButton
              buttonCaption="Delete"
              buttonSize={20}
              showCaption={false}
              onClick={() =>
                onClickAction(DELETE_DIMSCREEN, PembayaranPenjualanData?.id)
              }
            />
          </td>
        </tr>
      )
    })

  const onClickAction = (dimScreenName: string, IDToChangeParam?: any) => {
    setToogle(dimScreenName)
    setIDToChange(IDToChangeParam)
    dimScreenName == HIDE_DIMSCREEN && reset()

    if (dimScreenName == ADD_DIMSCREEN) {
      setJenisPembayaran(false)
      setSelectedNomorFaktur(null)
      setFakturRemaininingAmount(0)
      setEditFakturAmount(0)
      idFormComponentList.forEach((id) => {
        setValue(id, '')
      })
    } else if (
      dimScreenName == EDIT_DIMSCREEN ||
      dimScreenName == DELETE_DIMSCREEN
    ) {
      const selectedPayment = paymentData?.result.find(
        (giro) => giro.id === IDToChangeParam
      ) as PaymentData
      const dateToChange = epochmillisToInputDate(selectedPayment.tanggal)
      setValue(idFormComponentList[0], selectedPayment.nomor_faktur)
      setValue(idFormComponentList[1], dateToChange)
      setValue(idFormComponentList[2], selectedPayment.jenis_pembayaran)
      setValue(idFormComponentList[3], selectedPayment.nomor_giro)
      setValue(
        idFormComponentList[4],
        epochmillisToInputDate(selectedPayment.tanggal_jatuh_tempo)
      )
      setValue(idFormComponentList[5], selectedPayment.nama_bank)
      setValue(idFormComponentList[6], selectedPayment.jumlah_pembayaran)
      setValue(idFormComponentList[7], selectedPayment.remarks)

      setSelectedNomorFaktur(selectedPayment.nomor_faktur)
      setEditFakturAmount(selectedPayment.jumlah_pembayaran)
      setNameToChange(dateToChange)

      if (selectedPayment.jenis_pembayaran == GIRO) setJenisPembayaran(true)
      else setJenisPembayaran(false)
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    let isError = false
    switch (toggleDimScreen) {
      case ADD_DIMSCREEN:
      case EDIT_DIMSCREEN:
        if (data.checkCaraPembayaran == GIRO) {
          if (data.checkNomorGiro == '') {
            setError('checkNomorGiro', { type: 'manual' })
            isError = true
          }
          if (data.checkTglJatuhTempo == '') {
            setError('checkTglJatuhTempo', { type: 'manual' })
            isError = true
          }
          if (data.checkNamaBank == '') {
            setError('checkNamaBank', { type: 'manual' })
            isError = true
          }
        } else if (data.checkCaraPembayaran == TRANSFER) {
          if (data.checkNamaBank == '') {
            setError('checkNamaBank', { type: 'manual' })
            isError = true
          }
          data.checkNomorGiro = ''
          data.checkTglJatuhTempo = ''
        } else {
          data.checkNomorGiro = ''
          data.checkNamaBank = ''
          data.checkTglJatuhTempo = ''
        }

        if (
          Number(data.checkBesarBayar) >
          Number(fakturRemaininingAmount) + Number(editFakturAmount)
        ) {
          setError('checkBesarBayar', { type: 'manual' })
          isError = true
        }

        if (isError) return

        const datePembayaran = dateToEpochmillis(data.checkTglPembayaran)
        const dateJatuhTempo = dateToEpochmillis(data.checkTglJatuhTempo)

        const data_to_change: PaymentData = {
          // id, nama_toko, nama_sales as dummy value
          id: 0,
          nomor_faktur: data.checkNomorFaktur,
          tanggal: datePembayaran,
          nama_toko: '',
          nama_sales: '',
          jumlah_pembayaran: data.checkBesarBayar,
          jenis_pembayaran: data.checkCaraPembayaran,
          remarks: data.checkKeterangan,
          nomor_giro: data.checkNomorGiro,
          nama_bank: data.checkNamaBank,
          tanggal_jatuh_tempo: dateJatuhTempo,
        }

        if (toggleDimScreen == ADD_DIMSCREEN) {
          await addPaymentRecord(data_to_change)
        }

        if (toggleDimScreen == EDIT_DIMSCREEN) {
          if (IDToChange != null)
            await updatePaymentRecord(IDToChange, data_to_change)
        }
        break
      case DELETE_DIMSCREEN:
        if (IDToChange != null) await deletePaymentRecord(IDToChange)
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
      if (data.checkSearchColumns == 'nomor_faktur')
        setSearchTerm(data.checkSearch)
      else if (data.checkSearchColumns == 'jenis_pembayaran')
        setSearchTerm(data.checkSearchItemObject)
    }

    setToogle(HIDE_DIMSCREEN)
    setSelectedNomorFaktur(null)
    setEditFakturAmount(0)
  }

  const handleOnChangeNoFaktur = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSelectedNomorFaktur(Number(selectedValue))
  }

  const handleOnChangeCaraBayar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJenisPembayaran(e.target.value)
  }
  const handleOnChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue == 'nomor_faktur') setsearchItemObject(null)
    else if (selectedValue == 'jenis_pembayaran')
      setsearchItemObject(jenisBayarOptions)
  }

  return (
    <>
      <form id="actionForm" name="actionForm" onSubmit={handleSubmit(onSubmit)}>
        <ShowDataTemplate
          titleNameString="Pembayaran Jual Barang"
          selectItemObject={selectItemColumns()}
          tableColumnsObject={tableColumns()}
          tableDataObject={tableData()}
          onClickAdd={() => onClickAction(ADD_DIMSCREEN)}
          handleOnChangeCategory={handleOnChangeCategory}
          searchItemObject={searchItemObject}
          register={register}
          pages={paymentData?.pages}
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
                  Mengedit Pembayaran akan mereset Status Pembayaran Giro yang
                  berhubungan dengan Pembayaran ini
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
                    {...register('checkNomorFaktur', {
                      required: true,
                    })}
                    onChange={handleOnChangeNoFaktur}
                  >
                    {orderListOptions()}
                  </select>
                  <div id="invalid-feedback">
                    {errors.checkNomorFaktur &&
                      'Nomor Faktur Penjualan harus dipilih'}
                    <br />
                  </div>
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
                    {...register('checkTglPembayaran', {
                      required: 'Tanggal pembayaran harus diisi',
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkTglPembayaran &&
                      errors.checkTglPembayaran.message?.toString()}
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
                    {...register('checkCaraPembayaran', {
                      required: true,
                    })}
                    onChange={handleOnChangeCaraBayar}
                  >
                    {jenisBayarOptions()}
                  </select>
                  <div id="invalid-feedback">
                    {errors.checkCaraPembayaran &&
                      'Cara Pembayaran harus dipilih'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                {jenisPembayaran === 'GIRO' && (
                  <>
                    <div className="input-group">
                      <FloatingLabelFormComponent
                        idInputComponent={idFormComponentList[3]}
                        labelName={labelFormComponentList[3]}
                      >
                        <input
                          type="text"
                          id={idFormComponentList[3]}
                          className="form-control"
                          autoComplete="off"
                          {...register('checkNomorGiro')}
                        />
                        <div id="invalid-feedback">
                          {errors.checkNomorGiro && 'Nomor Giro harus diisi'}
                          <br />
                        </div>
                      </FloatingLabelFormComponent>

                      <FloatingLabelFormComponent
                        idInputComponent={idFormComponentList[4]}
                        labelName={labelFormComponentList[4]}
                      >
                        <input
                          type="date"
                          id={idFormComponentList[4]}
                          className="form-control"
                          autoComplete="off"
                          {...register('checkTglJatuhTempo')}
                        />
                        <div id="invalid-feedback">
                          {errors.checkTglJatuhTempo &&
                            'Tanggal Jatuh Tempo harus diisi'}
                          <br />
                        </div>
                      </FloatingLabelFormComponent>
                    </div>
                  </>
                )}
                {(jenisPembayaran == TRANSFER || jenisPembayaran == GIRO) && (
                  <FloatingLabelFormComponent
                    idInputComponent={idFormComponentList[5]}
                    labelName={labelFormComponentList[5]}
                  >
                    <input
                      type="text"
                      id={idFormComponentList[5]}
                      className="form-control"
                      autoComplete="off"
                      {...register('checkNamaBank')}
                    />
                    <div id="invalid-feedback">
                      {errors.checkNamaBank && 'Nama Bank harus diisi'}
                      <br />
                    </div>
                  </FloatingLabelFormComponent>
                )}
                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[6]}
                  labelName={
                    labelFormComponentList[6] +
                    ' - Max Rp. ' +
                    (
                      Number(fakturRemaininingAmount) + Number(editFakturAmount)
                    ).toLocaleString()
                  }
                >
                  <input
                    type="number"
                    id={idFormComponentList[6]}
                    className="form-control"
                    step={100}
                    min={0}
                    autoComplete="off"
                    {...register('checkBesarBayar', {
                      required: true,
                    })}
                  />
                  <div id="invalid-feedback">
                    {errors.checkBesarBayar &&
                      'Besar Pembayaran harus diisi dengan benar'}
                    <br />
                  </div>
                </FloatingLabelFormComponent>

                <FloatingLabelFormComponent
                  idInputComponent={idFormComponentList[7]}
                  labelName={labelFormComponentList[7]}
                >
                  <input
                    type="text"
                    id={idFormComponentList[7]}
                    className="form-control"
                    autoComplete="off"
                    {...register('checkKeterangan')}
                  />
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

export default PembayaranJualBarang
