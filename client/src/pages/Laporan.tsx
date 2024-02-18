import PageTitle from '../components/PageTitle'
import RadioButtonReport from '../components/RadioButtonReport'
import { DatePicker } from '@gsebdev/react-simple-datepicker'

const buttonLaporanList = [
  'Laporan Giro Penjualan Belum Lunas',
  'Laporan Giro Penjualan Ditolak',
  'Laporan Pembayaran Penjualan',
  'Laporan Penjualan',
  'Laporan Piutang',
  'Laporan Rekap Cash In',
  'Laporan Rekap Pembayaran Penjualan',
  'Laporan Rekap Penjualan',
  'Laporan Rekap Piutang',
  'Laporan Retur Penjualan',
]

const Laporan = () => {
  const onDateChange = (e: { target: HTMLInputElement }) => {
    console.log(e.target.value)
  }

  return (
    <>
      <div className="p-2">
        <div>
          <PageTitle titleName={'Laporan'} />
        </div>
        <form name="showReportForm">
          <div className="card p-2">
            <div className="card-header fw-bold">Filter</div>
            <div>
              Tanggal mulai{' '}
              <DatePicker
                id="datepicker-id"
                name="date-demo"
                onChange={onDateChange}
              />
            </div>
            <div>
              Tanggal selesai{' '}
              <DatePicker
                id="datepicker-id"
                name="date-demo"
                onChange={onDateChange}
              />
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="ignoreDateCheckbox"
              />
              <label className="form-check-label" htmlFor="ignoreDateCheckbox">
                Abaikan tanggal
              </label>
            </div>
            <div>Reports:</div>
            {buttonLaporanList?.map((buttonLaporanList, index) => {
              return (
                <RadioButtonReport
                  key={index}
                  radioID={'laporan-' + index}
                  radioLabel={buttonLaporanList}
                />
              )
            })}
          </div>
          <div className="p-2">
            <button type="button" className="btn btn-sm btn-outline-success">
              Show Report
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Laporan
