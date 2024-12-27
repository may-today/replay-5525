import clsx from 'clsx'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { useNavigate } from "react-router"
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import Header from '~/components/Header'
import Report from './Report'

export default function ReportPage() {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const selectedConcertDates = Object.keys(selectedConcertDateTypeMap)
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedConcertDates.length === 0) {
      navigate('/')
    }
  }, [selectedConcertDates])

  if (selectedConcertDates.length === 0) {
    return null
  }
  return (
    <div
      className={clsx(['mx-auto max-w-screen-md flex flex-col h-dvh overflow-hidden', 'md:border-l-2 md:border-r-2'])}
    >
      <Header secondary />
      <Report />
    </div>
  )
}
