import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from 'react-router'
import { cityConcertGroupList } from '../logic/data'
import { toggleSelectedConcertDateAtom, selectedConcertDatesAtom } from '../stores/app'

const ConcertSelect = () => {
  const selectedDates = useAtomValue(selectedConcertDatesAtom)
  const toggleConcert = useSetAtom(toggleSelectedConcertDateAtom)
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 pb-24 overflow-y-auto">
      {JSON.stringify(selectedDates)}
      {Object.entries(cityConcertGroupList).map(([city, concerts]) => (
        <div key={city}>
          <h2 className="text-2xl font-bold py-4 px-2">{city}</h2>
          <div className="grid grid-cols-2 gap-4">
            {concerts.map((concert) => (
              <div
                key={concert.date}
                className={clsx([
                  'border-2 border-black p-4 rounded-full cursor-pointer',
                  selectedDates.includes(concert.date) && 'bg-black text-white text-lg',
                  selectedDates.includes(concert.date) ? 'hover:bg-gray-700' : 'hover:bg-black/30',
                ])}
                onClick={() => toggleConcert(concert.date)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toggleConcert(concert.date)
                  }
                }}
              >
                D{concert.cityIndex}# {concert.date}
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedDates.length > 0 && (
        <div
          className={clsx([
            'absolute bottom-4 left-4 right-4 flex justify-center items-center',
            'border-2 border-black p-4 rounded-full cursor-pointer text-lg',
            'bg-black text-white hover:bg-gray-700',
          ])}
          onClick={() => navigate('/report')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate('/report')
            }
          }}
        >
          生成 5525 观演报告
        </div>
      )}
    </div>
  )
}

export default ConcertSelect
