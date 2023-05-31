import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import { Window } from 'happy-dom'

const window = new Window({
  innerWidth: 1200,
  innerHeight: 768,
})

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

beforeEach(() => {
  window.happyDOM.setInnerWidth(1200)
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
