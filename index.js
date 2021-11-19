
const acorn = require('acorn')
const print = require('./print')
const {
  createProgram,
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
  normalize_ExpressionStatement,
  normalize_Directive,
  normalize_BlockStatement,
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
  normalize_WhileStatement,
  normalize_DoWhileStatement,
  normalize_ForStatement,
  normalize_ForInStatement,
  normalize_FunctionDeclaration,
  normalize_VariableDeclaration,
  normalize_VariableDeclarator,
  normalize_ThisExpression,
  normalize_ArrayExpression,
  normalize_ObjectExpression,
  normalize_Property,
  normalize_FunctionExpression,
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
  return function(node, scope) {
    return normalizers[`normalize_${type}`](node, scope)
  }
}

function buildNormalizeTypeFunction(type, def) {
  return function(node, scope) {
    const object = { type }
    const expressions = []
    Object.keys(def.properties).forEach(name => {
      const property = def.properties[name]
      if (property.list) {
        const list = object[name] = []
        const propertyNodes = node[name] ?? []
        propertyNodes.forEach(propertyNode => {
          const [normalizedPropertyNode, normalizedExpressions]
            = normalizeProperty(type, name, propertyNode.type, propertyNode, scope)
          list.push(normalizedPropertyNode)
          expressions.push(...normalizedExpressions)
        })
      } else {
        const propertyNode = node[name]
        const [normalizedPropertyNode, normalizedExpressions]
          = normalizeProperty(type, name, propertyNode?.type ?? null, propertyNode, scope)
        object[name] = normalizedPropertyNode
        expressions.push(...normalizedExpressions)
      }
    })
    return [object, expressions]
  }
}

function normalize_Identifier(node, scope) {

}

function normalize_ExpressionStatement(node, scope) {

}

function normalize_Directive(node, scope) {

}

function normalize_BlockStatement(node, scope) {

}

function normalize_EmptyStatement(node, scope) {

}

function normalize_DebuggerStatement(node, scope) {

}

function normalize_WithStatement(node, scope) {

}

function normalize_ReturnStatement(node, scope) {

}

function normalize_LabeledStatement(node, scope) {

}

function normalize_BreakStatement(node, scope) {

}

function normalize_ContinueStatement(node, scope) {

}

function normalize_IfStatement(node, scope) {

}

function normalize_SwitchStatement(node, scope) {

}

function normalize_SwitchCase(node, scope) {

}

function normalize_ThrowStatement(node, scope) {

}

function normalize_TryStatement(node, scope) {

}

function normalize_CatchClause(node, scope) {

}

function normalize_WhileStatement(node, scope) {

}

function normalize_DoWhileStatement(node, scope) {

}

function normalize_ForStatement(node, scope) {

}

function normalize_ForInStatement(node, scope) {

}

function normalize_FunctionDeclaration(node, scope) {

}

function normalize_VariableDeclaration(node, scope) {

}

function normalize_VariableDeclarator(node, scope) {

}

function normalize_ThisExpression(node, scope) {

}

function normalize_ArrayExpression(node, scope) {

}

function normalize_ObjectExpression(node, scope) {

}

function normalize_Property(node, scope) {

}

function normalize_FunctionExpression(node, scope) {

}

function normalize_UnaryExpression(node, scope) {

}

function normalize_UpdateExpression(node, scope) {

}

function normalize_BinaryExpression(node, scope) {

}

function normalize_AssignmentExpression(node, scope) {

}

function normalize_LogicalExpression(node, scope) {

}

function normalize_MemberExpression(node, scope) {

}

function normalize_ConditionalExpression(node, scope) {

}

function normalize_CallExpression(node, scope) {

}

function normalize_NewExpression(node, scope) {

}

function normalize_SequenceExpression(node, scope) {

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
    },

    AssignmentExpression() {
      const [assign, expressions] = normalizeAssignmentExpression(node, scope)
      output.push(...expressions)
      output.push(assign)
    },

    ExportNamedDeclaration() {
      const [exp, expressions] = normalizeExportNamedDeclaration(node, scope)
      output.push(...expressions)
      output.push(exp)
    }
  }

  call(normalizers, node.type)
  return output
}

function normalizeExportNamedDeclaration(node, scope) {
  const declaration = normalizeBodyNode(node.declaration, scope)
  const specifiers = []
}

function normalizeAssignmentExpression(node, scope) {
  const [left, leftExps] = normalizeExpression(node.left, scope)
  const [right, rightExps] = normalizeExpression(node.right, scope)
  return [
    createAssignmentExpression(left, right, node.operator),
    [...leftExps, ...rightExps]
  ]
}

function normalizeBlockStatement(node, scope) {
  const childScope = scope
  const body = []
  node.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, childScope))
  })
  return createBlockStatement(body)
}

function normalizeForStatement(node, scope) {
  const childScope = scope
  let initExps
  if (node.init) {
    initExps = normalizeBodyNode(node.init, childScope)
  } else {
    initExps = []
  }
  let test, testExps = []
  if (node.test) {
    [test, testExps] = normalizeExpression(node.test, childScope, true)
  }
  const [update, updateExps] = normalizeExpression(node.update, childScope)
  const body = []
  const normalizers = {
    BlockStatement() {
      node.body.body.forEach(bd => {
        body.push(...normalizeBodyNode(bd, childScope))
      })
    },

    ExpressionStatement() {
      body.push(...normalizeBodyNode(node.body, childScope))
    }
  }
  call(normalizers, node.body.type)
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
  if (node.body.type === 'BlockStatement') {
    node.body.body.forEach(bd => {
      body.push(...normalizeBodyNode(bd, scope))
    })
  } else {
    body.push(...normalizeBodyNode(node.body, scope))
  }
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
    body.push(...normalizeBodyNode(bd, scope))
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
  const childScope = scope
  const [test, testExps] = normalizeExpression(node.test, childScope, true)
  const body = []
  node.body.body.forEach(bd => {
    body.push(...normalizeBodyNode(bd, childScope))
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

function normalizeReturnStatement(node, scope) {
  const output = []
  const [arg, expressionStatements] = normalizeExpression(node.argument, scope, true)
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

function normalizeFunctionExpression(node, scope) {
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
          // output.push(...normalizeFunctionExpression(node.init, scope))
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
          const [left, leftExpressionStatements] = normalizeExpression(node.init.left, scope, true)
          const [right, rightExpressionStatements] = normalizeExpression(node.init.right, scope, true)
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
        },

        CallExpression() {
          const [_callee, calleeStatements] = normalizeExpression(node.init.callee, scope)
          const args = []
          node.init.arguments.forEach(arg => {
            const [argument, argumentStatements] = normalizeExpression(arg, scope, true)
            output.push(...argumentStatements)
            args.push(argument)
          })
          output.push(...calleeStatements)
          output.push(createVariable(parent.kind, node.id,
            createCallExpression(_callee, args)
          ))
        },

        TemplateLiteral() {
          const [template, expressions] = normalizeTemplateLiteral(node.init, scope)
          output.push(...expressions)
          output.push(createVariable(parent.kind, node.id, template))
        },

        TaggedTemplateExpression() {
          const [template, expressions] = normalizeTaggedTemplateExpression(node.init, scope)
          output.push(...expressions)
          output.push(createVariable(parent.kind, node.id, template))
        },

        UnaryExpression() {
          const [update, updateExps] = normalizeUnaryExpression(node.init, scope, true)
          output.push(...updateExps)
          // if (isolate) {
          //   const name = `tmp${scope.index++}`
          //   output.push(
          //     createVariable('const',
          //       createIdentifier(name),
          //       update
          //     )
          //   )
          //   output.push(createVariable(parent.kind, node.id, createIdentifier(name)))
          // } else {
            output.push(createVariable(parent.kind, node.id, update))
          // }
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

    ObjectPattern() {
      throw new Error('todo')
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

function normalizeTaggedTemplateExpression(node, scope) {
  const [tag, tagExps] = normalizeExpression(node.tag, scope)
  const [template, templateExps] = normalizeTemplateLiteral(node.quasi, scope)
  return [
    createTaggedTemplateExpression(tag, template),
    [...templateExps, ...tagExps]
  ]
}

function createTaggedTemplateExpression(tag, quasi) {
  return {
    type: 'TaggedTemplateExpression',
    tag,
    quasi
  }
}

function normalizeTemplateLiteral(node, scope) {
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

function normalizeTemplateElement(node, scope) {
  return node
}

function createTemplateLiteral(expressions, quasis) {
  return {
    type: 'TemplateLiteral',
    expressions,
    quasis
  }
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
    const [argument, argumentExps] = normalizeExpression(arg, scope, true)
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
        const [argument, argumentStatements] = normalizeExpression(arg, scope, true)
        output.push(...argumentStatements)
        args.push(argument)
      })
      output.push(...calleeStatements)
      output.push(createExpressionStatement(
        createCallExpression(_callee, args)
      ))
    },

    FunctionExpression() {
      output.push(...normalizeFunctionExpression(node, scope))
    },

    NewExpression() {
      const [ctor, expressions] = normalizeNewExpression(node, scope)
      output.push(...expressions)
      output.push(createExpressionStatement(ctor))
    },

    TaggedTemplateExpression() {
      const [template, expressions] = normalizeTaggedTemplateExpression(node, scope)
      output.push(...expressions)
      output.push(createExpressionStatement(template))
    },

    SequenceExpression() {
      const expressions = normalizeSequenceExpression(node, scope)
      output.push(...expressions)
    },

    ReturnStatement() {
      output.push(...normalizeReturnStatement(node, scope))
    },

    Literal() {
      output.push(node)
    },

    ThrowStatement() {
      const [thrw, expressions] = normalizeThrowStatement(node, scope)
      output.push(...expressions)
      output.push(createExpressionStatement(thrw))
    }
  }
  call(normalizers, node.type)
  return output
}

function normalizeThrowStatement(node, scope) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope)
  return [
    createThrowStatement(argument),
    argumentExps
  ]
}

function createThrowStatement(argument) {
  return {
    type: 'ThrowStatement',
    argument
  }
}

function normalizeSequenceExpression(node, scope) {
  const expressions = []
  // this just flattens the list and gets rid of the node type
  // in the normalized output
  node.expressions.forEach(exp => {
    expressions.push(...normalizeExpressionStatement(exp, scope))
  })
  return expressions
}

function normalizeExpression(node, scope, isolate = false) {
  const expressionStatements = []
  const output = []
  const normalizers = {
    Identifier() {
      output.push(node)
    },

    MemberExpression() {
      const [object, objectStatements] = normalizeExpression(node.object, scope, isolate)
      const [property, propertyStatements] = normalizeExpression(node.property, scope, isolate)
      expressionStatements.push(...objectStatements)
      expressionStatements.push(...propertyStatements)
      output.push(createMemberExpression(
        object,
        property,
        node.computed
      ))
    },

    CallExpression() {
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
    },

    LogicalExpression() {
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
    },

    BinaryExpression() {
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
    },

    ConditionalExpression() {
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
    },

    AssignmentExpression() {
      const [assign, expressions] = normalizeAssignmentExpression(node, scope)
      expressionStatements.push(...expressions)
      output.push(assign)
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
    },

    UnaryExpression() {
      const [update, updateExps] = normalizeUnaryExpression(node, scope, isolate)
      expressionStatements.push(...updateExps)
      if (isolate) {
        const name = `tmp${scope.index++}`
        expressionStatements.push(
          createVariable('const',
            createIdentifier(name),
            update
          )
        )
        output.push(createIdentifier(name))
      } else {
        output.push(update)
      }
    },

    NewExpression() {
      const [ctor, expressions] = normalizeNewExpression(node, scope)
      expressionStatements.push(...expressions)
      output.push(ctor)
    }
  }

  call(normalizers, node.type)
  output.push(expressionStatements)
  return output
}

function normalizeUnaryExpression(node, scope, isolate) {
  const [argument, argumentExps] = normalizeExpression(node.argument, scope, isolate)
  return [
    createUnaryExpression(argument, node.operator, node.prefix),
    argumentExps
  ]
}

function createUnaryExpression(argument, operator, prefix) {
  return {
    type: 'UnaryExpression',
    argument,
    operator,
    prefix
  }
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
