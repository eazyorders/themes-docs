import {existsSync, readFileSync, readdirSync, statSync} from 'fs';
import {basename, join, relative} from 'path';
import type {LoadContext, Plugin} from '@docusaurus/types';

export type SearchIndexEntry = {
  title: string;
  path: string;
  description: string;
  body: string;
};

type SearchIndexOptions = {
  docsDir?: string;
  routeBasePath?: string;
};

function resolveOptions(options: unknown): {docsDir: string; routeBasePath: string} {
  const value = (options ?? {}) as SearchIndexOptions;
  return {
    docsDir: value.docsDir ?? 'docs',
    routeBasePath: value.routeBasePath ?? 'docs',
  };
}

function walkMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function cleanText(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, (block) => ` ${block.replace(/```\w*/g, ' ')} `)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^:::[^\n]*$/gm, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*|__/g, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitFrontmatter(raw: string): {frontmatter: string; markdown: string} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return {frontmatter: '', markdown: raw};
  }
  return {frontmatter: match[1] ?? '', markdown: match[2] ?? ''};
}

function extractTitle(markdown: string, frontmatter: string, filePath: string): string {
  const fromFrontmatter = frontmatter.match(/^title:\s*(.+)$/m)?.[1];
  if (fromFrontmatter) {
    return cleanText(unquote(fromFrontmatter));
  }

  const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
  if (heading) {
    return cleanText(heading.replace(/\s+#+\s*$/, ''));
  }

  return basename(filePath).replace(/\.mdx?$/, '');
}

function extractDescription(markdown: string, frontmatter: string): string {
  const fromFrontmatter = frontmatter.match(/^description:\s*(.+)$/m)?.[1];
  if (fromFrontmatter) {
    return cleanText(unquote(fromFrontmatter)).slice(0, 320);
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let seenHeading = false;
  let inFence = false;
  const paragraph: string[] = [];
  let fallbackHeading = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!seenHeading) {
      if (/^#\s+/.test(trimmed)) {
        seenHeading = true;
      }
      continue;
    }
    if (trimmed.startsWith('```')) {
      if (paragraph.length > 0) {
        break;
      }
      inFence = !inFence;
      continue;
    }
    if (inFence || trimmed.startsWith('![')) {
      continue;
    }
    if (!trimmed) {
      if (paragraph.length > 0) {
        break;
      }
      continue;
    }
    const subheading = trimmed.match(/^#{2,6}\s+(.+)$/);
    if (subheading) {
      if (paragraph.length > 0) {
        break;
      }
      if (!fallbackHeading) {
        fallbackHeading = subheading[1] ?? '';
      }
      continue;
    }
    if (trimmed.startsWith('|') || trimmed.startsWith(':::') || trimmed === '---') {
      if (paragraph.length > 0) {
        break;
      }
      continue;
    }
    paragraph.push(trimmed);
  }

  const prose = cleanText(paragraph.join(' ')).slice(0, 320);
  if (prose) {
    return prose;
  }
  return cleanText(fallbackHeading).slice(0, 320);
}

function toDocPath(
  filePath: string,
  docsDir: string,
  routeBasePath: string,
  frontmatter: string,
): string {
  const prefix = routeBasePath.replace(/^\/|\/$/g, '');
  const root = prefix ? `/${prefix}` : '';
  const slug = frontmatter.match(/^slug:\s*(.+)$/m)?.[1];

  if (slug) {
    const normalized = unquote(slug);
    if (normalized.startsWith('/')) {
      return `${root}${normalized}`.replace(/\/{2,}/g, '/');
    }
    const directory = relative(docsDir, join(filePath, '..')).replace(/\\/g, '/');
    const joined = [directory, normalized].filter(Boolean).join('/');
    return `${root}/${joined}`.replace(/\/{2,}/g, '/');
  }

  let relativePath = relative(docsDir, filePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
  if (relativePath.endsWith('/index')) {
    relativePath = relativePath.slice(0, -'/index'.length);
  }
  return `${root}/${relativePath}`.replace(/\/{2,}/g, '/');
}

export function buildSearchIndex(siteDir: string, options: unknown): SearchIndexEntry[] {
  const {docsDir, routeBasePath} = resolveOptions(options);
  const contentRoot = join(siteDir, docsDir);

  return walkMarkdownFiles(contentRoot)
    .map((filePath) => {
      const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
      const {frontmatter, markdown} = splitFrontmatter(raw);
      if (/^draft:\s*true\s*$/m.test(frontmatter)) {
        return null;
      }

      return {
        title: extractTitle(markdown, frontmatter, filePath),
        path: toDocPath(filePath, contentRoot, routeBasePath, frontmatter),
        description: extractDescription(markdown, frontmatter),
        body: cleanText(markdown),
      };
    })
    .filter((entry): entry is SearchIndexEntry => entry !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default function searchIndexPlugin(
  context: LoadContext,
  options: unknown,
): Plugin<SearchIndexEntry[]> {
  const {docsDir} = resolveOptions(options);

  return {
    name: 'docs-search',
    getPathsToWatch() {
      return [join(context.siteDir, docsDir, '**/*.{md,mdx}').replace(/\\/g, '/')];
    },
    loadContent() {
      return buildSearchIndex(context.siteDir, options);
    },
    contentLoaded({content, actions}) {
      actions.setGlobalData({entries: content});
    },
  };
}
