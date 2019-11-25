import React from 'react'
import {
  number,
  string
} from 'prop-types'
import {
  colors,
  fonts
} from '../../constants'
import { Empty } from '../Icons'
import {
  EmptyWrapper,
  Paragraph
} from './EmptyColumn.styled'

const EmptyColumn = ({
  emptyIconColor,
  emptyText,
  emptyTextColor,
  emptyTextFontFamily,
  emptyTextFontSize,
  marginTop
}) =>  (
  <EmptyWrapper marginTop={marginTop}>
    <Empty color={emptyIconColor} />
    <Paragraph
      color={emptyTextColor}
      fontFamily={emptyTextFontFamily}
      fontSize={emptyTextFontSize}
    >
      {emptyText}
    </Paragraph>
  </EmptyWrapper>
)

EmptyColumn.defaultProps = {
  emptyIconColor: colors.blurple,
  emptyText: 'No items',
  emptyTextColor: colors.bay,
  emptyTextFontFamily: '',
  emptyTextFontSize: 16
}

EmptyColumn.propTypes = {
  emptyIconColor: string.isRequired,
  emptyText: string.isRequired,
  emptyTextColor: string.isRequired,
  emptyTextFontFamily: string.isRequired,
  emptyTextFontSize: number.isRequired,
  marginTop: number.isRequired
}

export default EmptyColumn
