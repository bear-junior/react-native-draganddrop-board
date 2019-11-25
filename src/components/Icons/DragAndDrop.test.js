import React from 'react'
import renderer from 'react-test-renderer'
import { DragAndDrop } from './index'

describe('Icon component', () => {
  describe('Renders correctly', () => {
    test('it renders Default DragAndDrop Icon', () => {
      const tree = renderer.create(
        <DragAndDrop
          color="#FFFFFF"
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
