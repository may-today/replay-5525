import { concertListMap } from '../logic/data'
import { useAtomValue } from 'jotai'
import { usernameAtom } from '../stores/app'
import { selectedConcertDatesAtom } from '../stores/app'
import AttentedStat from './reports/AttentedStat'
import AllListenedSongs from './reports/AllListenedSongs'
import RequestSongsStat from './reports/RequestSongsStat'
import CityStat from './reports/CityStat'

const Report: React.FC = () => {
  const username = useAtomValue(usernameAtom)
  const selectedDates = useAtomValue(selectedConcertDatesAtom)

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 pb-24 overflow-y-auto">
      <div className="text-2xl font-bold mb-4">
        {username} 的 5525 观演报告
      </div>
      <AttentedStat />
      <AllListenedSongs />
      <RequestSongsStat />
      <CityStat />
      {Array.from(selectedDates).map((date) => {
        const concert = concertListMap[date]
        return <pre key={date}>{JSON.stringify(concert, null, 2)}</pre>
      })}
    </div>
  )
}

export default Report
