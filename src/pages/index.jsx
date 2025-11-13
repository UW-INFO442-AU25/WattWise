import Navbar from '../components/Navbar'
import Welcome from '../components/Welcome'
import RentingVsHomeowning from '../components/RentingVsHomeowning'
import QuizLeadIn from '../components/QuizLeadIn'

function HomePage() {
  return (
    <>
      <Navbar />
      <Welcome />
      <RentingVsHomeowning />
      <QuizLeadIn />
    </>
  )
}

export default HomePage

