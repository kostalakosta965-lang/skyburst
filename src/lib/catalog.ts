export type CategoryId =
  | "batteries"
  | "rockets"
  | "fountains"
  | "candles"
  | "sparklers"
  | "crackers";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  shots?: number;
  duration?: number;
  caliber?: string;
  effects: string[];
  image: string;
  badge?: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "batteries",
    name: "Батареи салютов",
    tagline: "Всё шоу — в одной коробке",
    image: "/images/cat-battery.jpg",
  },
  {
    id: "rockets",
    name: "Ракеты",
    tagline: "Высоко. Ярко. Громко.",
    image: "/images/cat-rockets.jpg",
  },
  {
    id: "fountains",
    name: "Фонтаны",
    tagline: "Столбы искр на земле",
    image: "/images/cat-fountain.jpg",
  },
  {
    id: "candles",
    name: "Римские свечи",
    tagline: "Классика жанра",
    image: "/images/cat-candle.jpg",
  },
  {
    id: "sparklers",
    name: "Бенгальские огни",
    tagline: "Тепло в ладонях",
    image: "/images/cat-sparkler.jpg",
  },
  {
    id: "crackers",
    name: "Петарды",
    tagline: "Хлопок, эхо, адреналин",
    image: "/images/cat-crackers.jpg",
  },
];

export const products: Product[] = [
  {
    id: "phoenix49",
    name: "ФЕНИКС-49",
    category: "batteries",
    price: 3490,
    oldPrice: 3990,
    shots: 49,
    duration: 45,
    caliber: '1.25"',
    effects: ["золотой пион", "итлы", "громкие хлопки"],
    image: "/images/cat-battery.jpg",
    badge: "Хит продаж",
    description:
      "Легенда нашего каталога: 49 зарядов возрождаются из золотой золы один за другим. Чередование пионов, треска и свистящих комет — готовый сценарий праздника на 45 секунд.",
  },
  {
    id: "czar",
    name: "ЦАРЬ-САЛЮТ",
    category: "batteries",
    price: 12900,
    shots: 100,
    duration: 90,
    caliber: '2"',
    effects: ["брокады", "пальмы", "треск-облака"],
    image: "/images/cat-battery.jpg",
    badge: "Финальный аккорд",
    description:
      "Сто зарядов двойного калибра: брокадовые короны, хризантемы и трещащие облака. Это не салют — это церемония. Один поджиг, полторы минуты тишины после оваций.",
  },
  {
    id: "neonrain",
    name: "НЕОНОВЫЙ ДОЖДЬ",
    category: "batteries",
    price: 2190,
    shots: 36,
    duration: 30,
    caliber: '1"',
    effects: ["ивовые нити", "крэкл", "шлейфы"],
    image: "/images/cat-battery.jpg",
    description:
      "Плотный веер падающих ивовых нитей с серебряным крэклом. Идеален как середина программы — выдерживает и площадку во дворе, и загородную поляну.",
  },
  {
    id: "goldrush",
    name: "ЗОЛОТАЯ ЛИХОРАДКА",
    category: "batteries",
    price: 1590,
    shots: 25,
    duration: 24,
    caliber: "30 мм",
    effects: ["кометы", "золотой дождь"],
    image: "/images/cat-battery.jpg",
    description:
      "Двадцать пять стремительных золотых комет с шлейфами и финальным веером. Компактный формат для камерного салюта на семейном празднике.",
  },
  {
    id: "sunstorm",
    name: "СОЛНЕЧНЫЙ ШТОРМ",
    category: "batteries",
    price: 8490,
    shots: 144,
    duration: 49,
    caliber: "25 мм",
    effects: ["веерный огонь", "кокосы", "стробоскопы"],
    image: "/images/cat-battery.jpg",
    badge: "Веерный",
    description:
      "144 заряда стреляют веером до 15 метров вширь: стробоскопические вспышки, кокосовые пальмы, залпы знатью. Ощущается как установка профессиональной площадки.",
  },
  {
    id: "apollo",
    name: "АПОЛЛО ×8",
    category: "rockets",
    price: 1290,
    shots: 8,
    caliber: "32 мм",
    effects: ["пион", "золотой шлейф"],
    image: "/images/cat-rockets.jpg",
    badge: "Комплект",
    description:
      "Восемь ровных взлётов с густым золотым шлейфом и хлопком пиона на апогее. Каждая ракета — маленький запуск, который видно из любой точки двора.",
  },
  {
    id: "orbita",
    name: "ОРБИТА ×12",
    category: "rockets",
    price: 990,
    shots: 12,
    caliber: "26 мм",
    effects: ["треск", "свист"],
    image: "/images/cat-rockets.jpg",
    description:
      "Дюжина быстрых выстрелов со свистом и треском. Бюджетное пополнение вечера: запускайте по одной — или все сразу в честь кульминации.",
  },
  {
    id: "perseus",
    name: "ПЕРСЕЙ ГИГАНТ",
    category: "rockets",
    price: 890,
    shots: 1,
    caliber: '3"',
    effects: ["хризантема 40 м", "эхо"],
    image: "/images/cat-rockets.jpg",
    badge: "Громко",
    description:
      "Одна ракета калибра три дюйма — один выстрел, одна огромная хризантема диаметром до сорока метров и долгое эхо над полем. Разовый эффект «вау».",
  },
  {
    id: "vulkan3000",
    name: "ВУЛКАН-3000",
    category: "fountains",
    price: 690,
    duration: 90,
    effects: ["столб 3 м", "трещащие капли"],
    image: "/images/cat-fountain.jpg",
    description:
      "Классический гейзер высотой до трёх метров: серебряное давление, золотые трещащие капли, полторы минуты ровной работы. Ставится прямо на грунт.",
  },
  {
    id: "geyser",
    name: "СЕРЕБРЯНЫЙ ГЕЙЗЕР",
    category: "fountains",
    price: 890,
    duration: 120,
    effects: ["2 метра", "хлопья снега"],
    image: "/images/cat-fountain.jpg",
    description:
      "Две минуты холодного серебра: ровный фонтан с эффектом падающих снежных хлопьев. Эффектен зимой, романтичен в любой сезон.",
  },
  {
    id: "hearth",
    name: "ТЕПЛЫЙ КАМИН",
    category: "fountains",
    price: 350,
    duration: 40,
    effects: ["конус 1 м", "мягкое свечение"],
    image: "/images/cat-fountain.jpg",
    description:
      "Компактный конус для дачи и террасы: метр мягких искр без громких эффектов. Подойдёт тем, кто любит огонь без лишнего шума.",
  },
  {
    id: "cirkada",
    name: "ЦИРКАДА ×10",
    category: "candles",
    price: 290,
    shots: 10,
    caliber: "18 мм",
    effects: ["цветные звёзды", "свист"],
    image: "/images/cat-candle.jpg",
    description:
      "Десять цветных звёзд с поющим свистом. Держать вертикально, палка в комплекте. Хороша как разогрев перед батареей салютов.",
  },
  {
    id: "pulsar",
    name: "ПУЛЬСАР ×8",
    category: "candles",
    price: 240,
    shots: 8,
    caliber: "18 мм",
    effects: ["стробоскоп", "треск"],
    image: "/images/cat-candle.jpg",
    description:
      "Восемь мерцающих стробоскоп-вспышек с сухим треском. Свет пульсирует, как далёкая звезда — отсюда и имя.",
  },
  {
    id: "bengal",
    name: "БЕНГАЛ 40 СМ ×10",
    category: "sparklers",
    price: 390,
    duration: 60,
    effects: ["золотые искры", "без дыма"],
    image: "/images/cat-sparkler.jpg",
    badge: "Для фото",
    description:
      "Длинные сорокасантиметровые свечи горят аж минуту — успеете и фотосессию, и тост. Минимум дыма, максимум золотых искр.",
  },
  {
    id: "confetti",
    name: "ХЛОПУШКА КОНФЕТТИ ×6",
    category: "sparklers",
    price: 540,
    effects: ["метафан", "серпантин"],
    image: "/images/cat-sparkler.jpg",
    description:
      "Шесть хлопушек с метафаном и серпантином. Не пиротехника по закону, но настроение — стопроцентное. Безопасно даже в помещении.",
  },
  {
    id: "cor1",
    name: "КОРСАР-1 ×100",
    category: "crackers",
    price: 150,
    shots: 100,
    effects: ["громкий хлопок", "искра-шлейф"],
    image: "/images/cat-crackers.jpg",
    badge: "Хит двора",
    description:
      "Ста штук легенды: короткий сухой хлопок с серебряной искрой. Отрывайте по одной аккуратно — или устройте пальбу пачкой (на открытой площадке!).",
  },
  {
    id: "p2000",
    name: "П-2000 ГРОМ ×50",
    category: "crackers",
    price: 230,
    shots: 50,
    effects: ["двойной хлопок", "серебро"],
    image: "/images/cat-crackers.jpg",
    description:
      "Классические петарды покрупнее: каждая даёт двойной отчётливый хлопок с облачком серебра. Держать на вытянутой руке, не сжимать в кулаке!",
  },
  {
    id: "megajoker",
    name: "МЕГАДЖОКЕР-30 ×36",
    category: "crackers",
    price: 290,
    shots: 36,
    effects: ["очень громко", "эхо", "свист"],
    image: "/images/cat-crackers.jpg",
    badge: "Громче всех",
    description:
      "Тридцать шесть увесистых громов со свистом на взлёте и раскатистым эхом. Для тех, кого малый калибр уже не веселит. Не бросать в сторону людей и животных.",
  },
];

export const featuredIds = [
  "phoenix49",
  "czar",
  "apollo",
  "vulkan3000",
  "bengal",
  "megajoker",
];

const byId = new Map(products.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return byId.get(id);
}

export function productsByCategory(category: CategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

export function computeTotal(items: { id: string; qty: number }[]): number {
  return items.reduce((sum, item) => {
    const product = byId.get(item.id);
    if (!product) return sum;
    return sum + product.price * Math.max(0, Math.floor(item.qty));
  }, 0);
}
