import Navbar from '../components/Navbar'
import MyProfile from '../components/MyProfile'

function MyProfilePage() {
  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <MyProfile />
      </div>
    </>
  )
}

export default MyProfilePage

