import { Show, createSignal, onMount } from 'solid-js'
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Row,
} from 'solid-bootstrap'
import './App.css'
import WebformTable from './components/WebformTable'
import ReportsTab from './components/ReportsTab'
import NeverGonnaGiveYouUp from './components/NeverGonnaGiveYouUp'

type JsonFile = {
  filename: string
  url: string
}

const jsonModules = import.meta.glob('../public/data/*.json', { eager: true })
const jsonFiles: JsonFile[] = Object.keys(jsonModules)
  .map((path) => {
    const segments = path.split('/')
    const filename = segments[segments.length - 1]

    return {
      filename,
      url: `/data/${filename}`,
    }
  })
  .sort((a, b) => a.filename.localeCompare(b.filename))

function App() {
  const [activeTab, setActiveTab] = createSignal('overview')
  const [currentTheme, setCurrentTheme] = createSignal('custom') // 'dark', 'light', 'custom', 'midnight', 'sage', 'retro'
  const [currentRoute, setCurrentRoute] = createSignal('main')

  // Apply theme class to document body
  onMount(() => {
    updateTheme()
  })

  const updateTheme = () => {
    const body = document.body
    // Remove all theme classes
    body.classList.remove('dark-mode', 'light-mode', 'custom-mode', 'midnight-mode', 'sage-mode', 'retro-mode')

    // Add current theme class
    body.classList.add(`${currentTheme()}-mode`)
  }

  const selectTheme = (theme: string) => {
    if (theme === 'never') {
      setCurrentRoute('rickroll')
      return
    }
    setCurrentTheme(theme)
    updateTheme()
  }



  // Simple routing logic
  const renderCurrentRoute = () => {
    switch (currentRoute()) {
      case 'rickroll':
        return <NeverGonnaGiveYouUp />
      case 'main':
      default:
        return renderMainApp()
    }
  }

  const renderMainApp = () => (
    <>
      <Navbar expand="lg" variant="dark" class="landing-navbar py-3" sticky="top">
        <Container>
          <Navbar.Brand class="fw-semibold text-glow">Issuetrak Webforms Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav class="ms-auto align-items-lg-center gap-lg-3">
              <Nav.Link
                href="#overview"
                class="nav-link-muted"
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Nav.Link>
              <Nav.Link
                href="#webforms"
                class="nav-link-muted"
                onClick={() => setActiveTab('webforms')}
              >
                Webforms
              </Nav.Link>
              <Nav.Link
                href="#reports"
                class="nav-link-muted"
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </Nav.Link>
              <Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="ghost"
                    class="theme-menu-btn p-2"
                    id="theme-dropdown"
                  >
                    <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
                      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
                      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </Dropdown.Toggle>
                  <Dropdown.Menu class="theme-dropdown-menu">
                    <Dropdown.Header>Select Theme</Dropdown.Header>
                    <Dropdown.Item
                      onClick={() => selectTheme('dark')}
                      class={currentTheme() === 'dark' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">🌙</span>
                        <span class="theme-name">Dark Mode</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('light')}
                      class={currentTheme() === 'light' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">☀️</span>
                        <span class="theme-name">Light Mode</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('custom')}
                      class={currentTheme() === 'custom' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">🌊</span>
                        <span class="theme-name">Ocean Mode</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('midnight')}
                      class={currentTheme() === 'midnight' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">🌌</span>
                        <span class="theme-name">Midnight Mode</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('sage')}
                      class={currentTheme() === 'sage' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">🌿</span>
                        <span class="theme-name">Sage Garden</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('retro')}
                      class={currentTheme() === 'retro' ? 'active' : ''}
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">📼</span>
                        <span class="theme-name retro-text">Radical Eighties</span>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => selectTheme('never')}
                      class="never-mode-item"
                    >
                      <span class="theme-option">
                        <span class="theme-emoji">🎤</span>
                        <span class="theme-name">Never Mode</span>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid="lg" class="flex-grow-1 py-5">
        <Show when={activeTab() === 'overview'}>
          <Row class="justify-content-center">
            <Col xl={9} lg={10} md={11}>
              <Card class="glass-card landing-card shadow-lg border-0">
                <Card.Body class="p-4">
                  <div class="text-center">
                    <span class="badge-soft">Dashboard Overview</span>
                    <h1 class="h3 mt-3 mb-3">Webforms Management System</h1>
                    <p class="text-subtle mb-4">
                      Comprehensive dashboard for managing and analyzing Issuetrak webforms
                    </p>
                  </div>

                  <Row class="g-4 mt-2">
                    <Col md={4}>
                      <div class="stat-card p-3 text-center">
                        <div class="feature-icon mx-auto mb-3">📊</div>
                        <h3 class="h5 mb-2">Total Webforms</h3>
                        <div class="fs-4 fw-bold text-info">{jsonFiles.length}</div>
                        <p class="text-subtle small mb-0">Active configurations</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div
                        class="stat-card p-4 text-center clickable-card"
                        onClick={() => setActiveTab('webforms')}
                        style="cursor: pointer;"
                      >
                        <svg class="card-icon mx-auto mb-3" width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                          <rect x="12" y="16" width="20" height="2" fill="currentColor"/>
                          <rect x="12" y="22" width="32" height="2" fill="currentColor"/>
                          <rect x="12" y="28" width="24" height="2" fill="currentColor"/>
                          <rect x="12" y="36" width="16" height="2" fill="currentColor"/>
                          <rect x="32" y="36" width="12" height="2" fill="currentColor"/>
                          <rect x="12" y="42" width="20" height="2" fill="currentColor"/>
                          <circle cx="14" cy="48" r="2" fill="currentColor"/>
                          <circle cx="22" cy="48" r="2" fill="currentColor"/>
                          <rect x="28" y="46" width="16" height="4" rx="2" fill="currentColor"/>
                        </svg>
                        <h3 class="h5 mb-2">Browse Forms</h3>
                        <p class="text-subtle small mb-0">Click to view webforms</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div
                        class="stat-card p-4 text-center clickable-card"
                        onClick={() => setActiveTab('reports')}
                        style="cursor: pointer;"
                      >
                        <svg class="card-icon mx-auto mb-3" width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="48" width="6" height="8" fill="currentColor" rx="1"/>
                          <rect x="18" y="36" width="6" height="20" fill="currentColor" rx="1"/>
                          <rect x="28" y="24" width="6" height="32" fill="currentColor" rx="1"/>
                          <rect x="38" y="32" width="6" height="24" fill="currentColor" rx="1"/>
                          <rect x="48" y="16" width="6" height="40" fill="currentColor" rx="1"/>
                          <line x1="6" y1="58" x2="58" y2="58" stroke="currentColor" stroke-width="2"/>
                          <line x1="6" y1="8" x2="6" y2="58" stroke="currentColor" stroke-width="2"/>
                          <circle cx="11" cy="45" r="2" fill="currentColor"/>
                          <circle cx="21" cy="33" r="2" fill="currentColor"/>
                          <circle cx="31" cy="21" r="2" fill="currentColor"/>
                          <circle cx="41" cy="29" r="2" fill="currentColor"/>
                          <circle cx="51" cy="13" r="2" fill="currentColor"/>
                          <path d="M11 45 L21 33 L31 21 L41 29 L51 13" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <h3 class="h5 mb-2">Analytics</h3>
                        <p class="text-subtle small mb-0">Click to view reports</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Show>

        <Show when={activeTab() === 'webforms'}>
          <Row class="justify-content-center">
            <Col xl={9} lg={10} md={11}>
              <Card class="glass-card landing-card shadow-lg border-0">
                <Card.Body class="d-flex flex-column flex-lg-row gap-4 align-items-lg-center justify-content-between">
                  <div class="d-flex flex-column gap-3 align-self-stretch">
                    <span class="badge-soft align-self-start">Webforms</span>
                    <div class="text-subtle d-flex align-items-center gap-2 small">
                      <span class="dot" aria-hidden="true"></span>
                      <span>{jsonFiles.length} JSON files available</span>
                    </div>
                  </div>
                  <Form class="search-area w-100 w-lg-auto">
                    <InputGroup size="lg" class="search-group">
                      <Form.Control
                        type="search"
                        placeholder="Search by title or customer"
                        disabled
                      />
                      <Button variant="info" disabled class="fw-semibold">
                        Search
                      </Button>
                    </InputGroup>
                    <Form.Text class="text-subtle d-block mt-2 small">
                      Search functionality is on the roadmap.
                    </Form.Text>
                  </Form>
                </Card.Body>
                <WebformTable jsonFiles={jsonFiles} />
                <Card.Body class="d-flex justify-content-between flex-wrap gap-3 align-items-center">
                  <span class="text-subtle">More attributes coming soon as schema evolves.</span>
                  <Button variant="link" class="text-info fw-semibold text-decoration-none px-0">
                    View all webforms
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Show>

        <Show when={activeTab() === 'reports'}>
          <ReportsTab jsonFiles={jsonFiles} />
        </Show>
      </Container>

      <Container class="pt-4">
        <p class="footer-note text-center mb-0">Prototype UI - real data integrations coming soon.</p>
      </Container>
    </>
  )

  return (
    <div class="landing-page">
      {renderCurrentRoute()}
    </div>
  )
}

export default App
