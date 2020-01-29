import { Cluster } from 'puppeteer-cluster'
import puppeteer from 'puppeteer-extra'
import puppeteerStealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Store } from './Store'
import { indexScraper } from './scrapers'

puppeteer.use(puppeteerStealthPlugin())

const run = async (searchQuery, limit) => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteer
  });

  const store = new Store()

  await cluster.task(indexScraper({ store, cluster }))

  cluster.queue({ query: searchQuery, limit })

  await cluster.idle();
  await cluster.close();
}

run('day trip Ohio', 4)
