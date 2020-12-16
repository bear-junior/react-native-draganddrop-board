import {
  filter,
  omit,
  sortBy,
  values
} from 'lodash'
import Item from './Item'

class ColumnItem {
  constructor(attributes) {
    this.attributes = attributes
  }

  attributes = () => this.attributes

  item = itemId => this.attributes.items[itemId]

  data = () => this.attributes.data

  items = () => {
    const items = values(this.attributes.items)
    const fake = new Item({
      id: -2,
      index: 100000,
      columnId: this.id(),
      row: { id: -2, name: '' },
      hidden: true,
      locked: false,
      visible: false
    })

    return sortBy(items, item => item.index()).concat([fake])
  }

  visibleItems = columnId => filter(this.items(columnId), item => item.isVisible())

  scrollOffset = () => this.attributes.scrollOffset

  contentHeight = () => this.attributes.contentHeight

  id = () => this.attributes.id

  ref = () => this.attributes.ref

  index = () => this.attributes.index

  layout = () => this.attributes.layout

  listView = () => this.attributes.listView

  setListView = listView => (
    this.attributes.listView = listView
  )

  setScrollOffset = scrollOffset => (
    this.attributes.scrollOffset = scrollOffset
  )

  setContentHeight = contentHeight => (
    this.attributes.contentHeight = contentHeight
  )

  setRef = ref => (
    this.attributes.ref = ref
  )

  setLayout = layout => (
    this.attributes.layout = layout
  )

  measureAndSaveLayout = () => {
    const ref = this.ref()

    const measure = ref && ref.measure((ox, oy, width, height, px, py) => {
      const layout = { x: px, y: py, width, height }
      this.setLayout(layout)

    })

    return measure
  }

  setItem = (item) => {
    this.attributes.items[item.id()] = item
    item.setColumnId(this.id())
  }

  removeItem = item => (
    this.attributes.items = omit(this.attributes.items, item.id())
  )

  updateLastItemVisibility = () => {
    const visibleItems = this.visibleItems()
    const items = this.items()

    if (visibleItems.length + 1 < items.length) {
      visibleItems[visibleItems.length - 1].setVisible(false)
    }
  }
}

export default ColumnItem
