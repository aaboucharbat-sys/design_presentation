import { useEffect, useMemo, useState } from "react";

type Concept = {
  n: number;
  name: string;
  definition: string;
  key: string;
  correct: string;
  answer: string;
  kind: string;
};

type Slide = {
  id: string;
  world: string;
  topic: string;
  kind: string;
  title?: string;
  content?: string;
  concept?: Concept;
  variant?: string;
};

const colors = {
  red: "#E52521",
  yellow: "#FFD700",
  green: "#43B047",
  charcoal: "#1E1E2E",
  cream: "#F5F1E9",
  ink: "#111111",
};

const concepts: Concept[] = [
  {
    n: 1,
    name: "CONTRAST",
    definition:
      "Difference between elements—light vs dark, big vs small, bold vs thin—that makes things stand out.",
    key: "Use contrast to show what matters first and to keep text readable.",
    correct: "C",
    kind: "poster",
    answer:
      "White text on charcoal is easy to read and the yellow accent stands out. The others use pale or muted text on similar backgrounds.",
  },
  {
    n: 2,
    name: "BALANCE",
    definition:
      "The way visual weight is distributed in a layout, either symmetrically or asymmetrically.",
    key: "A balanced design feels stable; deliberate imbalance creates tension.",
    correct: "E",
    kind: "logo",
    answer:
      "Icon and name share one central axis, so visual weight is even on both sides. In the others the heavy elements sit to one side or one corner.",
  },
  {
    n: 3,
    name: "HIERARCHY",
    definition:
      "The order in which the eye reads information, led by size, weight, colour and position.",
    key: "Title first, subtitle second, details last. Always decide the reading order.",
    correct: "B",
    kind: "menu",
    answer:
      "Title, section headings, dishes and prices form a clear order of importance. In the others, prices, dishes or headings outshout the level above.",
  },
  {
    n: 4,
    name: "ALIGNMENT",
    definition: "Placing elements along common edges or axes.",
    key: "Alignment creates invisible lines that make a layout look clean and professional.",
    correct: "D",
    kind: "cv",
    answer:
      "Every heading and line starts on the same left edge. The others have small offsets (8 to 16 px) that break the line.",
  },
  {
    n: 5,
    name: "PROXIMITY",
    definition: "Grouping related items close together and separating unrelated ones.",
    key: "Closeness tells the viewer “these belong together”.",
    correct: "A",
    kind: "event",
    answer:
      "Title and subtitle sit together, date and place sit together, and the button has its own space. In the others, spacing is even or groups are split.",
  },
  {
    n: 6,
    name: "REPETITION",
    definition: "Reusing colours, fonts, shapes or spacing across a design.",
    key: "Repetition builds consistency and brand recognition.",
    correct: "C",
    kind: "grid",
    answer:
      "All six tiles share the same size, corner radius, colours and spacing. The others change one tile’s shape, colour, size or position.",
  },
  {
    n: 7,
    name: "WHITE SPACE",
    definition: "The empty area around and between elements, also called negative space.",
    key: "White space gives content room to breathe and guides attention.",
    correct: "D",
    kind: "product",
    answer:
      "Generous margins and gaps give each element room to breathe. In the others margins are tight, gaps shrink or too much text fills the page.",
  },
  {
    n: 8,
    name: "PROPORTION",
    definition:
      "How big or small things are compared to each other. It affects how people understand what is important.",
    key: "Big titles, medium images, small details: keep logic and visual harmony.",
    correct: "",
    kind: "juice",
    answer: "Big title, medium product image, small details: sizes follow importance.",
  },
  {
    n: 9,
    name: "RHYTHM",
    definition:
      "A visual flow or pattern that makes the eye move naturally from one part to another.",
    key: "Repetition + variation = rhythm. It keeps the design interesting and dynamic.",
    correct: "",
    kind: "rhythm",
    answer:
      "Tall and short bars alternate at even spacing and grow slowly: repetition + variation gives rhythm.",
  },
  {
    n: 10,
    name: "SIMPLICITY",
    definition:
      "Simple does not mean empty, it means clear. Remove anything that does not help the message.",
    key: "“Less, but better.” If an element does not add value, delete it.",
    correct: "",
    kind: "simple",
    answer: "One shape, one headline, one line of info. Nothing that does not help the message.",
  },
  {
    n: 11,
    name: "UNITY",
    definition:
      "Everything in your design looks like it belongs together: same style, colours and feeling.",
    key: "Unity makes a design strong and trustworthy. If it looks random, people lose focus.",
    correct: "",
    kind: "unity",
    answer:
      "Letterhead, card, tag and post share one palette, one typeface and the same rounded shapes.",
  },
  {
    n: 12,
    name: "MOVEMENT",
    definition: "How you lead the viewer’s eyes through your design.",
    key: "Use lines, arrows, faces or shapes that point where to look.",
    correct: "",
    kind: "movement",
    answer: "Arrows lead the eye from the logo to the headline and then to the call to action.",
  },
];

const fields = [
  ["Logo", "A memorable mark"],
  ["Business cards", "Tiny brand introductions"],
  ["Banners", "Large-format messages"],
  ["Posters", "Inform and attract"],
  ["Thumbnails", "Win the first click"],
  ["Publications", "Books and magazines"],
  ["Packaging", "Products with personality"],
  ["Branding", "A complete visual identity"],
  ["Marketing", "Ads that drive action"],
];

const conceptOverview = [
  ["Contrast", "make things stand out"],
  ["Balance", "distribute visual weight"],
  ["Hierarchy", "guide the reading order"],
  ["Alignment", "share common edges"],
  ["Proximity", "group related items"],
  ["Repetition", "reuse to stay consistent"],
  ["White Space", "room to breathe"],
  ["Proportion", "size relations"],
  ["Rhythm", "a pattern moves the eye"],
  ["Simplicity", "remove the unnecessary"],
  ["Unity", "everything belongs together"],
  ["Movement", "lead the eye"],
];

const baseSlides: Slide[] = [
  { id: "S01", world: "WORLD 0-1", topic: "WELCOME", kind: "cover" },
  { id: "S02", world: "WORLD 0-2", topic: "MEET THE PARTY", kind: "players" },
  { id: "S03", world: "WORLD 0-3", topic: "ICEBREAKER", kind: "bingo" },
  { id: "S04", world: "WORLD 0-4", topic: "WINNER", kind: "winner" },
  { id: "A-00", world: "WORLD 1-0", topic: "THE BASICS", kind: "world1" },
  { id: "A-01", world: "WORLD 1-1", topic: "WHAT IS DESIGN?", kind: "designTypes" },
  { id: "A-02", world: "WORLD 1-2", topic: "GRAPHIC DESIGN", kind: "definition" },
  { id: "A-03", world: "WORLD 1-3", topic: "ROADMAP", kind: "roadmap" },
  { id: "A-04", world: "WORLD 1-4", topic: "THE PROCESS", kind: "process" },
  { id: "A-05", world: "WORLD 1-5", topic: "DESIGN FIELDS", kind: "fields" },
  { id: "A-06", world: "WORLD 1-6", topic: "RESOLUTION", kind: "pixels" },
  { id: "A-END", world: "WORLD 1-7", topic: "COMPLETE", kind: "complete1" },
  { id: "B-00", world: "WORLD 2-0", topic: "COLOUR & TYPE", kind: "world2" },
  { id: "B-01", world: "WORLD 2-1", topic: "COLOUR THEORY", kind: "colour" },
  { id: "B-02", world: "WORLD 2-2", topic: "COLOUR MODES", kind: "modes" },
  { id: "B-03", world: "WORLD 2-3", topic: "TYPOGRAPHY", kind: "typography" },
  { id: "B-04", world: "WORLD 2-4", topic: "TYPE CATEGORIES", kind: "typeCats" },
  { id: "B-05", world: "WORLD 2-5", topic: "FONTS", kind: "fonts" },
  { id: "B-END", world: "WORLD 2-6", topic: "COMPLETE", kind: "complete2" },
  { id: "C-00", world: "WORLD 3-0", topic: "CORE CONCEPTS", kind: "world3" },
  { id: "C-01", world: "WORLD 3-1", topic: "TEXTURE VS PATTERN", kind: "texture" },
  { id: "C-02", world: "WORLD 3-2", topic: "12 CONCEPTS", kind: "overview" },
];

const gameSlides: Slide[] = [];
concepts.slice(0, 7).forEach((concept) => {
  gameSlides.push({
    id: `C-${String(concept.n).padStart(2, "0")}-INTRO`,
    world: `WORLD 3-${concept.n + 2}`,
    topic: `POWER-UP ${concept.n} OF 12`,
    kind: "concept",
    concept,
  });
  ["A", "B", "C", "D", "E"].forEach((variant) =>
    gameSlides.push({
      id: `C-${String(concept.n).padStart(2, "0")}-${variant}`,
      world: "BONUS ROUND",
      topic: `${concept.name} · DESIGN ${variant}`,
      kind: "observe",
      concept,
      variant,
    }),
  );
  gameSlides.push({
    id: `C-${String(concept.n).padStart(2, "0")}-PICK`,
    world: "BONUS ROUND",
    topic: `CHOOSE ${concept.name}`,
    kind: "select",
    concept,
  });
  gameSlides.push({
    id: `C-${String(concept.n).padStart(2, "0")}-ANSWER`,
    world: `WORLD 3-${concept.n + 2}`,
    topic: `${concept.name} · ANSWER`,
    kind: "answer",
    concept,
  });
});
concepts.slice(7).forEach((concept) => {
  gameSlides.push({
    id: `C-${String(concept.n).padStart(2, "0")}-INTRO`,
    world: `WORLD 3-${concept.n + 2}`,
    topic: `POWER-UP ${concept.n} OF 12`,
    kind: "concept",
    concept,
  });
  gameSlides.push({
    id: `C-${String(concept.n).padStart(2, "0")}-EXAMPLE`,
    world: `WORLD 3-${concept.n + 2}`,
    topic: `${concept.name} · EXAMPLE`,
    kind: "example",
    concept,
  });
});

const closingSlides: Slide[] = [
  { id: "END-01", world: "FINAL BOSS", topic: "RECAP", kind: "recap" },
  { id: "END-02", world: "FINAL BOSS", topic: "RESOURCES", kind: "resources" },
  { id: "END-03", world: "FINAL BOSS", topic: "KEEP GOING", kind: "habits" },
  { id: "END-04", world: "GAME OVER", topic: "CONTINUE?", kind: "thanks" },
];

const slides = [...baseSlides, ...gameSlides, ...closingSlides];

function Hud({ slide, index }: { slide: Slide; index: number }) {
  return (
    <header className="hud">
      <span>{slide.world}</span>
      <strong>{slide.topic}</strong>
      <span>
        SLIDE {String(index + 1).padStart(2, "0")}/{slides.length}
      </span>
    </header>
  );
}

function Card({
  children,
  className = "",
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark" | "yellow";
}) {
  return <div className={`card ${tone} ${className}`}>{children}</div>;
}

function PixelButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="pixel-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}

function QuestionBlock({ small = false }: { small?: boolean }) {
  return <div className={`question ${small ? "small" : ""}`}>?</div>;
}

function Coin({ n }: { n?: number }) {
  return <span className="coin">{n}</span>;
}

function LevelClear() {
  return (
    <div className="level-clear">
      <span className="flag">⚑</span>
      LEVEL CLEAR!
    </div>
  );
}

function WorldCard({
  world,
  subtitle,
  items,
  complete = false,
}: {
  world: string;
  subtitle: string;
  items: string[];
  complete?: boolean;
}) {
  return (
    <div className="world-card">
      <h1 className="pixel-title giant">{world}</h1>
      <h2>{subtitle}</h2>
      <Card className="checklist">
        {items.map((item) => (
          <div key={item}>
            <span className={complete ? "checked box" : "box"}>{complete ? "✓" : ""}</span>
            {item}
          </div>
        ))}
      </Card>
    </div>
  );
}

function MiniDesign({
  concept,
  variant = "A",
  answer = false,
}: {
  concept: Concept;
  variant?: string;
  answer?: boolean;
}) {
  const wrong = variant !== concept.correct && concept.correct;
  return (
    <div className={`mini-design ${concept.kind} v-${variant} ${wrong ? "wrong" : ""}`}>
      {concept.kind === "poster" && (
        <div className="poster-inner">
          <small>BYTECRAFT PRESENTS</small>
          <h3>DESIGN NIGHT</h3>
          <h4>Workshop for beginners</h4>
          <div className="rule" />
          <p>Friday 6 Nov · 9:00</p>
          <p>ByteCraft Hub · Room 2</p>
          <b>Free entry</b>
          <button>REGISTER</button>
        </div>
      )}
      {concept.kind === "logo" && (
        <div className="logo-lockup">
          <div className="bean">
            <i />
          </div>
          <div>
            <h3>{variant === "C" ? "NOV" : "NOVA"}</h3>
            <p>{variant === "C" ? "ROASTER" : "COFFEE ROASTERS"}</p>
          </div>
          {variant === "C" && (
            <>
              <b className="stray a">A</b>
              <b className="stray s">S</b>
            </>
          )}
        </div>
      )}
      {concept.kind === "menu" && (
        <div className="menu-inner">
          <h3>BISTRO LUNA</h3>
          <MenuSection title="STARTERS" rows={["Harira soup · $6", "Mechouia salad · $7"]} />
          <MenuSection title="MAINS" rows={["Lamb couscous · $18", "Grilled sea bream · $21"]} />
          <MenuSection title="DESSERTS" rows={["Date cake · $6", "Mint tea · $3"]} />
        </div>
      )}
      {concept.kind === "cv" && (
        <div className="cv-inner">
          {answer && <span className="alignment-guide" />}
          <h3>Amina Haddad</h3>
          <h4>Graphic Designer</h4>
          <section>
            <b>PROFILE</b>
            <p>Creative designer with 3 years of experience in branding.</p>
          </section>
          <section>
            <b>EXPERIENCE</b>
            <p>
              Studio Nova · 2023–2025
              <br />
              Social media and print work
            </p>
          </section>
          <section>
            <b>EDUCATION</b>
            <p>BA Visual Communication · City University · 2022</p>
          </section>
        </div>
      )}
      {concept.kind === "event" && (
        <div className="event-inner">
          {answer && (
            <>
              <i className="group-outline g1" />
              <i className="group-outline g2" />
              <i className="group-outline g3" />
            </>
          )}
          <div className="event-title">
            <small>WORKSHOP</small>
            <h3>Intro to Figma</h3>
            <p>Build your first interface in one session</p>
          </div>
          <div className="event-info">
            <b>Friday 6 November · 9:00</b>
            <span>ByteCraft Hub · Room 2</span>
          </div>
          <button>Join us</button>
        </div>
      )}
      {concept.kind === "grid" && (
        <div className="moka">
          {["MOKA", "01", "ROAST", "02", "SLOW", "COFFEE"].map((x, i) => (
            <div key={i} className={`tile t${i}`}>
              {x}
            </div>
          ))}
        </div>
      )}
      {concept.kind === "product" && (
        <div className="product-inner">
          <div className="cup">M</div>
          <div>
            <small>MOKA COFFEE</small>
            <h3>Slow mornings</h3>
            <p>Small-batch coffee, roasted fresh every week.</p>
            {["A", "B", "E"].includes(variant) && (
              <p className="extra">
                Delivered to your door. Free shipping over $30. Subscribe and save 10%.
              </p>
            )}
            {variant === "B" && (
              <p className="extra">Cancel anytime. Fair trade beans. Organic and local.</p>
            )}
            <button>Shop now</button>
          </div>
        </div>
      )}
      {concept.kind === "juice" && (
        <div className="juice-inner">
          <div>
            <small>COLD-PRESSED DAILY</small>
            <h3>
              FRESH
              <br />
              JUICE
            </h3>
            <p>100% fruit</p>
            <button>Order now</button>
          </div>
          <div className="bottle">JUICE</div>
          <b className="price">
            $4
            <br />
            only
          </b>
        </div>
      )}
      {concept.kind === "rhythm" && (
        <div className="rhythm-inner">
          <small>OPEN-AIR FESTIVAL · 21 JULY</small>
          <h3>
            SUMMER
            <br />
            BEATS
          </h3>
          <div className="bars">
            {[3, 5, 4, 7, 5, 9, 6, 11, 8, 13].map((h, i) => (
              <i key={i} style={{ height: `${h * 8}px` }} />
            ))}
          </div>
        </div>
      )}
      {concept.kind === "simple" && (
        <div className="simple-inner">
          <i />
          <small>COMMUNITY STAGE</small>
          <h3>
            Open mic
            <br />
            night
          </h3>
          <p>Thursday · 7 pm</p>
        </div>
      )}
      {concept.kind === "unity" && (
        <div className="unity-inner">
          <h3>Rosa Bakery</h3>
          <div className="stationery letter">
            ROSA
            <br />
            <small>Fresh every morning</small>
          </div>
          <div className="stationery business">
            Rosa
            <br />
            <small>Bakery · Cakes</small>
          </div>
          <div className="stationery tag-shape">R</div>
          <div className="stationery social">
            Fresh every
            <br />
            morning
          </div>
        </div>
      )}
      {concept.kind === "movement" && (
        <div className="movement-inner">
          <small>LOGO</small>
          <i className="arrow a1">➜</i>
          <h3>
            SUMMER
            <br />
            SALE
          </h3>
          <i className="arrow a2">➜</i>
          <p>Up to 50% off · this weekend</p>
          <button>Shop now</button>
        </div>
      )}
    </div>
  );
}

function MenuSection({ title, rows }: { title: string; rows: string[] }) {
  return (
    <section>
      <b>{title}</b>
      {rows.map((r) => (
        <p key={r}>{r}</p>
      ))}
    </section>
  );
}

function Cover({ go }: { go: () => void }) {
  return (
    <div className="cover-grid">
      <div>
        <Tag>BYTECRAFT PRESENTS</Tag>
        <h1 className="pixel-title cover-title">SKILLFEST 2</h1>
        <h2>Graphic Design Workshop</h2>
        <Card className="cover-card">
          <b>From design theory to your first freelance client</b>
          <p>Friday 6 & Saturday 7 November · Organised by ByteCraft</p>
        </Card>
        <PixelButton onClick={go}>PRESS START</PixelButton>
      </div>
      <div className="cover-deco">
        <div className="coin-row">
          <Coin />
          <Coin />
          <Coin />
        </div>
        <QuestionBlock />
      </div>
    </div>
  );
}

const tableRows = [
  [
    "Graphic design",
    "Communicating ideas visually with type, colour, images, layout",
    "Posters, social posts, logos, CVs",
  ],
  [
    "UI design",
    "How a digital product looks: buttons, forms, screens",
    "App and website interfaces",
  ],
  [
    "UX design",
    "How a product works and feels: research, flows, usability",
    "Journeys, wireframes, prototypes",
  ],
  [
    "Motion design",
    "Bringing graphics to life through animation",
    "Animated logos, reels, explainers",
  ],
  ["Product / Industrial", "Shaping physical objects", "Furniture, packaging, devices"],
];

function SlideContent({
  slide,
  go,
  index,
}: {
  slide: Slide;
  go: (i: number) => void;
  index: number;
}) {
  const c = slide.concept;
  switch (slide.kind) {
    case "cover":
      return <Cover go={() => go(index + 1)} />;
    case "players":
      return (
        <>
          <h1 className="pixel-title">PLAYER SELECT</h1>
          <p className="subtitle">Today's party: Day 1 · Day 2</p>
          <div className="two-col">
            {["Sonia", "Imene"].map((name, i) => (
              <Card className="player" key={name}>
                <Tag>Speaker {i + 1}</Tag>
                <div className="avatar">{name[0]}</div>
                <h2>{name}</h2>
                <p>Graphic designer · Creative guide</p>
                <PixelButton>SELECT</PixelButton>
              </Card>
            ))}
          </div>
        </>
      );
    case "bingo":
      return (
        <>
          <div className="title-row">
            <div>
              <Tag>10 MINUTES</Tag>
              <h1 className="pixel-title">WARP ZONE BINGO</h1>
            </div>
          </div>
          <div className="bingo-layout">
            <Card>
              <h2>Break the ice</h2>
              <ol>
                <li>Stand up and walk around.</li>
                <li>Find a different person for each square. They sign their name.</li>
                <li>First complete row shouts “1-UP!”.</li>
              </ol>
              <b>Speakers play too!</b>
            </Card>
            <div className="bingo-grid">
              {[
                "Has designed a poster",
                "Uses Figma",
                "Has a favourite font",
                "Has had a paying client",
                "Knows a HEX colour",
                "Has a Behance account",
                "Draws by hand",
                "Loves Canva",
                "Never designed before",
              ].map((x) => (
                <div className="bingo-cell" key={x}>
                  <QuestionBlock small />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case "winner":
      return (
        <div className="center-screen">
          <div className="coin-burst">
            {[1, 2, 3, 4, 5].map((n) => (
              <Coin key={n} />
            ))}
          </div>
          <h1 className="pixel-title giant">1-UP!</h1>
          <Card className="prize">
            <Tag>PRIZE UNLOCKED</Tag>
            <div className="prize-box">PRIZE PLACEHOLDER</div>
          </Card>
          <PixelButton onClick={() => go(index + 1)}>CONTINUE?</PixelButton>
        </div>
      );
    case "world1":
      return (
        <WorldCard
          world="WORLD 1"
          subtitle="Part A · The Basics"
          items={[
            "What is design?",
            "Graphic design",
            "Freelancer roadmap",
            "Design process",
            "Fields of design",
            "Pixels & resolution",
          ]}
        />
      );
    case "designTypes":
      return (
        <>
          <h1 className="pixel-title">WHAT IS DESIGN?</h1>
          <Card className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>What it is</th>
                  <th>Typical output</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((x) => (
                      <td key={x}>{x}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="yellow-bar">
              UX decides what to build, UI decides how it looks, graphic design provides the visual
              language both rely on.
            </div>
          </Card>
        </>
      );
    case "definition":
      return (
        <>
          <Tag>POWER-UP: CLARITY</Tag>
          <h1 className="pixel-title">GRAPHIC DESIGN</h1>
          <Card className="quote">
            “Combining text, image and shape to deliver a clear message.”
            <div className="shape-icons">
              <b>T</b>
              <span className="picture">▧</span>
              <span className="triangle" />
            </div>
          </Card>
          <div className="three-col">
            {["Not decoration", "Making information understandable", "Making it memorable"].map(
              (x) => (
                <Card key={x}>
                  <h3>{x}</h3>
                </Card>
              ),
            )}
          </div>
        </>
      );
    case "roadmap":
      return (
        <>
          <h1 className="pixel-title">DESIGNER → FREELANCER</h1>
          <div className="level-map">
            {[
              ["1-1", "BASICS", "Practise concepts + Figma daily; recreate work you admire"],
              ["1-2", "NICHE", "Social, branding, print, CVs, presentations"],
              ["1-3", "PORTFOLIO", "3–5 strong projects; show process"],
              ["1-4", "PRESENCE", "Behance, LinkedIn, Instagram"],
              ["1-5", "CLIENTS", "Friends, associations, local business"],
              ["1-6", "PRICE", "Fixed price, brief, revisions, deposit"],
              ["1-7", "GROW", "Testimonials, raise rates, specialise"],
            ].map((r, i) => (
              <Card key={r[0]} className={`map-stop s${i}`}>
                <Tag>{r[0]}</Tag>
                <b>{r[1]}</b>
                <p>{r[2]}</p>
              </Card>
            ))}
            <div className="path-line" />
            <div className="goal-flag">⚑</div>
          </div>
        </>
      );
    case "process":
      return (
        <>
          <h1 className="pixel-title">THE DESIGN PROCESS</h1>
          <div className="process-stairs">
            {[
              ["BRIEF", "client, goal, audience, deadline"],
              ["RESEARCH", "competitors, references, moodboard"],
              ["IDEATION", "many ideas, no judgement"],
              ["DRAFT", "quick paper or digital sketches"],
              ["DEVELOP", "colours, type, layout"],
              ["DESIGN", "build final artwork"],
              ["DELIVER", "feedback, export, handoff"],
            ].map((r, i) => (
              <div key={r[0]} style={{ transform: `translateY(${-i * 20}px)` }}>
                <Coin n={i + 1} />
                <b>{r[0]}</b>
                <span>{r[1]}</span>
              </div>
            ))}
          </div>
          <Card tone="yellow" className="note">
            Skipping steps 1 to 5 is the #1 beginner mistake.
          </Card>
        </>
      );
    case "fields":
      return (
        <>
          <h1 className="pixel-title">FIELDS OF GRAPHIC DESIGN</h1>
          <div className="field-grid">
            {fields.map((f, i) => (
              <Card key={f[0]} className="field">
                <QuestionBlock small />
                <span className="field-icon">
                  {["●", "▣", "↔", "◆", "▶", "▤", "⬡", "✦", "▲"][i]}
                </span>
                <div>
                  <b>{f[0]}</b>
                  <p>{f[1]}</p>
                </div>
              </Card>
            ))}
          </div>
        </>
      );
    case "pixels":
      return (
        <>
          <h1 className="pixel-title">PIXELS & RESOLUTION</h1>
          <div className="two-col pixel-layout">
            <Card>
              <h2>PIXEL</h2>
              <p>The smallest square of a digital image.</p>
              <div className="pixel-heart">
                {[
                  "00100100",
                  "01111110",
                  "11111111",
                  "11111111",
                  "01111110",
                  "00111100",
                  "00011000",
                ].map((r, y) =>
                  [...r].map((v, x) => <i key={`${x}${y}`} className={v === "1" ? "on" : ""} />),
                )}
              </div>
            </Card>
            <Card>
              <table>
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Meaning</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PPI</td>
                    <td>pixels per inch</td>
                    <td>Screen · 72–150</td>
                  </tr>
                  <tr>
                    <td>DPI</td>
                    <td>dots per inch</td>
                    <td>Print · 300</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
          <div className="chips">
            <span>Web / social: 72 ppi</span>
            <span>Print: 300 dpi</span>
            <span>Raster = pixels, vector = shapes</span>
          </div>
        </>
      );
    case "complete1":
      return (
        <CompleteWorld
          world="1"
          items={[
            "What is design?",
            "Graphic design",
            "Roadmap",
            "Process",
            "Fields",
            "Resolution",
          ]}
          go={() => go(index + 1)}
        />
      );
    case "world2":
      return (
        <WorldCard
          world="WORLD 2"
          subtitle="Part B · Colour & Type"
          items={["Colour theory", "Colour modes", "Typography", "Type categories", "Fonts"]}
        />
      );
    case "colour":
      return (
        <>
          <h1 className="pixel-title">COLOUR THEORY</h1>
          <div className="colour-layout">
            <div className="colour-wheel">
              {Array.from({ length: 12 }).map((_, i) => (
                <i
                  key={i}
                  style={{
                    background: `hsl(${i * 30} 82% 54%)`,
                    transform: `rotate(${i * 30}deg) skewY(-60deg)`,
                  }}
                />
              ))}
            </div>
            <div className="mini-card-grid">
              {[
                ["PRIMARY → TERTIARY", "Colours mix into wider families"],
                ["WARM VS COOL", "Energy versus calm"],
                ["HARMONIES", "Complementary · analogous · triadic · monochromatic"],
                ["MEANING", "Red energy · blue trust · green nature · yellow optimism"],
              ].map((x) => (
                <Card key={x[0]}>
                  <b>{x[0]}</b>
                  <p>{x[1]}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="chips">
            <span>60–30–10: dominant · secondary · accent</span>
          </div>
        </>
      );
    case "modes":
      return (
        <>
          <h1 className="pixel-title">COLOUR MODES</h1>
          <div className="four-col">
            {[
              ["RGB", "Red, Green, Blue", "Light on screens", "Web, social, apps"],
              ["CMYK", "Cyan, Magenta, Yellow, Key", "Ink on paper", "Print"],
              ["GRAYSCALE", "256 shades of grey", "No colour", "B&W print, photos"],
              ["BITMAP", "Pure black and white", "1 bit", "Line art, 1-colour logos"],
            ].map((x, i) => (
              <Card key={x[0]}>
                <div className={`mode-swatch m${i}`} />
                <h2>{x[0]}</h2>
                <b>{x[1]}</b>
                <p>{x[2]}</p>
                <small>USE: {x[3]}</small>
              </Card>
            ))}
          </div>
          <div className="yellow-bar standalone">
            Screen = RGB · Print = CMYK. Always pick the mode before you start.
          </div>
        </>
      );
    case "typography":
      return (
        <>
          <h1 className="pixel-title">TYPOGRAPHY</h1>
          <p className="subtitle">The art of arranging type</p>
          <div className="type-anatomy">
            <Card className="aa-card">
              <div className="big-aa">Aa</div>
              {["ascender", "x-height", "baseline", "descender", "serif"].map((x, i) => (
                <span key={x} className={`callout c${i}`}>
                  {x}
                </span>
              ))}
            </Card>
            <div className="type-chips">
              <Card>
                <h2>SIZE</h2>
                <p>Creates hierarchy</p>
              </Card>
              <Card>
                <h2>WEIGHT</h2>
                <p>Regular to bold</p>
              </Card>
              <Card>
                <h2>SPACING</h2>
                <p>Leading · tracking</p>
              </Card>
            </div>
          </div>
        </>
      );
    case "typeCats":
      return (
        <>
          <h1 className="pixel-title">TYPE CATEGORIES</h1>
          <div className="four-col type-cats">
            {[
              ["SERIF", "Playfair Display", "Classic, trustworthy", "Editorial · luxury"],
              ["SANS SERIF", "Inter", "Clean, modern", "Apps · tech"],
              ["SCRIPT", "Pacifico", "Elegant, handwritten", "Invitations · beauty"],
              ["DISPLAY", "Bungee", "Bold, decorative", "Posters · logos"],
            ].map((x, i) => (
              <Card key={x[0]}>
                <Tag>{x[0]}</Tag>
                <div className={`font-sample f${i}`}>{x[0]}</div>
                <p>{x[2]}</p>
                <small>{x[3]}</small>
              </Card>
            ))}
          </div>
        </>
      );
    case "fonts":
      return (
        <>
          <h1 className="pixel-title">FONTS</h1>
          <div className="three-col font-rules">
            <Card>
              <Tag>01</Tag>
              <h2>Family vs font</h2>
              <p>One family has several weights and styles.</p>
              <div className="weight-list">
                <span>Light</span>
                <span>Regular</span>
                <b>Bold</b>
                <i>Italic</i>
              </div>
            </Card>
            <Card>
              <Tag>02</Tag>
              <h2>3 pairing rules</h2>
              <ul>
                <li>Maximum 2 fonts</li>
                <li>Pair a serif with a sans</li>
                <li>Contrast weight and size</li>
              </ul>
            </Card>
            <Card>
              <Tag>03</Tag>
              <h2>Find fonts</h2>
              <p>
                Google Fonts
                <br />
                Fontshare
                <br />
                Font Squirrel
              </p>
              <b className="licence">CHECK THE LICENCE!</b>
            </Card>
          </div>
        </>
      );
    case "complete2":
      return (
        <CompleteWorld
          world="2"
          items={["Colour theory", "Colour modes", "Typography", "Type categories", "Fonts"]}
          go={() => go(index + 1)}
        />
      );
    case "world3":
      return (
        <WorldCard
          world="WORLD 3"
          subtitle="Part C · Concepts"
          items={["Texture vs pattern", "12 core concepts", "7 bonus rounds", "5 examples"]}
        />
      );
    case "texture":
      return (
        <>
          <h1 className="pixel-title">
            TEXTURE <span>VS</span> PATTERN
          </h1>
          <div className="two-col texture-cards">
            <Card>
              <Tag>TEXTURE</Tag>
              <div className="texture-sample" />
              <p>
                How a surface looks or feels: rough, grainy, paper, fabric. It is not repeated on
                purpose.
              </p>
            </Card>
            <Card>
              <Tag>PATTERN</Tag>
              <div className="pattern-sample" />
              <p>A motif repeated in a regular order: dots, stripes, tiles.</p>
            </Card>
          </div>
          <div className="yellow-bar standalone">Texture = feeling. Pattern = repetition.</div>
        </>
      );
    case "overview":
      return (
        <>
          <h1 className="pixel-title">THE 12 CORE CONCEPTS</h1>
          <div className="concept-grid">
            {conceptOverview.map((x, i) => (
              <Card key={x[0]}>
                <QuestionBlock small />
                <b>
                  <span>{i + 1}</span> {x[0]}
                </b>
                <p>{x[1]}</p>
              </Card>
            ))}
          </div>
        </>
      );
    case "concept":
      return (
        c && (
          <>
            <Tag>CONCEPT {c.n} OF 12</Tag>
            <h1 className="pixel-title giant concept-title">{c.name}</h1>
            <Card className="concept-definition">
              <p>{c.definition}</p>
            </Card>
            <Card tone="yellow" className="key-idea">
              <b>KEY IDEA:</b> {c.key}
            </Card>
            <div className="concept-footer">
              <span>Next: observation game, spot the design that respects {c.name}.</span>
              <PixelButton onClick={() => go(index + 1)}>START BONUS ROUND</PixelButton>
            </div>
          </>
        )
      );
    case "observe":
      return (
        c && (
          <>
            <div className="observe-top">
              <Tag>BONUS ROUND · DESIGN {slide.variant}</Tag>
              <div className="timer">
                <Coin /> TIME 030
              </div>
            </div>
            <div className="observe-layout">
              <Card>
                <h2>Take 30 seconds.</h2>
                <p>
                  Does this design respect <b>{c.name}</b>?
                </p>
                <p>Look carefully. Note your answer.</p>
                <div className="tip">
                  A–E use exactly the same content. Only the design changes.
                </div>
                <PixelButton onClick={() => go(index + 1)}>NEXT</PixelButton>
              </Card>
              <div className="screen">
                <span className="variant-label">{slide.variant}</span>
                <MiniDesign concept={c} variant={slide.variant} />
              </div>
            </div>
          </>
        )
      );
    case "select":
      return (
        c && (
          <>
            <Tag>BONUS ROUND</Tag>
            <h1 className="pixel-title selection-title">WHICH ONE RESPECTS {c.name}?</h1>
            <div className="selection-row">
              {["A", "B", "C", "D", "E"].map((v) => (
                <button key={v} className="selection-card" onClick={() => go(index + 1)}>
                  <div className="thumb">
                    <MiniDesign concept={c} variant={v} />
                  </div>
                  <b>{v}</b>
                </button>
              ))}
            </div>
            <p className="selection-help">Choose a design to reveal the answer.</p>
          </>
        )
      );
    case "answer":
      return (
        c && (
          <>
            <LevelClear />
            <div className="answer-layout">
              <div className="screen answer-screen">
                <div className="coin-burst small">
                  {[1, 2, 3].map((n) => (
                    <Coin key={n} />
                  ))}
                </div>
                <MiniDesign concept={c} variant={c.correct} answer />
              </div>
              <Card>
                <Tag>CORRECT ANSWER</Tag>
                <h1>Design {c.correct}</h1>
                <p>{c.answer}</p>
                <PixelButton onClick={() => go(index + 1)}>NEXT POWER-UP</PixelButton>
              </Card>
            </div>
          </>
        )
      );
    case "example":
      return (
        c && (
          <>
            <Tag>EXAMPLE · {c.name} IN ACTION</Tag>
            <h1 className="pixel-title">{c.name}</h1>
            <div className="example-layout">
              <Card>
                <h2>WHY IT WORKS</h2>
                <p>{c.answer}</p>
                <div className="key-line">
                  <b>KEY IDEA</b>
                  <span>{c.key}</span>
                </div>
              </Card>
              <div className="screen">
                <MiniDesign concept={c} />
              </div>
            </div>
          </>
        )
      );
    case "recap":
      return (
        <>
          <Tag>FINAL BOSS</Tag>
          <h1 className="pixel-title">WHICH CONCEPTS DID YOU USE?</h1>
          <div className="coin-concepts">
            {concepts.map((c) => (
              <div key={c.n}>
                <Coin n={c.n} />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
          <Card tone="yellow" className="final-question">
            Which concept do you find the hardest?
          </Card>
        </>
      );
    case "resources":
      return (
        <>
          <h1 className="pixel-title">RESOURCE CHEST</h1>
          <Card className="resources">
            <div>
              <b>DESIGN TOOLS</b>
              <p>Figma (free, ideal to start) · Illustrator · Photoshop · Canva · Affinity</p>
              <b>COLOUR</b>
              <p>Coolors · Adobe Color · Color Hunt</p>
              <b>FONTS</b>
              <p>Google Fonts · Fontshare · Font Squirrel</p>
              <b>INSPIRATION</b>
              <p>Behance · Dribbble · Pinterest · Awwwards</p>
            </div>
            <div>
              <b>ASSETS</b>
              <p>
                Unsplash · Pexels · Freepik · Flaticon <i>(check licences)</i>
              </p>
              <b>CLIENTS & ADMIN</b>
              <p>Upwork · Fiverr · Contra · LinkedIn · Notion · Trello</p>
              <b>BOOKS</b>
              <p>
                The Non-Designer's Design Book — R. Williams
                <br />
                Thinking with Type — E. Lupton
              </p>
            </div>
          </Card>
        </>
      );
    case "habits":
      return (
        <>
          <h1 className="pixel-title">KEEP GOING</h1>
          <p className="subtitle">Four habits beat one burst of motivation.</p>
          <div className="habit-grid">
            {[
              ["01", "Design a little every day, even 30 minutes"],
              ["02", "Recreate before you create"],
              ["03", "Ask for feedback early and often"],
              ["04", "Save everything you finish: your portfolio is small wins"],
            ].map((x) => (
              <Card key={x[0]}>
                <Coin n={Number(x[0])} />
                <h2>{x[1]}</h2>
              </Card>
            ))}
          </div>
        </>
      );
    case "thanks":
      return (
        <div className="center-screen thanks">
          <Tag>GAME OVER... CONTINUE?</Tag>
          <h1 className="pixel-title giant">THANK YOU!</h1>
          <p>Good luck, designers! Your next checkpoint is your first client.</p>
          <div className="one-up">
            <i />
            <b>1-UP</b>
          </div>
          <div className="button-row">
            <PixelButton onClick={() => go(0)}>YES</PixelButton>
            <PixelButton onClick={() => go(0)}>NO</PixelButton>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function CompleteWorld({ world, items, go }: { world: string; items: string[]; go: () => void }) {
  return (
    <div className="complete">
      <LevelClear />
      <WorldCard world={`WORLD ${world}`} subtitle="All topics collected" items={items} complete />
      <PixelButton onClick={go}>NEXT WORLD ▶</PixelButton>
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const go = (next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) go(index + 1);
      if (["ArrowLeft", "PageUp"].includes(e.key)) go(index - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(slides.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  useEffect(() => {
    if (slide.kind !== "observe") return;
    const timer = window.setTimeout(() => go(index + 1), 30_000);
    return () => window.clearTimeout(timer);
  }, [index, slide.kind]);

  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);

  return (
    <main className="stage">
      <section className="deck" aria-label="SkillFest 2 Graphic Design Workshop">
        <img
          className="background"
          src="/assets/skillfest-background.png"
          alt=""
          draggable={false}
        />
        {index > 0 && <Hud slide={slide} index={index} />}
        <div className={`slide-content kind-${slide.kind}`} key={slide.id}>
          <SlideContent slide={slide} go={go} index={index} />
        </div>
        <nav className="nav" aria-label="Slide navigation">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
            ◀
          </button>
          <span>{slide.id}</span>
          <div className="progress">
            <i style={{ width: `${progress}%` }} />
          </div>
          <button
            onClick={() => go(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Next slide"
          >
            ▶
          </button>
        </nav>
      </section>
    </main>
  );
}
