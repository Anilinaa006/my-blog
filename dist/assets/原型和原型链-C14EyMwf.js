var e=`---\r
title: JavaScript 原型和原型链详解\r
date: 2026-02-26\r
categories: JS\r
---\r
\r
# JavaScript 原型和原型链详解\r
\r
## 什么是原型？\r
\r
在 JavaScript 中，每个对象都有一个特殊的属性，称为 **原型（prototype）**。原型本身也是一个对象，它包含了可以被该对象继承的属性和方法。\r
\r
### 原型的作用\r
\r
- **实现继承**：通过原型，对象可以继承其他对象的属性和方法\r
- **代码复用**：多个对象可以共享同一个原型，避免重复定义相同的方法\r
- **动态属性**：可以在运行时向原型添加属性和方法，所有继承该原型的对象都会自动获得这些新属性和方法\r
\r
## 原型链\r
\r
当我们访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript 会沿着 **原型链（prototype chain）** 向上查找，直到找到该属性或方法，或者到达原型链的顶端（\`null\`）。\r
\r
### 原型链的结构\r
\r
- 每个对象都有一个原型（\`__proto__\`）\r
- 原型本身也是一个对象，所以它也有自己的原型\r
- 这样就形成了一条链式结构，称为原型链\r
- 原型链的顶端是 \`Object.prototype\`，它的原型是 \`null\`\r
\r
## 构造函数与原型\r
\r
在 JavaScript 中，构造函数是用来创建对象的函数。每个构造函数都有一个 \`prototype\` 属性，指向一个对象，这个对象就是通过该构造函数创建的所有实例的原型。\r
\r
### 构造函数示例\r
\r
\`\`\`javascript\r
// 定义一个构造函数\r
function Person(name, age) {\r
  this.name = name;\r
  this.age = age;\r
}\r
\r
// 向构造函数的原型添加方法\r
Person.prototype.sayHello = function () {\r
  console.log(\`Hello, my name is \${this.name}.\`);\r
};\r
\r
// 创建实例\r
const person1 = new Person("Alice", 25);\r
const person2 = new Person("Bob", 30);\r
\r
// 调用继承的方法\r
person1.sayHello(); // 输出: Hello, my name is Alice.\r
person2.sayHello(); // 输出: Hello, my name is Bob.\r
\r
// 检查原型\r
console.log(person1.__proto__ === Person.prototype); // true\r
console.log(Person.prototype.__proto__ === Object.prototype); // true\r
console.log(Object.prototype.__proto__); // null\r
\`\`\`\r
\r
## \`__proto__\` 和 \`prototype\` 的区别\r
\r
- **\`__proto__\`**：是对象实例的属性，指向该实例的原型\r
- **\`prototype\`**：是构造函数的属性，指向该构造函数创建的所有实例的原型\r
\r
### 关系图\r
\r
\`\`\`\r
person1.__proto__ → Person.prototype\r
Person.prototype.__proto__ → Object.prototype\r
Object.prototype.__proto__ → null\r
\r
Person.__proto__ → Function.prototype\r
Function.prototype.__proto__ → Object.prototype\r
\`\`\`\r
\r
## 原型继承\r
\r
JavaScript 中的继承主要通过原型链实现。当一个对象继承另一个对象时，它会继承该对象的所有属性和方法。\r
\r
### 原型继承示例\r
\r
\`\`\`javascript\r
// 父构造函数\r
function Animal(name) {\r
  this.name = name;\r
  this.eat = function () {\r
    console.log(\`\${this.name} is eating.\`);\r
  };\r
}\r
\r
// 向父构造函数的原型添加方法\r
Animal.prototype.sleep = function () {\r
  console.log(\`\${this.name} is sleeping.\`);\r
};\r
\r
// 子构造函数\r
function Dog(name, breed) {\r
  // 调用父构造函数\r
  Animal.call(this, name);\r
  this.breed = breed;\r
}\r
\r
// 继承父构造函数的原型\r
Dog.prototype = Object.create(Animal.prototype);\r
// 修复构造函数指向\r
Dog.prototype.constructor = Dog;\r
\r
// 向子构造函数的原型添加方法\r
Dog.prototype.bark = function () {\r
  console.log(\`\${this.name} is barking.\`);\r
};\r
\r
// 创建实例\r
const dog = new Dog("Buddy", "Golden Retriever");\r
\r
// 调用继承的方法\r
dog.eat(); // 输出: Buddy is eating.\r
dog.sleep(); // 输出: Buddy is sleeping.\r
dog.bark(); // 输出: Buddy is barking.\r
\r
// 检查原型链\r
console.log(dog.__proto__ === Dog.prototype); // true\r
console.log(Dog.prototype.__proto__ === Animal.prototype); // true\r
console.log(Animal.prototype.__proto__ === Object.prototype); // true\r
\`\`\`\r
\r
## 原型链的查找机制\r
\r
当访问一个对象的属性或方法时，JavaScript 会按照以下顺序查找：\r
\r
1. 首先在对象本身查找\r
2. 如果找不到，就到对象的原型（\`__proto__\`）中查找\r
3. 如果还是找不到，就到原型的原型中查找\r
4. 以此类推，直到找到该属性或方法，或者到达原型链的顶端（\`null\`）\r
\r
### 查找示例\r
\r
\`\`\`javascript\r
const obj = {};\r
\r
// 访问 obj.toString()\r
// 1. 在 obj 本身查找 toString - 找不到\r
// 2. 在 obj.__proto__ (即 Object.prototype) 中查找 toString - 找到\r
console.log(obj.toString()); // 输出: [object Object]\r
\r
// 访问 obj.nonExistentMethod()\r
// 1. 在 obj 本身查找 nonExistentMethod - 找不到\r
// 2. 在 obj.__proto__ 中查找 nonExistentMethod - 找不到\r
// 3. 在 obj.__proto__.__proto__ (即 null) 中查找 nonExistentMethod - 找不到\r
// 4. 抛出错误\r
console.log(obj.nonExistentMethod()); // 抛出错误: obj.nonExistentMethod is not a function\r
\`\`\`\r
\r
## 原型链的性能影响\r
\r
原型链查找会影响性能，尤其是当原型链较长时。每次访问属性或方法都需要沿着原型链向上查找，这会增加时间复杂度。\r
\r
### 性能优化建议\r
\r
1. **避免过深的原型链**：过深的原型链会增加查找时间\r
2. **将常用方法定义在对象本身**：对于频繁访问的方法，直接定义在对象本身上可以避免原型链查找\r
3. **使用 \`Object.hasOwnProperty()\`**：检查属性是否存在于对象本身，而不是原型链上\r
4. **使用 \`Object.create(null)\`**：创建一个没有原型的对象，避免原型链查找\r
\r
## ES6 中的类和继承\r
\r
ES6 引入了 \`class\` 语法，使 JavaScript 的面向对象编程更加直观。虽然底层仍然使用原型链实现，但语法更加简洁清晰。\r
\r
### ES6 类示例\r
\r
\`\`\`javascript\r
// 父类\r
class Animal {\r
  constructor(name) {\r
    this.name = name;\r
  }\r
\r
  eat() {\r
    console.log(\`\${this.name} is eating.\`);\r
  }\r
\r
  sleep() {\r
    console.log(\`\${this.name} is sleeping.\`);\r
  }\r
}\r
\r
// 子类\r
class Dog extends Animal {\r
  constructor(name, breed) {\r
    super(name); // 调用父类构造函数\r
    this.breed = breed;\r
  }\r
\r
  bark() {\r
    console.log(\`\${this.name} is barking.\`);\r
  }\r
}\r
\r
// 创建实例\r
const dog = new Dog("Buddy", "Golden Retriever");\r
\r
// 调用继承的方法\r
dog.eat(); // 输出: Buddy is eating.\r
dog.sleep(); // 输出: Buddy is sleeping.\r
dog.bark(); // 输出: Buddy is barking.\r
\r
// 检查原型链\r
console.log(dog.__proto__ === Dog.prototype); // true\r
console.log(Dog.prototype.__proto__ === Animal.prototype); // true\r
console.log(Animal.prototype.__proto__ === Object.prototype); // true\r
\`\`\`\r
\r
## 常见的原型链问题\r
\r
### 1. 修改原型影响所有实例\r
\r
当修改构造函数的原型时，所有通过该构造函数创建的实例都会受到影响。\r
\r
\`\`\`javascript\r
function Person(name) {\r
  this.name = name;\r
}\r
\r
const person1 = new Person("Alice");\r
const person2 = new Person("Bob");\r
\r
// 向原型添加方法\r
Person.prototype.sayHello = function () {\r
  console.log(\`Hello, my name is \${this.name}.\`);\r
};\r
\r
// 所有实例都可以访问新方法\r
person1.sayHello(); // 输出: Hello, my name is Alice.\r
person2.sayHello(); // 输出: Hello, my name is Bob.\r
\`\`\`\r
\r
### 2. 原型链的顶端\r
\r
原型链的顶端是 \`Object.prototype\`，它的原型是 \`null\`。\r
\r
\`\`\`javascript\r
console.log(Object.prototype.__proto__); // null\r
\`\`\`\r
\r
### 3. \`constructor\` 属性\r
\r
每个构造函数的原型都有一个 \`constructor\` 属性，指向该构造函数。当我们修改原型时，需要注意修复 \`constructor\` 属性的指向。\r
\r
\`\`\`javascript\r
function Person(name) {\r
  this.name = name;\r
}\r
\r
// 修改原型\r
Person.prototype = {\r
  sayHello: function () {\r
    console.log(\`Hello, my name is \${this.name}.\`);\r
  },\r
};\r
\r
// 修复 constructor 属性\r
Person.prototype.constructor = Person;\r
\r
const person = new Person("Alice");\r
console.log(person.constructor === Person); // true\r
\`\`\`\r
\r
## 原型链的应用\r
\r
### 1. 实现继承\r
\r
通过原型链可以实现对象之间的继承关系，使代码更加复用。\r
\r
### 2. 扩展内置对象\r
\r
可以通过修改内置对象的原型来扩展它们的功能。\r
\r
\`\`\`javascript\r
// 扩展 Array 原型\r
Array.prototype.sum = function () {\r
  return this.reduce((total, item) => total + item, 0);\r
};\r
\r
const numbers = [1, 2, 3, 4, 5];\r
console.log(numbers.sum()); // 输出: 15\r
\`\`\`\r
\r
### 3. 实现对象的深度拷贝\r
\r
可以利用原型链来实现对象的深度拷贝。\r
\r
\`\`\`javascript\r
function deepClone(obj) {\r
  if (obj === null || typeof obj !== "object") {\r
    return obj;\r
  }\r
\r
  // 创建一个新对象，使用原对象的原型\r
  const clone = Object.create(Object.getPrototypeOf(obj));\r
\r
  // 复制原对象的属性\r
  for (const key in obj) {\r
    if (obj.hasOwnProperty(key)) {\r
      clone[key] = deepClone(obj[key]);\r
    }\r
  }\r
\r
  return clone;\r
}\r
\r
const original = { name: "Alice", age: 25, address: { city: "New York" } };\r
const clone = deepClone(original);\r
\r
// 修改克隆对象不会影响原对象\r
clone.address.city = "London";\r
console.log(original.address.city); // 输出: New York\r
console.log(clone.address.city); // 输出: London\r
\`\`\`\r
\r
## 总结\r
\r
原型和原型链是 JavaScript 中非常重要的概念，它们是实现继承和代码复用的基础。理解原型和原型链对于掌握 JavaScript 的面向对象编程至关重要。\r
\r
### 关键点\r
\r
1. **每个对象都有一个原型**：通过 \`__proto__\` 属性访问\r
2. **构造函数有一个 prototype 属性**：指向所有实例的原型\r
3. **原型链**：当访问属性或方法时，会沿着原型链向上查找\r
4. **原型继承**：通过修改原型来实现对象之间的继承关系\r
5. **ES6 类**：语法糖，底层仍然使用原型链实现\r
\r
### 最佳实践\r
\r
1. **合理使用原型**：将共享的方法和属性定义在原型上\r
2. **避免修改内置对象的原型**：可能会导致冲突和不可预测的行为\r
3. **注意原型链的长度**：过长的原型链会影响性能\r
4. **使用 \`Object.hasOwnProperty()\`**：检查属性是否存在于对象本身\r
5. **理解 \`this\` 的指向**：在原型方法中，\`this\` 指向调用该方法的对象\r
\r
通过掌握原型和原型链的概念，你可以写出更加优雅、高效的 JavaScript 代码，更好地理解 JavaScript 的工作原理。\r
`;export{e as default};