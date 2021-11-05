import { ApiCheckDsl, Result } from "./types";
import { OpenAPIV3 } from "openapi-types";
import flatten from "lodash.flatten";
import {
  factsToChangelog,
  OpenAPITraverser,
} from "@useoptic/openapi-utilities";
import {
  IChange,
  IFact,
} from "@useoptic/openapi-utilities/build/openapi3/sdk/types";

export type DslConstructorInput<Context> = {
  context: Context;
  nextFacts: IFact<any>[];
  currentFacts: IFact<any>[];
  changelog: IChange<any>[];
};

export class ApiCheckService<Context> {
  private rules: ((
    input: DslConstructorInput<Context>
  ) => Promise<Result>[])[] = [];

  useDsl<DSL extends ApiCheckDsl>(
    dslConstructor: (input: DslConstructorInput<Context>) => DSL,
    ...rules: ((dsl: DSL) => void)[]
  ) {
    const runner = (input: DslConstructorInput<Context>) => {
      const dsl = dslConstructor(input);
      rules.forEach((i) => i(dsl));
      return dsl.checkPromises();
    };

    this.rules.push(runner);
    return this;
  }

  async runRules(
    currentJsonLike: OpenAPIV3.Document,
    nextJsonLike: OpenAPIV3.Document,
    context: Context
  ) {
    const currentTraverser = new OpenAPITraverser();
    const nextTraverser = new OpenAPITraverser();

    await currentTraverser.traverse(currentJsonLike);
    const currentFacts = currentTraverser.accumulator.allFacts();
    await nextTraverser.traverse(nextJsonLike);
    const nextFacts = nextTraverser.accumulator.allFacts();

    const input: DslConstructorInput<Context> = {
      currentFacts,
      nextFacts,
      changelog: factsToChangelog(currentFacts, nextFacts),
      context,
    };

    const checkPromises: Promise<Result>[] = flatten(
      this.rules.map((ruleRunner) => ruleRunner(input))
    );

    const results: Result[] = await Promise.all(checkPromises);

    return results;
  }
}