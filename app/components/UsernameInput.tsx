import clsx from 'clsx'
import { useAtom } from 'jotai'
import { usernameAtom } from '../stores/app'

const UsernameInput: React.FC = () => {
  const [username, setUsername] = useAtom(usernameAtom)

  return (
    <div className="p-4">
      <div className="text-2xl font-bold mb-4">请输入你的名字</div>
      <input
        type="text"
        className={clsx([
          'w-full border-b-2 border-black p-2 bg-transparent',
          'text-2xl font-bold',
          'focus:outline-none focus:ring-0 focus:border-black',
        ])}
        placeholder="请输入你的名字"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
    </div>
  )
}

export default UsernameInput
