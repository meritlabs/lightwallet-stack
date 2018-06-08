export class Achievement {
  constructor(
    id: string,
    goalId: string,
    slug: number,
    route: string,
    name: string,
    description: string,
    title: string,
    linkTitle: string,
    image: string,
    conditions: Array<{ name: string }>,
    version: number
  ) {}
}

export interface Achievements {
  achievements: Achievement[];
  token: string;
  settings: { isSetupTrackerEnabled: boolean; isWelcomeDialogEnabled: boolean };
}
