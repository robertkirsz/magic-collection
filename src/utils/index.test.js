import { manaLettersToIcons, manaLettersToArray } from './'

test('manaLettersToIcons', () => {
  expect(manaLettersToIcons('Something {R}')).toBe('Something <i class="ms ms-cost ms-r"></i>')
})

test('manaLettersToArray', () => {
  expect(manaLettersToArray('{2}{R}')).toEqual(['ms ms-cost ms-2', 'ms ms-cost ms-r'])
})
