import Navbar from '../components/Navbar'
import Welcome from '../components/Welcome'
import AboutUs from '../components/AboutUs'
import RentingVsHomeowning from '../components/RentingVsHomeowning'
import EnvironmentImpact from '../components/EnvironmentImpact'
import QuizLeadIn from '../components/QuizLeadIn'

function HomePage() {
  return (
    <>
      <Navbar />
      <Welcome />
      <AboutUs />
      <RentingVsHomeowning />
      <EnvironmentImpact />
      <QuizLeadIn />
    </>
  )
}

export default HomePage

