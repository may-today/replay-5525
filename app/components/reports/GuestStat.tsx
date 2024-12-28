import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { InfiniteSlider } from '~/components/ui/infinite-slider'
import { AnimatedNumber } from '~/components/ui/animated-number'
import { selectedConcertDetailsAtom } from '~/stores/app'
import { concertListMap } from '~/lib/data'
import { useFocusValueMap } from '~/hooks/useFocus'
import type { Concert } from '~/data/types'
import ConcertTitle from '../ConcertTitle'

import Accusefive from '~/assets/guest/accusefive.webp'
import Cheer from '~/assets/guest/cheer.webp'
import Della from '~/assets/guest/della.webp'
import Ella from '~/assets/guest/ella.webp'
import Energy from '~/assets/guest/energy.webp'
import Jam from '~/assets/guest/jam.webp'
import Jjlin from '~/assets/guest/jjlin.webp'
import Michael from '~/assets/guest/michael.webp'
import Rene from '~/assets/guest/rene.webp'
import Richie from '~/assets/guest/richie.webp'
import Xin from '~/assets/guest/xin.webp'

const guestImgMap = {
  告五人: Accusefive,
  陳綺貞: Cheer,
  丁噹: Della,
  陳嘉樺: Ella,
  Energy: Energy,
  蕭敬騰: Jam,
  林俊傑: Jjlin,
  光良: Michael,
  劉若英: Rene,
  任賢齊: Richie,
  劉雨昕: Xin,
}

const allGuestConcertAmount = Object.values(concertListMap).filter((concert) => !!concert.guest).length

const getPageData = (selectedConcertDetails: Concert[]) => {
  const allListenedGuestConcertList = selectedConcertDetails.filter((concert) => !!concert.guest)
  const allListenedGuestList = Array.from(new Set(allListenedGuestConcertList.map((concert) => concert.guest)))
  return {
    allListenedGuestConcertList,
    allListenedGuestList,
  }
}

const GuestStat: React.FC<{
  focus: boolean
}> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedConcertDetails), [selectedConcertDetails])
  console.log('GuestStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    listenedGuestConcertAmount: data.allListenedGuestConcertList.length,
    guestAmount: data.allListenedGuestList.length,
  }))

  return (
    <div className="relative h-full">
      <div className="h-full mr-36 p-4 overflow-y-auto">
        <div className="text-report-normal">
          <span>今年的</span>
          <span>{allGuestConcertAmount}</span>
          <span>场演唱会有嘉宾出现</span>
        </div>
        {data.allListenedGuestConcertList.length > 0 ? (
          <>
            <div className="text-report-normal">
              <span>你解锁了其中的</span>
              <AnimatedNumber className="text-report-large" value={animValue.listenedGuestConcertAmount} />
              <span>场：</span>
            </div>
            <div className="text-report-normal mt-4">
              {data.allListenedGuestConcertList.map((concert) => (
                <div key={concert.date} className="mb-1 flex flex-col sm:flex-row">
                  <ConcertTitle concert={concert} className="shrink-0" />
                  <span className="text-report-large text-2xl shrink-0">「{concert.guest}」</span>
                </div>
              ))}
            </div>
          </>
        ): (
          <>
            <div className="text-report-normal">
              你还没有解锁过
            </div>
            <div className="text-report-normal">
              但也获得了纯度更高的五月天
            </div>
          </>
        )}
        
      </div>
      <div className="absolute top-0 bottom-0 right-4">
        <InfiniteSlider direction="vertical" className="h-full">
          {Object.entries(guestImgMap).map(([guest, img]) => {
            return (
              <img key={guest} src={img} alt="guest" className={clsx(['w-32 h-32 border-2', data.allListenedGuestList.includes(guest) ? 'opacity-100' : 'opacity-60'])} />
            )
          })}
        </InfiniteSlider>
      </div>
    </div>
  )
}

export default memo(GuestStat)
