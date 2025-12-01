import Navbar from '../components/Navbar'
import Welcome from '../components/Welcome'
import Renting from '../components/Renting'
import Homeowning from '../components/Homeowning'
import QuizLeadIn from '../components/QuizLeadIn'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <>
      <Navbar />
      <Welcome />
      <Renting />
      <Homeowning />
      <QuizLeadIn />
      <Footer />
    </>
  )
}

export default HomePage

