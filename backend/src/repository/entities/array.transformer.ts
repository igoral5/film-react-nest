import { ValueTransformer } from 'typeorm';

export const arrayTransformer: ValueTransformer = {
  to: (value: string[]): string => value.join(','),
  from: (value: string): string[] => (value ? value.split(',') : []),
};
