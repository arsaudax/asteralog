const fs = require('fs-extra')
const path = require('path')
const matter = require('gray-matter')
const glob = require('glob')
const slugify = require('slugify')

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
const files = glob.sync('**/*.md', { cwd: SOURCE, ignore: ['**/node_modules/**'] })
console.log(`📊 Найдено ${files.length} markdown файлов в источнике\n`)

let gardenCount = 0
let blogCount = 0
let bothCount = 0
let privateCount = 0

files.forEach(file => {
  const sourcePath = path.join(SOURCE, file)
  const content = fs.readFileSync(sourcePath, 'utf8')
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
    fs.ensureDirSync(path.dirname(destPath))
    fs.copyFileSync(sourcePath, destPath)
    gardenCount++
  }

  // Копируем в блог
  if (hasBlog) {
    const destPath = path.join(BLOG_DEST, newFilename)
    fs.ensureDirSync(path.dirname(destPath))
    fs.copyFileSync(sourcePath, destPath)
    blogCount++
  }

  // Подсчёты
  if (hasGarden && hasBlog) bothCount++
  else if (hasGarden) gardenCount++
  else if (hasBlog) blogCount++
  else privateCount++
  
  console.log(`📄 ${file} → ${hasGarden ? 'сад ' : ''}${hasBlog ? 'блог' : ''}`)
})

// Копируем ассеты
if (fs.existsSync(path.join(SOURCE, 'assets'))) {
  fs.copySync(
    path.join(SOURCE, 'assets'),
    path.join(GARDEN_DEST, 'assets')
  )
  fs.copySync(
    path.join(SOURCE, 'assets'),
    path.join(BLOG_DEST, 'assets')
  )
  console.log('\n📁 Ассеты скопированы')
}

console.log('\n✅ Синхронизация завершена!')
console.log(`   Сад: ${gardenCount} файлов`)
console.log(`   Блог: ${blogCount} файлов`)
console.log(`   Везде: ${bothCount} файлов`)
console.log(`   Приватно: ${privateCount} файлов\n`)