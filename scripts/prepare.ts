// generate stub index.html files for dev entry
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { getManifest } from '../src/manifest'
import { r, port, isDev, logger } from './utils'
/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
  const views = [
    'options',
    'popup',
    'app'
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    let data = await fs.readFile(r(`views/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
      // .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
    await fs.writeFile(r(`extension/dist/${view}/index.html`), data, 'utf-8')
    logger('PRE', `stub ${view}`)
  }
}

export async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 })
  logger('PRE', 'write manifest.json')
}

function getFakeData() {
  return fs.readJSON(r(`fake_data/data_v1.json`))
}

export async function copyFakeData() {
  logger('PRE', 'copying data_v1.json')

  const path = 'extension/dist/data'
  try {
    await fs.ensureDir(r(path))

    await fs.writeJSON(
      r(path + '/data_v1.json'),
      await getFakeData(), 
      { spaces: 2 }
    )
  } catch (e: any) {
    logger('ERROR', "Can't copy data_v1.json")
  }
}

writeManifest()


if (isDev) {
  stubIndexHtml()

  copyFakeData()

  chokidar.watch(r('views/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
    
}
