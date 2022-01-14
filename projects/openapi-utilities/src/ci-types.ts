import { ResultWithSourcemap } from './types';
import { IChange, OpenApiFact } from './openapi3/sdk/types';

export type NormalizedCiContext = {
  organization: string;
  pull_request: number;
  run: number;
  commit_hash: string;
  repo: string;
};

export type CompareFileJson = {
  results: ResultWithSourcemap[];
  changes: IChange<OpenApiFact>[];
};