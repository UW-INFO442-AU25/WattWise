import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';




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
    
    // Note: Tooltips for recommendations are handled in QuizResults component

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

    // washer
    if (answers.washerFrequency === '4+') {
    const msg =
        'You run your washing machine 4+ times a week — batching to 1–2 fuller loads per week can lower water and energy use.'
    console.log('Adding rec (washerFrequency):', msg)
    recs.push(msg)
    }

    // dishwasher
    if (answers.dishwasherFrequency === '4+') {
    const msg =
        'You run your dishwasher 4+ times a week — batching to 1–2 fuller loads per week can lower water and energy use.'
    console.log('Adding rec (dishwasherFrequency):', msg)
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
        dishwasherFrequency: '',
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
        'dishwasherFrequency',
        'heatingType',
        'shower', // showerMinutes + lowFlow together
        'smartPowerStrips',
        'ecoConscious'
    ]

    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const currentStep = steps[currentStepIndex]
    const isLastStep = currentStepIndex === steps.length - 1

    const [showIntro, setShowIntro] = useState(true);

    // Check if current step is answered
    const isCurrentStepAnswered = () => {
        if (currentStep === 'shower') {
            // Shower step requires both showerMinutes and lowFlow
            const hasShowerMinutes = answers.showerMinutes !== '' && answers.showerMinutes !== null && answers.showerMinutes !== undefined
            const hasLowFlow = answers.lowFlow !== '' && answers.lowFlow !== null && answers.lowFlow !== undefined
            return hasShowerMinutes && hasLowFlow
        }
        const answer = answers[currentStep]
        // Check for empty string, null, undefined, or whitespace-only strings
        return answer !== '' && answer !== null && answer !== undefined && String(answer).trim() !== ''
    }

    const handleChange = (field, value) => {
    console.log(`Answer changed → ${field}:`, value)
    setAnswers(prev => ({ ...prev, [field]: value }))
    }

    // Handle number input - prevent non-numeric keys from being typed
    const handleNumberKeyDown = (e) => {
        // Allow: backspace, delete, tab, escape, enter, and arrow keys
        if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return
        }
        // Block Ctrl+V (paste) - we'll handle it separately
        if (e.keyCode === 86 && e.ctrlKey === true) {
            e.preventDefault()
            return
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault()
        }
    }

    // Handle paste - only allow numeric characters
    const handleNumberPaste = (e, field) => {
        e.preventDefault()
        const pastedText = (e.clipboardData || window.clipboardData).getData('text')
        // Extract only numeric characters
        const numericOnly = pastedText.replace(/[^0-9]/g, '')
        if (numericOnly !== '') {
            handleChange(field, numericOnly)
        }
    }

    const handleNext = () => {
    if (currentStepIndex < steps.length - 1 && isCurrentStepAnswered()) {
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
    
    // Ensure last step is answered before submitting
    if (!isCurrentStepAnswered()) {
        return
    }
    
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
        <div className="quiz-intro">
            <h1 className="quiz-intro-title">WattWise Home Efficiency Quiz</h1>

            <p className="quiz-intro-description">
            Answer a few quick questions about your home to discover where you can
            save the most on energy and water bills.
            </p>

            <ul className="quiz-intro-features">
            <li>Takes under 3 minutes</li>
            <li>Personalized efficiency recommendations</li>
            <li>No account required</li>
            </ul>

            <div className="quiz-intro-button-wrapper">
            <button
                type="button"
                className="quiz-intro-button"
                onClick={() => setShowIntro(false)}
            >
                Start Quiz
            </button>
            </div>
        </div>
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
            <div className="quiz-container">
            <div style={{ flex: '1' }}>

            {/* GOALS */}
            {currentStep === 'goals' && (
                <div>
                <h3 className="quiz-question">What are your goals?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.goals === 'optimize'}
                    onChange={() => handleChange('goals', 'optimize')} />
                    <span>Optimize what I already use</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.goals === 'discover'}
                    onChange={() => handleChange('goals', 'discover')} />
                    <span>Discover new solutions</span>
                </label>
                </div>
                </div>
            )}

            {/* HOUSEHOLD TYPE */}
            {currentStep === 'householdType' && (
                <div>
                <h3 className="quiz-question">What type of household do you live in?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.householdType === 'house'}
                    onChange={() => handleChange('householdType', 'house')} />
                    <span>House</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.householdType === 'townhouse'}
                    onChange={() => handleChange('householdType', 'townhouse')} />
                    <span>Townhouse</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.householdType === 'condo'}
                    onChange={() => handleChange('householdType', 'condo')} />
                    <span>Condo</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.householdType === 'apartment'}
                    onChange={() => handleChange('householdType', 'apartment')} />
                    <span>Apartment</span>
                </label>
                </div>
                </div>
            )}

            {/* HOUSEHOLD SIZE */}
            {currentStep === 'householdSize' && (
                <div>
                <h3 className="quiz-question">How many people live in your household?</h3>
                <input type="number" className="quiz-number-input" value={answers.householdSize}
                    onChange={e => handleChange('householdSize', e.target.value)}
                    onKeyDown={handleNumberKeyDown}
                    onPaste={(e) => handleNumberPaste(e, 'householdSize')}
                    min="1" step="1" />
                </div>
            )}

            {/* APPLIANCES */}
            {currentStep === 'applianceUsage' && (
                <div>
                <h3 className="quiz-question">How many <Tooltip term="energy-intensive" content="Appliances that use a lot of electricity or gas, such as dishwashers, washing machines, dryers, and air conditioners. These typically consume more energy than smaller devices like phones or lamps.">energy-intensive appliances</Tooltip> does your household use regularly?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.applianceUsage === 'essentials'}
                    onChange={() => handleChange('applianceUsage', 'essentials')} />
                    <span>Only essential appliances (refrigerator, basic heating/cooling)</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.applianceUsage === 'some'}
                    onChange={() => handleChange('applianceUsage', 'some')} />
                    <span>Some additional appliances (dishwasher, washer, etc.)</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.applianceUsage === 'all'}
                    onChange={() => handleChange('applianceUsage', 'all')} />
                    <span>Many appliances (multiple AC units, frequent use of all major appliances)</span>
                </label>
                </div>
                </div>
            )}

            {/* PHANTOM LOAD */}
            {currentStep === 'phantom' && (
                <div>
                <h3 className="quiz-question">How often do you leave electronics and small appliances (like TVs, computers, phone chargers, coffee makers) plugged in when not in use?</h3>
                <p className="quiz-helper-text">Note: Large appliances like refrigerators should stay plugged in. <Tooltip term="phantom-load" content="The energy that devices use even when they're turned off but still plugged in. This 'vampire power' can add up to $100-200 per year on your electricity bill.">phantom load</Tooltip> refers to energy used by devices that are off but still plugged in.</p>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.phantom === 'always'}
                    onChange={() => handleChange('phantom', 'always')} />
                    <span>Always leave them plugged in</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.phantom === 'sometimes'}
                    onChange={() => handleChange('phantom', 'sometimes')} />
                    <span>Sometimes unplug them</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.phantom === 'never'}
                    onChange={() => handleChange('phantom', 'never')} />
                    <span>Usually unplug them when not in use</span>
                </label>
                </div>
                </div>
            )}

            {/* LIGHTING */}
            {currentStep === 'lighting' && (
                <div>
                <h3 className="quiz-question">What lighting do you use?</h3>
                <div className="quiz-answer-group">
                <div className="quiz-answer-item">
                    <InfoIcon term="LED" content="LED stands for Light Emitting Diode. These are the most energy-efficient bulbs available, using up to 90% less energy than traditional bulbs and lasting 15-25 years." />
                    <label className="quiz-radio-label">
                        <input type="radio" checked={answers.lighting === 'led'}
                        onChange={() => handleChange('lighting', 'led')} />
                        <span>LED</span>
                    </label>
                </div>
                <div className="quiz-answer-item">
                    <InfoIcon term="CFL" content="CFL stands for Compact Fluorescent Lamp. These are the spiral-shaped bulbs that are more efficient than old incandescent bulbs but less efficient than LEDs. They contain a small amount of mercury." />
                    <label className="quiz-radio-label">
                        <input type="radio" checked={answers.lighting === 'cfl'}
                        onChange={() => handleChange('lighting', 'cfl')} />
                        <span>CFL</span>
                    </label>
                </div>
                <div className="quiz-answer-item">
                    <InfoIcon term="Incandescent" content="The traditional light bulbs with a filament inside. These are the least energy-efficient type of bulb and are being phased out in many places due to their high energy use." />
                    <label className="quiz-radio-label">
                        <input type="radio" checked={answers.lighting === 'incandescent'}
                        onChange={() => handleChange('lighting', 'incandescent')} />
                        <span>Incandescent</span>
                    </label>
                </div>
                <div className="quiz-answer-item">
                    <div></div>
                    <label className="quiz-radio-label">
                        <input type="radio" checked={answers.lighting === 'mix'}
                        onChange={() => handleChange('lighting', 'mix')} />
                        <span>Mix</span>
                    </label>
                </div>
                <div className="quiz-answer-item">
                    <div></div>
                    <label className="quiz-radio-label">
                        <input type="radio" checked={answers.lighting === 'unsure'}
                        onChange={() => handleChange('lighting', 'unsure')} />
                        <span>Unsure</span>
                    </label>
                </div>
                </div>
                </div>
            )}

            {/* BULBS */}
            {currentStep === 'bulbCount' && (
                <div>
                <h3 className="quiz-question">How many light bulbs in your household are commonly used?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.bulbCount === 'lt10'}
                    onChange={() => handleChange('bulbCount', 'lt10')} />
                    <span>Less than 10</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.bulbCount === '10-20'}
                    onChange={() => handleChange('bulbCount', '10-20')} />
                    <span>10–20</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.bulbCount === '20-30'}
                    onChange={() => handleChange('bulbCount', '20-30')} />
                    <span>20–30</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.bulbCount === '30-40'}
                    onChange={() => handleChange('bulbCount', '30-40')} />
                    <span>30–40</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.bulbCount === '40+'}
                    onChange={() => handleChange('bulbCount', '40+')} />
                    <span>40+</span>
                </label>
                </div>
                </div>
            )}

            {/* OVEN */}
            {currentStep === 'ovenMinutesPerWeek' && (
                <div>
                <h3 className="quiz-question">How many total minutes per week does your household use the kitchen oven? (Add up all cooking sessions)</h3>
                <input type="number" className="quiz-number-input" value={answers.ovenMinutesPerWeek}
                    onChange={e => handleChange('ovenMinutesPerWeek', e.target.value)}
                    onKeyDown={handleNumberKeyDown}
                    onPaste={(e) => handleNumberPaste(e, 'ovenMinutesPerWeek')}
                    min="0" step="1" />
                </div>
            )}

            {/* WASHER */}
            {currentStep === 'washerFrequency' && (
                <div>
                <h3 className="quiz-question">How often does your household run the washing machine per week?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.washerFrequency === '0'}
                    onChange={() => handleChange('washerFrequency', '0')} />
                    <span>Never/Rarely</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.washerFrequency === '1'}
                    onChange={() => handleChange('washerFrequency', '1')} />
                    <span>Once per week</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.washerFrequency === '2-3'}
                    onChange={() => handleChange('washerFrequency', '2-3')} />
                    <span>2–3 times per week</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.washerFrequency === '4+'}
                    onChange={() => handleChange('washerFrequency', '4+')} />
                    <span>4+ times per week</span>
                </label>
                </div>
                </div>
            )}

            {/* DISHWASHER */}
            {currentStep === 'dishwasherFrequency' && (
                <div>
                <h3 className="quiz-question">How often does your household run the dishwasher per week?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.dishwasherFrequency === '0'}
                    onChange={() => handleChange('dishwasherFrequency', '0')} />
                    <span>Never/Rarely</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.dishwasherFrequency === '1'}
                    onChange={() => handleChange('dishwasherFrequency', '1')} />
                    <span>Once per week</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.dishwasherFrequency === '2-3'}
                    onChange={() => handleChange('dishwasherFrequency', '2-3')} />
                    <span>2–3 times per week</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.dishwasherFrequency === '4+'}
                    onChange={() => handleChange('dishwasherFrequency', '4+')} />
                    <span>4+ times per week</span>
                </label>
                </div>
                </div>
            )}

            {/* HEATING */}
            {currentStep === 'heatingType' && (
                <div>
                <h3 className="quiz-question">What is your household's heating type?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'electric'}
                    onChange={() => handleChange('heatingType', 'electric')} />
                    <span>Electric</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'gas'}
                    onChange={() => handleChange('heatingType', 'gas')} />
                    <span>Gas</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'heat-pump'}
                    onChange={() => handleChange('heatingType', 'heat-pump')} />
                    <span>Heat pump</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'oil'}
                    onChange={() => handleChange('heatingType', 'oil')} />
                    <span>Oil</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'propane'}
                    onChange={() => handleChange('heatingType', 'propane')} />
                    <span>Propane</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.heatingType === 'unsure'}
                    onChange={() => handleChange('heatingType', 'unsure')} />
                    <span>I'm not sure</span>
                </label>
                </div>
                </div>
            )}

            {/* SHOWER */}
            {currentStep === 'shower' && (
                <div>
                <h3 className="quiz-question">How many total minutes per week does your household spend showering? (Add up all household members)</h3>
                <input type="number" className="quiz-number-input" value={answers.showerMinutes}
                    onChange={e => handleChange('showerMinutes', e.target.value)}
                    onKeyDown={handleNumberKeyDown}
                    onPaste={(e) => handleNumberPaste(e, 'showerMinutes')}
                    min="0" step="1" />
                <h4 className="quiz-subheading">Does your household use a <Tooltip term="low-flow-showerhead" content="A showerhead designed to use less water per minute (typically 1.5-2.0 gallons per minute) compared to standard showerheads (2.5+ gallons per minute). They maintain good water pressure while reducing water and energy use.">low-flow showerhead</Tooltip>?</h4>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.lowFlow === 'yes'}
                    onChange={() => handleChange('lowFlow', 'yes')} />
                    <span>Yes</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.lowFlow === 'no'}
                    onChange={() => handleChange('lowFlow', 'no')} />
                    <span>No</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.lowFlow === 'unsure'}
                    onChange={() => handleChange('lowFlow', 'unsure')} />
                    <span>Unsure</span>
                </label>
                </div>
                </div>
            )}

            {/* SMART STRIPS */}
            {currentStep === 'smartPowerStrips' && (
                <div>
                <h3 className="quiz-question">Do you use <Tooltip term="smart-power-strips" content="Power strips that automatically cut off power to devices when they're not in use, eliminating phantom energy waste. They can detect when devices are in standby mode and shut them off completely, saving energy and money.">smart power strips</Tooltip>?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.smartPowerStrips === 'yes'}
                    onChange={() => handleChange('smartPowerStrips', 'yes')} />
                    <span>Yes</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.smartPowerStrips === 'no'}
                    onChange={() => handleChange('smartPowerStrips', 'no')} />
                    <span>No</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.smartPowerStrips === 'unsure'}
                    onChange={() => handleChange('smartPowerStrips', 'unsure')} />
                    <span>Not sure</span>
                </label>
                </div>
                </div>
            )}

            {/* ECO */}
            {currentStep === 'ecoConscious' && (
                <div>
                <h3 className="quiz-question">How often do you think about energy and water conservation in your daily habits?</h3>
                <div className="quiz-answer-group">
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.ecoConscious === 'very'}
                    onChange={() => handleChange('ecoConscious', 'very')} />
                    <span>Very often - it's a regular part of my routine</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.ecoConscious === 'sometimes'}
                    onChange={() => handleChange('ecoConscious', 'sometimes')} />
                    <span>Sometimes - I try when I remember</span>
                </label>
                <label className="quiz-radio-label">
                    <input type="radio" checked={answers.ecoConscious === 'rarely'}
                    onChange={() => handleChange('ecoConscious', 'rarely')} />
                    <span>Rarely - I don't think about it much</span>
                </label>
                </div>
                </div>
            )}

            </div>
            {/* NAV BUTTONS */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
                <button type="button" className="cta-button"
                onClick={handleBack} disabled={currentStepIndex === 0}>
                Back
                </button>

                {isLastStep ? (
                <button type="submit" className="cta-button" disabled={!isCurrentStepAnswered()}>See results</button>
                ) : (
                <button type="button" className="cta-button" onClick={handleNext} disabled={!isCurrentStepAnswered()}>Next</button>
                )}
            </div>
            </div>

            </form>
        </>
        )}
    </div>
)

}

export default Quiz
