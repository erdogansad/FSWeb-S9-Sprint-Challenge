import server from '../../backend/mock-server'
import React from 'react'
import AppFunctional from './AppFunctional'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

jest.setTimeout(1000)
const waitForOptions = { timeout: 100 }, queryOptions = { exact: false }
let up, down, left, right, reset, submit, squares, coordinates, steps, message, email

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}

beforeAll(() => { server.listen() })
afterAll(() => { server.close() })
beforeEach(() => {
  render(<AppFunctional />)
  updateStatelessSelectors(document)
  updateStatefulSelectors(document)
})
afterEach(() => {
  server.resetHandlers()
  document.body.innerHTML = ''
})

describe("Uygulama", () => {
  test("Kareler kontrolü", () => {
    squares.forEach(square => expect(square).toBeInTheDocument);
    expect(squares.length).toEqual(9);
  })
  test("Yönlendirme butonları kontrolü", () => {
    expect(up).toBeInTheDocument();
    expect(down).toBeInTheDocument();
    expect(left).toBeInTheDocument();
    expect(right).toBeInTheDocument();
    expect(reset).toBeInTheDocument();
  });
  test("Girdi ve gönderme butonu kontrolü", () => {
    expect(email).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  })
  test("Çıktılar konttolü", () => {
    expect(coordinates).toBeInTheDocument();
    expect(steps).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  })
  test("Uygulama aksiyonları ve form kontrolü", async () => {
    fireEvent.click(up)
    fireEvent.click(down)
    fireEvent.click(left)
    fireEvent.click(right)
    fireEvent.change(email, { target: { value: 'test@deneme.xyz' } })
    fireEvent.click(submit)
    await screen.findByText('test win #75', queryOptions, waitForOptions)
  })
});