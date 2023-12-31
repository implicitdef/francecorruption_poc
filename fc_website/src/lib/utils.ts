import { TagKind } from '@/app/revuedepresse/tag/[kind]/[id]/page'
import { Item } from './dataReader'

// 2023-11-03 => 3 novembre 2023
export function formatDateVerbose(dateStr: string): string {
  const [year, month, day] = dateStr
    .split('-')
    .map((part) => parseInt(part, 10))
  const date = new Date(year, month - 1, day)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat('fr-FR', options)
  return formatter.format(date)
}

export function pickTagsList(item: Item, tagKind: TagKind) {
  switch (tagKind) {
    case 'categories':
      return item.categorie
    case 'departements':
      return item.departement
    case 'personnalites':
      return item.personnalites
    case 'personnes_morales':
      return item.personnes_morales
    case 'procedure':
      return item.procedure
    case 'theme':
      return item.theme
  }
}
