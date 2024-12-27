import { useState, useEffect } from 'react'

export const useFocusValue = (focus: boolean, getValue: () => number) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (focus) {
      setValue(getValue())
    }
  }, [focus, getValue])

  return value
}

export const useFocusValueMap = (focus: boolean, getValue: () => Record<string, number>) => {
  const [value, setValue] = useState<Record<string, number>>({})

  useEffect(() => {
    if (focus) {
      setValue(getValue())
    }
  }, [focus])

  return value
}

export const useFocus = (focus: boolean, callback: () => void) => {
  useEffect(() => {
    if (focus) {
      callback()
    }
  }, [focus, callback])
}
