import { Item, getData } from '@/lib/dataReader'
import {
  extractDomain,
  formatDateVerbose,
  getItemsWithSameTag,
  readTagsOfItem,
  readTitre,
} from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TagsList } from '@/components/TagsList'
import { LinkToItem } from '@/components/LinkToItem'
import { LinkToTag } from '@/components/LinkToTag'
import sortBy from 'lodash/sortBy'
import { NextSearchParams } from '@/app/revuedepresse/page'

type LocalParams = {
  year: string
  month: string
  day: string
  pathParam: string
}

export default function Fiche({
  params,
}: {
  params: LocalParams
  searchParams: NextSearchParams
}) {
  const allItems = getData()
  const item = identifyItem(params, allItems)

  if (item) {
    return (
      <div className="container mx-auto">
        <MainFiche item={item} />
        <Suggestions {...{ item, allItems }} />
      </div>
    )
  }
  return notFound()
}

function MainFiche({ item }: { item: Item }) {
  return (
    <div className="bg-bleuanticor-200 mb-8">
      <div className="bg-white flex flex-col stretch justify-between px-4 pt-8 pb-8 text-black max-w-4xl mx-auto">
        <div>
          {item.date ? (
            <p className="mb-4 text-center text-base uppercase text-gray-500">
              {formatDateVerbose(item.date)}
            </p>
          ) : null}
          <h1 className="font-bold text-4xl mb-8 text-bleuanticor-500">
            {readTitre(item)}
          </h1>
          <p className="mb-4 ">{item.contenu}</p>
          <p className="mb-10">
            <i className="ri-article-line ri-lg mr-2" />
            Source :{' '}
            <Link
              href={item.url}
              target="_blank"
              className="fc-link underline underline-offset-4"
            >
              {buildLinkText(item)}{' '}
              <i className="ri-external-link-line" aria-hidden="true" />
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <TagsList {...{ item }} />
        </div>
      </div>
    </div>
  )
}

function buildLinkText(item: Item) {
  const domain = extractDomain(item.url)
  return item.titre + (domain ? ` (${domain})` : '')
}

function Suggestions({ item, allItems }: { item: Item; allItems: Item[] }) {
  return (
    <div className="flex flex-col space-y-8 mb-8">
      {getSimilarItems(item, allItems).map(({ tag, items }) => {
        return (
          <div className="" key={tag.id}>
            <h3 className="text-base mb-2">
              <LinkToTag
                {...{ tag }}
                className="bg-bleuanticor-500 px-4 py-1 text-white mr-2"
              />
            </h3>
            <ul className="grid grid-cols-3 gap-6 items-stretch">
              {items.map((item) => {
                return (
                  <li key={item.id} className="">
                    <LinkToItem
                      {...{ item }}
                      className="bg-gray-100 border-bleuanticor-100 border-l-4 border-0 pt-6 pb-8 px-8 block h-full "
                    >
                      {item.date && (
                        <div className="text-sm mb-1 uppercase">
                          {formatDateVerbose(item.date)}
                        </div>
                      )}
                      <div className="font-bold text-bleuanticor-500">
                        {readTitre(item)}
                      </div>
                    </LinkToItem>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function getSimilarItems(item: Item, allItems: Item[]) {
  const tags = readTagsOfItem(item).filter((_) => _.kind !== 'categories')
  const tagsWithItems = tags
    .map((tag) => {
      const items = getItemsWithSameTag(allItems, tag)
        // don't keep the same item
        .filter((_) => _.id !== item.id)
        // keep 3 items max
        .slice(0, 3)
      return { tag, items }
    })
    // don't keep tags with 0 other items
    .filter((_) => _.items.length)
  // Sort by length, so that tags with less than 3 items
  // are always at the end (because it looks better)
  return sortBy(tagsWithItems, (_) => -_.items.length)
}

function identifyItem(params: LocalParams, allItems: Item[]) {
  const id = params.pathParam.split('-')[0].trim()
  const item = allItems.find((_) => _.id.toString() === id)
  return item
}