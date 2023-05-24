import { useState } from "react"
import { Select, SelectOption } from "./Select"

const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third 3', value: 3 },
  { label: 'Third 4', value: 4 },
  { label: 'Third 5', value: 5 },
  { label: 'Third6', value: 6 },
  { label: 'Third 7', value: 7 },
  { label: 'Third 8', value: 8 },
  { label: 'Third 9', value: 9 },
]

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [value2, setValue2] = useState<SelectOption[]>([])

  return (
    <>
      <Select options={options} value={value} onChange={(o) => setValue(o)} />
      <Select isMulti options={options} value={value2} onChange={(o) => setValue2(o)} />
    </>
  )
}

export default App
