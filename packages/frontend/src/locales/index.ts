// 这是一个Vue I18n 国际化配置文件，用于实现网站的中英双语切换功能
import { createI18n } from 'vue-i18n';

const messages = {
  'zh-CN': {
    siteName: '焰境·万载',
    nav: {
      home: '首页',
      culture: '非遗文化',
      food: '美食特产',
      industry: '烟花产业',
      routes: '旅游线路',
      viewingSpots: '赏烟地点',
      map: '地图导览',
      merchant: '商家展示',
      about: '关于我们'
    },
    home: {
      hero: {
        title: '一朝相逢，便是万载',
        subtitle: '探索千年烟花文化，体验非遗魅力，品味特色美食，领略万载风光',
        cta: '查看旅游线路'
      },
      features: {
        title: '核心特色',
        fireworks: {
          title: '千年烟花文化',
          desc: '万载拥有1400多年的烟花生产历史，乃"中国花炮之乡"。'
        },
        food: {
          title: '特色美食特产',
          desc: '品尝万载六大碗、万载百合、罗城扎粉等特色美食，感受赣西独特的饮食文化。'
        },
        tourism: {
          title: '丰富旅游资源',
          desc: '万载古城、竹山洞、九龙原始森林等众多景点，满足不同游客的旅游需求。'
        }
      },
      culture: {
        title: '非遗文化',
        desc: '万载拥有丰富的非物质文化遗产，包括万载花炮、得胜鼓、万载开口傩、夏布织造等。这些传统文化遗产承载着万载人民的智慧和创造力，是万载文化的重要组成部分。',
        learnMore: '了解更多'
      },
      food: {
        title: '美食特产',
        desc: '万载美食以其独特的风味和制作工艺闻名，万载六大碗、万载剁肉、罗城扎粉等传统菜肴，以及百合粉、南酸枣糕等特产，都是不可错过的舌尖美味。',
        learnMore: '了解更多'
      },
      industry: {
        title: '烟花产业',
        desc: '万载作为中国四大花炮主产区之一，烟花产业历史悠久，技术先进。近年来，万载花炮产业不断转型升级，产品畅销全球，成为当地的支柱富民产业之一。',
        learnMore: '了解更多'
      },
      cta: {
        title: '开始您的万载之旅',
        desc: '无论您是想体验千年烟花文化，还是品尝特色美食，或是欣赏自然风光，万载都能满足您的需求。',
        viewRoutes: '查看旅游线路'
      },
      firework: {
        title: '数字烟花体验',
        desc: '在屏幕前即可体验万载烟花的璀璨与浪漫。点击进入，尽情燃放你的烟花！',
        feature1: '多种烟花类型可选',
        feature2: '逼真的燃放效果',
        feature3: '支持音效和全屏',
        cta: '进入数字烟花',
        types: '烟花类型',
        effects: '特效',
        sound: '音效',
        interactive: '交互'
      }
    },
    breadcrumb: {
      home: '首页',
      culture: '非遗文化',
      food: '美食特产',
      industry: '烟花产业',
      routes: '旅游线路',
      viewingSpots: '赏烟地点',
      map: '地图导览',
      merchant: '商家展示'
    },
    culture: {
      hero: {
        title: '非遗文化',
        subtitle: '探索万载千年传承的文化遗产'
      },
      cta: {
        title: '体验非遗文化',
        desc: '来到万载，您可以亲自体验这些非物质文化遗产的魅力，感受千年文化的传承与创新。'
      },
      sections: {
        fireworks: {
          title: '万载花炮',
          desc1: '万载花炮制作技艺在2008年6月入选第一批国家级非物质文化遗产扩展项目名录。万载花炮以响声好、响率高、有香味而驰名中外，从最初单一的响声效果，发展到如今声、色、烟、香、花等综合造型运用。',
          desc2: '万载烟花的历史可以追溯到唐代，盛于宋代，历经千年发展。清道光年间，万载烟花爆竹已经"通行南北，商贾络绎"；光绪年间，当地"男妇大小均借此以资工作"，产品质高价廉，销至广东、福建等省。',
          desc3: '如今，万载花炮共有4000多个规格品种，涵盖鞭炮、玩具烟花、组合烟花等9大类，产品畅销全国，远销欧、美、东南亚等40多个国家和地区。'
        },
        deshenggu: {
          title: '得胜鼓',
          desc1: '得胜鼓是万载县的传统民间鼓乐，起源于北宋，主要取材于唐朝平定"安史之乱"的历史事件。得胜鼓以其雄浑激越的气势、整齐划一的节奏和丰富多彩的表演形式而闻名。',
          desc2: '得胜鼓通常由数十人组成表演队伍，使用大鼓、小鼓、唢呐、锣、钹等乐器，表演时队形变幻多样，鼓点节奏明快，充分展现了万载人民的豪迈气概和团结精神。',
          desc3: '如今，得胜鼓已成为万载县重要的文化品牌，经常在各类文化活动和节日庆典中表演，深受群众喜爱。'
        },
        kaiKouNuo: {
          title: '万载开口傩',
          desc1: '万载开口傩，又称"跳魈"，是当地民间驱鬼逐疫、祈福求安、娱神娱人的极具特色的民俗文化活动，起源于元末明初，距今已有600余年历史。',
          desc2: '开口傩不同于其他傩舞形式，它每角必唱，可谓唱、做、念、打齐全，但以唱为主，音乐则以打击乐贯穿始终，保留着古朴的乡土气息。',
          desc3: '2008年6月，"万载开口傩"入选第二批国家级非物质文化遗产名录。'
        },
        xiaBu: {
          title: '夏布织造',
          desc1: '夏布织造技艺是万载县的传统手工技艺，其生产可追溯溯源至东晋后期，距今已有1600余年历史。2009年，万载夏布织造技艺被列入第三批国家级非物质文化遗产名录。',
          desc2: '万载夏布以苎麻为原料，经过经纱、刷浆、上机、织造四道工序。夏布质地轻薄、透气性好、吸汗性强，是夏季理想的服装面料。',
          desc3: '如今，万载夏布已成为江西省的特色产品，远销海内外，深受消费者喜爱。'
        },
        zhiPeng: {
          title: '纸棚山歌',
          desc1: '纸棚山歌是万载县的传统民间音乐，起源于明代，距今已有500多年的历史。纸棚山歌是表芯纸制作工人在劳动过程中创作的歌谣，内容丰富，形式多样。',
          desc2: '山歌内容围绕采竹、沤竹、焙纸等造纸工序展开，融合劳作艰辛、男女情爱与丰收期盼等主题。歌曲旋律优美，节奏明快，具有浓郁的地方特色。',
          desc3: '2007年3月，纸棚山歌已被列入江西省非物质文化遗产名录，成为万载县重要的文化遗产之一。'
        }
      }
    },
    food: {
      hero: {
        title: '美食特产',
        subtitle: '品尝万载特色美食'
      },
      cta: {
        title: '品美食·买特产',
        desc: '来到万载，您可以品尝到正宗的万载特色美食，购买到传统的万载特产，带走一份美好的回忆。',
        cta: '查看美食旅游线路'
      },
      sections: {
        liuDaWan: {
          title: '万载六大碗',
          titleEn: 'Wanzai Six Big Bowls',
          desc: '万载"六大碗"是万载传统宴席的精髓所在，承载着万载人热情好客的传统文化。'
        },
        otherFood: {
          title: '其他美食',
          titleEn: 'Other Delicacies'
        },
        special: {
          title: '特色菜肴',
          desc: '万载剁肉、罗城扎粉等传统菜肴，以及百合粉、南酸枣糕等特产，都是不可错过的舌尖美味。'
        },
        traditionalSpecialties: {
          title: '传统特产',
          titleEn: 'Traditional Specialties'
        },
        fuGuiYouJuan: {
          title: '富贵油卷',
          desc1: '万载六大碗的头菜，又称"八宝油卷"，是万载待客的最高礼遇。选用猪肉、猪网油、笋干、马蹄等八种食材精制，以猪网油包裹肉馅，经蒸制而成。外皮软糯微脆，内馅鲜香醇厚，口感丰富有层次。承载着富贵发财、步步高升的美好寓意，是万载宴席中不可或缺的开篇佳肴，藏着当地人的热忱与期许。'
        },
        wanzaiZhaRou: {
          title: '万载扎肉',
          desc1: '源于明末清初的传统佳肴，类似宜春扣肉却独具万载特色。选用优质五花肉，经腌制、油炸、蒸制等多道工序制成，色泽晶莹红亮，油润光泽。肉质肥而不腻，瘦而不柴，醇香软糯，入口即化，每一口都饱含浓郁的酱香与油脂的醇香。寓意生活富足、红红火火，是万载宴席中彰显喜庆氛围的必备菜品。'
        },
        wanzaiZhaRou2: {
          title: '万载诈肉',
          desc1: '万载极具特色的"以米代肉"佳肴，打破主食与硬菜的界限。以本地米粉和新鲜猪肉为原料，经搅拌、蒸制等传统工艺制成，虽不含大量鲜肉，却满口肉香。口感软糯筋道，咸香适中，吸饱了肉汁与调料的精髓，不油不腻，老少皆宜。寓意五谷丰登、年年有余，是镌刻着万载农耕文化的特色美味。'
        },
        wanzaiKuaiYu: {
          title: '万载块鱼',
          desc1: '选用万载本地新鲜草鱼，切成大小均匀的块状，用酒娘和食盐腌制入味后，经油炸至金黄色，再上锅蒸制而成。外皮微脆，内里细嫩滑嫩，鲜香味浓，鱼刺软烂可食，无需担心卡喉。色泽金黄诱人，口感层次丰富，酒娘的醇香中和了鱼肉的腥味，更添风味。寓意顺心顺意、年年有余，是宴席上寓意美好的经典鱼类菜肴。'
        },
        kangLeSanHuangJi: {
          title: '康乐三黄鸡',
          desc1: '选用万载本地散养的康乐三黄鸡，兼具羽黄、爪黄、喙黄的鲜明特征。采用传统清炖工艺，不添加过多调料，最大程度保留鸡肉本味。成品汤清色亮，肉质细嫩紧实，皮滑不腻，鲜香味醇，营养十分丰富。寓意大吉大利、万事如意，既是宴席上的硬菜，也是滋养身心的佳品，尽显万载本土风味。'
        },
        qingDunHeiShanYang: {
          title: '清炖黑山羊',
          desc1: '万载六大碗中的滋补佳品，选用本地优质黑山羊为原料，经慢火清炖而成。汤色清亮透明，无丝毫膻味，肉质细嫩不柴，醇香四溢，入口即化。富含蛋白质和多种矿物质，是万载人冬至时节的传统补品。承载着三阳开泰、好运常来的吉祥寓意，每一口都是大自然的馈赠，暖身又暖心。'
        },
        luoChenZhaFen: {
          title: '罗城扎粉',
          desc1: '罗城扎粉是万载省级非遗美食，明时起源于泰溪河两岸，以本地早米为原料，经浸磨、扎制、日晒等传统工艺制成。粉条约2-3毫米粗，色白如银、柔韧爽滑，久煮不烂，猛火快炒后根根分明，裹着酱香与鲜辣，带着独特发酵微香，是万载宴席与家常的经典主食。'
        },
        wanzaiDuoRou: {
          title: '万载剁肉',
          desc1: '万载经典家常小炒，传承百年风味，选用本地现宰黑猪肉前槽部位，手工剁制入味，肥瘦比例恰到好处。经热油煸炒，搭配本地鲜椒、蒜苗爆炒，色泽红亮诱人。入口鲜嫩多汁，鲜辣交织，蒜香与肉香浓郁回甘，下饭十足。承载着万载人的乡愁，是街头巷尾的热门美味，尽显赣湘融合的鲜辣特色。'
        },
        wanzaiFanYa: {
          title: '万载番鸭',
          desc1: '万载本土特色家禽美食，选用本地散养的黑番鸭，瘦肉率高、肉质紧实。可采用红烧、清炖或子姜焖制等多种做法，最宜焖煮入味，成品香气浓郁，肉质细嫩不柴，无丝毫膻味，汤汁醇厚绵长。搭配本地鲜姜、蒜苗调味，吸饱酱汁后鲜香味浓，是万载人宴客、过节的必备硬菜，藏着最地道的乡土烟火气。'
        },
        wanzaiBaiHe: {
          title: '万载百合',
          desc1: '万载特色药食同源美食，选用本地种植千年的龙牙百合，以肥厚无渣的鳞茎为原料，可清炒、蒸制或制成羹品。成品色泽洁白，口感清甜脆嫩，自带百合独有的鲜香，不苦不涩，淀粉含量丰富，营养醇厚。承载着吉祥美满的寓意，既是家常餐桌上的清爽佳肴，也是滋养身心的天然补品，尽显万载农耕风味。'
        },
        biaoXinZhi: {
          title: '表芯纸',
          desc1: '万载三大特产之一的表芯纸，宋时便是核心产地，清代达生产鼎盛。以本地毛竹为原料纯手工制作，成品色淡黄、纤维细长，质嫩性韧且厚薄均匀，兼具吸水性强、耐拉易燃的特点，古时为万载富源之本，如今仍远销湘鄂及东南亚，是祭祀、民俗多用的传统名纸。'
        },
        nanSuanZaoGao: {
          title: '南酸枣糕',
          desc1: '万载地理标志产品南酸枣糕，以当地深山野生南酸枣为原料，无添加色素与食用胶，经传统熬制与现代低温工艺制作。糕体呈琥珀色，柔韧不粘牙，酸中带甜且果香浓郁，富含植物黄酮、天然果胶等营养，口感纯滑，是老少皆宜的天然健康伴手礼。'
        }
      }
    },
    industry: {
      hero: {
        title: '烟花产业',
        subtitle: '中国花炮之乡的产业发展'
      },
      cta: {
        title: '体验烟花文化',
        desc: '来到万载，您可以参观烟花生产企业，了解烟花制作工艺，欣赏精彩的烟花表演，感受千年烟花文化的魅力。',
        cta: '查看赏烟地点'
      },
      sections: {
        history: {
          title: '历史传承',
          desc1: '万载烟花的历史可以追溯到唐代，盛于宋代，历经千年发展。据《万载县志》记载，清道光年间，万载烟花爆竹已经 "通行南北，商贾络绎"；光绪年间，当地 "男妇大小均借此以资工作"，产品销至广东、福建等省；清末民初，万载的烟花爆竹生产庄已有 400 余个，从业人员逾 3000 人，形成了产、供、销一条龙的产业体系。',
          desc2: '在近代，万载烟花也留下了辉煌的印记：1936 年 4 月，江西省举办运杭展览会，万载送去的 "同心茂""振生万" 爆竹均获浙赣特产联合会奖状；北京奥运会、上海世博会、首都国庆庆典等重要盛会，都闪耀着万载花炮的璀璨光影。'
        },
        currentStatus: {
          title: '产业现状',
          scale: '产业规模',
          scaleDesc1: '截至 2024 年，万载县共有花炮生产企业 170 家、贸易企业 86 家、上下游企业 200 余家，全县花炮总产值达到 233 亿元，2021-2023年连续三年保持 20% 以上增速。',
          scaleDesc2: '相关从业人员逾 15 万人，约占全县总人口的四分之一，每年为当地创造约 40 亿元工资性收入，贡献全县 30% 以上的财政收入，是名副其实的富民支柱产业。',
          market: '市场布局',
          marketDesc1: '万载花炮共有 4000 多个规格品种，涵盖鞭炮、玩具烟花、组合烟花等 9 大类（按传统用途分类），产品畅销全国及出口 40 多个主要国家和地区。',
          marketDesc2: '自 20 世纪 60 年代起，万载花炮便敲开了海外大门，如今出口产品包含 11 大类近千个种类，远销美洲、欧洲、东南亚等地区。2024 年，全县烟花出口额达 2.64 亿美元，同比增长 6.5%。',
          chartTitle: '万载花炮企业类型分布',
          chartProduction: '生产企业',
          chartTrade: '贸易企业',
          chartSupply: '上下游企业',
          chartUnit: '家',
          exportTitle: '万载花炮出口额趋势',
          exportLabel: '出口额',
          exportUnit: '亿美元',
          yearLabel: '年份'
        },
        techUpgrade: {
          title: '技术升级与创新',
          desc1: '近年来，万载县委、县政府树牢 "安全是基础、发展是目的、品牌是方向" 的理念，坚持花炮产业 "一个不动摇、三个更" 工作思路，深入推进花炮产业转型升级。',
          desc2: '经过多轮国标整改提升，万载花炮产业的生产自动化、智能化水平显著提升，产品安全性能更有保障。当地企业不断探索创新，比如万载县汇鑫源礼花制造有限公司作为国家高新技术专精特新企业，研制出行业领先的安全环保的无钾无硫礼花弹技术，成为全球迪士尼乐园与环球影城的主要供应商，2024 年出口额达 6000 多万元。',
          desc3: '2024 年，万载县花炮产业集群入选江西省中小企业特色产业集群，形成了集原材料生产到半成品加工、成品生产、运输包装、会展培训、检测评价、研发燃放等较为完善的产业链。'
        },
        cultureTourism: {
          title: '文旅融合',
          desc1: '万载以千年花炮技艺为钥，首创 "烟花 + 古城" 模式，将烟花文化与文旅产业深度融合，打造了独具特色的文旅品牌"焰火之吻"。',
          desc2: '万载古城景区作为国家 AAAA 级旅游景区，以全国最大的赣派多姓氏古祠堂集群为基础，植入焰火表演等当地特色文化，形成了 "每周六来万载看烟花" 等文旅品牌 IP。',
          desc3: '万载古城成功入选首批 "国家级夜间文旅消费集聚区"，其 "烟花与文化旅游产业融合发展夜游经济" 入选全国文化遗产旅游百强案例。2024 年上半年，万载全县接待游客 1011.8 万人次，实现旅游综合收入 74.97 亿元，同比分别增长 24.9%、24%。'
        },
        future: {
          title: '未来展望',
          desc1: '面向未来，万载将继续聚焦花炮产业的高质量发展，一方面借助 "一带一路" 政策加强与沿线国家的贸易合作，拓展海外市场，加快烟花爆竹产业外贸转型升级；另一方面，持续推动技术创新和产业升级，打造更多高端烟花产品，同时深化文旅融合，让千年焰火在新时代绽放出更加璀璨的光彩。',
          desc2: '万载正聚力打造名副其实的 "中国花炮之乡"，通过产业升级、文化传承和文旅融合，实现烟花产业的可持续发展，为当地经济社会发展注入新的动力。'
        }
      }
    },
    routes: {
      hero: {
        title: '旅游线路',
        subtitle: '精选万载旅游路线'
      },
      cta: {
        title: '开始您的万载之旅',
        desc: '选择适合您的旅游线路，体验万载的千年文化、自然风光和红色根基。',
        cta: '查看赏烟地点'
      },
      routes: {
        ancient: '古城文化之旅',
        ancientMorning: '上午：抵达万载，游览万载古城，参观古祠堂群、历史文化馆、宗祠文化馆、国学文化馆',
        ancientNoon: '中午：在万载厨房（古城店）品尝万载特色美食',
        ancientAfternoon: '下午：体验夏布织造技艺，观看得胜鼓表演',
        ancientEvening: '晚上：观看"焰火之吻"烟花秀，品尝万载夜市美食',
        mountain: '山水文化之旅',
        mountainMorning: '上午：游览竹山洞景区、万载恒晖艺术农业景区',
        mountainNoon: '中午：品尝农家菜，品尝万载味道',
        mountainAfternoon: '下午：游览九龙原始森林，在漂流中感受自然风光',
        mountainEvening: '晚上：在龙湖公园看花炮文化节，感受夜幕下坠落的"流星"',
        red: '红色文化之旅',
        redMorning: '上午：参观湘鄂赣革命纪念馆，万载革命烈士纪念馆',
        redNoon: '中午：体验红军餐，感受先辈精神',
        redAfternoon: '下午：参观仙源湘鄂赣革命根据地旧址群，重走红军小道',
        redEvening: '晚上：欣赏非遗展演，观看烟花秀，品尝万载特色美食'
      }
    },
    viewingSpots: {
      hero: {
        title: '赏烟地点',
        subtitle: '最佳烟花观赏地点推荐'
      },
      cta: {
        title: '寻找最佳赏烟地点',
        desc: '查看万载地图，发现更多赏烟地点和万载美景。',
        cta: '查看地图导览'
      },
      spots: {
        ancientCity: '万载古城',
        ancientCityDesc1: '万载古城是最佳的烟花观赏地点之一，每周六晚8:00准时上演"焰火之吻"免费烟花秀，时长30分钟。古城的青石板路、马头墙与璀璨烟花交相辉映，构成了一幅美丽的画卷。',
        ancientCityViewing: '绿阴广场、沿河长廊、古城观景台',
        ancientCityTransport: '位于万载县城中心，可乘坐公交或出租车抵达',
        longhuPark: '龙湖公园',
        longhuParkDesc1: '龙湖公园是万载县城的城市公园，湖面宽阔，视野开阔，是观赏烟花的理想场所。烟花在湖面的倒影更加美丽动人，给人以双重的视觉享受。',
        longhuParkViewing: '湖边栈道、湖心亭、湖畔公园',
        longhuParkTransport: '位于万载县城西南部，可乘坐公交或出租车抵达',
        bestViewing: '最佳观赏位置',
        transportation: '交通'
      },
      tips: {
        title: '观赏小贴士',
        bestTime: '最佳观赏时间',
        time1: '每周六晚8:00-8:30（万载古城烟花秀）',
        time2: '重要节假日（如春节、元宵节、国庆节）或花炮文化节',
        time3: '夏季的夜晚（天气凉爽，适合户外活动）',
        time4: '春秋季节（气候宜人，景色优美）',
        time5: '下雪的冬季，看烟花和舞蹈的雪花',
        notice: '注意事项',
        notice1: '提前到达观赏地点，占据有利位置',
        notice2: '注意安全，远离烟花发射点，选择开阔地带',
        notice3: '保护环境，不要随意丢弃垃圾',
        notice4: '遵守现场秩序，听从工作人员指挥',
        notice5: '带好相机或手机，记录美丽瞬间'
      }
    },
    merchant: {
      hero: {
        title: '商家展示',
        subtitle: '发现万载优质商家和企业'
      },
      sections: {
        featured: {
          title: '推荐商家',
          products: '核心产品/服务',
          advantages: '特色优势',
          contact: '联系方式'
        },
        reviews: {
          title: '用户评价'
        }
      },
      cta: {
        title: '开启您的万载之旅',
        desc: '选择心仪的商家，体验万载烟花文化的魅力。'
      },
      merchants: {
        caiTian: {
          name: '彩天艺术焰火',
          category: '艺术燃放',
          description: '万载县彩天烟花艺术燃放制作有限公司是国内烟花行业兼具顶级生产制造能力与专业艺术燃放实力的标杆企业，以"烟花文旅演艺创意开拓者"为发展目标。',
          products: ['艺术焰火燃放', '文旅演艺策划', '烟花文创产品'],
          advantages: ['国家甲级焰火燃放资质', '迪士尼/环球影城供应商', '专业燃放团队30+年经验'],
          address: '江西省宜春市万载县三兴镇工业园',
          phone: '159 0947 0166'
        },
        qianNian: {
          name: '江西万载千年食品有限公司',
          category: '食品加工',
          description: '江西万载千年食品有限公司是万载县食品加工行业的龙头企业，成立于2001年，专注江西传统特色食品研发生产，拥有1400多年历史传承。',
          products: ['南酸枣糕', '葛制品', '百合制品'],
          advantages: ['中国驰著名商标', '农业产业化省级龙头企业', '江西省著名品牌'],
          address: '江西省宜春市万载县工业园B区1号',
          phone: '400-6789-228'
        },
        tailin: {
          name: '泰麟花炮',
          category: '鞭炮制造',
          description: '泰麟花炮坐落于世界花炮金三角的核心重镇——万载县双桥镇，以"精品小排炮"为承诺，20余年专注烟火制造。公司占地428亩，五区协调生产，产品涵盖百余种规格，精准匹配不同市场需求。',
          products: ['5.5小排炮', '6.0小排炮', '7.0小子炮'],
          advantages: ['中国花炮百强企业', '万载花炮十星企业', '机械智能化+传承老工艺'],
          address: '江西省万载县双桥镇柏树村（万上公路31公桩旁）',
          phone: '0795-8411566'
        }
      },
      reviews: {
        zhang: {
          author: '张先生',
          content: '彩天艺术焰火的焰火表演效果非常震撼，创意十足！作为合作方，对他们的专业水准和无钾无硫环保技术印象深刻，强烈推荐！',
          date: '2026-2-26'
        },
        wang: {
          author: '王先生',
          content: '千年公司的南酸枣糕口感非常好，天然酸甜，风味独特。葛粉和百合粉品质也很不错，值得推荐！',
          date: '2025-12-08'
        },
        li: {
          author: '李先生',
          content: '泰麟花炮的鞭炮声音清脆响亮，品质非常好！而且公司规模大、资质全，是值得信赖的合作伙伴。',
          date: '2026-02-20'
        }
      }
    },
    map: {
      hero: {
        title: '地图导览',
        subtitle: '探索万载，发现美景'
      }
    },
    footer: {
      about: '关于焰境·万载',
      aboutDesc: '焰境·万载是一个展示江西省万载县烟花文化、非遗传承、美食特产和旅游风光的现代化文旅展示网站。',
      quickLinks: '快速链接',
      friendLinks: '友情链接',
      contact: '联系我们',
      wechatAccounts: '微信二维码',
      customerGroup: '焰境万载客户交流群',
      copyright: 'Copyright © ',
      wanzaiGov: '万载县人民政府官网',
      wanzaiGovLink: 'http://www.wanzai.gov.cn/',
      wanzaiDouyin: '万载发布抖音号',
      chinaFireworks: '中国烟花爆竹协会官网',
      wechatGov: '万载人民政府微信公众号',
      wechatWenlv: '万载文旅微信公众号',
      github: '焰境·万载 GitHub 仓库',
      gitee: '焰境·万载 Gitee 仓库',
      officialDouyin: '焰境·万载官方抖音',
      officialWechat: '焰境·万载官方公众号',
      allRightsReserved: '保留所有权利。',
      icp: '赣ICP备2026003337号-1',
      police: '京公网安备11010802047642号'
    },
    musicPlayer: {
      title: '有一个地方叫万载',
      artist: '左湖海音乐室 - 有一个地方叫万载',
      theme: '万载旅游主题曲',
      play: '播放',
      pause: '暂停',
      playPause: '播放/暂停'
    },
    common: {
      learnMore: '了解更多',
      viewRoutes: '查看旅游线路',
      startJourney: '开始您的万载之旅',
      loading: '加载中...',
      error: '加载失败',
      retry: '重新加载',
      videoNotSupported: '您的浏览器不支持视频播放。',
      videoLoadFailed: '视频加载失败',
      videoHint: '视频播放可能消耗较多流量，请尽量在WiFi环境下播放'
    },
    firework: {
      title: '数字烟花体验',
      loading: '加载中',
      loadingStatus: '正在装配烟花',
      initializing: '正在初始化',
      settings: '设置',
      settingsHint: '若想了解更多信息 请点击任意标签',
      shellType: '烟花类型',
      shellSize: '烟花大小',
      quality: '画质',
      qualityLow: '低',
      qualityMedium: '中',
      qualityHigh: '高',
      skyLighting: '照亮天空',
      skyLightingNone: '不',
      skyLightingDim: '暗',
      skyLightingNormal: '正常',
      autoLaunch: '自动放烟花',
      finaleMode: '同时放更多的烟花',
      fullscreen: '全屏',
      back: '返回',
      background: '背景图片',
      bgDefault: '万载古城烟花',
      bgShootingStars: '流星烟花',
      bgMoonUniverse: '月空宇宙',
      bgMountains: '山峦',
      bgNone: '无背景',
      backgroundImage: '背景图片',
      removeBackground: '移除背景',
      types: {
        random: '随机',
        crackle: '噼啪',
        crossette: '十字',
        crysanthemum: '牡丹',
        fallingLeaves: '落叶',
        floral: '花式',
        ghost: '幽灵',
        horseTail: '马尾',
        palm: '棕榈',
        ring: '圆环',
        strobe: '频闪',
        willow: '柳'
      }
    },
    aiChat: {
      title: '万载AI助手',
      subtitle: '智能文旅问答',
      welcome: '您好！我是万载文旅AI助手，可以为您介绍烟花文化、美食特产、旅游线路等信息。有什么想了解的吗？',
      placeholder: '请输入您的问题...',
      quickQ1: '万载有什么好吃的？',
      quickQ2: '烟花表演时间？',
      quickQ3: '推荐旅游路线',
      thinking: '正在思考...',
      error: '抱歉，服务暂时不可用',
      networkError: '网络连接失败，请稍后再试'
    },
    about: {
      hero: {
        title: '关于我们',
        subtitle: '焰境·万载团队介绍'
      },
      sections: {
        team: {
          title: '我们的团队',
          members: {
            member1: {
              name: '林雨晴',
              role: '项目负责人',
              description: '统筹全局战略规划与团队协作，协调各方资源整合，确保项目高效推进与核心目标的精准达成。'
            },
            member2: {
              name: '陈浩然',
              role: '技术架构师',
              description: '主导网站全栈开发与系统架构设计，运用前沿技术栈构建高性能平台，打造流畅的用户交互体验。'
            },
            member3: {
              name: '周雅琪',
              role: '品牌运营总监',
              description: '统筹新媒体矩阵运营与品牌传播策略，策划创意内容营销，持续提升平台影响力与用户触达率。'
            },
            member4: {
              name: '苏婉婷',
              role: '视频创意总监',
              description: '主导视觉内容的策划与制作，运用影像艺术语言生动展现万载烟花文化的独特魅力与深厚底蕴。'
            },
            member5: {
              name: '刘思颖',
              role: '内容战略总监',
              description: '制定平台内容规划与项目方案撰写，深度挖掘文化价值内涵，输出专业文案与品牌叙事体系。'
            },
            member6: {
              name: 'Claude AI',
              role: '智能赋能助手',
              description: '基于前沿人工智能技术，为团队提供智能创作支持与效率赋能，协助内容生成、技术优化与创意策划，推动项目数字化转型与智能化升级。'
            }
          }
        },
        background: {
          title: '项目背景',
          originTitle: '创立初衷',
          originDesc: '焰境·万载由一群热爱家乡文化的北京高校在读生发起，我们希望通过现代技术手段，让更多人了解万载这座拥有千年烟花文化的小城。',
          goalTitle: '推广目标',
          goalDesc: '我们的目标是用AI技术赋能万载文旅，通过互联网传播万载的独特魅力，吸引更多游客前来体验花炮之乡的璀璨风情，同时助力当地文旅产业高质量发展。'
        },
        mission: {
          title: '使命与愿景',
          missionTitle: '我们的使命',
          missionDesc: '传承与弘扬万载千年烟花文化，让每一位访客都能感受到这座城市的热情与魅力。我们致力于打造最全面的万载文旅信息平台，让游客轻松规划行程，深度体验当地文化。',
          visionTitle: '我们的愿景',
          visionDesc: '成为万载文旅数字化转型和新媒体矩阵构建的标杆，与当地企业、政府部门紧密合作，让"焰境·万载"成为国内外游客了解万载的重要入口。未来，我们计划将这一发展路径从万载推广开来，打造成为县域经济实现破局发展的关键方案。'
        },
        timeline: {
          title: '发展历程',
          events: {
            event1: {
              date: '2025年12月',
              title: '项目启动',
              description: '团队正式组建，完成项目可行性分析与市场调研，确立平台定位与发展战略，启动技术研发准备工作。'
            },
            event2: {
              date: '2026年1-2月',
              title: '产品研发',
              description: '完成平台原型设计与核心功能开发，采用Vue 3 + Tailwind CSS前沿技术栈，构建高性能用户体验框架，实现非遗文化、美食特产等核心模块上线。'
            },
            event3: {
              date: '2026年2月末',
              title: '正式发布',
              description: '平台正式上线运营，面向公众开放访问，完成首轮用户测试与功能优化，确立品牌形象与市场定位。'
            },
            event4: {
              date: '2026年4月',
              title: '品牌运营',
              description: '启动新媒体矩阵运营战略，构建微信公众号、抖音等多元化宣传渠道，持续拓展用户触达路径，提升平台品牌影响力。'
            }
          }
        },
        partners: {
          title: '合作伙伴',
          list: {
            partner1: {
              name: '万载县文旅局'
            },
            partner2: {
              name: '万载古城景区'
            },
            partner3: {
              name: '彩天艺术焰火'
            },
            partner4: {
              name: '泰麟花炮'
            }
          }
        },
        contact: {
          title: '联系我们',
          emailLabel: '电子邮箱',
          email: "{'whizzzest@outlook.com'}",
          douyinLabel: '官方抖音',
          douyin: '焰境·万载',
          wechatLabel: '微信公众号',
          wechat: '云上万载-焰遇乡旅',
          videoLabel: '微信视频号',
          video: '焰境·万载',
          xiaohongshuLabel: '小红书',
          xiaohongshu: '焰境·万载',
          serviceLabel: '在线咨询',
          service: '企业客服'
        }
      }
    }
  },
  'en': {
    siteName: 'WhizzZest',
    nav: {
      home: 'Home',
      culture: 'Culture',
      food: 'Food & Specialties',
      industry: 'Fireworks Industry',
      routes: 'Travel Routes',
      viewingSpots: 'Viewing Spots',
      map: 'Map',
      merchant: 'Merchants',
      about: 'About Us'
    },
    home: {
      hero: {
        title: 'Once We Meet, It\'s Wanzai Forever',
        subtitle: 'Explore the thousand-year fireworks culture, experience intangible heritage charm, taste local delicacies, and enjoy Wanzai scenery',
        cta: 'View Travel Routes'
      },
      features: {
        title: 'Core Features',
        fireworks: {
          title: 'Millennium Fireworks Culture',
          desc: 'Wanzai has over 1400 years of fireworks production history, known as the "Hometown of Chinese Fireworks".'
        },
        food: {
          title: 'Special Local Delicacies',
          desc: 'Taste Wanzai\'s Six Big Bowls, Lily, Luocheng Rice Noodles and more, experiencing the unique culinary culture of western Jiangxi.'
        },
        tourism: {
          title: 'Rich Tourism Resources',
          desc: 'Wanzai Ancient City, Zhushan Cave, Jiulong Primitive Forest and many more attractions, catering to different tourist needs.'
        }
      },
      culture: {
        title: 'Intangible Heritage',
        desc: 'Wanzai boasts rich intangible cultural heritage, including Wanzai Fireworks, Desheng Drum, Kai Kou Nuo, and Xia Bu weaving. These traditional cultural treasures carry the wisdom and creativity of Wanzai people.',
        learnMore: 'Learn More'
      },
      food: {
        title: 'Food & Specialties',
        desc: 'Wanzai cuisine is famous for its unique flavors and crafting techniques. The Six Big Bowls, Wanzai Chopped Meat, Luocheng Rice Noodles, as well as lily powder and south wild jujube cake, are all must-try delicacies.',
        learnMore: 'Learn More'
      },
      industry: {
        title: 'Fireworks Industry',
        desc: 'As one of the four major fireworks production areas in China, Wanzai has a long history and advanced technology in fireworks industry. In recent years, Wanzai\'s fireworks industry has continuously upgraded and transformed, with products selling globally.',
        learnMore: 'Learn More'
      },
      cta: {
        title: 'Start Your Wanzai Journey',
        desc: 'Whether you want to experience the millennium fireworks culture, taste local delicacies, or enjoy natural scenery, Wanzai has something for everyone.',
        viewRoutes: 'View Travel Routes'
      },
      firework: {
        title: 'Digital Firework Experience',
        desc: 'Experience the brilliance and romance of Wanzai fireworks right on your screen. Click to enter and unleash your fireworks!',
        feature1: 'Multiple firework types',
        feature2: 'Realistic effects',
        feature3: 'Sound and fullscreen support',
        cta: 'Enter Digital Fireworks',
        types: 'Types',
        effects: 'Effects',
        sound: 'Sound',
        interactive: 'Interactive'
      }
    },
    breadcrumb: {
      home: 'Home',
      culture: 'Culture',
      food: 'Food & Specialties',
      industry: 'Fireworks Industry',
      routes: 'Travel Routes',
      viewingSpots: 'Viewing Spots',
      map: 'Map',
      merchant: 'Merchants'
    },
    culture: {
      hero: {
        title: 'Intangible Heritage',
        subtitle: 'Explore Wanzai\'s Millennium Cultural Heritage'
      },
      cta: {
        title: 'Experience Intangible Heritage',
        desc: 'Come to Wanzai and experience the charm of these intangible cultural heritages, feeling the inheritance and innovation of millennium culture.'
      },
      sections: {
        fireworks: {
          title: 'Wanzai Fireworks',
          desc1: 'Wanzai fireworks making technique was selected into the first batch of National Intangible Cultural Heritage extended project list in June 2008. Wanzai fireworks are famous worldwide for their good sound, high success rate, and pleasant fragrance. From the initial single sound effects, they have developed to comprehensive modeling applications including sound, color, smoke, fragrance, and flowers.',
          desc2: 'The history of Wanzai fireworks can be traced back to the Tang Dynasty, flourishing in the Song Dynasty, and developing over a thousand years. During the Daoguang period of the Qing Dynasty, Wanzai fireworks had already "circulated throughout the north and south, with merchants constantly coming and going"; during the Guangxu period, local "men and women of all ages relied on this for work", with high-quality and affordable products sold to Guangdong, Fujian and other provinces.',
          desc3: 'Today, Wanzai fireworks have over 4000 specifications and varieties, covering 9 major categories including firecrackers, toy fireworks, and assembled fireworks. Products sell well throughout China and are exported to more than 40 countries and regions in Europe, America, and Southeast Asia.'
        },
        deshenggu: {
          title: 'Desheng Drum',
          desc1: 'Desheng Drum is a traditional folk drum music in Wanzai County, originating from the Northern Song Dynasty, mainly based on historical events of the Tang Dynasty\'s pacification of the "An Lushan Rebellion". Desheng Drum is famous for its vigorous and passionate atmosphere, uniform rhythm, and colorful performance forms.',
          desc2: 'Desheng Drum performances usually consist of dozens of performers, using instruments such as big drums, small drums, suona, gongs, and cymbals. The performance features diverse formations and crisp drum rhythms, fully showcasing the heroic spirit and unity of Wanzai people.',
          desc3: 'Today, Desheng Drum has become an important cultural brand in Wanzai County, often performed at various cultural activities and festival celebrations, deeply loved by the public.'
        },
        kaiKouNuo: {
          title: 'Wanzai Kai Kou Nuo',
          desc1: 'Wanzai Kai Kou Nuo, also known as "Tiao Xiao", is a distinctive folk cultural activity for exorcising ghosts, seeking blessings and safety, and entertaining gods and people. It originated in the late Yuan and early Ming Dynasty, with a history of over 600 years.',
          desc2: 'Different from other Nuo dance forms, Kai Kou Nuo requires singing for every character, including singing, acting, reciting, and fighting, but mainly singing. The music runs through with percussion, preserving a simple rural flavor.',
          desc3: 'In June 2008, "Wanzai Kai Kou Nuo" was selected into the second batch of National Intangible Cultural Heritage list.'
        },
        xiaBu: {
          title: 'Xia Bu Weaving',
          desc1: 'Xia Bu weaving technique is a traditional handicraft in Wanzai County, with production tracing back to the late Eastern Jin Dynasty, having a history of over 1600 years. In 2009, Wanzai Xia Bu weaving technique was listed in the third batch of National Intangible Cultural Heritage.',
          desc2: 'Wanzai Xia Bu uses ramie as raw material, going through four processes: warp sizing, mounting, and weaving. Xia Bu is light, breathable, and highly absorbent, making it an ideal summer clothing fabric.',
          desc3: 'Today, Wanzai Xia Bu has become a specialty product of Jiangxi Province, sold domestically and overseas, deeply loved by consumers.'
        },
        zhiPeng: {
          title: 'Zhipeng Folk Songs',
          desc1: 'Zhipeng Folk Songs are traditional folk music in Wanzai County, originating from the Ming Dynasty, with a history of over 500 years. They are songs created by paper-making workers during labor, with rich content and diverse forms.',
          desc2: 'The songs revolve around paper-making processes such as bamboo collecting, retting, and drying, blending themes of labor hardships, romantic love, and harvest expectations. The melodies are beautiful, with lively rhythms, and have a rich local flavor.',
          desc3: 'In March 2007, Zhipeng Folk Songs were listed in the Jiangxi Province Intangible Cultural Heritage list, becoming one of the important cultural heritages of Wanzai County.'
        }
      }
    },
    food: {
      hero: {
        title: 'Food & Specialties',
        subtitle: 'Taste Wanzai Local Delicacies'
      },
      cta: {
        title: 'Taste Delicacies & Buy Specialties',
        desc: 'When you come to Wanzai, you can taste authentic Wanzai specialty food, buy traditional Wanzai specialties, and take away wonderful memories.',
        cta: 'View Food Travel Routes'
      },
      sections: {
        liuDaWan: {
          title: 'Wanzai Six Big Bowls',
          titleEn: 'Wanzai Six Big Bowls',
          desc: 'Wanzai "Six Big Bowls" are the essence of traditional Wanzai banquets, carrying the traditional culture of hospitality.'
        },
        otherFood: {
          title: 'Other Delicacies',
          titleEn: 'Other Delicacies'
        },
        special: {
          title: 'Special Dishes',
          desc: 'Traditional dishes like Wanzai Chopped Meat, Luocheng Rice Noodles, as well as lily powder and south wild jujube cake, are all must-try delicacies.'
        },
        traditionalSpecialties: {
          title: 'Traditional Specialties',
          titleEn: 'Traditional Specialties'
        },
        fuGuiYouJuan: {
          title: 'Fu Gui You Juan',
          desc1: 'The first dish of Wanzai Six Big Bowls, also known as "Eight Treasure Oil Roll", is the highest courtesy for treating guests in Wanzai. Made with pork, pork caul fat, dried bamboo shoots, water chestnuts and other eight ingredients, wrapped in pork caul fat and steamed. The outer skin is soft and slightly crispy, the filling is fragrant and rich, with rich layers of texture. Carrying the beautiful meaning of wealth and prosperity, it is an indispensable opening dish in Wanzai banquets, holding the locals\' enthusiasm and expectations.'
        },
        wanzaiZhaRou: {
          title: 'Wanzai Zha Rou',
          desc1: 'A traditional dish originating from the late Ming and early Qing dynasties, similar to Yichun braised pork but with unique Wanzai characteristics. Made with quality pork belly through multiple processes including marinating, deep frying, and steaming, with a shiny red color and oily luster. The meat is fatty but not greasy, lean but not tough, mellow and soft, melting in your mouth. Each bite is filled with rich sauce aroma and fat fragrance. Symbolizing a prosperous life and vibrant festivities, it is an essential dish for celebrating in Wanzai banquets.'
        },
        wanzaiZhaRou2: {
          title: 'Wanzai Zha Rou (Rice)',
          desc1: 'A distinctive Wanzai dish that "uses rice instead of meat", breaking the boundary between staple food and main courses. Made with local rice flour and fresh pork through traditional techniques like mixing and steaming. Although not containing large amounts of fresh meat, it is full of meat flavor. The texture is soft and chewy, salty and flavorful, absorbing the essence of meat juice and seasonings, not oily or greasy, suitable for all ages. Symbolizing abundant harvests and prosperity, it is a specialty delicacy etched with Wanzai\'s farming culture.'
        },
        wanzaiKuaiYu: {
          title: 'Wanzai Fish Cubes',
          desc1: 'Fresh grass carp from Wanzai is cut into evenly sized cubes, marinated with fermented rice wine and salt, then deep-fried until golden and steamed. The outer skin is slightly crispy while the inside is tender and smooth, fragrant and flavorful, with soft fish bones that can be eaten. The golden color is appealing, with rich layers of taste. The mellow fragrance of fermented rice wine neutralizes the fishy taste, adding more flavor. Symbolizing smooth sailing and abundance, it is a classic fish dish with beautiful meanings in banquets.'
        },
        kangLeSanHuangJi: {
          title: 'Kangle Sanhuang Chicken',
          desc1: 'Locally raised Kangle Sanhuang chickens in Wanzai, known for their distinctive yellow feathers, yellow claws, and yellow beaks. Using traditional clear stewing method without excessive seasonings to preserve the original chicken flavor. The soup is clear and bright, the meat is tender and firm, the skin is smooth but not greasy, fragrant and delicious, with rich nutrition. Symbolizing good luck and everything as you wish, it is not only a main dish in banquets but also a nourishing delicacy, showcasing Wanzai\'s local flavors.'
        },
        qingDunHeiShanYang: {
          title: 'Stewed Black Goat',
          desc1: 'A nourishing dish among Wanzai Six Big Bowls, made with local quality black goat meat, slowly clear-stewed. The soup is clear and transparent, without any gamey taste, the meat is tender and not tough, fragrant and mellow, melting in your mouth. Rich in protein and various minerals, it is a traditional tonic for Wanzai people during the winter solstice. Carrying the auspicious meaning of three-yang prosperity and continuous good luck, every bite is a gift from nature, warming both body and heart.'
        },
        luoChenZhaFen: {
          title: 'Luochen Rice Noodles',
          desc1: 'Luochen Zha Fen is a provincial intangible cultural heritage food in Wanzai, originating from the banks of Taixi River during the Ming Dynasty. Made with local early rice through traditional processes including soaking, grinding, tying, and sun-drying. The noodles are about 2-3mm thick, white as silver, flexible and smooth, not easily broken after long cooking. After quick frying over high heat, each strand is distinct, wrapped in sauce fragrance and fresh spiciness, with a unique fermented aroma. It is a classic staple in Wanzai banquets and home cooking.'
        },
        wanzaiDuoRou: {
          title: 'Wanzai Chopped Meat',
          desc1: 'A classic Wanzai home-style stir-fry, inheriting a hundred years of flavor. Using freshly slaughtered local black pig\'s front lean meat, hand-chopped and marinated with just the right fat-to-lean ratio. Stir-fried in hot oil with local fresh peppers and garlic sprouts, the dish has an attractive red color. Tender and juicy with a perfect blend of spiciness, the fragrance of garlic and meat lingers, perfect with rice. Carrying the nostalgia of Wanzai people, it is a popular street food, showcasing the spicy characteristics of the Jiangxi-Hunan fusion.'
        },
        wanzaiFanYa: {
          title: 'Wanzai Muscovy Duck',
          desc1: 'A local specialty poultry dish in Wanzai, using locally free-range black Muscovy ducks with high lean meat rate and firm texture. Can be prepared in various ways such as braising, clear stewing, or ginger stewing. Best when simmered to absorb flavors, the finished product has rich aroma, tender meat without being tough, no gamey taste, and long-lasting rich broth. Cooked with local fresh ginger and garlic sprouts, absorbing the sauce becomes very fragrant. It is an essential dish for hosting guests and festivals, holding the most authentic local fire and smoke flavor.'
        },
        wanzaiBaiHe: {
          title: 'Wanzai Lily',
          desc1: 'A specialty food-medicine homologous delicacy in Wanzai, using local Longya lilies that have been cultivated for a thousand years, with thick and residue-free bulbs as ingredients. Can be stir-fried, steamed, or made into soup. The finished product is white in color, with a sweet and crisp taste, carrying the unique freshness of lily, not bitter or astringent, rich in starch and nutritious. Carrying the meaning of auspiciousness and happiness, it is not only a refreshing dish on family tables but also a natural tonic for health, showcasing Wanzai\'s farming flavor.'
        },
        biaoXinZhi: {
          title: 'Biaoxin Paper',
          desc1: 'One of Wanzai\'s three specialty papers, with core production dating back to the Song Dynasty and reaching its peak in the Qing Dynasty. Made from local bamboo through pure handcrafting, the finished product has a light yellow color, long and fine fibers, tender yet tough and evenly thick, with strong water absorption, tensile strength, and flammability. It was the foundation of Wanzai\'s wealth in ancient times and is still exported to Hunan, Hubei, and Southeast Asia. It is a traditional paper widely used for sacrifices and folk customs.'
        },
        nanSuanZaoGao: {
          title: 'South Wild Jujube Cake',
          desc1: 'A geographical indication product of Wanzai, made from wild south wild jujube from local deep mountains, without added pigments or food gelatin, through traditional boiling and modern low-temperature processes. The cake is amber-colored, chewy but not sticky, sweet with sour and rich fruit fragrance, rich in plant flavonoids and natural pectin. The texture is smooth, making it a natural and healthy gift suitable for all ages.'
        }
      }
    },
    industry: {
      hero: {
        title: 'Fireworks Industry',
        subtitle: 'Development of China\'s Hometown of Fireworks'
      },
      cta: {
        title: 'Experience Fireworks Culture',
        desc: 'When you come to Wanzai, you can visit fireworks production companies, learn about fireworks making techniques, enjoy spectacular fireworks displays, and feel the charm of millennium fireworks culture.',
        cta: 'View Viewing Spots'
      },
      sections: {
        history: {
          title: 'Historical Heritage',
          desc1: 'The history of Wanzai fireworks can be traced back to the Tang Dynasty, flourishing in the Song Dynasty, and developing over a thousand years. According to "Wanzai County Annals", during the Daoguang period of the Qing Dynasty, Wanzai fireworks had already "circulated throughout the north and south, with merchants constantly coming and going"; during the Guangxu period, local "men and women of all ages relied on this for work", with products sold to Guangdong, Fujian and other provinces; by the late Qing and early Republic period, Wanzai had over 400 fireworks production workshops with more than 3,000 employees, forming an integrated industry system of production, supply, and marketing.',
          desc2: 'In modern times, Wanzai fireworks have also left a glorious mark: In April 1936, Jiangxi Province held the Hangzhou Transportation Exhibition, where Wanzai\'s "Tongxinmao" and "Zhenshengwan" firecrackers both received awards from the Zhejiang-Jiangxi Special Products Association; major events such as the Beijing Olympics, Shanghai World Expo, and National Day celebrations have all featured the brilliant light of Wanzai fireworks.'
        },
        currentStatus: {
          title: 'Industry Status',
          scale: 'Industry Scale',
          scaleDesc1: 'As of 2024, Wanzai County has 170 fireworks production enterprises, 86 trading enterprises, and over 200 upstream and downstream enterprises. The total fireworks output value reaches 23.3 billion yuan, maintaining a growth rate of over 20% for three consecutive years from 2021 to 2023.',
          scaleDesc2: 'More than 150,000 people are employed in related industries, accounting for about a quarter of the county\'s total population. It creates about 4 billion yuan in wage income annually and contributes over 30% of the county\'s fiscal revenue, making it a truly prosperous pillar industry.',
          market: 'Market Distribution',
          marketDesc1: 'Wanzai fireworks have over 4,000 specifications and varieties, covering 9 major categories including firecrackers, toy fireworks, and assembled fireworks (by traditional use classification). Products sell well throughout China and are exported to more than 40 major countries and regions.',
          marketDesc2: 'Since the 1960s, Wanzai fireworks have opened the overseas market. Today, export products include nearly 1,000 varieties in 11 major categories, sold to America, Europe, Southeast Asia and other regions. In 2024, the county\'s fireworks export reached 264 million USD, a year-on-year increase of 6.5%.',
          chartTitle: 'Wanzai Fireworks Enterprise Type Distribution',
          chartProduction: 'Production',
          chartTrade: 'Trading',
          chartSupply: 'Supply Chain',
          chartUnit: ' enterprises',
          exportTitle: 'Wanzai Fireworks Export Trend',
          exportLabel: 'Export',
          exportUnit: ' hundred million USD',
          yearLabel: 'Year'
        },
        techUpgrade: {
          title: 'Technology Upgrade & Innovation',
          desc1: 'In recent years, the Wanzai County Committee and Government have firmly established the concept that "safety is the foundation, development is the goal, and brand is the direction", adhering to the fireworks industry work philosophy of "one unwavering commitment, three improvements", and deeply promoting the transformation and upgrading of the fireworks industry.',
          desc2: 'After multiple rounds of national standard improvements, Wanzai\'s fireworks industry production automation and intelligent level have significantly improved, and product safety performance is more guaranteed. Local enterprises continue to explore innovation. For example, Wanzai Huixinyuan Fireworks Manufacturing Co., Ltd., as a national high-tech specialized enterprise, has developed industry-leading safe and environmentally friendly potassium-free and sulfur-free fireworks technology, becoming the main supplier for Disney Parks and Universal Studios worldwide, with exports reaching over 60 million yuan in 2024.',
          desc3: 'In 2024, Wanzai\'s fireworks industry cluster was selected into Jiangxi Province\'s SME characteristic industry cluster, forming a relatively complete industrial chain from raw material production to semi-finished product processing, finished product production, transportation and packaging, exhibition and training, testing and evaluation, and R&D and fireworks display.'
        },
        cultureTourism: {
          title: 'Cultural Tourism Integration',
          desc1: 'Wanzai, using millennium fireworks technology as the key, pioneered the "fireworks + ancient city" model, deeply integrating fireworks culture with cultural tourism industry, creating a unique cultural tourism brand "Kiss of Fire".',
          desc2: 'Wanzai Ancient City, as a national AAAA-level tourist attraction, is based on the largest cluster of Gan-style ancient clan halls in China, embedding local characteristic cultures such as fireworks performances, forming cultural tourism brand IPs like "Come to Wanzai to watch fireworks every Saturday".',
          desc3: 'Wanzai Ancient City was successfully selected into the first batch of "National Night Cultural Tourism Consumption Aggregation Areas", and its "fireworks and cultural tourism industry integrated night economy development" was selected into the Top 100 Cultural Heritage Tourism Cases in China. In the first half of 2024, Wanzai received 10.118 million tourists, achieving a comprehensive tourism revenue of 7.497 billion yuan, a year-on-year increase of 24.9% and 24% respectively.'
        },
        future: {
          title: 'Future Outlook',
          desc1: 'Looking forward, Wanzai will continue to focus on high-quality development of the fireworks industry. On one hand, it will strengthen trade cooperation with countries along the "Belt and Road" policy, expand overseas markets, and accelerate the transformation and upgrading of the fireworks industry\'s foreign trade; on the other hand, it will continue to promote technological innovation and industry upgrading, create more high-end fireworks products, while deepening cultural tourism integration, allowing the millennium fireworks to bloom even more brilliantly in the new era.',
          desc2: 'Wanzai is striving to build a true "Hometown of Chinese Fireworks". Through industry upgrade, cultural inheritance, and cultural tourism integration, it achieves sustainable development of the fireworks industry, injecting new momentum into local economic and social development.'
        }
      }
    },
    routes: {
      hero: {
        title: 'Travel Routes',
        subtitle: 'Curated Wanzai Travel Itineraries'
      },
      cta: {
        title: 'Start Your Wanzai Journey',
        desc: 'Choose a travel route that suits you and experience Wanzai\'s millennium culture, natural scenery and red heritage.',
        cta: 'View Viewing Spots'
      },
      routes: {
        ancient: 'Ancient City Cultural Tour',
        ancientMorning: 'Morning: Arrive in Wanzai, visit Wanzai Ancient City, explore the ancient clan halls, history museum, clan culture museum, and Chinese classics museum',
        ancientNoon: 'Noon: Taste Wanzai specialty cuisine at Wanzai Kitchen (Ancient City Branch)',
        ancientAfternoon: 'Afternoon: Experience Xia Bu weaving craftsmanship, watch Desheng Drum performance',
        ancientEvening: 'Evening: Watch "Kiss of Fire" fireworks show, enjoy Wanzai night market delicacies',
        mountain: 'Mountain & Water Cultural Tour',
        mountainMorning: 'Morning: Visit Zhushan Cave scenic area, Wanzai Henghui Art Agriculture Scenic Area',
        mountainNoon: 'Noon: Taste authentic farmhouse cuisine, experience Wanzai flavors',
        mountainAfternoon: 'Afternoon: Explore Jiulong Primitive Forest, experience nature through rafting',
        mountainEvening: 'Evening: Watch fireworks culture festival at Longhu Park, enjoy the "meteors" falling in the night',
        red: 'Red Culture Tour',
        redMorning: 'Morning: Visit Hunan-Hubei-Jiangxi Revolutionary Memorial Hall, Wanzai Revolutionary Martyrs Memorial Hall',
        redNoon: 'Noon: Experience Red Army meal, feel the spirit of predecessors',
        redAfternoon: 'Afternoon: Visit Xianyuan Hunan-Hubei-Jiangxi Revolutionary Base Site Group, retrace the Red Army trail',
        redEvening: 'Evening: Enjoy intangible heritage performances, watch fireworks show, taste Wanzai specialty cuisine'
      }
    },
    viewingSpots: {
      hero: {
        title: 'Viewing Spots',
        subtitle: 'Best Fireworks Viewing Locations'
      },
      cta: {
        title: 'Find the Best Viewing Spots',
        desc: 'Check the Wanzai map to discover more fireworks viewing spots and beautiful scenery.',
        cta: 'View Map Guide'
      },
      spots: {
        ancientCity: 'Wanzai Ancient City',
        ancientCityDesc1: 'Wanzai Ancient City is one of the best fireworks viewing locations. Every Saturday at 8:00 PM, the "Kiss of Fire" free fireworks show starts promptly, lasting 30 minutes. The ancient city\'s bluestone paths, horse-head walls, and brilliant fireworks create a beautiful picture.',
        ancientCityViewing: 'Green Shade Square, Riverside Corridor, Ancient City Viewing Platform',
        ancientCityTransport: 'Located in the center of Wanzai city, accessible by bus or taxi',
        longhuPark: 'Longhu Park',
        longhuParkDesc1: 'Longhu Park is an urban park in Wanzai county with a wide lake surface and open view, making it an ideal place to view fireworks. The reflections of fireworks on the lake surface are even more beautiful, providing a double visual experience.',
        longhuParkViewing: 'Lake-side boardwalk, Lake Center Pavilion, Lakeside Park',
        longhuParkTransport: 'Located in the southwest of Wanzai city, accessible by bus or taxi',
        bestViewing: 'Best Viewing Locations',
        transportation: 'Transportation'
      },
      tips: {
        title: 'Viewing Tips',
        bestTime: 'Best Viewing Times',
        time1: 'Every Saturday 8:00-8:30 PM (Wanzai Ancient City Fireworks Show)',
        time2: 'Major holidays (such as Spring Festival, Lantern Festival, National Day) or Fireworks Culture Festival',
        time3: 'Summer nights (cool weather, suitable for outdoor activities)',
        time4: 'Spring and autumn seasons (pleasant climate, beautiful scenery)',
        time5: 'Winter with snow, watch fireworks and dancing snowflakes',
        notice: 'Notes',
        notice1: 'Arrive early at the viewing spot to secure a good position',
        notice2: 'Pay attention to safety, stay away from fireworks launch points, choose open areas',
        notice3: 'Protect the environment, do not litter',
        notice4: 'Follow venue order, obey staff instructions',
        notice5: 'Bring your camera or phone to capture beautiful moments'
      }
    },
    merchant: {
      hero: {
        title: 'Merchants',
        subtitle: 'Discover Quality Merchants in Wanzai'
      },
      sections: {
        featured: {
          title: 'Featured Merchants',
          products: 'Products/Services',
          advantages: 'Advantages',
          contact: 'Contact'
        },
        reviews: {
          title: 'User Reviews'
        }
      },
      cta: {
        title: 'Start Your Wanzai Journey',
        desc: 'Choose your favorite merchants and experience the charm of Wanzai fireworks culture.'
      },
      merchants: {
        caiTian: {
          name: 'Caitian Art Fireworks',
          category: 'Art Fireworks Display',
          description: 'Wanzai Caitian Fireworks Art Performance Co., Ltd. is a benchmark enterprise in the domestic fireworks industry with top-level manufacturing capabilities and professional art display expertise, aiming to be a "creative pioneer in fireworks cultural tourism performances."',
          products: ['Art Fireworks Display', 'Cultural Tourism Performance Planning', 'Fireworks Cultural Products'],
          advantages: ['National Class A Fireworks Display Qualification', 'Disney/Universal Studios Supplier', 'Professional Display Team 30+ Years'],
          address: 'Industrial Park, Sanxing Town, Wanzai County, Yichun City, Jiangxi Province',
          phone: '159 0947 0166'
        },
        qianNian: {
          name: 'Jiangxi Wanzai QianNian Food Co., Ltd.',
          category: 'Food Processing',
          description: 'Jiangxi Wanzai QianNian Food Co., Ltd. is a leading enterprise in Wanzai food processing industry, founded in 2001, specializing in Jiangxi traditional specialty food R&D and production with over 1400 years of historical heritage.',
          products: ['South Wild Jujube Cake', 'Kudzu Products', 'Lily Products'],
          advantages: ['China Famous Trademark', 'Provincial-Level Agricultural Industrialization Leading Enterprise', 'Jiangxi Province Famous Brand'],
          address: 'No.1, Area B, Industrial Park, Wanzai County, Yichun City, Jiangxi Province',
          phone: '400-6789-228'
        },
        tailin: {
          name: 'Tailin Fireworks',
          category: 'Firecrackers Manufacturing',
          description: 'Tailin Fireworks is located in Shuangqiao Town, Wanzai County, the core of the world fireworks golden triangle. With the commitment to "quality small firecrackers", the company has been dedicated to fireworks manufacturing for over 20 years. Covering 428 mu of land with five coordinated production areas, the company offers over 100 specifications to precisely meet different market demands.',
          products: ['5.5 Small Firecrackers', '6.0 Small Firecrackers', '7.0 Small Firecrackers'],
          advantages: ['China Top 100 Fireworks Enterprise', 'Wanzai Ten-Star Fireworks Enterprise', 'Intelligent Machinery + Traditional Craft'],
          address: 'Baishu Village, Shuangqiao Town, Wanzai County, Yichun City, Jiangxi Province (Beside WanShang Highway 31km)',
          phone: '0795-8411566'
        }
      },
      reviews: {
        zhang: {
          author: 'Mr. Zhang',
          content: 'The fireworks display by Caitian Art Fireworks was absolutely stunning and full of creativity! As a partner, I was impressed by their professional standards and potassium-free, sulfur-free environmental protection technology. Highly recommended!',
          date: '2026-2-26'
        },
        wang: {
          author: 'Mr. Wang',
          content: 'QianNian company\'s South Wild Jujube Cake has a very good taste, natural sweet and sour with unique flavor. The kudzu powder and lily powder are also of great quality, highly recommended!',
          date: '2025-12-08'
        },
        li: {
          author: 'Mr. Li',
          content: 'Tailin Fireworks\' firecrackers have crisp and loud sounds with excellent quality! Moreover, the company has large scale and complete qualifications, making it a trustworthy partner.',
          date: '2026-02-20'
        }
      }
    },
    map: {
      hero: {
        title: 'Map Guide',
        subtitle: 'Explore Wanzai, Discover Beauty'
      }
    },
    footer: {
      about: 'About Wanzai',
      aboutDesc: 'Wanzai is a modern cultural tourism website showcasing the fireworks culture, intangible heritage, local delicacies and tourism scenery of Wanzai County, Jiangxi Province.',
      quickLinks: 'Quick Links',
      friendLinks: 'Friend Links',
      contact: 'Contact Us',
      wechatAccounts: 'WeChat QR Codes',
      customerGroup: 'WhizzZest Customer Group',
      copyright: 'Copyright © ',
      wanzaiGov: 'Wanzai County Government',
      wanzaiGovLink: 'http://www.wanzai.gov.cn/',
      wanzaiDouyin: 'Wanzai Release Douyin',
      chinaFireworks: 'China Fireworks Association',
      wechatGov: 'Wanzai Government WeChat',
      wechatWenlv: 'Wanzai Culture & Tourism WeChat',
      github: 'Wanzai Fireworks GitHub Repository',
      gitee: 'Wanzai Fireworks Gitee Repository',
      officialDouyin: 'WhizzZest Official Douyin',
      officialWechat: 'WhizzZest Official WeChat',
      allRightsReserved: 'All rights reserved.',
      icp: '赣ICP备2026003337号-1',
      police: '京公网安备11010802047642号'
    },
    musicPlayer: {
      title: 'There Is A Place Called Wanzai',
      artist: 'Zuo Hu Hai Music Studio - There Is A Place Called Wanzai',
      theme: 'Wanzai Tourism Theme Song',
      play: 'Play',
      pause: 'Pause',
      playPause: 'Play/Pause'
    },
    common: {
      learnMore: 'Learn More',
      viewRoutes: 'View Travel Routes',
      startJourney: 'Start Your Wanzai Journey',
      loading: 'Loading...',
      error: 'Failed to load',
      retry: 'Retry',
      videoNotSupported: 'Your browser does not support video playback.',
      videoLoadFailed: 'Video failed to load',
      videoHint: 'Video playback may consume a lot of data. Please play in WiFi environment as much as possible.'
    },
    firework: {
      title: 'Digital Fireworks Experience',
      loading: 'Loading',
      loadingStatus: 'Preparing fireworks',
      initializing: 'Initializing',
      settings: 'Settings',
      settingsHint: 'Click any tab for more information',
      shellType: 'Shell Type',
      shellSize: 'Shell Size',
      quality: 'Quality',
      qualityLow: 'Low',
      qualityMedium: 'Medium',
      qualityHigh: 'High',
      skyLighting: 'Sky Lighting',
      skyLightingNone: 'None',
      skyLightingDim: 'Dim',
      skyLightingNormal: 'Normal',
      autoLaunch: 'Auto Launch',
      finaleMode: 'Launch More Fireworks',
      fullscreen: 'Fullscreen',
      back: 'Back',
      background: 'Background Image',
      bgDefault: 'Wanzai Ancient City Fireworks',
      bgShootingStars: 'Shooting Stars',
      bgMoonUniverse: 'Moon Universe',
      bgMountains: 'Mountains',
      bgNone: 'No Background',
      backgroundImage: 'Background Image',
      removeBackground: 'Remove Background',
      types: {
        random: 'Random',
        crackle: 'Crackle',
        crossette: 'Crossette',
        crysanthemum: 'Crysanthemum',
        fallingLeaves: 'Falling Leaves',
        floral: 'Floral',
        ghost: 'Ghost',
        horseTail: 'Horse Tail',
        palm: 'Palm',
        ring: 'Ring',
        strobe: 'Strobe',
        willow: 'Willow'
      }
    },
    aiChat: {
      title: 'Wanzai AI Assistant',
      subtitle: 'Smart Tourism Q&A',
      welcome: 'Hello! I am the Wanzai Tourism AI Assistant. I can introduce fireworks culture, local delicacies, travel routes and more. What would you like to know?',
      placeholder: 'Type your question...',
      quickQ1: 'What\'s good to eat in Wanzai?',
      quickQ2: 'When are fireworks shows?',
      quickQ3: 'Recommend travel routes',
      thinking: 'Thinking...',
      error: 'Sorry, service unavailable',
      networkError: 'Network connection failed, please try again'
    },
    about: {
      hero: {
        title: 'About Us',
        subtitle: 'WhizzZest Team Introduction'
      },
      sections: {
        team: {
          title: 'Our Team',
          members: {
            member1: {
              name: 'Lin Yuqing',
              role: 'Project Director',
              description: 'Leads overall strategic planning and team coordination, orchestrates resource integration, and ensures efficient project execution with precise achievement of core objectives.'
            },
            member2: {
              name: 'Chen Haoran',
              role: 'Technical Architect',
              description: 'Directs full-stack development and system architecture design, leveraging cutting-edge technology stacks to build high-performance platforms with seamless user interaction experience.'
            },
            member3: {
              name: 'Zhou Yaqi',
              role: 'Brand Operations Director',
              description: 'Oversees new media matrix operations and brand communication strategies, plans creative content marketing, and continuously enhances platform influence and user reach.'
            },
            member4: {
              name: 'Su Wanting',
              role: 'Video Creative Director',
              description: 'Leads visual content planning and production, using cinematic art language to vividly showcase the unique charm and profound heritage of Wanzai fireworks culture.'
            },
            member5: {
              name: 'Liu Siying',
              role: 'Content Strategy Director',
              description: 'Formulates platform content planning and project documentation, deeply explores cultural value insights, and delivers professional copywriting and brand narrative systems.'
            },
            member6: {
              name: 'Claude AI',
              role: 'AI Empowerment Assistant',
              description: 'Based on cutting-edge artificial intelligence technology, provides intelligent creative support and efficiency empowerment for the team, assists in content generation, technical optimization and creative planning, driving project digital transformation and intelligent upgrade.'
            }
          }
        },
        background: {
          title: 'Project Background',
          originTitle: 'Origin',
          originDesc: 'WhizzZest was initiated by a group of students from Beijing universities who love their hometown culture. We hope to use modern technology to help more people learn about Wanzai, a small city with millennium fireworks culture.',
          goalTitle: 'Promotion Goals',
          goalDesc: 'Our goal is to empower Wanzai tourism with AI technology, spreading Wanzai\'s unique charm through the internet, attracting more tourists to experience the brilliant fireworks culture, while helping the local tourism industry develop with high quality.'
        },
        mission: {
          title: 'Mission & Vision',
          missionTitle: 'Our Mission',
          missionDesc: 'Preserve and promote Wanzai\'s millennium fireworks culture, let every visitor feel the passion and charm of this city. We are dedicated to creating the most comprehensive Wanzai tourism information platform, helping tourists easily plan their trips and deeply experience local culture.',
          visionTitle: 'Our Vision',
          visionDesc: 'Become a benchmark for Wanzai\'s digital tourism transformation and new media matrix construction, working closely with local enterprises and government departments to make "WhizzZest" an important entry point for domestic and international tourists to learn about Wanzai. In the future, we plan to expand this development path from Wanzai, creating a key solution for county-level economies to achieve breakthrough development.'
        },
        timeline: {
          title: 'Development Timeline',
          events: {
            event1: {
              date: 'December 2025',
              title: 'Project Launch',
              description: 'Team officially formed, completed project feasibility analysis and market research, established platform positioning and development strategy, initiated technical R&D preparation.'
            },
            event2: {
              date: 'January-February 2026',
              title: 'Product Development',
              description: 'Completed platform prototype design and core feature development, adopted Vue 3 + Tailwind CSS cutting-edge tech stack, built high-performance user experience framework, launched core modules including intangible heritage and local delicacies.'
            },
            event3: {
              date: 'Late February 2026',
              title: 'Official Release',
              description: 'Platform officially launched for operation, opened to public access, completed first-round user testing and feature optimization, established brand image and market positioning.'
            },
            event4: {
              date: 'April 2026',
              title: 'Brand Operations',
              description: 'Initiated new media matrix operation strategy, built diversified promotional channels including WeChat public account and Douyin, continuously expanded user reach pathways, enhanced platform brand influence.'
            }
          }
        },
        partners: {
          title: 'Partners',
          list: {
            partner1: {
              name: 'Wanzai Tourism Bureau'
            },
            partner2: {
              name: 'Wanzai Ancient City'
            },
            partner3: {
              name: 'Caitian Art Fireworks'
            },
            partner4: {
              name: 'Tailin Fireworks'
            }
          }
        },
        contact: {
          title: 'Contact Us',
          emailLabel: 'Email',
          email: "{'whizzzest@outlook.com'}",
          douyinLabel: 'Official Douyin',
          douyin: 'WhizzzestOfficial',
          wechatLabel: 'WeChat',
          wechat: 'YunshangWanzai-YanyuXianglv',
          videoLabel: 'WeChat Video',
          video: 'WhizzzestOfficial',
          xiaohongshuLabel: 'Xiaohongshu',
          xiaohongshu: 'WhizzzestOfficial',
          serviceLabel: 'Online Support',
          service: 'Customer Service'
        }
      }
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
});

export default i18n;
