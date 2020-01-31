import { blockResources } from '../utils'

const URL = 'http://example.com'

const indexScraper = ({ store, cluster }) => async ({ page, data: { query, limit } }) => {
  await blockResources(page)

  await page.goto(URL)
  await page.waitForSelector('h1')

  const indexStoreNode = store.getOrCreateNode(URL)

  const indexContent = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText.trim()
    const contentNodes = document.querySelectorAll('p')

    const content = Array.from(contentNodes).map(contentNode => {
      const linkNode = contentNode.querySelector('[href]')
      if (linkNode) {
        return {
          url: new URL(linkNode.getAttribute('href'), window.location.origin).toString(),
          text: linkNode.innerText.trim()
        }
      }

      return {
        text: contentNode.innerText.trim()
      }
    })

    return {
      title,
      content
    }
  })

  indexStoreNode.setValue('title', indexContent.title)
  indexStoreNode.setValue('content', indexContent.content)
}

export { indexScraper }
