import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'
import YAML from 'yaml'
import chalk from 'chalk'
import { slugify } from 'transliteration'
import { createHash } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Конфигурация
const config = {
    sourceDir: path.join(__dirname, '../../content'),
    gardenDir: path.join(__dirname, '../../content-garden'),
    blogDir: path.join(__dirname, '../../content-blog'),
    gardenTag: 'garden',
    blogTag: 'blog',
    // Опционально: кэширование для ускорения
    useCache: process.env.NODE_ENV === 'development',
    cacheFile: path.join(__dirname, '../../.sync-cache.json')
}

class AsteralogSync {
    constructor(config) {
        this.config = config
        this.processedFiles = new Set()
        this.stats = {
            garden: 0,
            blog: 0,
            both: 0,
            none: 0,
            assets: 0
        }
        this.cache = {}
        
        this.processor = unified()
            .use(remarkParse)
            .use(remarkFrontmatter, ['yaml'])
            .use(remarkStringify)
        
        // Загружаем кэш если нужно
        if (config.useCache) {
            this.loadCache()
        }
    }

    /**
     * Загрузка кэша
     */
    async loadCache() {
        try {
            const cacheContent = await fs.readFile(this.config.cacheFile, 'utf8')
            this.cache = JSON.parse(cacheContent)
            console.log(chalk.gray(`📦 Загружен кэш (${Object.keys(this.cache).length} записей)`))
        } catch {
            this.cache = {}
        }
    }

    /**
     * Сохранение кэша
     */
    async saveCache() {
        if (!this.config.useCache) return
        try {
            await fs.writeFile(this.config.cacheFile, JSON.stringify(this.cache, null, 2))
        } catch (error) {
            console.log(chalk.yellow(`⚠️ Не удалось сохранить кэш: ${error.message}`))
        }
    }

    /**
     * Вычисление хеша файла
     */
    async getFileHash(filePath) {
        const content = await fs.readFile(filePath, 'utf8')
        return createHash('md5').update(content).digest('hex')
    }

    /**
     * Проверка, изменился ли файл
     */
    async hasFileChanged(filePath) {
        if (!this.config.useCache) return true
        
        const hash = await this.getFileHash(filePath)
        const cached = this.cache[filePath]
        
        if (cached === hash) {
            return false
        }
        
        this.cache[filePath] = hash
        return true
    }

    /**
     * Транслитерация строки (русские символы -> латиница)
     */
    transliteratePath(input) {
        if (!input) return input
        
        // Сначала транслитерируем
        let result = slugify(input, {
            lowercase: true,
            separator: '-',
            allowedChars: 'a-zA-Z0-9\\-\\.'
        })
        
        // Убираем множественные дефисы
        result = result.replace(/-+/g, '-')
        // Убираем дефисы в начале и конце
        result = result.replace(/^-|-$/g, '')
        
        return result || 'unnamed' // Защита от пустого результата
    }

    /**
     * Извлечение и парсинг YAML frontmatter
     */
    extractFrontmatter(tree) {
        let frontmatterNode = null
        visit(tree, 'yaml', (node) => {
            frontmatterNode = node
            return false
        })

        if (!frontmatterNode) return null
        return YAML.parse(frontmatterNode.value)
    }

    /**
     * Получение тегов из frontmatter
     */
    async getTags(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8')
            const tree = this.processor.parse(content)
            const frontmatter = this.extractFrontmatter(tree)

            if (!frontmatter?.tags) return []
            
            return Array.isArray(frontmatter.tags) 
                ? frontmatter.tags 
                : frontmatter.tags.split(',').map(tag => tag.trim())
        } catch (error) {
            console.error(chalk.red(`Error reading tags from ${filePath}:`), error.message)
            return []
        }
    }

    /**
     * Получение всех markdown файлов рекурсивно
     */
    async getMarkdownFiles(dir) {
        const files = []

        async function scan(directory) {
            const entries = await fs.readdir(directory, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name)

                if (entry.isDirectory()) {
                    // Пропускаем служебные директории
                    if (!['.git', 'node_modules', '.obsidian'].includes(entry.name)) {
                        await scan(fullPath)
                    }
                } else if (entry.name.endsWith('.md')) {
                    files.push(fullPath)
                }
            }
        }

        await scan(dir)
        return files
    }

    /**
     * Очистка директории кроме .git
     */
    async clearDirectory(dir) {
        try {
            const items = await fs.readdir(dir, { withFileTypes: true })
            
            let deletedCount = 0
            for (const item of items) {
                if (item.name !== '.git') {
                    const itemPath = path.join(dir, item.name)
                    await fs.rm(itemPath, { recursive: true, force: true })
                    deletedCount++
                }
            }
            
            if (deletedCount > 0) {
                console.log(chalk.gray(`  🗑️  Удалено ${deletedCount} элементов`))
            }
        } catch (error) {
            // Directory might not exist yet
            await fs.mkdir(dir, { recursive: true })
        }
    }

    /**
     * Копирование файла с сохранением структуры (с транслитерацией и UTF-8)
     */
    async copyFileWithStructure(sourceFile, targetDir, sourceBase) {
        const relativePath = path.relative(sourceBase, sourceFile)
        
        // Проверяем, изменился ли файл
        const changed = await this.hasFileChanged(sourceFile)
        if (!changed) {
            console.log(chalk.gray(`      🔄 Не изменился (кэш)`))
            return null
        }
        
        // Разбиваем путь на компоненты и транслитерируем каждый
        const pathComponents = relativePath.split(path.sep)
        const transliteratedComponents = pathComponents.map(comp => {
            // Если это файл .md, обрабатываем отдельно
            if (comp.endsWith('.md')) {
                const fileName = comp.slice(0, -3)
                const transliterated = this.transliteratePath(fileName)
                return transliterated + '.md'
            }
            // Для папок просто транслитерируем
            return this.transliteratePath(comp)
        })
        
        // Собираем новый путь
        const newRelativePath = transliteratedComponents.join(path.sep)
        const targetPath = path.join(targetDir, newRelativePath)
        const targetFileDir = path.dirname(targetPath)

        console.log(chalk.gray(`      Оригинал: ${relativePath}`))
        console.log(chalk.gray(`      Транслит: ${newRelativePath}`))
        
        await fs.mkdir(targetFileDir, { recursive: true })
        
        // ВАЖНО: читаем с UTF-8 и пишем с UTF-8
        const content = await fs.readFile(sourceFile, 'utf8')
        await fs.writeFile(targetPath, content, 'utf8')
        
        return newRelativePath
    }

    /**
     * Копирование ассетов для файла
     */
    async copyAssets(sourceFilePath, targetFilePath) {
        const sourceDir = path.dirname(sourceFilePath)
        const targetDir = path.dirname(targetFilePath)
        const assetsDir = path.join(sourceDir, 'assets')

        try {
            await fs.access(assetsDir)
        } catch {
            return // No assets directory
        }

        const targetAssetsDir = path.join(targetDir, 'assets')
        await fs.mkdir(targetAssetsDir, { recursive: true })

        const assetFiles = await fs.readdir(assetsDir, { withFileTypes: true })
        let assetCount = 0
        
        for (const file of assetFiles) {
            if (file.isFile()) {
                const sourcePath = path.join(assetsDir, file.name)
                // Транслитерируем имена файлов ассетов
                const fileName = file.name
                const ext = path.extname(fileName)
                const baseName = path.basename(fileName, ext)
                const transliteratedName = this.transliteratePath(baseName) + ext
                
                const destPath = path.join(targetAssetsDir, transliteratedName)
                
                // Копируем только если файл изменился или не существует
                try {
                    await fs.access(destPath)
                    // Файл существует, пропускаем
                } catch {
                    // Файла нет, копируем
                    await fs.copyFile(sourcePath, destPath)
                    assetCount++
                    console.log(chalk.gray(`      📎 asset: ${fileName} -> ${transliteratedName}`))
                }
            }
        }
        
        if (assetCount > 0) {
            this.stats.assets += assetCount
        }
    }

    /**
     * Специальная обработка для index-файлов
     */
    async processIndexFiles(file) {
        const fileName = path.basename(file)
        const tags = await this.getTags(file)
        
        // index-garden.md → только в сад
        if (fileName === 'index-garden.md' && tags.includes(this.config.gardenTag)) {
            const targetPath = path.join(this.config.gardenDir, 'index.md')
            const targetFileDir = path.dirname(targetPath)

            console.log(chalk.cyan(`\n📄 Специальная обработка: index-garden.md`))
            console.log(chalk.gray(`   Теги: ${tags.join(', ')}`))
            console.log(chalk.gray(`      Цель: сад → index.md`))

            await fs.mkdir(targetFileDir, { recursive: true })
            const content = await fs.readFile(file, 'utf8')
            await fs.writeFile(targetPath, content, 'utf8')

            await this.copyAssets(file, targetPath)

            console.log(chalk.green(`  ✓ → garden: index-garden.md → index.md`))
            this.stats.garden++
            return true
        }
        
        // index.md с тегом blog → только в блог
        if (fileName === 'index.md' && tags.includes(this.config.blogTag)) {
            const targetPath = path.join(this.config.blogDir, 'index.md')
            const targetFileDir = path.dirname(targetPath)

            console.log(chalk.cyan(`\n📄 Специальная обработка: index.md`))
            console.log(chalk.gray(`   Теги: ${tags.join(', ')}`))
            console.log(chalk.gray(`      Цель: блог → index.md`))

            await fs.mkdir(targetFileDir, { recursive: true })
            const content = await fs.readFile(file, 'utf8')
            await fs.writeFile(targetPath, content, 'utf8')

            await this.copyAssets(file, targetPath)

            console.log(chalk.green(`  ✓ → blog: index.md → index.md`))
            this.stats.blog++
            return true
        }

        return false
    }

    /**
     * Специальная обработка для blog-index.md (для обратной совместимости)
     */
    async processBlogIndex(file) {
        const fileName = path.basename(file)
        if (fileName !== 'blog-index.md') return false

        const tags = await this.getTags(file)
        if (!tags.includes(this.config.blogTag)) return false

        const targetPath = path.join(this.config.blogDir, 'index.md')
        const targetFileDir = path.dirname(targetPath)

        console.log(chalk.cyan(`\n📄 Специальная обработка: blog-index.md (устаревший)`))
        console.log(chalk.gray(`   Теги: ${tags.join(', ')}`))
        console.log(chalk.gray(`      Цель: блог → index.md`))

        await fs.mkdir(targetFileDir, { recursive: true })
        const content = await fs.readFile(file, 'utf8')
        await fs.writeFile(targetPath, content, 'utf8')

        await this.copyAssets(file, targetPath)

        console.log(chalk.green(`  ✓ → blog: blog-index.md → index.md`))
        this.stats.blog++
        return true
    }

    /**
     * Обработка файла для целевого сайта
     */
    async processFileForTarget(file, targetDir, targetTag, sourceBase) {
        const tags = await this.getTags(file)
        
        if (tags.includes(targetTag)) {
            const relativePath = await this.copyFileWithStructure(file, targetDir, sourceBase)
            if (relativePath) { // null если файл не изменился
                await this.copyAssets(file, path.join(targetDir, relativePath))
                console.log(chalk.green(`  ✓ → ${targetTag}: ${relativePath}`))
                return true
            } else {
                console.log(chalk.gray(`  - → ${targetTag}: не изменился`))
                return false
            }
        }
        return false
    }

    /**
     * Основная функция синхронизации
     */
    async sync() {
        const startTime = Date.now()
        console.log(chalk.blue('\n🔄 Запуск синхронизации Asteralog...\n'))

        // Очистка целевых директорий
        console.log(chalk.blue('🧹 Очистка целевых директорий...'))
        await this.clearDirectory(this.config.gardenDir)
        await this.clearDirectory(this.config.blogDir)
        console.log(chalk.green('  ✓ Директория сада очищена'))
        console.log(chalk.green('  ✓ Директория блога очищена\n'))

        // Получение всех исходных файлов
        const files = await this.getMarkdownFiles(this.config.sourceDir)
        console.log(chalk.blue(`📊 Найдено ${files.length} markdown файлов в источнике\n`))

        // Сначала обрабатываем index-файлы специальным образом
        for (const file of files) {
            const processed = await this.processIndexFiles(file)
            if (processed) {
                this.processedFiles.add(file)
            }
        }

        // Для обратной совместимости обрабатываем blog-index.md
        for (const file of files) {
            if (this.processedFiles.has(file)) continue
            const processed = await this.processBlogIndex(file)
            if (processed) {
                this.processedFiles.add(file)
            }
        }

        // Обработка остальных файлов
        for (const file of files) {
            // Пропускаем уже обработанные файлы
            if (this.processedFiles.has(file)) continue

            const relativePath = path.relative(this.config.sourceDir, file)
            console.log(chalk.cyan(`\n📄 Обработка: ${relativePath}`))

            const tags = await this.getTags(file)
            console.log(chalk.gray(`   Теги: ${tags.length ? tags.join(', ') : 'нет'}`))

            const isGarden = tags.includes(this.config.gardenTag)
            const isBlog = tags.includes(this.config.blogTag)

            if (isGarden) {
                const processed = await this.processFileForTarget(file, this.config.gardenDir, this.config.gardenTag, this.config.sourceDir)
                if (processed) this.stats.garden++
            }

            if (isBlog) {
                const processed = await this.processFileForTarget(file, this.config.blogDir, this.config.blogTag, this.config.sourceDir)
                if (processed) this.stats.blog++
            }

            if (isGarden && isBlog) {
                this.stats.both++
            } else if (!isGarden && !isBlog) {
                this.stats.none++
                console.log(chalk.gray(`  - приватно (нет тегов публикации)`))
            }
        }

        // Сохраняем кэш
        await this.saveCache()

        // Итоги
        const duration = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(chalk.green('\n✅ Синхронизация завершена!'))
        console.log(chalk.blue(`   Сад: ${this.stats.garden} файлов`))
        console.log(chalk.blue(`   Блог: ${this.stats.blog} файлов`))
        console.log(chalk.blue(`   Везде: ${this.stats.both} файлов`))
        console.log(chalk.gray(`   Приватно: ${this.stats.none} файлов`))
        if (this.stats.assets > 0) {
            console.log(chalk.gray(`   Ассеты: ${this.stats.assets} файлов`))
        }
        console.log(chalk.gray(`   Время: ${duration}с\n`))
    }
}

// Запуск синхронизации
const syncer = new AsteralogSync(config)
syncer.sync().catch(error => {
    console.error(chalk.red('\n❌ Синхронизация не удалась:'), error)
    process.exit(1)
})