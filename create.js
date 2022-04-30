
module.exports = {
  createDebuggerStatement,
  createCatchClause,
  createTryStatement,
  createSwitchStatement,
  createProgram,
  createVariable,
  createArrayPattern,
  createMemberExpression,
  createConditionalExpression,
  createBinaryExpression,
  createLogicalExpression,
  createIdentifier,
  createLiteral,
  createExpressionStatement,
  createVariableDeclaration,
  createVariableDeclarator,
  createAssignmentExpression,
  createCallExpression,
  createFunctionDeclaration,
  createFunctionExpression,
  createArrowFunctionExpression,
  createAssignmentPattern,
  createReturnStatement,
  createIfStatement,
  createBlockStatement,
  createObjectExpression,
  createProperty,
  createArrayExpression,
  createForInStatement,
  createForOfStatement,
  createWhileStatement,
  createLabeledStatement,
  createMethodDefinition,
  createClassDeclaration,
  createClassBody,
  createBreakStatement,
  createThrowStatement,
  createSpreadElement,
  createRestElement,
  createTaggedTemplateExpression,
  createTemplateLiteral,
  createNewExpression,
  createUnaryExpression,
  createUpdateExpression,
  createSwitchCase,
  createObjectPattern
}

function createObjectPattern(properties) {
  return {
    type: 'ObjectPattern',
    properties
  }
}

function createCatchClause(param, body) {
  return {
    type: 'CatchClause',
    param,
    body
  }
}

function createTryStatement(block, handler, finalizer) {
  return {
    type: 'TryStatement',
    block,
    handler,
    finalizer
  }
}

function createSwitchCase(test, consequent) {
  return {
    type: 'SwitchCase',
    test,
    consequent
  }
}

function createSwitchStatement(discriminant, cases) {
  return {
    type: 'SwitchStatement',
    discriminant,
    cases
  }
}

function createUpdateExpression(argument, operator, prefix) {
  return {
    type: 'UpdateExpression',
    argument,
    operator,
    prefix
  }
}

function createUnaryExpression(argument, operator, prefix) {
  return {
    type: 'UnaryExpression',
    argument,
    operator,
    prefix
  }
}

function createNewExpression(ctor, args) {
  return {
    type: 'NewExpression',
    callee: ctor,
    arguments: args
  }
}

function createTemplateLiteral(expressions, quasis) {
  return {
    type: 'TemplateLiteral',
    expressions,
    quasis
  }
}

function createTaggedTemplateExpression(tag, quasi) {
  return {
    type: 'TaggedTemplateExpression',
    tag,
    quasi
  }
}

function createRestElement(argument) {
  return {
    type: 'RestElement',
    argument
  }
}

function createSpreadElement(argument) {
  return {
    type: 'SpreadElement',
    argument
  }
}

function createThrowStatement(argument) {
  return {
    type: 'ThrowStatement',
    argument
  }
}

function createBreakStatement(label) {
  return {
    type: 'BreakStatement',
    label
  }
}

function createClassBody(body) {
  return {
    type: 'ClassBody',
    body
  }
}

function createClassDeclaration(id, superClass, body) {
  return {
    type: 'ClassDeclaration',
    id,
    superClass,
    body
  }
}

function createMethodDefinition(key, value, kind, computed = false, isStatic = false) {
  return {
    type: 'MethodDefinition',
    key,
    value,
    kind,
    computed,
    static: isStatic
  }
}

function createProgram(body) {
  return {
    type: 'Program',
    body
  }
}

function createMemberExpression(object, property, computed = false) {
  return {
    type: 'MemberExpression',
    object,
    property,
    computed
  }
}

function createConditionalExpression(test, consequent, alternate) {
  return {
    type: 'ConditionalExpression',
    test,
    consequent,
    alternate
  }
}

function createBinaryExpression(left, operator, right) {
  return {
    type: 'BinaryExpression',
    left,
    operator,
    right
  }
}

function createLogicalExpression(left, operator, right) {
  return {
    type: 'LogicalExpression',
    left,
    operator,
    right
  }
}

function createIdentifier(name) {
  return {
    type: 'Identifier',
    name
  }
}

function createExpressionStatement(expression) {
  return {
    type: 'ExpressionStatement',
    expression
  }
}

function createVariable(kind, id, init) {
  return createVariableDeclaration(kind, [
    createVariableDeclarator(id, init)
  ])
}

function createVariableDeclaration(kind, declarations) {
  return {
    type: 'VariableDeclaration',
    kind,
    declarations
  }
}

function createVariableDeclarator(id, init) {
  return {
    type: 'VariableDeclarator',
    id,
    init
  }
}

function createLiteral(value) {
  return {
    type: 'Literal',
    value,
    raw: typeof value === 'string' ? `'${value}'` : typeof value === 'number' ? String(value) : JSON.stringify(value)
  }
}

function createAssignmentExpression(left, right, operator = '=') {
  return {
    type: 'AssignmentExpression',
    left,
    right,
    operator
  }
}

function createCallExpression(_callee, args = []) {
  return {
    type: 'CallExpression',
    callee: _callee,
    arguments: args
  }
}

function createFunctionDeclaration(id, params = [], body = [], { async = false, generator = false } = {}) {
  return {
    type: 'FunctionDeclaration',
    id,
    params,
    body,
    async,
    generator
  }
}

function createFunctionExpression(id, params = [], body = [], { async = false, generator = false } = {}) {
  return {
    type: 'FunctionExpression',
    id,
    params,
    body,
    async,
    generator
  }
}

function createAssignmentPattern(left, right) {
  return {
    type: 'AssignmentPattern',
    left,
    right
  }
}

function createReturnStatement(argument) {
  return {
    type: 'ReturnStatement',
    argument
  }
}

function createIfStatement(test, consequent, alternate) {
  return {
    type: 'IfStatement',
    test,
    consequent,
    alternate
  }
}

function createBlockStatement(body) {
  return {
    type: 'BlockStatement',
    body
  }
}

function createObjectExpression(properties) {
  return {
    type: 'ObjectExpression',
    properties
  }
}

function createProperty(key, value) {
  return {
    type: 'Property',
    key,
    value
  }
}

function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  }
}

function createForInStatement(left, right, body) {
  return {
    type: 'ForInStatement',
    left,
    right,
    body
  }
}

function createForOfStatement(left, right, body) {
  return {
    type: 'ForOfStatement',
    left,
    right,
    body
  }
}

function createWhileStatement(test, body) {
  return {
    type: 'WhileStatement',
    test,
    body: {
      type: 'BlockStatement',
      body
    }
  }
}

function createArrowFunctionExpression(id, params, body) {
  return {
    type: 'ArrowFunctionExpression',
    id,
    params,
    body
  }
}

function createLabeledStatement(label, body) {
  return {
    type: 'LabeledStatement',
    label,
    body
  }
}

function createArrayPattern(elements) {
  return {
    type: 'ArrayPattern',
    elements
  }
}

function createDebuggerStatement() {
  return {
    type: 'DebuggerStatement',
  }
}
