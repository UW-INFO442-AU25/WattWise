import Navbar from '../components/Navbar'
import EnvironmentImpact from '../components/EnvironmentImpact'
import SustainableHomeSimulator from '../components/SustainableHomeSimulator'

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
    </>
  )
}

export default ImpactPage

