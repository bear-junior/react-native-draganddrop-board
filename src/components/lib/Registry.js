import {
  range, sortBy, values
} from 'lodash'
import ColumnItem from './ColumnItem'
import Item from './Item'

class Registry {
  constructor(data) {
    this.map = {}
    if (data) {
      this.updateData(data)
    }
  }

  existingColumnAttributes = columnId => {
    const column = this.column(columnId)

    return column && column.attributes()
  };

  buildColumn = (columnIndex, columnData) => {
    const columnId = columnData.id
    const existingAttributes = this.existingColumnAttributes(columnId) || {
      id: columnId,
      index: columnIndex,
      scrollOffset: 0,
      items: {}
    }
    const { rows } = columnData
    const itemsMap = this.buildItemsMap(
      columnId,
      rows,
      existingAttributes.items,
    )

    return new ColumnItem(
      Object.assign(existingAttributes, {
        items: itemsMap,
        data: columnData
      }),
    )
  };

  existingItemAttributes = (existingItems, itemId) => {
    const item = existingItems[itemId]

    return item && item.attributes()
  };

  buildItemsMap = (columnId, rows, existingItems) => {
    const items = range(rows.length).map(index => {
      const row = rows[index]
      const { id } = row
      const existingItemAttributes =
        this.existingItemAttributes(existingItems, id) || {}

      return new Item(
        Object.assign(existingItemAttributes, {
          id,
          index,
          columnId,
          row
        }),
      )
    })

    const itemsMap = {}

    items.forEach(item => {
      itemsMap[item.id()] = item
    })

    return itemsMap
  };

  updateData = data => {
    const columns = range(data.length).map(columnIndex => {
      const columnData = data[columnIndex]

      return this.buildColumn(columnIndex, columnData)
    })

    columns.forEach(column => {
      this.map[column.id()] = column
    })
  };

  move = (fromColumnId, toColumnId, item) => {
    const fromColumn = this.column(fromColumnId)
    const toColumn = this.column(toColumnId)

    toColumn.setItem(item)
    fromColumn.removeItem(item)
  };

  columns = () => {
    const columns = values(this.map)

    return sortBy(columns, column => column.index())
  };

  column = columnId => this.map[columnId];

  items = columnId => {
    const column = this.column(columnId)

    return (column && column.items()) || []
  };

  visibleItems = columnId => {
    const column = this.column(columnId)

    return (column && column.visibleItems()) || []
  };

  item = (columnId, itemId) => {
    const column = this.column(columnId)

    return column && column.item(itemId)
  };
}

export default Registry
