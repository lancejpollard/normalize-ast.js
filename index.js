
const acorn = require('acorn')
const print = require('./print')
const {
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

module.exports = {
  parse,
  print,
  normalize
}

function parse(string) {
  return acorn.parse(string, { ecmaVersion: 2021, sourceType: 'module' })
}

function normalize(input) {
  const output = {
    type: 'Program',
    body: []
  }
  const scope = {
    index: 0,
  }

  input.body.forEach(node => {
    output.body.push(...normalizeBodyNode(node, scope))
  })

  return output
}

function normalizeBodyNode(node, scope) {
  const output = []
  const normalizers = {
    VariableDeclaration() {
      const declarations = normalizeVariableDeclaration(node, scope)
      output.push(...declarations)
    },

    ExpressionStatement() {
      const expressions = normalizeExpressionStatement(node.expression, scope)
      output.push(...expressions)
    },

    FunctionDeclaration() {
      output.push(...normalizeFunctionDeclaration(node, scope))
    },

    ReturnStatement() {
      output.push(...normalizeReturnStatement(node, scope))
    },

    IfStatement() {
      const [ifStatement, expressions] = normalizeIfStatement(node, scope)
      output.push(...expressions)
      output.push(ifStatement)
    },

    SwitchStatement() {
      const [swtch, expressions] = normalizeSwitchStatement(node, scope)
    },

    ForInStatement() {
      const [forInStatement, expressions] = normalizeForInStatement(node, scope)
      output.push(...expressions)
      output.push(forInStatement)
    },

    ForOfStatement() {
      const [forOfStatement, expressions] = normalizeForOfStatement(node, scope)
      output.push(...expressions)
      output.push(forOfStatement)
    },

    WhileStatement() {
      const [whileStatement, expressions] = normalizeWhileStatement(node, scope)
      output.push(...expressions)
      output.push(whileStatement)
    },

    ClassDeclaration() {
      const [clss, expressions] = normalizeClassDeclaration(node, scope)
      output.push(...expressions)
      output.push(clss)
    },

    BreakStatement() {
      output.push(node)
    },

    LabeledStatement() {
      const [body] = normalizeBodyNode(node.body, scope)
      const [label] = normalizeExpression(node.label, scope)
      output.push(createLabeledStatement(label, body))
    },

    ForStatement() {
      const blockStatement = normalizeForStatement(node, scope)
      output.push(blockStatement)
    },

    BlockStatement() {
      output.push(normalizeBlockStatement(node, scope))
    }
  }

  call(normalizers, node.type)
  return output
}

function normalizeBlockStatement(node, scope) {
  const childScope = { ...scope }
  const body = []
  node.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, childScope))
  })
  return createBlockStatement(body)
}

function normalizeForStatement(node, scope) {
  const childScope = { ...scope }
  const initExps = normalizeBodyNode(node.init, childScope)
  const [test, testExps] = normalizeExpression(node.test, childScope)
  const [update, updateExps] = normalizeExpression(node.update, childScope)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, childScope))
  })
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

function normalizeClassDeclaration(node, scope) {
  const [id, idExps] = normalizeExpression(node.id, scope)
  const output = [...idExps]
  const superClass = null
  const [body, bodyExps] = normalizeClassBody(node.body, scope)
  output.push(...bodyExps)
  return [createClassDeclaration(id, superClass, body), output]
}

function createClassDeclaration(id, superClass, body) {
  return {
    type: 'ClassDeclaration',
    id,
    superClass,
    body
  }
}

function normalizeClassBody(node, scope) {
  const body = []
  const output = []
  node.body.forEach(bd => {
    const [method, methodExps] = normalizeMethodDefinition(bd, scope)
    output.push(...methodExps)
    body.push(method)
  })
  return [createClassBody(body), output]
}

function createClassBody(body) {
  return {
    type: 'ClassBody',
    body
  }
}

function normalizeMethodDefinition(node, scope) {
  const [key, keyExps] = normalizeExpression(node.key, scope)
  const value = normalizeFunctionExpression(node.value, scope)
  return [createMethodDefinition(key, value.pop()), keyExps]
}

function createMethodDefinition(key, value) {
  return {
    type: 'MethodDefinition',
    key,
    value
  }
}

function normalizeForInStatement(node, scope) {
  const output = []
  const [left, leftExps] = normalizeExpression(node.left, scope)
  const [right, rightExps] = normalizeExpression(node.right, scope)
  output.push(...leftExps)
  output.push(...rightExps)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, { ...scope }))
  })
  const forInStatement = createForInStatement(left, right, body)
  return [forInStatement, output]
}

function normalizeForOfStatement(node, scope) {
  const output = []
  const [left, leftExps] = normalizeExpression(node.left, scope)
  const [right, rightExps] = normalizeExpression(node.right, scope)
  output.push(...leftExps)
  output.push(...rightExps)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, { ...scope }))
  })
  const forOfStatement = createForOfStatement(left, right, body)
  return [forOfStatement, output]
}

function createBreakStatement(label) {
  return {
    type: 'BreakStatement',
    label
  }
}

function normalizeWhileStatement(node, scope) {
  const [test, testExps] = normalizeExpression(node.test, scope)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, { ...scope }))
  })
  const newBody = [...testExps, createIfStatement(test, createBlockStatement(body), createBlockStatement([createBreakStatement()]))]
  const whileStatement = createWhileStatement(createLiteral(true), newBody)
  return [whileStatement, []]
}

function normalizeSwitchStatement(node, scope) {
  const discriminant = normalizeExpression(node.discriminant)
  return []
}

function normalizeIfStatement(node, scope) {
  const top = []
  const [test, testExpressionStatements] = normalizeExpression(node.test, scope)
  top.push(...testExpressionStatements)
  let consequent = []
  node.consequent.body.forEach(statement => {
    const cons = normalizeBodyNode(statement, { ...scope })
    consequent.push(...cons)
  })
  consequent = createBlockStatement(consequent)
  let alternate = null
  if (node.alternate) {
    if (node.alternate.type === 'BlockStatement') {
      alternate = []
      node.alternate.body.forEach(statement => {
        const alts = normalizeBodyNode(statement, { ...scope })
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

function normalizeReturnStatement(node, scope) {
  const output = []
  const [arg, expressionStatements] = normalizeExpression(node.argument, scope)
  output.push(...expressionStatements)
  output.push(createReturnStatement(arg))
  return output
}

function normalizeArrowFunctionExpression(node, scope) {
  const output = []
  const params = []
  node.params.forEach(param => {
    const [p, pExpressionStatements] = normalizeFunctionParam(param, scope)
    output.push(...pExpressionStatements)
    params.push(p)
  })
  const normalizers = {
    CallExpression() {
      [body, expressions] = normalizeExpression(node.body, { ...scope });
      body = createBlockStatement([
        ...expressions,
        body
      ])
    },

    ArrayExpression() {
      [body, expressions] = normalizeExpression(node.body, { ...scope });
      body = createBlockStatement([
        ...expressions,
        createReturnStatement(body),
      ])
    },

    ObjectExpression() {
      [body, expressions] = normalizeExpression(node.body, { ...scope });
      body = createBlockStatement([
        ...expressions,
        createReturnStatement(body),
      ])
    },

    BlockStatement() {
      body = []
      const childScope = { ...scope }
      node.body.body.forEach(bd => {
        body.push(...normalizeBodyNode(bd, childScope))
      })
      body = createBlockStatement(body)
    },

    BinaryExpression() {
      [body, expressions] = normalizeExpression(node.body, { ...scope });
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

function normalizeFunctionExpression(node, scope) {
  const childScope = { ...scope }
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

function normalizeFunctionDeclaration(node, scope) {
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

function normalizeFunctionParam(node, scope) {
  const output = []
  const expressionStatements = []
  const normalizers = {
    Identifier() {
      output.push(node)
    },

    AssignmentPattern() {
      const [left] = normalizeExpression(node.left, scope)
      const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
      expressionStatements.push(...rightExpressionStatements)
      // TODO: do inside the function.
      output.push(
        createAssignmentPattern(left, right)
      )
    },

    RestElement() {
      const [rest, restExps] = normalizeRestElement(node, scope)
      expressionStatements.push(...restExps)
      output.push(rest)
    }
  }
  call(normalizers, node.type)
  output.push(expressionStatements)
  return output
}

function normalizeRestElement(node, scope) {
  const [arg, argExps] = normalizeExpression(node.argument, scope)
  return [
    createRestElement(arg),
    argExps
  ]
}

function createRestElement(argument) {
  return {
    type: 'RestElement',
    argument
  }
}

function normalizeVariableDeclaration(node, scope) {
  const output = []
  node.declarations.forEach(dec => {
    const declarations = normalizeVariableDeclarator(node, dec, scope)
    output.push(...declarations)
  })
  return output
}

function normalizeVariableDeclarator(parent, node, scope) {
  const output = []
  const normalizeId = {
    Identifier() {
      const normalizeInit = {
        Identifier() {
          output.push(
            createVariableDeclaration(parent.kind, [
              createVariableDeclarator(node.id, node.init)
            ])
          )
        },

        Literal() {
          output.push(
            createVariableDeclaration(parent.kind, [
              createVariableDeclarator(node.id, node.init)
            ])
          )
        },

        ObjectExpression() {
          const props = []
          node.init.properties.forEach(prop => {
            const [p, pExpressionStatements] = normalizeProperty(prop, scope)
            props.push(p)
            output.push(...pExpressionStatements)
          })
          output.push(createVariableDeclaration(parent.kind, [
            createVariableDeclarator(node.id,
              createObjectExpression(props)
            )
          ]))
        },

        ArrayExpression() {
          const els = []
          node.init.elements.forEach(element => {
            const [p, pExpressionStatements] = normalizeExpression(element, scope)
            els.push(p)
            output.push(...pExpressionStatements)
          })
          output.push(createVariableDeclaration(parent.kind, [
            createVariableDeclarator(node.id,
              createArrayExpression(els)
            )
          ]))
        },

        ConditionalExpression() {
          const [test, testExpressionStatements] = normalizeExpression(node.init.test, scope)
          const [consequent, consequentExpressionStatements] = normalizeExpression(node.init.consequent, scope)
          const [alternate, alternateExpressionStatements] = normalizeExpression(node.init.alternate, scope)
          output.push(...testExpressionStatements)
          output.push(...consequentExpressionStatements)
          output.push(...alternateExpressionStatements)
          output.push(createVariableDeclaration(parent.kind, [
            createVariableDeclarator(node.id,
              createConditionalExpression(
                test,
                consequent,
                alternate
              )
            )
          ]))
        },

        FunctionExpression() {
          // output.push(...normalizeFunctionExpression(node.init, { ...scope }))
        },

        MemberExpression() {
          const [object, objectStatements] = normalizeExpression(node.init.object, scope)
          const [property, propertyStatements] = normalizeExpression(node.init.property, scope)
          output.push(...objectStatements)
          output.push(...propertyStatements)
          output.push(createVariableDeclaration(parent.kind, [
            createVariableDeclarator(node.id,
              createMemberExpression(
                object,
                property,
                node.init.computed
              )
            )
          ]))
        },

        BinaryExpression() {
          const [left, leftExpressionStatements] = normalizeExpression(node.init.left, scope)
          const [right, rightExpressionStatements] = normalizeExpression(node.init.right, scope)
          output.push(...leftExpressionStatements)
          output.push(...rightExpressionStatements)
          output.push(createVariable(parent.kind, node.id, createBinaryExpression(
            left,
            node.init.operator,
            right
          )))
        },

        ArrowFunctionExpression() {
          const [func, expressions] = normalizeArrowFunctionExpression(node.init, scope)
          output.push(...expressions)
          output.push(createVariable(parent.kind, node.id, func))
        },

        NewExpression() {
          const [ctor, expressions] = normalizeNewExpression(node.init, scope)
          output.push(...expressions)
          output.push(createVariable(parent.kind, node.id, ctor))
        }
      }

      if (node.init) {
        call(normalizeInit, node.init.type)
      } else {
        output.push(createVariableDeclaration(parent.kind, [
          createVariableDeclarator(node.id)
        ]))
      }
    },

    ArrayPattern() {
      const normalizeInit = {
        Identifier() {
          node.id.elements.forEach(el => {
            output.push(
              createVariableDeclaration(parent.kind, [
                createVariableDeclarator(el,
                  createMemberExpression(node.init, el))
              ])
            )
          })
        },

        MemberExpression() {
          node.id.elements.forEach(el => {
            output.push(
              createVariableDeclaration(parent.kind, [
                createVariableDeclarator(el,
                  createMemberExpression(node.init, el))
              ])
            )
          })
        },

        // CallExpression() {
        //   const [_callee, calleeStatements] = normalizeExpression(node.init.callee, scope)
        //   const args = []
        //   node.init.arguments.forEach(arg => {
        //     const [argument, argumentStatements] = normalizeExpression(arg, scope)
        //     output.push(...argumentStatements)
        //     args.push(argument)
        //   })
        //   output.push(...calleeStatements)
        //   output.push(createVariable(parent.kind,
        //     createCallExpression(_callee, args)
        //   ))
        // },
      }

      call(normalizeInit, node.init.type)
    }
  }

  call(normalizeId, node.id.type)

  return output
}

function createVariable(kind, id, init) {
  return createVariableDeclaration(kind, [
    createVariableDeclarator(id, init)
  ])
}

function normalizeNewExpression(node, scope) {
  const [ctor, ctorExps] = normalizeExpression(node.callee, scope)
  const argExps = []
  const args = []
  node.arguments.forEach(arg => {
    const [argument, argumentExps] = normalizeExpression(arg, { ...scope })
    args.push(argument)
    argExps.push(...argumentExps)
  })
  return [createNewExpression(ctor, args), ctorExps.concat(argExps)]
}

function createNewExpression(ctor, args) {
  return {
    type: 'NewExpression',
    callee: ctor,
    arguments: args
  }
}

function normalizeSpreadElement(node, scope) {
  const [arg, argExps] = normalizeExpression(node.argument, scope)
  return [
    createSpreadElement(arg),
    argExps
  ]
}

function createSpreadElement(argument) {
  return {
    type: 'SpreadElement',
    argument
  }
}

function normalizeProperty(node, scope) {
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

function normalizeExpressionStatement(node, scope) {
  const output = []
  const normalizers = {
    AssignmentExpression() {
      // if node.left.type === 'ArrayPattern'
      const [left, leftExpressionStatements] = normalizeExpression(node.left, scope)
      const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
      output.push(...leftExpressionStatements)
      output.push(...rightExpressionStatements)
      if (Array.isArray(left)) {
        const name = `tmp${scope.index++}`
        output.push(createExpressionStatement(
          createAssignmentExpression(
            createIdentifier(name),
            right
          )
        ))
        left.forEach(l => {
          output.push(createExpressionStatement(
            createAssignmentExpression(l,
              createMemberExpression(
                createIdentifier(name), l))
          ))
        })
      } else {
        output.push(createExpressionStatement(
          createAssignmentExpression(left, right)
        ))
      }
    },

    Identifier() {
      output.push(createExpressionStatement(node))
    },

    MemberExpression() {
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
    },

    CallExpression() {
      const [_callee, calleeStatements] = normalizeExpression(node.callee, scope)
      const args = []
      node.arguments.forEach(arg => {
        const [argument, argumentStatements] = normalizeExpression(arg, scope)
        output.push(...argumentStatements)
        args.push(argument)
      })
      output.push(...calleeStatements)
      output.push(createExpressionStatement(
        createCallExpression(_callee, args)
      ))
    },

    FunctionExpression() {
      output.push(...normalizeFunctionExpression(node, { ...scope }))
    },

    NewExpression() {
      const [ctor, expressions] = normalizeNewExpression(node, scope)
      output.push(...expressions)
      output.push(createExpressionStatement(ctor))
    }
  }
  call(normalizers, node.type)
  return output
}

function normalizeExpression(node, scope) {
  const expressionStatements = []
  const output = []
  const normalizers = {
    Identifier() {
      output.push(node)
    },

    MemberExpression() {
      const [object, objectStatements] = normalizeExpression(node.object, scope)
      const [property, propertyStatements] = normalizeExpression(node.property, scope)
      expressionStatements.push(...objectStatements)
      expressionStatements.push(...propertyStatements)
      output.push(createMemberExpression(
        object,
        property,
        node.computed
      ))
    },

    CallExpression() {
      const [_callee, calleeStatements] = normalizeExpression(node.callee, scope)
      const args = []
      node.arguments.forEach(arg => {
        const [argument, argumentStatements] = normalizeExpression(arg, scope)
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
    },

    LogicalExpression() {
      const [left, leftExpressionStatements] = normalizeExpression(node.left, scope)
      const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
      expressionStatements.push(...leftExpressionStatements)
      expressionStatements.push(...rightExpressionStatements)
      output.push(createLogicalExpression(
        left,
        node.operator,
        right
      ))
    },

    BinaryExpression() {
      const [left, leftExpressionStatements] = normalizeExpression(node.left, scope)
      const [right, rightExpressionStatements] = normalizeExpression(node.right, scope)
      expressionStatements.push(...leftExpressionStatements)
      expressionStatements.push(...rightExpressionStatements)
      output.push(createBinaryExpression(
        left,
        node.operator,
        right
      ))
    },

    ConditionalExpression() {
      const [test, testExpressionStatements] = normalizeExpression(node.test, scope)
      const [consequent, consequentExpressionStatements] = normalizeExpression(node.consequent, scope)
      const [alternate, alternateExpressionStatements] = normalizeExpression(node.alternate, scope)
      expressionStatements.push(...testExpressionStatements)
      expressionStatements.push(...consequentExpressionStatements)
      expressionStatements.push(...alternateExpressionStatements)
      output.push(createConditionalExpression(
        test,
        consequent,
        alternate
      ))
    },

    AssignmentExpression() {
      console.log(node)
    },

    ArrayPattern() {
      const array = []
      node.elements.forEach(element => {
        const [el, elExpressionStatements] = normalizeExpression(element, scope)
        array.push(el)
        expressionStatements.push(...elExpressionStatements)
      })
      output.push(array)
    },

    Literal() {
      output.push(node)
    },

    ObjectExpression() {
      const array = []
      node.properties.forEach(prop => {
        const [el, elExpressionStatements] = normalizeExpression(prop, scope)
        array.push(el)
        expressionStatements.push(...elExpressionStatements)
      })
      output.push(createObjectExpression(array))
    },

    Property() {
      const [key, keyExps] = normalizeExpression(node.key, scope)
      const [value, valueExps] = normalizeExpression(node.value, scope)
      expressionStatements.push(...keyExps)
      expressionStatements.push(...valueExps)
      output.push(createProperty(key, value))
    },

    ArrayExpression() {
      const array = []
      node.elements.forEach(element => {
        const [el, elExpressionStatements] = normalizeExpression(element, scope)
        array.push(el)
        expressionStatements.push(...elExpressionStatements)
      })
      output.push(createArrayExpression(array))
    },

    FunctionExpression() {
      output.push(...normalizeFunctionExpression(node, scope))
    },

    VariableDeclaration() {
      output.push(...normalizeVariableDeclaration(node, scope))
    },

    ThisExpression() {
      output.push(node)
    },

    SpreadElement() {
      const [spread, expressions] = normalizeSpreadElement(node, scope)
      expressionStatements.push(...expressions)
      output.push(spread)
    },

    ArrowFunctionExpression() {
      const [arrow, arrowExps] = normalizeArrowFunctionExpression(node, scope)
      expressionStatements.push(...arrowExps)
      output.push(arrow)
    },

    UpdateExpression() {
      const [update, updateExps] = normalizeUpdateExpression(node, scope)
      expressionStatements.push(...updateExps)
      output.push(update)
    }
  }

  call(normalizers, node.type)
  output.push(expressionStatements)
  return output
}

function normalizeUpdateExpression(node, scope) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope)
  return [
    createUpdateExpression(argument, node.operator, node.prefix),
    argumentExps
  ]
}

function createUpdateExpression(argument, operator, prefix) {
  return {
    type: 'UpdateExpression',
    argument,
    operator,
    prefix
  }
}

function call(obj, method, ...args) {
  if (!obj.hasOwnProperty(method)) {
    throw new Error(`Missing method ${method}`)
  }

  return obj[method](...args)
}
