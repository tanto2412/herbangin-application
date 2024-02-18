import { useState } from 'react'
import Home from '../pages/Home'
import MasterUser from '../pages/MasterUser'
import MasterPelanggan from '../pages/MasterPelanggan'
import MasterSales from '../pages/MasterSales'
import MasterBarang from '../pages/MasterBarang'
import PenerimaanBarang from '../pages/PenerimaanBarang'
import PenjualanBarang from '../pages/PenjualanBarang'
import ReturPenjualanBarang from '../pages/ReturPenjualanBarang'
import PembayaranJualBarang from '../pages/PembayaranJualBarang'
import GiroPenjualan from '../pages/GiroPenjualan'
import Laporan from '../pages/Laporan'

const myMenu = [
  'Home',
  'Master User',
  'Master Pelanggan',
  'Master Sales',
  'Master Barang',
  'Penerimaan Barang',
  'Penjualan Barang',
  'Retur Barang',
  'Pembayaran Jual Barang',
  'Giro Penjualan',
  'Laporan',
]

const componentsMap: Record<string, React.FC> = {
  Home: Home,
  'Master User': MasterUser,
  'Master Pelanggan': MasterPelanggan,
  'Master Sales': MasterSales,
  'Master Barang': MasterBarang,
  'Penerimaan Barang': PenerimaanBarang,
  'Penjualan Barang': PenjualanBarang,
  'Retur Barang': ReturPenjualanBarang,
  'Pembayaran Jual Barang': PembayaranJualBarang,
  'Giro Penjualan': GiroPenjualan,
  Laporan: Laporan,
}

type activeMenuList = (typeof myMenu)[number]

const Contents = () => {
  const [activeMenu, setActiveMenu] = useState<activeMenuList>(myMenu[0])

  const buttons = myMenu.map((myMenu, index) => (
    <button
      key={index}
      type="button"
      className={
        'btn btn-outline-success rounded-0' +
        (activeMenu == myMenu ? ' active' : '')
      }
      onClick={() => setActiveMenu(myMenu)}
    >
      {myMenu}
    </button>
  ))

  const ComponentToRender = componentsMap[activeMenu]

  return (
    <>
      <div className="d-flex">
        <div id="sideBar">
          <div className="btn-group-vertical" role="group">
            {buttons}
          </div>
        </div>
        <div className="p-2">
          <div className="tab-content">
            <div key="contentDiv" className="tab-pane fade show active">
              {ComponentToRender && <ComponentToRender />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contents
