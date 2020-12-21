import { split } from './html'

test('utility/html.split', () => {
  const LOREM_IPSU = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
  expect(split('', 0)).toEqual([''])
  expect(split(LOREM_IPSU, 1)).toEqual(LOREM_IPSU.split(' '))
  expect(split(LOREM_IPSU, 10)).toEqual([
    "Lorem Ipsum",
    "is simply dummy",
    "text of the",
    "printing and",
    "typesetting",
    "industry. Lorem",
    "Ipsum has been",
    "the industry's",
    "standard dummy",
    "text ever since",
    "the 1500s,",
    "when an unknown",
    "printer took",
    "a galley of",
    "type and scrambled",
    "it to make",
    "a type specimen",
    "book.",
  ])
  expect(split(LOREM_IPSU, 100)).toEqual([
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
    "standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled",
    "it to make a type specimen book.",
  ])
})
