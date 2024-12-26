import clsx from 'clsx'
import Header from '~/components/Header'
import Report from './Report'

export default function ReportPage() {
  return (
    <div
      className={clsx(['mx-auto max-w-screen-md flex flex-col h-dvh overflow-hidden', 'md:border-l-2 md:border-r-2'])}
    >
      <Header secondary />
      <Report />
    </div>
  )
}
