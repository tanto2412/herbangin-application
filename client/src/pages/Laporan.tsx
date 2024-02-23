import PageTitle from '../components/PageTitle'
import { useForm } from 'react-hook-form'
import FloatingLabelFormComponent from '../components/FloatingLabelFormComponent'
import { dateToEpochmillis } from '../dataHandling/Constants'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCustomersData } from '../dataHandling/API_customers'
import {
  CustomersData,
  ProductsData,
  SalesData,
} from '../dataHandling/interfaces'
import { AxiosError } from 'axios'
import { useUserContext } from '../components/UserContext'
import { fetchSalesData } from '../dataHandling/API_sales'
import { fetchProductsData } from '../dataHandling/API_products'

const buttonLaporanMap1 = new Map([
  ['Laporan Giro Penjualan Belum Lunas', 'laporan/giro-belum-dibayar'],
  ['Laporan Giro Penjualan Ditolak', 'laporan/giro-ditolak'],
  ['Laporan Pembayaran Penjualan', 'laporan/pembayaran'],
  ['Laporan Penerimaan', 'laporan/penerimaan'],
  ['Laporan Penjualan', 'laporan/penjualan'],
  ['Laporan Piutang', 'laporan/piutang'],
])

const buttonLaporanMap2 = new Map([
  ['Laporan Rekap Cash In', 'rekap/cash-in'],
  ['Laporan Rekap Pembayaran Penjualan', 'rekap/pembayaran'],
  ['Laporan Rekap Penerimaan', 'rekap/penerimaan'],
  ['Laporan Rekap Penjualan', 'rekap/penjualan'],
  ['Laporan Rekap Piutang', 'rekap/piutang'],
  ['Laporan Retur Penjualan', 'laporan/retur'],
])

const Laporan = () => {
  const { register, handleSubmit } = useForm()
  const [customersList, setCustomersList] = useState<CustomersData[]>([])
  const [salesList, setSalesList] = useState<SalesData[]>([])
  const [searchSalesCustomer, setSearchSalesCustomer] = useState<string | null>(
    null
  )
  const [productList, setProductList] = useState<ProductsData[]>([])
  const { setUserName } = useUserContext()
  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    try {
      const searchParams = new URLSearchParams()
      if (!data.laporan) {
        alert('Pilih jenis laporan terlebih dahulu')
        return
      }
      if (!data.ignore && (!data.from || !data.to)) {
        alert('Isi tanggal mulai dan selesai terlebih dahulu')
        return
      }
      if (!data.ignore) {
        searchParams.append('from', dateToEpochmillis(data.from).toString())
        searchParams.append('to', dateToEpochmillis(data.to).toString())
      }
      if (data.customer) {
        searchParams.append('customer', data.customer)
      }
      if (data.sales) {
        searchParams.append('sales', data.sales)
      }
      if (data.product) {
        searchParams.append('product', data.product)
      }
      navigate({
        pathname: data.laporan,
        search: searchParams.toString(),
      })
    } catch (error) {
      alert(error)
    }
  }

  const handleOnChangeSalesCustomer = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value
    setSearchSalesCustomer(selectedValue)
  }

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSalesData(undefined, undefined, true)
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

  const salesListOptions = () =>
    salesList.map((SalesData) => {
      return (
        <option key={SalesData.id} value={SalesData.id}>
          {SalesData.nama}
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

  const productListOptions = () =>
    productList.map((ProductData) => {
      return (
        <option key={ProductData.id} value={ProductData.id}>
          {ProductData.nama_barang}
        </option>
      )
    })

  return (
    <div className="container">
      <form
        id="showReportForm"
        name="showReportForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="row mb-2">
          <PageTitle titleName={'Laporan'} />
        </div>
        <div className="row">
          <div className="col">
            <FloatingLabelFormComponent
              idInputComponent="from"
              labelName="Tanggal Mulai"
            >
              <input
                type="date"
                id="from"
                className="form-control"
                autoComplete="off"
                {...register('from', {
                  required: false,
                })}
              />
            </FloatingLabelFormComponent>
          </div>
          <div className="col">
            <FloatingLabelFormComponent
              idInputComponent="to"
              labelName="Tanggal Akhir"
            >
              <input
                type="date"
                id="to"
                className="form-control"
                autoComplete="off"
                {...register('to', {
                  required: false,
                })}
              />
            </FloatingLabelFormComponent>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id="ignoreDateCheckbox"
              {...register('ignore')}
            />
            <label className="form-check-label" htmlFor="ignoreDateCheckbox">
              Abaikan tanggal
            </label>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <FloatingLabelFormComponent
              idInputComponent="sales"
              labelName="Sales"
            >
              <select
                className="form-select"
                id="sales"
                {...register('sales')}
                onChange={handleOnChangeSalesCustomer}
              >
                <option key="ALL" value={''}>
                  ALL
                </option>
                {salesListOptions()}
              </select>
            </FloatingLabelFormComponent>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <FloatingLabelFormComponent
              idInputComponent="customer"
              labelName="Pelanggan"
            >
              <select
                className="form-select"
                id="customer"
                {...register('customer')}
              >
                <option key="ALL" value={''}>
                  ALL
                </option>
                {customersListOptions()}
              </select>
            </FloatingLabelFormComponent>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <FloatingLabelFormComponent
              idInputComponent="product"
              labelName="Barang"
            >
              <select
                className="form-select"
                id="product"
                {...register('product')}
              >
                <option key="ALL" value={''}>
                  ALL
                </option>
                {productListOptions()}
              </select>
            </FloatingLabelFormComponent>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">Reports:</div>
        </div>
        <div className="row mb-2">
          <div className="col">
            {[...buttonLaporanMap1].map(([label, value], index) => {
              return (
                <div className="form-check" key={'laporan-1' + index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    key={'laporan-1' + index}
                    id={'laporan-1' + index}
                    value={value}
                    {...register('laporan')}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={'laporan-1' + index}
                  >
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
          <div className="col">
            {[...buttonLaporanMap2].map(([label, value], index) => {
              return (
                <div className="form-check" key={'laporan-1' + index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    key={'laporan-2' + index}
                    id={'laporan-2' + index}
                    value={value}
                    {...register('laporan')}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={'laporan-2' + index}
                  >
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <button className="btn btn-sm btn-outline-success" type="submit">
              Tampilkan Laporan
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Laporan
