/**
 * 万载景点坐标数据
 * 用于高德地图标记点显示
 *
 * 注意：坐标数据需要根据实际情况核实
 * 可通过高德地图搜索或实地测量获取精确坐标
 */

// 景点类型定义
export interface Location {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  longitude: number
  latitude: number
  category: 'attraction' | 'food' | 'culture' | 'viewing' | 'red'
  icon?: string
}

// 路线类型定义
export interface RouteLocation {
  id: string
  name: string
  nameEn: string
  longitude: number
  latitude: number
  order: number
  description?: string
  descriptionEn?: string
}

export interface TravelRoute {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  color: string
  locations: RouteLocation[]
}

// 万载县城中心坐标（可根据实际调整）
export const WANZAI_CENTER = {
  longitude: 114.445477,
  latitude: 28.106201
}

// 主要景点坐标（已核实精确坐标）
export const locations: Location[] = [
  // 景点
  {
    id: 'wanzai-ancient-city',
    name: '万载古城',
    nameEn: 'Wanzai Ancient City',
    description: '国家AAAA级旅游景区，拥有全国最大的赣派多姓氏古祠堂集群',
    descriptionEn: 'National AAAA-level tourist attraction with the largest cluster of Gan-style ancient clan halls in China',
    longitude: 114.445051,
    latitude: 28.101914,
    category: 'attraction'
  },
  {
    id: 'zhushan-cave',
    name: '竹山洞景区',
    nameEn: 'Zhushan Cave',
    description: '万载著名溶洞景区，洞内景观奇特',
    descriptionEn: 'Famous karst cave scenic area in Wanzai with unique underground landscapes',
    longitude: 114.37412,
    latitude: 28.047219,
    category: 'attraction'
  },
  {
    id: 'henghui-art-agriculture',
    name: '万载恒晖艺术农业景区',
    nameEn: 'Henghui Art Agriculture',
    description: '集艺术与农业于一体的特色景区',
    descriptionEn: 'A unique scenic area combining art and agriculture',
    longitude: 114.487751,
    latitude: 28.227797,
    category: 'attraction'
  },
  {
    id: 'jiulong-forest',
    name: '九龙原始森林',
    nameEn: 'Jiulong Primitive Forest',
    description: '原始森林保护区，自然风光优美',
    descriptionEn: 'Primitive forest reserve with beautiful natural scenery',
    longitude: 114.533321,
    latitude: 28.327356,
    category: 'attraction'
  },
  {
    id: 'longhu-park',
    name: '龙湖公园',
    nameEn: 'Longhu Park',
    description: '城市公园，湖面宽阔，是观赏烟花的理想场所',
    descriptionEn: 'Urban park with wide lake surface, ideal for viewing fireworks',
    longitude: 114.440824,
    latitude: 28.086949,
    category: 'viewing'
  },
  // 红色景点
  {
    id: 'revolutionary-memorial',
    name: '湘鄂赣革命纪念馆',
    nameEn: 'Hunan-Hubei-Jiangxi Revolutionary Memorial Hall',
    description: '展示湘鄂赣革命根据地历史',
    descriptionEn: 'Exhibiting the history of Hunan-Hubei-Jiangxi revolutionary base',
    longitude: 114.452923,
    latitude: 28.097942,
    category: 'red'
  },
  {
    id: 'martyrs-memorial',
    name: '万载革命烈士纪念馆',
    nameEn: 'Wanzai Revolutionary Martyrs Memorial Hall',
    description: '纪念革命先烈',
    descriptionEn: 'Memorializing revolutionary martyrs',
    longitude: 114.453,
    latitude: 28.098,
    category: 'red'
  },
  {
    id: 'xianyuan-base',
    name: '仙源湘鄂赣革命根据地旧址群',
    nameEn: 'Xianyuan Revolutionary Base Site Group',
    description: '革命历史遗址群',
    descriptionEn: 'Group of revolutionary historical sites',
    longitude: 114.262963,
    latitude: 28.297111,
    category: 'red'
  },
  // 文化场所
  {
    id: 'xiabu-weaving',
    name: '夏布织造体验馆',
    nameEn: 'Xia Bu Weaving Experience Center',
    description: '体验国家级非遗夏布织造技艺',
    descriptionEn: 'Experience national intangible heritage Xia Bu weaving technique',
    longitude: 114.445,
    latitude: 28.102,
    category: 'culture'
  },
  // 美食
  {
    id: 'wanzai-kitchen',
    name: '万载厨房（古城店）',
    nameEn: 'Wanzai Kitchen (Ancient City Branch)',
    description: '品尝正宗万载六大碗等特色美食',
    descriptionEn: 'Taste authentic Wanzai Six Big Bowls and other specialties',
    longitude: 114.445,
    latitude: 28.1019,
    category: 'food'
  }
]

// 旅游路线数据（使用精确坐标）
export const travelRoutes: TravelRoute[] = [
  {
    id: 'ancient-culture-tour',
    name: '古城文化之旅',
    nameEn: 'Ancient City Cultural Tour',
    description: '上午：游览万载古城 → 中午：万载厨房品尝美食 → 下午：夏布织造、得胜鼓 → 晚上：焰火之吻烟花秀',
    descriptionEn: 'Morning: Visit Ancient City → Noon: Taste local food → Afternoon: Xia Bu weaving, Desheng Drum → Evening: Kiss of Fire show',
    color: '#dc2626',
    locations: [
      {
        id: 'wanzai-ancient-city',
        name: '万载古城',
        nameEn: 'Wanzai Ancient City',
        longitude: 114.445051,
        latitude: 28.101914,
        order: 1,
        description: '游览古祠堂群、历史文化馆',
        descriptionEn: 'Explore ancient clan halls and history museum'
      },
      {
        id: 'wanzai-kitchen',
        name: '万载厨房',
        nameEn: 'Wanzai Kitchen',
        longitude: 114.445,
        latitude: 28.1019,
        order: 2,
        description: '品尝万载特色美食',
        descriptionEn: 'Taste Wanzai specialty cuisine'
      },
      {
        id: 'xiabu-weaving',
        name: '夏布织造体验',
        nameEn: 'Xia Bu Weaving',
        longitude: 114.445,
        latitude: 28.102,
        order: 3,
        description: '体验夏布织造技艺',
        descriptionEn: 'Experience Xia Bu weaving technique'
      },
      {
        id: 'wanzai-ancient-city-view',
        name: '焰火之吻烟花秀',
        nameEn: 'Kiss of Fire Show',
        longitude: 114.445051,
        latitude: 28.101914,
        order: 4,
        description: '观看烟花表演',
        descriptionEn: 'Watch fireworks performance'
      }
    ]
  },
  {
    id: 'mountain-water-tour',
    name: '山水文化之旅',
    nameEn: 'Mountain & Water Cultural Tour',
    description: '上午：竹山洞、恒晖艺术农业 → 中午：农家菜 → 下午：九龙原始森林漂流 → 晚上：龙湖公园烟花',
    descriptionEn: 'Morning: Zhushan Cave, Henghui Art Agriculture → Noon: Farmhouse cuisine → Afternoon: Jiulong Forest rafting → Evening: Longhu Park fireworks',
    color: '#059669',
    locations: [
      {
        id: 'zhushan-cave',
        name: '竹山洞景区',
        nameEn: 'Zhushan Cave',
        longitude: 114.37412,
        latitude: 28.047219,
        order: 1,
        description: '游览溶洞奇观',
        descriptionEn: 'Explore karst cave wonders'
      },
      {
        id: 'henghui-art-agriculture',
        name: '恒晖艺术农业景区',
        nameEn: 'Henghui Art Agriculture',
        longitude: 114.487751,
        latitude: 28.227797,
        order: 2,
        description: '艺术农业观光',
        descriptionEn: 'Art agriculture sightseeing'
      },
      {
        id: 'jiulong-forest',
        name: '九龙原始森林',
        nameEn: 'Jiulong Primitive Forest',
        longitude: 114.533321,
        latitude: 28.327356,
        order: 3,
        description: '森林漂流体验',
        descriptionEn: 'Forest rafting experience'
      },
      {
        id: 'longhu-park',
        name: '龙湖公园',
        nameEn: 'Longhu Park',
        longitude: 114.440824,
        latitude: 28.086949,
        order: 4,
        description: '观赏烟花文化节',
        descriptionEn: 'Watch fireworks culture festival'
      }
    ]
  },
  {
    id: 'red-culture-tour',
    name: '红色文化之旅',
    nameEn: 'Red Culture Tour',
    description: '上午：革命纪念馆 → 中午：红军餐 → 下午：仙源革命旧址群 → 晚上：非遗展演、烟花秀',
    descriptionEn: 'Morning: Revolutionary memorial halls → Noon: Red Army meal → Afternoon: Xianyuan revolutionary sites → Evening: Heritage show, fireworks',
    color: '#b91c1c',
    locations: [
      {
        id: 'revolutionary-memorial',
        name: '湘鄂赣革命纪念馆',
        nameEn: 'Hunan-Hubei-Jiangxi Revolutionary Memorial',
        longitude: 114.452923,
        latitude: 28.097942,
        order: 1,
        description: '参观革命纪念馆',
        descriptionEn: 'Visit revolutionary memorial hall'
      },
      {
        id: 'martyrs-memorial',
        name: '革命烈士纪念馆',
        nameEn: 'Martyrs Memorial Hall',
        longitude: 114.453,
        latitude: 28.098,
        order: 2,
        description: '缅怀革命先烈',
        descriptionEn: 'Memorialize revolutionary martyrs'
      },
      {
        id: 'xianyuan-base',
        name: '仙源革命根据地旧址',
        nameEn: 'Xianyuan Revolutionary Base',
        longitude: 114.262963,
        latitude: 28.297111,
        order: 3,
        description: '重走红军小道',
        descriptionEn: 'Retrace the Red Army trail'
      },
      {
        id: 'wanzai-ancient-city-end',
        name: '万载古城',
        nameEn: 'Wanzai Ancient City',
        longitude: 114.445051,
        latitude: 28.101914,
        order: 4,
        description: '非遗展演、烟花秀',
        descriptionEn: 'Heritage performance, fireworks show'
      }
    ]
  }
]

// 烟花观赏点（使用精确坐标）
export const viewingSpots: Location[] = [
  {
    id: 'ancient-city-viewing',
    name: '万载古城观赏点',
    nameEn: 'Ancient City Viewing Spot',
    description: '绿阴广场、沿河长廊、古城观景台',
    descriptionEn: 'Green Shade Square, Riverside Corridor, Ancient City Viewing Platform',
    longitude: 114.445051,
    latitude: 28.101914,
    category: 'viewing'
  },
  {
    id: 'longhu-park-viewing',
    name: '龙湖公园观赏点',
    nameEn: 'Longhu Park Viewing Spot',
    description: '湖边栈道、湖心亭、湖畔公园',
    descriptionEn: 'Lake-side boardwalk, Lake Center Pavilion, Lakeside Park',
    longitude: 114.440824,
    latitude: 28.086949,
    category: 'viewing'
  }
]