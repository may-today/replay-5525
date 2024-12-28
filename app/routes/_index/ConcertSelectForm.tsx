import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { EyeOff, MessageCircleQuestion } from 'lucide-react'
import { cityConcertGroupList } from '~/lib/data'
import { setSelectedConcertDateAtom, selectedConcertDateTypeMapAtom } from '~/stores/app'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '~/components/ui/popover'
import type { Concert, ConcertSelectType } from '~/data/types'

const ConcertSelectForm = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const setSelectedConcertDate = useSetAtom(setSelectedConcertDateAtom)

  return (
    <div className="flex-1 flex flex-col gap-2 py-6 px-4 pb-24 overflow-y-auto">
      {/* <ConcertSelectDebugPanel data={selectedConcertDateTypeMap} /> */}
      <h2 className="text-xl font-bold mb-4">选择你去过的场次和座位：</h2>
      {Object.entries(cityConcertGroupList).map(([city, concerts]) => (
        <div key={city}>
          <h2 className="text-2xl font-bold py-4 text-center">{city}</h2>
          <div className="grid grid-cols-2 gap-4">
            {concerts.map((concert) => (
              <ConcertSelectItem
                key={concert.date}
                concert={concert}
                selected={selectedConcertDateTypeMap[concert.date]}
                onClick={(selectType) => setSelectedConcertDate(concert.date, selectType)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const ConcertSelectDebugPanel: React.FC<{ data: Record<string, ConcertSelectType> }> = (props) => {
  return <pre className="text-xs">{JSON.stringify(props.data, null, 2)}</pre>
}

export const getConcertSelectType = (type: ConcertSelectType) => {
  if (type === null) {
    return ''
  }
  return {
    unknown: '不记得',
    outdoor: '场外',
    ground: '内场',
    seats: '看台',
  }[type]
}

const ConcertSelectItem: React.FC<{
  concert: Concert
  selected: ConcertSelectType
  onClick: (selectType: ConcertSelectType) => void
}> = (props) => {
  const { concert, selected, onClick } = props
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={clsx([
            'border-2 border-black px-2 sm:px-4 h-12 rounded-full cursor-pointer',
            'flex items-center justify-between',
            selected && 'bg-black text-white',
            selected ? 'hover:bg-gray-700' : 'hover:bg-black/30',
          ])}
        >
          <span>
            D{concert.cityIndex}# {concert.date.replace(/20\d{2}\./, '')}
          </span>
          {selected && (
            <span className={clsx(['shrink-0 px-1.5 sm:px-2 py-1 rounded-full text-sm', 'border border-dashed border-white'])}>
              {getConcertSelectType(selected)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="border-2 p-0" hideWhenDetached>
        <div className="flex border-b-2 p-2">
          {concert.city}D{concert.cityIndex} {concert.date.replace(/20\d{2}\./, '')}
        </div>
        <PopoverClose asChild>
          <div className="flex border-b-2">
            <ConcertSelectItemPopoverItem
              icon={<EyeOff size={20} strokeWidth={2} />}
              text="未看"
              className="text-red-700"
              selected={false}
              onClick={() => onClick(null)}
            />
            <ConcertSelectItemPopoverItem
              icon={<MessageCircleQuestion size={20} strokeWidth={2} />}
              text="不记得"
              selected={selected === 'unknown'}
              onClick={() => onClick('unknown')}
            />
          </div>
        </PopoverClose>
        <PopoverClose asChild>
          <div className="flex">
            <ConcertSelectItemPopoverItem
              text="场外"
              selected={selected === 'outdoor'}
              onClick={() => {
                onClick('outdoor')
              }}
            />
            <ConcertSelectItemPopoverItem
              text="内场"
              selected={selected === 'ground'}
              onClick={() => {
                onClick('ground')
              }}
            />
            <ConcertSelectItemPopoverItem
              text="看台"
              selected={selected === 'seats'}
              onClick={() => {
                onClick('seats')
              }}
            />
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

const ConcertSelectItemPopoverItem: React.FC<{
  icon?: React.ReactNode
  text: string
  className?: string
  selected: boolean
  onClick: () => void
}> = (props) => {
  const { icon, text, className, selected, onClick } = props
  return (
    <button
      type="button"
      className={clsx([
        className,
        'flex-1 flex gap-1 items-center p-2 border-r-2 border-black last:border-r-0',
        'hover:bg-black hover:text-white cursor-pointer',
        selected && 'bg-black text-white hover:bg-gray-700',
      ])}
      onClick={onClick}
    >
      {icon} {text}
    </button>
  )
}

export default ConcertSelectForm
