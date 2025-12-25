import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export interface Article {
  slug: string
  title: string
  date: string
  description: string
  content: string
  readTime: string
}

export interface ArticleMetadata {
  slug: string
  title: string
  date: string
  description: string
  readTime: string
}

const articlesDirectory = path.join(process.cwd(), 'articles')

function coerceBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') {
      return true
    }

    if (normalized === 'false') {
      return false
    }
  }

  return false
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

type LoadedArticle = {
  slug: string
  title: string
  date: string
  description: string
  readTime: string
  content: string
  is_hidden: boolean
}

function loadArticleFromFile(fileName: string): LoadedArticle {
  const fullPath = path.join(articlesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const slug = fileName.replace(/\.md$/, '')
  const readTime = calculateReadTime(content)

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || '',
    description: data.description || '',
    readTime,
    content,
    is_hidden: coerceBoolean(data.is_hidden),
  }
}

export function getAllArticles(): ArticleMetadata[] {
  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => loadArticleFromFile(name))
    .filter((article) => !article.is_hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles.map(({ slug, title, date, description, readTime }) => ({
    slug,
    title,
    date,
    description,
    readTime,
  }))
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const article = loadArticleFromFile(`${slug}.md`)

    return {
      slug: article.slug,
      title: article.title,
      date: article.date,
      description: article.description,
      content: article.content,
      readTime: article.readTime,
    }
  } catch (error) {
    return null
  }
}

export function getAllArticleSlugs(): string[] {
  const fileNames = fs.readdirSync(articlesDirectory)

  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => loadArticleFromFile(name))
    .filter((article) => !article.is_hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((article) => article.slug)
}

export async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, {
      detect: false,
      subset: ['swift', 'javascript', 'typescript', 'css', 'html', 'bash', 'json']
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  return result.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}
