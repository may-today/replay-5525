import { cn } from '~/lib/utils'

const IndexBg = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn([
        'fixed inset-0 w-full h-full -z-10 bg-[#7dd3fc]',
        'transition-opacity duration-1000',
        className
      ])}
    />
  )
}

export default IndexBg
