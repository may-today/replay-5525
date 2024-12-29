import clsx from 'clsx'
import { CornerUpLeft, ImageDown } from 'lucide-react'
import { forwardRef, memo, useCallback, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router'
import { toPng } from 'html-to-image'
import { AnimatedGroup } from '~/components/ui/animated-group'
import {
  usernameAtom,
  selectedConcertDetailsAtom,
  selectedConcertDateTypeMapAtom,
  selectedCoordAtom,
} from '~/stores/app'
import type { Concert, ConcertSelectType } from '~/data/types'
import { concertListMap } from '~/lib/data'
import { getListenedCityDistance } from '~/components/reports/CityStat'
import { getListenedAmount } from '~/components/reports/AllListenedSongsStat'
import { isRainConcert } from '~/components/reports/RainStat'
import { getPageData as getRequestSongsPageData } from '~/components/reports/RequestSongsStat'
import { ballColorMap } from '~/data/ballColor'

const Ending: React.FC<{ focus: boolean }> = ({ focus }) => {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const downloadImage = useCallback(() => {
    if (ref.current === null) {
      return
    }
    toPng(ref.current, {
      cacheBust: true,
    })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'replay-5525.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <AnimatedGroup
      className="h-full flex flex-col overflow-y-auto p-4"
      variants={{
        container: {
          visible: {
            transition: {
              staggerChildren: 0.5,
            },
          },
        },
        item: {
          hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 1.2,
              type: 'spring',
              bounce: 0.3,
            },
          },
        },
      }}
    >
      <div className="text-report-normal">
        新年快乐
        <br />
        我们5526见
      </div>
      <div className="flex-1 flex flex-col items-center justify-center my-4">
        <div className="stamp">
          <ImageRender ref={ref} />
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 py-4">
        <button
          type="button"
          className={clsx([
            'flex justify-center items-center gap-2',
            'h-14 px-4 rounded-full cursor-pointer text-lg',
            'border-2 border-black hover:bg-black hover:text-white',
          ])}
          onClick={() => navigate('/', { viewTransition: true })}
        >
          <CornerUpLeft strokeWidth={1.5} />
          <span>回首页</span>
        </button>
        <button
          type="button"
          className={clsx([
            'flex justify-center items-center gap-2',
            'h-14 px-4 rounded-full cursor-pointer text-lg',
            'border-2 border-black hover:bg-black hover:text-white',
          ])}
          onClick={downloadImage}
        >
          <ImageDown strokeWidth={1.5} />
          <span>保存图片</span>
        </button>
      </div>
    </AnimatedGroup>
  )
}

interface GetPageDataProps {
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
  selectedConcertDetails: Concert[]
  selectedCoord: [number, number] | null
}

const getPageData = (props: GetPageDataProps) => {
  const { selectedConcertDateTypeMap, selectedConcertDetails, selectedCoord } = props
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  // attend
  const selectedTypes = Object.values(selectedConcertDateTypeMap)
  const groundAmount = selectedTypes.filter((type) => type === 'ground').length
  const seatsAmount = selectedTypes.filter((type) => type === 'seats').length
  const groundRate = groundAmount + seatsAmount > 0 ? groundAmount / (groundAmount + seatsAmount) : 0
  const seatsRate = groundAmount + seatsAmount > 0 ? seatsAmount / (groundAmount + seatsAmount) : 0
  // city
  const allCityAmountMap = Object.values(concertListMap).reduce(
    (acc, concert) => {
      acc[concert.city] = (acc[concert.city] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const allListenedCityAmountMap = selectedConcertDetails.reduce(
    (acc, concert) => {
      acc[concert.city] = (acc[concert.city] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const allListenedCityList = Object.keys(allListenedCityAmountMap)
  const fullAttendedCityList = Object.entries(allListenedCityAmountMap)
    .filter(([city, amount]) => amount === allCityAmountMap[city])
    .map(([city]) => city)
  const listenedCityDistanceMap = getListenedCityDistance(selectedCoord, allListenedCityList)
  const allListenedTotalDistance = listenedCityDistanceMap.reduce((acc, city) => acc + city.distance, 0) * 2
  // listened songs
  const listenedAmount = getListenedAmount(selectedConcertDetails)
  // rain
  const listenedRainAmount = selectedConcertDetails.filter((concert) =>
    isRainConcert(concert, selectedConcertDateTypeMap, 'all')
  ).length
  const listenedStormRainAmount = selectedConcertDetails.filter((concert) =>
    isRainConcert(concert, selectedConcertDateTypeMap, 'storm')
  ).length
  // guest
  const allListenedGuestConcertList = selectedConcertDetails.filter((concert) => !!concert.guest)
  // request songs
  const requestSongsData = getRequestSongsPageData(selectedConcertDetails)
  // encore songs
  const listenedBallColorListRaw = selectedConcertDetails
    .reduce((acc, concert) => {
      return acc.concat(concert.ballColorList)
    }, [] as string[])
    .filter(Boolean)
  const listenedBallColorAmountMap = Object.fromEntries(
    Object.entries(
      listenedBallColorListRaw.reduce(
        (acc, color) => {
          acc[color] = (acc[color] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )

  return {
    selectedDates,
    lastConcertAmount: selectedDates.filter((date) => concertListMap[date].last).length,
    mostCommonType: groundRate > 0.6 ? '内场摇滚区' : seatsRate > 0.6 ? '看台区' : null,
    allListenedCityList,
    fullAttendedCityList,
    listenedCityDistanceMap,
    allListenedTotalDistance,
    listenedAmount,
    listenedRainAmount,
    listenedStormRainAmount,
    allListenedGuestConcertList,
    requestSongsData,
    listenedBallColorAmountMap,
  }
}

const ImageRender = forwardRef<HTMLDivElement>((_, ref) => {
  const username = useAtomValue(usernameAtom)
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom)
  const data = getPageData({
    selectedConcertDateTypeMap,
    selectedConcertDetails,
    selectedCoord,
  })
  const AttendMiniStat = () => (
    <>
      <div>
        <span>看过</span>
        <span className="text-lg font-medium mx-1">{data.selectedDates.length}</span>
        <span>场</span>
        {data.lastConcertAmount > 0 && (
          <>
            <span>，解锁</span>
            <span className="text-lg font-medium mx-1">{data.lastConcertAmount}</span>
            <span>次尾场</span>
          </>
        )}
      </div>
      <div>
        {data.mostCommonType && (
          <>
            <span>最爱</span>
            <span className="text-lg font-medium mx-1">{data.mostCommonType}</span>
          </>
        )}
      </div>
    </>
  )
  const CityMiniStat = () => (
    <div>
      {data.allListenedCityList.length > 0 && (
        <>
          <span>去过</span>
          <span className="text-lg font-medium mx-1">{data.allListenedCityList.length}</span>
          <span>个城市</span>
        </>
      )}
      {data.allListenedTotalDistance > 100 && (
        <>
          <span>，奔波</span>
          <span className="text-lg font-medium mx-1">{~~data.allListenedTotalDistance}</span>
          <span>公里</span>
        </>
      )}
    </div>
  )
  const ListenedSongsMiniStat = () => (
    <div>
      <span>听过</span>
      <span className="text-lg font-medium mx-1">{data.listenedAmount}</span>
      <span>首现场</span>
    </div>
  )
  const RainMiniStat = () => (
    <div>
      {data.listenedRainAmount > 0 && (
        <>
          <span>淋过</span>
          <span className="text-lg font-medium mx-1">{data.listenedRainAmount}</span>
          <span>场雨</span>
          {data.listenedStormRainAmount > 0 && (
            <>
              <span>，其中</span>
              <span className="text-lg font-medium mx-1">{data.listenedStormRainAmount}</span>
              <span>场暴雨</span>
            </>
          )}
        </>
      )}
    </div>
  )
  const GuestMiniStat = () => (
    <div>
      {data.allListenedGuestConcertList.length > 0 && (
        <>
          <span>看过</span>
          <span className="text-lg font-medium mx-1">{data.allListenedGuestConcertList.length}</span>
          <span>次嘉宾</span>
        </>
      )}
    </div>
  )
  const RequestSongsMiniStat = () => (
    <>
      <div>
        <span>听过点歌</span>
        <span className="text-lg font-medium mx-1">{data.requestSongsData.listenedRequestSongList.length}</span>
        <span>首</span>
      </div>
      {data.requestSongsData.top1RequestSongConcertList.length > 1 && (
        <div>
          <span>点歌Top1</span>
          <span className="text-lg font-medium mx-1">《{data.requestSongsData.top1RequestSong}》</span>
        </div>
      )}
    </>
  )
  const EncoreSongMiniStat = () => (
    <div className="flex items-center gap-1 flex-wrap">
      {Object.keys(data.listenedBallColorAmountMap).length > 0 && (
        <>
          <span className="mr-2">解锁安可大球</span>
          {Object.keys(data.listenedBallColorAmountMap).map((colorName) => {
            return (
              <span
                key={colorName}
                className="inline-block w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: (ballColorMap as Record<string, string>)[colorName],
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
  return (
    <div className="share-image w-[300px] flex flex-col" ref={ref}>
      <header className="px-4 pt-3 pb-2 border-b border-dashed">
        <div className="leading-relaxed">{username ? `${username} 的` : '我的'}</div>
        <div className="text-xl font-medium leading-relaxed">5525年度报告</div>
      </header>
      <main className="flex-1 px-4 py-2 border-b border-dashed">
        <AttendMiniStat />
        <CityMiniStat />
        <ListenedSongsMiniStat />
        <RainMiniStat />
        <GuestMiniStat />
        <RequestSongsMiniStat />
        <EncoreSongMiniStat />
      </main>
      <footer className="px-4 pt-2 pb-3 text-sm text-center">祝您观演愉快</footer>
    </div>
  )
})

export default memo(Ending)
