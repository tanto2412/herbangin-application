import { NavLink, Outlet } from 'react-router-dom'
import { useUserContext } from './UserContext'

const menuMap = new Map<string, string>([
  ['Home', ''],
  ['Master User', 'user/1'],
  ['Master Pelanggan', 'pelanggan/1'],
  ['Master Sales', 'sales/1'],
  ['Master Barang', 'barang/1'],
  ['Penerimaan Barang', 'penerimaan/1'],
  ['Penjualan Barang', 'penjualan/1'],
  ['Retur Barang', 'retur/1'],
  ['Pembayaran Jual Barang', 'pembayaran/1'],
  ['Giro Penjualan', 'giro/1'],
  ['Laporan', 'report'],
])

const Contents = () => {
  const { username } = useUserContext()
  const buttons = [...menuMap].map(([key, value]) => {
    if (key === 'Master User' && username !== 'supervisor') {
      return ''
    } else {
      return (
        <NavLink
          className="btn btn-outline-success rounded-0"
          key={key}
          to={value}
          end
        >
          {key}
        </NavLink>
      )
    }
  })

  return (
    <>
      <div className="d-flex flex-grow-1">
        <div id="sideBar">
          <div className="btn-group-vertical" role="group">
            {buttons}
          </div>
        </div>
        <div className="p-2 w-100">
          <div className="tab-content h-100">
            <div key="contentDiv" className="tab-pane fade show active h-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contents
