/** 烟花节点类型 — 匹配引擎实际支持的 12 种 */
export type FireworkShellType =
  | 'random'
  | 'crackle'
  | 'crossette'
  | 'chrysanthemum'
  | 'falling_leaves'
  | 'floral'
  | 'ghost'
  | 'horsetail'
  | 'palm'
  | 'ring'
  | 'strobe'
  | 'willow'
  | 'text'

/** 发射序列模式 */
export type LaunchSequence =
  | 'random'
  | 'twoRandom'
  | 'triple'
  | 'pyramid'
  | 'smallBarrage'

/** 烟花秀时间线事件 */
export interface ITimelineEvent {
  delay: number // 毫秒，距演出开始
  shellType: string
  shellSize: number
  x: number // 0-1 水平位置
  height: number // 0-1 发射高度
  text?: string // 文字烟花内容
}

export interface IFireworkNode {
  type: FireworkShellType
  color: string
  launchAt: number
  x: number
  height: number
  spread: number
}

/** 文字烟花配置 */
export interface ITextFireworkConfig {
  enabled: boolean
  preset: string[] // 文字预设列表
}

/** 烟花全量配置（含引擎运行参数） */
export interface IFireworkConfig {
  shellType: FireworkShellType
  shellSize: number
  quality: number // 1=Low, 2=Medium, 3=High
  skyLighting: number // 0=None, 1=Dim, 2=Normal
  autoLaunch: boolean
  finaleMode: boolean
  soundEnabled: boolean
  backgroundImage: string | null
  longExposure: boolean
  simSpeed: number
  launchSequence: LaunchSequence
  textFirework: ITextFireworkConfig
  customColor: string | null
  textPresets: string[]
  gravity: number
  particleDensity: number
  sparkAmount: number
  timeline?: ITimelineEvent[]
}

export interface IFireworkRecipe {
  id: string
  userId: string
  title: string
  config: IFireworkConfig
  shareSlug: string
  viewCount: number
  likeCount: number
  authorName?: string
  createdAt: Date
}

export interface IFireworkRecipeCreate {
  title: string
  config: IFireworkConfig
}

export interface IFireworkRecipeUpdate {
  title?: string
  config?: IFireworkConfig
}

export interface IFireworkRecipeSummary {
  id: string
  title: string
  shareSlug: string
  viewCount: number
  likeCount: number
  authorName: string
  createdAt: Date
}

export interface IFireworkListParams {
  limit?: number
  sort?: 'views' | 'likes' | 'newest'
  search?: string
}
