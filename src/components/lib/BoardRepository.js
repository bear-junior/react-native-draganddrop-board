import { range } from 'lodash'
import Registry from './Registry'
import PositionCalculator from './PositionCalculator'
import Mover from './Mover'

class BoardRepository {
  constructor(data) {
    this.registry = new Registry(data)
    this.positionCalculator = new PositionCalculator()
    this.mover = new Mover(this.positionCalculator)
    this.listeners = {}
  }

  columns = () => this.registry.columns();

  column = columnId => this.registry.column(columnId);

  items = columnId => this.registry.items(columnId);

  visibleItems = columnId => this.registry.visibleItems(columnId);

  addListener = (columnId, event, callback) => {
    const forColumn = this.listeners[columnId]
    this.listeners[columnId] = Object.assign(forColumn || {}, {
      [event]: callback
    })
  };

  notify = (columnId, event) => this.listeners[columnId][event]();

  setScrollOffset = (columnId, scrollOffset) => {
    const column = this.registry.column(columnId)
    column.setScrollOffset(scrollOffset)
  };

  setContentHeight = (columnId, contentHeight) => {
    const column = this.registry.column(columnId)
    column.setContentHeight(contentHeight)
  };

  setItemRef = (columnId, item, ref) => {
    item.setRef(ref)
  };

  setListView = (columnId, listView) => {
    const column = this.registry.column(columnId)

    return column && column.setListView(listView)
  };

  updateItemWithLayout = (columnId, item, previousItem) => {
    item.measureAndSaveLayout(previousItem)
  };

  updateLayoutAfterVisibilityChanged = columnId => {
    const items = this.items(columnId)
    const rangeArr = range(items.length)

    rangeArr.forEach(i => {
      this.updateItemWithLayout(columnId, items[i], items[i - 1])
    })
  };

  updateItemsVisibility = (columnId, visibleItemsInSections) => {
    const visibleItems = visibleItemsInSections.s1
    const items = this.items(columnId)

    this.updateLayoutAfterVisibilityChanged(columnId)

    return items.forEach(
      item => visibleItems && item.setVisible(visibleItems[item.index()]),
    )
  };

  setColumnRef = (columnId, ref) => {
    const column = this.registry.column(columnId)

    return column && column.setRef(ref)
  };

  updateColumnWithLayout = columnId => {
    const column = this.registry.column(columnId)

    return column && column.measureAndSaveLayout()
  };

  scrollingPosition = (columnAtPosition, x, y, columnId) =>
    this.positionCalculator.scrollingPosition(columnAtPosition, x, y, columnId);

  updateColumnsLayoutAfterVisibilityChanged = () => {
    const columns = this.columns()

    return columns.forEach(column => {
      const columnId = column.id()
      this.updateColumnWithLayout(columnId)
      this.updateLayoutAfterVisibilityChanged(columnId)
    })
  };

  hide = (columnId, item) => {
    item.setHidden(true)
  };

  show = (columnId, item) => {
    item.setHidden(false)
  };

  showAll = () => {
    const columns = this.columns()
    columns.forEach(column => {
      const items = this.items(column.id())

      return items.forEach(item => this.show(column.id(), item))
    })
  };

  move = (draggedItem, x, y, columnId) =>
    this.mover.move(this, this.registry, draggedItem, x, y, columnId);
}

export default BoardRepository
