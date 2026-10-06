export interface Embed {
  provider: 'youtube' | 'vimeo' | 'spotify' | 'soundcloud';
  src: string;
  /** Video embeds keep a 16:9 ratio, audio players a fixed height. */
  height?: number;
  /** Still image the site can use when no cover photo was uploaded. */
  thumbnail?: string;
  /** Used when `thumbnail` does not exist for this video. */
  thumbnailFallback?: string;
}

/**
 * Turn a YouTube / Vimeo / Spotify / SoundCloud link, as pasted by the editor,
 * into an embeddable player URL. Returns undefined for anything else, which the
 * site then shows as a plain link.
 */
export function parseEmbed(link: string | undefined): Embed | undefined {
  if (!link) return undefined;
  let u: URL;
  try {
    u = new URL(link.trim());
  } catch {
    return undefined;
  }
  const host = u.hostname.replace(/^(www|m|music)\./, '');

  if (host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
    const id =
      host === 'youtu.be'
        ? u.pathname.slice(1)
        : (u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]);
    if (!id || !/^[\w-]{6,}$/.test(id)) return undefined;
    const start = Number.parseInt(u.searchParams.get('t') ?? u.searchParams.get('start') ?? '', 10);
    return {
      provider: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${id}${start > 0 ? `?start=${start}` : ''}`,
      // hq720 is 16:9 without letterboxing but not every video has it; hqdefault (4:3) always exists.
      thumbnail: `https://i.ytimg.com/vi/${id}/hq720.jpg`,
      thumbnailFallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const [, id, hash] = u.pathname.match(/(\d+)(?:\/([\da-f]+))?/) ?? [];
    if (!id) return undefined;
    const h = hash ?? u.searchParams.get('h');
    return { provider: 'vimeo', src: `https://player.vimeo.com/video/${id}?dnt=1${h ? `&h=${h}` : ''}` };
  }

  if (host === 'open.spotify.com') {
    const [, kind, id] =
      u.pathname.match(/^\/(?:intl-[a-z-]+\/)?(episode|show|track|album|playlist)\/([A-Za-z\d]+)/) ?? [];
    if (!kind || !id) return undefined;
    return {
      provider: 'spotify',
      src: `https://open.spotify.com/embed/${kind}/${id}`,
      height: kind === 'episode' || kind === 'track' ? 152 : 352,
    };
  }

  if (host === 'soundcloud.com' || host === 'on.soundcloud.com') {
    const params = new URLSearchParams({ url: u.href, color: '#b4232a', visual: 'false', show_comments: 'false' });
    return { provider: 'soundcloud', src: `https://w.soundcloud.com/player/?${params}`, height: 166 };
  }

  return undefined;
}
