export type Config = {
  bufferTime: number
  captureW: number
}

export enum Commands {
  faster = 'faster',
  slower = 'slower',
  last = 'last',
  next = 'next',
}

export type MessageObj = {
  type: MessageType,
  value: any
}

export enum MessageType {
  urlChange,
  openTab
}


export type ControlItem = {
  start?: number
  end?: number
  canvasStr?: string
  playing: boolean
}


export const speedList = [0.3, 0.5, 0.7, 0.9, 1];
