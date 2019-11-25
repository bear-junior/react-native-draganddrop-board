/* eslint-disable no-unused-vars */
import { findIndex, range } from 'lodash'

class Mover {
  constructor(positionCalculator) {
    this.positionCalculator = positionCalculator
  }

  move = (boardRepository, registry, draggedItem, x, y, columnId) => {
    const fromColumnId = draggedItem.columnId()
    const columns = boardRepository.columns()
    const columnAtPosition = this.positionCalculator.columnAtPosition(columns, columnId)

    if (!columnAtPosition) {
      return
    }

    const toColumnId = columnId + 1
    if (toColumnId !== fromColumnId) {
      this.moveToOtherColumn(boardRepository, registry, fromColumnId, toColumnId, draggedItem)
    }

    const items = boardRepository.visibleItems(toColumnId)
    const itemAtPosition = this.positionCalculator
      .itemAtPosition(items, toColumnId, y, draggedItem)
    if (!itemAtPosition) {
      return columnAtPosition
    }

    const draggedId = draggedItem.id()
    const itemAtPositionId = itemAtPosition.id()

    if (draggedItem.id() === itemAtPosition.id()) {
      return columnAtPosition
    }

    this.switchItemsBetween(boardRepository, draggedItem, itemAtPosition, toColumnId)

    return columnAtPosition
  }

  moveToOtherColumn = (boardRepository, registry, fromColumnId, toColumnId, item) => {
    registry.move(fromColumnId, toColumnId, item)
    boardRepository.notify(fromColumnId, 'reload')

    item.setVisible(true)
    item.setIndex(-1)

    const items = boardRepository.items(toColumnId)
    items.forEach(i => i.setIndex(i.index() + 1))

    const visibleItems = boardRepository.visibleItems(toColumnId)
    const rangeVisibleItems = range(0, visibleItems.length - 1)

    rangeVisibleItems
      .forEach(i => visibleItems[i].setLayout({ ...visibleItems[i + 1].layout() }))

    const lastItem = visibleItems[visibleItems.length - 1]
    const lastLayout = lastItem.layout()
    const newLastY = lastLayout.y + lastLayout.height
    lastItem.setLayout(Object.assign(lastLayout, { y: newLastY }))

    const column = registry.column(toColumnId)
    column.updateLastItemVisibility()
  }

  switchItemsBetween = (boardRepository, draggedItem, itemAtPosition, toColumnId) => {
    draggedItem.setVisible(true)

    let items = boardRepository.visibleItems(toColumnId)
    const draggedItemI = (items).findIndex(item => item.id() === draggedItem.id())
    const itemAtPositionI = (items).findIndex(item => item.id() === itemAtPosition.id())
    let itemsRange
    if (draggedItem.index() < itemAtPosition.index()) {
      itemsRange = range(draggedItemI, itemAtPositionI)
    } else {
      itemsRange = range(itemAtPositionI, draggedItemI)
    }

    itemsRange.forEach((i) => {
      const firstItem = items[i]
      const secondItem = items[i + 1]
      this.switchItems(toColumnId, firstItem, secondItem)
      items = boardRepository.visibleItems(toColumnId)
    })

    boardRepository.notify(toColumnId, 'reload')
  }

  switchItems = (columnId, firstItem, secondItem) => {
    if (!firstItem || !secondItem) {
      return
    }

    const firstId = firstItem.id()
    const secondId = secondItem.id()
    const firstIndex = firstItem.index()
    const secondIndex = secondItem.index()
    const firstY = firstItem.layout().y
    const secondHeight = secondItem.layout().height
    const firstRef = firstItem.ref()
    const secondRef = secondItem.ref()

    firstItem.setIndex(secondIndex)
    secondItem.setIndex(firstIndex)

    firstItem.setLayout(Object.assign(firstItem.layout(), { y: firstY + secondHeight }))
    secondItem.setLayout(Object.assign(secondItem.layout(), { y: firstY }))

    firstItem.setRef(secondRef)
    secondItem.setRef(firstRef)
  }
}

export default Mover
