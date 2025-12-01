import Navbar from '../components/Navbar'
import MyProfile from '../components/MyProfile'
import Footer from '../components/Footer'

function MyProfilePage() {
  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <MyProfile />
      </div>
      <Footer />
    </>
  )
}

export default MyProfilePage

