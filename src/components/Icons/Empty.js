import React from 'react'
import { Image } from 'react-native'

export const Empty = (color) => (
  <Image
    style={{
      tintColor: color.color,
      width: 40,
      height: 40
    }}
    source={require('../../assets/icons/emptyBox.png')}
  />
)
