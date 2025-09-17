import { For, Show, createSignal, createMemo, onMount } from 'solid-js'
import { Card, Col, Row } from 'solid-bootstrap'

type JsonFile = {
  filename: string
  url: string
}

type WebformData = {
  CustomerName: string
  RepoSlug: string
  RepoNumberOfCommits: number
  NumberOfFieldsTotal: number
}

type ChartData = {
  name: string
  commits: number
  fields: number
}

type Props = {
  jsonFiles: JsonFile[]
}

export default function ReportsTab(props: Props) {
  const [webformData, setWebformData] = createSignal<Map<string, WebformData>>(new Map())
  const [loading, setLoading] = createSignal(true)

  // Load webform data for each file
  const loadWebformData = async () => {
    const dataMap = new Map<string, WebformData>()

    for (const file of props.jsonFiles) {
      try {
        const response = await fetch(file.url)
        if (response.ok) {
          const data = await response.json()
          dataMap.set(file.filename, data)
        }
      } catch (error) {
        console.warn(`Failed to load data for ${file.filename}:`, error)
      }
    }

    setWebformData(dataMap)
    setLoading(false)
  }

  onMount(() => {
    loadWebformData()
  })

  const chartData = createMemo(() => {
    const data = webformData()
    return props.jsonFiles.map(file => {
      const webform = data.get(file.filename)
      return {
        name: webform?.RepoSlug || file.filename.replace('.json', ''),
        commits: webform?.RepoNumberOfCommits || 0,
        fields: webform?.NumberOfFieldsTotal || 0
      }
    }).filter(item => item.commits > 0 || item.fields > 0)
  })

  const maxCommits = createMemo(() => {
    const data = chartData()
    return Math.max(...data.map(d => d.commits), 1)
  })

  const maxFields = createMemo(() => {
    const data = chartData()
    return Math.max(...data.map(d => d.fields), 1)
  })

  const getBarWidth = (value: number, max: number) => {
    return (value / max) * 100
  }

  return (
    <div class="reports-container">
      <Row class="justify-content-center">
        <Col xl={10} lg={11}>
          <Card class="glass-card border-0 shadow-lg">
            <Card.Body class="p-4">
              <div class="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between mb-4">
                <div>
                  <span class="badge-soft">Reports</span>
                  <h2 class="h4 mt-2 mb-1">Webform Analytics</h2>
                  <p class="text-subtle mb-0">Repository commits and field counts across all webforms</p>
                </div>
              </div>

              <Show when={!loading()} fallback={
                <div class="text-center py-5">
                  <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading charts...</span>
                  </div>
                  <p class="mt-3 text-subtle">Loading report data...</p>
                </div>
              }>
                <Show when={chartData().length > 0} fallback={
                  <div class="text-center py-5 text-subtle">
                    No chart data available
                  </div>
                }>
                  <div class="chart-container">
                    <h3 class="h5 mb-4">Repository Commits vs Total Fields</h3>

                    <div class="chart-wrapper">
                      <For each={chartData()}>
                        {(item) => (
                          <div class="chart-row mb-4">
                            <div class="row align-items-center">
                              <div class="col-lg-3 col-md-4 mb-2 mb-md-0">
                                <div class="chart-label text-truncate" title={item.name}>
                                  {item.name}
                                </div>
                              </div>
                              <div class="col-lg-9 col-md-8">
                                <div class="chart-bars">
                                  <div class="bar-group mb-3">
                                    <div class="bar-label d-flex justify-content-between align-items-center mb-1">
                                      <span class="small text-subtle">Repository Commits</span>
                                      <span class="badge bg-info text-dark fw-semibold">{item.commits}</span>
                                    </div>
                                    <div class="bar-container">
                                      <div
                                        class="bar bar-commits"
                                        style={`width: ${getBarWidth(item.commits, maxCommits())}%`}
                                      ></div>
                                    </div>
                                  </div>

                                  <div class="bar-group">
                                    <div class="bar-label d-flex justify-content-between align-items-center mb-1">
                                      <span class="small text-subtle">Total Fields</span>
                                      <span class="badge bg-success fw-semibold">{item.fields}</span>
                                    </div>
                                    <div class="bar-container">
                                      <div
                                        class="bar bar-fields"
                                        style={`width: ${getBarWidth(item.fields, maxFields())}%`}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>

                    <div class="chart-legend mt-4 pt-3" style="border-top: 1px solid rgba(148, 163, 184, 0.18);">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="d-flex align-items-center gap-2">
                            <div class="legend-color bar-commits" style="width: 16px; height: 16px; border-radius: 2px;"></div>
                            <span class="small text-subtle">Repository Commits</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="d-flex align-items-center gap-2">
                            <div class="legend-color bar-fields" style="width: 16px; height: 16px; border-radius: 2px;"></div>
                            <span class="small text-subtle">Total Fields</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Show>
              </Show>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}