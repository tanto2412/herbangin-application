import Header from '../components/Header'
import Contents from '../components/Contents'
import Footer from '../components/Footer'

const HomeLayout = () => {
  return (
    <>
      <div className="vh-100 d-flex flex-column">
        <Header />
        <Contents />
        <Footer />
      </div>
    </>
  )
}

export default HomeLayout
