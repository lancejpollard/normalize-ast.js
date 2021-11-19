
const acorn = require('acorn')
const print = require('./print')
const {
  createProgram,
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
  return normalizeType(input.type, input, { index: 0 })
}

// function normalize_Program(node, scope) {
//   const body = normalize_Program_body(node.body, scope)
//   return createProgram(body)
// }

function normalizeType(type, ...args) {
  return call(normalizers, `normalize_${type}`, ...args)
}

function normalizeProperty(type, property, propertyType, ...args) {
  return call(normalizers, `normalize_${type}_${property}_${propertyType}`, ...args)
}

function normalize_Program_body(array) {
  const body = []
  array.forEach(node => {
    const [normalizedNode, normalizedExpressions]
      = normalizeProperty('Program', 'body', node.type, node, scope)
    body.push(...normalizedExpressions)
    body.push(normalizedNode)
  })
  return body
}

const normalizers = {
  ...buildNormalizers(types),
  normalize_Identifier,
  normalize_Literal,
  normalize_Program,
  normalize_Function,
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
  normalize_Declaration,
  normalize_FunctionDeclaration,
  normalize_VariableDeclaration,
  normalize_VariableDeclarator,
  normalize_Expression,
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
  normalize_Pattern,
  normalize_SpreadElement,
  normalize_ArrayPattern,
  normalize_ObjectPattern,
  normalize_RestElement,
  normalize_AssignmentPattern,
  normalize_Class,
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
}

function normalize_Identifier(node, scope) {

}

function normalize_Literal(node, scope) {

}

function normalize_Program(node, scope) {

}

function normalize_Super(node, scope) {

}

function normalize_ExpressionStatement(node, scope) {

}

function normalize_Directive(node, scope) {

}

function normalize_BlockStatement(node, scope) {
  const body = []

  node.body.forEach(bd => {
    const [...expressions, data] = normalizeType(bd.type, bd, scope)
    body.push(...expressions)
    if (Array.isArray(data)) {
      body.push(...data)
    } else {
      body.push(data)
    }
  })

  return createBlockStatement(body)
}

function normalize_FunctionBody(node, scope) {

}

function normalize_EmptyStatement(node, scope) {

}

function normalize_DebuggerStatement(node, scope) {

}

function normalize_WithStatement(node, scope) {

}

function normalize_ReturnStatement(node, scope) {
  const exps = []
  const [...argumentExps, argument]
    = normalizeProperty(node.type, 'argument', node.argument.type, node.argument, scope, true)
  exps.push(...argumentExps)
  exps.push(createReturnStatement(argument))
  return exps
}

function normalize_LabeledStatement(node, scope) {

}

function normalize_BreakStatement(node, scope) {

}

function normalize_ContinueStatement(node, scope) {

}

function normalize_IfStatement(node, scope) {
  const top = []
  const [test, testExpressionStatements] = normalizeExpression(node.test, scope, true)
  top.push(...testExpressionStatements)
  let consequent = []
  if (node.consequent.type === 'BlockStatement') {
    node.consequent.body.forEach(statement => {
      const cons = normalizeBodyNode(statement, scope)
      consequent.push(...cons)
    })
  } else {
    consequent.push(...normalizeExpressionStatement(node.consequent, scope))
  }
  consequent = createBlockStatement(consequent)
  let alternate = null
  if (node.alternate) {
    if (node.alternate.type === 'BlockStatement') {
      alternate = []
      node.alternate.body.forEach(statement => {
        const alts = normalizeBodyNode(statement, scope)
        alternate.push(...alts)
      })
      alternate = createBlockStatement(alternate)
    } else {
      [alternate, altExpressionStatements] = normalizeIfStatement(node.alternate, scope)
      top.push(...altExpressionStatements)
    }
  }

  const ifStatement = createIfStatement(test, consequent, alternate)
  return [ifStatement, top]
}

function normalize_SwitchStatement(node, scope) {
  const discriminant = normalizeExpression(node.discriminant)
  return []
}

function normalize_SwitchCase(node, scope) {

}

function normalize_ThrowStatement(node, scope) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope)
  return [
    createThrowStatement(argument),
    argumentExps
  ]
}

function normalize_TryStatement(node, scope) {

}

function normalize_CatchClause(node, scope) {

}

function normalize_BigIntLiteral(node, scope) {

}

function normalize_WhileStatement(node, scope) {
  const [test, testExps] = normalizeExpression(node.test, scope, true)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, scope))
  })
  const newBody = [...testExps, createIfStatement(test, createBlockStatement(body), createBlockStatement([createBreakStatement()]))]
  const whileStatement = createWhileStatement(createLiteral(true), newBody)
  return [whileStatement, []]
}

function normalize_DoWhileStatement(node, scope) {

}

function normalize_ForStatement(node, scope) {
  const initExps = normalizeProperty(node.type, 'init', node.init?.type ?? null, node.init, scope)
  const [...testExps, test] = normalizeProperty(node.type, 'test', node.test?.type ?? null, node.test, scope)
  const [...updateExps, update] = normalizeProperty(node.type, 'update', node.update.type, node.update, scope)
  const [...bodyExps, body] = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  const block = createBlockStatement([
    ...initExps,
    createWhileStatement(
      createLiteral(true),
      [
        ...testExps,
        createIfStatement(test,
          createBlockStatement([
            ...body,
            ...updateExps,
            update
          ]),
          createBlockStatement([
            createBreakStatement()
          ])
        )
      ]
    )
  ])

  return block
}

function normalize_ForInStatement(node, scope) {
  const exps = []
  const [...leftExps, left]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [...rightExps, right]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope)
  exps.push(...leftExps)
  exps.push(...rightExps)
  const [...bodyExps, body]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)
  const forInStatement = createForInStatement(left, right, body)
  return [forInStatement, output]
}

function normalize_ForOfStatement(node, scope) {
  const exps = []

  const [...leftExps, left]
    = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [...rightExps, right]
    = normalizeProperty(node.type, 'right', node.right.type, node.right, scope)
  const [...bodyExps, body]
    = normalizeProperty(node.type, 'body', node.body.type, node.body, scope)

  exps.push(...leftExps)
  exps.push(...rightExps)

  const forOfStatement = createForOfStatement(left, right, body)
  return [forOfStatement, exps]
}

function normalize_FunctionDeclaration(node, scope) {
  const output = []
  const params = []
  node.params.forEach(param => {
    const [p, pExpressionStatements] = normalizeFunctionParam(param, scope)
    output.push(...pExpressionStatements)
    params.push(p)
  })
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, scope))
  })
  output.push(createFunctionDeclaration(node.id, params, body))
  return output
}

function normalize_VariableDeclaration(node, scope) {
  const exps = []
  const declarations = []
  node.declarations.forEach(dec => {
    const [...expressions, declarators] = normalize_VariableDeclarator(node, dec, scope)
    exps.push(...expressions)
    declarators.forEach(declarator => {
      declarations.push(createVariableDeclaration(node.kind, [declarator]))
    })
  })
  exps.push(...declarations)
  return exps
}

function normalize_VariableDeclarator(node, scope) {
  const exps = []
  const [...idExps, id] = normalizeProperty('VariableDeclarator', 'id', node.id.type, node.id, scope)
  const [...initExps, init] = normalizeProperty('VariableDeclarator', 'init', node.init.type, node.init, scope)
  exps.push(...idExps)
  exps.push(...initExps)
  const declarators = []

  if (Array.isArray(id)) {
    id.forEach(i => {
      declarators.push(
        createVariableDeclarator(i,
          createMemberExpression(init, i)
        )
      )
    })
  } else {
    declarators.push(createVariableDeclarator(id, init))
  }
  exps.push(declarators)
  return exps
}

function normalize_ThisExpression(node, scope) {
  output.push(node)
}

function normalize_ArrayExpression(node, scope) {
  const array = []
  node.elements.forEach(element => {
    const [el, elExpressionStatements] = normalizeExpression(element, scope)
    array.push(el)
    expressionStatements.push(...elExpressionStatements)
  })
  output.push(createArrayExpression(array))
}

function normalize_ObjectExpression(node, scope) {
  const array = []
  node.properties.forEach(prop => {
    const [el, elExpressionStatements] = normalizeExpression(prop, scope)
    array.push(el)
    expressionStatements.push(...elExpressionStatements)
  })
  const objectExp = createObjectExpression(array)
  if (isolate) {
    const name = `tmp${scope.index++}`
    expressionStatements.push(
      createVariable('const',
        createIdentifier(name),
        objectExp
      )
    )
    output.push(createIdentifier(name))
  } else {
    output.push(objectExp)
  }
}

function normalize_Property(node, scope) {
  if (node.type === 'SpreadElement') {
    return normalizeSpreadElement(node, scope)
  }
  const output = []
  const [key, keyExpressionStatements] = normalizeExpression(node.key, scope)
  const [value, valueExpressionStatements] = normalizeExpression(node.value, scope)
  output.push(...keyExpressionStatements)
  output.push(...valueExpressionStatements)
  return [createProperty(key, value), output]
}

function normalize_FunctionExpression(node, scope) {
  const childScope = scope
  const output = []
  const params = []
  node.params.forEach(param => {
    const [p, pExpressionStatements] = normalizeFunctionParam(param, childScope)
    output.push(...pExpressionStatements)
    params.push(p)
  })
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, childScope))
  })
  output.push(createFunctionExpression(node.id, params, body))
  return output
}

function normalize_ArrowFunctionExpression(node, scope) {
  const output = []
  const params = []
  node.params.forEach(param => {
    const [p, pExpressionStatements] = normalizeFunctionParam(param, scope)
    output.push(...pExpressionStatements)
    params.push(p)
  })
  const normalizers = {
    CallExpression() {
      [body, expressions] = normalizeExpression(node.body, scope, true);
      body = createBlockStatement([
        ...expressions,
        body
      ])
    },

    ArrayExpression() {
      [body, expressions] = normalizeExpression(node.body, scope);
      body = createBlockStatement([
        ...expressions,
        createReturnStatement(body),
      ])
    },

    ObjectExpression() {
      [body, expressions] = normalizeExpression(node.body, scope);
      body = createBlockStatement([
        ...expressions,
        createReturnStatement(body),
      ])
    },

    BlockStatement() {
      body = []
      const childScope = scope
      node.body.body.forEach(bd => {
        body.push(...normalizeBodyNode(bd, childScope))
      })
      body = createBlockStatement(body)
    },

    BinaryExpression() {
      [body, expressions] = normalizeExpression(node.body, scope);
      body = createBlockStatement([
        ...expressions,
        createReturnStatement(body),
      ])
    }
  }
  let body
  call(normalizers, node.body.type)
  return [
    createArrowFunctionExpression(node.id, params, body),
    output
  ]
}

function normalize_YieldExpression(node, scope) {

}

function normalize_TemplateLiteral(node, scope) {
  const quasis = []
  const expressions = []
  const exps = []
  node.expressions.forEach(expression => {
    const [exp, expExps] = normalizeExpression(expression, scope)
    expressions.push(exp)
    exps.push(...expExps)
  })
  node.quasis.forEach(q => {
    quasis.push(normalizeTemplateElement(q, scope))
  })
  return [
    createTemplateLiteral(expressions, quasis),
    exps
  ]
}

function normalize_TaggedTemplateExpression(node, scope) {
  const [tag, tagExps] = normalizeExpression(node.tag, scope)
  const [template, templateExps] = normalizeTemplateLiteral(node.quasi, scope)
  return [
    createTaggedTemplateExpression(tag, template),
    [...templateExps, ...tagExps]
  ]
}

function normalize_TemplateElement(node, scope) {
  return node
}

function normalize_UnaryExpression(node, scope) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope, isolate)
  return [
    createUnaryExpression(argument, node.operator, node.prefix),
    argumentExps
  ]
  // const [update, updateExps] = normalizeUnaryExpression(node, scope, isolate)
  // expressionStatements.push(...updateExps)
  // if (isolate) {
  //   const name = `tmp${scope.index++}`
  //   expressionStatements.push(
  //     createVariable('const',
  //       createIdentifier(name),
  //       update
  //     )
  //   )
  //   output.push(createIdentifier(name))
  // } else {
  //   output.push(update)
  // }
}

function normalize_UpdateExpression(node, scope) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope)
  return [
    createUpdateExpression(argument, node.operator, node.prefix),
    argumentExps
  ]
}

function normalize_BinaryExpression(node, scope) {
  const [left, leftExpressionStatements] = normalizeExpression(node.left, scope, true)
  const [right, rightExpressionStatements] = normalizeExpression(node.right, scope, true)
  expressionStatements.push(...leftExpressionStatements)
  expressionStatements.push(...rightExpressionStatements)
  const binary = createBinaryExpression(
    left,
    node.operator,
    right
  )
  if (isolate) {
    const name = `tmp${scope.index++}`
    expressionStatements.push(
      createVariable('const',
        createIdentifier(name),
        binary
      )
    )
    output.push(createIdentifier(name))
  } else {
    output.push(binary)
  }
}

function normalize_AssignmentExpression(node, scope) {
  const [...leftExps, left] = normalizeProperty(node.type, 'left', node.left.type, node.left, scope)
  const [...rightExps, right] = normalizeProperty(node.type, 'right', node.right.type, node.right, scope)
  const exps = [
    ...leftExps,
    ...rightExps,
    createAssignmentExpression(left, right, node.operator)
  ]
  return exps

  // if node.left.type === 'ArrayPattern'
  // const [left, leftExpressionStatements] = normalizeExpression(node.left, scope)
  // const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
  // output.push(...leftExpressionStatements)
  // output.push(...rightExpressionStatements)
  // if (Array.isArray(left)) {
  //   const name = `tmp${scope.index++}`
  //   output.push(createExpressionStatement(
  //     createAssignmentExpression(
  //       createIdentifier(name),
  //       right
  //     )
  //   ))
  //   left.forEach(l => {
  //     output.push(createExpressionStatement(
  //       createAssignmentExpression(l,
  //         createMemberExpression(
  //           createIdentifier(name), l))
  //     ))
  //   })
  // } else {
  //   output.push(createExpressionStatement(
  //     createAssignmentExpression(left, right)
  //   ))
  // }
}

function normalize_LogicalExpression(node, scope) {
  const [left, leftExpressionStatements] = normalizeExpression(node.left, scope, true)
  const [right, rightExpressionStatements] = normalizeExpression(node.right, scope, true)
  expressionStatements.push(...leftExpressionStatements)
  expressionStatements.push(...rightExpressionStatements)
  const logicalExp = createLogicalExpression(
    left,
    node.operator,
    right
  )
  if (isolate) {
    const name = `tmp${scope.index++}`
    expressionStatements.push(
      createVariable('const',
        createIdentifier(name),
        logicalExp
      )
    )
    output.push(createIdentifier(name))
  } else {
    output.push(logicalExp)
  }
}

function normalize_MemberExpression(node, scope) {
  const [object, objectStatements] = normalizeExpression(node.object, scope)
  const [property, propertyStatements] = normalizeExpression(node.property, scope)
  output.push(...objectStatements)
  output.push(...propertyStatements)
  output.push(createExpressionStatement(
    createMemberExpression(
      object,
      property,
      node.computed
    ))
  )
}

function normalize_ConditionalExpression(node, scope) {
  const [test, testExpressionStatements] = normalizeExpression(node.test, scope, true)
  const [consequent, consequentExpressionStatements] = normalizeExpression(node.consequent, scope, true)
  const [alternate, alternateExpressionStatements] = normalizeExpression(node.alternate, scope, true)
  expressionStatements.push(...testExpressionStatements)
  expressionStatements.push(...consequentExpressionStatements)
  expressionStatements.push(...alternateExpressionStatements)
  const conditional = createConditionalExpression(
    test,
    consequent,
    alternate
  )
  if (isolate) {
    const name = `tmp${scope.index++}`
    expressionStatements.push(
      createVariable('const',
        createIdentifier(name),
        conditional
      )
    )
    output.push(createIdentifier(name))
  } else {
    output.push(conditional)
  }
}

function normalize_CallExpression(node, scope) {
  const [_callee, calleeStatements] = normalizeExpression(node.callee, scope, isolate)
  const args = []
  node.arguments.forEach(arg => {
    const [argument, argumentStatements] = normalizeExpression(arg, scope, true)
    expressionStatements.push(...argumentStatements)
    args.push(argument)
  })
  expressionStatements.push(...calleeStatements)
  const name = `tmp${scope.index++}`
  output.push(createIdentifier(name))
  expressionStatements.push(
    createVariableDeclaration('const', [
      createVariableDeclarator(
        createIdentifier(name),
        createCallExpression(_callee, args)
      )
    ])
  )
}

function normalize_NewExpression(node, scope) {
  const [ctor, ctorExps] = normalizeExpression(node.callee, scope)
  const argExps = []
  const args = []
  node.arguments.forEach(arg => {
    const [argument, argumentExps] = normalizeExpression(arg, scope, true)
    args.push(argument)
    argExps.push(...argumentExps)
  })
  return [createNewExpression(ctor, args), ctorExps.concat(argExps)]
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
  const [arg, argExps] = normalizeExpression(node.argument, scope)
  return [
    createSpreadElement(arg),
    argExps
  ]
}

function normalize_ArrayPattern(node, scope) {
  const array = []
  node.elements.forEach(element => {
    const [el, elExpressionStatements] = normalizeExpression(element, scope)
    array.push(el)
    expressionStatements.push(...elExpressionStatements)
  })
  output.push(array)
}

function normalize_ObjectPattern(node, scope) {

}

function normalize_RestElement(node, scope) {
  const [arg, argExps] = normalizeExpression(node.argument, scope)
  return [
    createRestElement(arg),
    argExps
  ]
}

function normalize_AssignmentPattern(node, scope) {
  const [left] = normalizeExpression(node.left, scope)
  const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
  expressionStatements.push(...rightExpressionStatements)
  // TODO: do inside the function.
  output.push(
    createAssignmentPattern(left, right)
  )
}

function normalize_ClassBody(node, scope) {
  const body = []
  const output = []
  node.body.forEach(bd => {
    const [method, methodExps] = normalizeMethodDefinition(bd, scope)
    output.push(...methodExps)
    body.push(method)
  })
  return [createClassBody(body), output]
}

function normalize_MethodDefinition(node, scope) {
  const [...keyExps, key] = normalizeProperty(node.type, 'key', node.key.type, node.key, scope)
  const [...valueExps, value] = normalizeProperty(node.type, 'value', node.value.type, node.value, scope)
  // return [createMethodDefinition(key, value.pop()), keyExps]
}

function normalize_ClassDeclaration(node, scope) {
  const [id, idExps] = normalizeExpression(node.id, scope)
  const output = [...idExps]
  const superClass = null
  const [body, bodyExps] = normalizeClassBody(node.body, scope)
  output.push(...bodyExps)
  return [createClassDeclaration(id, superClass, body), output]
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
  const normalizers = {}
  Object.keys(types).forEach(type => {
    const def = types[type]
    normalizers[`normalize_${type}`] = buildNormalizeTypeFunction(type, def)
    def.extends.forEach(extend => {
      const parent = types[extend]
      Object.keys(parent.properties).forEach(name => {
        def.properties[name]
          = def.properties[name]
          || parent.properties[name]
      })
      Object.keys(def.properties).forEach(name => {
        const property = def.properties[name]
        property.type.forEach(propertyType => {
          normalizers[`normalize_${type}_${name}_${propertyType}`] = buildNormalizePropertyType(type, def, property, propertyType)
        })
      })
    })
  })
}

function buildNormalizePropertyType(type, def, property, propertyType) {
  return function(node, scope, isolate) {
    return normalizeProperty(type, property, propertyType, node, scope, isolate)
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
          const [...normalizedExpressions, normalizedPropertyNode]
            = normalizeProperty(type, name, propertyNode.type, propertyNode, scope, isolate)
          list.push(normalizedPropertyNode)
          expressions.push(...normalizedExpressions)
        })
      } else {
        const propertyNode = node[name]
        const [...normalizedExpressions, normalizedPropertyNode]
          = normalizeProperty(type, name, propertyNode?.type ?? null, propertyNode, scope, isolate)
        object[name] = normalizedPropertyNode
        expressions.push(...normalizedExpressions)
      }
    })
    expressions.push(object)
    return expressions
  }
}
