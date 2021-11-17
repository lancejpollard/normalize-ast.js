
module.exports = {
  createMemberExpression,
  createConditionalExpression,
  createBinaryExpression,
  createLogicalExpression,
  createIdentifier,
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
  createWhileStatement
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

function createAssignmentExpression(left, right) {
  return {
    type: 'AssignmentExpression',
    left,
    right
  }
}

function createCallExpression(_callee, args = []) {
  return {
    type: 'CallExpression',
    callee: _callee,
    arguments: args
  }
}

function createFunctionDeclaration(id, params, body) {
  return {
    type: 'FunctionDeclaration',
    id,
    params,
    body: {
      type: 'BlockStatement',
      body
    }
  }
}

function createFunctionExpression(id, params, body) {
  return {
    type: 'FunctionExpression',
    id,
    params,
    body: {
      type: 'BlockStatement',
      body
    }
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
    body: {
      type: 'BlockStatement',
      body
    }
  }
}

function createForOfStatement(left, right, body) {
  return {
    type: 'ForOfStatement',
    left,
    right,
    body: {
      type: 'BlockStatement',
      body
    }
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
