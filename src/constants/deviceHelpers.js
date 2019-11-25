import {
  Dimensions,
  Platform
} from 'react-native'

const deviceHeight = Dimensions.get('window').height

const deviceWidth = Dimensions.get('window').width

const ios = Platform.OS === 'ios'

const isX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    && Dimensions.get('window').height > 800

export {
  deviceHeight,
  deviceWidth,
  ios,
  isX
}
