import clsx from 'clsx'
import { CornerUpLeft } from 'lucide-react'
import { memo } from 'react'
import { useNavigate } from 'react-router'

const Ending: React.FC<{ focus: boolean }> = ({ focus }) => {
  const navigate = useNavigate()
  return (
    <div className="h-full flex flex-col items-center justify-center">
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
        <span>返回首页</span>
      </button>
    </div>
  )
}

export default memo(Ending)
