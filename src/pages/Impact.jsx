import Navbar from '../components/Navbar'
import EnvironmentImpact from '../components/EnvironmentImpact'
import SustainableHomeSimulator from '../components/SustainableHomeSimulator'
import Footer from '../components/Footer'

function ImpactPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <EnvironmentImpact />
      </div>
      {/* <div style={{ marginTop: '80px' }}>
        <SustainableHomeSimulator />
      </div> */}
      <Footer />
    </>
  )
}

export default ImpactPage

