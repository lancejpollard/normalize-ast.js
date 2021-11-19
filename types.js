
const Type = {
  Statement: {
    extends: { type: ['Node'] },
  },
  Identifier: {
    extends: { type: ['Expression', 'Pattern'] },
  },
  ExpressionStatement: {
    extends: { type: ['Statement'] },
    properties: {
      expression: { type: ['Expression'] }
    }
  },
  Directive: {
    extends: { type: ['Node'] },
    properties: {
      expression: { type: ['Literal'] },
      directive: { type: ['string'] }
    }
  },
  BlockStatement: {
    extends: { type: ['Statement'] },
    properties: {
      body: { type: ['Statement'], list: true }
    }
  },
  FunctionBody: {
    extends: { type: ['BlockStatement'] },
    properties: {
      body: { type: [ 'Directive', 'Statement' ], list: true }
    }
  },
  EmptyStatement: {
    extends: { type: ['Statement'] },
    properties: {

    }
  },
  DebuggerStatement: {
    extends: { type: ['Statement'] },
    properties: {

    }
  },
  WithStatement: {
    extends: { type: ['Statement'] },
    properties: {
      object: { type: ['Expression'] },
      body: { type: ['Statement'] }
    }
  },
  ReturnStatement: {
    extends: { type: ['Statement'] },
    properties: {
      argument: { type: ['Expression', 'null'] }
    }
  },
  LabeledStatement: {
    extends: { type: ['Statement'] },
    properties: {
      label: { type: ['Identifier'] },
      body: { type: ['Statement'] }
    }
  },
  BreakStatement: {
    extends: { type: ['Statement'] },
    properties: {
      label: { type: ['Identifier', null] }
    }
  },
  ContinueStatement: {
    extends: { type: ['Statement'] },
    properties: {
      label: { type: ['Identifier', null] }
    }
  },
  IfStatement: {
    extends: { type: ['Statement'] },
    properties: {
      test: { type: ['Expression'] },
      consequent: { type: ['Statement'] },
      alternate: { type: ['Statement', null] }
    }
  },
  SwitchStatement: {
    extends: { type: ['Statement'] },
    properties: {
      discriminant: { type: ['Expression'] },
      cases: { type: ['SwitchCase'], list: true }
    }
  },
  SwitchCase: {
    extends: { type: ['Node'] },
    properties: {
      test: { type: ['Expression', null] },
      consequent: { type: ['Statement'], list: true }
    }
  },
  ThrowStatement: {
    extends: { type: ['Statement'] },
    properties: {
      argument: { type: ['Expression'] }
    }
  },
  TryStatement: {
    extends: { type: ['Statement'] },
    properties: {
      block: { type: ['BlockStatement'] },
      handler: { type: ['CatchClause', null] },
      finalizer: { type: ['BlockStatement', null] }
    }
  },
  CatchClause: {
    extends: { type: ['Node'] },
    properties: {
      param: { type: ['Pattern'] },
      body: { type: ['BlockStatement'] }
    }
  },
  WhileStatement: {
    extends: { type: ['Statement'] },
    properties: {
      test: { type: ['Expression'] },
      body: { type: ['Statement'] }
    }
  },
  DoWhileStatement: {
    extends: { type: ['Statement'] },
    properties: {
      body: { type: ['Statement'] },
      test: { type: ['Expression'] }
    }
  },
  ForStatement: {
    extends: { type: ['Statement'] },
    properties: {
      init: { type: ['VariableDeclaration', 'Expression', null] },
      test: { type: ['Expression', null] },
      update: { type: ['Expression', null] },
      body: { type: ['Statement'] }
    }
  },
  ForInStatement: {
    extends: { type: ['Statement'] },
    properties: {
      left: { type: ['VariableDeclaration', 'Pattern'] },
      right: { type: ['Expression'] },
      body: { type: ['Statement'] }
    }
  },
  Declaration: {
    extends: { type: ['Statement'] }
  },
  FunctionDeclaration: {
    extends: { type: ['Function', 'Declaration'] },
    properties: {
      id: { type: ['Identifier'] }
    }
  },
  VariableDeclaration: {
    extends: { type: ['Declaration'] },
    properties: {
      declarations: { type: ['VariableDeclarator'], list: true },
      kind: { type: ['string'] }
    }
  },
  VariableDeclarator: {
    extends: { type: ['Node'] },
    properties: {
      id: { type: ['Pattern'] },
      init: { type: ['Expression', null] }
    }
  },
  Expression: {
    extends: { type: ['Node'] }
  },
  ThisExpression: {
    extends: { type: ['Expression'] },
  },
  ArrayExpression: {
    extends: { type: ['Expression'] },
    properties: {
      elements: { type: ['Expression', null], list: true }
    }
  },
  ObjectExpression: {
    extends: { type: ['Expression'] },
    properties: {
      properties: { type: ['Property'], list: true }
    }
  },
  Property: {
    extends: { type: ['Node'] },
    properties: {
      key: { type: ['Literal', 'Identifier'] },
      value: { type: ['Expression'] },
      kind: { type: ['string'] }
    }
  },
  FunctionExpression: {
    extends: { type: ['Function', 'Expression'] },
  },
  UnaryExpression: {
    extends: { type: ['Expression'] },
    properties: {
      operator: { type: ['string'] },
      prefix: { type: ['boolean'] },
      argument: { type: ['Expression'] }
    }
  },
  UpdateExpression: {
    extends: { type: ['Expression'] },
    properties: {
      operator: { type: ['string'] },
      argument: { type: ['Expression'] },
      prefix: { type: ['boolean'] }
    }
  },
  BinaryExpression: {
    extends: { type: ['Expression'] },
    properties: {
      operator: { type: ['string'] },
      left: { type: ['Expression'] },
      right: { type: ['Expression'] }
    }
  },
  AssignmentExpression: {
    extends: { type: ['Expression'] },
    properties: {
      operator: { type: ['string'] },
      left: { type: ['Pattern', 'Expression'] },
      right: { type: ['Expression'] }
    }
  },
  LogicalExpression: {
    extends: { type: ['Expression'] },
    properties: {
      operator: { type: ['string'] },
      left: { type: ['Expression'] },
      right: { type: ['Expression'] }
    }
  },
  MemberExpression: {
    extends: { type: ['Expression'] },
    properties: {
      object: { type: ['Expression'] },
      property: { type: ['Expression'] },
      computed: { type: ['boolean'] }
    }
  },
  ConditionalExpression: {
    extends: { type: ['Expression'] },
    properties: {
      test: { type: ['Expression'] },
      alternate: { type: ['Expression'] },
      consequent: { type: ['Expression'] }
    }
  },
  CallExpression: {
    extends: { type: ['Expression'] },
    properties: {
      callee: { type: ['Expression'] },
      arguments: { type: ['Expression'], list: true }
    }
  },
  NewExpression: {
    extends: { type: ['Expression'] },
    properties: {
      callee: { type: ['Expression'] },
      arguments: { type: ['Expression'], list: true }
    }
  },
  SequenceExpression: {
    extends: { type: ['Expression'] },
    properties: {
      expressions: { type: ['Expression'], list: true }
    }
  },
  Pattern: {
    extends: { type: ['Node'] }
  }
}

module.exports = Type
