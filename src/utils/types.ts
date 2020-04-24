export type Config = {
  bufferTime: number
  captureW: number
}

export enum Commands {
  faster = 'faster',
  slower = 'slower',
  speed5 = 'speed0.5',
  speed1 = 'speed1',
  configReady = 'configReady',
}

export type MessageObj = {
  type: MessageType,
  value: any
}

export enum MessageType {
  urlChange
}


export type ControlItem = {
  start?: number
  end?: number
  canvasStr?: string
  playing: boolean
}
