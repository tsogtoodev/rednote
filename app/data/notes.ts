import type { Loc } from "../lib/i18n";

export type Comment = {
  id: string;
  author: Loc;
  avatarSeed: string;
  text: Loc;
  likes: number;
  timeAgo: Loc;
};

export type NoteImage = {
  seed: string;
  width: number;
  height: number;
};

export type Note = {
  id: string;
  title: Loc;
  description: Loc;
  category: string;
  cover: NoteImage;
  images: NoteImage[];
  author: {
    name: Loc;
    avatarSeed: string;
    followers: string;
  };
  likes: number;
  collects: number;
  commentsCount: number;
  postedAt: string;
  location?: Loc;
  tags: Loc[];
  comments: Comment[];
};

const COMMENT_POOL: Omit<Comment, "id">[] = [
  {
    author: { zh: "小酒窝", mn: "Бэлчир" },
    avatarSeed: "u1",
    text: {
      zh: "这套搭配也太好看了吧！求链接🥺",
      mn: "Энэ хувцаслалт үнэхээр гоё байна! Холбоосыг нь хуваалцана уу 🥺",
    },
    likes: 142,
    timeAgo: { zh: "2小时前", mn: "2 цагийн өмнө" },
  },
  {
    author: { zh: "甜筒不加糖", mn: "Чихэргүй айраг" },
    avatarSeed: "u2",
    text: {
      zh: "已收藏，周末就去试试～",
      mn: "Хадгалсан, амралтаараа очоод үзнэ ээ ~",
    },
    likes: 38,
    timeAgo: { zh: "3小时前", mn: "3 цагийн өмнө" },
  },
  {
    author: { zh: "Momo一号", mn: "Момо нэгдүгээр" },
    avatarSeed: "u3",
    text: {
      zh: "博主好温柔啊，看完心情都变好了 ☺️",
      mn: "Зохиогч маш дотно. Үзээд сэтгэл нь сайхан болсон ☺️",
    },
    likes: 67,
    timeAgo: { zh: "5小时前", mn: "5 цагийн өмнө" },
  },
  {
    author: { zh: "lemon🍋", mn: "Лемон 🍋" },
    avatarSeed: "u4",
    text: {
      zh: "请问拍照用的什么相机呀？",
      mn: "Ямар камераар авсан бэ?",
    },
    likes: 21,
    timeAgo: { zh: "6小时前", mn: "6 цагийн өмнө" },
  },
  {
    author: { zh: "麻薯丸子", mn: "Мочи бөмбөлөг" },
    avatarSeed: "u5",
    text: {
      zh: "学到了学到了，谢谢分享！",
      mn: "Маш их сурлаа, хуваалцсанд баярлалаа!",
    },
    likes: 89,
    timeAgo: { zh: "8小时前", mn: "8 цагийн өмнө" },
  },
  {
    author: { zh: "夏天的风", mn: "Зуны салхи" },
    avatarSeed: "u6",
    text: {
      zh: "看完已经下单了，期待到货 🛍️",
      mn: "Үзэнгүүтээ захиалчихлаа, хүлээж байна 🛍️",
    },
    likes: 12,
    timeAgo: { zh: "12小时前", mn: "12 цагийн өмнө" },
  },
  {
    author: { zh: "晚晚_", mn: "Үдэш_" },
    avatarSeed: "u7",
    text: {
      zh: "好喜欢这种风格，码住学习🌷",
      mn: "Энэ стилийг үнэхээр хайрлаж байна, хадгаллаа 🌷",
    },
    likes: 56,
    timeAgo: { zh: "1天前", mn: "1 өдрийн өмнө" },
  },
  {
    author: { zh: "陈皮老师", mn: "Чэньпи багш" },
    avatarSeed: "u8",
    text: {
      zh: "细节满满，姐妹太用心了",
      mn: "Бүх нарийн ширийн анхаарсан, маш хичээнгүй байна",
    },
    likes: 33,
    timeAgo: { zh: "1天前", mn: "1 өдрийн өмнө" },
  },
  {
    author: { zh: "noodle", mn: "Гоймон" },
    avatarSeed: "u9",
    text: {
      zh: "这个价位真的很可以了！",
      mn: "Энэ үнэндээ үнэ нь үнэхээр зохистой!",
    },
    likes: 19,
    timeAgo: { zh: "2天前", mn: "2 өдрийн өмнө" },
  },
  {
    author: { zh: "猫猫睡不醒", mn: "Унтаж сэрдэггүй муур" },
    avatarSeed: "u10",
    text: {
      zh: "蹲后续～有效果记得回来分享",
      mn: "Үргэлжлэлийг нь хүлээж байна ~ үр дүнгээ хуваалцаарай",
    },
    likes: 8,
    timeAgo: { zh: "2天前", mn: "2 өдрийн өмнө" },
  },
];

function makeComments(seed: number, count: number): Comment[] {
  const out: Comment[] = [];
  for (let i = 0; i < count; i++) {
    const c = COMMENT_POOL[(seed + i) % COMMENT_POOL.length];
    out.push({ ...c, id: `${seed}-${i}` });
  }
  return out;
}

const T = (zh: string, mn: string): Loc => ({ zh, mn });

const RAW: Omit<Note, "comments">[] = [
  {
    id: "n1",
    title: T(
      "秋冬通勤穿搭｜优雅又显高的8套look",
      "Намар-өвлийн ажлын хувцас｜Дэгжин & өндөр харагдах 8 ансамбль",
    ),
    description: T(
      "💄分享最近超喜欢的秋冬通勤穿搭，简约不简单！每一套都很显气质，姐妹们冲就完事啦～\n\n• 大地色系 yyds\n• 廓形大衣搭配直筒裤\n• 乐福鞋绝绝子\n\n#秋冬穿搭 #通勤穿搭 #气质",
      "💄Сүүлд их таалагдсан намар-өвлийн ажлын хувцасыг хуваалцлаа. Энгийн ч энгийн биш!\n\n• Шороон өнгөний өрнөл хосгүй\n• Том загварын пальто + шулуун өмд\n• Лоферс гутал шилдэг\n\n#Намар-өвлийн_хувцас #Ажлын_хувцас #Хийморь",
    ),
    category: "fashion",
    cover: { seed: "fashion-1", width: 600, height: 800 },
    images: [
      { seed: "fashion-1", width: 1200, height: 1600 },
      { seed: "fashion-1b", width: 1200, height: 1600 },
      { seed: "fashion-1c", width: 1200, height: 1600 },
    ],
    author: {
      name: T("Vivi的衣橱", "Vivi-ийн шүүгээ"),
      avatarSeed: "a1",
      followers: "12.3w",
    },
    likes: 8421,
    collects: 3210,
    commentsCount: 421,
    postedAt: "2026-04-26",
    location: T("上海", "Шанхай"),
    tags: [
      T("秋冬穿搭", "Намар-өвлийн хувцас"),
      T("通勤穿搭", "Ажлын хувцас"),
      T("气质", "Хийморь"),
    ],
  },
  {
    id: "n2",
    title: T(
      "在家做麻辣香锅！比店里还好吃🌶️",
      "Гэртээ халуун ширэг хоол｜Ресторанаас илүү амттай 🌶️",
    ),
    description: T(
      "麻辣香锅在家做超简单，今天分享我的私房配方～香辣过瘾，配米饭能吃两碗！\n\n配料表：\n· 牛油火锅底料 半块\n· 豆瓣酱 1勺\n· 花椒辣椒适量\n\n#家常菜 #麻辣香锅 #美食教程",
      "Гэртээ маш амархан хийж болдог! Миний жор:\n\n• Үхрийн өөхтэй хотпот суурь хагас блок\n• Доубан цуу 1 халбага\n• Сычуан чинжүү ба халуун ногоо хэмжээгээр\n\n#Гэрийн_хоол #Халуун_ширэг #Хоолны_заавар",
    ),
    category: "food",
    cover: { seed: "food-1", width: 600, height: 600 },
    images: [
      { seed: "food-1", width: 1200, height: 1200 },
      { seed: "food-1b", width: 1200, height: 1200 },
    ],
    author: {
      name: T("厨房里的小狐狸", "Гал тогооны жижиг үнэг"),
      avatarSeed: "a2",
      followers: "85.6w",
    },
    likes: 23410,
    collects: 18922,
    commentsCount: 1280,
    postedAt: "2026-04-27",
    location: T("成都", "Чэнду"),
    tags: [
      T("家常菜", "Гэрийн хоол"),
      T("麻辣香锅", "Халуун ширэг"),
      T("美食教程", "Хоолны заавар"),
    ],
  },
  {
    id: "n3",
    title: T(
      "京都樱花季｜小众机位拍照攻略",
      "Киотогийн сакура улирал｜Олдсон зургийн цэгийн заавар",
    ),
    description: T(
      "上周刚从京都回来，整理了一份樱花机位📸\n哲学之道、平野神社、岚山小火车，每一个都美到窒息！\n\n#京都旅行 #樱花季 #日本旅行",
      "Өнгөрсөн долоо хоногт Киотогоос буцаж ирээд сакура цэгүүдийг эмхэтгэлээ 📸\nФилософийн зам, Хирано сүм, Арашиямагийн жижиг галт тэрэг — бүгд амьсгал хүрэхгүй гоо үзэсгэлэнтэй!\n\n#Киото_аялал #Сакура #Япон_аялал",
    ),
    category: "travel",
    cover: { seed: "travel-1", width: 600, height: 900 },
    images: [
      { seed: "travel-1", width: 1200, height: 1800 },
      { seed: "travel-1b", width: 1200, height: 1800 },
      { seed: "travel-1c", width: 1200, height: 1800 },
      { seed: "travel-1d", width: 1200, height: 1800 },
    ],
    author: {
      name: T("环游的Anna", "Аяллын Anna"),
      avatarSeed: "a3",
      followers: "32.1w",
    },
    likes: 15234,
    collects: 9821,
    commentsCount: 612,
    postedAt: "2026-04-25",
    location: T("京都", "Киото"),
    tags: [
      T("京都旅行", "Киото аялал"),
      T("樱花季", "Сакура улирал"),
      T("日本旅行", "Япон аялал"),
    ],
  },
  {
    id: "n4",
    title: T(
      "新手化妆｜10分钟伪素颜底妆教程",
      "Эхлэгчийн будалт｜10 минутын байгалийн харагдах суурь",
    ),
    description: T(
      "新手向超详细底妆教程！手把手教你画出干净通透的伪素颜～\n\n用到的产品：\n• 兰蔻菁纯防晒\n• NARS 粉底液 light3\n• Suqqu 散粉",
      "Эхлэгчдэд зориулсан нарийвчилсан заавар! Цэвэр, тунгалаг 'байгалийн' будалт хийж сурахад тус болно ~\n\nХэрэглэсэн бүтээгдэхүүн:\n• Lancôme нарны хамгаалагч\n• NARS суурь шингэн light3\n• Suqqu нунтаг",
    ),
    category: "beauty",
    cover: { seed: "beauty-1", width: 600, height: 750 },
    images: [
      { seed: "beauty-1", width: 1200, height: 1500 },
      { seed: "beauty-1b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("美妆小白Lily", "Будалтын эхлэгч Lily"),
      avatarSeed: "a4",
      followers: "5.2w",
    },
    likes: 5621,
    collects: 4302,
    commentsCount: 218,
    postedAt: "2026-04-28",
    tags: [
      T("新手化妆", "Эхлэгчийн будалт"),
      T("底妆", "Суурь будалт"),
      T("化妆教程", "Будалтын заавар"),
    ],
  },
  {
    id: "n5",
    title: T(
      "30㎡小户型也能这样住｜出租屋改造日记",
      "30㎡ жижиг орон сууц｜Түрээсийн байр шинэчлэх тэмдэглэл",
    ),
    description: T(
      "毕业三年攒钱租了人生第一个独立公寓，从0开始改造！\n预算3000搞定全屋，看看效果～",
      "Төгсөөд 3 жилийн дараа анхны өөрийн орон сууцанд орлоо. 0-ээс эхлэн шинэчлэв!\n3000 юаны төсөвт багтаасан үр дүнг үзээрэй ~",
    ),
    category: "home",
    cover: { seed: "home-1", width: 600, height: 800 },
    images: [
      { seed: "home-1", width: 1200, height: 1600 },
      { seed: "home-1b", width: 1200, height: 1600 },
      { seed: "home-1c", width: 1200, height: 1600 },
    ],
    author: {
      name: T("小满的家", "Сяомань-ы гэр"),
      avatarSeed: "a5",
      followers: "21.7w",
    },
    likes: 12842,
    collects: 9120,
    commentsCount: 532,
    postedAt: "2026-04-24",
    location: T("杭州", "Хангжоу"),
    tags: [
      T("小户型", "Жижиг орон сууц"),
      T("出租屋改造", "Түрээсийн шинэчлэлт"),
      T("家居", "Гэр ахуй"),
    ],
  },
  {
    id: "n6",
    title: T(
      "普拉提一个月｜身材变化对比图",
      "1 сар Пилатес｜Биеийн өөрчлөлтийн харьцуулалт",
    ),
    description: T(
      "坚持普拉提30天的真实变化！附详细动作分解和饮食搭配 💪",
      "30 өдөр Пилатес тогтвортой хийсний бодит өөрчлөлт! Дасгалын задаргаа болон хоолны төлөвлөгөө хавсаргалаа 💪",
    ),
    category: "fitness",
    cover: { seed: "fitness-1", width: 600, height: 700 },
    images: [{ seed: "fitness-1", width: 1200, height: 1400 }],
    author: {
      name: T("Coach Mia", "Mia дасгалжуулагч"),
      avatarSeed: "a6",
      followers: "18.9w",
    },
    likes: 9320,
    collects: 6210,
    commentsCount: 401,
    postedAt: "2026-04-22",
    tags: [
      T("普拉提", "Пилатес"),
      T("健身", "Фитнес"),
      T("塑形", "Биеийн хэлбэр"),
    ],
  },
  {
    id: "n7",
    title: T(
      "今年最火的5本悬疑小说推荐",
      "Энэ жилийн шилдэг 5 нууцлаг роман",
    ),
    description: T(
      "通宵看完根本停不下来 📚 每一本都意想不到的反转！",
      "Шөнөжингөө уншсан, зогсож чадахгүй боллоо 📚 Бүх роман гэнэтийн эргэлтэй!",
    ),
    category: "movie",
    cover: { seed: "art-1", width: 600, height: 850 },
    images: [{ seed: "art-1", width: 1200, height: 1700 }],
    author: {
      name: T("书虫日记", "Номын хорхойн өдрийн тэмдэглэл"),
      avatarSeed: "a7",
      followers: "9.4w",
    },
    likes: 4521,
    collects: 3812,
    commentsCount: 156,
    postedAt: "2026-04-23",
    tags: [
      T("读书", "Уншлага"),
      T("悬疑小说", "Нууцлаг роман"),
      T("书单", "Номын жагсаалт"),
    ],
  },
  {
    id: "n8",
    title: T(
      "互联网大厂面试经验｜3年产品岗复盘",
      "Том технологийн ярилцлагын туршлага｜3 жилийн PM-ийн дүгнэлт",
    ),
    description: T(
      "今年面了7家大厂，拿了4个offer 💼 总结一些避坑经验给大家～",
      "Энэ жил 7 том компанид ярилцлага өгч 4 саналыг гартаа авлаа 💼 Алдаа гаргуулахгүй байх зөвлөгөөгөө хуваалцлаа ~",
    ),
    category: "career",
    cover: { seed: "career-1", width: 600, height: 600 },
    images: [{ seed: "career-1", width: 1200, height: 1200 }],
    author: {
      name: T("PM老王", "Ван PM"),
      avatarSeed: "a8",
      followers: "47.2w",
    },
    likes: 18723,
    collects: 22341,
    commentsCount: 932,
    postedAt: "2026-04-20",
    tags: [
      T("职场", "Ажил"),
      T("面试", "Ярилцлага"),
      T("产品经理", "Product Manager"),
    ],
  },
  {
    id: "n9",
    title: T("我家猫主子的一天 🐱", "Манай муурын нэг өдөр 🐱"),
    description: T(
      "记录我家英短奶牛的快乐日常，每天都被治愈💕",
      "Манай British Shorthair үнээ муурын аз жаргалтай өдөр тутам. Өдөр бүр сэтгэл сэргээдэг 💕",
    ),
    category: "pets",
    cover: { seed: "pet-1", width: 600, height: 750 },
    images: [
      { seed: "pet-1", width: 1200, height: 1500 },
      { seed: "pet-1b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("汤圆和饺子", "Танюань ба Жаоз"),
      avatarSeed: "a9",
      followers: "3.8w",
    },
    likes: 6210,
    collects: 1820,
    commentsCount: 289,
    postedAt: "2026-04-28",
    tags: [
      T("猫咪", "Муур"),
      T("宠物日常", "Тэжээвэрийн өдөр"),
      T("英短", "British Shorthair"),
    ],
  },
  {
    id: "n10",
    title: T(
      "刚到货的iPad mini7开箱｜真香警告",
      "Шинэ iPad mini7 задлалт｜Үнэхээр сайхан анхааруулга",
    ),
    description: T(
      "纠结了大半年终于下单！这次升级值得吗？详细体验报告来啦📱",
      "Хагас жил эргэцүүлсний эцэст захиалж авлаа! Энэ шинэчлэл үнэ цэнэтэй юу? Дэлгэрэнгүй туршлагын тайлан 📱",
    ),
    category: "tech",
    cover: { seed: "tech-1", width: 600, height: 800 },
    images: [
      { seed: "tech-1", width: 1200, height: 1600 },
      { seed: "tech-1b", width: 1200, height: 1600 },
    ],
    author: {
      name: T("数码小白Tony", "Технологийн эхлэгч Tony"),
      avatarSeed: "a10",
      followers: "62.5w",
    },
    likes: 11420,
    collects: 5210,
    commentsCount: 712,
    postedAt: "2026-04-27",
    tags: [
      T("iPad", "iPad"),
      T("数码开箱", "Технологийн задлалт"),
      T("苹果", "Apple"),
    ],
  },
  {
    id: "n11",
    title: T(
      "原神 5.4 版本攻略｜新角色养成指南",
      "Genshin 5.4 заавар｜Шинэ дүрийг хөгжүүлэх удирдамж",
    ),
    description: T(
      "新角色技能详解+圣遗物搭配，一篇看懂！",
      "Шинэ дүрийн чадварын тайлбар + артефактын сонголт — нэг бичлэгээс ойлгомжтой!",
    ),
    category: "game",
    cover: { seed: "game-1", width: 600, height: 700 },
    images: [{ seed: "game-1", width: 1200, height: 1400 }],
    author: {
      name: T("提瓦特旅行者", "Тэйватын аялагч"),
      avatarSeed: "a11",
      followers: "28.3w",
    },
    likes: 7821,
    collects: 6932,
    commentsCount: 451,
    postedAt: "2026-04-26",
    tags: [T("原神", "Genshin"), T("游戏攻略", "Тоглоомын заавар")],
  },
  {
    id: "n12",
    title: T(
      "巴黎春日｜在塞纳河边散步的午后",
      "Парисын хавар｜Сены голын дэргэдэх үдэш",
    ),
    description: T(
      "突然就想出门走走，春天的巴黎美得像油画 🌸",
      "Гэнэт алхах хүсэл төрөв. Хаврын Парис тосон будгийн зураг шиг 🌸",
    ),
    category: "travel",
    cover: { seed: "travel-2", width: 600, height: 800 },
    images: [
      { seed: "travel-2", width: 1200, height: 1600 },
      { seed: "travel-2b", width: 1200, height: 1600 },
    ],
    author: {
      name: T("Lulu in Paris", "Парис дахь Lulu"),
      avatarSeed: "a12",
      followers: "15.6w",
    },
    likes: 8932,
    collects: 4210,
    commentsCount: 312,
    postedAt: "2026-04-21",
    location: T("巴黎", "Парис"),
    tags: [
      T("巴黎", "Парис"),
      T("欧洲旅行", "Европ аялал"),
      T("春天", "Хавар"),
    ],
  },
  {
    id: "n13",
    title: T(
      "高分子料理｜在家做米其林甜品 🍰",
      "Молекулын хоол｜Гэртээ Мишелин амтат хоол хийх 🍰",
    ),
    description: T(
      "看起来很难其实超简单！附详细步骤和工具清单～",
      "Хүндрэлтэй харагдавч үнэндээ амархан! Алхам ба багажийн жагсаалт хавсаргалаа ~",
    ),
    category: "food",
    cover: { seed: "food-2", width: 600, height: 750 },
    images: [{ seed: "food-2", width: 1200, height: 1500 }],
    author: {
      name: T("甜品师Cici", "Cici амтат хоолч"),
      avatarSeed: "a13",
      followers: "53.2w",
    },
    likes: 14210,
    collects: 11820,
    commentsCount: 532,
    postedAt: "2026-04-25",
    tags: [
      T("甜品", "Амтат хоол"),
      T("烘焙", "Талх жигнэх"),
      T("米其林", "Мишелин"),
    ],
  },
  {
    id: "n14",
    title: T(
      "约会妆容教程｜温柔又心动的眼妆",
      "Болзооны будалт｜Зөөлөн бөгөөд зүрх хөдлөм нүдний будалт",
    ),
    description: T(
      "化完男朋友直接看呆 💕 步骤超简单，新手也能学会！",
      "Будчихаад харагдахуйц 💕 Алхам нь маш энгийн, эхлэгчид ч сурч чадна!",
    ),
    category: "beauty",
    cover: { seed: "beauty-2", width: 600, height: 800 },
    images: [
      { seed: "beauty-2", width: 1200, height: 1600 },
      { seed: "beauty-2b", width: 1200, height: 1600 },
    ],
    author: {
      name: T("化妆师阿楠", "Анан будалтач"),
      avatarSeed: "a14",
      followers: "39.1w",
    },
    likes: 16234,
    collects: 13210,
    commentsCount: 821,
    postedAt: "2026-04-23",
    tags: [
      T("约会妆", "Болзооны будалт"),
      T("眼妆教程", "Нүдний будалт"),
      T("化妆", "Будалт"),
    ],
  },
  {
    id: "n15",
    title: T(
      "周末花艺课｜亲手做一束春日花束",
      "Амралтын өдрийн цэцгийн анги｜Хаврын баглаа",
    ),
    description: T(
      "把春天搬回家🌷 没有基础也能完成的简单插花",
      "Хаврыг гэртээ авчрах 🌷 Үндэсгүй ч хийж чадах энгийн цэцгийн зохицуулалт",
    ),
    category: "art",
    cover: { seed: "art-2", width: 600, height: 700 },
    images: [{ seed: "art-2", width: 1200, height: 1400 }],
    author: {
      name: T("花物语", "Цэцгийн үлгэр"),
      avatarSeed: "a15",
      followers: "8.2w",
    },
    likes: 3821,
    collects: 2102,
    commentsCount: 142,
    postedAt: "2026-04-22",
    tags: [
      T("花艺", "Цэцгийн урлаг"),
      T("插花", "Цэцэг засах"),
      T("周末", "Амралт"),
    ],
  },
  {
    id: "n16",
    title: T(
      "考研er必看｜400+学姐的复习计划表",
      "Магистрантурын шалгалтанд｜400+ оноотой эгчийн төлөвлөгөө",
    ),
    description: T(
      "从大三下学期开始备考，分享最有效的复习方法和时间表 ✏️",
      "3-р курсын хавраас бэлдэж эхэлсэн. Хамгийн үр дүнтэй давталтын арга, цагийн хуваариа хуваалцлаа ✏️",
    ),
    category: "education",
    cover: { seed: "edu-1", width: 600, height: 800 },
    images: [{ seed: "edu-1", width: 1200, height: 1600 }],
    author: {
      name: T("研路同行", "Эрдэм судлалын зам"),
      avatarSeed: "a16",
      followers: "26.5w",
    },
    likes: 21340,
    collects: 32102,
    commentsCount: 1234,
    postedAt: "2026-04-19",
    tags: [
      T("考研", "Магистрантур"),
      T("学习方法", "Сурах арга"),
      T("复习", "Давталт"),
    ],
  },
  {
    id: "n17",
    title: T(
      "周末市集Vlog｜淘到了好多宝藏",
      "Амралтын өдрийн зах｜Олон эрдэнэс олдлоо",
    ),
    description: T(
      "上海最近超火的周末市集，氛围感拉满！",
      "Шанхайд сүүлд их алдартай болсон амралтын зах. Уур амьсгал нь үнэхээр гайхалтай!",
    ),
    category: "travel",
    cover: { seed: "lifestyle-1", width: 600, height: 750 },
    images: [
      { seed: "lifestyle-1", width: 1200, height: 1500 },
      { seed: "lifestyle-1b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("Wendy的城市笔记", "Wendy-ийн хотын тэмдэглэл"),
      avatarSeed: "a17",
      followers: "11.8w",
    },
    likes: 5821,
    collects: 2210,
    commentsCount: 187,
    postedAt: "2026-04-28",
    location: T("上海", "Шанхай"),
    tags: [
      T("市集", "Зах"),
      T("周末", "Амралт"),
      T("上海", "Шанхай"),
    ],
  },
  {
    id: "n18",
    title: T(
      "情人节穿搭｜温柔到犯规的5套约会装",
      "Хайрлагчдын өдрийн хувцас｜Хууль зөрчтөл зөөлөн 5 хувилбар",
    ),
    description: T(
      "甜辣风、温柔风、知性风，总有一款适合你 💕",
      "Амттай-халуун, зөөлөн, ухаалаг — танд тохирох нь олдоно 💕",
    ),
    category: "fashion",
    cover: { seed: "fashion-2", width: 600, height: 800 },
    images: [
      { seed: "fashion-2", width: 1200, height: 1600 },
      { seed: "fashion-2b", width: 1200, height: 1600 },
      { seed: "fashion-2c", width: 1200, height: 1600 },
    ],
    author: {
      name: T("Mia穿搭日记", "Mia-ын хувцасны өдрийн тэмдэглэл"),
      avatarSeed: "a18",
      followers: "44.7w",
    },
    likes: 13821,
    collects: 8210,
    commentsCount: 521,
    postedAt: "2026-04-24",
    tags: [
      T("情人节", "Хайрлагчдын өдөр"),
      T("约会穿搭", "Болзооны хувцас"),
      T("甜辣风", "Амттай-халуун стиль"),
    ],
  },
  {
    id: "n19",
    title: T(
      "异地恋3年｜我们是怎么走过来的",
      "3 жил холын зайн хайр｜Бид яаж туулсан бэ",
    ),
    description: T(
      "真实分享异地恋的酸甜苦辣，给同样异地的姐妹一点参考",
      "Холын зайн хайрын баяр гомдол, зовлон жаргалыг үнэн зөвөөр хуваалцлаа. Адил байдалтай эгч нартаа лавлагаа болгон",
    ),
    category: "love",
    cover: { seed: "love-1", width: 600, height: 700 },
    images: [{ seed: "love-1", width: 1200, height: 1400 }],
    author: {
      name: T("等风也等你", "Салхи болоод чамайг хүлээж"),
      avatarSeed: "a19",
      followers: "7.3w",
    },
    likes: 9210,
    collects: 4521,
    commentsCount: 612,
    postedAt: "2026-04-20",
    tags: [
      T("异地恋", "Холын зайн хайр"),
      T("情感", "Хайр сэтгэл"),
      T("感情经验", "Харилцааны туршлага"),
    ],
  },
  {
    id: "n20",
    title: T(
      "一周减脂餐｜好吃不胖的食谱合集🥗",
      "1 долоо хоногийн өөх багасгах хоол｜Амттай ч таргалуулдаггүй жор🥗",
    ),
    description: T(
      "亲测一周瘦3斤！每一餐都很饱腹，完全不饿",
      "Биеэр туршаад 1 долоо хоногт 1.5 кг буурлаа! Хоол бүр цатгалан, өлсдөггүй",
    ),
    category: "fitness",
    cover: { seed: "food-3", width: 600, height: 750 },
    images: [
      { seed: "food-3", width: 1200, height: 1500 },
      { seed: "food-3b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("营养师小麦", "Шяомай хоол зүйч"),
      avatarSeed: "a20",
      followers: "31.5w",
    },
    likes: 12342,
    collects: 18421,
    commentsCount: 432,
    postedAt: "2026-04-21",
    tags: [
      T("减脂餐", "Жин хорогдуулах хоол"),
      T("健康饮食", "Эрүүл хоол"),
      T("瘦身", "Жин хасах"),
    ],
  },
  {
    id: "n21",
    title: T(
      "我的咖啡馆探店清单｜上海篇",
      "Миний кафены жагсаалт｜Шанхай хэсэг",
    ),
    description: T(
      "本地人才知道的小众咖啡馆，每一家都好出片！☕️",
      "Зөвхөн нутгийнхан мэддэг нууц кафенууд. Бүгд гайхалтай зурагтай газрууд! ☕️",
    ),
    category: "food",
    cover: { seed: "cafe-1", width: 600, height: 800 },
    images: [
      { seed: "cafe-1", width: 1200, height: 1600 },
      { seed: "cafe-1b", width: 1200, height: 1600 },
    ],
    author: {
      name: T("咖啡因依赖症", "Кофеины донтолт"),
      avatarSeed: "a21",
      followers: "19.2w",
    },
    likes: 7821,
    collects: 9821,
    commentsCount: 312,
    postedAt: "2026-04-26",
    location: T("上海", "Шанхай"),
    tags: [
      T("咖啡馆", "Кафе"),
      T("探店", "Дэлгүүр судлах"),
      T("上海", "Шанхай"),
    ],
  },
  {
    id: "n22",
    title: T(
      "第一次养多肉｜零基础新手指南🌵",
      "Анх удаа суккулент｜Эхлэгчийн заавар🌵",
    ),
    description: T(
      "从买种到养活全过程！附踩雷品种避坑",
      "Худалдан авахаас амьдрах хүртэлх бүх үе шат! Битгий сонгох сорт жагсаасан",
    ),
    category: "home",
    cover: { seed: "plant-1", width: 600, height: 700 },
    images: [{ seed: "plant-1", width: 1200, height: 1400 }],
    author: {
      name: T("植物系少女", "Ургамал хайрлагч охин"),
      avatarSeed: "a22",
      followers: "6.7w",
    },
    likes: 4210,
    collects: 3210,
    commentsCount: 198,
    postedAt: "2026-04-25",
    tags: [
      T("多肉", "Суккулент"),
      T("养花", "Цэцэг ургуулах"),
      T("新手", "Эхлэгч"),
    ],
  },
  {
    id: "n23",
    title: T(
      "新机推荐｜2000元价位最值得入手的手机",
      "Шинэ утас｜2000 юаны дотроос хамгийн зохистой нь",
    ),
    description: T(
      "横评5款热门机型，闭眼入这一款准没错📱",
      "5 загварыг харьцуулсан тоймд тулгуурлан, нүдээ аниад худалдан авч болох ганц нь энэ 📱",
    ),
    category: "tech",
    cover: { seed: "tech-2", width: 600, height: 750 },
    images: [
      { seed: "tech-2", width: 1200, height: 1500 },
      { seed: "tech-2b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("数码玩家阿杰", "Аже технологич"),
      avatarSeed: "a23",
      followers: "78.2w",
    },
    likes: 15823,
    collects: 8210,
    commentsCount: 921,
    postedAt: "2026-04-22",
    tags: [
      T("手机推荐", "Утас санал болгох"),
      T("数码", "Технологи"),
      T("评测", "Үнэлгээ"),
    ],
  },
  {
    id: "n24",
    title: T(
      "看完《某剧》我哭了一晚上",
      "《Тэр кино》-г үзээд би шөнөжингөө уйлсан",
    ),
    description: T(
      "近期最让我意难平的一部剧，文末附深度解析（无剧透）",
      "Сүүлд хамгийн их сэтгэл хөдлөгдсөн цуврал. Сүүлд гүнзгий шинжилгээ (агуулга задрах биш)",
    ),
    category: "movie",
    cover: { seed: "movie-1", width: 600, height: 800 },
    images: [{ seed: "movie-1", width: 1200, height: 1600 }],
    author: {
      name: T("影迷小狗", "Кинонд дуртай нохой"),
      avatarSeed: "a24",
      followers: "14.3w",
    },
    likes: 8210,
    collects: 3821,
    commentsCount: 612,
    postedAt: "2026-04-23",
    tags: [
      T("影评", "Кино шүүмж"),
      T("剧集推荐", "Цуврал санал"),
      T("观后感", "Үзэгчийн сэтгэгдэл"),
    ],
  },
  {
    id: "n25",
    title: T(
      "30天日语自学｜从0到N4的方法",
      "30 өдрийн япон хэл｜0-аас N4 хүртэлх арга",
    ),
    description: T(
      "全职上班的我用30天考过N4，分享高效学习路线",
      "Бүтэн цагаар ажилладаг би 30 өдөрт N4-ийг давсан. Үр дүнтэй сурах замаа хуваалцлаа",
    ),
    category: "education",
    cover: { seed: "edu-2", width: 600, height: 700 },
    images: [{ seed: "edu-2", width: 1200, height: 1400 }],
    author: {
      name: T("Hina的语言库", "Hina-ийн хэлний сан"),
      avatarSeed: "a25",
      followers: "12.1w",
    },
    likes: 5821,
    collects: 7210,
    commentsCount: 342,
    postedAt: "2026-04-19",
    tags: [
      T("日语", "Япон хэл"),
      T("自学", "Бие даан суралцах"),
      T("语言学习", "Хэл сурах"),
    ],
  },
  {
    id: "n26",
    title: T(
      "在家手冲咖啡入门｜器具选择全攻略",
      "Гэрийн гар цутгалт кофе｜Багажийн сонголтын заавар",
    ),
    description: T(
      "新手不踩雷的器具清单，这一篇就够了 ☕",
      "Эхлэгчид төөрөгдөхөөргүй багажийн жагсаалт — энэ ганц л хүрэлцэнэ ☕",
    ),
    category: "food",
    cover: { seed: "cafe-2", width: 600, height: 750 },
    images: [{ seed: "cafe-2", width: 1200, height: 1500 }],
    author: {
      name: T("Daily Coffee", "Өдөр тутмын кофе"),
      avatarSeed: "a26",
      followers: "22.8w",
    },
    likes: 9210,
    collects: 8210,
    commentsCount: 287,
    postedAt: "2026-04-24",
    tags: [
      T("手冲咖啡", "Гар цутгалт кофе"),
      T("咖啡", "Кофе"),
      T("新手", "Эхлэгч"),
    ],
  },
  {
    id: "n27",
    title: T(
      "极简衣橱｜30件单品打造一年穿搭",
      "Минималист шүүгээ｜30 хувцсаар жилийн хэв маяг",
    ),
    description: T(
      "胶囊衣橱实践1年的真实感受，少即是多 ✨",
      "Капсул шүүгээний 1 жилийн бодит туршлага. Цөөн бол их ✨",
    ),
    category: "fashion",
    cover: { seed: "fashion-3", width: 600, height: 850 },
    images: [
      { seed: "fashion-3", width: 1200, height: 1700 },
      { seed: "fashion-3b", width: 1200, height: 1700 },
    ],
    author: {
      name: T("极简的Yoyo", "Минималист Yoyo"),
      avatarSeed: "a27",
      followers: "16.4w",
    },
    likes: 7210,
    collects: 6321,
    commentsCount: 256,
    postedAt: "2026-04-22",
    tags: [
      T("极简", "Минимализм"),
      T("胶囊衣橱", "Капсул шүүгээ"),
      T("穿搭", "Хувцас"),
    ],
  },
  {
    id: "n28",
    title: T(
      "三亚5天4晚｜蜜月攻略详细版",
      "Санья 5 өдөр 4 шөнө｜Бал сарын нарийн заавар",
    ),
    description: T(
      "酒店、餐厅、拍照机位全收录，照搬就行！",
      "Зочид буудал, ресторан, гэрэл зургийн цэг бүгд нэгтгэгдсэн — хуулаад ашиглаарай!",
    ),
    category: "travel",
    cover: { seed: "travel-3", width: 600, height: 700 },
    images: [
      { seed: "travel-3", width: 1200, height: 1400 },
      { seed: "travel-3b", width: 1200, height: 1400 },
    ],
    author: {
      name: T("周游夫妇", "Аяллын хосууд"),
      avatarSeed: "a28",
      followers: "33.7w",
    },
    likes: 11420,
    collects: 13821,
    commentsCount: 521,
    postedAt: "2026-04-25",
    location: T("三亚", "Санья"),
    tags: [
      T("三亚", "Санья"),
      T("蜜月", "Бал сар"),
      T("旅行攻略", "Аяллын заавар"),
    ],
  },
  {
    id: "n29",
    title: T(
      "新手撸铁｜女生第一次去健身房 💪",
      "Эхлэгчийн жинтэй дасгал｜Анх удаа фитнес явсан охидод 💪",
    ),
    description: T(
      "完全0基础到自由训练的过程，包含详细动作图解",
      "0-ээс чөлөөт дасгал хүртэлх явц. Дасгалуудын зурагт тайлбартай",
    ),
    category: "fitness",
    cover: { seed: "fitness-2", width: 600, height: 800 },
    images: [{ seed: "fitness-2", width: 1200, height: 1600 }],
    author: {
      name: T("铁姐姐Sara", "Sara төмөр эгч"),
      avatarSeed: "a29",
      followers: "27.3w",
    },
    likes: 10821,
    collects: 8210,
    commentsCount: 421,
    postedAt: "2026-04-26",
    tags: [
      T("健身", "Фитнес"),
      T("撸铁", "Жинтэй дасгал"),
      T("新手", "Эхлэгч"),
    ],
  },
  {
    id: "n30",
    title: T(
      "我家狗子的高定证件照来啦📷",
      "Манай нохойн couture гэрэл зураг📷",
    ),
    description: T(
      "金毛巡回写真，每张都想做表情包 😂",
      "Алтан Ретриверийн аяллын зургууд — бүх нь meme болгомоор 😂",
    ),
    category: "pets",
    cover: { seed: "pet-2", width: 600, height: 750 },
    images: [
      { seed: "pet-2", width: 1200, height: 1500 },
      { seed: "pet-2b", width: 1200, height: 1500 },
    ],
    author: {
      name: T("金毛橘子", "Алтан жүрж"),
      avatarSeed: "a30",
      followers: "5.6w",
    },
    likes: 4321,
    collects: 1210,
    commentsCount: 287,
    postedAt: "2026-04-27",
    tags: [
      T("金毛", "Алтан Ретривер"),
      T("宠物写真", "Тэжээвэрийн зураг"),
      T("狗狗", "Нохой"),
    ],
  },
];

export const NOTES: Note[] = RAW.map((n, idx) => ({
  ...n,
  comments: makeComments(idx, 6 + (idx % 4)),
}));

export function getNoteById(id: string): Note | undefined {
  return NOTES.find((n) => n.id === id);
}
