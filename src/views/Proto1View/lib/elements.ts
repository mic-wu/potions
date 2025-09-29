export type Element = 'fire' | 'water' | 'ground' | 'electric' | 'ice'

export interface ElementInfo {
  displayName: string
  color: string
  image: string
  index: number
}

export const elementInfo: Record<Element, ElementInfo> = {
  fire: {
    displayName: 'Fire',
    color: '#ff9d53',
    image: '/poke-elements/el-fire.png',
    index: 0,
  },
  water: {
    displayName: 'Water',
    color: '#4c92d7',
    image: '/poke-elements/el-water.png',
    index: 1,
  },
  ground: {
    displayName: 'Earth',
    color: '#da7844',
    image: '/poke-elements/el-ground.png',
    index: 2,
  },
  ice: {
    displayName: 'Ice',
    color: '#75cfc1',
    image: '/poke-elements/el-ice.png',
    index: 3,
  },
  electric: {
    displayName: 'Lightning',
    color: '#f3d339',
    image: '/poke-elements/el-electric.png',
    index: 4,
  },
}
