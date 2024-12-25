import { useEffect, useCallback, useState, createContext } from 'react'
import clsx from 'clsx'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAtomValue } from 'jotai'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel'
import { usernameAtom } from '../stores/app'
import AttentedStat from './reports/AttentedStat'
import AllListenedSongs from './reports/AllListenedSongs'
import RequestSongsStat from './reports/RequestSongsStat'
import CityStat from './reports/CityStat'
import EncoreSongStat from './reports/EncoreSongStat'

const Report: React.FC = () => {
  const username = useAtomValue(usernameAtom)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
  })
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const logEmblaEvent = useCallback((emblaApi: EmblaCarouselType) => {
    const slidesInView = emblaApi?.slidesInView()
    if (slidesInView?.length === 1) {
      setCurrentIndex(slidesInView[0])
    }
  }, [])

  useEffect(() => {
    if (emblaApi) emblaApi.on('slidesInView', logEmblaEvent)
  }, [emblaApi, logEmblaEvent])

  const slides = {
    AttentedStat,
    AllListenedSongs,
    CityStat,
    RequestSongsStat,
    EncoreSongStat,
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-hidden bg-black" ref={emblaRef}>
        <div className="flex h-full">
          {Object.entries(slides).map(([key, Slide], index) => (
            <div className="carousel-item" key={key}>
              <Slide focus={index === currentIndex} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 p-2 border-t-2">
        {selectedSnap !== 0 && (
          <button
            type="button"
            className={clsx([
              'flex justify-center items-center',
              'py-3 px-4 rounded-full cursor-pointer text-lg',
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
              'py-3 px-4 rounded-full cursor-pointer text-lg',
              'border-2 border-black hover:bg-black hover:text-white',
            ])}
            onClick={scrollNext}
          >
            <span>下一页</span>
            <ArrowRight />
          </button>
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
