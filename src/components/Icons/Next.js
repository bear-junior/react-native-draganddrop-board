import React from 'react'
import Svg, { Polygon } from 'react-native-svg'

export const Next = (color) => (
  <Svg width={20} height={20} viewBox="0 0 476.213 476.213">
    <Polygon points="345.606,107.5 324.394,128.713 418.787,223.107 0,223.107 0,253.107
      418.787,253.107 324.394,347.5
      345.606,368.713 476.213,238.106 "
    fill={color.color}
    />
  </Svg>
)
