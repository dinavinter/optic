import {
  IChange,
  OpenApiFact,
  ResultWithSourcemap,
  CompareFileJson,
} from '@useoptic/openapi-utilities';

export type CliConfig = {
  opticToken?: string;
  gitProvider?: {
    token: string;
    provider: 'github';
  };
  ciProvider?: 'github' | 'circleci';
};

export type NormalizedCiContext = {
  organization: string;
  pull_request: number;
  run: number;
  commit_hash: string;
  repo: string;
};

export type CompareJson = CompareFileJson;

export type UploadJson = {
  opticWebUrl: string;
  ciContext: NormalizedCiContext;
};

export type BulkCompareJson = {
  comparisons: {
    results: ResultWithSourcemap[];
    changes: IChange<OpenApiFact>[];
    inputs: {
      from?: string;
      to?: string;
    };
  }[];
};

export type BulkUploadJson = {
  comparisons: {
    results: ResultWithSourcemap[];
    changes: IChange<OpenApiFact>[];
    inputs: {
      from?: string;
      to?: string;
    };
    opticWebUrl: string;
  }[];
  ciContext: NormalizedCiContext;
};