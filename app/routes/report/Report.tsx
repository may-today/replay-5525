import { useEffect, useCallback, useState } from 'react'
import clsx from 'clsx'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAtomValue } from 'jotai'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import { Freeze } from 'react-freeze'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'
import AttendedStat from '~/components/reports/AttendedStat'
import AllListenedSongsStat from '~/components/reports/AllListenedSongsStat'
import CityStat from '~/components/reports/CityStat'
import RainStat, { shouldShowRainStat } from '~/components/reports/RainStat'
import GuestStat from '~/components/reports/GuestStat'
import RequestSongsStat from '~/components/reports/RequestSongsStat'
import EncoreSongStat from '~/components/reports/EncoreSongStat'
import SpecialEventStat, { shouldShowSpecialEventStat } from '~/components/reports/SpecialEventStat'
import TalkingStat, { shouldShowTalkingStat } from '~/components/reports/TalkingStat'
import Ending from './Ending'

const Report: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
  })
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi?.canScrollPrev()) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi?.canScrollNext()) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const slides = {
    AttendedStat,
    AllListenedSongsStat,
    CityStat,
    RainStat: shouldShowRainStat(selectedConcertDetails, selectedConcertDateTypeMap) ? RainStat : null,
    GuestStat,
    RequestSongsStat,
    EncoreSongStat,
    SpecialEventStat: shouldShowSpecialEventStat(selectedConcertDetails) ? SpecialEventStat : null,
    TalkingStat: shouldShowTalkingStat(selectedConcertDetails, selectedConcertDateTypeMap) ? TalkingStat : null,
    Ending,
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-hidden bg-black1" ref={emblaRef}>
        <div className="flex h-full">
          {Object.entries(slides)
            .filter(([_, Slide]) => !!Slide)
            .map(([key, Slide], index) => (
              <div className="carousel-item" key={key}>
                <Freeze freeze={Math.abs(index - currentIndex) > 1}>
                  {Slide && <Slide focus={index === currentIndex} />}
                </Freeze>
              </div>
            ))}
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-end gap-2 h-20 px-3 border-t-2">
        {selectedSnap !== 0 && selectedSnap !== snapCount - 1 && (
          <button
            type="button"
            className={clsx([
              'flex justify-center items-center',
              'h-14 px-4 rounded-full cursor-pointer text-lg',
              'border-2 border-black hover:bg-black hover:text-white',
            ])}
            onClick={scrollPrev}
          >
            <ArrowLeft />
          </button>
        )}
        {selectedSnap !== snapCount - 1 && (
          <button
            type="button"
            className={clsx([
              'flex justify-center items-center gap-2',
              'h-14 px-4 rounded-full cursor-pointer text-lg',
              'border-2 border-black hover:bg-black hover:text-white',
            ])}
            onClick={scrollNext}
          >
            <span>下一页</span>
            <ArrowRight strokeWidth={1.5} />
          </button>
        )}
        {selectedSnap === snapCount - 1 && (
          <div className="w-full text-center text-sm transition-opacity opacity-20 hover:opacity-50">
            Made by Diu
          </div>
        )}
      </div>
    </div>
  )
}

const useSelectedSnapDisplay = (
  emblaApi: EmblaCarouselType | undefined
): {
  selectedSnap: number
  snapCount: number
} => {
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
    setSnapCount(emblaApi.scrollSnapList().length)
    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    updateScrollSnapState(emblaApi)
    emblaApi.on('select', updateScrollSnapState)
    emblaApi.on('reInit', updateScrollSnapState)
  }, [emblaApi, updateScrollSnapState])

  return {
    selectedSnap,
    snapCount,
  }
}

export default Report
