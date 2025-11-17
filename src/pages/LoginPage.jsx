import Navbar from '../components/Navbar'
import Login from '../components/Login'

function LoginPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <Login />
      </div>
    </>
  )
}

export default LoginPage

