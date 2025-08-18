import changes from "./changes.json"

interface Changes {
  readonly name: string;
  readonly desc: string;
}

interface Update {
  readonly date: string;
  readonly title: string;
  readonly update: Changes[]
}

export const updates: Update[] = changes