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

export const useFocus = (focus: boolean, callback: () => void) => {
  useEffect(() => {
    if (focus) {
      callback()
    }
  }, [focus, callback])
}
