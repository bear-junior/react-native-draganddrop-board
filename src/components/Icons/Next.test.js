import React from 'react'
import renderer from 'react-test-renderer'
import { Next } from './index'

describe('Icon component', () => {
  describe('Renders correctly', () => {
    test('it renders Default Next Icon', () => {
      const tree = renderer.create(
        <Next
          color="#FFFFFF"
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
