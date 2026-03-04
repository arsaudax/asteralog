import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройки путей
const SOURCE_DIR = path.join(__dirname, '../../content');
const GARDEN_DIR = path.join(__dirname, '../../content-garden');
const BLOG_DIR = path.join(__dirname, '../../content-blog');

// Создаём папки, если их нет
[GARDEN_DIR, BLOG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Получение всех .md файлов рекурсивно
function getAllMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Очистка целевой папки
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// Копирование файла с сохранением структуры папок
function copyFileWithStructure(sourceFile, targetDir, sourceBase) {
  const relativePath = path.relative(sourceBase, sourceFile);
  const targetPath = path.join(targetDir, relativePath);
  const targetFileDir = path.dirname(targetPath);
  
  fs.mkdirSync(targetFileDir, { recursive: true });
  fs.copyFileSync(sourceFile, targetPath);
  console.log(`  📄 ${relativePath}`);
}

// Основная функция
function syncContent() {
  console.log('🔄 Starting content sync...\n');
  
  // Получаем все markdown файлы
  const files = getAllMarkdownFiles(SOURCE_DIR);
  console.log(`Found ${files.length} markdown files\n`);
  
  // Очищаем целевые папки
  console.log('Cleaning target directories...');
  cleanDirectory(GARDEN_DIR);
  cleanDirectory(BLOG_DIR);
  console.log('  ✓ Garden directory cleaned');
  console.log('  ✓ Blog directory cleaned\n');
  
  // Счётчики
  let gardenCount = 0;
  let blogCount = 0;
  let bothCount = 0;
  let noneCount = 0;
  
  // Обрабатываем каждый файл
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data: frontmatter } = matter(content);
      const tags = frontmatter.tags || [];
      
      const hasGarden = tags.includes('garden');
      const hasBlog = tags.includes('blog');
      
      if (hasGarden || hasBlog) {
        console.log(`\n📄 Processing: ${path.relative(SOURCE_DIR, file)}`);
        console.log(`   Tags:`, tags);
      }
      
      if (hasGarden) {
        copyFileWithStructure(file, GARDEN_DIR, SOURCE_DIR);
        gardenCount++;
      }
      
      if (hasBlog) {
        copyFileWithStructure(file, BLOG_DIR, SOURCE_DIR);
        blogCount++;
      }
      
      if (hasGarden && hasBlog) {
        bothCount++;
      } else if (!hasGarden && !hasBlog) {
        noneCount++;
      }
      
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`\n✅ Sync complete!`);
  console.log(`   Garden: ${gardenCount} files`);
  console.log(`   Blog: ${blogCount} files`);
  console.log(`   Both: ${bothCount} files`);
  console.log(`   Private (no tags): ${noneCount} files`);
}

// Запускаем
syncContent();