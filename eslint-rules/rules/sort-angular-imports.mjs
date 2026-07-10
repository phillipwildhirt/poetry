// import { Rule } from 'eslint';
// type Rule.RuleModule

const sortAngularImports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce custom sort order for @Component and @NgModule imports arrays.',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const selector = `Decorator[expression.callee.name=/^(Component|NgModule)$/] Property[key.name=/^(imports|declarations|exports)$/] ArrayExpression`;

    const customOrder/*: {text: string, position: 'start' | 'end'}[]*/ = [
      { text: 'Module', position: 'end', linesAfter: 1 },
      { text: 'Ngb', position: 'start', linesAfter: 0 },
      { text: 'Cdk', position: 'start', linesAfter: 0 },
      { text: 'Mat', position: 'start', linesAfter: 0 },
      { text: 'None', position: 'none', linesAfter: 1 },
      { text: 'Ng', position: 'start', linesAfter: 1 },
      { text: 'Pipe', position: 'end', linesAfter: 1 },
      { text: 'Directive', position: 'end', linesAfter: 1 },
      { text: 'Component', position: 'end', linesAfter: 1 },
    ];

    const getGroupIndex = (name/*: string*/) => {
      let cleanName = name.replace(/['"]/g, '');

      const match = cleanName.match(/^([a-zA-Z0-9]+)(\..*\(.*\))?$/);
      if (match && match[1]) {
        cleanName = match[1];
      }

      for (let i = 0; i < customOrder.length; i++) {
        if (customOrder[i].position === 'start') {
          if (cleanName.startsWith(customOrder[i].text)) {
            return i;
          }
        } else if (customOrder[i].position === 'end') {
          if (cleanName.endsWith(customOrder[i].text)) {
            return i;
          }
        }
      }
      return customOrder.findIndex(item => item.position === 'none');
    };

    return {
      [selector]: function(node) {
        const sourceCode = context.sourceCode;

        const sorter = (a, b) => {
          const aName = sourceCode.getText(a);
          const bName = sourceCode.getText(b);
          const aIndex = getGroupIndex(aName);
          const bIndex = getGroupIndex(bName);

          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }
          // If in the same group, return 0 to preserve original order
          return 0;
        };

        const elements = node.elements;

        if (elements.length <= 1) return;

        const manyElements = elements.length > 10;

        const sortedElements = [...elements].sort(sorter)

        const isSorted = elements.every((element, index) => element === sortedElements[index]);

        if (!isSorted) {
          context.report({
            node: node,
            message: 'Angular imports, declarations, or exports are not sorted correctly by type (Module, Others, Pipe, Directive, Component).',

            fix(fixer) {
              const sourceCode = context.sourceCode;

              const sortedElements = [...elements].sort(sorter);

              let replacementText = '';
              const firstElementToken = sourceCode.getFirstToken(node.parent);
              const indentSize = firstElementToken ? firstElementToken.loc.start.column + 2 : 2;
              const indentation = ' '.repeat(indentSize);
              const finalIndentation = ' '.repeat(indentSize - 2);

              for (let i = 0; i < sortedElements.length; i++) {
                const currentElement = sortedElements[i];
                const currentText = sourceCode.getText(currentElement);

                replacementText += currentText;

                if (i < sortedElements.length - 1) {
                  const nextElement = sortedElements[i + 1];
                  const currentGroupName = customOrder[getGroupIndex(currentText)].text;
                  const currentLinesAfter = Array.from(Array(customOrder[getGroupIndex(currentText)].linesAfter).keys()).map( (_,line) => line >= 0 ? '\n' : '').join('');
                  const nextGroupName = customOrder[getGroupIndex(sourceCode.getText(nextElement))]?.text;

                  replacementText += ',';

                  if (currentGroupName !== nextGroupName && manyElements) {
                    replacementText += `${currentLinesAfter}\n${indentation}`;
                  } else {
                    replacementText += `\n${indentation}`;
                  }
                }
              }

              const finalReplacement = `\n${indentation}${replacementText}\n${finalIndentation}`;
              const range/*: [number, number]*/ = [node.range[0] + 1, node.range[1] - 1];

              return fixer.replaceTextRange(range, finalReplacement);
            }
          });
        }
      },
    };
  },
};

export default sortAngularImports;
