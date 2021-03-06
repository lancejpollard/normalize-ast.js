
const acorn = require('acorn')
const print = require('./print')
const {
  createObjectPattern,
  createCatchClause,
  createTryStatement,
  createSwitchCase,
  createSwitchStatement,
  createProgram,
  createVariable,
  createArrayPattern,
  createMethodDefinition,
  createUpdateExpression,
  createUnaryExpression,
  createNewExpression,
  createTemplateLiteral,
  createTaggedTemplateExpression,
  createRestElement,
  createSpreadElement,
  createThrowStatement,
  createClassBody,
  createBreakStatement,
  createClassDeclaration,
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
  createLabeledStatement
} = require('./create')
const types = require('./types')

module.exports = {
  parse,
  print,
  normalize
}

function parse(string) {
  return acorn.parse(string, { ecmaVersion: 2021, sourceType: 'module' })
}

function normalize(input) {
  const ast = normalizeType(input.type, input, { index: 0 })
  return ast
}

function normalizeType(type, ...args) {
  return call(normalizers, `normalize_${type}`, ...args)
}

function normalizeProperty(type, property, propertyType, ...args) {
  return call(normalizers, `normalize_${type}_${property}_${propertyType}`, ...args)
}

const normalizers = {
  ...buildNormalizers(types),
  normalize_Identifier,
  normalize_Literal,
  normalize_Program,
  normalize_Super,
  normalize_ExpressionStatement,
  normalize_Directive,
  normalize_BlockStatement,
  normalize_FunctionBody,
  normalize_EmptyStatement,
  normalize_DebuggerStatement,
  normalize_WithStatement,
  normalize_ReturnStatement,
  normalize_LabeledStatement,
  normalize_BreakStatement,
  normalize_ContinueStatement,
  normalize_IfStatement,
  normalize_SwitchStatement,
  normalize_SwitchCase,
  normalize_ThrowStatement,
  normalize_TryStatement,
  normalize_CatchClause,
  normalize_BigIntLiteral,
  normalize_WhileStatement,
  normalize_DoWhileStatement,
  normalize_ForStatement,
  normalize_ForInStatement,
  normalize_ForOfStatement,
  normalize_FunctionDeclaration,
  normalize_VariableDeclaration,
  normalize_VariableDeclarator,
  normalize_ThisExpression,
  normalize_ArrayExpression,
  normalize_ObjectExpression,
  normalize_Property,
  normalize_FunctionExpression,
  normalize_ArrowFunctionExpression,
  normalize_YieldExpression,
  normalize_TemplateLiteral,
  normalize_TaggedTemplateExpression,
  normalize_TemplateElement,
  normalize_UnaryExpression,
  normalize_UpdateExpression,
  normalize_BinaryExpression,
  normalize_AssignmentExpression,
  normalize_LogicalExpression,
  normalize_MemberExpression,
  normalize_ConditionalExpression,
  normalize_CallExpression,
  normalize_NewExpression,
  normalize_SequenceExpression,
  normalize_SpreadElement,
  normalize_ArrayPattern,
  normalize_ObjectPattern,
  normalize_RestElement,
  normalize_AssignmentPattern,
  normalize_ClassBody,
  normalize_MethodDefinition,
  normalize_ClassDeclaration,
  normalize_ClassExpression,
  normalize_MetaProperty,
  normalize_ModuleDeclaration,
  normalize_ModuleSpecifier,
  normalize_ImportDeclaration,
  normalize_ImportSpecifier,
  normalize_ImportDefaultSpecifier,
  normalize_ImportNamespaceSpecifier,
  normalize_ExportNamedDeclaration,
  normalize_ExportSpecifier,
  normalize_ExportDefaultDeclaration,
  normalize_ExportAllDeclaration,
  normalize_AwaitExpression,
  normalize_ImportExpression,
  normalize_null,
}

function normalize_null() {
  return [null, []]
}

function normalize_Identifier(node, scope) {
  return [node, []]
}

function normalize_Literal(node, scope) {
  return [node, []]
}

function normalize_Program(node, scope) {
  const body = []
  node.body.forEach(n => {
    const [normalizedNode, normalizedExpressions]
      = normalizeProperty(node.type, 'body', n.type, n, scope)
    if (normalizedNode.type === 'EmptyStatement') return
    body.push(...normalizedExpressions)
    if (Array.isArray(normalizedNode)) {
      body.push(...normalizedNode)
    } else {
      body.push(normalizedNode)
    }
  })
  return createProgram(body)
}

function normalize_Super(node, scope) {

}

function normalize_ExpressionStatement(node, scope) {
  return normalizeProperty(node.type, 'expression', node.expression.type, node.expression, scope)
}

function normalize_Directive(node, scope) {

}

function normalize_BlockStatement(node, scope) {
  const body = []

  node.body.forEach(bd => {
    const [data, expressions] = normalizeProperty(node.type, 'body', bd.type, bd, scope)
    if (data.type === 'EmptyStatement') return
    body.push(...expressions)
    if (Array.isArray(data)) {
      body.push(...data)
    } else {
      body.push(data)
    }
  })

  return [
    createBlockStatement(body),
    []
  ]
}

function normalize_FunctionBody(node, scope) {

}

function normalize_EmptyStatement(node, scope) {
  return [node, []]
}

function normalize_DebuggerStatement(node, scope) {
  return [node, []]
}

function normalize_WithStatement(node, scope) {

}

function normalize_ReturnStatement(node, scope) {
  const exps = []
  const [argument, argumentExps]
    = normalizeProperty(node.type, 'argument', node.argument?.type ?? null, node.argument, scope, false)
  exps.push(...argumentExps)
  return [
    createReturnStatement(argument),
    exps
  ]
}

function normalize_LabeledStatement(node, scope) {
  const [body] = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)
  const [label] = normalizeProperty(node.type, 'label', node.label.type, node.label, scope)
  return [
    createLabeledStatement(label, body),
    []
  ]
}

function normalize_BreakStatement(node, scope) {
  return [
    node,
    []
  ]
}

function normalize_ContinueStatement(node, scope) {
  return [node, []]
}

function normalize_IfStatement(node, scope) {
  const top = []
  const [test, testExps] = normalizeProperty(node.type, 'test', node.test.type, node.test, scope, false)
  top.push(...testExps)

  let [consequent, consequentExps]
    = normalizeProperty(node.type, 'consequent', node.consequent.type, node.consequent, scope)

  if (consequent.type !== 'BlockStatement') {
    consequent = createBlockStatement([consequent])
  }

  let alternate = null
  let alternateExps
  if (node.alternate) {
    [alternate, alternateExps]
      = normalizeProperty(node.type, 'alternate', node.alternate.type, node.alternate, scope)
    if (alternate.type === 'IfStatement') {
      top.push(...alternateExps)
    } else if (alternate.type !== 'BlockStatement') {
      alternate = createBlockStatement([alternate])
    }
  }

  const ifStatement = createIfStatement(test, consequent, alternate)
  return [ifStatement, top]
}

function normalize_SwitchStatement(node, scope) {
  const exps = []
  const [discriminant, discriminantExps]
    = normalizeProperty(node.type, 'discriminant', node.discriminant.type, node.discriminant, scope)
  exps.push(...discriminantExps)
  const cases = []
  node.cases.forEach(cse => {
    const [c, caseExps] = normalizeProperty(node.type, 'cases', cse.type, cse, scope)
    cases.push(c)
    exps.push(...caseExps)
  })
  return [
    createSwitchStatement(discriminant, cases),
    exps
  ]
}

function normalize_SwitchCase(node, scope) {
  const exps = []

  const consequent = []

  node.consequent.forEach(c => {
    const [cons, consExps] = normalizeProperty(node.type, 'consequent', c.type, c, scope)
    if (Array.isArray(cons)) {
      consequent.push(...cons)
    } else {
      consequent.push(cons)
    }
    exps.push(...consExps)
  })
  const [test, testExps]
    = normalizeProperty(node.type, 'test', node.test?.type ?? null, node.test, scope)

  exps.push(...testExps)

  return [
    createSwitchCase(test, consequent),
    exps
  ]
}

function normalize_ThrowStatement(node, scope) {
  const [argument, argumentExps] = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope)
  return [
    createThrowStatement(argument),
    argumentExps
  ]
}

function normalize_TryStatement(node, scope) {
  const exps = []

  const [block, blockExps]
    = normalizeProperty(node.type, 'block', node.block.type, node.block, scope)
  const [handler, handlerExps]
    = normalizeProperty(node.type, 'handler', node.handler.type, node.handler, scope)
  const [finalizer, finalizerExps]
    = normalizeProperty(node.type, 'finalizer', node.finalizer?.type ?? null, node.finalizer, scope)

  return [
    createTryStatement(block, handler, finalizer),
    exps
  ]
}

function normalize_CatchClause(node, scope) {
  const exps = []

  const [param]
    = normalizeProperty(node.type, 'param', node.param?.type ?? null, node.param, scope)
  const [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body?.type, node.body, scope)

  exps.push(...bodyExps)

  return [
    createCatchClause(param, body),
    exps
  ]
}

function normalize_BigIntLiteral(node, scope) {

}

function normalize_WhileStatement(node, scope) {
  const [test, testExps]
    = normalizeProperty(node.type, 'test', node.test.type, node.test, scope, false)
  let [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  if (body.type !== 'BlockStatement') {
    body = createBlockStatement([body])
  }

  body.body.unshift(...bodyExps)

  let newBody
  let simple = false

  if (test.type === 'Literal' && test.value === true) {
    newBody = body.body
    simple = true
  } else {
    newBody = [
      ...testExps,
      createIfStatement(
        test,
        body,
        createBlockStatement([
          createBreakStatement()
        ])
      )
    ]
  }

  const whileStatement = createWhileStatement(createLiteral(true), newBody)
  whileStatement.simple = simple
  return [whileStatement, []]
}

function normalize_DoWhileStatement(node, scope) {
  const [test, testExps]
    = normalizeProperty(node.type, 'test', node.test.type, node.test, scope, true)
  const [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  body.body.unshift(...bodyExps)

  const newBody = [
    ...testExps,
    createIfStatement(
      test,
      body,
      createBlockStatement([
        createBreakStatement()
      ])
    )
  ]

  const whileStatement = createWhileStatement(createLiteral(true), newBody)
  return [whileStatement, []]
}

function normalize_ForStatement(node, scope) {
  let [init, initExps] = normalizeProperty(node.type, 'init', node.init?.type ?? null, node.init, scope)
  const [test, testExps] = normalizeProperty(node.type, 'test', node.test?.type ?? null, node.test, scope, false)
  let [update, updateExps] = normalizeProperty(node.type, 'update', node.update?.type ?? null, node.update, scope)
  let [body, bodyExps] = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  if (init) {
    if (!Array.isArray(init)) init = [init]
  } else {
    init = []
  }

  if (update) {
    if (!Array.isArray(update)) update = [update]
  } else {
    update = []
  }

  if (body.type !== 'BlockStatement') {
    body = createBlockStatement(Array.isArray(body) ? body : [body])
  }

  const label = `fork${scope.index++}`

  const block = createBlockStatement([
    ...initExps,
    ...init,
    createLabeledStatement(label),
    createWhileStatement(
      createLiteral(true),
      [
        ...testExps,
        createIfStatement(test,
          createBlockStatement([
            ...body.body,
            ...updateExps,
            ...update
          ]),
          createBlockStatement([
            createBreakStatement(label)
          ])
        )
      ]
    )
  ])

  return [block, []]
}

function normalize_ForInStatement(node, scope) {
  const exps = []

  const [left, leftExps]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [right, rightExps]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope)
  const [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  exps.push(...leftExps)
  exps.push(...rightExps)

  const forInStatement = createForInStatement(Array.isArray(left) ? left[0] : left, right, body)
  return [forInStatement, exps]
}

function normalize_ForOfStatement(node, scope) {
  const exps = []

  const [left, leftExps]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [right, rightExps]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope)
  const [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  exps.push(...leftExps)
  exps.push(...rightExps)

  const forOfStatement = createForOfStatement(left, right, body)
  return [forOfStatement, exps]
}

function normalize_FunctionDeclaration(node, scope) {
  const exps = []
  const params = []
  node.params.forEach(param => {
    const [p, pExps]
      = normalizeProperty(node.type, 'params', param.type, param, scope)
    // TODO: move this inside the function.
    exps.push(...pExps)
    params.push(p)
  })

  const [body]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  return [
    createFunctionDeclaration(node.id, params, body),
    exps
  ]
}

function normalize_VariableDeclaration(node, scope) {
  const exps = []
  const declarations = []
  node.declarations.forEach(dec => {
    const [declarators, expressions] = normalize_VariableDeclarator(dec, scope)
    exps.push(...expressions)
    declarators.forEach(declarator => {
      declarations.push(createVariableDeclaration(node.kind, [declarator]))
    })
  })
  return [declarations, exps]
}

function normalize_VariableDeclarator(node, scope) {
  const exps = []
  const [id, idExps] = normalizeProperty(node.type, 'id', node.id.type, node.id, scope)
  const [init, initExps] = normalizeProperty(node.type, 'init', node.init?.type ?? null, node.init, scope, false)
  exps.push(...idExps)
  exps.push(...initExps)
  const declarators = []
  // TODO: handle nested of these more carefully.
  if (id.type === 'ArrayPattern') {
    id.elements.forEach((i, _i) => {
      declarators.push(
        createVariableDeclarator(i,
          createMemberExpression(init, createLiteral(_i), true)
        )
      )
    })
  // TODO: handle nested of these more carefully.
  } else if (id.type === 'ObjectPattern') {
    id.properties.forEach((i, _i) => {
      declarators.push(
        createVariableDeclarator(i.value,
          createMemberExpression(init, i.key)
        )
      )
    })
  } else {
    declarators.push(createVariableDeclarator(id, init))
  }
  return [
    declarators,
    exps
  ]
}

function normalize_ThisExpression(node, scope) {
  return [
    node,
    []
  ]
}

function normalize_ArrayExpression(node, scope, isolate) {
  const exps = []
  const array = []
  node.elements.forEach(element => {
    const [el, elExps] = normalizeProperty(node.type, 'elements', element.type, element, scope, false)
    array.push(el)
    exps.push(...elExps)
  })

  const arrayExp = createArrayExpression(array)
  if (isolate == 'hey') {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariable('const',
        createIdentifier(name),
        arrayExp
      )
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      arrayExp,
      exps
    ]
  }
}

function normalize_ObjectExpression(node, scope, isolate) {
  const exps = []
  const array = []
  node.properties.forEach(prop => {
    const [el, elExps] = normalizeProperty(node.type, 'properties', prop.type, prop, scope, false)
    array.push(el)
    exps.push(...elExps)
  })
  const objectExp = createObjectExpression(array)
  if (isolate) {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariable('const',
        createIdentifier(name),
        objectExp
      )
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      objectExp,
      exps
    ]
  }
}

function normalize_Property(node, scope) {
  if (node.type === 'SpreadElement') {
    return normalizeSpreadElement(node, scope)
  } else if (node.type === 'ObjectPattern') {
    throw new Error
  }
  const exps = []
  const [key, keyExps] = normalizeProperty(node.type, 'key', node.key.type, node.key, scope)
  const [value, valueExps] = normalizeProperty(node.type, 'value', node.value.type, node.value, scope)
  exps.push(...keyExps)
  exps.push(...valueExps)
  return [createProperty(key, value), exps]
}

function normalize_FunctionExpression(node, scope) {
  const exps = []
  const params = []
  node.params.forEach(param => {
    const [p, pExps] = normalizeProperty(node.type, 'params', param.type, param, scope)
    exps.push(...pExps)
    params.push(p)
  })
  const [body] = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)
  return [
    createFunctionExpression(node.id, params, body),
    exps
  ]
}

function normalize_ArrowFunctionExpression(node, scope) {
  const exps = []
  const params = []

  node.params.forEach(param => {
    const [p, pExps] = normalizeProperty(node.type, 'params', param.type, param, scope)
    exps.push(...pExps)
    params.push(p)
  })

  let [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  if (body.type !== 'BlockStatement') {
    body = createBlockStatement([...bodyExps, createReturnStatement(body)])
  }

  return [
    createArrowFunctionExpression(node.id, params, body),
    exps
  ]
}

function normalize_YieldExpression(node, scope) {

}

function normalize_TemplateLiteral(node, scope) {
  const exps = []
  const quasis = []
  const expressions = []
  node.expressions.forEach(expression => {
    const [exp, expExps] = normalizeProperty(node.type, 'expressions', expression.type, expression, scope, true)
    expressions.push(exp)
    exps.push(...expExps)
  })
  node.quasis.forEach(q => {
    const [el] = normalizeProperty(node.type, 'quasis', q.type, q, scope)
    quasis.push(el)
  })
  return [
    createTemplateLiteral(expressions, quasis),
    exps
  ]
}

function normalize_TaggedTemplateExpression(node, scope) {
  const [tag, tagExps]
    = normalizeProperty(node.type, 'tag', node.tag.type, node.tag, scope)
  const [template, templateExps]
    = normalizeProperty(node.type, 'quasi', node.quasi.type, node.quasi, scope)
  return [
    createTaggedTemplateExpression(tag, template),
    [...templateExps, ...tagExps]
  ]
}

function normalize_TemplateElement(node, scope) {
  return [node, []]
}

function normalize_UnaryExpression(node, scope, isolate) {
  const exps = []
  const [argument, argumentExps]
    = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope, false)

  exps.push(...argumentExps)

  const unary = createUnaryExpression(argument, node.operator, node.prefix)
  if (isolate) {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariable('const',
        createIdentifier(name),
        unary
      )
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      unary,
      exps
    ]
  }
}

function normalize_UpdateExpression(node, scope, isolate) {
  const [argument, argumentExps]
    = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope, false)

  const update = createUpdateExpression(argument, node.operator, node.prefix)

  if (isolate) {
    const name = `tmp${scope.index++}`
    argumentExps.push(
      createVariable('const',
        createIdentifier(name),
        update
      )
    )
    return [
      createIdentifier(name),
      argumentExps
    ]
  } else {
    return [
      update,
      argumentExps
    ]
  }
}

function normalize_BinaryExpression(node, scope, isolate) {
  const exps = []
  const [left, leftExps]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope, false)
  const [right, rightExps]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope, false)

  exps.push(...leftExps)
  exps.push(...rightExps)

  const binary = createBinaryExpression(
    left,
    node.operator,
    right
  )

  if (isolate) {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariable('const',
        createIdentifier(name),
        binary
      )
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      binary,
      exps
    ]
  }
}

function normalize_AssignmentExpression(node, scope, isolate) {
  const [left, leftExps] = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)

  let values = [left]
  let operators = [node.operator]
  let right = node.right
  while (right.type === 'AssignmentExpression') {
    values.push(right.left)
    operators.push(right.operator)
    right = right.right
  }

  let [furthestRight, furthestRightExps] = normalizeProperty(node.type, 'right', right.type, right, scope, false)
  values.push(furthestRight)

  const exps = [
    ...leftExps,
    ...furthestRightExps
  ]

  if (left.type === 'ArrayPattern') {
    const assignments = []
    left.elements.forEach(el => {
      assignments.push(
        createAssignmentExpression(
          el,
          createMemberExpression(right, el),
          node.operator
        )
      )
    })

    return [
      assignments,
      exps
    ]
  } else {
    let assignments = []
    let i = 0
    let n = values.length - 1
    while (i < n) {
      let l = values[i]
      let r = values[i + 1]
      const assignment = createAssignmentExpression(l, r, operators[i])
      assignments.push(assignment)
      i++
    }
    assignments = assignments.reverse()
    let assignment
    if (isolate) {
      assignment = assignments[assignments.length - 1].left
    } else {
      assignment = assignments.pop()
    }
    return [
      assignment,
      exps.concat(assignments)
    ]
  }
}

function normalize_LogicalExpression(node, scope, isolate) {
  const exps = []
  const [left, leftExps]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope, false)
  const [right, rightExps]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope, false)

  exps.push(...leftExps)
  exps.push(...rightExps)

  const logicalExp = createLogicalExpression(
    left,
    node.operator,
    right
  )

  if (isolate) {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariable('const',
        createIdentifier(name),
        logicalExp
      )
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      logicalExp,
      exps
    ]
  }
}

function normalize_MemberExpression(node, scope) {
  const exps = []
  const [object, objectStatements]
    = normalizeProperty(node.type, 'object', node.object.type, node.object, scope, true)
  const [property, propertyStatements]
    = normalizeProperty(node.type, 'property', node.property.type, node.property, scope, true)
  exps.push(...objectStatements)
  exps.push(...propertyStatements)
  return [
    createMemberExpression(
      object,
      property,
      node.computed
    ),
    exps
  ]
}

function normalize_ConditionalExpression(node, scope, isolate) {
  const exps = []

  const [test, testExps]
    = normalizeProperty(node.type, 'test', node.test.type, node.test, scope, true)
  const [consequent, consequentExps]
    = normalizeProperty(node.type, 'consequent', node.consequent.type, node.consequent, scope, true)
  const [alternate, alternateExps]
    = normalizeProperty(node.type, 'alternate', node.alternate.type, node.alternate, scope, true)

  exps.push(...testExps)
  exps.push(...consequentExps)
  exps.push(...alternateExps)

  const name = `tmp${scope.index++}`

  const conditional = createIfStatement(
    test,
    createBlockStatement([createAssignmentExpression(createIdentifier(name), consequent)]),
    createBlockStatement([createAssignmentExpression(createIdentifier(name), alternate)])
  )

  exps.push(
    createVariable('let',
      createIdentifier(name)
    ),
    conditional
  )
  return [
    createIdentifier(name),
    exps
  ]
}

function normalize_CallExpression(node, scope, isolate) {
  const [_callee, calleeExps]
    = normalizeProperty(node.type, 'callee', node.callee.type, node.callee, scope, true)

  const args = []
  const exps = []

  node.arguments.forEach(arg => {
    const [argument, argumentExps]
      = normalizeProperty(node.type, 'arguments', arg.type, arg, scope, false)
    exps.push(...argumentExps)
    args.push(argument)
  })
  exps.push(...calleeExps)
  if (isolate) {
    const name = `tmp${scope.index++}`
    exps.push(
      createVariableDeclaration('const', [
        createVariableDeclarator(
          createIdentifier(name),
          createCallExpression(_callee, args)
        )
      ])
    )
    return [
      createIdentifier(name),
      exps
    ]
  } else {
    return [
      createCallExpression(_callee, args),
      exps
    ]
  }
}

function normalize_NewExpression(node, scope) {
  const exps = []
  const [ctor, ctorExps]
    = normalizeProperty(node.type, 'callee', node.callee.type, node.callee, scope)
  const argExps = []
  const args = []
  node.arguments.forEach(arg => {
    const [argument, argumentExps]
      = normalizeProperty(node.type, 'arguments', arg.type, arg, scope, false)
    args.push(argument)
    argExps.push(...argumentExps)
  })
  exps.push(...ctorExps, ...argExps)
  return [
    createNewExpression(ctor, args),
    exps
  ]
}

function normalize_SequenceExpression(node, scope) {
  const expressions = []
  // this just flattens the list and gets rid of the node type
  // in the normalized output
  node.expressions.forEach(exp => {
    const exps = normalizeType(exp.type, exp, scope)
    expressions.push(...exps)
  })
  return expressions
}

function normalize_SpreadElement(node, scope) {
  const [arg, argExps]
    = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope, true)
  return [
    createSpreadElement(arg),
    argExps
  ]
}

function normalize_ArrayPattern(node, scope) {
  const array = []
  const exps = []
  node.elements.forEach(element => {
    const [el, elExps] = normalizeProperty(node.type, 'elements', element.type, element, scope)
    array.push(el)
    exps.push(...elExps)
  })
  return [
    createArrayPattern(array),
    exps
  ]
}

function normalize_ObjectPattern(node, scope) {
  const exps = []
  const properties = []
  node.properties.forEach(p => {
    const [prop, propExps]
      = normalizeProperty(node.type, 'properties', p.type, p, scope)
    exps.push(...propExps)
    properties.push(prop)
  })
  return [
    createObjectPattern(properties),
    exps
  ]
}

function normalize_RestElement(node, scope) {
  const [arg, argExps]
    = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope)
  return [
    createRestElement(arg),
    argExps
  ]
}

function normalize_AssignmentPattern(node, scope) {
  const exps = []
  const [left] = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [right, rightExps] = normalizeProperty(node.type, 'right', node.right.type, node.right, scope, true)
  exps.push(...rightExps)
  return [
    createAssignmentPattern(left, right),
    exps
  ]
}

function normalize_ClassBody(node, scope) {
  const exps = []
  const body = []
  node.body.forEach(bd => {
    const [method, methodExps] = normalizeProperty(node.type, 'body', bd.type, bd, scope)
    exps.push(...methodExps)
    body.push(method)
  })
  return [createClassBody(body), exps]
}

function normalize_MethodDefinition(node, scope) {
  const [key, keyExps]
    = normalizeProperty(node.type, 'key', node.key.type, node.key, scope)
  const [value, valueExps]
    = normalizeProperty(node.type, 'value', node.value.type, node.value, scope)

  return [createMethodDefinition(key, value, node.kind, node.computed, node.static), keyExps]
}

function normalize_ClassDeclaration(node, scope) {
  const exps = []

  const [id, idExps]
    = normalizeProperty(node.type, 'id', node.id?.type ?? null, node.id, scope)
  const [superClass, superClassExps]
    = normalizeProperty(node.type, 'superClass', node.superClass?.type ?? null, node.superClass, scope)
  const [body, bodyExps]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  exps.push(...idExps)
  exps.push(...superClassExps)
  exps.push(...bodyExps)

  return [createClassDeclaration(id, superClass, body), exps]
}

function normalize_ClassExpression(node, scope) {

}

function normalize_MetaProperty(node, scope) {

}

function normalize_ModuleDeclaration(node, scope) {

}

function normalize_ModuleSpecifier(node, scope) {

}

function normalize_ImportDeclaration(node, scope) {

}

function normalize_ImportSpecifier(node, scope) {

}

function normalize_ImportDefaultSpecifier(node, scope) {

}

function normalize_ImportNamespaceSpecifier(node, scope) {

}

function normalize_ExportNamedDeclaration(node, scope) {
  const declaration = normalizeBodyNode(node.declaration, scope)
  const specifiers = []
}

function normalize_ExportSpecifier(node, scope) {

}

function normalize_ExportDefaultDeclaration(node, scope) {

}

function normalize_ExportAllDeclaration(node, scope) {

}

function normalize_AwaitExpression(node, scope) {

}

function normalize_ImportExpression(node, scope) {

}

function call(obj, method, ...args) {
  if (!obj.hasOwnProperty(method)) {
    throw new Error(`Missing method ${method}`)
  }

  return obj[method](...args)
}

function buildNormalizers(types) {
  const normalizers = {
    normalize_null
  }
  Object.keys(types).forEach(type => {
    const def = types[type]
    normalizers[`normalize_${type}`] = buildNormalizeTypeFunction(type, def)
  })
  Object.keys(types).forEach(type => {
    const def = types[type]
    def.extends.type.forEach(extend => {
      const parent = types[extend]
      Object.keys(parent.properties).forEach(name => {
        def.properties[name]
          = def.properties[name]
          || parent.properties[name]
      })
      Object.keys(def.properties).forEach(name => {
        const searchableTypes = []
        const stack = [...def.properties[name].type]
        const processed = {}
        while (stack.length) {
          const propertyTypeName = stack.shift()
          if (processed[propertyTypeName]) {
            continue
          }
          processed[propertyTypeName] = true
          searchableTypes.push(propertyTypeName)
          const propertyType = types[propertyTypeName]
          if (propertyType) {
            propertyType.extends.type.forEach(ext => {
              stack.push(ext)
            })
          }
          Object.keys(types).forEach(childTypeName => {
            const childType = types[childTypeName]
            if (childType.extends.type.includes(propertyTypeName)) {
              searchableTypes.push(childTypeName)
              stack.push(childTypeName)
            }
          })
        }

        searchableTypes.forEach(searchedType => {
          if (normalizers[`normalize_${searchedType}`]) {
            normalizers[`normalize_${type}_${name}_${searchedType}`] = buildNormalizePropertyType(searchedType)
          }
        })
      })
    })
  })
  return normalizers
}

function buildNormalizePropertyType(propertyType) {
  return function(node, scope, isolate) {
    return normalizeType(propertyType, node, scope, isolate)
  }
}

function buildNormalizeTypeFunction(type, def) {
  return function(node, scope, isolate) {
    const object = { type }
    const expressions = []
    Object.keys(def.properties).forEach(name => {
      const property = def.properties[name]
      if (property.list) {
        const list = object[name] = []
        const propertyNodes = node[name] ?? []
        propertyNodes.forEach(propertyNode => {
          const [normalizedPropertyNode, normalizedExpressions]
            = normalizeProperty(type, name, propertyNode.type, propertyNode, scope, isolate)
          list.push(normalizedPropertyNode)
          expressions.push(...normalizedExpressions)
        })
      } else {
        const propertyNode = node[name]
        const [normalizedPropertyNode, normalizedExpressions]
          = normalizeProperty(type, name, propertyNode?.type ?? null, propertyNode, scope, isolate)
        object[name] = normalizedPropertyNode
        expressions.push(...normalizedExpressions)
      }
    })
    expressions.push(object)
    return expressions
  }
}
