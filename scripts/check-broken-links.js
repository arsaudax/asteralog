// scripts/check-links.js
import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'
import { fileURLToPath } from 'url'

// Credits to catcodeme https://github.com/CatCodeMe/catcodeme.github.io/commit/39c0c7601e6aeb0e9bf7b9097136b54ce03be901

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Получаем путь к public из аргументов командной строки
const publicDir = process.argv[2] || path.resolve(__dirname, '../public')

// Глобальные счетчики
let totalBrokenLinks = 0
const allBrokenLinks = []

// Проверка существования файла
function checkFileExists(filePath) {
    try {
        if (fs.existsSync(filePath)) return true
        // Пробуем без .html
        const pathWithoutExt = filePath.replace(/\.html$/, '')
        return fs.existsSync(pathWithoutExt)
    } catch (err) {
        return false
    }
}

// Обработка HTML файла
function processHtmlFile(filePath) {
    const html = fs.readFileSync(filePath, 'utf-8')
    const $ = load(html, {
        xml: { xmlMode: false },
        decodeEntities: false
    })
    
    let modified = false
    let brokenLinks = []

    $('a.internal:not(.tag-link)').each((_, element) => {
        const oldHref = $(element).attr('href')
        if (!oldHref || oldHref.startsWith('#')) return
        
        const href = oldHref.includes('#') ? oldHref.split('#')[0] : oldHref
        const slug = $(element).attr('data-slug')
        
        // Нормализуем путь
        let normalizedPath
        if (slug) {
            normalizedPath = path.join(publicDir, slug + '.html')
        } else {
            const currentDir = path.dirname(filePath)
            let targetPath
            
            if (href.startsWith('/')) {
                targetPath = href === '/' ? 'index.html' : href.slice(1)
            } else {
                const relativeToPublic = path.relative(publicDir, currentDir)
                targetPath = path.normalize(path.join(relativeToPublic, href))
            }
            
            normalizedPath = path.join(publicDir, targetPath.replace(/\/?$/, '.html'))
        }

        if (!checkFileExists(normalizedPath)) {
            // Сохраняем оригинальные атрибуты
            const existingClass = $(element).attr('class') || ''
            const existingAttrs = { ...element.attribs }
            
            // Добавляем класс broken-link
            $(element).attr('class', `${existingClass} broken-link`.trim())
            
            // Восстанавливаем остальные атрибуты
            Object.keys(existingAttrs).forEach(attr => {
                if (attr !== 'class') {
                    $(element).attr(attr, existingAttrs[attr])
                }
            })
            
            brokenLinks.push({
                file: filePath,
                link: oldHref,
                text: $(element).text().trim() || '[без текста]',
                expectedPath: normalizedPath
            })
            
            modified = true
            totalBrokenLinks++
        }
    })

    if (modified) {
        fs.writeFileSync(filePath, $.html({
            decodeEntities: false,
            xmlMode: false
        }))
        allBrokenLinks.push(...brokenLinks)
    }
}

// Рекурсивная обработка директории
function processDirectory(directory) {
    const files = fs.readdirSync(directory)
    
    files.forEach(file => {
        const fullPath = path.join(directory, file)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
            processDirectory(fullPath)
        } else if (file.endsWith('.html')) {
            processHtmlFile(fullPath)
        }
    })
}

// Запуск
console.log(`🔍 Checking internal links in: ${publicDir}`)
console.time('Link check completed in')

try {
    processDirectory(publicDir)
    
    if (totalBrokenLinks > 0) {
        console.log(`\n❌ Found ${totalBrokenLinks} broken links:\n`)
        
        // Группируем по файлам
        const groupedLinks = allBrokenLinks.reduce((acc, link) => {
            if (!acc[link.file]) acc[link.file] = []
            acc[link.file].push(link)
            return acc
        }, {})
        
        Object.entries(groupedLinks).forEach(([file, links]) => {
            console.log(`📄 ${path.relative(publicDir, file)}:`)
            links.forEach(link => {
                console.log(`   - "${link.text}" -> ${link.link}`)
                console.log(`     expected: ${path.relative(publicDir, link.expectedPath)}`)
            })
            console.log('')
        })
        
        console.log(`Total: ${totalBrokenLinks} broken links`)
        process.exit(1) // Ошибка для CI/CD
    } else {
        console.log('\n✅ No broken links found!')
        process.exit(0)
    }
} catch (error) {
    console.error('❌ Error checking links:', error)
    process.exit(1)
} finally {
    console.timeEnd('Link check completed in')
}