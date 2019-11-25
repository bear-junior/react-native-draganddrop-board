import React from 'react'
import renderer from 'react-test-renderer'
import EmptyColumn from './EmptyColumn'

describe('EmptyColumn component', () => {
  describe('Renders correctly', () => {
    test('it renders Default EmptyColumn', () => {
      const tree = renderer.create(
        <EmptyColumn marginTop={40} />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
