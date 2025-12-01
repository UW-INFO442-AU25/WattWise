# WattWise
Group 1: WattWise

Mia McDunnah, Anushka Verma, Awo Mah, Ethan Kwan, Eric Chou

## Overview
How might we empower Washington homeowners to better understand and act on the financial savings and environmental benefits of optimizing their utility usage? 


Homeowners in Washington often lack awareness of how everyday utility behaviors—like leaving appliances plugged in, running inefficient lightbulbs, and misjudging the energy cost of activities such as dishwashing and lighting—drive both higher bills and unnecessary emissions. Research shows people consistently underestimate energy use and potential savings by about threefold (Attari et al., 2010), which skews perceptions toward "inconvenient" actions rather than simple efficiency upgrades. The project centers on SDG 12, "Responsible Consumption and Production," and aims to educate residents on practical, low-friction changes (e.g., switching to power‑saving bulbs, unplugging idle devices) that optimize electricity and water usage, reduce environmental impact, and deliver tangible financial benefits.

## Features
### Core functionality
- Interactive energy efficiency quiz that assesses user's home energy usage patterns
- Personalized recommendations with estimated annual savings
- Actionable checklist with progress tracking (Not Started, In Progress, Complete)
- User authentication (email/password and Google sign-in)
- Profile page with saved quiz results and checklist progress
- Educational content about energy efficiency for Washington residents:
  - Home page with information for renters and homeowners
  - About page with team information
  - Impact page showcasing environmental impact information
- Responsive design for mobile and desktop

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher) and npm installed
- Firebase account and project configured

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WattWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - The Firebase configuration is already set up in `src/firebase.js`
   - Ensure your Firebase project has Authentication and Firestore enabled:
     - Authentication: Enable Email/Password and Google Sign-In providers
     - Firestore: Create a database in production mode or test mode
   - If you need to use a different Firebase project, update the `firebaseConfig` object in `src/firebase.js`

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port shown in the terminal)

5. **Build for production**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist` folder.

6. **Deploy to Firebase Hosting**
   ```bash
   npm run deploy
   ```
   This builds the project and deploys it to Firebase Hosting.

### Project Structure

```
WattWise/
├── src/
│   ├── components/       # React components (Quiz, Checklist, Navbar, etc.)
│   ├── contexts/         # React contexts (AuthContext)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (Home, About, Impact, Quiz, etc.)
│   ├── services/         # Service modules (userService)
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── firebase.js       # Firebase configuration
├── public/               # Static assets (images, favicon)
├── dist/                 # Production build output
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## User Personas

### Persona 1: Aja Wilson - First-Time Homeowner
**Demographics:**
- Age: 32
- Location: Bellevue, Washington
- Occupation: Software Engineer
- Household: Lives with partner, no children
- Income: $95,000/year

**Background:**
Aja and her partner recently purchased their first home—a 1,200 sq ft townhouse built in 1995. Coming from a rental where utilities were included, Aja is now facing her first utility bills and is surprised by how high they are. She's environmentally conscious and wants to reduce both her carbon footprint and monthly expenses, but she's overwhelmed by the amount of information available online and doesn't know where to start.

**Goals:**
- Understand which energy-saving actions will have the biggest impact
- Get personalized recommendations based on her specific home and lifestyle
- Track progress on energy efficiency improvements
- Save money on utility bills without major renovations

**Pain Points:**
- Doesn't know which appliances or habits are consuming the most energy
- Feels paralyzed by too many generic energy-saving tips
- Wants actionable, prioritized recommendations
- Needs to see potential savings to justify time/money investments

**Technology Comfort:**
- Very comfortable with technology
- Uses smartphone and laptop daily
- Prefers web applications over mobile apps
- Expects clean, intuitive interfaces

**How WattWise Helps:**
Aja takes the quiz and discovers that her old incandescent bulbs and phantom energy from plugged-in devices are her biggest energy drains. The checklist helps her prioritize: first switching to LED bulbs (quick win), then installing smart power strips. She tracks her progress and sees her estimated annual savings increase as she completes items.

---

### Persona 2: Marcus Aldridge - Long-Term Renter Seeking Control
**Demographics:**
- Age: 45
- Location: Seattle, Washington
- Occupation: High School Teacher
- Household: Single, lives alone
- Income: $62,000/year

**Background:**
Marcus has been renting the same 800 sq ft apartment in a 1970s building for 8 years. His building doesn't have separate meters, so he pays a flat utility fee included in rent, but he suspects he's subsidizing neighbors who use more energy. He's frustrated by the lack of control and wants to understand how his daily habits affect energy consumption, even if he can't change the building's infrastructure.

**Goals:**
- Learn which personal habits have the most energy impact
- Feel empowered to make changes within his control
- Understand energy efficiency for when he eventually buys a home
- Reduce guilt about environmental impact

**Pain Points:**
- Can't control building infrastructure (heating system, insulation, windows)
- Feels powerless as a renter
- Wants to do his part but doesn't know what actually matters
- Limited budget for major purchases

**Technology Comfort:**
- Moderate comfort with technology
- Uses smartphone regularly, prefers simple interfaces
- Occasionally uses laptop for work
- Gets frustrated with complex or cluttered designs

**How WattWise Helps:**
Marcus takes the quiz and learns that his long showers and leaving electronics plugged in are his biggest controllable energy drains. Even though he can't change the building's heating system, the checklist shows him actionable items like installing a low-flow showerhead and using smart power strips. He feels empowered knowing he's making a difference within his constraints, and the knowledge prepares him for future homeownership.

---

## Testing Protocol

### Prerequisites
- Node.js and npm installed
- Firebase project configured with Authentication and Firestore enabled
- Development server running (`npm run dev`)
- Test browser (Chrome, Firefox, or Edge recommended)

### General Testing Setup
1. Clear browser cache and cookies before each test session
2. Use incognito/private browsing mode for clean state testing
3. Test on both desktop (1920x1080) and mobile (375x667) viewports
4. Check browser console for errors during testing

---

### Feature 1: User Authentication

#### Test 1.1: Email/Password Registration
**Steps:**
1. Navigate to `/register`
2. Enter a new email address (e.g., `test@example.com`)
3. Enter a password (minimum 6 characters)
4. Click "Register"

**Expected Result:**
- User is successfully registered
- Redirected to profile page or home page
- User is logged in automatically
- No error messages displayed

**Known Issues/Workarounds:**
- If email already exists, error message appears: "Email already in use" - This is expected behavior
- Password validation: Firebase requires minimum 6 characters - Ensure password meets requirement

#### Test 1.2: Email/Password Login
**Steps:**
1. Navigate to `/login`
2. Enter registered email and password
3. Click "Log In"

**Expected Result:**
- User successfully logs in
- Redirected appropriately
- User session persists on page refresh

**Known Issues/Workarounds:**
- If credentials are incorrect, error message appears - Verify email/password are correct
- Session may expire after extended inactivity - User will need to log in again

#### Test 1.3: Google Sign-In
**Steps:**
1. Navigate to `/login` or `/register`
2. Click "Sign in with Google"
3. Select Google account and authorize

**Expected Result:**
- User is authenticated via Google
- Redirected to appropriate page
- User profile shows Google account email

**Known Issues/Workarounds:**
- Pop-up blockers may prevent Google sign-in window - Allow pop-ups for the site
- If Google account email already exists with password auth, accounts may not merge automatically - Use the same authentication method consistently

#### Test 1.4: Sign Out
**Steps:**
1. While logged in, navigate to `/profile`
2. Click "Sign Out" button

**Expected Result:**
- User is logged out
- Redirected to home page or login page
- Protected routes are no longer accessible

---

### Feature 2: Energy Efficiency Quiz

#### Test 2.1: Quiz Navigation
**Steps:**
1. Navigate to `/quiz` (or click "Take Quiz" from home page)
2. Answer first question
3. Click "Next" button
4. Continue through all questions
5. Use "Back" button to return to previous questions

**Expected Result:**
- Progress bar updates correctly
- Questions advance in order
- Back button works (disabled on first question)
- All questions are accessible

**Known Issues/Workarounds:**
- Progress bar may not update immediately - Wait a moment or refresh
- If quiz is interrupted, answers are lost - Complete quiz in one session or answers will reset

#### Test 2.2: Quiz Completion (Logged Out User)
**Steps:**
1. Complete entire quiz while logged out
2. Click "See my savings opportunities" on final question
3. View results page

**Expected Result:**
- Results page displays personalized recommendations
- Recommendations are categorized (e.g., Lighting, Appliances, Water)
- Estimated savings are shown for each recommendation
- "Want to save your results and view checklist? Log in!" prompt appears

**Known Issues/Workarounds:**
- Results are not saved if user is not logged in - User must log in to save results
- If user navigates away, results are lost - User should log in before taking quiz to save results

#### Test 2.3: Quiz Completion (Logged In User)
**Steps:**
1. Log in to account
2. Complete entire quiz
3. Submit quiz
4. View results

**Expected Result:**
- Results are displayed with recommendations
- "Want to take action?" section appears with "View checklist!" button
- Results are automatically saved to user's profile
- User can access results later from profile page

**Known Issues/Workarounds:**
- If user already has saved results, modal appears asking to confirm retaking quiz - This is expected behavior to prevent accidental overwrites

#### Test 2.4: Retake Quiz Confirmation
**Steps:**
1. Log in with existing quiz results
2. Navigate to quiz page
3. Attempt to start quiz

**Expected Result:**
- Modal appears: "Retake Quiz?"
- Modal explains that new results will replace old ones
- User can choose "Cancel" or "Yes, Retake Quiz"

**Known Issues/Workarounds:**
- Modal can be closed by clicking outside - This is intentional for accessibility (Escape key also works)

---

### Feature 3: Quiz Results & Recommendations

#### Test 3.1: View Results
**Steps:**
1. Complete quiz (logged in)
2. View results page
3. Scroll through recommendations

**Expected Result:**
- Recommendations are displayed in categories
- Each recommendation shows estimated annual savings (e.g., "$150/yr")
- Recommendations are personalized based on quiz answers
- Results are visually organized and easy to read

**Known Issues/Workarounds:**
- Some recommendations may not show savings if calculation is not applicable - This is expected for certain recommendation types
- Savings estimates are approximations - Actual savings may vary

#### Test 3.2: Navigate to Checklist from Results
**Steps:**
1. On results page (logged in), click "View checklist!" button
2. Verify navigation

**Expected Result:**
- User is redirected to `/profile?view=checklist`
- Checklist view is automatically activated
- Checklist items are displayed based on quiz results

---

### Feature 4: Action Checklist

#### Test 4.1: View Checklist
**Steps:**
1. Log in and navigate to `/profile`
2. Click "Checklist" tab (or navigate from quiz results)

**Expected Result:**
- Checklist displays all recommendations as actionable items
- Items are categorized
- Progress indicator shows completion status
- Each item has status: "Not Started", "In Progress", or "Complete"

**Known Issues/Workarounds:**
- If no quiz results exist, checklist is empty - User must complete quiz first
- Checklist items are generated from quiz recommendations - If quiz results change, checklist updates

#### Test 4.2: Update Checklist Status
**Steps:**
1. View checklist
2. Click status button on any checklist item
3. Observe status cycling: Not Started → In Progress → Complete → Not Started

**Expected Result:**
- Status changes immediately
- Visual indicator updates (colors, icons)
- Progress bar updates
- Changes are saved to Firebase automatically

**Known Issues/Workarounds:**
- Status may not save if user navigates away too quickly - Wait 1-2 seconds after clicking
- If Firebase connection is lost, changes may not persist - Check internet connection and retry

#### Test 4.3: Checklist Progress Tracking
**Steps:**
1. Update multiple checklist items to different statuses
2. Observe progress indicator

**Expected Result:**
- Progress stats update correctly (Completed, In Progress, Not Started counts)
- Progress percentage is calculated accurately
- Progress bar visual updates

**Known Issues/Workarounds:**
- Progress calculation may lag slightly - Refresh page if numbers seem incorrect

#### Test 4.4: Checklist Persistence
**Steps:**
1. Update checklist statuses
2. Sign out
3. Sign back in
4. Navigate to checklist

**Expected Result:**
- All checklist statuses are preserved
- Progress is maintained across sessions

**Known Issues/Workarounds:**
- If data doesn't load, refresh page - Firebase may need a moment to sync

---

### Feature 5: User Profile

#### Test 5.1: View Profile
**Steps:**
1. Log in
2. Navigate to `/profile`
3. View profile information

**Expected Result:**
- User email is displayed
- Profile shows quiz results or checklist based on active tab
- Sign out button is visible

**Known Issues/Workarounds:**
- If user has no quiz results, appropriate message is shown - User must complete quiz first

#### Test 5.2: Toggle Between Results and Checklist
**Steps:**
1. On profile page, click "Quiz Results" tab
2. Click "Checklist" tab
3. Switch back and forth

**Expected Result:**
- Tabs switch smoothly
- Correct content is displayed for each tab
- Active tab is visually highlighted

**Known Issues/Workarounds:**
- URL parameter `?view=checklist` can be used to directly open checklist view - Useful for deep linking

---

### Feature 6: Navigation & Routing

#### Test 6.1: Navigation Bar
**Steps:**
1. Navigate through different pages using navbar
2. Test all links (Home, About, Impact, Quiz, Profile/Login)

**Expected Result:**
- All links navigate correctly
- Active page is indicated (if applicable)
- Mobile menu works on small screens

**Known Issues/Workarounds:**
- Mobile menu may not close automatically after navigation - Click menu button again to close
- Smooth scroll to sections may not work on all browsers - Use direct navigation if needed

#### Test 6.2: Protected Routes
**Steps:**
1. While logged out, attempt to navigate to `/profile`
2. Attempt to navigate to `/quiz/results` directly

**Expected Result:**
- User is redirected to login page or home page
- Protected content is not accessible without authentication

**Known Issues/Workarounds:**
- Some routes may allow viewing but not saving - This is expected behavior

---

### Feature 7: Responsive Design

#### Test 7.1: Mobile Viewport
**Steps:**
1. Open browser DevTools
2. Set viewport to mobile size (375x667 or similar)
3. Navigate through all pages
4. Test interactive elements

**Expected Result:**
- Content is readable and properly sized
- Buttons and links are easily tappable (minimum 44x44px)
- Navigation menu works (hamburger menu on mobile)
- Forms are usable
- No horizontal scrolling

**Known Issues/Workarounds:**
- Some images may load slowly on mobile - Ensure good internet connection
- Touch targets may feel small on very small screens - Zoom may be needed for some users

#### Test 7.2: Desktop Viewport
**Steps:**
1. Test on desktop viewport (1920x1080 or similar)
2. Verify layout and spacing

**Expected Result:**
- Content is well-spaced and not stretched
- All features are accessible
- Hover states work on interactive elements

---

### Feature 8: Accessibility

#### Test 8.1: Keyboard Navigation
**Steps:**
1. Use only keyboard (Tab, Enter, Arrow keys) to navigate
2. Test all interactive elements

**Expected Result:**
- All buttons and links are focusable
- Focus indicators are visible
- Tab order is logical
- Forms can be completed with keyboard only

**Known Issues/Workarounds:**
- Some decorative elements may be focusable - This is acceptable for screen reader users
- Modal can be closed with Escape key - This is intentional

#### Test 8.2: Screen Reader Compatibility
**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through pages
3. Listen to announcements

**Expected Result:**
- All content is announced
- Form labels are read correctly
- Buttons have descriptive labels
- Error messages are announced

**Known Issues/Workarounds:**
- Some decorative icons may be announced - This is minimal and doesn't affect functionality

---

### Feature 9: Error Handling

#### Test 9.1: Network Errors
**Steps:**
1. Disable internet connection
2. Attempt to save checklist status
3. Attempt to log in

**Expected Result:**
- Appropriate error messages are displayed
- User is informed of connection issues
- App doesn't crash

**Known Issues/Workarounds:**
- Some actions may fail silently - Check console for errors
- Re-enable connection and retry failed actions

#### Test 9.2: Invalid Form Input
**Steps:**
1. Attempt to register with invalid email format
2. Attempt to register with short password
3. Attempt to log in with wrong credentials

**Expected Result:**
- Clear error messages are displayed
- Forms don't submit with invalid data
- User can correct errors and retry

---

### Feature 10: Data Persistence

#### Test 10.1: Quiz Results Persistence
**Steps:**
1. Complete quiz while logged in
2. Sign out
3. Sign back in
4. Navigate to profile

**Expected Result:**
- Quiz results are still available
- Recommendations are displayed correctly

**Known Issues/Workarounds:**
- Results may take a moment to load - Wait for Firebase to sync

#### Test 10.2: Checklist Progress Persistence
**Steps:**
1. Update checklist statuses
2. Close browser
3. Reopen and log in
4. View checklist

**Expected Result:**
- All checklist progress is preserved

**Known Issues/Workarounds:**
- If progress doesn't appear, refresh page - Firebase sync may be delayed

---

### Browser Compatibility Testing

**Recommended Browsers:**
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest) - for macOS/iOS

**Known Issues:**
- Some CSS features may render differently in older browsers - Use modern browsers for best experience
- Firebase features require modern browser with JavaScript enabled

---

### Performance Testing

#### Test P.1: Page Load Times
**Steps:**
1. Open browser DevTools Network tab
2. Navigate to each page
3. Measure load times

**Expected Result:**
- Pages load within 2-3 seconds on average connection
- Images load progressively
- No blocking resources

**Known Issues/Workarounds:**
- First load may be slower due to Firebase initialization - Subsequent loads are faster
- Large images may take time - Consider image optimization for production

---

## Tech Stack

### Frontend Framework & Libraries
- **React** (v18.3.1) - UI library for building component-based interfaces
- **React Router DOM** (v7.9.6) - Client-side routing and navigation
- **React Hooks** - State management and lifecycle handling (useState, useEffect, useContext, custom hooks)

### Build Tools & Development
- **Vite** (v5.4.2) - Fast build tool and development server
- **@vitejs/plugin-react** - Vite plugin for React support
- **Node.js & npm** - Package management and development environment

### Backend & Database
- **Firebase** (v12.6.0)
  - **Firebase Authentication** - User authentication (email/password and Google Sign-In)
  - **Cloud Firestore** - NoSQL database for storing user profiles, quiz results, and checklist progress
  - **Firebase Hosting** - Static site hosting and deployment

### Styling
- **Custom CSS** - Tailored styling with CSS3 features (gradients, animations, responsive design)
- **CSS Modules** - Component-scoped styling
- **Responsive Design** - Mobile-first approach with media queries

### Languages & Standards
- **JavaScript (ES6+)** - Modern JavaScript with modules, arrow functions, async/await
- **JSX** - React's syntax extension for writing component markup
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox, grid, and custom properties

### Development Workflow
- **Git** - Version control
- **Firebase CLI** - Deployment and Firebase project management
- **ESLint/TypeScript types** - Code quality and type checking (via @types packages)

### Key Features Implemented
- Single Page Application (SPA) architecture
- Client-side routing with React Router
- Real-time data synchronization with Firestore
- Progressive Web App capabilities
- Responsive design for mobile and desktop
