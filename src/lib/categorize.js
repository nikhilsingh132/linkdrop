const RULES = [
  {
    id: 'youtube',
    label: 'YouTube',
    test: (host) =>
      host.endsWith('youtube.com') || host === 'youtu.be' || host.endsWith('.youtube.com'),
  },
  {
    id: 'github',
    label: 'GitHub',
    test: (host) => host === 'github.com' || host.endsWith('.github.com'),
  },
  {
    id: 'docs',
    label: 'Docs',
    test: (host, path) =>
      /(^|\.)(docs?|developer|developers|mdn|readthedocs)\./.test(host) ||
      /\/(docs?|reference|api|guide)(\/|$)/i.test(path),
  },
  {
    id: 'social',
    label: 'Social',
    test: (host) =>
      /^(twitter|x|threads|bsky|mastodon|reddit|linkedin|instagram|tiktok|facebook)\./.test(
        host.replace(/^www\./, ''),
      ) || host === 'x.com',
  },
  {
    id: 'article',
    label: 'Article',
    test: (host) =>
      /^(medium|substack|dev|hashnode|hackernoon|smashingmagazine|css-tricks|freecodecamp)\./.test(
        host.replace(/^www\./, ''),
      ) ||
      host.endsWith('.medium.com') ||
      host.endsWith('.substack.com'),
  },
]

export function categorize(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    const path = u.pathname.toLowerCase()
    for (const rule of RULES) {
      if (rule.test(host, path)) return rule.id
    }
    return 'other'
  } catch {
    return 'other'
  }
}

export const CATEGORY_META = {
  youtube: { label: 'YouTube', color: 'bg-yt/10 text-yt' },
  github: { label: 'GitHub', color: 'bg-github/10 text-github' },
  docs: { label: 'Docs', color: 'bg-docs/10 text-docs' },
  social: { label: 'Social', color: 'bg-social/10 text-social' },
  article: { label: 'Article', color: 'bg-article/10 text-article' },
  other: { label: 'Link', color: 'bg-other/10 text-other' },
}

export const ALL_CATEGORIES = ['all', 'youtube', 'article', 'docs', 'github', 'social', 'other']
