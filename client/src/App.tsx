import LoginLayout from './pages/LoginLayout'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, UnprotectedRoute } from './utils/ProtectedRoute'
import MasterBarang from './pages/MasterBarang'
import MasterSales from './pages/MasterSales'
import HomeLayout from './pages/HomeLayout'
import Home from './pages/Home'
import MasterUser from './pages/MasterUser'
import MasterPelanggan from './pages/MasterPelanggan'
import PenerimaanBarang from './pages/PenerimaanBarang'
import PenjualanBarang from './pages/PenjualanBarang'
import ReturPenjualanBarang from './pages/ReturPenjualanBarang'
import PembayaranJualBarang from './pages/PembayaranJualBarang'
import GiroPenjualan from './pages/GiroPenjualan'
import Laporan from './pages/Laporan'
import PDFViewer from './components/PdfViewer'

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <UnprotectedRoute redirectTo="/home" outlet={<LoginLayout />} />
            }
          />
          <Route
            path="/home"
            element={<ProtectedRoute redirectTo="/" outlet={<HomeLayout />} />}
          >
            <Route
              index
              path=""
              element={<ProtectedRoute redirectTo="/" outlet={<Home />} />}
            />
            <Route
              path="user"
              element={
                <ProtectedRoute redirectTo="/" outlet={<MasterUser />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<MasterUser />} />
                }
              />
            </Route>
            <Route
              path="pelanggan"
              element={
                <ProtectedRoute redirectTo="/" outlet={<MasterPelanggan />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<MasterPelanggan />} />
                }
              />
            </Route>
            <Route
              path="sales"
              element={
                <ProtectedRoute redirectTo="/" outlet={<MasterSales />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<MasterSales />} />
                }
              />
            </Route>
            <Route
              path="barang"
              element={
                <ProtectedRoute redirectTo="/" outlet={<MasterBarang />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<MasterBarang />} />
                }
              />
            </Route>
            <Route
              path="penerimaan"
              element={
                <ProtectedRoute redirectTo="/" outlet={<PenerimaanBarang />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute
                    redirectTo="/"
                    outlet={<PenerimaanBarang />}
                  />
                }
              />
            </Route>
            <Route
              path="penjualan"
              element={
                <ProtectedRoute redirectTo="/" outlet={<PenjualanBarang />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<PenjualanBarang />} />
                }
              />
            </Route>
            <Route
              path="retur"
              element={
                <ProtectedRoute
                  redirectTo="/"
                  outlet={<ReturPenjualanBarang />}
                />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute
                    redirectTo="/"
                    outlet={<ReturPenjualanBarang />}
                  />
                }
              />
            </Route>
            <Route
              path="pembayaran"
              element={
                <ProtectedRoute
                  redirectTo="/"
                  outlet={<PembayaranJualBarang />}
                />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute
                    redirectTo="/"
                    outlet={<PembayaranJualBarang />}
                  />
                }
              />
            </Route>
            <Route
              path="giro"
              element={
                <ProtectedRoute redirectTo="/" outlet={<GiroPenjualan />} />
              }
            >
              <Route
                path=":page"
                element={
                  <ProtectedRoute redirectTo="/" outlet={<GiroPenjualan />} />
                }
              />
            </Route>
            <Route
              path="report"
              element={<ProtectedRoute redirectTo="/" outlet={<Laporan />} />}
            />
            <Route
              path="report/:jenis/:id"
              element={<ProtectedRoute redirectTo="/" outlet={<PDFViewer />} />}
            />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
