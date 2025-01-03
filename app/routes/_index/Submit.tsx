import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useToggle } from '@uidotdev/usehooks'
import { Checkbox } from '~/components/ui/checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/components/ui/drawer'
import { Toaster } from '~/components/ui/toaster'
import { useToast } from '~/hooks/use-toast'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'

const Submit: React.FC<{ currentStep: 'base' | 'concert'; setCurrentStep: (step: 'base' | 'concert') => void }> = ({
  currentStep,
  setCurrentStep,
}) => {
  const navigate = useNavigate()
  const [selected, toggle] = useToggle(false)
  const { toast } = useToast()
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)

  const handleButtonClick = () => {
    if (currentStep === 'base') {
      setCurrentStep('concert')
      return
    }
    if (selected) {
      navigate('/loading', {
        viewTransition: true,
      })
    } else {
      toast({
        title: '请查收隐私声明和感谢名单',
      })
    }
  }

  return (
    <>
      <div className="flex justify-center shrink-0 gap-4 p-2 overflow-y-auto border-t-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={selected} onCheckedChange={() => toggle()} />
          <label htmlFor="terms" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <span>请查收</span>
            <PrivacyDrawer />
            <span>和</span>
            <ThanksListDrawer />
          </label>
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-end gap-2 h-20 px-3 overflow-y-auto border-t-2">
        {currentStep === 'concert' && (
          <div
            className={clsx([
              'flex justify-center items-center',
              'h-14 px-6 rounded-full cursor-pointer text-lg',
              'border-2 border-black hover:bg-gray-700',
            ])}
            onClick={() => setCurrentStep('base')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setCurrentStep('base')
              }
            }}
          >
            <ArrowLeft strokeWidth={1.5} />
          </div>
        )}
        <button
          type="button"
          className={clsx([
            'flex shrink-0 justify-center items-center gap-2',
            'h-14 px-6 rounded-full cursor-pointer text-lg',
            'border-2 border-black bg-black text-white hover:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ])}
          onClick={handleButtonClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleButtonClick()
            }
          }}
          disabled={currentStep === 'concert' && Object.keys(selectedConcertDateTypeMap).length === 0}
        >
          <span>
            {currentStep === 'base' ? '下一步' : '生成观演报告'}
          </span>
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
      <Toaster />
    </>
  )
}

const PrivacyDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="border-b-2 mx-1 py-1">隐私声明</DrawerTrigger>
      <DrawerContent className="px-2">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>隐私声明</DrawerTitle>
          <DrawerClose>
            <div className="p-2">
              <X />
            </div>
          </DrawerClose>
        </DrawerHeader>
        <article className="px-4 pb-8 leading-normal max-h-[50vh] overflow-y-auto">
          <p className="my-4">
            「五月天 5525 年度报告」将根据您提供的参加演唱会信息、姓名、地址等内容，生成一份5525演唱会观演报告。
          </p>
          <p className="my-4">您主动提供的所有信息都将在本地保存和处理，不会上传到服务器。</p>
          <p className="my-4">以下是报告将收集的信息和处理方式：</p>
          <ul className="list-disc list-inside">
            <li>名字：用于生成报告和分享图片；</li>
            <li>地址：用于报告「跨越过的距离」部分；</li>
            <li>
              参加演唱会信息：其中场次信息将用于生成演唱会歌单、座位类型和票价信息将用于生成「天气报告」和「花费的金钱」部分。
            </li>
          </ul>
          <p className="my-4">
            此外，开发者可能会采集您的访问记录（时间、浏览器信息等）用于统计网站的总访问次数、用户量和报告生成次数，以供后续优化。
          </p>
        </article>
      </DrawerContent>
    </Drawer>
  )
}

const ThanksListDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="border-b-2 mx-1 py-1">感谢名单</DrawerTrigger>
      <DrawerContent className="px-2">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>感谢名单</DrawerTitle>
          <DrawerClose>
            <div className="p-2">
              <X />
            </div>
          </DrawerClose>
        </DrawerHeader>
        <article className="px-4 pb-8 leading-normal max-h-[50vh] overflow-y-auto">
          <p className="my-4">
            「五月天 5525 年度报告」为粉丝作品，不代表相信音乐行为和立场。该报告由{' '}
            <a className="underline" href="https://ddiu.io" target="_blank">
              Diu
            </a>{' '}
            制作并在小红书宣发。制作的过程离不开各位五迷老师的协助和支持。
          </p>
          <p className="my-4">以下是特别感谢名单：</p>
          <ul className="list-disc list-inside">
            <li>
              感谢由台湾老师维护的{' '}
              <a
                className="underline"
                href="https://docs.google.com/spreadsheets/d/1pvDc5SmF6Rsw2chkiZkNn6I4JJDleRVLb5yOKAbm8Ck"
                target="_blank"
              >
                「五月天MayDay演唱會歌單」
              </a>{' '}
              表格；
            </li>
            <li>
              感谢 开开心心开心果、RingoMango、顽固的老徐🥕、椰子热、圈圈圆圆圆圈圈、蜡笔阿信🥕、与山河同寐🥕、狼啊狼几西纯路人狼 等老师在直播编码期间提供的被采纳的灵感；
            </li>
            <li>专辑及嘉宾图片来自互联网</li>
            <li>Talking 来自网络录音，由讯飞转录生成</li>
          </ul>
          <p className="my-4">技术信息：</p>
          <ul className="list-disc list-inside">
            <li>
              源代码：
              <a className="underline" href="https://github.com/may-today/replay-5525" target="_blank">
                may-today/replay-5525
              </a>
            </li>
            <li>字体：思源宋体 | <a className="underline" href="https://chinese-font.netlify.app/zh-cn/" target="_blank">中文网字计划</a></li>
          </ul>
        </article>
      </DrawerContent>
    </Drawer>
  )
}

export default Submit
