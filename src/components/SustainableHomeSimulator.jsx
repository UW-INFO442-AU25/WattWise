import { useState, useCallback, useRef, useEffect } from 'react'

// Mock data for appliances
const APPLIANCE_DATA = [
  {
    id: 'shower',
    name: 'Standard Shower',
    room: 'bathroom',
    baseline: { co2: 120, water: 1200, energy: 50 },
    optimized: { co2: 40, water: 400, energy: 15 },
    icon: '🚿',
    optimizedIcon: '💧',
    optimizedName: 'Low-Flow Showerhead'
  },
  {
    id: 'bulb',
    name: 'Incandescent Bulb',
    room: 'living',
    baseline: { co2: 80, water: 0, energy: 120 },
    optimized: { co2: 15, water: 0, energy: 20 },
    icon: '💡',
    optimizedIcon: '⚡',
    optimizedName: 'LED Light'
  },
  {
    id: 'dishwasher',
    name: 'Old Dishwasher',
    room: 'kitchen',
    baseline: { co2: 150, water: 800, energy: 200 },
    optimized: { co2: 60, water: 300, energy: 80 },
    icon: '🍽️',
    optimizedIcon: '✨',
    optimizedName: 'High-Efficiency Dishwasher'
  },
  {
    id: 'hvac',
    name: 'Inefficient HVAC',
    room: 'living',
    baseline: { co2: 300, water: 0, energy: 500 },
    optimized: { co2: 120, water: 0, energy: 200 },
    icon: '🌡️',
    optimizedIcon: '🏠',
    optimizedName: 'Smart HVAC'
  },
  {
    id: 'washer',
    name: 'Old Washer/Dryer',
    room: 'laundry',
    baseline: { co2: 200, water: 1000, energy: 300 },
    optimized: { co2: 80, water: 400, energy: 120 },
    icon: '👕',
    optimizedIcon: '⭐',
    optimizedName: 'ENERGY STAR Washer/Dryer'
  },
  {
    id: 'bedroom-bulb',
    name: 'Incandescent Bulb',
    room: 'bedroom',
    baseline: { co2: 60, water: 0, energy: 90 },
    optimized: { co2: 12, water: 0, energy: 15 },
    icon: '💡',
    optimizedIcon: '⚡',
    optimizedName: 'LED Light'
  },
  {
    id: 'thermostat',
    name: 'Old Thermostat',
    room: 'bedroom',
    baseline: { co2: 180, water: 0, energy: 280 },
    optimized: { co2: 70, water: 0, energy: 110 },
    icon: '🌡️',
    optimizedIcon: '📱',
    optimizedName: 'Smart Thermostat'
  }
]

// Decorative items (non-interactive)
const DECORATIVE_ITEMS = [
  { id: 'sofa', room: 'living', icon: '🛋️', name: 'Sofa' },
  { id: 'bed', room: 'bedroom', icon: '🛏️', name: 'Bed' },
  { id: 'table', room: 'kitchen', icon: '🪑', name: 'Table' },
  { id: 'mirror', room: 'bathroom', icon: '🪞', name: 'Mirror' }
]

// Fixed goal
const GOAL = {
  co2: 1100, // pounds (converted from 500 kg)
  water: 5000, // gallons
  energy: 1000 // kWh
}

// Conversion factor: 1 kg = 2.20462 lbs
const KG_TO_LBS = 2.20462

function SustainableHomeSimulator() {
  const [replacedAppliances, setReplacedAppliances] = useState(new Set())
  const [draggedItem, setDraggedItem] = useState(null)
  const [hoveredAppliance, setHoveredAppliance] = useState(null)
  const [hoveredTool, setHoveredTool] = useState(null)
  const [stats, setStats] = useState({ co2: 0, water: 0, energy: 0 })
  const [displayStats, setDisplayStats] = useState({ co2: 0, water: 0, energy: 0 })
  const [displayProgress, setDisplayProgress] = useState({ co2: 0, water: 0, energy: 0 })
  const statsRef = useRef({ co2: 0, water: 0, energy: 0 })

  // Calculate total baseline (convert CO2 from kg to lbs)
  const totalBaseline = APPLIANCE_DATA.reduce(
    (acc, app) => ({
      co2: acc.co2 + (app.baseline.co2 * KG_TO_LBS),
      water: acc.water + app.baseline.water,
      energy: acc.energy + app.baseline.energy
    }),
    { co2: 0, water: 0, energy: 0 }
  )

  // Calculate current savings (convert CO2 from kg to lbs)
  const calculateSavings = useCallback(() => {
    const savings = APPLIANCE_DATA.reduce(
      (acc, app) => {
        if (replacedAppliances.has(app.id)) {
          return {
            co2: acc.co2 + ((app.baseline.co2 - app.optimized.co2) * KG_TO_LBS),
            water: acc.water + (app.baseline.water - app.optimized.water),
            energy: acc.energy + (app.baseline.energy - app.optimized.energy)
          }
        }
        return acc
      },
      { co2: 0, water: 0, energy: 0 }
    )
    return savings
  }, [replacedAppliances])

  // Animate stats counter and progress bars
  useEffect(() => {
    const newStats = calculateSavings()
    statsRef.current = newStats

    // Calculate new progress values
    const newProgress = {
      co2: Math.min(100, Math.max(0, Math.round((newStats.co2 / GOAL.co2) * 100))),
      water: Math.min(100, Math.max(0, Math.round((newStats.water / GOAL.water) * 100))),
      energy: Math.min(100, Math.max(0, Math.round((newStats.energy / GOAL.energy) * 100)))
    }

    const duration = 600
    const steps = 60
    const stepTime = duration / steps

    const animate = (step) => {
      if (step > steps) {
        setDisplayStats(newStats)
        setDisplayProgress(newProgress)
        return
      }

      const progress = step / steps
      // Easing function for smoother animation
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setDisplayStats({
        co2: Math.round(newStats.co2 * easedProgress),
        water: Math.round(newStats.water * easedProgress),
        energy: Math.round(newStats.energy * easedProgress)
      })

      setDisplayProgress({
        co2: Math.round(newProgress.co2 * easedProgress),
        water: Math.round(newProgress.water * easedProgress),
        energy: Math.round(newProgress.energy * easedProgress)
      })

      setTimeout(() => animate(step + 1), stepTime)
    }

    animate(0)
  }, [calculateSavings])

  // Handle drag start
  const handleDragStart = (e, applianceId) => {
    setDraggedItem(applianceId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', applianceId)
  }

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Handle drop
  const handleDrop = (e, targetApplianceId) => {
    e.preventDefault()

    const draggedId = draggedItem || e.dataTransfer.getData('text/plain')

    if (!draggedId || draggedId !== targetApplianceId) {
      setDraggedItem(null)
      return
    }

    // Check if already replaced
    if (replacedAppliances.has(targetApplianceId)) {
      setDraggedItem(null)
      return
    }

    // Replace the appliance
    setReplacedAppliances(prev => new Set([...prev, targetApplianceId]))
    setDraggedItem(null)
  }

  // Handle click/tap for mobile fallback
  const handleApplianceClick = (applianceId) => {
    // Find matching tool
    const matchingTool = availableTools.find(app => app.id === applianceId)
    if (matchingTool && !replacedAppliances.has(applianceId)) {
      setReplacedAppliances(prev => new Set([...prev, applianceId]))
    }
  }

  // Handle drag end (snap back if invalid drop)
  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  // Calculate percentages
  const percentages = {
    co2: totalBaseline.co2 > 0 ? Math.round((displayStats.co2 / totalBaseline.co2) * 100) : 0,
    water: totalBaseline.water > 0 ? Math.round((displayStats.water / totalBaseline.water) * 100) : 0,
    energy: totalBaseline.energy > 0 ? Math.round((displayStats.energy / totalBaseline.energy) * 100) : 0
  }

  // Use animated progress values
  const goalProgress = displayProgress

  // Get available tools (not yet replaced)
  const availableTools = APPLIANCE_DATA.filter(app => !replacedAppliances.has(app.id))

  return (
    <div className="simulator-container">
      {/* Main Content Area */}
      <div className="simulator-main">
        {/* Goal Panel - Sticky Sidebar */}
        <div className="goal-panel-sidebar">
          <h3>Goal:</h3>
          <div className="goal-items">
            <div className="goal-item">
              <span>Reduce {GOAL.co2.toLocaleString()} lbs CO₂</span>
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, goalProgress.co2))}%` }}
                  role="progressbar"
                  aria-valuenow={goalProgress.co2}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${goalProgress.co2}% of CO₂ reduction goal achieved`}
                />
              </div>
              <span className="goal-percentage">{goalProgress.co2}%</span>
            </div>
            <div className="goal-item">
              <span>Save {GOAL.water.toLocaleString()} gal water</span>
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, goalProgress.water))}%` }}
                  role="progressbar"
                  aria-valuenow={goalProgress.water}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${goalProgress.water}% of water savings goal achieved`}
                />
              </div>
              <span className="goal-percentage">{goalProgress.water}%</span>
            </div>
            <div className="goal-item">
              <span>Conserve {GOAL.energy.toLocaleString()} kWh</span>
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, goalProgress.energy))}%` }}
                  role="progressbar"
                  aria-valuenow={goalProgress.energy}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${goalProgress.energy}% of energy conservation goal achieved`}
                />
              </div>
              <span className="goal-percentage">{goalProgress.energy}%</span>
            </div>
          </div>

          {/* Stats Section in Sidebar */}
          <div className="sidebar-stats">
            <h3>Your Impact:</h3>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">CO₂ Emissions Reduced:</span>
              <span className="sidebar-stat-value">
                {Math.round(displayStats.co2).toLocaleString()} lbs/year
              </span>
              <span className="sidebar-stat-percentage">({percentages.co2}% improvement)</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Water Saved Annually:</span>
              <span className="sidebar-stat-value">
                {displayStats.water.toLocaleString()} gal/year
              </span>
              <span className="sidebar-stat-percentage">({percentages.water}% improvement)</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Energy Conserved:</span>
              <span className="sidebar-stat-value">
                {displayStats.energy.toLocaleString()} kWh/year
              </span>
              <span className="sidebar-stat-percentage">({percentages.energy}% improvement)</span>
            </div>
          </div>
        </div>
        {/* House and Tools Section */}
        <div className="house-tools-wrapper">
          {/* House Section */}
          <div className="house-section">
          <h3>Your Home</h3>
          <div className="house-layout">
            {/* Kitchen */}
            <div className="room kitchen">
              <div className="room-label">Kitchen</div>
              {APPLIANCE_DATA.filter(app => app.room === 'kitchen').map(app => (
                <div
                  key={app.id}
                  className={`appliance-slot ${replacedAppliances.has(app.id) ? 'replaced' : ''} ${hoveredAppliance === app.id ? 'hovered' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, app.id)}
                  onClick={() => handleApplianceClick(app.id)}
                  onMouseEnter={() => setHoveredAppliance(app.id)}
                  onMouseLeave={() => setHoveredAppliance(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${app.name} slot. ${replacedAppliances.has(app.id) ? 'Upgraded to ' + app.optimizedName : 'Click to upgrade'}`}
                >
                  <div className="appliance-icon">
                    {replacedAppliances.has(app.id) ? app.optimizedIcon : app.icon}
                  </div>
                  <div className="appliance-name">
                    {replacedAppliances.has(app.id) ? app.optimizedName : app.name}
                  </div>
                  {hoveredAppliance === app.id && !replacedAppliances.has(app.id) && (
                    <div className="tooltip">
                      <div><strong>{app.name}</strong></div>
                      <div>CO₂: {Math.round(app.baseline.co2 * KG_TO_LBS)} lbs/year</div>
                      <div>Water: {app.baseline.water} gal/year</div>
                      <div>Energy: {app.baseline.energy} kWh/year</div>
                    </div>
                  )}
                </div>
              ))}
              {DECORATIVE_ITEMS.filter(item => item.room === 'kitchen').map(item => (
                <div key={item.id} className="decorative-item" aria-label={item.name}>
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Bathroom */}
            <div className="room bathroom">
              <div className="room-label">Bathroom</div>
              {APPLIANCE_DATA.filter(app => app.room === 'bathroom').map(app => (
                <div
                  key={app.id}
                  className={`appliance-slot ${replacedAppliances.has(app.id) ? 'replaced' : ''} ${hoveredAppliance === app.id ? 'hovered' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, app.id)}
                  onClick={() => handleApplianceClick(app.id)}
                  onMouseEnter={() => setHoveredAppliance(app.id)}
                  onMouseLeave={() => setHoveredAppliance(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${app.name} slot. ${replacedAppliances.has(app.id) ? 'Upgraded to ' + app.optimizedName : 'Click to upgrade'}`}
                >
                  <div className="appliance-icon">
                    {replacedAppliances.has(app.id) ? app.optimizedIcon : app.icon}
                  </div>
                  <div className="appliance-name">
                    {replacedAppliances.has(app.id) ? app.optimizedName : app.name}
                  </div>
                  {hoveredAppliance === app.id && !replacedAppliances.has(app.id) && (
                    <div className="tooltip">
                      <div><strong>{app.name}</strong></div>
                      <div>CO₂: {Math.round(app.baseline.co2 * KG_TO_LBS)} lbs/year</div>
                      <div>Water: {app.baseline.water} gal/year</div>
                      <div>Energy: {app.baseline.energy} kWh/year</div>
                    </div>
                  )}
                </div>
              ))}
              {DECORATIVE_ITEMS.filter(item => item.room === 'bathroom').map(item => (
                <div key={item.id} className="decorative-item" aria-label={item.name}>
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Living Room */}
            <div className="room living">
              <div className="room-label">Living Room</div>
              {APPLIANCE_DATA.filter(app => app.room === 'living').map(app => (
                <div
                  key={app.id}
                  className={`appliance-slot ${replacedAppliances.has(app.id) ? 'replaced' : ''} ${hoveredAppliance === app.id ? 'hovered' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, app.id)}
                  onClick={() => handleApplianceClick(app.id)}
                  onMouseEnter={() => setHoveredAppliance(app.id)}
                  onMouseLeave={() => setHoveredAppliance(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${app.name} slot. ${replacedAppliances.has(app.id) ? 'Upgraded to ' + app.optimizedName : 'Click to upgrade'}`}
                >
                  <div className="appliance-icon">
                    {replacedAppliances.has(app.id) ? app.optimizedIcon : app.icon}
                  </div>
                  <div className="appliance-name">
                    {replacedAppliances.has(app.id) ? app.optimizedName : app.name}
                  </div>
                  {hoveredAppliance === app.id && !replacedAppliances.has(app.id) && (
                    <div className="tooltip">
                      <div><strong>{app.name}</strong></div>
                      <div>CO₂: {Math.round(app.baseline.co2 * KG_TO_LBS)} lbs/year</div>
                      <div>Water: {app.baseline.water} gal/year</div>
                      <div>Energy: {app.baseline.energy} kWh/year</div>
                    </div>
                  )}
                </div>
              ))}
              {DECORATIVE_ITEMS.filter(item => item.room === 'living').map(item => (
                <div key={item.id} className="decorative-item" aria-label={item.name}>
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Bedroom */}
            <div className="room bedroom">
              <div className="room-label">Bedroom</div>
              {APPLIANCE_DATA.filter(app => app.room === 'bedroom').map(app => (
                <div
                  key={app.id}
                  className={`appliance-slot ${replacedAppliances.has(app.id) ? 'replaced' : ''} ${hoveredAppliance === app.id ? 'hovered' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, app.id)}
                  onClick={() => handleApplianceClick(app.id)}
                  onMouseEnter={() => setHoveredAppliance(app.id)}
                  onMouseLeave={() => setHoveredAppliance(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${app.name} slot. ${replacedAppliances.has(app.id) ? 'Upgraded to ' + app.optimizedName : 'Click to upgrade'}`}
                >
                  <div className="appliance-icon">
                    {replacedAppliances.has(app.id) ? app.optimizedIcon : app.icon}
                  </div>
                  <div className="appliance-name">
                    {replacedAppliances.has(app.id) ? app.optimizedName : app.name}
                  </div>
                  {hoveredAppliance === app.id && !replacedAppliances.has(app.id) && (
                    <div className="tooltip">
                      <div><strong>{app.name}</strong></div>
                      <div>CO₂: {Math.round(app.baseline.co2 * KG_TO_LBS)} lbs/year</div>
                      <div>Water: {app.baseline.water} gal/year</div>
                      <div>Energy: {app.baseline.energy} kWh/year</div>
                    </div>
                  )}
                </div>
              ))}
              {DECORATIVE_ITEMS.filter(item => item.room === 'bedroom').map(item => (
                <div key={item.id} className="decorative-item" aria-label={item.name}>
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Laundry */}
            <div className="room laundry">
              <div className="room-label">Laundry</div>
              {APPLIANCE_DATA.filter(app => app.room === 'laundry').map(app => (
                <div
                  key={app.id}
                  className={`appliance-slot ${replacedAppliances.has(app.id) ? 'replaced' : ''} ${hoveredAppliance === app.id ? 'hovered' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, app.id)}
                  onClick={() => handleApplianceClick(app.id)}
                  onMouseEnter={() => setHoveredAppliance(app.id)}
                  onMouseLeave={() => setHoveredAppliance(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${app.name} slot. ${replacedAppliances.has(app.id) ? 'Upgraded to ' + app.optimizedName : 'Click to upgrade'}`}
                >
                  <div className="appliance-icon">
                    {replacedAppliances.has(app.id) ? app.optimizedIcon : app.icon}
                  </div>
                  <div className="appliance-name">
                    {replacedAppliances.has(app.id) ? app.optimizedName : app.name}
                  </div>
                  {hoveredAppliance === app.id && !replacedAppliances.has(app.id) && (
                    <div className="tooltip">
                      <div><strong>{app.name}</strong></div>
                      <div>CO₂: {Math.round(app.baseline.co2 * KG_TO_LBS)} lbs/year</div>
                      <div>Water: {app.baseline.water} gal/year</div>
                      <div>Energy: {app.baseline.energy} kWh/year</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Upgrade Bank */}
          <div className="upgrade-bank">
            <h3>Upgrade Tools</h3>
            <p className="bank-instruction">Drag tools onto matching appliances to upgrade them</p>
            <div className="tools-grid">
              {availableTools.map(app => (
                <div
                  key={app.id}
                  className={`tool-item ${hoveredTool === app.id ? 'hovered' : ''} ${draggedItem === app.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={() => setHoveredTool(app.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Upgrade tool: ${app.optimizedName}`}
                >
                  <div className="tool-icon">{app.optimizedIcon}</div>
                  <div className="tool-name">{app.optimizedName}</div>
                <div className="tool-savings">
                  <div>Save {Math.round((app.baseline.co2 - app.optimized.co2) * KG_TO_LBS)} lbs CO₂</div>
                  <div>Save {app.baseline.water - app.optimized.water} gal water</div>
                  <div>Save {app.baseline.energy - app.optimized.energy} kWh</div>
                </div>
                </div>
              ))}
            </div>
            {availableTools.length === 0 && (
              <div className="all-upgraded">
                <p>🎉 All appliances upgraded!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SustainableHomeSimulator

