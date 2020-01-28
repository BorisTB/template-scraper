import config from '../config'
import puppeteer from 'puppeteer-extra'
import puppeteerStealthPlugin from 'puppeteer-extra-plugin-stealth'
import { blockedResourceTypes, skippedResources } from './blacklist'

puppeteer.use(puppeteerStealthPlugin())

class Scraper {
  browser = null
  page = null

  connect = async () => {
    this.browser = await this.#connectToBrowser()
    this.page = await this.browser.newPage()
    await this.#setRequestFilter()
  }

  #connectToBrowser = () =>
    puppeteer.connect({
      browserWSEndpoint: config.browserWSEndpoint
    })

  #setRequestFilter = async () => {
    // skip and block files we don't need
    await this.page.setRequestInterception(true)

    this.page.on('request', request => {
      const requestUrl = request._url.split('?')[0].split('#')[0]

      if (
        blockedResourceTypes.includes(request.resourceType()) ||
        skippedResources.some(resource => requestUrl.includes(resource))
      ) {
        request.abort()
      } else {
        request.continue()
      }
    })
  }
}

export { Scraper }
