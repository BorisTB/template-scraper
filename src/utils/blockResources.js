const blockedResourceTypes = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset'
]

const skippedResources = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn'
]

const blockResources = async (page) => {
  await page.setRequestInterception(true)

  page.on('request', request => {
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

export { blockResources }
