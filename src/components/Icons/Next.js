import React from 'react'
import { Image } from 'react-native'

export const Next = (color) => (
  <Image
    style={{
      tintColor: color.color,
      width: 25,
      height: 25
    }}
    source={require('../../assets/icons/next.png')}
  />
)
