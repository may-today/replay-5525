import { concertListMap } from '../logic/data'
import { useAtomValue } from 'jotai'
import { usernameAtom } from '../stores/app'
import { selectedConcertDatesAtom } from '../stores/app'
import AttentedStat from './reports/AttentedStat'
import AllListenedSongs from './reports/AllListenedSongs'
import RequestSongsStat from './reports/RequestSongsStat'
import CityStat from './reports/CityStat'
import { Carousel, CarouselContent, CarouselNavigation, CarouselIndicator, CarouselItem } from './ui/carousel'
import clsx from 'clsx'

const Report: React.FC = () => {
  const username = useAtomValue(usernameAtom)
  const selectedDates = useAtomValue(selectedConcertDatesAtom)

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
      {/* <div className="text-2xl font-bold mb-4">{username} 的 5525 观演报告</div> */}
      <Carousel className="flex-1 flex flex-col overflow-hidden" disableDrag>
        <CarouselContent className="h-full pb-12">
          <CarouselItem className="h-full overflow-y-scroll border-l border-r">
            <AttentedStat />
          </CarouselItem>
          <CarouselItem className="h-full overflow-y-scroll border-l border-r">
            <AllListenedSongs />
          </CarouselItem>
          <CarouselItem className="h-full overflow-y-scroll border-l border-r">
            <RequestSongsStat />
          </CarouselItem>
          <CarouselItem className="h-full overflow-y-scroll border-l border-r">
            <CityStat />
          </CarouselItem>
        </CarouselContent>
        <CarouselNavigation
          className={clsx([
            'absolute bottom-0 left-0 right-0',
            'flex justify-end items-center bg-background px-8 py-3 gap-2 border-t-2',
          ])}
          classNameButton="border-2"
        />
      </Carousel>
    </div>
  )
}

export default Report
