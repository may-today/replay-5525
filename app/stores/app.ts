import { atom } from 'jotai'
import { concertListMap } from '~/lib/data'
import { geoCoordMap } from '~/data/geoCoord'
import type { Concert } from '~/data/types'

export const usernameAtom = atom<string>('')
export const selectedProvinceAtom = atom<string>('none')
export const selectedCoordAtom = atom<[number, number] | null>((get) => {
  const province = get(selectedProvinceAtom)
  return geoCoordMap[province] || null
})
export const selectedConcertDatesAtom = atom<string[]>([])
export const selectedConcertDetailsAtom = atom<Concert[]>((get) => {
  return Array.from(get(selectedConcertDatesAtom)).map((date) => {
    const concert = concertListMap[date]
    return concert
  })
})

export const toggleSelectedConcertDateAtom = atom(null, (get, set, date: string) => {
  const data = get(selectedConcertDatesAtom)
  const dataSet = new Set(data)
  if (dataSet.has(date)) {
    dataSet.delete(date)
  } else {
    dataSet.add(date)
  }
  set(selectedConcertDatesAtom, Array.from(dataSet))
})
