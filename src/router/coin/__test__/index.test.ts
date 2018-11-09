import { getOnlyPrice, countRatio } from '../'

describe('coin/index.ts', () => {
  it('gets only price of coin', async () => {
    const { price, image } = await getOnlyPrice('sbd', 'usd')
    expect(price).toBeTruthy()
  })
})
