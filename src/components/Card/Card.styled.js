import styled from 'styled-components'
import {
  borderRadius,
  color,
  fontFamily,
  fontSize
} from 'styled-system'
import { colors } from '../../constants'

const CardContainer = styled.View`
  ${borderRadius}
  marginHorizontal: 8;
  paddingHorizontal: 16;
  paddingVertical: 15;
  width: 94.5%;
  shadow-radius: 15px;
  shadow-color: ${colors.black};
  shadow-offset: 0px 3px;
  marginTop: 4;
  marginBottom: 4;
`

const CardWrapper = styled.TouchableWithoutFeedback`
`

const ColumnWrapper = styled.View`
`

const IconRowWrapper = styled.View`
  flexDirection: row;
  alignItems: center;
`

const Paragraph = styled.Text`
  ${fontFamily};
  ${fontSize};
  ${color};
`

const RowWrapper = styled.View`
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
`

export {
  CardContainer,
  CardWrapper,
  ColumnWrapper,
  IconRowWrapper,
  Paragraph,
  RowWrapper
}
