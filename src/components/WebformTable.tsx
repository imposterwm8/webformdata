import { For, Show, createSignal, createMemo } from 'solid-js'
import { Badge, Button, Table } from 'solid-bootstrap'

type JsonFile = {
  filename: string
  url: string
}

type WebformData = {
  CustomerName: string
  RepoSlug: string
  NumberOfCards: number
  NumberOfFieldsTotal: number
  includesUserData: boolean
  includesCustomData: boolean
  includesIssueData: boolean
  totalNumberOfTextFields: number
  totalNumberOfNumberFields: number
  totalNumberOfDateFields: number
  totalNumberOfCheckboxFields: number
  totalNumberOfRadioFields: number
  totalNumberOfDropdownFields: number
  totalNumberOfFileFields: number
  totalNumberOfTextareaFields: number
}

type WebformItem = JsonFile & {
  data?: WebformData
}

type SortConfig = {
  key: keyof WebformData | 'filename'
  direction: 'asc' | 'desc'
}

type Props = {
  jsonFiles: JsonFile[]
}

export default function WebformTable(props: Props) {
  const [sortConfig, setSortConfig] = createSignal<SortConfig>({ key: 'filename', direction: 'asc' })
  const [webformData, setWebformData] = createSignal<Map<string, WebformData>>(new Map())

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
  }

  // Load data on component mount
  loadWebformData()

  const webformItems = createMemo(() => {
    const data = webformData()
    return props.jsonFiles.map(file => ({
      ...file,
      data: data.get(file.filename)
    }))
  })

  const sortedItems = createMemo(() => {
    const items = webformItems()
    const config = sortConfig()

    return [...items].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (config.key === 'filename') {
        aValue = a.filename
        bValue = b.filename
      } else {
        aValue = a.data?.[config.key] ?? ''
        bValue = b.data?.[config.key] ?? ''
      }

      if (aValue < bValue) {
        return config.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return config.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  })

  const handleSort = (key: keyof WebformData | 'filename') => {
    const current = sortConfig()
    if (current.key === key) {
      setSortConfig({ key, direction: current.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      setSortConfig({ key, direction: 'asc' })
    }
  }

  const getSortIcon = (key: keyof WebformData | 'filename') => {
    const config = sortConfig()
    if (config.key !== key) return '↕️'
    return config.direction === 'asc' ? '↑' : '↓'
  }

  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return '—'
    return value ? '✓' : '✗'
  }

  return (
    <div class="table-responsive">
      <Table variant="dark" striped hover class="mb-0">
        <thead>
          <tr>
            <th
              scope="col"
              style="cursor: pointer; user-select: none;"
              onClick={() => handleSort('filename')}
            >
              Name {getSortIcon('filename')}
            </th>
            <th
              scope="col"
              style="cursor: pointer; user-select: none;"
              onClick={() => handleSort('CustomerName')}
            >
              Customer {getSortIcon('CustomerName')}
            </th>
            <th
              scope="col"
              style="cursor: pointer; user-select: none;"
              onClick={() => handleSort('NumberOfCards')}
            >
              Cards {getSortIcon('NumberOfCards')}
            </th>
            <th
              scope="col"
              style="cursor: pointer; user-select: none;"
              onClick={() => handleSort('NumberOfFieldsTotal')}
            >
              Total Fields {getSortIcon('NumberOfFieldsTotal')}
            </th>
            <th scope="col">Data Types</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedItems()}>
            {(item) => (
              <tr>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-truncate" style="max-width: 200px;" title={item.filename}>
                      {item.filename}
                    </span>
                    <Badge bg="info" pill class="text-dark fw-semibold text-uppercase">
                      JSON
                    </Badge>
                  </div>
                </td>
                <td>
                  <Show when={item.data?.CustomerName} fallback="—">
                    {item.data!.CustomerName}
                  </Show>
                </td>
                <td>
                  <Show when={item.data?.NumberOfCards !== undefined} fallback="—">
                    {item.data!.NumberOfCards}
                  </Show>
                </td>
                <td>
                  <Show when={item.data?.NumberOfFieldsTotal !== undefined} fallback="—">
                    {item.data!.NumberOfFieldsTotal}
                  </Show>
                </td>
                <td>
                  <Show when={item.data} fallback="—">
                    <div class="d-flex flex-wrap gap-1">
                      <Show when={item.data!.includesUserData}>
                        <Badge bg="success" class="small">User</Badge>
                      </Show>
                      <Show when={item.data!.includesCustomData}>
                        <Badge bg="warning" class="small">Custom</Badge>
                      </Show>
                      <Show when={item.data!.includesIssueData}>
                        <Badge bg="primary" class="small">Issue</Badge>
                      </Show>
                    </div>
                  </Show>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      as="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      class="text-decoration-none"
                    >
                      View JSON
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      as="a"
                      href={`/webform-details.html?file=${encodeURIComponent(item.filename)}`}
                      target="_blank"
                      rel="noopener"
                      class="text-decoration-none"
                    >
                      View Details
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </Table>

      <Show when={!sortedItems().length}>
        <div class="text-center py-4 text-subtle">
          No webform data found.
        </div>
      </Show>
    </div>
  )
}