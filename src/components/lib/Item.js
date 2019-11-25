class Item {
  constructor(attributes) {
    this.attributes = attributes
  }

  attributes = () => this.attributes

  ref = () => this.attributes.ref

  id = () => this.attributes.id

  row = () => this.attributes.row

  index = () => this.attributes.index

  layout = () => this.attributes.layout

  columnId = () => this.attributes.columnId

  isVisible = () => this.attributes.visible

  isHidden = () => this.attributes.hidden

  isLocked = () => this.attributes.locked

  setHidden = hidden => (
    this.attributes.hidden = hidden
  )

  setRef = ref => (
    this.attributes.ref = ref
  )

  setLayout = layout => (
    this.attributes.layout = layout
  )

  setVisible = visible => (
    this.attributes.visible = visible
  )

  setColumnId = columnId => (
    this.attributes.columnId = columnId
  )

  setIndex = index => (
    this.attributes.index = index
  )

  measureAndSaveLayout = (previousItem) => {
    const ref = this.ref()

    const measure = ref && ref.measure((fx, fy, width, height, px, py) => {
      const layout = { x: px, y: py, width, height }
      this.setLayout(layout)
      if (!this.isVisible() && layout.x && layout.y && layout.width && layout.height) {
        this.setVisible(true)
      } else if (this.isVisible() && !layout.x && !layout.y && !layout.width && !layout.height) {
        this.setVisible(false)
      }
      if (this.isLocked()) {
        this.setVisible(false)
      }
      if (previousItem && previousItem.layout().y > layout.y) {
        this.setVisible(false)
      }
    })

    return measure
  }
}

export default Item
