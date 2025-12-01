import Navbar from '../components/Navbar'
import Login from '../components/Login'
import Footer from '../components/Footer'

function LoginPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <Login />
      </div>
      <Footer />
    </>
  )
}

export default LoginPage

