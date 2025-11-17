import Navbar from '../components/Navbar'
import MyProfile from '../components/MyProfile'

function MyProfilePage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <MyProfile />
      </div>
    </>
  )
}

export default MyProfilePage

