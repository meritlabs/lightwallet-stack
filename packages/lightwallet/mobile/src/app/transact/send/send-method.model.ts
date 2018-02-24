export enum SendMethodType {
  Easy = 'easy',
  Classic = 'classic'
}

export enum SendMethodDestination {
  Sms = 'sms',
  Email = 'email',
  Address = 'address'
}

export interface ISendMethod {
  type: SendMethodType;
  destination: SendMethodDestination;
  value: string;
  alias?: string;
}
