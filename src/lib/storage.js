export async function getLinks() {
  const { links = [] } = await chrome.storage.sync.get('links')
  return links
}

export async function setLinks(links) {
  await chrome.storage.sync.set({ links })
}

export async function addLink(link) {
  const links = await getLinks()
  if (links.some((l) => l.url === link.url && l.status === 'active')) {
    return { added: false, reason: 'duplicate', links }
  }
  const next = [link, ...links]
  await setLinks(next)
  return { added: true, links: next }
}

export async function updateLink(id, patch) {
  const links = await getLinks()
  const next = links.map((l) => (l.id === id ? { ...l, ...patch } : l))
  await setLinks(next)
  return next
}

export async function removeLink(id) {
  const links = await getLinks()
  const next = links.filter((l) => l.id !== id)
  await setLinks(next)
  return next
}
