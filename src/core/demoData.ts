import {
  ArchivedSpace,
  BucketListItem,
  CountdownItem,
  LetterItem,
  MemoryItem,
  MixtapeSong,
  QuizItem,
  ThemeMeta,
  TimeCapsuleItem,
} from './types';

function makeArchivalPrintSvg(
  skyTop: string,
  skyBottom: string,
  accent: string,
  stamp: string,
  motif: 'paris' | 'coffee' | 'coast' | 'stars' | 'rain' | 'autumn'
) {
  const scenes: Record<typeof motif, string> = {
    paris: `
      <radialGradient id="sunHalo" cx="72%" cy="32%" r="48%">
        <stop offset="0%" stop-color="#F6D594" stop-opacity="0.72"/>
        <stop offset="55%" stop-color="${accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${skyTop}" stop-opacity="0"/>
      </radialGradient>
      <rect width="400" height="320" fill="url(#sunHalo)"/>
      <circle cx="288" cy="102" r="34" fill="#F9E5B4" opacity="0.92"/>
      <!-- Montmartre rooftops & distant dome -->
      <path d="M180 185 Q205 142 230 185 L238 220 L172 220 Z" fill="#3D2622" opacity="0.52"/>
      <rect x="202" y="130" width="6" height="16" fill="#3D2622" opacity="0.52"/>
      <path d="M0 228 L42 198 L95 212 L134 190 L195 214 L256 184 L322 206 L368 188 L400 205 L400 320 L0 320 Z" fill="#2A1B18" opacity="0.88"/>
      <!-- Bistro warm lit windows & balcony railings -->
      <rect x="48" y="232" width="16" height="22" rx="2" fill="#F7C97E" opacity="0.82"/>
      <rect x="74" y="232" width="16" height="22" rx="2" fill="#F7C97E" opacity="0.45"/>
      <rect x="278" y="220" width="14" height="20" rx="2" fill="#F7C97E" opacity="0.75"/>
      <rect x="302" y="220" width="14" height="20" rx="2" fill="#F7C97E" opacity="0.6"/>
      <!-- Cobblestone terrace balustrade -->
      <path d="M0 282 H400" stroke="#FAF7F2" stroke-opacity="0.28" stroke-width="2"/>
      <path d="M24 282 V320 M64 282 V320 M104 282 V320 M144 282 V320" stroke="#1A110F" stroke-width="4" opacity="0.6"/>
    `,
    coffee: `
      <!-- Warm rainy window booth -->
      <rect x="22" y="20" width="164" height="200" rx="4" fill="#2D363F" opacity="0.45"/>
      <line x1="104" y1="20" x2="104" y2="220" stroke="#F4EFE6" stroke-opacity="0.25" stroke-width="3"/>
      <line x1="22" y1="120" x2="186" y2="120" stroke="#F4EFE6" stroke-opacity="0.25" stroke-width="3"/>
      <!-- Soft rain streaks on glass -->
      <path d="M46 42 L40 78 M74 62 L68 106 M142 36 L135 84 M160 135 L154 176" stroke="#E2E8F0" stroke-opacity="0.35" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Oak cafe tabletop -->
      <path d="M0 225 L400 208 L400 320 L0 320 Z" fill="#4A3222"/>
      <path d="M0 225 L400 208" stroke="#D89A6C" stroke-opacity="0.45" stroke-width="2"/>
      <!-- Two porcelain espresso cups & pastry plate -->
      <ellipse cx="145" cy="264" rx="46" ry="14" fill="#F4EDE2"/>
      <path d="M118 228 H172 L166 258 C164 265 126 265 124 258 Z" fill="#FAF7F2"/>
      <ellipse cx="145" cy="228" rx="27" ry="7" fill="#52301B"/>
      <path d="M171 235 C186 235 186 252 168 252" stroke="#FAF7F2" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="268" cy="252" rx="48" ry="15" fill="#F4EDE2" opacity="0.95"/>
      <path d="M242 246 Q268 224 294 246 Q268 256 242 246 Z" fill="#C98A4B"/>
      <path d="M138 212 Q146 192 135 172 M152 208 Q162 186 150 164" stroke="#FAF7F2" stroke-opacity="0.52" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    `,
    coast: `
      <radialGradient id="mist" cx="28%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#F6D594" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="${skyBottom}" stop-opacity="0"/>
      </radialGradient>
      <rect width="400" height="320" fill="url(#mist)"/>
      <circle cx="116" cy="128" r="28" fill="#FCE7B2" opacity="0.88"/>
      <!-- Pacific horizon & layered coastal headlands -->
      <rect x="0" y="185" width="400" height="135" fill="#1D4452"/>
      <path d="M0 198 Q120 190 250 198 T400 194" stroke="#FAF7F2" stroke-opacity="0.3" stroke-width="1.5" fill="none"/>
      <path d="M150 190 Q245 148 340 185 L400 192 L400 228 L120 228 Z" fill="#2A4A48" opacity="0.82"/>
      <path d="M0 165 L68 188 L122 238 L0 290 Z" fill="#1B2A26"/>
      <!-- Monterey cypress silhouette foreground -->
      <path d="M38 225 V148 M38 175 L12 152 M38 164 L74 146" stroke="#111C19" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="26" cy="144" rx="28" ry="12" fill="#14211D"/>
      <ellipse cx="66" cy="142" rx="34" ry="13" fill="#14211D"/>
      <path d="M0 278 Q135 256 270 282 T400 272 L400 320 L0 320 Z" fill="#0F1B1C" opacity="0.6"/>
    `,
    stars: `
      <radialGradient id="milkyway" cx="52%" cy="38%" r="58%">
        <stop offset="0%" stop-color="#8FAADC" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#0C111D" stop-opacity="0"/>
      </radialGradient>
      <rect width="400" height="320" fill="url(#milkyway)"/>
      <circle cx="64" cy="54" r="1.4" fill="#F7EDE2" opacity="0.8"/>
      <circle cx="118" cy="86" r="1" fill="#F7EDE2" opacity="0.6"/>
      <circle cx="152" cy="42" r="1.8" fill="#D4B475"/>
      <circle cx="214" cy="68" r="1.2" fill="#F7EDE2" opacity="0.85"/>
      <circle cx="264" cy="48" r="2.1" fill="#D4B475"/>
      <circle cx="318" cy="92" r="1.3" fill="#F7EDE2" opacity="0.75"/>
      <circle cx="348" cy="58" r="1" fill="#F7EDE2" opacity="0.6"/>
      <!-- Constellation lines -->
      <path d="M152 42 L214 68 L264 48 L318 92" stroke="#D4B475" stroke-opacity="0.32" stroke-width="1" fill="none"/>
      <!-- Desert dunes & Joshua tree silhouette -->
      <path d="M0 248 Q125 215 245 245 T400 232 L400 320 L0 320 Z" fill="#101522"/>
      <path d="M92 252 V190 M92 214 L72 198 M92 206 L112 190" stroke="#080B12" stroke-width="5" stroke-linecap="round"/>
      <!-- Warm camp lantern light -->
      <polygon points="278,242 298,215 318,242" fill="#D46A2E" opacity="0.85"/>
      <ellipse cx="298" cy="242" rx="34" ry="8" fill="#D4B475" opacity="0.22"/>
    `,
    rain: `
      <!-- Warm interior brick frame looking out at evening street rain -->
      <rect x="44" y="28" width="312" height="242" rx="4" fill="#1E2836"/>
      <line x1="200" y1="28" x2="200" y2="270" stroke="#F4EFE6" stroke-opacity="0.24" stroke-width="4"/>
      <line x1="44" y1="152" x2="356" y2="152" stroke="#F4EFE6" stroke-opacity="0.24" stroke-width="4"/>
      <!-- Blurred amber streetlamp bokeh outside -->
      <circle cx="132" cy="196" r="22" fill="#E3B368" opacity="0.25"/>
      <circle cx="132" cy="196" r="8" fill="#F7DFAC" opacity="0.72"/>
      <circle cx="284" cy="204" r="18" fill="#D46A2E" opacity="0.22"/>
      <circle cx="284" cy="204" r="6" fill="#F4C08A" opacity="0.65"/>
      <!-- Diagonal evening drizzle -->
      <path d="M88 50 L74 88 M152 64 L138 102 M244 48 L230 86 M310 72 L296 110 M112 112 L98 150 M274 116 L260 154" stroke="#CBD5E1" stroke-opacity="0.38" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Windowsill & teacup -->
      <rect x="28" y="264" width="344" height="18" rx="2" fill="#2A201B"/>
      <rect x="242" y="242" width="24" height="22" rx="3" fill="#FAF7F2" opacity="0.9"/>
    `,
    autumn: `
      <!-- Kyoto wooden temple eaves & stone lantern -->
      <path d="M0 245 Q130 220 265 245 T400 236 L400 320 L0 320 Z" fill="#2B1410" opacity="0.88"/>
      <path d="M18 92 Q115 80 185 52 L195 66 Q118 96 22 108 Z" fill="#1C0D0A"/>
      <rect x="44" y="96" width="12" height="150" fill="#1C0D0A"/>
      <!-- Warm glowing paper lantern -->
      <ellipse cx="145" cy="154" rx="18" ry="26" fill="#F6C87A"/>
      <ellipse cx="145" cy="154" rx="28" ry="38" fill="#F6C87A" opacity="0.18"/>
      <rect x="137" y="126" width="16" height="5" fill="#1C0D0A"/>
      <rect x="137" y="178" width="16" height="5" fill="#1C0D0A"/>
      <!-- Drifting crimson maple leaves -->
      <circle cx="242" cy="96" r="6" fill="#D46A2E" opacity="0.85"/>
      <ellipse cx="298" cy="138" rx="9" ry="4.5" transform="rotate(-24 298 138)" fill="#E39D4C" opacity="0.85"/>
      <ellipse cx="220" cy="186" rx="8" ry="4" transform="rotate(32 220 186)" fill="#C04A35" opacity="0.85"/>
      <ellipse cx="332" cy="84" rx="7" ry="3.5" transform="rotate(18 332 84)" fill="#F3C178" opacity="0.78"/>
    `,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}"/>
        <stop offset="100%" stop-color="${skyBottom}"/>
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="68%">
        <stop offset="65%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#140E0A" stop-opacity="0.34"/>
      </radialGradient>
    </defs>
    <rect width="400" height="320" fill="url(#sky)"/>
    ${scenes[motif]}
    <rect width="400" height="320" fill="url(#vignette)"/>
    <text x="378" y="302" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="1.5" fill="#F6B86C" opacity="0.86">${stamp}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PHOTOS = [
  {
    label: 'Montmartre Sunset',
    url: makeArchivalPrintSvg('#8D4A3B', '#D99364', '#F4C57C', "'26 10 18", 'paris'),
    date: '2026-10-18',
    location: 'Montmartre, Paris',
    weather: 'Golden Hour 17°C',
  },
  {
    label: 'Sunday Espresso',
    url: makeArchivalPrintSvg('#6A4933', '#3D271B', '#E3B368', "'26 11 08", 'coffee'),
    date: '2026-11-08',
    location: 'Soho, London',
    weather: 'Crisp Rain 11°C',
  },
  {
    label: 'Big Sur Coastline',
    url: makeArchivalPrintSvg('#4D7A82', '#95A79C', '#E8B878', "'25 11 20", 'coast'),
    date: '2025-11-20',
    location: 'Big Sur, CA',
    weather: 'Coastal Breeze 19°C',
  },
  {
    label: 'Midnight Stargazing',
    url: makeArchivalPrintSvg('#0C111D', '#1D2944', '#D4B475', "'25 07 14", 'stars'),
    date: '2025-07-14',
    location: 'Joshua Tree',
    weather: 'Clear Sky 21°C',
  },
  {
    label: 'Rainy Window Note',
    url: makeArchivalPrintSvg('#39414C', '#1D222B', '#E3B368', "'24 11 20", 'rain'),
    date: '2024-11-20',
    location: 'Brooklyn, NY',
    weather: 'Drizzle 9°C',
  },
  {
    label: 'Autumn Walk',
    url: makeArchivalPrintSvg('#7D3220', '#C6703B', '#F4C57C', "'24 10 05", 'autumn'),
    date: '2024-10-05',
    location: 'Kyoto, Japan',
    weather: 'Amber Breeze 16°C',
  },
];

export const THEMES: ThemeMeta[] = [
  {
    id: 'classic-paper',
    name: 'Classic Paper',
    tier: 'free',
    vibe: 'Warm museum ivory, espresso ink & terracotta wax seal',
    swatches: ['#FAF6EE', '#EDE4D3', '#2B2118', '#C05A3F'],
    particleLabel: 'Warm paper dust motes',
    issueTag: 'Vol. III • Archive No. 14',
    heroSectionLabel: 'Latest Keepsake',
    pulseLabel: 'Send a pulse',
    pulseToast: 'Sent a quiet heartbeat — no reply needed',
    badgeSymbol: 'Archival',
    motif: 'wax-seal',
  },
  {
    id: 'evening-noir',
    name: 'Evening Noir',
    tier: 'free',
    vibe: 'After-hours charcoal, warm champagne gold & slate silver',
    swatches: ['#121316', '#22252C', '#F4EFEA', '#E3B368'],
    particleLabel: 'Soft candlelight embers',
    issueTag: 'After Hours • Reel No. 14',
    heroSectionLabel: 'Midnight Frame',
    pulseLabel: 'Light a Candle',
    pulseToast: 'Lit a midnight candle on your shared desk',
    badgeSymbol: 'Noir Reel',
    motif: 'candle',
  },
  {
    id: 'comic-hero',
    name: 'Comic / Web-Slinger',
    tier: 'plus',
    vibe: 'Bold comic panels, Spider-crimson, cobalt blue & halftone ink',
    swatches: ['#EEF4FF', '#FFFFFF', '#E11D48', '#1D4ED8'],
    particleLabel: 'Halftone comic sparks & corner webs',
    issueTag: 'Issue #14 • Amazing Team-Up!',
    heroSectionLabel: 'Cover Panel',
    pulseLabel: 'Spidey-Sense Ping!',
    pulseToast: 'THWIP! Sent a Spidey-Sense tingle across cities!',
    badgeSymbol: 'Issue #14',
    motif: 'spider-comic',
  },
  {
    id: 'midnight-starlight',
    name: 'Space, Galaxy & Moon',
    tier: 'plus',
    vibe: 'Deep space indigo, nebula violet, crescent moon gold & starlight cyan',
    swatches: ['#060814', '#161336', '#FDE047', '#38BDF8'],
    particleLabel: 'Crescent moon, ringed planet & shooting stars',
    issueTag: 'Orbit 884 • Lunar Log',
    heroSectionLabel: 'Lunar Transmission',
    pulseLabel: 'Send Moonbeam',
    pulseToast: 'Beamed a starlight signal across the galaxy',
    badgeSymbol: 'Lunar Orbit',
    motif: 'moon-galaxy',
  },
  {
    id: 'goth-velvet',
    name: 'Goth / Velvet Noir',
    tier: 'plus',
    vibe: 'Deep wine obsidian, blood-crimson velvet & antique pewter',
    swatches: ['#11070C', '#24111B', '#DC2626', '#D1D5DB'],
    particleLabel: 'Crimson velvet embers',
    issueTag: 'Act III • Velvet Covenant',
    heroSectionLabel: 'Relic of the Night',
    pulseLabel: 'Velvet Whisper',
    pulseToast: 'Sent a crimson velvet whisper through the night',
    badgeSymbol: 'Velvet Act',
    motif: 'goth-rose',
  },
  {
    id: 'halloween',
    name: 'Halloween / Spooky',
    tier: 'plus',
    vibe: 'Witching-hour violet, glowing jack-o’-lantern orange & dashed spellwork',
    swatches: ['#170B24', '#2A1642', '#FF6B1A', '#C084FC'],
    particleLabel: 'Floating bats & lantern sparks',
    issueTag: 'Midnight Hour • Spellbook XIV',
    heroSectionLabel: 'Spellbound Snap',
    pulseLabel: 'Cast a Little Spell',
    pulseToast: 'Boo! Sent a warm pumpkin spark across the dark',
    badgeSymbol: 'Spellbook',
    motif: 'pumpkin-bat',
  },
  {
    id: 'nature-botanical',
    name: 'Nature / Botanical',
    tier: 'plus',
    vibe: 'Conservatory sage celadon, pine ink & moss fern green',
    swatches: ['#E4EFE6', '#F5FAF6', '#163020', '#2D6A4F'],
    particleLabel: 'Drifting pressed conservatory leaves',
    issueTag: 'Field Notes • Specimen XIV',
    heroSectionLabel: 'Pressed Specimen',
    pulseLabel: 'Send a Forest Breeze',
    pulseToast: 'Sent a crisp pine breeze from your side of the world',
    badgeSymbol: 'Herbarium',
    motif: 'fern-leaf',
  },
  {
    id: 'sakura-rose',
    name: 'Sakura / Soft Rose',
    tier: 'plus',
    vibe: 'Japanese blush petal silk, cherry blossom magenta & deep plum ink',
    swatches: ['#FCEEF3', '#FFF9FB', '#3B1926', '#D6457A'],
    particleLabel: 'Swirling 5-petal cherry blossoms',
    issueTag: 'Spring Scroll • Blossom XIV',
    heroSectionLabel: 'Pressed Petal',
    pulseLabel: 'Send a Petal Drift',
    pulseToast: 'Released a cherry blossom breeze to their screen',
    badgeSymbol: 'Sakura Vol.',
    motif: 'sakura-flower',
  },
  {
    id: 'cozy-autumn',
    name: 'Cozy Autumn',
    tier: 'plus',
    vibe: 'Warm spiced cider, burnt maple orange & golden amber ochre',
    swatches: ['#F2DEC4', '#FFF6EA', '#B84318', '#D97706'],
    particleLabel: 'Golden oak & maple leaves',
    issueTag: 'Harvest Journal • Chapter XIV',
    heroSectionLabel: 'Fireside Snapshot',
    pulseLabel: 'Send Warmth',
    pulseToast: 'Sent fireside cider warmth across the miles',
    badgeSymbol: 'Fireside',
    motif: 'maple-mug',
  },
];

export const MIXTAPE_SONGS: MixtapeSong[] = [
  {
    id: 'song-1',
    title: 'Texas Sun',
    artist: 'Khruangbin & Leon Bridges',
    duration: '04:12',
    coverGradient: 'linear-gradient(135deg, #C05A3F, #D89A6C)',
    dedication: 'Played three times in a row while we drove down Highway 1.',
  },
  {
    id: 'song-2',
    title: 'Harvest Moon',
    artist: 'Neil Young',
    duration: '05:03',
    coverGradient: 'linear-gradient(135deg, #2D6A4F, #163020)',
    dedication: 'Our late-night kitchen slow-dance anthem in Paris.',
  },
  {
    id: 'song-3',
    title: 'La Vie En Rose',
    artist: 'Édith Piaf',
    duration: '03:07',
    coverGradient: 'linear-gradient(135deg, #D6457A, #6D28D9)',
    dedication: 'Caught in the rain under the awning on Rue Lepic.',
  },
  {
    id: 'song-4',
    title: 'Midnight Rain',
    artist: 'The Paper Kites',
    duration: '03:48',
    coverGradient: 'linear-gradient(135deg, #0B0F26, #38BDF8)',
    dedication: 'Listening together on FaceTime from Platform 4.',
  },
];

const NOW = Date.now();

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    authorId: 'julian',
    authorName: 'Julian',
    type: 'photo',
    title: 'Morning Espresso & Two Croissants',
    body: 'You took the corner booth even though it was pouring outside. Still my favorite slow morning.',
    memoryDate: '2026-11-19',
    createdAt: NOW - 2 * 60 * 1000, // 2 minutes ago -> live 10-min edit timer ready!
    photoUrl: SAMPLE_PHOTOS[1].url,
    backNote: 'P.S. You stole half my almond croissant while I grabbed napkins — worth it.',
    locationLabel: 'Soho, London',
    weatherStamp: 'Crisp Rain 11°C',
    distanceLabel: '0 miles apart',
    song: MIXTAPE_SONGS[0],
    voiceDuration: '00:28',
    voiceLabel: 'Café rain ambience & laugh',
    hiddenForUsers: [],
  },
  {
    id: 'mem-2',
    authorId: 'elena',
    authorName: 'Elena',
    type: 'photo',
    title: 'Montmartre Steps at Golden Hour',
    body: 'We missed the 6:15 train on purpose just to watch the rooftops turn copper.',
    memoryDate: '2026-10-18',
    createdAt: NOW - 30 * 24 * 60 * 60 * 1000,
    photoUrl: SAMPLE_PHOTOS[0].url,
    backNote: 'Held onto the metro ticket inside my coat pocket all year.',
    locationLabel: 'Montmartre, Paris',
    weatherStamp: 'Golden Hour 17°C',
    distanceLabel: '214 miles apart',
    song: MIXTAPE_SONGS[2],
    hiddenForUsers: [],
  },
  {
    id: 'mem-3',
    authorId: 'julian',
    authorName: 'Julian',
    type: 'voice',
    title: 'Voice Letter #18 — Platform 4',
    body: 'Recorded right after your train pulled out so I wouldn’t forget how calm your voice sounded on the call.',
    memoryDate: '2026-09-12',
    createdAt: NOW - 60 * 24 * 60 * 60 * 1000,
    locationLabel: 'Florence Station',
    weatherStamp: 'Warm Dusk 22°C',
    distanceLabel: '780 miles apart',
    voiceDuration: '00:44',
    voiceLabel: 'Platform 4 Goodnight Memo',
    hiddenForUsers: [],
  },
  {
    id: 'mem-4',
    authorId: 'elena',
    authorName: 'Elena',
    type: 'photo',
    title: 'Highway 1 Coastal Pullout',
    body: 'One year ago today we pulled over with lukewarm tea and watched fog roll off the cliffs.',
    memoryDate: '2025-11-20',
    createdAt: NOW - 365 * 24 * 60 * 60 * 1000,
    photoUrl: SAMPLE_PHOTOS[2].url,
    backNote: 'That jacket smelled like salt air for two weeks.',
    locationLabel: 'Big Sur, CA',
    weatherStamp: 'Breezy 19°C',
    distanceLabel: '0 miles apart',
    isOnThisDay: true,
    song: MIXTAPE_SONGS[1],
    hiddenForUsers: [],
  },
  {
    id: 'mem-5',
    authorId: 'julian',
    authorName: 'Julian',
    type: 'text',
    title: 'Midnight Promise on Paper',
    body: 'You don’t need a grand gesture every weekend. Just saving the tiny ordinary things before they vanish.',
    memoryDate: '2025-07-14',
    createdAt: NOW - 480 * 24 * 60 * 60 * 1000,
    locationLabel: 'Joshua Tree',
    weatherStamp: 'Clear Night 21°C',
    distanceLabel: '3,410 miles apart',
    hiddenForUsers: [],
  },
];

export const INITIAL_LETTERS: LetterItem[] = [
  {
    id: 'let-1',
    authorId: 'elena',
    authorName: 'Elena',
    title: 'The quiet after everyone went home',
    body: 'I kept thinking about how you stayed an extra twenty minutes just to stack the mugs in my tiny kitchen. Being apart this month has felt lighter knowing you notice those small things.',
    promptUsed: 'A tiny kindness you noticed this week',
    createdAt: NOW - 4 * 60 * 1000, // editable by Elena
    hiddenForUsers: [],
  },
  {
    id: 'let-2',
    authorId: 'julian',
    authorName: 'Julian',
    title: 'Under the awning on Rue Lepic',
    body: 'Next time it rains like that in Paris, I promise I’ll actually pack two umbrellas instead of pretending we enjoy running down cobblestones.',
    createdAt: NOW - 6 * 24 * 60 * 60 * 1000,
    promotedToTimeline: true,
    hiddenForUsers: [],
  },
];

export const INITIAL_COUNTDOWNS: CountdownItem[] = [
  {
    id: 'cd-1',
    authorId: 'julian',
    title: 'Next Paris Reunion',
    targetDate: '2026-12-18',
    location: 'Paris Gare du Nord',
    isMystery: false,
    emoji: '✈️',
  },
  {
    id: 'cd-2',
    authorId: 'elena',
    title: 'Surprise Cabin Weekend + Vinyl Night',
    targetDate: '2026-12-04',
    location: 'Lake Como Cabin',
    isMystery: true,
    isRevealed: false,
    emoji: '🕯️',
  },
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'qz-1',
    authorId: 'elena',
    question: 'What did Julian accidentally order instead of iced oat latte on our very first café date?',
    correctAnswer: 'A sparkling tonic espresso with rosemary (and pretended he loved it)',
    wager: 'Loser buys almond croissants all Sunday',
    partnerGuess: 'Sparkling rosemary espresso!',
    isScratched: false,
  },
  {
    id: 'qz-2',
    authorId: 'julian',
    question: 'Which song played three times in a row while we drove down Highway 1?',
    correctAnswer: 'Texas Sun — Khruangbin & Leon Bridges',
    wager: 'Winner picks Friday night movie',
    partnerGuess: 'Texas Sun',
    isScratched: true,
    promotedToTimeline: true,
  },
];

export const INITIAL_CAPSULES: TimeCapsuleItem[] = [
  {
    id: 'cap-1',
    authorId: 'julian',
    title: 'Read on Our Anniversary Morning',
    message: 'If we’re opening this together with two mugs of coffee, look back at Memory #1 and remember how nervous I was setting up this little archive for us. Every chapter since has felt effortlessly ours.',
    unlockDate: '2026-11-20',
    isUnlocked: true,
    isMutual: true,
    hasOpened: false,
  },
  {
    id: 'cap-2',
    authorId: 'elena',
    title: 'For Our 2027 Summer Self',
    message: 'Locked until June 2027 — don’t peek!',
    unlockDate: '2027-06-15',
    isUnlocked: false,
    isMutual: false,
    hasOpened: false,
  },
];

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  { id: 'bl-1', title: 'Watch sunrise from a mountain cabin porch', category: 'Travel', completed: true, completedDate: '2026-10-18', promotedToMemory: true },
  { id: 'bl-2', title: 'Cook homemade ramen from scratch on a rainy Sunday', category: 'Date Night', completed: false },
  { id: 'bl-3', title: 'Visit Kyoto in late autumn peak foliage', category: 'Travel', completed: false },
  { id: 'bl-4', title: 'Record a 5-minute time capsule voice note together', category: 'Everyday', completed: false },
];

export const INITIAL_ARCHIVED_SPACES: ArchivedSpace[] = [
  {
    id: 'arch-1',
    title: 'University Years Chapter',
    dateRange: '2022 – 2024',
    memoryCount: 48,
    coverQuote: 'Late library nights & graduation summer.',
    highlights: [
      { title: 'Campus Botanical Gardens', date: '2023-05-12', note: 'Exam week picnic before finals.' },
      { title: 'First Apartment Keys', date: '2023-09-01', note: 'Pizza on moving boxes.' },
    ],
  },
];
