import { Item } from '@/lib/dataReader'
import { formatDateVerbose, readTitre, shorten } from '@/lib/utils'
import { LinkToItem } from './LinkToItem'
import { TagsList } from './TagsList'

export function ItemFiche({ item }: { item: Item }) {
  return (
    <li className="flex flex-col bg-gray-100 border-bleuanticor-200 lg:border-bleuanticor-100 lg:border-l-4 border-b-2 lg:border-b-0 border-0 stretch justify-between px-4 pb-8 pt-4 ">
      <LinkToItem {...{ item }} className="hover:bg-gray-200 ">
        <div>
          {item.date ? (
            <p className="mb-2 uppercase text-gray-500">
              {formatDateVerbose(item.date)}
            </p>
          ) : null}
          <h2 className="font-bold text-2xl mb-2 text-bleuanticor-500">
            {readTitre(item)}
          </h2>
          <p className="mb-4 text-black">{item.contenu}</p>
        </div>
      </LinkToItem>
      <TagsList {...{ item }} />
    </li>
  )
}
