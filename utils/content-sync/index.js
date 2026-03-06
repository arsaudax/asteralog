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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Конфигурация
const config = {
    sourceDir: path.join(__dirname, '../../content'),
    gardenDir: path.join(__dirname, '../../content-garden'),
    blogDir: path.join(__dirname, '../../content-blog'),
    gardenTag: 'garden',
    blogTag: 'blog'
}

class AsteralogSync {
    constructor(config) {
        this.config = config
        this.processedFiles = new Set()
        this.stats = {
            garden: 0,
            blog: 0,
            both: 0,
            none: 0
        }
        
        this.processor = unified()
            .use(remarkParse)
            .use(remarkFrontmatter, ['yaml'])
            .use(remarkStringify)
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
        
        return result
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
                    await scan(fullPath)
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
            
            for (const item of items) {
                if (item.name !== '.git') {
                    const itemPath = path.join(dir, item.name)
                    await fs.rm(itemPath, { recursive: true, force: true })
                }
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
        
        for (const file of assetFiles) {
            if (file.isFile()) {
                const sourcePath = path.join(assetsDir, file.name)
                // Транслитерируем имена файлов ассетов
                const fileName = file.name
                const ext = path.extname(fileName)
                const baseName = path.basename(fileName, ext)
                const transliteratedName = this.transliteratePath(baseName) + ext
                
                const destPath = path.join(targetAssetsDir, transliteratedName)
                // Для ассетов используем copyFile (они бинарные)
                await fs.copyFile(sourcePath, destPath)
                console.log(chalk.gray(`      📎 asset: ${fileName} -> ${transliteratedName}`))
            }
        }
    }

    /**
     * Обработка файла для целевого сайта
     */
    async processFileForTarget(file, targetDir, targetTag, sourceBase) {
        const tags = await this.getTags(file)
        
        if (tags.includes(targetTag)) {
            const relativePath = await this.copyFileWithStructure(file, targetDir, sourceBase)
            await this.copyAssets(file, path.join(targetDir, relativePath))
            
            console.log(chalk.green(`  ✓ → ${targetTag}: ${relativePath}`))
            return true
        }
        return false
    }

    /**
     * Основная функция синхронизации
     */
    async sync() {
        console.log(chalk.blue('\n🔄 Запуск синхронизации Asteralog...\n'))

        // Очистка целевых директорий
        console.log(chalk.blue('Очистка целевых директорий...'))
        await this.clearDirectory(this.config.gardenDir)
        await this.clearDirectory(this.config.blogDir)
        console.log(chalk.green('  ✓ Директория сада очищена'))
        console.log(chalk.green('  ✓ Директория блога очищена\n'))

        // Получение всех исходных файлов
        const files = await this.getMarkdownFiles(this.config.sourceDir)
        console.log(chalk.blue(`Найдено ${files.length} markdown файлов в источнике\n`))

        // Обработка каждого файла
        for (const file of files) {
            const relativePath = path.relative(this.config.sourceDir, file)
            console.log(chalk.cyan(`\n📄 Обработка: ${relativePath}`))

            const tags = await this.getTags(file)
            console.log(chalk.gray(`   Теги: ${tags.join(', ')}`))

            const isGarden = tags.includes(this.config.gardenTag)
            const isBlog = tags.includes(this.config.blogTag)

            if (isGarden) {
                await this.processFileForTarget(file, this.config.gardenDir, this.config.gardenTag, this.config.sourceDir)
                this.stats.garden++
            }

            if (isBlog) {
                await this.processFileForTarget(file, this.config.blogDir, this.config.blogTag, this.config.sourceDir)
                this.stats.blog++
            }

            if (isGarden && isBlog) {
                this.stats.both++
            } else if (!isGarden && !isBlog) {
                this.stats.none++
                console.log(chalk.gray(`  - приватно (нет тегов)`))
            }
        }

        // Итоги
        console.log(chalk.green('\n✅ Синхронизация завершена!'))
        console.log(chalk.blue(`   Сад: ${this.stats.garden} файлов`))
        console.log(chalk.blue(`   Блог: ${this.stats.blog} файлов`))
        console.log(chalk.blue(`   Везде: ${this.stats.both} файлов`))
        console.log(chalk.gray(`   Приватно: ${this.stats.none} файлов\n`))
    }
}

// Запуск синхронизации
const syncer = new AsteralogSync(config)
syncer.sync().catch(error => {
    console.error(chalk.red('\n❌ Синхронизация не удалась:'), error)
    process.exit(1)
})