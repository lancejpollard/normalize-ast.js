
module.exports = print

function print(ast) {
  const text = []
  ast.body.forEach(node => {
    text.push(...printBodyNode(node))
  })
  return text.join('\n')
}

function printBodyNode(node) {
  const text = []

  const printers = {
    VariableDeclaration() {
      text.push(...printVariableDeclaration(node))
    },

    ExpressionStatement() {
      text.push(...printExpressionStatement(node))
    },

    FunctionDeclaration() {
      text.push(...printFunctionDeclaration(node))
    },

    ReturnStatement() {
      text.push(...printReturnStatement(node))
    },

    IfStatement() {
      text.push(...printIfStatement(node))
    },

    ForInStatement() {
      text.push(...printForInStatement(node))
    },

    ForOfStatement() {
      text.push(...printForOfStatement(node))
    },

    WhileStatement() {
      text.push(...printWhileStatement(node))
    },

    Identifier() {
      text.push(node.name)
    },

    ArrayExpression() {
      text.push(...printArrayExpression(node))
    },

    ObjectExpression() {
      text.push(...printObjectExpression(node))
    },

    ClassDeclaration() {
      text.push(...printClassDeclaration(node))
    },

    BreakStatement() {
      text.push('break')
    },

    LabeledStatement() {
      text.push(...printLabeledStatement(node))
    },

    BlockStatement() {
      text.push(...printBlockStatement(node))
    },

    UpdateExpression() {
      text.push(...printUpdateExpression(node))
    },

    AssignmentExpression() {
      text.push(...printAssignmentExpression(node))
    },

    TemplateLiteral() {
      text.push(...printTemplateLiteral(node))
    },

    Literal() {
      text.push(node.raw)
    },

    MemberExpression() {
      const object = printExpression(node.object)
      const property = printExpression(node.property)
      if (node.computed) {
        text.push(`${object}[${property}]`)
      } else {
        text.push(`${object}.${property}`)
      }
    },

    CallExpression() {
      const _callee = printExpression(node.callee)
      const args = node.arguments.map(arg => printExpression(arg))
      text.push(`${_callee}(${args.join(', ')})`)
    },

    NewExpression() {
      text.push(printNewExpression(node).join('\n'))
    },

    TaggedTemplateExpression() {
      text.push(printTaggedTemplateExpression(node).join('\n'))
    },

    SwitchStatement() {
      text.push(printSwitchStatement(node).join('\n'))
    }
  }

  call(printers, node.type)

  return text
}

function printSwitchStatement(node) {
  const text = []
  const discriminant = printExpression(node.discriminant)
  text.push(`switch (${discriminant}) {`)
  node.cases.forEach(_case => {
    printSwitchCase(_case).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  text.push('}')
  return text
}

function printSwitchCase(node) {
  const text = []
  const test = printExpression(node.test)
  text.push(`case ${test}:`)
  node.consequent.forEach(consequent => {
    printBodyNode(consequent).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  return text
}

function printTemplateLiteral(node) {
  const text = []
  text.push('`')
  node.quasis.forEach((q, i) => {
    text.push(q.value.raw)
    if (i < node.quasis.length - 1) {
      const expression = printExpression(node.expressions[i])
      text.push(`\$\{${expression}\}`)
    }
  })
  text.push('`')
  return [text.join('')]
}

function printAssignmentExpression(node) {
  const text = []
  const left = printExpression(node.left)
  const right = printExpression(node.right)
  const operator = node.operator
  text.push(`${left} ${operator} ${right}`)
  return text
}

function printUpdateExpression(node) {
  const text = []
  const argument = printExpression(node.argument)
  if (node.prefix) {
    text.push(`${node.operator}${argument}`)
  } else {
    text.push(`${argument}${node.operator}`)
  }
  return text
}

function printBlockStatement(node) {
  const text = []
  text.push('{')
  node.body.forEach(bd => {
    printBodyNode(bd).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  text.push('}')
  return text
}

function printLabeledStatement(node) {
  const label = printExpression(node.label)
  const body = printBodyNode(node.body)
  return [`${label}:`, ...body]
}

function printClassDeclaration(node) {
  const text = []
  const id = printExpression(node.id)
  const superClass = null
  if (superClass) {

  } else {
    text.push(`class ${id} {`)
  }
  printClassBody(node.body).forEach(line => {
    text.push(`  ${line}`)
  })
  text.push('}')
  return text
}

function printClassBody(node) {
  const text = []
  node.body.forEach(bd => {
    text.push(...printMethodDefinition(bd))
  })
  return text
}

function printMethodDefinition(node) {
  const key = printExpression(node.key)
  const value = printFunctionDeclaration(node.value)
  const text = [`${key}: `]
  text.push(value.join('\n'))
  return text
}

function printForInStatement(node) {
  const text = []
  const left = printExpression(node.left)
  const right = printExpression(node.right)
  text.push(`for (${left} in ${right}) {`)
  node.body.body.forEach(bd => {
    printBodyNode(bd).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  text.push('}')
  return text
}

function printWhileStatement(node) {
  const text = []
  const test = printExpression(node.test)
  text.push(`while (${test}) {`)
  node.body.body.forEach(bd => {
    printBodyNode(bd).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  text.push('}')
  return text
}

function printForOfStatement(node) {
  const text = []
  const left = printExpression(node.left)
  const right = printExpression(node.right)
  text.push(`for (${left} of ${right}) {`)
  node.body.body.forEach(bd => {
    printBodyNode(bd).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  text.push('}')
  return text
}

function printObjectExpression(node) {
  const text = []
  if (node.properties.length) {
    text.push('{')
    const props = []
    node.properties.forEach(p => {
      printProperty(p).forEach(line => {
        props.push(`  ${line}`)
      })
    })
    text.push(props.join(',\n'))
    text.push('}')
  } else {
    text.push('{}')
  }
  return text
}

function printArrayExpression(node) {
  const text = []
  if (node.elements.length) {
    text.push('[')
    const els = []
    node.elements.forEach(p => {
      els.push(`  ${printExpression(p)}`)
    })
    text.push(els.join(',\n'))
    text.push(']')
  } else {
    text.push('[]')
  }
  return text
}

function printProperty(node) {
  if (node.type === 'SpreadElement') {
    return printSpreadElement(node)
  }
  const key = printExpression(node.key)
  const value = printExpression(node.value)
  return [`${key}: ${value}`]
}

function printRestElement(node) {
  const argument = printExpression(node.argument)
  return [`...${argument}`]
}

function printSpreadElement(node) {
  const argument = printExpression(node.argument)
  return [`...${argument}`]
}

function printIfStatement(node) {
  const text = []
  const test = printExpression(node.test)
  text.push(`if (${test}) {`)
  node.consequent.body.forEach(ds => {
    printBodyNode(ds).forEach(line => {
      text.push(`  ${line}`)
    })
  })
  if (node.alternate) {
    if (node.alternate.type === 'BlockStatement') {
      text.push(`} else {`)
      node.alternate.body.forEach(ds => {
        printBodyNode(ds).forEach(line => {
          text.push(`  ${line}`)
        })
      })
      text.push(`}`)
    } else {
      const elseif = printIfStatement(node.alternate)
      text.push(`} else ${elseif[0]}`)
      text.push(...elseif.slice(1))
    }
  } else {
    text.push(`}`)
  }
  return text
}

function printReturnStatement(node) {
  const argument = printExpression(node.argument)
  return [`return ${argument}`]
}

function printArrowFunctionExpression(node) {
  const printers = {
    CallExpression() {
      return [
        printExpression(node.body)
      ]
    },

    Identifier() {
      return [
        node.body.name
      ]
    },

    BlockStatement() {
      return node.body.body.map(x => printBodyNode(x).join('\n'))
    },

    ArrayExpression() {
      return ['return ' + printArrayExpression(node.body).join('\n')]
    },

    ObjectExpression() {
      return ['return ' + printObjectExpression(node.body).join('\n')]
    }
  }
  const text = []
  const params = node.params.map(param => printExpression(param))
  const body = call(printers, node.body.type)
    .map(line => `  ${line}`)
  text.push(`(${params.join(', ')}) => {`)
  text.push(...body)
  text.push(`}`)
  return text
}

function printFunctionDeclaration(node) {
  const text = []
  const id = node.id ? printExpression(node.id) : ''
  const params = node.params.map(param => printExpression(param))
  const body = node.body.body.map(x => printBodyNode(x).join('\n'))
    .map(line => `  ${line}`)
  text.push(`function ${id}(${params.join(', ')}) {`)
  text.push(...body)
  text.push(`}`)
  return text
}

function printVariableDeclaration(node) {
  const text = []

  const printers = {
    VariableDeclarator(dec) {
      text.push(...printVariableDeclarator(node, dec))
    }
  }

  node.declarations.forEach(dec => {
    call(printers, dec.type, dec)
  })

  return text
}

function printVariableDeclarator(parent, node) {
  const text = []

  const printersId = {
    Identifier() {
      text.push(parent.kind)
      text.push(` `)
      text.push(node.id.name)
    }
  }

  const printersInit = {
    Identifier() {
      text.push(node.init.name)
    },

    MemberExpression() {
      const object = printExpression(node.init.object)
      const property = printExpression(node.init.property)
      if (node.init.computed) {
        text.push(`${object}[${property}]`)
      } else {
        text.push(`${object}.${property}`)
      }
    },

    CallExpression() {
      const _callee = printExpression(node.init.callee)
      const args = node.init.arguments.map(arg => printExpression(arg))
      text.push(`${_callee}(${args.join(', ')})`)
    },

    Literal() {
      const value = node.init.raw
      text.push(value)
    },

    ObjectExpression() {
      text.push(printObjectExpression(node.init).join('\n'))
    },

    ArrayExpression() {
      text.push(printArrayExpression(node.init).join('\n'))
    },

    ConditionalExpression() {
      const test = printExpression(node.init.test)
      const consequent = printExpression(node.init.consequent)
      const alternate = printExpression(node.init.alternate)
      text.push(`${test} ? ${consequent} : ${alternate}`)
    },

    BinaryExpression() {
      const left = printExpression(node.init.left)
      const right = printExpression(node.init.right)
      text.push(`${left} ${node.init.operator} ${right}`)
    },

    ArrowFunctionExpression() {
      text.push(printArrowFunctionExpression(node.init).join('\n'))
    },

    NewExpression() {
      text.push(printNewExpression(node.init).join('\n'))
    },

    TemplateLiteral() {
      text.push(printTemplateLiteral(node.init).join('\n'))
    },

    TaggedTemplateExpression() {
      text.push(printTaggedTemplateExpression(node.init).join('\n'))
    },

    UnaryExpression() {
      text.push(printUnaryExpression(node.init).join('\n'))
    },

    LogicalExpression() {
      const left = printExpression(node.init.left)
      const right = printExpression(node.init.right)
      text.push(`${left} ${node.init.operator} ${right}`)
    },

    FunctionExpression() {
      text.push(printFunctionDeclaration(node.init).join('\n'))
    },

    AssignmentExpression() {
      text.push(printAssignmentExpression(node.init).join('\n'))
    }
  }

  call(printersId, node.id.type)

  if (node.init) {
    text.push(` = `)
    call(printersInit, node.init.type)
  }

  return [text.join('')]
}

function printTaggedTemplateExpression(node) {
  const tag = printExpression(node.tag)
  const template = printTemplateLiteral(node.quasi)
  return [`${tag}${template.join('\n')}`]
}

function printNewExpression(node) {
  const text = []
  const ctor = printExpression(node.callee)
  const args = node.arguments.map(arg => printExpression(arg))
  text.push(`new ${ctor}(${args.join(', ')})`)
  return text
}

function printExpressionStatement(node) {
  const text = []
  const printers = {
    Identifier() {
      text.push(node.expression.name)
    },

    AssignmentExpression() {
      const left = printExpression(node.expression.left)
      const right = printExpression(node.expression.right)
      text.push(`${left} ${node.expression.operator} ${right}`)
    },

    MemberExpression() {
      const object = printExpression(node.expression.object)
      const property = printExpression(node.expression.property)
      if (node.expression.computed) {
        text.push(`${object}[${property}]`)
      } else {
        text.push(`${object}.${property}`)
      }
    },

    CallExpression() {
      const _callee = printExpression(node.expression.callee)
      const args = node.expression.arguments.map(arg => printExpression(arg))
      text.push(`${_callee}(${args.join(', ')})`)
    },

    NewExpression() {
      text.push(printNewExpression(node.expression).join('\n'))
    },

    TaggedTemplateExpression() {
      text.push(printTaggedTemplateExpression(node.expression).join('\n'))
    },

    ThrowStatement() {
      text.push(printThrowStatement(node.expression).join('\n'))
    }
  }

  call(printers, node.expression.type)

  return text
}

function printThrowStatement(node) {
  const argument = printExpression(node.argument)
  return [`throw ${argument}`]
}

function printExpression(node) {
  const printers = {
    Identifier() {
      return node.name
    },

    MemberExpression() {
      const object = printExpression(node.object)
      const property = printExpression(node.property)
      if (node.computed) {
        return `${object}[${property}]`
      } else {
        return `${object}.${property}`
      }
    },

    CallExpression() {
      const _callee = printExpression(node.callee)
      const args = node.arguments.map(arg => printExpression(arg))
      return `${_callee}(${args.join(', ')})`
    },

    LogicalExpression() {
      const left = printExpression(node.left)
      const right = printExpression(node.right)
      return `${left} ${node.operator} ${right}`
    },

    BinaryExpression() {
      const left = printExpression(node.left)
      const right = printExpression(node.right)
      return `${left} ${node.operator} ${right}`
    },

    ConditionalExpression() {
      const test = printExpression(node.test)
      const consequent = printExpression(node.consequent)
      const alternate = printExpression(node.alternate)
      return `${test} ? ${consequent} : ${alternate}`
    },

    AssignmentPattern() {
      const left = printExpression(node.left)
      const right = printExpression(node.right)
      return `${left} = ${right}`
    },

    Literal() {
      return node.raw
    },

    ObjectExpression() {
      return printObjectExpression(node).join('\n')
    },

    ArrayExpression() {
      return printArrayExpression(node).join('\n')
    },

    FunctionExpression() {
      return printFunctionDeclaration(node).join('\n')
    },

    VariableDeclaration() {
      return printVariableDeclaration(node).join('\n')
    },

    ThisExpression() {
      return 'this'
    },

    SpreadElement() {
      return printSpreadElement(node).join('\n')
    },

    RestElement() {
      return printRestElement(node).join('\n')
    },

    ArrowFunctionExpression() {
      return printArrowFunctionExpression(node).join('\n')
    },

    UnaryExpression() {
      return printUnaryExpression(node).join('\n')
    },

    AssignmentExpression() {
      return printAssignmentExpression(node).join('\n')
    },

    NewExpression() {
      return printNewExpression(node).join('\n')
    },

    UpdateExpression() {
      return printUpdateExpression(node).join('\n')
    }
  }

  return call(printers, node.type)
}

function printUnaryExpression(node) {
  const text = []
  const argument = printExpression(node.argument)
  if (node.prefix) {
    text.push(`${node.operator}${argument}`)
  } else {
    text.push(`${argument}${node.operator}`)
  }
  return text
}

function call(obj, method, ...args) {
  if (!obj.hasOwnProperty(method)) {
    throw new Error(`Missing method ${method}`)
  }

  return obj[method](...args)
}
