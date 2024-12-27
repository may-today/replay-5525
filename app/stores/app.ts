import { atom } from 'jotai'
import { concertListMap } from '~/lib/data'
import { geoCoordMap } from '~/data/geoCoord'
import type { Concert, ConcertSelectType } from '~/data/types'

export const usernameAtom = atom<string>('')
export const selectedProvinceAtom = atom<string>('none')
export const selectedCoordAtom = atom<[number, number] | null>((get) => {
  const province = get(selectedProvinceAtom)
  return geoCoordMap[province] || null
})
export const selectedConcertDateTypeMapAtom = atom<Record<string, ConcertSelectType>>({})
// export const selectedConcertDateListAtom = atom<string[]>((get) => {
//   return Object.keys(get(selectedConcertDateTypeMapAtom))
// })
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
  
  console.log('setSelectedConcertDateAtom', newData)
  set(selectedConcertDateTypeMapAtom, newData)
})