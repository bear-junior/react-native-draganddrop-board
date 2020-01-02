import styled from 'styled-components/native'
import {
  borderRadius,
  color,
  fontFamily,
  fontSize,
  marginRight,
  lineHeight
} from 'styled-system'

const ColumnWrapper = styled.View`
  paddingHorizontal: 8;
  ${borderRadius};
  ${marginRight};
  ${props => `height: ${props.columnHeight}`}
`

const ParagraphWrapper = styled.View`
  alignItems: center;
  justifyContent: center;
`

const RowContainer = styled.View`
  flexDirection: row;
  alignItems: center;
  paddingVertical: 18;
  paddingHorizontal: 10;
`

const Paragraph = styled.Text`
  ${fontFamily};
  ${fontSize};
  ${color};
  ${lineHeight};
`

const RowWrapper = styled.View`
  opacity: 1;
`

const SumWrapper = styled.View`
  marginLeft: 8;
  alignItems: center;
  justifyContent: center;
`

export {
  ColumnWrapper,
  ParagraphWrapper,
  Paragraph,
  RowContainer,
  RowWrapper,
  SumWrapper
}
