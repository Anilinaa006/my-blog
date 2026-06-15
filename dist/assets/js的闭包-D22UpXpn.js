var e=`---\r
title: 深入理解JavaScript闭包\r
date: 2026-02-10\r
tags: [JavaScript, 前端, 闭包, 学习笔记]\r
categories: JavaScript\r
---\r
\r
# 如何理解JavaScript闭包\r
\r
## 什么是闭包？\r
\r
作为一个前端实习生，我最近在学习JavaScript的时候，经常听到"闭包"这个词。一开始觉得很抽象，不太理解，后来通过一些例子和实践，逐渐明白了闭包的概念和用途。\r
\r
简单来说，**闭包就是一个函数能够访问其外部作用域中的变量，即使该外部函数已经执行完毕**。\r
\r
## 闭包的基本示例\r
\r
让我用一个简单的例子来解释闭包：\r
\r
\`\`\`javascript\r
function outer() {\r
  const outerVar = "我是外部变量";\r
\r
  function inner() {\r
    console.log(outerVar); // 可以访问外部变量\r
  }\r
\r
  return inner;\r
}\r
\r
const innerFunc = outer();\r
innerFunc(); // 输出：我是外部变量\r
\`\`\`\r
\r
在这个例子中，\`inner\`函数就是一个闭包，它可以访问\`outer\`函数中的\`outerVar\`变量，即使\`outer\`函数已经执行完毕。\r
\r
## 闭包的工作原理\r
\r
闭包之所以能够访问外部变量，是因为：\r
\r
1. 当一个函数被定义时，它会创建一个词法环境（lexical environment），记录了函数定义时的变量环境\r
2. 当函数被执行时，会创建一个执行上下文（execution context），包含了函数的参数、局部变量等\r
3. 当函数执行完毕后，其执行上下文会被销毁，但词法环境会被闭包保留\r
4. 因此，闭包可以继续访问其定义时的词法环境中的变量\r
\r
## 闭包的应用场景\r
\r
### 1. 数据私有化\r
\r
闭包可以用来创建私有变量，避免全局污染：\r
\r
\`\`\`javascript\r
function createCounter() {\r
  let count = 0; // 私有变量\r
\r
  return {\r
    increment: function () {\r
      count++;\r
      return count;\r
    },\r
    decrement: function () {\r
      count--;\r
      return count;\r
    },\r
    getCount: function () {\r
      return count;\r
    },\r
  };\r
}\r
\r
const counter = createCounter();\r
console.log(counter.increment()); // 1\r
console.log(counter.increment()); // 2\r
console.log(counter.decrement()); // 1\r
console.log(counter.getCount()); // 1\r
console.log(count); // 报错：count is not defined\r
\`\`\`\r
\r
### 2. 函数工厂\r
\r
闭包可以用来创建函数工厂，根据不同的参数创建不同的函数：\r
\r
\`\`\`javascript\r
function createMultiplier(multiplier) {\r
  return function (number) {\r
    return number * multiplier;\r
  };\r
}\r
\r
const double = createMultiplier(2);\r
const triple = createMultiplier(3);\r
\r
console.log(double(5)); // 10\r
console.log(triple(5)); // 15\r
\`\`\`\r
\r
### 3. 防抖和节流\r
\r
闭包可以用来实现防抖和节流函数：\r
\r
\`\`\`javascript\r
// 防抖函数\r
function debounce(func, delay) {\r
  let timer;\r
  return function () {\r
    clearTimeout(timer);\r
    timer = setTimeout(() => {\r
      func.apply(this, arguments);\r
    }, delay);\r
  };\r
}\r
\r
// 节流函数\r
function throttle(func, limit) {\r
  let inThrottle;\r
  return function () {\r
    if (!inThrottle) {\r
      func.apply(this, arguments);\r
      inThrottle = true;\r
      setTimeout(() => {\r
        inThrottle = false;\r
      }, limit);\r
    }\r
  };\r
}\r
\`\`\`\r
\r
## 闭包的注意事项\r
\r
### 1. 内存泄漏\r
\r
闭包会保留对外部变量的引用，可能导致内存泄漏。如果闭包引用了大对象，而闭包本身又被长期保存，那么这些大对象就不会被垃圾回收。\r
\r
### 2. 性能影响\r
\r
闭包会增加内存使用，因为它需要保存外部变量的引用。在使用闭包时，要注意不要过度使用，以免影响性能。\r
\r
### 3. 变量共享\r
\r
如果多个闭包引用了同一个外部变量，它们会共享这个变量的值：\r
\r
\`\`\`javascript\r
function createFunctions() {\r
  const functions = [];\r
  for (var i = 0; i < 5; i++) {\r
    functions.push(function () {\r
      console.log(i);\r
    });\r
  }\r
  return functions;\r
}\r
\r
const funcs = createFunctions();\r
funcs.forEach((func) => func()); // 输出5次5\r
\`\`\`\r
\r
这是因为\`var\`声明的变量是函数作用域，所有闭包共享同一个\`i\`变量。可以使用\`let\`声明变量来解决这个问题，因为\`let\`是块级作用域：\r
\r
\`\`\`javascript\r
function createFunctions() {\r
  const functions = [];\r
  for (let i = 0; i < 5; i++) {\r
    functions.push(function () {\r
      console.log(i);\r
    });\r
  }\r
  return functions;\r
}\r
\r
const funcs = createFunctions();\r
funcs.forEach((func) => func()); // 输出0, 1, 2, 3, 4\r
\`\`\`\r
\r
## 我的学习心得\r
\r
学习闭包的时候，一开始确实有点难理解，但是通过写一些小例子，慢慢就明白了。闭包是JavaScript中一个非常重要的概念，它使得JavaScript更加灵活和强大。\r
\r
### 学习要点\r
\r
1. **理解词法作用域**：闭包的基础是词法作用域，即函数可以访问其定义时所在的作用域中的变量\r
2. **掌握闭包的应用**：数据私有化、函数工厂、防抖节流等\r
3. **注意闭包的副作用**：内存泄漏、性能影响等\r
4. **实践出真知**：多写一些例子，加深对闭包的理解\r
\r
## 总结\r
\r
闭包是JavaScript中的一个重要概念，它允许函数访问其外部作用域中的变量，即使外部函数已经执行完毕。闭包有很多应用场景，如数据私有化、函数工厂、防抖节流等，但也需要注意其可能带来的内存泄漏和性能问题。\r
\r
作为一个前端实习生，理解闭包对于深入掌握JavaScript非常重要。希望这篇笔记能帮助我和其他初学者更好地理解闭包的概念和应用。\r
`;export{e as default};