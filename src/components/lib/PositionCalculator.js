class PositionCalculator {
  TRESHOLD = 35

  columnAtPosition = (columns, columnId) => {
    const column = columns.find((col, index) => (
      index === columnId
    ))

    return column
  }

  scrollingPosition = (column, x, y) => {
    const layout = column.layout()

    const upperEnd = layout.y
    const upper = y > upperEnd - this.TRESHOLD && y < upperEnd + this.TRESHOLD

    const lowerEnd = layout.y + layout.height
    const lower = y > lowerEnd - this.TRESHOLD && y < lowerEnd + this.TRESHOLD

    const offset = lower ? 1 : (upper ? -1 : 0)

    return {
      offset,
      scrolling: (lower || upper)
    }
  }

  selectItem = (y, draggedItem, item) => {
    const layout = item.layout()
    const heightDiff = Math.abs(draggedItem.layout().height - layout.height)

    let up; let
      down
    if (heightDiff > layout.height) {
      up = y > layout.y
      down = y < layout.y + layout.height
    } else if (y < draggedItem.layout().y) {
      down = y < layout.y + layout.height - heightDiff
      up = y > layout.y
    } else {
      down = y < layout.y + layout.height
      up = y > layout.y + heightDiff
    }

    return layout && up && down
  }

  itemAtPosition = (items, columnId, y, draggedItem) => {
    let item = items.find(i => this.selectItem(y, draggedItem, i))

    const firstItem = items[0]
    if (!item && firstItem && firstItem.layout() && y <= firstItem.layout().y) {
      item = firstItem
    }

    const lastItem = items[items.length - 1]
    if (!item && lastItem && lastItem.layout() && y >= lastItem.layout().y) {
      item = lastItem
    }

    return item
  }
}

export default PositionCalculator
