import React from 'react'
import { Animated } from 'react-native'
import {
  bool,
  func,
  number,
  object,
  shape,
  string
} from 'prop-types'
import {
  colors,
  fonts,
  deviceWidth
} from '../../constants'
import { Next } from '../Icons'
import {
  CardContainer,
  CardWrapper,
  ColumnWrapper,
  IconRowWrapper,
  Paragraph,
  RowWrapper
} from './Card.styled'

const Card = ({
    cardBackground,
    cardBorderRadius,
    cardContent,
    cardDescriptionTextColor,
    cardDescriptionFontSize,
    cardDescriptionFontFamily,
    cardIconColor,
    cardNameTextColor,
    cardNameFontSize,
    cardNameFontFamily,
    hidden,
    item,
    isCardWithShadow,
    onPress,
    onPressIn,
    style,
}) => {
  const styles = [style]
  if (hidden) {
    styles.push({ opacity: 0 })
  }

  return (
      <CardWrapper
          onPressIn={(evt) => onPressIn ? onPressIn(evt.nativeEvent.pageY) : {}}
          onPress={onPress}
          collapsable={false}
      >
        <Animated.View style={styles}>
          {cardContent !== undefined ? cardContent(item ? { item: item }  : {}) ://Dung edit row

              <CardContainer
                  backgroundColor={cardBackground}
                  borderRadius={cardBorderRadius}
                  elevation={isCardWithShadow ? 5 : 0}
                  shadowOpacity={isCardWithShadow ? 0.1 : 0}
              >
                <RowWrapper>
                  <IconRowWrapper width={deviceWidth / 2 - 28}>
                    <ColumnWrapper>
                      <Paragraph
                          fontSize={cardNameFontSize}
                          fontFamily={cardNameFontFamily}
                          color={cardNameTextColor}
                      >
                        {item ? item.row().name : ''}
                      </Paragraph>
                      <Paragraph
                          fontSize={cardDescriptionFontSize}
                          fontFamily={cardDescriptionFontFamily}
                          color={cardDescriptionTextColor}
                      >
                        {item ? item.row().description : ''}
                      </Paragraph>
                    </ColumnWrapper>
                  </IconRowWrapper>
                  <Next color={cardIconColor} />
                </RowWrapper>
              </CardContainer>
          }

        </Animated.View>
      </CardWrapper>
  )
}

Card.defaultProps = {
  cardBackground: colors.white,
  cardBorderRadius: 10,
  cardDescriptionTextColor: colors.bay,
  cardDescriptionFontSize: 14,
  cardDescriptionFontFamily: '',
  cardIconColor: colors.blurple,
  cardNameTextColor: colors.blurple,
  cardNameFontSize: 18,
  cardNameFontFamily: '',
  isCardWithShadow: true
}

Card.propTypes = {
  cardBackground: string.isRequired,
  cardBorderRadius: number.isRequired,
  cardContent: func,
  cardDescriptionTextColor: string.isRequired,
  cardDescriptionFontSize: number.isRequired,
  cardDescriptionFontFamily: string.isRequired,
  cardIconColor: string.isRequired,
  cardNameTextColor: string.isRequired,
  cardNameFontSize: number.isRequired,
  cardNameFontFamily: string.isRequired,
  hidden: bool,
  item: object,
  isCardWithShadow: bool.isRequired,
  onPress: func,
  onPressIn: func,
  style: shape({ string }),
}

export default Card
