import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';




// ---- Helper to compute recommendations from answers ----
function computeRecs(answers) {
    const recs = []

    // goals
    if (answers.goals === 'optimize') {
    const msg =
        'You want to optimize what you already have — start with low-cost swaps: LED bulbs, smart power strips, and better thermostat schedules.'
    console.log('Adding rec (goals: optimize):', msg)
    recs.push(msg)
    } else if (answers.goals === 'discover') {
    const msg =
        'You want to discover new solutions — consider Energy Star appliances, low-flow fixtures, or even a smart thermostat.'
    console.log('Adding rec (goals: discover):', msg)
    recs.push(msg)
    }

    // bulbs + lighting
    const bulbSavingsMap = {
    lt10: 8 * 8,
    '10-20': 15 * 8,
    '20-30': 25 * 8,
    '30-40': 35 * 8,
    '40+': 45 * 8
    }

    if (answers.lighting && answers.lighting !== 'led' && answers.bulbCount) {
    const estSavings = bulbSavingsMap[answers.bulbCount] || 0
    const msg = `You’re not fully on LED — switching all bulbs could save about $${estSavings}/year (based on ~$8 per LED).`
    console.log('Adding rec (lighting):', msg)
    recs.push(msg)
    }

    // phantom load
    if (answers.phantom === 'always' || answers.smartPowerStrips === 'no') {
    const msg =
        'You leave appliances plugged in often — adding smart power strips could reduce phantom loads by $30–$100/year.'
    console.log('Adding rec (phantom):', msg)
    recs.push(msg)
    }

    // oven usage
    if (answers.ovenMinutesPerWeek && Number(answers.ovenMinutesPerWeek) > 60) {
    const msg =
        'You use your oven a lot — try a toaster oven for small tasks or models with better insulation.'
    console.log('Adding rec (oven):', msg)
    recs.push(msg)
    }

    // washer/dishwasher
    if (answers.washerFrequency === '4+') {
    const msg =
        'You run laundry/dishwasher 4+ times a week — batching to 1–2 fuller loads per week can lower water and energy use.'
    console.log('Adding rec (washerFrequency):', msg)
    recs.push(msg)
    }

    // heating
    if (answers.heatingType) {
    const msg =
        'Consider heating efficiency: heat pumps are higher efficiency; electric resistance and older gas systems can have higher ongoing costs.'
    console.log('Adding rec (heatingType):', msg)
    recs.push(msg)
    }

    // shower + low flow
    if (answers.showerMinutes && answers.lowFlow === 'no') {
    const currentShowerUsage = answers.showerMinutes * 2.0 * 365 // minutes * GPM * days
    const reducedShowerUsage = answers.showerMinutes * 1.5 * 365
    const estShowerSavings = currentShowerUsage - reducedShowerUsage

    // water savings
    const waterCostPerGallon = 0.002 // $/gallon
    const waterSavingsDollars = estShowerSavings * waterCostPerGallon

    // heating savings
    const hotWaterCostPerGallon = 0.015
    const hotWaterSavingsDollars = estShowerSavings * hotWaterCostPerGallon

    // total savings
    const totalSavings = waterSavingsDollars + hotWaterSavingsDollars

    const msg = `Based on your current usage, transitioning to a low-flow showerhead (2.0 → 1.5 GPM) would save you ~${Math.round(
        estShowerSavings
    ).toLocaleString()} gallons/year — roughly $${totalSavings.toFixed(
        0
    )} in combined water + hot water heating costs.`
    console.log('Adding rec (shower):', msg)
    recs.push(msg)
    }

    // eco-consciousness
    if (answers.ecoConscious === 'rarely') {
    const msg =
        'Start with 1–2 easy wins: LED bulbs, shorter showers, and unplugging devices — fast payback.'
    console.log('Adding rec (ecoConscious: rarely):', msg)
    recs.push(msg)
    }

    // console.log('computeRecs → final recs:', recs)
    return recs
    }

    function Quiz() {
    const navigate = useNavigate()

    // all answers in one object
    const [answers, setAnswers] = useState({
    goals: '',
    householdType: '',
    householdSize: '',
    applianceUsage: '',
    phantom: '',
    lighting: '',
    bulbCount: '',
    ovenMinutesPerWeek: '',
    washerFrequency: '',
    heatingType: '',
    showerMinutes: '',
    lowFlow: '',
    smartPowerStrips: '',
    ecoConscious: ''
    })

    // which "page" are we on?
    const steps = [
    'goals',
    'householdType',
    'householdSize',
    'applianceUsage',
    'phantom',
    'lighting',
    'bulbCount',
    'ovenMinutesPerWeek',
    'washerFrequency',
    'heatingType',
    'shower', // showerMinutes + lowFlow together
    'smartPowerStrips',
    'ecoConscious'
    ]

    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const currentStep = steps[currentStepIndex]
    const isLastStep = currentStepIndex === steps.length - 1

    const handleChange = (field, value) => {
    console.log(`Answer changed → ${field}:`, value)
    setAnswers(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1)
    }
    }

    const handleBack = () => {
    if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1)
    }
    }

    const handleSubmit = (e) => {
    e.preventDefault()
    console.log('==== QUIZ SUBMITTED ====')
    console.log('Final user answers:', answers)

    const recs = computeRecs(answers)

    console.log('FINAL Recommendations:', recs)
    console.log('Navigating to results page...')

    // Pass both results and quiz answers to results page
    navigate('/quiz/results', { 
      state: { 
        results: recs,
        quizAnswers: answers 
      } 
    })
    }

    return (
    <div style={{ maxWidth: '800px', margin: '6rem auto 3rem', padding: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>WattWise Home Efficiency Quiz</h1>
        <p style={{ marginBottom: '1rem', fontSize: '0.95rem', opacity: 0.8 }}>
        Question {currentStepIndex + 1} of {steps.length}
        </p>
        
        {/* Progress bar */}
        <div style={{ marginBottom: '1.5rem' }}>
            <ProgressBar
                currentStep={currentStepIndex + 1}
                totalSteps={steps.length}
            />
        </div>

        {/* <p style={{ marginBottom: '2rem' }}>
        Answer a few questions so we can estimate where your biggest savings are.
        </p> */}

        <form onSubmit={handleSubmit}>
        {/* STEP: Goals */}
        {currentStep === 'goals' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>What are your goals?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="goals"
                value="optimize"
                checked={answers.goals === 'optimize'}
                onChange={() => handleChange('goals', 'optimize')}
                />{' '}
                Optimize your existing appliances and products
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="goals"
                value="discover"
                checked={answers.goals === 'discover'}
                onChange={() => handleChange('goals', 'discover')}
                />{' '}
                Discover new environmentally-focused solutions
            </label>
            </fieldset>
        )}

        {/* STEP: Household type */}
        {currentStep === 'householdType' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <h3 id="household-type-label">What type of household do you own?</h3>
            <select
                value={answers.householdType}
                onChange={(e) => handleChange('householdType', e.target.value)}
                aria-labelledby="household-type-label"
                aria-required="true"
            >
                <option value="">Select one</option>
                <option value="townhouse">Townhouse</option>
                <option value="house">House</option>
                <option value="condo">Condo/Apartment</option>
            </select>
            </div>
        )}

        {/* STEP: Household size */}
        {currentStep === 'householdSize' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="household-size-input">
              <h3 style={{ marginBottom: '0.5rem' }}>How many people live in your household?</h3>
              <input
                  type="number"
                  id="household-size-input"
                  min="1"
                  value={answers.householdSize}
                  onChange={(e) => handleChange('householdSize', e.target.value)}
                  placeholder="e.g. 3"
                  aria-required="true"
              />
            </label>
            </div>
        )}

        {/* STEP: Appliance usage */}
        {currentStep === 'applianceUsage' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>How many large appliances do you use in a given day?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="applianceUsage"
                value="essentials"
                checked={answers.applianceUsage === 'essentials'}
                onChange={() => handleChange('applianceUsage', 'essentials')}
                />{' '}
                Only essentials (Fridge, Washer, Heater)
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="applianceUsage"
                value="some"
                checked={answers.applianceUsage === 'some'}
                onChange={() => handleChange('applianceUsage', 'some')}
                />{' '}
                Some (dishwasher, dryer, TV)
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="applianceUsage"
                value="all"
                checked={answers.applianceUsage === 'all'}
                onChange={() => handleChange('applianceUsage', 'all')}
                />{' '}
                All modern appliances (consoles, fans/AC, extra lighting, cooking appliances)
            </label>
            </fieldset>
        )}

        {/* STEP: Phantom load */}
        {currentStep === 'phantom' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>How often do you leave appliances plugged in?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="phantom"
                value="always"
                checked={answers.phantom === 'always'}
                onChange={() => handleChange('phantom', 'always')}
                />{' '}
                All the time
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="phantom"
                value="sometimes"
                checked={answers.phantom === 'sometimes'}
                onChange={() => handleChange('phantom', 'sometimes')}
                />{' '}
                Sometimes
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="phantom"
                value="never"
                checked={answers.phantom === 'never'}
                onChange={() => handleChange('phantom', 'never')}
                />{' '}
                Never
            </label>
            </fieldset>
        )}

        {/* STEP: Lighting type */}
        {currentStep === 'lighting' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>What kind of lighting do you use?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lighting"
                value="led"
                checked={answers.lighting === 'led'}
                onChange={() => handleChange('lighting', 'led')}
                />{' '}
                LED bulbs
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lighting"
                value="cfl"
                checked={answers.lighting === 'cfl'}
                onChange={() => handleChange('lighting', 'cfl')}
                />{' '}
                CFL bulbs
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lighting"
                value="incandescent"
                checked={answers.lighting === 'incandescent'}
                onChange={() => handleChange('lighting', 'incandescent')}
                />{' '}
                Incandescent bulbs
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lighting"
                value="mix"
                checked={answers.lighting === 'mix'}
                onChange={() => handleChange('lighting', 'mix')}
                />{' '}
                A mix
            </label>
            </fieldset>
        )}

        {/* STEP: Bulb count */}
        {currentStep === 'bulbCount' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <h3 id="bulb-count-label">How many bulbs do you think you have in the house?</h3>
            <select
                value={answers.bulbCount}
                onChange={(e) => handleChange('bulbCount', e.target.value)}
                aria-labelledby="bulb-count-label"
            >
                <option value="">Select one</option>
                <option value="lt10">&lt; 10</option>
                <option value="10-20">10–20</option>
                <option value="20-30">20–30</option>
                <option value="30-40">30–40</option>
                <option value="40+">40+</option>
            </select>
            </div>
        )}

        {/* STEP: Oven usage */}
        {currentStep === 'ovenMinutesPerWeek' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="oven-minutes-input">
              <h3 style={{ marginBottom: '0.5rem' }}>How often do you use your oven? (minutes per week)</h3>
              <input
                  type="number"
                  id="oven-minutes-input"
                  min="0"
                  value={answers.ovenMinutesPerWeek}
                  onChange={(e) => handleChange('ovenMinutesPerWeek', e.target.value)}
                  placeholder="e.g. 45"
              />
            </label>
            </div>
        )}

        {/* STEP: Washer / dishwasher */}
        {currentStep === 'washerFrequency' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>How often do you use your washing machine or dishwasher?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="washerFrequency"
                value="1"
                checked={answers.washerFrequency === '1'}
                onChange={() => handleChange('washerFrequency', '1')}
                />{' '}
                Once a week
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="washerFrequency"
                value="2-3"
                checked={answers.washerFrequency === '2-3'}
                onChange={() => handleChange('washerFrequency', '2-3')}
                />{' '}
                2–3 times a week
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="washerFrequency"
                value="4+"
                checked={answers.washerFrequency === '4+'}
                onChange={() => handleChange('washerFrequency', '4+')}
                />{' '}
                4+ times a week
            </label>
            </fieldset>
        )}

        {/* STEP: Heating type */}
        {currentStep === 'heatingType' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <h3 id="heating-type-label">What type of heating do you primarily use?</h3>
            <select
                value={answers.heatingType}
                onChange={(e) => handleChange('heatingType', e.target.value)}
                aria-labelledby="heating-type-label"
            >
                <option value="">Select one</option>
                <option value="electric">Electric heater</option>
                <option value="gas">Gas furnace</option>
                <option value="heat-pump">Heat pump</option>
                <option value="other">Other / Not sure</option>
            </select>
            </div>
        )}

        {/* STEP: Shower + low-flow */}
        {currentStep === 'shower' && (
            <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="shower-minutes-input">
              <h3 style={{ marginBottom: '0.5rem' }}>How long do you typically shower? (minutes per day)</h3>
              <input
                  type="number"
                  id="shower-minutes-input"
                  min="0"
                  value={answers.showerMinutes}
                  onChange={(e) => handleChange('showerMinutes', e.target.value)}
                  placeholder="e.g. 10"
              />
            </label>
            <fieldset style={{ marginTop: '1rem', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Do you own a low-flow shower head?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lowFlow"
                value="yes"
                checked={answers.lowFlow === 'yes'}
                onChange={() => handleChange('lowFlow', 'yes')}
                />{' '}
                Yes
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="lowFlow"
                value="no"
                checked={answers.lowFlow === 'no'}
                onChange={() => handleChange('lowFlow', 'no')}
                />{' '}
                No
            </label>
            </fieldset>
            </div>
        )}

        {/* STEP: Smart power strips */}
        {currentStep === 'smartPowerStrips' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Do you own and use Smart Power Strips?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="smartPowerStrips"
                value="yes"
                checked={answers.smartPowerStrips === 'yes'}
                onChange={() => handleChange('smartPowerStrips', 'yes')}
                />{' '}
                Yes
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="smartPowerStrips"
                value="no"
                checked={answers.smartPowerStrips === 'no'}
                onChange={() => handleChange('smartPowerStrips', 'no')}
                />{' '}
                No
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="smartPowerStrips"
                value="unsure"
                checked={answers.smartPowerStrips === 'unsure'}
                onChange={() => handleChange('smartPowerStrips', 'unsure')}
                />{' '}
                Not sure
            </label>
            </fieldset>
        )}

        {/* STEP: Eco-conscious */}
        {currentStep === 'ecoConscious' && (
            <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
            <legend style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>How often are you conscious about saving water and energy?</legend>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="ecoConscious"
                value="very"
                checked={answers.ecoConscious === 'very'}
                onChange={() => handleChange('ecoConscious', 'very')}
                />{' '}
                Very often – eco-conscious
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="ecoConscious"
                value="sometimes"
                checked={answers.ecoConscious === 'sometimes'}
                onChange={() => handleChange('ecoConscious', 'sometimes')}
                />{' '}
                Sometimes
            </label>
            <label style={{ display: 'block' }}>
                <input
                type="radio"
                name="ecoConscious"
                value="rarely"
                checked={answers.ecoConscious === 'rarely'}
                onChange={() => handleChange('ecoConscious', 'rarely')}
                />{' '}
                Rarely
            </label>
            </fieldset>
        )}

        {/* Navigation buttons */}
        <div
            style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem'
            }}
        >
            <button
            type="button"
            className="cta-button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            style={{
                opacity: currentStepIndex === 0 ? 0.5 : 1,
                cursor: currentStepIndex === 0 ? 'default' : 'pointer'
            }}
            >
            Back
            </button>

            {isLastStep ? (
            <button 
              type="submit" 
              className="cta-button"
              aria-label="Submit quiz and see results"
            >
                See my savings opportunities
            </button>
            ) : (
            <button 
              type="button" 
              className="cta-button" 
              onClick={handleNext}
              aria-label="Go to next question"
            >
                Next
            </button>
            )}
        </div>
        </form>
    </div>
    )
}

export default Quiz
