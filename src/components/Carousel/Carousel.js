import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import {
  array,
  bool,
  func,
  number
} from 'prop-types'
import { deviceWidth, ios }  from '../../constants'
import { ItemWrapper } from './Carousel.styled'

const INITIAL_ACTIVE_ITEM = 0

class Carousel extends Component {
  constructor(props) {
    super(props)

    this.activeItem = INITIAL_ACTIVE_ITEM
    this.previousActiveItem = INITIAL_ACTIVE_ITEM
    this.previousFirstItem = INITIAL_ACTIVE_ITEM
    this.previousItemsLength = INITIAL_ACTIVE_ITEM
    this.mounted = false
    this.positions = []
    this.currentContentOffset = 0
    this.scrollOffsetRef = null
  }

  componentDidMount() {
    this.mounted = true
    this.activeItem = 0

    this.initPositions(this.props)
  }

  UNSAFE_componentWillUpdate = (nextProps) => {
    this.initPositions(nextProps)
  }

  componentWillUnmount() {
    this.mounted = false
  }

    getCustomDataLength = (props = this.props) => {
      const { data } = props
      const dataLength = data && data.length

      if (!dataLength) {
        return 0
      }

      return dataLength
    }

    getCustomIndex = (index, props = this.props) => {
      const itemsLength = this.getCustomDataLength(props)

      if (!itemsLength || (!index && index !== 0)) {
        return 0
      }

      return index
    }

    get currentIndex() {
      return this.activeItem
    }

    getDataIndex = (index) => {
      const { data } = this.props
      const dataLength = data && data.length

      if (!dataLength) {
        return index
      }

      if (index >= dataLength + 1) {
        return dataLength < 1
          ? (index - 1) % dataLength
          : index - dataLength - 1
      } if (index < 1) {
        return index + dataLength - 1
      }

      return index - 1
    }

    getFirstItem = (index, props = this.props) => {
      const itemsLength = this.getCustomDataLength(props)

      if (!itemsLength || index > itemsLength - 1 || index < 0) {
        return 0
      }

      return index
    }

    getWrappedRef = () => this.carouselRef

    getKeyExtractor = (item, index) => `scrollview-item-${index}`

    getScrollOffset = event => (event && event.nativeEvent && event.nativeEvent.contentOffset
            && event.nativeEvent.contentOffset.x) || 0

    getCenter = (offset) => {
      const {
        itemWidth,
        sliderWidth
      } = this.props

      return offset + sliderWidth / 2 - (sliderWidth - itemWidth) / 2
    }

    getActiveItem = (offset) => {
      const center = this.getCenter(offset)
      const centerOffset = 20

      for (let i = 0; i < this.positions.length; i += 1) {
        const { start, end } = this.positions[i]
        if (center + centerOffset >= start && center - centerOffset <= end) {
          return i
        }
      }

      const lastIndex = this.positions.length - 1
      if (this.positions[lastIndex] && center - centerOffset > this.positions[lastIndex].end) {
        return lastIndex
      }

      return 0
    }

    initPositions = (props = this.props) => {
      const {
        data,
        itemWidth
      } = props

      if (!data || !data.length) {
        return
      }

      this.positions = []

      const firstItemMargin = 0
      data.forEach((itemData, index) => {
        this.positions[index] = {
          start: firstItemMargin + index * itemWidth + (index * 8),
          end: index * itemWidth + itemWidth + (index * 8)
        }
      })
    }

    scrollTo = (offset) => {
      const wrappedRef = this.getWrappedRef()

      wrappedRef.scrollTo({ x: offset, y: 0, animated: true })
    }

    onScroll = (event) => {
      const { onScroll } = this.props
      const scrollOffset = this.getScrollOffset(event)
      const nextActiveItem = this.getActiveItem(scrollOffset)

      const itemReached = nextActiveItem === this.itemToSnapTo
      const scrollConditions = scrollOffset >= this.scrollOffsetRef
            && scrollOffset <= this.scrollOffsetRef

      this.currentContentOffset = scrollOffset

      if (this.activeItem !== nextActiveItem && itemReached) {
        if (scrollConditions) {
          this.activeItem = nextActiveItem
        }
      }

      return onScroll && onScroll()
    }

    onScrollBeginDrag = (event) => {
      this.scrollStartOffset = this.getScrollOffset(event)
      this.scrollStartActive = this.getActiveItem(this.scrollStartOffset)
    }

    onScrollEndDrag = (event) => {
      const { onScrollEndDrag } = this.props

      if (this.carouselRef) {
        return this.onScrollEnd && this.onScrollEnd(event)
      }

      return onScrollEndDrag()
    }

    onScrollEnd = () => {
      this.scrollEndOffset = this.currentContentOffset
      this.scrollEndActive = this.getActiveItem(this.scrollEndOffset)

      this.snapScroll(this.scrollEndOffset - this.scrollStartOffset)
    }

    onLayout = () => {
      if (this.onLayoutInitDone) {
        this.initPositions()
        this.snapToItem(this.activeItem)
      } else {
        this.onLayoutInitDone = true
      }
    }

    snapScroll = (delta) => {
      if (!this.scrollEndActive && this.scrollEndActive !== 0 && ios) {
        this.scrollEndActive = this.scrollStartActive
      }

      if (this.scrollStartActive !== this.scrollEndActive) {
        this.snapToItem(this.scrollEndActive)
      } else if (delta > 0) {
        this.snapToItem(this.scrollStartActive + 1)
      } else if (delta < 0) {
        this.snapToItem(this.scrollStartActive - 1)
      } else {
        this.snapToItem(this.scrollEndActive)
      }
    }

    snapToItem = (index) => {
      const { itemWidth } = this.props
      this.activeItem = index

      if (index !== this.previousActiveItem) {
        this.previousActiveItem = index
      }

      this.itemToSnapTo = index
      this.scrollOffsetRef = this.positions[index]
      && this.positions[index].start - ((deviceWidth - itemWidth) / 2) + 8

      if (!this.scrollOffsetRef && this.scrollOffsetRef !== 0) {
        return
      }

      this.currentContentOffset = this.scrollOffsetRef < 0 ? 0 : this.scrollOffsetRef

      this.scrollTo(this.scrollOffsetRef)
    }

    snapToNext = () => {
      const { onScrollEndDrag } = this.props
      const itemsLength = this.getCustomDataLength()

      const newIndex = this.activeItem + 1
      if (newIndex > itemsLength - 1) {
        return
      }

      setTimeout(() => this.snapToItem(newIndex), 500)
      onScrollEndDrag()
    }

    snapToPrev = () => {
      const { onScrollEndDrag } = this.props
      const newIndex = this.activeItem - 1
      if (newIndex < 0) {
        return
      }
      setTimeout(() => this.snapToItem(newIndex), 500)
      onScrollEndDrag()
    }

    renderItem = ({ item, index }) => {
      const { renderItem } = this.props

      const specificProps = {
        key: this.getKeyExtractor(item, index)
      }

      return (
        <ItemWrapper
          pointerEvents="box-none"
          {...specificProps}
        >
          { renderItem({ item, index }) }
        </ItemWrapper>
      )
    }

    getComponentStaticProps = () => {
      const {
        data,
        oneColumn,
        sliderWidth
      } = this.props

      const containerStyle = [
        { width: sliderWidth, flexDirection: 'row' }
      ]
      const contentContainerStyle = {
        paddingLeft: oneColumn ? 16 : 8,
        paddingTop: 8,
        paddingBottom: 8
      }

      return {
        // eslint-disable-next-line no-return-assign
        ref: c => this.carouselRef = c,
        data,
        style: containerStyle,
        contentContainerStyle,
        horizontal: true,
        scrollEventThrottle: 1,
        onScroll: this.onScroll,
        onScrollBeginDrag: this.onScrollBeginDrag,
        onScrollEndDrag: this.onScrollEndDrag,
        onLayout: this.onLayout
      }
    }

    render() {
      const props = {
        decelerationRate: 'fast',
        showsHorizontalScrollIndicator: false,
        overScrollMode: 'never',
        automaticallyAdjustContentInsets: true,
        directionalLockEnabled: true,
        pinchGestureEnabled: false,
        scrollsToTop: false,
        renderToHardwareTextureAndroid: true,
        ...this.props,
        ...this.getComponentStaticProps()
      }
      const { data, oneColumn } = this.props

      return (
        <ScrollView {...props} scrollEnabled={!oneColumn}>
          {data.map((item, index) => this.renderItem({ item, index }))}
        </ScrollView>
      )
    }
}

Carousel.propTypes = {
  data: array,
  itemWidth: number.isRequired,
  oneColumn: bool,
  onScroll: func,
  onScrollEndDrag: func,
  renderItem: func.isRequired,
  sliderWidth: number.isRequired
}

Carousel.defaultProps = {
  oneColumn: false,
  onScroll: () => {},
  onScrollEndDrag: () => {}
}

export default Carousel
