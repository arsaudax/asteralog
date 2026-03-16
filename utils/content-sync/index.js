import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
import matter from 'gray-matter'
import slugify from 'slugify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE = './content'
const GARDEN_DEST = './content-garden'
const BLOG_DEST = './content-blog'

console.log('\n🔄 Запуск синхронизации Asteralog...\n')

// Очищаем целевые папки
console.log('🧹 Очистка целевых директорий...')
fs.emptyDirSync(GARDEN_DEST)
fs.emptyDirSync(BLOG_DEST)
console.log('  ✓ Директория сада очищена')
console.log('  ✓ Директория блога очищена\n')

// Получаем все markdown файлы
const files = await glob('**/*.md', { 
  cwd: SOURCE, 
  ignore: ['**/node_modules/**', '**/private/**']
})
console.log(`📊 Найдено ${files.length} markdown файлов в источнике\n`)

let gardenCount = 0
let blogCount = 0
let bothCount = 0
let privateCount = 0

for (const file of files) {
  const sourcePath = path.join(SOURCE, file)
  const content = await fs.readFile(sourcePath, 'utf8')
  const { data: frontmatter } = matter(content)

  const tags = frontmatter.tags || []
  const hasGarden = tags.includes('garden')
  const hasBlog = tags.includes('blog')
  
  // Транслитерация имени файла
  const dir = path.dirname(file)
  const ext = path.extname(file)
  const basename = path.basename(file, ext)
  const slug = slugify(basename, { lower: true, strict: true })
  const newFilename = dir === '.' ? `${slug}${ext}` : path.join(dir, `${slug}${ext}`)

  // Копируем в сад
  if (hasGarden) {
    const destPath = path.join(GARDEN_DEST, newFilename)
    await fs.ensureDir(path.dirname(destPath))
    await fs.copyFile(sourcePath, destPath)
  }

  // Копируем в блог
  if (hasBlog) {
    const destPath = path.join(BLOG_DEST, newFilename)
    await fs.ensureDir(path.dirname(destPath))
    await fs.copyFile(sourcePath, destPath)
  }

  // Подсчёты
  if (hasGarden && hasBlog) {
    bothCount++
    console.log(`📄 ${file} → сад + блог`)
  } else if (hasGarden) {
    gardenCount++
    console.log(`📄 ${file} → сад`)
  } else if (hasBlog) {
    blogCount++
    console.log(`📄 ${file} → блог`)
  } else {
    privateCount++
    console.log(`📄 ${file} → приватно`)
  }
}

// Копируем ассеты
if (await fs.pathExists(path.join(SOURCE, 'assets'))) {
  await fs.copy(
    path.join(SOURCE, 'assets'),
    path.join(GARDEN_DEST, 'assets')
  )
  await fs.copy(
    path.join(SOURCE, 'assets'),
    path.join(BLOG_DEST, 'assets')
  )
  console.log('\n📁 Ассеты скопированы')
}

console.log('\n✅ Синхронизация завершена!')
console.log(`   Сад: ${gardenCount + bothCount} файлов`)
console.log(`   Блог: ${blogCount + bothCount} файлов`)
console.log(`   Везде: ${bothCount} файлов`)
console.log(`   Приватно: ${privateCount} файлов\n`)