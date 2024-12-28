import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router'
import { usernameAtom, selectedConcertDetailsAtom } from '~/stores/app'
import { SpinningText } from '~/components/ui/spinning-text'
// @ts-expect-error
import { Gradient } from '~/lib/gradient'
import IndexBg from '~/components/IndexBg'
import { ballColorMapLight } from '~/data/ballColor'
import type { Concert } from '~/data/types'

// use encore ball colors from selected concert dates
const getAccentColors = (selectedConcertDetails: Concert[]) => {
  const listenedBallColorNameList = Array.from(
    new Set(
      selectedConcertDetails.reduce((acc, concert) => {
        return acc.concat(concert.ballColorList)
      }, [] as string[])
    )
  ).filter(Boolean)
  const accentColors = listenedBallColorNameList.map((color) => (ballColorMapLight as Record<string, string>)[color])
  return accentColors
}

const setGradients = (accentColors: string[]) => {
  const colors = [...accentColors]
  if (colors.length === 0) {
    colors.push('#e0f2fe', '#7dd3fc', '#818cf8', '#2dd4bf')
  }
  while (colors.length < 4) {
    colors.push(colors[colors.length % accentColors.length])
  }
  const canvas = document.querySelector('#gradient-canvas') as HTMLElement
  if (!canvas) return
  colors.forEach((color, index) => {
    canvas.style.setProperty(`--gradient-color-${index + 1}`, color)
  })

  const gradient = new Gradient()
  gradient.initGradient('#gradient-canvas')
}

export default function ReportPage() {
  const username = useAtomValue(usernameAtom)
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const navigate = useNavigate()
  const [bgOpacity, setBgOpacity] = useState('opacity-100')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedConcertDetails.length === 0) {
      navigate('/')
    } else {
      setTimeout(() => {
        navigate('/report', {
          viewTransition: true,
        })
      }, 5000)
    }

    // 使用从选中演唱会日期获取的强调色
    const accentColors = getAccentColors(selectedConcertDetails)
    setGradients(accentColors)

    // 1秒后开始渐隐
    const timer = setTimeout(() => {
      setBgOpacity('opacity-0')
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedConcertDetails])

  return (
    <div
      className={clsx([
        'mx-auto max-w-screen-md flex flex-col items-center justify-center h-dvh overflow-hidden',
        'md:border-l-2 md:border-r-2',
      ])}
    >
      <IndexBg className={bgOpacity} />
      <SpinningText radius={6} fontSize={0.8} className="font-medium leading-none">
        {'MONSTER • MASA • STONE • MING • ASHIN • '}
      </SpinningText>
      <div className="text-center mt-20">
        <p>正在生成</p>
        <p>属于{username ? ` ${username} ` : '你'}的</p>
        <p>年度报告</p>
      </div>
    </div>
  )
}
