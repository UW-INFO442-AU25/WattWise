import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <AboutUs />
      </div>
      <Footer />
    </>
  )
}

export default AboutPage

