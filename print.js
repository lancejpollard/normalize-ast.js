
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
    }
  }

  call(printers, node.type)

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
  const key = printExpression(node.key)
  const value = printExpression(node.value)
  return [`${key}: ${value}`]
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

function printFunctionDeclaration(node) {
  const text = []
  const id = node.id ? printExpression(node.id) : ''
  const params = node.params.map(param => printExpression(param))
  const body = node.body.body.map(x => printBodyNode(x))
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
    }
  }

  call(printersId, node.id.type)

  if (node.init) {
    text.push(` = `)
    call(printersInit, node.init.type)
  }

  return [text.join('')]
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
      text.push(`${left} = ${right}`)
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
  }

  call(printers, node.expression.type)

  return text
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
    }
  }

  return call(printers, node.type)
}

function call(obj, method, ...args) {
  if (!obj.hasOwnProperty(method)) {
    throw new Error(`Missing method ${method}`)
  }

  return obj[method](...args)
}
