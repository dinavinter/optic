import { OperationRule, RuleError } from '@useoptic/rulesets-base';
import { getOperationAssertionsParameter } from './helpers/getOperationAssertionsParameter';
import { ParameterIn } from './helpers/types';

const getRuleName = <P extends ParameterIn>(parameterIn: P) =>
  `prevent requiring existing ${parameterIn} parameters` as const;

const getPreventRequireExistingParameter = (parameterIn: ParameterIn) =>
  new OperationRule({
    name: getRuleName(parameterIn),
    rule: (operationAssertions, _ruleContext) => {
      const parameter = getOperationAssertionsParameter(
        operationAssertions,
        parameterIn
      );

      parameter.changed(
        `not make an optional ${parameterIn} parameter required`,
        (before, after) => {
          if (!before.value.required && after.value.required) {
            throw new RuleError({
              message: `cannot make an optional ${parameterIn} parameter required`,
            });
          }
        }
      );
    },
  });

export const preventRequireExistingQueryParameter =
  getPreventRequireExistingParameter('query');

export const preventRequireExistingCookieParameter =
  getPreventRequireExistingParameter('cookie');

export const preventRequireExistingHeaderParameter =
  getPreventRequireExistingParameter('header');