import { Scraper } from './Scraper'

const run = async () => {
  const scraper = new Scraper()
  await scraper.connect()
}

run()
