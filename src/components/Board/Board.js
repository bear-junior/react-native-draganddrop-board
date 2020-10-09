import React from 'react'
import ReactTimeout from 'react-timeout'
import {
  Animated,
  PanResponder,
  StatusBar
} from 'react-native'
import {
  func,
  object,
  string
} from 'prop-types'
import {
  colors,
  deviceWidth,
  ios,
  isX
} from '../../constants'
import Column from '../Column/Column'
import Card from '../Card/Card'
import Carousel from '../Carousel/Carousel'
import { BoardWrapper } from './Board.styled'

const MAX_RANGE = 100
const MAX_DEG = 30
const CARD_WIDTH = 0.85 * deviceWidth
const STATUSBAR_HEIGHT = ios ? (isX() ? 44 : 20) : StatusBar.currentHeight

class Board extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boardPositionY: 0,
      rotate: new Animated.Value(0),
      pan: new Animated.ValueXY(),
      startingX: 0,
      startingY: 0,
      movingMode: false
    }

    this.varticalOffset = 0

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => this.state.movingMode,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease
    })
  }

  componentDidMount() {
    this.val = { x: 0, y: 0 }
    // eslint-disable-next-line no-return-assign
    this.state.pan.addListener((value) => this.val = value)

  }

  componentWillUnmount() {
    this.unsubscribeFromMovingMode()
  }

  onPanResponderMove = (event, gesture) => {
    const {
      draggedItem,
      movingMode,
      pan,
      startingX
    } = this.state
    const { boardRepository } = this.props

    if (movingMode) {
      this.x = event.nativeEvent.pageX
      this.y = event.nativeEvent.pageY

      Animated.event([
        null, { dx: pan.x, dy: pan.y }
      ])(event, gesture)

      if (startingX + gesture.dx < -50 && gesture.vx < 0) {
        this.carousel.snapToPrev()
      }
      if (startingX + gesture.dx + CARD_WIDTH - 50 > deviceWidth && gesture.vx > 0) {
        this.carousel.snapToNext()
      }

      const columnId = this.carousel.currentIndex
      const columnAtPosition = boardRepository
        .move(draggedItem, this.x, this.y, columnId)
      if (columnAtPosition) {
        const { scrolling, offset } = boardRepository
          .scrollingPosition(columnAtPosition, this.x, this.y, columnId)
        if (this.shouldScroll(scrolling, offset, columnAtPosition)) {
          this.scroll(columnAtPosition, draggedItem, offset)
        }
      }
    }
  }

  shouldScroll = (scrolling, offset, column) => {
    const placeToScroll = ((offset < 0
      && column.scrollOffset() > 0)
      || (offset > 0 && column.scrollOffset() < column.contentHeight()))

    return scrolling && offset !== 0 && placeToScroll
  }

  onScrollingStarted = () => {
    this.scrolling = true
  }

  onScrollingEnded = () => {
    this.scrolling = false
  }

  scroll = (column, draggedItem, anOffset) => {
    const { requestAnimationFrame, boardRepository } = this.props

    if (!this.scrolling) {
      this.onScrollingStarted()
      const scrollOffset = column.scrollOffset() + 80 * anOffset
      boardRepository.setScrollOffset(column.id(), scrollOffset)

      column.listView().scrollToOffset({ offset: scrollOffset })
    }

    boardRepository.move(draggedItem, this.x, this.y)
    const { scrolling, offset } = boardRepository.scrollingPosition(column, this.x, this.y)
    if (this.shouldScroll(scrolling, offset, column)) {
      requestAnimationFrame(() => {
        this.scroll(column, draggedItem, offset)
      })
    }
  }

  endMoving = () => {
    this.setState({ movingMode: false })
    const { draggedItem, pan, srcColumnId } = this.state
    const { boardRepository, onDragEnd } = this.props

    boardRepository.show(draggedItem.columnId(), draggedItem)
    boardRepository.notify(draggedItem.columnId(), 'reload')

    const destColumnId = draggedItem.columnId()
    pan.setValue({ x: 0, y: 0 })
    this.setState({ startingX: 0, startingY: 0 })

    return onDragEnd && onDragEnd(srcColumnId, destColumnId, draggedItem)
  }

  onPanResponderRelease = () => {
    const { movingMode } = this.state
    this.x = null
    this.y = null

    if (movingMode) {
      this.rotate(0)
      setTimeout(this.endMoving, 100)
    } else if (this.scrolling) {
      this.unsubscribeFromMovingMode()
    }
  }

  rotate = (toValue) => {
    const { rotate } = this.state
    Animated.spring(
      rotate,
      {
        toValue,
        friction: 5,
        useNativeDriver: true
      }
    ).start()
  }

  cancelMovingSubscription = () => {
    const { clearTimeout } = this.props

    clearTimeout(this.movingSubscription)
  }

  unsubscribeFromMovingMode = () => {
    this.cancelMovingSubscription()
  }

  onPressIn = (columnId, item, dy) => {
    const { boardPositionY } = this.state
    const {
      boardRepository,
      setTimeout
    } = this.props

    if (item.isLocked()) {
      return
    }

    if (!item || (item.isLocked() && this.scrolling)) {
      this.unsubscribeFromMovingMode()

      return
    }
    this.movingSubscription = setTimeout(() => {
      if (!item || !item.layout()) {
        return
      }

      const lastColumn = boardRepository.columns().length - 1
      const columnIndex = this.carousel.currentIndex

      let x

      if (columnIndex === 0) {
        x = 16
      } else if (columnIndex > 0 && columnIndex < lastColumn) {
        x = ((deviceWidth - (0.78 * deviceWidth) + 16) / 2)
      } else if (columnIndex === lastColumn) {
        x = deviceWidth - (0.78 * deviceWidth)
      }

      const { y } = item.layout()

      if (columnId - 1 === columnIndex) {
        boardRepository.hide(columnId, item)
        this.setState({
          movingMode: true,
          draggedItem: item,
          srcColumnId: item.columnId(),
          startingX: x,
          startingY: dy - boardPositionY - STATUSBAR_HEIGHT - (ios ? 0 : (dy - y))
        })
        this.rotate(MAX_DEG)
      }
    }, 200)
  }

  onPress = (columnId, item) => {
    const { open } = this.props
    const { movingMode } = this.state

    if (item.isLocked()) {
      return
    }

    return () => {
      this.unsubscribeFromMovingMode()

      if (item.isLocked()) {
        return
      }

      if (!movingMode) {
        const columnIndex = this.carousel.currentIndex

        if (columnId - 1 === columnIndex) {
          open(item.row())
        }
      } else {
        this.endMoving()
      }
    }
  }

  onScrollEnd = () => {
    const { boardRepository } = this.props
    boardRepository.updateColumnsLayoutAfterVisibilityChanged()
  }

  movingStyle = (zIndex) => {
    const { pan, rotate, startingX, startingY } = this.state
    const interpolatedRotateAnimation = rotate.interpolate({
      inputRange: [-MAX_RANGE, 0, MAX_RANGE],
      outputRange: [`-${MAX_DEG}deg`, '0deg', `${MAX_DEG}deg`]
    })

    return {
      position: 'absolute',
      zIndex,
      top: startingY,
      left: startingX,
      width: CARD_WIDTH - 16,
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { rotate: interpolatedRotateAnimation }
      ]
    }
  }

  movingTask = () => {
    const { draggedItem, movingMode } = this.state
    const zIndex = movingMode ? 1 : -1
    const data = { item: draggedItem,
      hidden: !movingMode,
      style: this.movingStyle(zIndex) }

    return this.renderWrapperRow(data)
  }

  renderWrapperRow = (data) => (
    <Card
      {...data}
      {...this.props}
      width={CARD_WIDTH}
    />
  )

  setScrollViewRef = (element) => {
    this.scrollViewRef = element
  }

  setBoardPositionY = (y) => {
    this.setState({ boardPositionY: y })
  }

  render() {
    const { movingMode } = this.state
    const {
      boardBackground,
      boardRepository
    } = this.props

    return (
      <BoardWrapper
        {...this.panResponder.panHandlers}
        onLayout={(evt) => this.setBoardPositionY(evt.nativeEvent.layout.y)}
        backgroundColor={boardBackground}
      >
        <Carousel
          ref={(c) => { this.carousel = c }}
          data={boardRepository.columns()}
          onScrollEndDrag={this.onScrollEnd}
          onScroll={this.cancelMovingSubscription}
          scrollEnabled={!movingMode}
          renderItem={item => (
            <Column
              {...this.props}
              key={item.item.data().id.toString()}
              column={item.item}
              movingMode={movingMode}
              boardRepository={boardRepository}
              onPressIn={this.onPressIn}
              onPress={this.onPress}
              renderWrapperRow={this.renderWrapperRow}
              onScrollingStarted={this.onScrollingStarted}
              onScrollingEnded={this.onScrollingEnded}
              unsubscribeFromMovingMode={this.cancelMovingSubscription}
              oneColumn={boardRepository.columns().length === 1}
            />
          )}
          sliderWidth={deviceWidth}
          itemWidth={CARD_WIDTH}
          oneColumn={boardRepository.columns().length === 1}
        />

        {this.movingTask()}
      </BoardWrapper>
    )
  }
}

Board.defaultProps = {
  boardBackground: colors.deepComaru
}

Board.propTypes = {
  boardBackground: string.isRequired,
  clearTimeout: func.isRequired,
  onDragEnd: func.isRequired,
  open: func.isRequired,
  requestAnimationFrame: func.isRequired,
  boardRepository: object.isRequired,
  setTimeout: func.isRequired
}

export default ReactTimeout(Board)
