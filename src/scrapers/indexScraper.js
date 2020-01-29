import { blockResources } from '../utils'

const URL = 'http://example.com'

const indexScraper = ({ store, cluster }) => async ({ page, data: { query, limit } }) => {
  await blockResources(page)

  await page.goto(URL)
  await page.waitForSelector('body')

  const items = await page.evaluate(() => {
    const resultNodes = document.querySelectorAll('.result')
    const results = Array.from(resultNodes).map(resultNode => {
      const url = new URL(resultNode.querySelector('[href]').getAttribute('href'), window.location.origin).toString()

      return {
        title: resultNode.querySelector('.result-title').innerText.trim(),
        category: resultNode.querySelector('.thumbnail-overlay-tag').innerText.trim(),
        url
      }
    })
    return results
  })

  items.forEach(item => {
    const node = store.getOrCreateNode(item.url)

    Object.keys(item).forEach(objKey => {
      node.setValue(objKey, item[objKey])
    })
  })

  console.log(items)
}

export { indexScraper }
