export class Achievement {
  constructor(
    slug: string,
    name: string,
    description: string,
    image: string,
    conditions: Array<{ name: string }>,
    version: number
  ) {}
}

export interface Achievements {
  achievements: Achievement[];
  token: string;
  settings: { isSetupTrackerEnabled: boolean };
}
