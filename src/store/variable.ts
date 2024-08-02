export interface variable {
  total: number;
}

const state: variable = {
  total: 123,
}

export const modules = {
  namespace: true,
  state,
}

