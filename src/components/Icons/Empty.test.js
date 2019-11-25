import React from 'react'
import renderer from 'react-test-renderer'
import { Empty } from './index'

describe('Icon component', () => {
  describe('Renders correctly', () => {
    test('it renders Default Empty Icon', () => {
      const tree = renderer.create(
        <Empty
          color="#FFFFFF"
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
