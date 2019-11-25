<div align="center">
  <image align="center" src="./src/assets/images/header.png"/>
</div>

# Introduction 

react-native-draganddrop-board is a simple React Native library, enabling to create a scrollable board component with carousel, sortable columns and draggable cards for your iOS and Android apps.



# Installation

Install library via `npm` or `yarn`

`npm install react-native-draganddrop-board` or `yarn add react-native-draganddrop-board`

# In Use

First you need to build and fill with data `BoardRepository`:

```js
import { BoardRepository } from 'react-native-draganddrop-board'

const data = [
  {
    id: 1,
    name: 'TO DO',
    rows: [
      {
        id: '1',
        name: 'Analyze your audience',
        description: 'Learn more about the audience to whom you will be speaking'
      },
      {
        id: '2',
        name: 'Select a topic',
        description: 'Select a topic that is of interest to the audience and to you'
      },
      {
        id: '3',
        name: 'Define the objective',
        description: 'Write the objective of the presentation in a single concise statement'
      }
    ]
  },
  {
    id: 2,
    name: 'IN PROGRESS',
    rows: [
      {
        id: '4',
        name: 'Look at drawings',
        description: 'How did they use line and shape? How did they shade?'
      },
      {
        id: '5',
        name: 'Draw from drawings',
        description: 'Learn from the masters by copying them'
      },
      {
        id: '6',
        name: 'Draw from photographs',
        description: 'For most people, it’s easier to reproduce an image that’s already two-dimensional'
      }
    ]
  },
  {
    id: 3,
    name: 'DONE',
    rows: [
      {
        id: '7',
        name: 'Draw from life',
        description: 'Do you enjoy coffee? Draw your coffee cup'
      },
      {
        id: '8',
        name: 'Take a class',
        description: 'Check your local university extension'
      }
    ]
  }
]

const boardRepository = new BoardRepository(data);
```

Then you can render the `Board`:

```jsx
import { Board } from 'react-native-draganddrop-board'

  <Board
    boardRepository={boardRepository}
    open={() => {}
    onDragEnd={() => {}}
  />
```

# Board component

| Property | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| boardRepository | `BoardRepository` | yes | object that holds data |
| boardBackground | `string` | no | board background color |
| open | `function` | yes | function invoked when item is pressed, returns item |
| onDragEnd | `function` | yes | function invoked when drag is finished, returns srcColumnId, destColumnId, draggedItem |

# Card component

If you want to use default Card you should build your boardRepository with rows that have elements `id`, `name`and `description`:

```
  {
     id: '1',
     name: 'Analyze your audience',
     description: 'Learn more about the audience to whom you will be speaking'
  }
```

| Property | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| cardNameTextColor | `string` | no | color of the first line (name) |
| cardNameFontSize | `number` | no | font size of of the first line (name) |
| cardNameFontFamily | `string` | no | font family of the first line (name) |
| cardDescriptionTextColor | `string` | no | color of the second line (description) |
| cardDescriptionFontSize | `number` | no | font size of the second line (description) |
| cardDescriptionFontFamily | `string` | no | font family of the second line (description) |
| cardIconColor | `string` | no | color of the icon (arrow) |


If you need to have another elements in rows, then you can use `cardContent` prop - it's a function that returns item element and can take another Components to fill Card.

```jsx
import { Text, View } from 'react-native'
import { Board } from 'react-native-draganddrop-board'

  <Board
    boardRepository={boardRepository}
    open={() => {}
    onDragEnd={() => {}}
    cardContent={(item) => (<View><Text>{item.name}</Text></View>)}
  />
```

| Property | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| cardBackground | `string` | no | card background color |
| cardBorderRadius | `number` | no | card border radius value |
| isCardWithShadow | `bool` | no | add shadow to card component |

# Column component

| Property | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| badgeBackgroundColor | `string` | no | color of the count badge |
| badgeBorderRadius | `number` | no | count badge border radius |
| badgeHeight | `number` | no | height of the count badge |
| badgeWidth | `string` | no | width of the count badge |
| badgeTextColor | `string` | no | color of the count badge |
| badgeFontSize | `number` | no | font size of the count badge |
| badgeFontFamily | `string` | no | font family of the count badge |
