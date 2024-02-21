import { NavLink, Outlet } from 'react-router-dom'

const menuMap = new Map<string, string>([
  ['Home', ''],
  ['Master User', 'user'],
  ['Master Pelanggan', 'pelanggan'],
  ['Master Sales', 'sales'],
  ['Master Barang', 'barang'],
  ['Penerimaan Barang', 'penerimaan'],
  ['Penjualan Barang', 'penjualan'],
  ['Retur Barang', 'retur'],
  ['Pembayaran Jual Barang', 'pembayaran'],
  ['Giro Penjualan', 'giro'],
  ['Laporan', 'laporan'],
])

menuMap

const Contents = () => {
  const buttons = [...menuMap].map(([key, value]) => (
    <NavLink className="btn btn-outline-success rounded-0" to={value} end>
      {key}
    </NavLink>
  ))

  return (
    <>
      <div className="d-flex flex-grow-1">
        <div id="sideBar">
          <div className="btn-group-vertical" role="group">
            {buttons}
          </div>
        </div>
        <div className="p-2 w-100">
          <div className="tab-content">
            <div key="contentDiv" className="tab-pane fade show active">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contents
