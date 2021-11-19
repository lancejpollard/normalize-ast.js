
const Type = {
  Statement: {
    extends: { type: ['Node'] },
  },
  Identifier: {
    extends: { type: ['Expression', 'Pattern'] },
    properties: {
      name: { type: ['string'] }
    }
  },
  Literal: {
    extends: { type: ['Expression'] },
    properties: {
      value: { type: ['string', 'boolean', null, 'number', 'RegExp'] }
    }
  },
  Program: {
    extends: { type: ['Node'] },
    properties: {
      body: { type: ['ModuleDeclaration', 'Statement'], list: true }
    }
  },
  Function: {
    extends: { type: ['Node'] },
    properties: {
      params: { type: ['Pattern'], list: true },
      body: { type: ['FunctionBody'] },
      generator: { type: ['boolean'] },
      async: { type: ['boolean'] }
    }
  },
  Super: {
    extends: { type: ['Node'] },
    properties: {

    }
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
      param: { type: ['Pattern', null] },
      body: { type: ['BlockStatement'] }
    }
  },
  BigIntLiteral: {
    extends: { type: ['Literal'] },
    properties: {
      bigint: { type: ['string'] }
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
  ForOfStatement: {
    extends: { type: ['Statement'] },
    properties: {
      await: { type: ['boolean'] }
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
      elements: { type: ['Expression', 'SpreadElement', null], list: true }
    }
  },
  ObjectExpression: {
    extends: { type: ['Expression'] },
    properties: {
      properties: { type: ['Property', 'SpreadElement'], list: true }
    }
  },
  Property: {
    extends: { type: ['Node'] },
    properties: {
      key: { type: ['Expression'] },
      value: { type: ['Expression'] },
      kind: { type: ['string'] },
      method: { type: ['boolean'] },
      shorthand: { type: ['boolean'] },
      computed: { type: ['boolean'] }
    }
  },
  FunctionExpression: {
    extends: { type: ['Function', 'Expression'] },
  },
  ArrowFunctionExpression: {
    extends: { type: ['Function', 'Expression'] },
    properties: {
      body: { type: ['FunctionBody', 'Expression'] },
      expression: { type: ['boolean'] }
    }
  },
  YieldExpression: {
    extends: { type: ['Expression'] },
    properties: {
      argument: { type: ['Expression', null] },
      delegate: { type: ['boolean'] }
    }
  },
  TemplateLiteral: {
    extends: { type: ['Expression'] },
    properties: {
      quasis: { type: ['TemplateElement'], list: true },
      expressions: { type: ['Expression'], list: true }
    }
  },
  TaggedTemplateExpression: {
    extends: { type: ['Expression'] },
    properties: {
      tag: { type: ['Expression'] },
      quasi: { type: ['TemplateLiteral'] }
    }
  },
  TemplateElement: {
    extends: { type: ['Node'] },
    properties: {
      tail: { type: ['boolean'] },
      value: { type: ['object'] }
    }
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
      object: { type: ['Expression', 'Super'] },
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
      callee: { type: ['Expression', 'Super'] },
      arguments: { type: ['Expression', 'SpreadElement'], list: true }
    }
  },
  NewExpression: {
    extends: { type: ['Expression'] },
    properties: {
      callee: { type: ['Expression'] },
      arguments: { type: ['Expression', 'SpreadElement'], list: true }
    }
  },
  SequenceExpression: {
    extends: { type: ['Expression'] },
    properties: {
      expressions: { type: ['Expression'], list: true }
    }
  },
  Pattern: {
    extends: { type: ['Node'] },
    properties: {

    }
  },
  SpreadElement: {
    extends: { type: ['Node'] },
    properties: {
      argument: { type: ['Expression'] }
    }
  },
  ArrayPattern: {
    extends: { type: ['Pattern'] },
    properties: {
      elements: { type: ['Pattern', null], list: true }
    }
  },
  ObjectPattern: {
    extends: { type: ['Pattern'] },
    properties: {
      properties: { type: ['AssignmentProperty', 'RestElement'], list: true }
    }
  },
  RestElement: {
    extends: { type: ['Pattern'] },
    properties: {
      argument: { type: ['Pattern'] }
    }
  },
  AssignmentPattern: {
    extends: { type: ['Pattern'] },
    properties: {
      left: { type: ['Pattern'] },
      right: { type: ['Expression'] }
    }
  },
  Class: {
    extends: { type: ['Node'] },
    properties: {
      id: { type: ['Identifier', null] },
      superClass: { type: ['Expression', null] },
      body: { type: ['ClassBody'] }
    }
  },
  ClassBody: {
    extends: { type: ['Node'] },
    properties: {
      body: { type: ['MethodDefinition'], list: true }
    }
  },
  MethodDefinition: {
    extends: { type: ['Node'] },
    properties: {
      key: { type: ['Expression'] },
      value: FunctionExpression;
      kind: "constructor" | "method" | "get" | "set";
      computed: boolean;
      static: boolean;
    }
  },
  ClassDeclaration: {
    extends: { type: ['Class', 'Declaration'] },
    properties: {
      id: { type: ['Identifier'] }
    }
  },
  ClassExpression: {
    extends: { type: ['Class', 'Expression'] },
    properties: {

    }
  },
  MetaProperty: {
    extends: { type: ['Expression'] },
    properties: {
      meta: { type: ['Identifier'] },
      property: { type: ['Identifier'] }
    }
  },
  ModuleDeclaration: {
    extends: ['Node'],
    properties: {

    }
  },
  ModuleSpecifier: {
    extends: { type: ['Node'] },
    properties: {
      local: { type: ['Identifier'] }
    }
  },
  ImportDeclaration: {
    extends: { type: ['ModuleDeclaration'] },
    properties: {
      specifiers: { type: ['ImportSpecifier', 'ImportDefaultSpecifier', 'ImportNamespaceSpecifier'], list: true },
      source: { type: ['Literal'] }
    }
  },
  ImportSpecifier: {
    extends: { type: ['ModuleSpecifier'] },
    properties: {
      imported: { type: ['Identifier'] },
    }
  },
  ImportDefaultSpecifier: {
    extends: { type: ['ModuleSpecifier'] },
    properties: {

    }
  },
  ImportNamespaceSpecifier: {
    extends: { type: ['ModuleSpecifier'] },
    properties: {

    }
  },
  ExportNamedDeclaration: {
    extends: { type: ['Node'] },
    properties: {
      declaration: { type: ['Declaration', null] },
      specifiers: { type: ['ExportSpecifier'], list: true },
      source: { type: ['Literal', null] }
    }
  },
  ExportSpecifier: {
    extends: { type: ['ExportSpecifier'] },
    properties: {
      exported: { type: ['Identifier'] }
    }
  },
  ExportDefaultDeclaration: {
    extends: { type: ['ModuleDeclaration'] },
    properties: {
      declaration: { type: ['FunctionDeclaration', 'ClassDeclaration', 'Expression'] }
    }
  },
  ExportAllDeclaration: {
    extends: { type: ['ModuleDeclaration'] },
    properties: {
      source: { type: ['Literal'] },
      exported: { type: ['Identifier', null] }
    }
  },
  AwaitExpression: {
    extends: { type: ['Expression'] },
    properties: {
      argument: { type: ['Expression'] },
    }
  },
  ImportExpression: {
    extends: { type: ['Expression'] },
    properties: {
      source: { type: ['Expression'] }
    }
  }
}

module.exports = Type
