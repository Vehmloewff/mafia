import { StateOption } from 'abstract-state-router';

export interface Route extends Omit<StateOption<any, any, any, any>, 'template'> {}
