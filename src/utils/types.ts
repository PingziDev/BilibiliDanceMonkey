export type Config = {
  bufferTime: number;
  showSpeedBtns: boolean
};


export const DefaultConfig: Config = {
  bufferTime: 4,
  showSpeedBtns: true,
};

export enum Commands {
  faster = "faster",
  slower = "slower",
  last = "last",
  next = "next"
}

export type MessageObj = {
  type: MessageType;
  value: any;
};

export enum MessageType {
  urlChange,
  openTab
}

export type ControlItem = {
  start?: number;
  end?: number;
  canvasStr?: string;
  playing: boolean;
};

export const speedList = [1, 0.9, 0.7, 0.5, 0.3];
