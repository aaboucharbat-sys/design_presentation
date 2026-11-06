import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  world: string;
  topic: string;
  title: string;
  subtitle?: string;
  kind?: string;
  tag?: string;
  bullets?: string[];
  cards?: { title: string; text: string }[];
  note?: string;
  placeholder?: string;
  table?: string[][];
  concept?: number;
  variant?: "A" | "B" | "C" | "D";
  correct?: "A" | "B" | "C" | "D";
};

const types = [
  ["GRAPHIC DESIGN", "Communicating ideas visually with type, colour, images and layout.", "posters, social posts, logos, CVs", "a festival poster · a brand logo · an Instagram post", "poster or logo example"],
  ["UI DESIGN", "How a digital product looks: buttons, forms, screens, icons and colours.", "app and website interfaces", "a banking app screen · a login form · a dashboard", "app screen"],
  ["UX DESIGN", "How a product works and feels: research, user flows and usability.", "user journeys, wireframes, prototypes", "a checkout flow · a wireframe sketch · a usability test", "wireframe or user flow"],
  ["MOTION DESIGN", "Bringing graphics to life through animation.", "animated logos, reels, explainers", "an animated logo · a reel intro · an explainer video", "animation frames"],
  ["PRODUCT / INDUSTRIAL", "Shaping useful, beautiful physical objects.", "furniture, packaging, devices", "a chair · a phone · a water bottle", "product photo"],
];

const process = [
  ["BRIEF", "Meet the client, listen, write everything down and agree on the goal.", "Who is the audience? Goal? Main message? Format, deadline, budget and must-haves?", "A written brief the client approves.", "Starting to design without a clear brief."],
  ["RESEARCH", "Study the client's field, competitors, audience and trends.", "List 5 competitors · collect references · build a moodboard · write 5 mood keywords.", "Moodboard + keyword list.", "Copying a reference instead of taking inspiration."],
  ["BRAINSTORM / IDEATION", "Generate many ideas fast, without judging.", "Mind map · word association · Crazy 8 · quantity before quality.", "15 to 20 raw ideas.", "Stopping at the first idea."],
  ["DRAFT SKETCH", "Turn the best ideas into quick thumbnails on paper or tablet.", "Draw 3–5 layouts in 10 minutes; use boxes for images and lines for text.", "3 to 5 rough sketches.", "Opening the software too early."],
  ["CONCEPT DEVELOPMENT", "Choose the strongest sketch and define its visual direction.", "Test 2 palettes and font pairings · set the grid · check the brief · ask for feedback.", "A style direction + 2 rough digital versions.", "Mixing too many ideas in one design."],
  ["DESIGN", "Build the final artwork in Figma, Illustrator or Photoshop.", "Apply the 12 concepts · use real content · organise layers · check resolution and colour mode.", "Final artwork, ready for review.", "Forgetting spelling, alignment or image quality."],
  ["DELIVER", "Present the work, collect feedback and finish.", "Explain choices · limit revisions · export PNG/JPG/PDF/SVG · name files · ask for a testimonial.", "Final files + happy client.", "Sending the wrong format or unnamed files."],
];

const fields = [
  ["VISUAL IDENTITY & BRANDING", "Creating the whole look and feel of a brand.", "Logo · colour palette · typography · patterns · guidelines · cards · social templates", "A brand is more than a logo.", "brand identity board"],
  ["MARKETING & ADVERTISING", "Visuals that promote, sell or inform.", "Social posts · ads · flyers · posters · email headers · thumbnails", "One clear message and one call to action.", "ad or social post"],
  ["PACKAGING DESIGN", "The design of boxes, bottles, bags and labels.", "Dieline · CMYK colours · legal info · 3D mockups", "Design for the shelf: stand out in 3 seconds.", "packaging mockup"],
  ["BANNERS", "Wide formats for web and events.", "Web ads 728×90 and 300×250 · social covers · roll-ups · event backdrops", "Big readable text and a single message.", "banner example"],
];

const conceptData = [
  { name: "CONTRAST", def: "Difference between elements—light vs dark, big vs small, bold vs thin—that makes things stand out.", key: "Use contrast to show what matters first and to keep text readable.", mini: "DESIGN NIGHT|Workshop for beginners|Friday 6 Nov · 9:00|ByteCraft Hub · Room 2|Free entry|REGISTER", correct: "C" as const, answer: "White text on charcoal is easy to read and the yellow accent stands out. The others use pale or muted text on similar backgrounds." },
  { name: "BALANCE", def: "The way visual weight is distributed in a layout, either symmetrical or asymmetrical.", key: "A balanced design feels stable; deliberate imbalance creates tension.", mini: "NOVA|COFFEE ROASTERS", correct: "A" as const, answer: "Icon and name share one central axis, so visual weight is even on both sides. In the others the heavy elements sit to one side or one corner." },
  { name: "HIERARCHY", def: "The order in which the eye reads information, led by size, weight, colour and position.", key: "Title first, subtitle second, details last. Always decide the reading order.", mini: "BISTRO LUNA|STARTERS · Harira soup $6 · Mechouia salad $7|MAINS · Lamb couscous $18 · Grilled sea bream $21|DESSERTS · Date cake $6 · Mint tea $3", correct: "B" as const, answer: "Title, section headings, dishes and prices form a clear order of importance. In the others, prices, dishes or headings outshout the level above." },
  { name: "ALIGNMENT", def: "Placing elements along common edges or axes.", key: "Alignment creates invisible lines that make a layout look clean and professional.", mini: "Amina Haddad / Graphic Designer|PROFILE · Creative designer with 3 years of branding experience.|EXPERIENCE · Studio Nova · 2023–2025 · Social media and print|EDUCATION · BA Visual Communication · City University · 2022", correct: "D" as const, answer: "Every heading and line starts on the same left edge. The others have small offsets (8 to 16 px) that break the line." },
  { name: "PROXIMITY", def: "Grouping related items close together and separating unrelated ones.", key: "Closeness tells the viewer “these belong together”.", mini: "WORKSHOP|Intro to Figma|Build your first interface in one session|Friday 6 November · 9:00|ByteCraft Hub · Room 2|Join us", correct: "A" as const, answer: "Title and subtitle sit together, date and place sit together, and the button has its own space. In the others, spacing is even or groups are split." },
  { name: "REPETITION", def: "Reusing colours, fonts, shapes or spacing across a design.", key: "Repetition builds consistency and brand recognition.", mini: "MOKA|MOKA|MOKA|MOKA|MOKA|MOKA", correct: "C" as const, answer: "All six tiles share the same size, corner radius, colours and spacing. The others change one tile's shape, colour, size or position." },
  { name: "WHITE SPACE", def: "The empty area around and between elements, also called negative space.", key: "White space gives content room to breathe and guides attention.", mini: "Slow mornings|Small-batch coffee, roasted fresh every week.|Shop now", correct: "D" as const, answer: "Generous margins and gaps give each element room to breathe. In the others margins are tight, gaps shrink or too much text fills the page." },
  { name: "PROPORTION", def: "How big or small things are compared to each other. It affects what feels important.", key: "Big titles, medium images, small details: keep logic and visual harmony.", mini: "FRESH JUICE|$4 only|Order now|Cold-pressed daily · 100% fruit", caption: "Big title, medium product image, small details: sizes follow importance." },
  { name: "RHYTHM", def: "A visual flow or pattern that makes the eye move naturally from one part to another.", key: "Repetition + variation = rhythm. It keeps design dynamic.", mini: "SUMMER BEATS|Open-air festival · 21 July", caption: "Tall and short bars alternate at even spacing and grow slowly: repetition + variation gives rhythm." },
  { name: "SIMPLICITY", def: "Simple does not mean empty, it means clear. Remove anything that does not help.", key: "Less, but better. If an element does not add value, delete it.", mini: "Open mic night|Thursday · 7 pm", caption: "One shape, one headline, one line of info. Nothing that does not help the message." },
  { name: "UNITY", def: "Everything looks like it belongs together: same style, colours and feeling.", key: "Unity makes design strong and trustworthy. Randomness loses focus.", mini: "Rosa Bakery|Bakery · Cakes|Fresh every morning", caption: "Letterhead, card, tag and post share one palette, one typeface and the same rounded shapes." },
  { name: "MOVEMENT", def: "How you lead the viewer's eyes through your design.", key: "Use lines, arrows, faces or shapes that point where to look.", mini: "LOGO|SUMMER SALE|Up to 50% off · this weekend|Shop now", caption: "Arrows lead the eye from the logo to the headline and then to the call to action." },
];

const card = (title: string, text: string) => ({ title, text });

function buildSlides(): Slide[] {
  const s: Slide[] = [
    { id: "COVER", world: "WORLD 0-1", topic: "WELCOME", title: "SKILLFEST 2", subtitle: "Graphic Design Workshop", kind: "cover", bullets: ["From design theory to your first freelance client", "Friday 6 & Saturday 7 November · Organised by ByteCraft"] },
    { id: "ICEBREAKER", world: "WORLD 0-2", topic: "ICEBREAKER", title: "SHAPE YOUR PARTNER", subtitle: "MINI GAME · 10 MINUTES", kind: "ice", bullets: ["Pair up with someone you don't know. Speakers join in too!", "Interview them for 2 minutes: name, favourite colour, one thing they want to learn.", "Draw their portrait in 60 seconds using ONLY circles, squares and triangles.", "Swap drawings, then introduce your partner in one sentence."], note: "Most creative portrait wins a power-up!" },
    { id: "A-00", world: "WORLD 1-1", topic: "THE BASICS", title: "WORLD 1", subtitle: "Part A · The Basics", kind: "world", bullets: ["Types of design", "Definition", "Roadmap", "Design process", "Fields", "Pixels & resolution"] },
    { id: "A-01", world: "WORLD 1-2", topic: "TYPES OF DESIGN", title: "5 TYPES OF DESIGN", kind: "cards", cards: types.map((x) => card(x[0], x[1])), note: "UX decides what to build, UI decides how it looks, graphic design provides the visual language both rely on." },
  ];
  types.forEach((x, i) => s.push({ id: `A-0${i + 2}`, world: `WORLD 1-${i + 3}`, topic: "TYPES OF DESIGN", title: x[0], tag: `TYPE ${i + 1} OF 5`, kind: "example", cards: [card("WHAT IT IS", x[1]), card("TYPICAL OUTPUT", x[2]), card("3 REAL EXAMPLES", x[3]), card("SKILLS USED", "Composition · typography · colour · visual storytelling")], placeholder: x[4] }));
  s.push(
    { id: "A-07", world: "WORLD 1-8", topic: "DEFINITION", title: "WHAT IS GRAPHIC DESIGN?", kind: "quote", subtitle: "Graphic design = combining text, image and shape to deliver a clear message.", cards: [card("TEXT", "Words and typography"), card("IMAGE", "Photos, illustrations, icons"), card("SHAPE", "Lines, frames, colour blocks")], note: "Plus colour and layout to hold everything together." },
    { id: "A-08", world: "WORLD 1-9", topic: "DEFINITION", title: "WHAT IT IS · AND IS NOT", kind: "compare", cards: [card("IT IS", "Problem solving with visuals · making information understandable and memorable · communicating for a goal and audience"), card("IT IS NOT", "Just decoration · just using software · just “making it pretty” · copying trends"), card("EVERYDAY DESIGN", "Road signs · packaging · app icons · menus · posters · shop logos")], note: "A designer's job: send the right message to the right person." },
    { id: "A-09", world: "WORLD 1-10", topic: "ROADMAP", title: "DESIGNER → FREELANCER", kind: "roadmap", cards: [
      card("1-1 BASICS", "Practise concepts + Figma daily"),
      card("1-2 NICHE", "Social · branding · print · CVs"),
      card("1-3 PORTFOLIO", "3–5 strong projects; show process"),
      card("1-4 PRESENCE", "Behance · LinkedIn · Instagram"),
      card("1-5 CLIENTS", "Friends · associations · local business"),
      card("1-6 PRICE", "Clear brief · revisions · deposit"),
      card("1-7 GROW", "Testimonials · specialise · learn"),
    ] },
    { id: "A-10", world: "WORLD 1-11", topic: "PROCESS", title: "THE DESIGN PROCESS", kind: "steps", bullets: ["BRIEF", "RESEARCH", "IDEATION", "SKETCH", "CONCEPT", "DESIGN", "DELIVER"], note: "Skipping steps 1 to 5 is the #1 beginner mistake." },
  );
  process.forEach((x, i) => s.push({ id: `A-${11 + i}`, world: `WORLD 1-${12 + i}`, topic: "DESIGN PROCESS", title: `STEP ${i + 1} · ${x[0]}`, tag: `STEP ${i + 1} OF 7`, kind: "process", concept: i + 1, cards: [card("WHAT YOU DO", x[1]), card("QUESTIONS / TECHNIQUES", x[2]), card("OUTPUT", x[3]), card("COMMON MISTAKE", x[4])] }));
  fields.forEach((x, i) => s.push({ id: `A-${18 + i}`, world: `WORLD 1-${19 + i}`, topic: "FIELDS", title: x[0], tag: `FIELD ${i + 1} OF 4`, kind: "example", cards: [card("WHAT IT IS", x[1]), card("WHAT IT INCLUDES", x[2]), card("PRO TIP", x[3])], placeholder: x[4] }));
  s.push(
    { id: "A-22", world: "WORLD 1-23", topic: "PIXELS", title: "WHAT IS A PIXEL?", kind: "pixel", cards: [card("THE TINY SQUARE", "A pixel is the smallest square of colour in a digital image."), card("MORE PIXELS = MORE DETAIL", "Full HD 1920×1080 ≈ 2 million · phone photo 4000×3000 = 12 MP · Instagram 1080×1080 · Story 1080×1920 · YouTube 1280×720")] },
    { id: "A-23", world: "WORLD 1-24", topic: "RESOLUTION", title: "PPI vs DPI", kind: "compare", cards: [card("PPI · SCREEN", "Pixels per inch. How densely pixels sit on a screen. A phone can be 400+ ppi."), card("DPI · PRINT", "Dots per inch. How many ink dots a printer places. Standard print = 300 dpi."), card("1000 PX WIDE", "At 100 ppi = 10 inches · at 300 ppi = only 3.3 inches")], note: "Web: pixel size matters · Print: 300 dpi · Big poster seen from far: 150 dpi is fine" },
    { id: "A-24", world: "WORLD 1-25", topic: "RESOLUTION", title: "RASTER vs VECTOR", kind: "compare", cards: [card("RASTER", "Made of pixels: photos, JPG, PNG. Blurs when enlarged."), card("VECTOR", "Made of paths and maths: logos, icons, SVG, AI, PDF. Sharp at any size.")], note: "Photos = raster. Logos and icons = vector." },
    { id: "A-25", world: "WORLD 1-26", topic: "RESOLUTION", title: "RESOLUTION IN PRACTICE", kind: "table", table: [["USE", "SIZE", "RESOLUTION"], ["Instagram post", "1080 × 1080 px", "Screen"], ["Story", "1080 × 1920 px", "Screen"], ["Business card", "1050 × 600 px", "300 dpi"], ["A4 flyer", "2480 × 3508 px", "300 dpi"]], note: "Common mistakes: stretching a small image · using a screenshot for print · saving a JPG again and again" },
    { id: "A-26", world: "WORLD 1-27", topic: "CHECKPOINT", title: "WORLD 1 COMPLETE", subtitle: "LEVEL CLEAR!", kind: "complete", bullets: ["Types of design", "Definition", "Roadmap", "Design process", "Fields", "Pixels & resolution"] },
    { id: "B-00", world: "WORLD 2-1", topic: "COLOUR & TYPE", title: "WORLD 2", subtitle: "Part B · Colour & Type", kind: "world", bullets: ["Colour theory", "Colour modes", "Typography", "Type categories", "Fonts"] },
    { id: "B-01", world: "WORLD 2-2", topic: "COLOUR THEORY", title: "THE COLOUR WHEEL", kind: "wheel", bullets: ["Colour theory = rules for mixing and combining colours.", "Primary: red, yellow, blue. Screens use red, green, blue light.", "Secondary: orange, green, violet.", "Tertiary: the 6 in-between colours."] },
    { id: "B-02", world: "WORLD 2-3", topic: "COLOUR THEORY", title: "ANATOMY OF A COLOUR", kind: "swatches", cards: [card("HUE", "The pure colour"), card("SATURATION", "How vivid or dull"), card("BRIGHTNESS / VALUE", "How light or dark"), card("TINT", "Colour + white"), card("TONE", "Colour + grey"), card("SHADE", "Colour + black")], note: "Change one at a time to build a palette." },
    { id: "B-03", world: "WORLD 2-4", topic: "COLOUR THEORY", title: "WARM, COOL & MEANING", kind: "compare", cards: [card("WARM", "Red · orange · yellow feel energetic and close."), card("COOL", "Blue · green · violet feel calm and distant."), card("MEANING", "Red energy · Orange fun · Yellow optimism · Green growth · Blue trust · Purple luxury · Black power · White clean")], note: "Meanings change between cultures. Always check your audience." },
    { id: "B-04", world: "WORLD 2-5", topic: "COLOUR THEORY", title: "COLOUR HARMONIES", kind: "cards", cards: [card("MONOCHROMATIC", "One hue, many tints and shades"), card("ANALOGOUS", "Neighbours; calm"), card("COMPLEMENTARY", "Opposites; strong contrast"), card("SPLIT-COMP", "One + neighbours of opposite"), card("TRIADIC", "Three evenly spaced; playful")] },
    { id: "B-05", world: "WORLD 2-6", topic: "COLOUR THEORY", title: "USING COLOUR WELL", kind: "list", bullets: ["60–30–10: dominant, secondary, accent", "Limit palettes to 3–5 colours", "Text contrast: at least 4.5:1", "Test your design in greyscale", "Tools: Coolors · Adobe Color · Color Hunt"] },
  );
  [
    ["B-06", "COMPLEMENTARY", "complementary colour design", "Opposite colours make the focal point pop.", "#1F4E9C · #F28C28 · #FFFFFF · #111111 · #FFD700"],
    ["B-07", "ANALOGOUS", "analogous sunset colour design", "Neighbouring colours feel calm and unified.", "#E52521 · #F28C28 · #FFD700 · #F6B26B · #FFF1D0"],
    ["B-08", "MONOCHROMATIC", "monochromatic colour design", "One hue, many values: simple and elegant.", "#0B1F3A · #1F4E9C · #6495F7 · #A8C5FF · #EAF1FF"],
  ].forEach((x, i) => s.push({ id: x[0], world: `WORLD 2-${7 + i}`, topic: "COLOUR EXAMPLES", title: `EXAMPLE ${i + 1} · ${x[1]}`, kind: "example", cards: [card("PALETTE", x[4]), card("WHY IT WORKS", x[3])], placeholder: x[2] }));
  s.push(
    { id: "B-09", world: "WORLD 2-10", topic: "COLOUR MODES", title: "COLOUR MODES", kind: "cards", cards: [card("RGB", "Light for screens"), card("CMYK", "Ink for print"), card("GRAYSCALE", "256 shades, no hue"), card("BITMAP", "Black or white only")], note: "Screen = RGB · Print = CMYK. Pick the mode before you start." },
    { id: "B-10", world: "WORLD 2-11", topic: "COLOUR MODES", title: "RGB · LIGHT", kind: "rgb", bullets: ["Additive colour made of LIGHT", "Red, green and blue overlap to white", "Each channel: 0–255 = 16.7 million colours", "Pure red: 255, 0, 0 = #FF0000", "Websites · social media · apps · video", "Figma works in RGB"] },
    { id: "B-11", world: "WORLD 2-12", topic: "COLOUR MODES", title: "CMYK · INK", kind: "cmyk", bullets: ["Subtractive colour made of INK", "Cyan, magenta, yellow + K (key black)", "Each ink: 0–100%", "Flyers · posters · cards · packaging", "Bright RGB colours may print duller", "Ask your printer which profile to use"] },
    { id: "B-12", world: "WORLD 2-13", topic: "COLOUR MODES", title: "GRAYSCALE", kind: "gradient", bullets: ["One brightness channel, no hue", "Black 0 → white 255 = 256 shades", "Used for photos, newspapers, single-ink print", "Designer trick: use greyscale to test contrast and hierarchy"] },
    { id: "B-13", world: "WORLD 2-14", topic: "COLOUR MODES", title: "BITMAP", kind: "modes", bullets: ["Only 1 bit per pixel", "Pure black or pure white—no greys", "Line art · stamps · scanned text · engraving · one-colour logos"], placeholder: "same image in RGB · CMYK · Grayscale · Bitmap" },
    { id: "B-14", world: "WORLD 2-15", topic: "COLOUR MODES", title: "WHICH MODE SHOULD I USE?", kind: "table", table: [["PROJECT", "MODE"], ["Instagram / website / app", "RGB"], ["Business card / poster / flyer", "CMYK"], ["Newspaper photo", "Grayscale"], ["Stamp / laser engraving", "Bitmap"]], note: "Design in RGB in Figma, export PDF for print and confirm the colour profile with your printer." },
    { id: "B-15", world: "WORLD 2-16", topic: "TYPOGRAPHY", title: "THE ART OF ARRANGING TYPE", kind: "quote", subtitle: "Good typography is invisible. Bad typography is noticed.", bullets: ["Choosing typefaces", "Size and weight", "Leading, tracking, kerning", "Alignment", "Hierarchy"] },
    { id: "B-16", world: "WORLD 2-17", topic: "TYPOGRAPHY", title: "ANATOMY OF A LETTER", kind: "anatomy", cards: [card("BASELINE", "Where letters sit"), card("CAP HEIGHT", "Top of capitals"), card("X-HEIGHT", "Height of lowercase x"), card("ASCENDER", "Part rising above x-height"), card("DESCENDER", "Part below baseline"), card("SERIF", "Small finishing stroke"), card("STEM", "Main vertical stroke"), card("COUNTER", "Enclosed inner space")] },
    { id: "B-17", world: "WORLD 2-18", topic: "TYPOGRAPHY", title: "TYPE PROPERTIES", kind: "cards", cards: [card("SIZE", "px or pt"), card("WEIGHT", "Light → Black"), card("LEADING", "1.4–1.6× body size"), card("TRACKING", "Space across letters"), card("KERNING", "Space between two: AV"), card("ALIGNMENT", "Left · centre · right")] },
    { id: "B-18", world: "WORLD 2-19", topic: "TYPOGRAPHY", title: "READABILITY RULES", kind: "compare", cards: [card("BEFORE", "Tiny, tight, long lines and no breathing room make reading hard."), card("AFTER", "Balanced line length, spacing and hierarchy help readers scan.")], bullets: ["45–75 characters per line", "At least 16 px for body on screen", "No long paragraphs in ALL CAPS", "Maximum 2 fonts", "Use size, weight and colour for hierarchy"] },
    { id: "B-19", world: "WORLD 2-20", topic: "TYPE CATEGORIES", title: "CHOOSE YOUR FIGHTER", kind: "fighters", cards: [card("SERIF", "Classic · The Professor"), card("SANS SERIF", "Modern · Friendly Techie"), card("SCRIPT", "Playful · The Poet"), card("DISPLAY", "Bold · The Showman")], note: "BONUS: MONOSPACE for code — Space Mono" },
  );
  [
    ["SERIF", "THE PROFESSOR", "Classic · trustworthy · elegant", "Old-style: EB Garamond · Transitional: Libre Baskerville · Didone: Bodoni Moda · Slab: Roboto Slab", "Books · newspapers · luxury brands · law", "Great for headlines paired with sans body."],
    ["SANS SERIF", "THE FRIENDLY TECHIE", "Clean · modern · neutral", "Grotesque: Inter · Geometric: Poppins · Humanist: Open Sans", "Apps · websites · UI · signage", "Safest choice for body text on screens."],
    ["SCRIPT", "THE POET", "Elegant · personal · romantic", "Formal: Great Vibes · Casual: Pacifico · Brush: Caveat", "Invitations · weddings · beauty · signatures", "Never in ALL CAPS or for long text."],
    ["DISPLAY", "THE SHOWMAN", "Bold · loud · decorative", "Retro: Bungee · Pixel: Press Start 2P · Stencil · Blackletter", "Posters · logos · titles", "Titles only, never body text."],
  ].forEach((x, i) => s.push({ id: `B-${20 + i}`, world: `WORLD 2-${21 + i}`, topic: "TYPE CATEGORIES", title: x[0], subtitle: x[1], tag: `FIGHTER ${i + 1} OF 4`, kind: "type", cards: [card("PERSONALITY", x[2]), card("SUBTYPES", x[3]), card("USED FOR", x[4]), card("PAIRING TIP", x[5])], placeholder: `${x[0]} SkillFest · ABCDEFGHIJKLMNOPQRSTUVWXYZ` }));
  s.push(
    { id: "B-24", world: "WORLD 2-25", topic: "FONTS", title: "TYPEFACE vs FAMILY vs FONT", kind: "cards", cards: [card("TYPEFACE", "The design itself. Example: Inter."), card("FONT FAMILY", "All versions: Light, Regular, Medium, Bold, Italic."), card("FONT", "One specific version: Inter Bold 700, 24 px.")], note: "Typeface = design · Family = whole set · Font = one version you type with." },
    { id: "B-25", world: "WORLD 2-26", topic: "FONTS", title: "WEIGHTS & PAIRING", kind: "weights", bullets: ["Thin 100 → Regular 400 → Bold 700 → Black 900", "GOOD · Playfair Display headline + Inter body", "GOOD · Poppins Bold + Poppins Light", "BAD · Pacifico + Bungee: two loud fonts fight", "Max 2 fonts · pair serif with sans · contrast weight and size"] },
    { id: "B-26", world: "WORLD 2-27", topic: "FONTS", title: "WHERE TO FIND FONTS", kind: "cards", cards: [card("GOOGLE FONTS", "Free, open-source"), card("FONTSHARE", "Free quality families"), card("FONT SQUIRREL", "Curated free fonts")], note: "Check the licence: personal use is not always commercial use. Install fonts before opening a client file." },
    { id: "B-27", world: "WORLD 2-28", topic: "CHECKPOINT", title: "WORLD 2 COMPLETE", subtitle: "LEVEL CLEAR!", kind: "complete", bullets: ["Colour theory", "Colour modes", "Typography", "Type categories", "Fonts"] },
    { id: "C-00", world: "WORLD 3-1", topic: "CORE CONCEPTS", title: "WORLD 3", subtitle: "Part C · Concepts", kind: "world", bullets: ["Texture vs pattern", "The 12 core concepts", "Observation bonus rounds", "Practice"] },
    { id: "C-01", world: "WORLD 3-2", topic: "TEXTURE vs PATTERN", title: "THE BIG DIFFERENCE", kind: "compare", cards: [card("TEXTURE", "How a surface looks or feels: rough, grainy, smooth. Irregular, not repeated on purpose."), card("PATTERN", "A motif repeated in a planned order: rhythmic, regular and tileable.")], note: "Texture = feeling. Pattern = repetition." },
    { id: "C-02", world: "WORLD 3-3", topic: "TEXTURE", title: "TEXTURE EXAMPLES", kind: "gallery", bullets: ["PAPER", "CONCRETE", "WOOD GRAIN", "FABRIC", "WATERCOLOUR", "FILM GRAIN"], note: "Touchable and irregular. Used for depth, realism and a handmade feel." },
    { id: "C-03", world: "WORLD 3-4", topic: "PATTERN", title: "PATTERN EXAMPLES", kind: "patterns", bullets: ["STRIPES", "POLKA DOTS", "CHECKERBOARD", "CHEVRON", "TRIANGLES", "FLORAL GRID"], note: "A motif repeated at regular intervals. Used for textiles, wrapping and brands." },
    { id: "C-04", world: "WORLD 3-5", topic: "TEXTURE vs PATTERN", title: "HOW TO TELL THEM APART", kind: "compare", cards: [card("3-QUESTION TEST", "1 Can you spot one repeating motif? → pattern. 2 Does it feel touchable and irregular? → texture. 3 Could it become a seamless tile? → pattern."), card("QUICK COMPARE", "Repetition: random / planned · Feeling: tactile / rhythmic · Made from: surface detail / repeated motif")], note: "A brick wall PHOTO = texture. A drawn brick repeated = pattern." },
    { id: "C-05", world: "WORLD 3-6", topic: "QUICK QUIZ", title: "TEXTURE OR PATTERN?", kind: "quiz", cards: [card("BRICK WALL PHOTO", "TEXTURE"), card("POLKA DOTS", "PATTERN"), card("SANDPAPER", "TEXTURE"), card("ZEBRA STRIPES", "PATTERN"), card("CRACKED PAINT", "TEXTURE"), card("TILED FLOOR", "PATTERN")] },
    { id: "C-06", world: "WORLD 3-7", topic: "12 CORE CONCEPTS", title: "THE 12 POWER-UPS", kind: "conceptgrid", cards: conceptData.map((c, i) => card(`${i + 1} · ${c.name}`, c.def.split(".")[0])) },
  );
  conceptData.slice(0, 7).forEach((c, i) => {
    const start = s.length;
    s.push({ id: `C-${7 + i * 7}`, world: `WORLD 3-${8 + i * 7}`, topic: "POWER-UP", title: c.name, tag: `CONCEPT ${i + 1} OF 12`, kind: "concept", concept: i + 1, cards: [card("DEFINITION", c.def), card("KEY IDEA", c.key)], note: `Next: spot the design that respects ${c.name}.` });
    (["A", "B", "C", "D"] as const).forEach((v, j) => s.push({ id: `C-${8 + i * 7 + j}`, world: `WORLD 3-${9 + i * 7 + j}`, topic: "BONUS ROUND", title: `DESIGN ${v}`, tag: "TIME 015", kind: "observe", concept: i + 1, variant: v, correct: c.correct, bullets: c.mini.split("|"), note: `Take 15 seconds. Does this design respect ${c.name}? Note your answer.` }));
    s.push({ id: `C-${12 + i * 7}`, world: `WORLD 3-${13 + i * 7}`, topic: "CHOOSE", title: `WHICH ONE RESPECTS ${c.name}?`, kind: "select", concept: i + 1, correct: c.correct });
    s.push({ id: `C-${13 + i * 7}`, world: `WORLD 3-${14 + i * 7}`, topic: "LEVEL CLEAR", title: `${c.name} · ANSWER`, subtitle: `DESIGN ${c.correct}`, kind: "answer", concept: i + 1, variant: c.correct, bullets: c.mini.split("|"), note: c.answer });
    void start;
  });
  conceptData.slice(7).forEach((c, i) => {
    const n = i + 8;
    s.push({ id: `C-${56 + i * 2}`, world: `WORLD 3-${57 + i * 2}`, topic: "POWER-UP", title: c.name, tag: `CONCEPT ${n} OF 12`, kind: "concept", concept: n, cards: [card("DEFINITION", c.def), card("KEY IDEA", c.key)], note: `Next: ${c.name} in action.` });
    s.push({ id: `C-${57 + i * 2}`, world: `WORLD 3-${58 + i * 2}`, topic: "EXAMPLE", title: `${c.name} IN ACTION`, kind: "conceptExample", concept: n, bullets: c.mini.split("|"), note: c.caption });
  });
  s.push(
    { id: "PRACTICE-01", world: "BONUS STAGE", topic: "PRACTICE", title: "TIME FOR PRACTICE!", subtitle: "You know the 12 concepts. Now let's use them!", kind: "practice", cards: [card("NEXT STOP", "The basics of FIGMA")], bullets: ["Buttons", "Placeholders", "Image placeholders", "Text styles & colours", "Icons & shapes", "Cards & lists", "Grids & alignment"] },
    { id: "END-1", world: "FINAL WORLD", topic: "FINAL BOSS", title: "WHICH CONCEPTS DID YOU USE?", kind: "conceptgrid", cards: conceptData.map((c, i) => card(`${i + 1}`, c.name)), note: "Which concept do you find the hardest?" },
    { id: "END-2", world: "FINAL WORLD", topic: "RESOURCES", title: "YOUR TOOLBOX", kind: "resources", cards: [card("DESIGN TOOLS", "Figma · Illustrator · Photoshop · Canva · Affinity"), card("COLOUR", "Coolors · Adobe Color · Color Hunt"), card("FONTS", "Google Fonts · Fontshare · Font Squirrel"), card("INSPIRATION", "Behance · Dribbble · Pinterest · Awwwards"), card("ASSETS", "Unsplash · Pexels · Freepik · Flaticon — check licences"), card("CLIENTS & ADMIN", "Upwork · Fiverr · Contra · LinkedIn · Notion · Trello"), card("BOOKS", "The Non-Designer's Design Book · Thinking with Type")] },
    { id: "END-3", world: "FINAL WORLD", topic: "KEEP GOING", title: "YOUR NEXT CHECKPOINT", kind: "cards", cards: [card("DAILY XP", "Design a little every day—even 30 minutes."), card("COPY TO LEARN", "Recreate before you create."), card("FEEDBACK", "Ask early and often."), card("SAVE PROGRESS", "Your portfolio is made of small wins.")] },
    { id: "END-4", world: "FINAL WORLD", topic: "CONTINUE?", title: "THANK YOU!", subtitle: "GAME OVER... CONTINUE? YES / NO", kind: "end", note: "Good luck, designers! Your next checkpoint is your first client." },
  );
  return s;
}

function PixelArt({ type = "coin" }: { type?: "coin" | "block" | "pipe" | "flag" }) {
  return <span className={`pixel-art ${type}`} aria-hidden="true"><i /></span>;
}

function Card({ title, text, yellow = false }: { title: string; text: string; yellow?: boolean }) {
  return <article className={`card ${yellow ? "yellow" : ""}`}><h3>{title}</h3><p>{text}</p></article>;
}

const examplePhotos: Record<string, { src: string; credit: string }> = {
  "poster or logo example": { src: "https://images.unsplash.com/photo-1610454059909-f9a5a6eb4e58?auto=format&fit=crop&w=1400&q=85", credit: "Brett Jordan" },
  "app screen": { src: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=1400&q=85", credit: "charlesdeluvio" },
  "wireframe or user flow": { src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1400&q=85", credit: "Hal Gatewood" },
  "animation frames": { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=85", credit: "Peter Stumpf" },
  "product photo": { src: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?auto=format&fit=crop&w=1400&q=85", credit: "Kevin Shek" },
  "brand identity board": { src: "https://images.unsplash.com/photo-1590102426275-8d1c367070d3?auto=format&fit=crop&w=1400&q=85", credit: "Slidebean" },
  "ad or social post": { src: "https://images.unsplash.com/photo-1675352161865-27816c76141a?auto=format&fit=crop&w=1400&q=85", credit: "Shutter Speed" },
  "packaging mockup": { src: "https://images.unsplash.com/photo-1793693538739-523c0e01c8c1?auto=format&fit=crop&w=1400&q=85", credit: "Olha Bolharyna" },
  "banner example": { src: "https://images.unsplash.com/photo-1778293444371-a720539f1c3f?auto=format&fit=crop&w=1400&q=85", credit: "Henry Lösing" },
  "complementary colour design": { src: "https://images.unsplash.com/photo-1517815154571-fbabad618f3f?auto=format&fit=crop&w=1400&q=85", credit: "Oleg Laptev" },
  "analogous sunset colour design": { src: "https://images.unsplash.com/photo-1519977552815-08175cb3375a?auto=format&fit=crop&w=1400&q=85", credit: "Emerson Peters" },
  "monochromatic colour design": { src: "https://images.unsplash.com/photo-1608507777998-7b4f2c269120?auto=format&fit=crop&w=1400&q=85", credit: "Kind and Curious" },
};

function ExampleVisual({ label }: { label: string }) {
  if (label.includes("SkillFest")) {
    const family = label.split(" ")[0].toLowerCase();
    return <figure className={`example-visual type-showcase ${family}`}>
      <span className="specimen-kicker">LIVE TYPE SPECIMEN</span>
      <strong>SkillFest</strong>
      <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <p>abcdefghijklmnopqrstuvwxyz</p>
      <div><b>Aa</b><span>Graphic design begins<br />with clear typography.</span></div>
    </figure>;
  }
  if (label.includes("RGB · CMYK")) {
    const src = "https://images.unsplash.com/photo-1715154470884-1c2be0b0129f?auto=format&fit=crop&w=1200&q=85";
    return <figure className="example-visual mode-comparison">{["RGB", "CMYK", "GRAYSCALE", "BITMAP"].map(mode => <div key={mode} className={mode.toLowerCase()}><img src={src} alt={`${mode} colour mode example`} /><b>{mode}</b></div>)}</figure>;
  }
  const photo = examplePhotos[label] || examplePhotos["poster or logo example"];
  return <figure className="example-visual photo-example">
    <img src={photo.src} alt={`${label} example`} />
    <figcaption><span>REAL-WORLD EXAMPLE</span><b>{label}</b><small>Photo: {photo.credit} / Unsplash</small></figcaption>
  </figure>;
}

function MiniDesign({ concept = 1, variant = "A", lines = [] }: { concept?: number; variant?: string; lines?: string[] }) {
  return (
    <div className={`mini concept-${concept} variant-${variant}`}>
      <span className="variant-badge">{variant}</span>
      {concept === 2 && <span className="bean" />}
      {concept === 6 ? <div className="moka-grid">{lines.map((x, i) => <i key={i}>{x}</i>)}</div> :
        concept === 9 ? <><h4>{lines[0]}</h4><div className="rhythm-bars">{[2,4,3,6,4,8,5,10].map((x, i) => <i key={i} style={{ height: `${x * 8}%` }} />)}</div><p>{lines[1]}</p></> :
        concept === 11 ? <><h4>{lines[0]}</h4><div className="stationery"><i /><i /><i /><i /></div><p>{lines.slice(1).join(" · ")}</p></> :
        lines.map((line, i) => i === 0 ? <h4 key={i}>{line}</h4> : i === lines.length - 1 && /register|join|shop|order/i.test(line) ? <button key={i}>{line}</button> : <p key={i}>{line}</p>)}
      {concept === 12 && <div className="arrows">→<br />↘</div>}
      {concept === 4 && variant === "D" && <span className="guide" />}
    </div>
  );
}

function SlideView({ slide, index, total, go }: { slide: Slide; index: number; total: number; go: (n: number) => void }) {
  const renderCards = (cards = slide.cards, yellow = false) => <div className={`cards cards-${Math.min(cards?.length || 1, 6)}`}>{cards?.map((c, i) => <Card key={i} title={c.title} text={c.text} yellow={yellow && i === 1} />)}</div>;
  let body: React.ReactNode;
  switch (slide.kind) {
    case "cover":
      body = <div className="cover-layout"><h1>{slide.title}</h1><h2>{slide.subtitle}</h2><div className="cover-copy">{slide.bullets?.map(x => <p key={x}>{x}</p>)}</div><button className="pixel-button" onClick={() => go(1)}>PRESS START</button><div className="coin-row">{[1,2,3].map(x => <PixelArt key={x} />)}<PixelArt type="block" /></div></div>; break;
    case "ice":
      body = <div className="split"><div className="card rules"><span className="tag">MINI GAME · 10 MIN</span><h2>{slide.title}</h2><ol>{slide.bullets?.map(x => <li key={x}>{x}</li>)}</ol><p className="callout">{slide.note}</p></div><div className="shape-zone"><div className="timer">TIME 060</div><div className="shapes"><i /><i /><i /></div><button className="pixel-button" onClick={() => go(index + 1)}>START</button></div></div>; break;
    case "world":
      body = <div className="world-layout"><span className="tag">NEW WORLD UNLOCKED</span><h1>{slide.title}</h1><h2>{slide.subtitle}</h2><div className="checklist">{slide.bullets?.map(x => <div key={x}><i />{x}</div>)}</div><button className="pixel-button" onClick={() => go(index + 1)}>ENTER WORLD ▶</button></div>; break;
    case "complete":
      body = <div className="world-layout complete"><div className="clear-banner"><PixelArt type="flag" /> LEVEL CLEAR!</div><h1>{slide.title}</h1><div className="checklist">{slide.bullets?.map(x => <div key={x}><i className="checked">✓</i>{x}</div>)}</div><button className="pixel-button" onClick={() => go(index + 1)}>NEXT WORLD ▶</button></div>; break;
    case "example":
    case "type":
      body = <><Title slide={slide} /><div className="example-layout"><div className="stack">{renderCards()}</div><ExampleVisual label={slide.placeholder || "poster or logo example"} /></div></>; break;
    case "concept":
      body = <><Title slide={slide} /><div className="concept-layout">{slide.cards?.map((c, i) => <Card key={i} title={c.title} text={c.text} yellow={i === 1} />)}</div><div className="footer-callout">{slide.note}</div><button className="pixel-button next-cta" onClick={() => go(index + 1)}>START BONUS ROUND ▶</button></>; break;
    case "observe":
      body = <><Title slide={slide} /><div className="observe-layout"><div className="card prompt"><div className="timer">{slide.tag}</div><h3>OBSERVATION MISSION</h3><p>{slide.note}</p><small>Auto-advance in 15 seconds</small></div><div className="screen"><MiniDesign concept={slide.concept} variant={slide.variant} lines={slide.bullets} /></div></div></>; break;
    case "select":
      body = <><Title slide={slide} /><div className="selection">{(["A","B","C","D"] as const).map(x => <button key={x} onClick={() => go(index + 1)}><PixelArt type="block" /><b>{x}</b><span>SELECT</span></button>)}</div><p className="footer-callout">Pick one. Every answer reveals the correct design.</p></>; break;
    case "answer":
      body = <><div className="clear-banner answer-banner"><PixelArt type="flag" /> LEVEL CLEAR!</div><div className="answer-layout"><div className="screen"><MiniDesign concept={slide.concept} variant={slide.variant} lines={slide.bullets} /></div><div className="card"><span className="tag">CORRECT ANSWER</span><h2>{slide.subtitle}</h2><p>{slide.note}</p></div></div></>; break;
    case "conceptExample":
      body = <><Title slide={slide} /><div className="example-layout"><div className="card explainer"><h3>WHY IT WORKS</h3><p>{slide.note}</p><div className="key-chip">POWER-UP {slide.concept} / 12</div></div><div className="screen"><MiniDesign concept={slide.concept} variant="A" lines={slide.bullets} /></div></div></>; break;
    case "table":
      body = <><Title slide={slide} /><div className="table-card">{slide.table?.map((row, i) => <div className={i === 0 ? "head" : ""} key={i}>{row.map(x => <span key={x}>{x}</span>)}</div>)}</div>{slide.note && <div className="footer-callout">{slide.note}</div>}</>; break;
    case "steps":
      body = <><Title slide={slide} /><div className="steps">{slide.bullets?.map((x, i) => <div key={x} style={{ transform: `translateY(${-i * 16}px)` }}><b>{i + 1}</b><span>{x}</span></div>)}</div><div className="footer-callout danger">{slide.note}</div></>; break;
    case "roadmap":
      body = <><Title slide={slide} /><div className="roadmap">{slide.cards?.map((c, i) => <Card key={i} title={c.title} text={c.text} yellow={i === 6} />)}<PixelArt type="flag" /></div></>; break;
    case "pixel":
      body = <><Title slide={slide} /><div className="split"><div className="card heart-card"><div className="pixel-heart">♥</div>{slide.cards && <><h3>{slide.cards[0].title}</h3><p>{slide.cards[0].text}</p></>}</div>{slide.cards && <Card {...slide.cards[1]} />}</div></>; break;
    case "wheel":
    case "rgb":
    case "cmyk":
      body = <><Title slide={slide} /><div className="split"><div className={`color-wheel ${slide.kind}`}><i/><i/><i/><b/></div><div className="card list-card"><ul>{slide.bullets?.map(x => <li key={x}>{x}</li>)}</ul></div></div></>; break;
    case "gallery":
    case "patterns":
      body = <><Title slide={slide} /><div className={`visual-grid ${slide.kind}`}>{slide.bullets?.map((x, i) => <div key={x}><div className={`sample sample-${i}`} />{x}</div>)}</div><div className="footer-callout">{slide.note}</div></>; break;
    case "modes":
      body = <><Title slide={slide} /><div className="split"><div className="card list-card"><ul>{slide.bullets?.map(x => <li key={x}>{x}</li>)}</ul></div><ExampleVisual label={slide.placeholder || ""} /></div></>; break;
    case "quiz":
      body = <><Title slide={slide} /><div className="quiz-grid">{slide.cards?.map((c, i) => <button key={i} onClick={e => e.currentTarget.classList.toggle("revealed")}><span>?</span><b>{c.title}</b><em>{c.text}</em></button>)}</div></>; break;
    case "practice":
      body = <div className="practice"><span className="tag blink">BONUS STAGE</span><h1>{slide.title}</h1><h2>{slide.subtitle}</h2><Card title="NEXT STOP" text="The basics of FIGMA" yellow /><div className="power-chips">{slide.bullets?.map(x => <span key={x}>? {x}</span>)}</div><button className="pixel-button pulse" onClick={() => go(index + 1)}>READY PLAYER? START ▶</button></div>; break;
    case "end":
      body = <div className="end-layout"><h2>{slide.subtitle}</h2><h1>{slide.title}</h1><div className="one-up"><i /></div><p>{slide.note}</p><div><button className="pixel-button" onClick={() => go(0)}>YES</button><button className="pixel-button no" onClick={() => go(0)}>NO</button></div></div>; break;
    default:
      body = <><Title slide={slide} />{slide.subtitle && <div className="quote">{slide.subtitle}</div>}{slide.bullets && <div className="bullet-card"><ul>{slide.bullets.map(x => <li key={x}>{x}</li>)}</ul></div>}{slide.cards && renderCards(undefined, slide.kind === "swatches" || slide.kind === "fighters")}{slide.note && <div className="footer-callout">{slide.note}</div>}</>; break;
  }
  return <div className="slide" aria-label={`${index + 1}. ${slide.title}`}><header className="hud"><span>{slide.world}</span><b>{slide.topic}</b><span>SLIDE {String(index + 1).padStart(3, "0")}/{total}</span></header><main>{body}</main><PixelArt type="coin" /><div className="corner-block"><PixelArt type="block" /></div></div>;
}

function Title({ slide }: { slide: Slide }) {
  return <div className="slide-title">{slide.tag && <span className="tag">{slide.tag}</span>}<h1>{slide.title}</h1>{slide.subtitle && <h2>{slide.subtitle}</h2>}</div>;
}

function MobileSlide({ slide, index, total, go }: { slide: Slide; index: number; total: number; go: (n: number) => void }) {
  const hasVisual = Boolean(slide.placeholder);
  const isMini = ["observe", "answer", "conceptExample"].includes(slide.kind || "");
  return <article className="mobile-slide">
    <header><span>{slide.world}</span><span>{String(index + 1).padStart(3, "0")} / {total}</span></header>
    <div className="mobile-topic">{slide.topic}</div>
    {slide.tag && <span className="mobile-tag">{slide.tag}</span>}
    <h1>{slide.title}</h1>
    {slide.subtitle && <h2>{slide.subtitle}</h2>}
    {hasVisual && <ExampleVisual label={slide.placeholder!} />}
    {isMini && <div className="mobile-mini"><MiniDesign concept={slide.concept} variant={slide.variant || "A"} lines={slide.bullets} /></div>}
    {slide.cards && <div className="mobile-cards">{slide.cards.map((item, i) => <Card key={i} title={item.title} text={item.text} yellow={slide.kind === "concept" && i === 1} />)}</div>}
    {slide.bullets && !isMini && <div className="mobile-list">{slide.bullets.map((item, i) => <div key={`${item}-${i}`}><b>{String(i + 1).padStart(2, "0")}</b><span>{item}</span></div>)}</div>}
    {slide.table && <div className="mobile-table">{slide.table.map((row, i) => <div key={i}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}</div>}
    {slide.note && <p className="mobile-note">{slide.note}</p>}
    {slide.kind === "select" && <div className="mobile-select">{["A", "B", "C", "D"].map(x => <button key={x} onClick={() => go(index + 1)}>{x}</button>)}</div>}
    <div className="mobile-actions"><button onClick={() => go(index - 1)} disabled={index === 0}>← BACK</button><button onClick={() => go(index + 1)} disabled={index === total - 1}>NEXT →</button></div>
  </article>;
}

export default function App() {
  const slides = useMemo(buildSlides, []);
  const [current, setCurrent] = useState(() => Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1)) - 1 || 0)));
  const [overview, setOverview] = useState(false);
  const go = (n: number) => setCurrent(Math.max(0, Math.min(slides.length - 1, n)));
  useEffect(() => { location.hash = String(current + 1); }, [current]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) go(current + 1);
      if (["ArrowLeft", "PageUp"].includes(e.key)) go(current - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(slides.length - 1);
      if (e.key.toLowerCase() === "o") setOverview(v => !v);
      if (e.key === "Escape") setOverview(false);
    };
    addEventListener("keydown", key); return () => removeEventListener("keydown", key);
  }, [current, slides.length]);
  useEffect(() => {
    if (slides[current].kind !== "observe") return;
    const timer = setTimeout(() => go(current + 1), 15000);
    return () => clearTimeout(timer);
  }, [current, slides]);
  return (
    <div className="app">
      <div className="stage"><SlideView slide={slides[current]} index={current} total={slides.length} go={go} /></div>
      <div className="mobile-stage"><MobileSlide slide={slides[current]} index={current} total={slides.length} go={go} /></div>
      <nav className="controls" aria-label="Slide controls">
        <button onClick={() => go(current - 1)} disabled={current === 0}>←</button>
        <button className="count" onClick={() => setOverview(true)}>{current + 1} / {slides.length}</button>
        <button onClick={() => go(current + 1)} disabled={current === slides.length - 1}>→</button>
      </nav>
      <button className="overview-button" onClick={() => setOverview(true)}>ALL SLIDES</button>
      {overview && <div className="overview"><div className="overview-head"><h2>LEVEL SELECT · 128 SLIDES</h2><button onClick={() => setOverview(false)}>CLOSE ×</button></div><div className="slide-list">{slides.map((s, i) => <button className={i === current ? "active" : ""} key={s.id} onClick={() => { go(i); setOverview(false); }}><small>{String(i + 1).padStart(3, "0")} · {s.id}</small><b>{s.title}</b><span>{s.topic}</span></button>)}</div></div>}
    </div>
  );
}
