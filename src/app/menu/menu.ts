import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'inventory',
    title: 'Apartments',
    translate: 'Apartments',
    type: 'item',
    icon: 'paperclip',
    url: 'inventory'
  },
  {
    id: 'sample',
    title: 'Settings',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'settings',
    url: 'settings'
  },
  {
    id: 'viewplan',
    title: 'Plan',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'info',
    url: 'plan'
  },
  {
    id: 'saleplan',
    title: 'Sales',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'info',
    url: 'sales'
  }
]
