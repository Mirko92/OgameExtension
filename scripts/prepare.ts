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

function getFakeData(file: string) {
  return fs.readJSON(r(`fake_data/${file}`))
}

export async function copyFile(file: string) {
  logger('PRE', file)

  const path = 'extension/dist/data'
  try {
    await fs.ensureDir(r(path))

    await fs.writeJSON(
      r(path + '/' + file),
      await getFakeData(file), 
      { spaces: 2 }
    )
  } catch (e: any) {
    logger('ERROR', `Can't copy ${file}`)
  }
}

export async function copyFiles() {
  const files = [
    "data_v1.json",
    "db_2022-03-22.json",
    "db_2022-03-23.json",
  ]

  for (const file of files) {
    await copyFile(file)
  }

}

writeManifest()


if (isDev) {
  stubIndexHtml()

  copyFiles()

  chokidar.watch(r('views/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
    
}
