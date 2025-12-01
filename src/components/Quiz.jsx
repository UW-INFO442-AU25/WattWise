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
        'Using your oven for 60 minutes or more weekly can contribute to higher energy consumption and bills  — try a toaster oven for small tasks or models with better insulation.'
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
    const currentShowerUsage = answers.showerMinutes * 2.0 * 52 // minutes * GPM * weeks
    const reducedShowerUsage = answers.showerMinutes * 1.5 * 52
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

    const [showIntro, setShowIntro] = useState(true);


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
        {showIntro ? (
        <>
            <h1 style={{ marginBottom: '0.75rem' }}>WattWise Home Efficiency Quiz</h1>

            <p style={{ marginBottom: '1rem', fontSize: '0.95rem', opacity: 0.85 }}>
            Answer a few quick questions about your home to discover where you can
            save the most on energy and water bills.
            </p>

            <ul style={{ marginBottom: '1.5rem', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
            <li>Takes under 3 minutes</li>
            <li>Personalized efficiency recommendations</li>
            <li>No account required</li>
            </ul>

            <button
            type="button"
            className="cta-button"
            onClick={() => setShowIntro(false)}
            >
            Start Quiz
            </button>
        </>
        ) : (
        <>
            <h1 style={{ marginBottom: '0.5rem' }}>WattWise Home Efficiency Quiz</h1>

            <p style={{ marginBottom: '1rem', fontSize: '0.95rem', opacity: 0.8 }}>
            Question {currentStepIndex + 1} of {steps.length}
            </p>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
            <ProgressBar
                currentStep={currentStepIndex + 1}
                totalSteps={steps.length}
            />
            </div>

            <form onSubmit={handleSubmit}>

            {/* GOALS */}
            {currentStep === 'goals' && (
                <div>
                <h3>What are your goals?</h3>
                <label>
                    <input type="radio" checked={answers.goals === 'optimize'}
                    onChange={() => handleChange('goals', 'optimize')} /> Optimize what I already use
                </label><br/>
                <label>
                    <input type="radio" checked={answers.goals === 'discover'}
                    onChange={() => handleChange('goals', 'discover')} /> Discover new solutions
                </label>
                </div>
            )}

            {/* HOUSEHOLD TYPE */}
            {currentStep === 'householdType' && (
                <div>
                <h3>What type of household do you live in?</h3>
                <select value={answers.householdType}
                    onChange={e => handleChange('householdType', e.target.value)}>
                    <option value="">Select</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="house">House</option>
                    <option value="condo">Condo / Apartment</option>
                </select>
                </div>
            )}

            {/* HOUSEHOLD SIZE */}
            {currentStep === 'householdSize' && (
                <div>
                <h3>How many people live in your household?</h3>
                <input type="number" value={answers.householdSize}
                    onChange={e => handleChange('householdSize', e.target.value)} />
                </div>
            )}

            {/* APPLIANCES */}
            {currentStep === 'applianceUsage' && (
                <div>
                <h3>How many appliances does your household use daily?</h3>
                <label><input type="radio" checked={answers.applianceUsage === 'essentials'}
                    onChange={() => handleChange('applianceUsage', 'essentials')} /> Essentials only</label><br/>
                <label><input type="radio" checked={answers.applianceUsage === 'some'}
                    onChange={() => handleChange('applianceUsage', 'some')} /> Some</label><br/>
                <label><input type="radio" checked={answers.applianceUsage === 'all'}
                    onChange={() => handleChange('applianceUsage', 'all')} /> All</label>
                </div>
            )}

            {/* PHANTOM LOAD */}
            {currentStep === 'phantom' && (
                <div>
                <h3>How often does your household leave devices plugged in?</h3>
                <label><input type="radio" checked={answers.phantom === 'always'}
                    onChange={() => handleChange('phantom', 'always')} /> Always</label><br/>
                <label><input type="radio" checked={answers.phantom === 'sometimes'}
                    onChange={() => handleChange('phantom', 'sometimes')} /> Sometimes</label><br/>
                <label><input type="radio" checked={answers.phantom === 'never'}
                    onChange={() => handleChange('phantom', 'never')} /> Never</label>
                </div>
            )}

            {/* LIGHTING */}
            {currentStep === 'lighting' && (
                <div>
                <h3>What lighting do you use?</h3>
                <label><input type="radio" checked={answers.lighting === 'led'}
                    onChange={() => handleChange('lighting', 'led')} /> LED</label><br/>
                <label><input type="radio" checked={answers.lighting === 'cfl'}
                    onChange={() => handleChange('lighting', 'cfl')} /> CFL</label><br/>
                <label><input type="radio" checked={answers.lighting === 'incandescent'}
                    onChange={() => handleChange('lighting', 'incandescent')} /> Incandescent</label><br/>
                <label><input type="radio" checked={answers.lighting === 'mix'}
                    onChange={() => handleChange('lighting', 'mix')} /> Mix</label><br/>
                <label><input type="radio" checked={answers.lighting === 'unsure'}
                    onChange={() => handleChange('lighting', 'unsure')} /> Unsure</label>
                </div>
            )}

            {/* BULBS */}
            {currentStep === 'bulbCount' && (
                <div>
                <h3>How many light bulbs in your household are commonly used?</h3>
                <select value={answers.bulbCount}
                    onChange={e => handleChange('bulbCount', e.target.value)}>
                    <option value="">Select</option>
                    <option value="lt10">&lt;10</option>
                    <option value="10-20">10–20</option>
                    <option value="20-30">20–30</option>
                    <option value="30-40">30–40</option>
                    <option value="40+">40+</option>
                </select>
                </div>
            )}

            {/* OVEN */}
            {currentStep === 'ovenMinutesPerWeek' && (
                <div>
                <h3>How many minutes does your household use a kitchen oven per week?</h3>
                <input type="number" value={answers.ovenMinutesPerWeek}
                    onChange={e => handleChange('ovenMinutesPerWeek', e.target.value)} />
                </div>
            )}

            {/* WASHER */}
            {currentStep === 'washerFrequency' && (
                <div>
                <h3>How often does your household run the laundry machine/dishwasher?</h3>
                <label><input type="radio" checked={answers.washerFrequency === '0'}
                    onChange={() => handleChange('washerFrequency', '0')} /> Never/Rarely</label><br/>
                <label><input type="radio" checked={answers.washerFrequency === '1'}
                    onChange={() => handleChange('washerFrequency', '1')} /> Once</label><br/>
                <label><input type="radio" checked={answers.washerFrequency === '2-3'}
                    onChange={() => handleChange('washerFrequency', '2-3')} /> 2–3 times</label><br/>
                <label><input type="radio" checked={answers.washerFrequency === '4+'}
                    onChange={() => handleChange('washerFrequency', '4+')} /> 4+</label>
                </div>
            )}

            {/* HEATING */}
            {currentStep === 'heatingType' && (
                <div>
                <h3>What is your household's heating type?</h3>
                <select value={answers.heatingType}
                    onChange={e => handleChange('heatingType', e.target.value)}>
                    <option value="">Select</option>
                    <option value="electric">Electric</option>
                    <option value="gas">Gas</option>
                    <option value="heat-pump">Heat pump</option>
                    <option value="other">Other</option>
                    <option value="unsure">Unsure</option>
                </select>
                </div>
            )}

            {/* SHOWER */}
            {currentStep === 'shower' && (
                <div>
                <h3>How many minutes does your household use the shower each week?</h3>
                <input type="number" value={answers.showerMinutes}
                    onChange={e => handleChange('showerMinutes', e.target.value)} />
                <h4>Does your household use a low-flow showerhead?</h4>
                <label><input type="radio" checked={answers.lowFlow === 'yes'}
                    onChange={() => handleChange('lowFlow', 'yes')} /> Yes</label><br/>
                <label><input type="radio" checked={answers.lowFlow === 'no'}
                    onChange={() => handleChange('lowFlow', 'no')} /> No</label><br/>
                    <label><input type="radio" checked={answers.lowFlow === 'unsure'}
                    onChange={() => handleChange('lowFlow', 'unsure')} /> Unsure</label>
                </div>
            )}

            {/* SMART STRIPS */}
            {currentStep === 'smartPowerStrips' && (
                <div>
                <h3>Do you use smart power strips?</h3>
                <label><input type="radio" checked={answers.smartPowerStrips === 'yes'}
                    onChange={() => handleChange('smartPowerStrips', 'yes')} /> Yes</label><br/>
                <label><input type="radio" checked={answers.smartPowerStrips === 'no'}
                    onChange={() => handleChange('smartPowerStrips', 'no')} /> No</label><br/>
                <label><input type="radio" checked={answers.smartPowerStrips === 'unsure'}
                    onChange={() => handleChange('smartPowerStrips', 'unsure')} /> Not sure</label>
                </div>
            )}

            {/* ECO */}
            {currentStep === 'ecoConscious' && (
                <div>
                <h3>Environmental habits</h3>
                <label><input type="radio" checked={answers.ecoConscious === 'very'}
                    onChange={() => handleChange('ecoConscious', 'very')} /> Very</label><br/>
                <label><input type="radio" checked={answers.ecoConscious === 'sometimes'}
                    onChange={() => handleChange('ecoConscious', 'sometimes')} /> Sometimes</label><br/>
                <label><input type="radio" checked={answers.ecoConscious === 'rarely'}
                    onChange={() => handleChange('ecoConscious', 'rarely')} /> Rarely</label>
                </div>
            )}

            {/* NAV BUTTONS */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="cta-button"
                onClick={handleBack} disabled={currentStepIndex === 0}>
                Back
                </button>

                {isLastStep ? (
                <button type="submit" className="cta-button">See results</button>
                ) : (
                <button type="button" className="cta-button" onClick={handleNext}>Next</button>
                )}
            </div>

            </form>
        </>
        )}
    </div>
)

}

export default Quiz
