import clsx from 'clsx'
import { useAtom } from 'jotai'
import { usernameAtom, selectedProvinceAtom } from '~/stores/app'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '~/components/ui/select'
import { geoCoordMap } from '~/data/geoCoord'

const BaseInformationForm = () => {
  const [username, setUsername] = useAtom(usernameAtom)
  const [selectedProvince, setSelectedProvince] = useAtom(selectedProvinceAtom)

  return (
    <div className="flex-1 py-2">
      <div className="p-4">
        <div className="text-xl font-bold mb-4">怎么称呼？</div>
        <input
          type="text"
          className={clsx([
            'w-full border-b-2 border-black p-2 bg-transparent',
            'text-xl font-bold',
            'focus:outline-none focus:ring-0 focus:border-black',
          ])}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className="p-4">
        <div className="text-xl font-bold mb-4">您的省份/城市（可选）？</div>
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            <SelectItem value="none">不透露</SelectItem>
            <SelectSeparator />
            <SelectItem value="others">其他国家或地区</SelectItem>
            <SelectSeparator />
            {Object.entries(geoCoordMap).map(([key, coord]) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default BaseInformationForm
