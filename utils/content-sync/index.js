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
    useCache: false,
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
        
        if (config.useCache) {
            this.loadCache()
        }
    }

    async loadCache() {
        try {
            const cacheContent = await fs.readFile(this.config.cacheFile, 'utf8')
            this.cache = JSON.parse(cacheContent)
            console.log(chalk.gray(`📦 Загружен кэш (${Object.keys(this.cache).length} записей)`))
        } catch {
            this.cache = {}
        }
    }

    async saveCache() {
        if (!this.config.useCache) return
        try {
            await fs.writeFile(this.config.cacheFile, JSON.stringify(this.cache, null, 2))
        } catch (error) {
            console.log(chalk.yellow(`⚠️ Не удалось сохранить кэш: ${error.message}`))
        }
    }

    async getFileHash(filePath) {
        const content = await fs.readFile(filePath, 'utf8')
        return createHash('md5').update(content).digest('hex')
    }

    async hasFileChanged(filePath) {
        if (!this.config.useCache) return true
        const hash = await this.getFileHash(filePath)
        const cached = this.cache[filePath]
        if (cached === hash) return false
        this.cache[filePath] = hash
        return true
    }

    transliteratePath(input) {
        if (!input) return input
        let result = slugify(input, {
            lowercase: true,
            separator: '-',
            allowedChars: 'a-zA-Z0-9\\-\\.'
        })
        result = result.replace(/-+/g, '-')
        result = result.replace(/^-|-$/g, '')
        return result || 'unnamed'
    }

    extractFrontmatter(tree) {
        let frontmatterNode = null
        visit(tree, 'yaml', (node) => {
            frontmatterNode = node
            return false
        })
        if (!frontmatterNode) return null
        return YAML.parse(frontmatterNode.value)
    }

    async getFrontmatter(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8')
            const tree = this.processor.parse(content)
            const frontmatter = this.extractFrontmatter(tree)
            return frontmatter || {}
        } catch (error) {
            console.error(chalk.red(`Error reading frontmatter from ${filePath}:`), error.message)
            return {}
        }
    }

    async getMarkdownFiles(dir) {
        const files = []
        async function scan(directory) {
            const entries = await fs.readdir(directory, { withFileTypes: true })
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name)
                if (entry.isDirectory()) {
                    if (!['.git', 'node_modules', '.obsidian', 'templates'].includes(entry.name)) {
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
            await fs.mkdir(dir, { recursive: true })
        }
    }

    async copyFileWithStructure(sourceFile, targetDir, sourceBase) {
        const relativePath = path.relative(sourceBase, sourceFile)
        const changed = await this.hasFileChanged(sourceFile)
        if (!changed) {
            console.log(chalk.gray(`      🔄 Не изменился (кэш)`))
            return null
        }
        
        const pathComponents = relativePath.split(path.sep)
        const transliteratedComponents = pathComponents.map(comp => {
            if (comp.endsWith('.md')) {
                const fileName = comp.slice(0, -3)
                const transliterated = this.transliteratePath(fileName)
                return transliterated + '.md'
            }
            return this.transliteratePath(comp)
        })
        
        const newRelativePath = transliteratedComponents.join(path.sep)
        const targetPath = path.join(targetDir, newRelativePath)
        const targetFileDir = path.dirname(targetPath)

        console.log(chalk.gray(`      Оригинал: ${relativePath}`))
        console.log(chalk.gray(`      Транслит: ${newRelativePath}`))
        
        await fs.mkdir(targetFileDir, { recursive: true })
        const content = await fs.readFile(sourceFile, 'utf8')
        await fs.writeFile(targetPath, content, 'utf8')
        
        return newRelativePath
    }

    async copyAssets(sourceFilePath, targetFilePath) {
        const sourceDir = path.dirname(sourceFilePath)
        const targetDir = path.dirname(targetFilePath)
        const assetsDir = path.join(sourceDir, 'assets')

        try {
            await fs.access(assetsDir)
        } catch {
            return
        }

        const targetAssetsDir = path.join(targetDir, 'assets')
        await fs.mkdir(targetAssetsDir, { recursive: true })

        const assetFiles = await fs.readdir(assetsDir, { withFileTypes: true })
        let assetCount = 0
        
        for (const file of assetFiles) {
            if (file.isFile()) {
                const sourcePath = path.join(assetsDir, file.name)
                const fileName = file.name
                const ext = path.extname(fileName)
                const baseName = path.basename(fileName, ext)
                const transliteratedName = this.transliteratePath(baseName) + ext
                const destPath = path.join(targetAssetsDir, transliteratedName)
                
                try {
                    await fs.access(destPath)
                } catch {
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

    async processIndexFiles(file) {
        const fileName = path.basename(file)
        const frontmatter = await this.getFrontmatter(file)
        const type = frontmatter?.type

        // index-garden.md → только в сад
        if (fileName === 'index-garden.md' && type === 'garden') {
            const targetPath = path.join(this.config.gardenDir, 'index.md')
            const targetFileDir = path.dirname(targetPath)

            console.log(chalk.cyan(`\n📄 Специальная обработка: index-garden.md`))
            console.log(chalk.gray(`   type: ${type}`))
            console.log(chalk.gray(`      Цель: сад → index.md`))

            await fs.mkdir(targetFileDir, { recursive: true })
            const content = await fs.readFile(file, 'utf8')
            await fs.writeFile(targetPath, content, 'utf8')
            await this.copyAssets(file, targetPath)

            console.log(chalk.green(`  ✓ → garden: index-garden.md → index.md`))
            this.stats.garden++
            return true
        }
        
        // index.md с type: blog → только в блог
        if (fileName === 'index.md' && type === 'blog') {
            const targetPath = path.join(this.config.blogDir, 'index.md')
            const targetFileDir = path.dirname(targetPath)

            console.log(chalk.cyan(`\n📄 Специальная обработка: index.md`))
            console.log(chalk.gray(`   type: ${type}`))
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

    async processFileForTarget(file, targetDir, targetType, sourceBase) {
        const frontmatter = await this.getFrontmatter(file)
        const type = frontmatter?.type
        
        if (type === targetType) {
            const relativePath = await this.copyFileWithStructure(file, targetDir, sourceBase)
            if (relativePath) {
                await this.copyAssets(file, path.join(targetDir, relativePath))
                console.log(chalk.green(`  ✓ → ${targetType}: ${relativePath}`))
                return true
            } else {
                console.log(chalk.gray(`  - → ${targetType}: не изменился`))
                return false
            }
        }
        return false
    }

    async sync() {
        const startTime = Date.now()
        console.log(chalk.blue('\n🔄 Запуск синхронизации Asteralog...\n'))

        console.log(chalk.blue('🧹 Очистка целевых директорий...'))
        await this.clearDirectory(this.config.gardenDir)
        await this.clearDirectory(this.config.blogDir)
        console.log(chalk.green('  ✓ Директория сада очищена'))
        console.log(chalk.green('  ✓ Директория блога очищена\n'))

        const files = await this.getMarkdownFiles(this.config.sourceDir)
        console.log(chalk.blue(`📊 Найдено ${files.length} markdown файлов в источнике\n`))

        // Обрабатываем index-файлы
        for (const file of files) {
            const processed = await this.processIndexFiles(file)
            if (processed) {
                this.processedFiles.add(file)
            }
        }

        // Обработка остальных файлов
        for (const file of files) {
            if (this.processedFiles.has(file)) continue

            const relativePath = path.relative(this.config.sourceDir, file)
            console.log(chalk.cyan(`\n📄 Обработка: ${relativePath}`))

            const frontmatter = await this.getFrontmatter(file)
            const type = frontmatter?.type
            
            console.log(chalk.gray(`   type: ${type || 'не указан'}`))

            // ========== ОБРАБОТКА type: both ==========
            if (type === 'both') {
                // Копируем в сад
                const gardenProcessed = await this.processFileForTarget(file, this.config.gardenDir, 'garden', this.config.sourceDir)
                if (gardenProcessed) this.stats.garden++
                
                // Копируем в блог
                const blogProcessed = await this.processFileForTarget(file, this.config.blogDir, 'blog', this.config.sourceDir)
                if (blogProcessed) this.stats.blog++
                
                if (gardenProcessed || blogProcessed) {
                    this.stats.both++
                } else {
                    this.stats.none++
                    console.log(chalk.gray(`  - приватно (type: both, но не изменился)`))
                }
            } else if (type === 'garden') {
                const processed = await this.processFileForTarget(file, this.config.gardenDir, 'garden', this.config.sourceDir)
                if (processed) this.stats.garden++
            } else if (type === 'blog') {
                const processed = await this.processFileForTarget(file, this.config.blogDir, 'blog', this.config.sourceDir)
                if (processed) this.stats.blog++
            } else {
                this.stats.none++
                console.log(chalk.gray(`  - приватно (type: ${type || 'не указан'})`))
            }
        }

        await this.saveCache()

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

const syncer = new AsteralogSync(config)
syncer.sync().catch(error => {
    console.error(chalk.red('\n❌ Синхронизация не удалась:'), error)
    process.exit(1)
})