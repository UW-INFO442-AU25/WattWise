import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { saveChecklistProgress, getChecklistProgress } from '../services/userService'

// Transform recommendation text into actionable checklist items
function transformToActionItem(recommendation, quizAnswers = {}) {
  const lowerRec = recommendation.toLowerCase()
  
  // LED bulbs / lighting
  if (lowerRec.includes('led') || (lowerRec.includes('bulb') && !lowerRec.includes('power'))) {
    if (lowerRec.includes('not fully on led') || lowerRec.includes("you're not fully")) {
      const bulbCount = quizAnswers.bulbCount
      if (bulbCount) {
        const countMap = {
          'lt10': '10',
          '10-20': '15',
          '20-30': '25',
          '30-40': '35',
          '40+': '45'
        }
        const count = countMap[bulbCount] || 'all'
        return `Change my ${count} lightbulbs to LED`
      }
      return 'Change my lightbulbs to LED'
    }
    return 'Switch to LED lightbulbs'
  }
  
  // Smart power strips / phantom load
  if (lowerRec.includes('power strip') || lowerRec.includes('phantom') || lowerRec.includes('plugged')) {
    return 'Install smart power strips to reduce phantom energy'
  }
  
  // Low-flow showerhead (check this before general shower mentions)
  if (lowerRec.includes('low-flow') || (lowerRec.includes('shower') && (lowerRec.includes('gpm') || lowerRec.includes('2.0') || lowerRec.includes('1.5')))) {
    return 'Install a low-flow showerhead'
  }
  
  // Oven usage
  if (lowerRec.includes('oven')) {
    if (lowerRec.includes('toaster oven')) {
      return 'Use a toaster oven for small cooking tasks'
    }
    return 'Optimize my oven usage'
  }
  
  // Washer / dishwasher batching
  if (lowerRec.includes('washer') || lowerRec.includes('dishwasher')) {
    if (lowerRec.includes('batching') || lowerRec.includes('fuller loads')) {
      return 'Batch laundry and dishes into fuller loads'
    }
    return 'Optimize my washer and dishwasher usage'
  }
  
  // Heating efficiency
  if (lowerRec.includes('heating') || lowerRec.includes('heat pump') || lowerRec.includes('thermostat')) {
    if (lowerRec.includes('heat pump')) {
      return 'Consider upgrading to a heat pump system'
    }
    if (lowerRec.includes('thermostat')) {
      return 'Install a smart thermostat'
    }
    return 'Improve my heating efficiency'
  }
  
  // Energy Star appliances
  if (lowerRec.includes('energy star')) {
    return 'Consider Energy Star certified appliances'
  }
  
  // General optimize
  if (lowerRec.includes('optimize') && lowerRec.includes('already have')) {
    return 'Optimize my existing appliances and fixtures'
  }
  
  // General discover
  if (lowerRec.includes('discover') && lowerRec.includes('new solutions')) {
    return 'Explore new energy-efficient solutions'
  }
  
  // Eco-conscious actions
  if (lowerRec.includes('easy wins') || (lowerRec.includes('start with') && lowerRec.includes('led'))) {
    return 'Start with easy wins: LED bulbs and unplugging devices'
  }
  
  // Default: try to extract action from recommendation
  // Remove savings information and make it more actionable
  let actionItem = recommendation
    .replace(/\$[\d,]+(\/year)?/g, '') // Remove dollar amounts
    .replace(/about|roughly|approximately/gi, '')
    .replace(/could save|would save|savings/gi, '')
    .replace(/based on.*$/i, '')
    .replace(/\(.*?\)/g, '') // Remove parenthetical info
    .trim()
  
  // Make it start with an action verb if it doesn't
  if (!/^(change|switch|install|use|reduce|optimize|consider|start|explore|improve|batch)/i.test(actionItem)) {
    // Try to extract the main action
    if (actionItem.toLowerCase().includes('you')) {
      actionItem = actionItem.replace(/^you[^a-z]*/i, '').trim()
    }
    // Capitalize first letter
    actionItem = actionItem.charAt(0).toUpperCase() + actionItem.slice(1)
  }
  
  return actionItem || recommendation
}

// Status types: 'not-started', 'in-progress', 'complete'
const STATUSES = ['not-started', 'in-progress', 'complete']
const STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'complete': 'Complete'
}
const STATUS_ICONS = {
  'not-started': '○',
  'in-progress': '◐',
  'complete': '✓'
}

function Checklist({ results = [], quizAnswers = {} }) {
  const { user } = useAuth()
  const [itemStatuses, setItemStatuses] = useState({}) // { index: 'not-started' | 'in-progress' | 'complete' }
  const [loading, setLoading] = useState(true)
  
  // Transform results into actionable items
  const actionItems = results.map((rec, index) => ({
    original: rec,
    action: transformToActionItem(rec, quizAnswers),
    index
  }))

  // Load checklist progress from Firebase
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || results.length === 0) {
        setLoading(false)
        return
      }

      try {
        const progress = await getChecklistProgress(user.uid)
        if (progress) {
          // Convert old boolean format to new status format for backward compatibility
          const convertedProgress = {}
          Object.keys(progress).forEach(key => {
            if (typeof progress[key] === 'boolean') {
              convertedProgress[key] = progress[key] ? 'complete' : 'not-started'
            } else {
              convertedProgress[key] = progress[key] || 'not-started'
            }
          })
          setItemStatuses(convertedProgress)
        }
      } catch (error) {
        console.error('Error loading checklist progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [user, results])

  // Cycle through statuses: not-started → in-progress → complete → not-started
  const handleStatusChange = async (index) => {
    if (!user) return

    const currentStatus = itemStatuses[index] || 'not-started'
    const currentIndex = STATUSES.indexOf(currentStatus)
    const nextIndex = (currentIndex + 1) % STATUSES.length
    const nextStatus = STATUSES[nextIndex]

    const newStatuses = {
      ...itemStatuses,
      [index]: nextStatus
    }
    setItemStatuses(newStatuses)

    try {
      await saveChecklistProgress(user.uid, newStatuses)
    } catch (error) {
      console.error('Error saving checklist progress:', error)
      // Revert on error
      setItemStatuses(itemStatuses)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#5B8FA8' }}>
        <p>Loading checklist...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#4A5A5E', fontSize: '1.1rem' }}>
          No recommendations available. Complete the quiz to see your action items!
        </p>
      </div>
    )
  }

  // Calculate progress stats
  const completedCount = Object.values(itemStatuses).filter(status => status === 'complete').length
  const inProgressCount = Object.values(itemStatuses).filter(status => status === 'in-progress').length
  const totalCount = actionItems.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Categorize action items (based on original recommendation)
  const categorizeActionItem = (item) => {
    const lowerRec = item.original.toLowerCase()
    if (lowerRec.includes('led') || lowerRec.includes('bulb') || lowerRec.includes('lighting')) {
      return 'Lighting'
    }
    if (lowerRec.includes('power strip') || lowerRec.includes('phantom') || lowerRec.includes('plugged')) {
      return 'Energy Efficiency'
    }
    if (lowerRec.includes('shower') || lowerRec.includes('water') || lowerRec.includes('low-flow') || lowerRec.includes('gallon')) {
      return 'Water Conservation'
    }
    if (lowerRec.includes('oven') || lowerRec.includes('washer') || lowerRec.includes('dishwasher') || lowerRec.includes('appliance')) {
      return 'Appliances'
    }
    if (lowerRec.includes('heating') || lowerRec.includes('heat pump') || lowerRec.includes('thermostat')) {
      return 'Heating & Cooling'
    }
    if (lowerRec.includes('optimize') || lowerRec.includes('discover') || lowerRec.includes('energy star')) {
      return 'General'
    }
    return 'Other'
  }

  const categoryIcons = {
    'Lighting': '💡',
    'Energy Efficiency': '⚡',
    'Water Conservation': '💧',
    'Appliances': '🏠',
    'Heating & Cooling': '🌡️',
    'General': '✨',
    'Other': '📋'
  }

  const categorized = actionItems.reduce((acc, item) => {
    const category = categorizeActionItem(item)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  return (
    <div className="checklist-container">
      {/* Progress Header */}
      <div className="checklist-progress-header">
        <div className="checklist-progress-stats">
          <div className="checklist-progress-stat">
            <div className="checklist-progress-number">{completedCount}</div>
            <div className="checklist-progress-label">Completed</div>
          </div>
          <div className="checklist-progress-stat">
            <div className="checklist-progress-number">{inProgressCount}</div>
            <div className="checklist-progress-label">In Progress</div>
          </div>
          <div className="checklist-progress-stat">
            <div className="checklist-progress-number">{totalCount - completedCount - inProgressCount}</div>
            <div className="checklist-progress-label">Not Started</div>
          </div>
          <div className="checklist-progress-stat">
            <div className="checklist-progress-number">{progressPercentage}%</div>
            <div className="checklist-progress-label">Progress</div>
          </div>
        </div>
        <div className="checklist-progress-bar-container">
          <div 
            className="checklist-progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Categorized Checklist Items */}
      <div className="checklist-items">
        {Object.entries(categorized).map(([category, items]) => (
          <div key={category} className="checklist-category-card">
            <h3 className="checklist-category-title">
              <span className="checklist-category-icon" aria-hidden="true">{categoryIcons[category] || '📋'}</span>
              {category}
            </h3>
            <ul className="checklist-category-list">
              {items.map(({ action, index }) => {
                const status = itemStatuses[index] || 'not-started'
                const statusClass = `checklist-item-${status}`
                return (
                  <li 
                    key={index} 
                    className={`checklist-item ${statusClass}`}
                  >
                    <div className="checklist-item-content">
                      <span className="checklist-item-text">{action}</span>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(index)}
                        className={`checklist-status-button checklist-status-${status}`}
                        disabled={!user}
                        aria-label={`${action}. Current status: ${STATUS_LABELS[status]}. Click to change to ${STATUS_LABELS[STATUSES[(STATUSES.indexOf(status) + 1) % STATUSES.length]]}`}
                        title={`Click to cycle: ${STATUS_LABELS[status]} → ${STATUS_LABELS[STATUSES[(STATUSES.indexOf(status) + 1) % STATUSES.length]]}`}
                      >
                        <span className="checklist-status-icon" aria-hidden="true">{STATUS_ICONS[status]}</span>
                        <span className="checklist-status-label">{STATUS_LABELS[status]}</span>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {!user && (
        <div className="checklist-login-prompt">
          <p style={{ color: '#4A5A5E', fontSize: '1rem', marginBottom: '1rem' }}>
            Sign in to save your progress and track your checklist items!
          </p>
        </div>
      )}
    </div>
  )
}

export default Checklist

