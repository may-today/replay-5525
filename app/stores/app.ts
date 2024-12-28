import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { concertListMap } from '~/lib/data'
import { geoCoordMap } from '~/data/geoCoord'
import type { Concert, ConcertSelectType } from '~/data/types'

export const usernameAtom = atomWithStorage<string>('replay5525:username', '')
export const selectedProvinceAtom = atomWithStorage<string>('replay5525:selectedProvince', 'none')
export const selectedCoordAtom = atom<[number, number] | null>((get) => {
  const province = get(selectedProvinceAtom)
  return geoCoordMap[province] || null
})
export const selectedConcertDateTypeMapAtom = atom<Record<string, ConcertSelectType>>({})
export const selectedConcertDetailsAtom = atom<Concert[]>((get) => {
  return Array.from(Object.keys(get(selectedConcertDateTypeMapAtom))).map((date) => {
    const concert = concertListMap[date]
    return concert
  })
})

export const setSelectedConcertDateAtom = atom(null, (get, set, date: string, selectType: ConcertSelectType) => {
  const data = get(selectedConcertDateTypeMapAtom)
  const newData = { ...data }

  if (!selectType) {
    delete newData[date]
  } else {
    newData[date] = selectType
  }

  // sort by date
  const sortedDates = Object.keys(newData).sort((a, b) => parseDateToNumber(a) - parseDateToNumber(b))
  const sortedMap = sortedDates.reduce((acc, date) => {
    acc[date] = newData[date]
    return acc
  }, {} as Record<string, ConcertSelectType>)

  set(selectedConcertDateTypeMapAtom, sortedMap)
})

// 2024.05.24 -> 20240524
const parseDateToNumber = (date: string) => {
  return ~~date.replace(/\./g, '')
}
