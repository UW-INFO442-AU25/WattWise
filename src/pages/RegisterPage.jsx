import Navbar from '../components/Navbar'
import Register from '../components/Register'
import Footer from '../components/Footer'

function RegisterPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <Register />
      </div>
      <Footer />
    </>
  )
}

export default RegisterPage

