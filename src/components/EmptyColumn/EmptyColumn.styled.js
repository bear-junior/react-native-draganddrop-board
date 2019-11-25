import styled from 'styled-components'
import {
  color,
  fontFamily,
  fontSize
} from 'styled-system'

const EmptyWrapper = styled.View`
  justifyContent: center;
  alignItems: center;
`

const Paragraph = styled.Text`
  ${fontFamily};
  ${fontSize};
  ${color};
`

export {
  EmptyWrapper,
  Paragraph
}
