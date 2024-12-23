import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { cityConcertGroupList } from '~/logic/data'
import { toggleSelectedConcertDateAtom, selectedConcertDatesAtom } from '~/stores/app'

const ConcertSelectForm = () => {
  const selectedDates = useAtomValue(selectedConcertDatesAtom)
  const toggleConcert = useSetAtom(toggleSelectedConcertDateAtom)

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 pb-24 overflow-y-auto">
      {Object.entries(cityConcertGroupList).map(([city, concerts]) => (
        <div key={city}>
          <h2 className="text-2xl font-bold py-4 px-2">{city}</h2>
          <div className="grid grid-cols-2 gap-4">
            {concerts.map((concert) => (
              <div
                key={concert.date}
                className={clsx([
                  'border-2 border-black px-4 py-2 rounded-full cursor-pointer',
                  selectedDates.includes(concert.date) && 'bg-black text-white',
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
    </div>
  )
}

export default ConcertSelectForm
