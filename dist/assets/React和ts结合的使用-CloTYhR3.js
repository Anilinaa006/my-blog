var e=`---
title: React 与 TypeScript 结合使用详解
date: 2026-05-01
categories: React
---

# React 与 TypeScript 结合使用详解

## 为什么选择 React + TypeScript？

React 和 TypeScript 的结合是现代前端开发的主流选择，具有以下优势：

- **类型安全**：编译时类型检查，减少运行时错误
- **更好的开发体验**：IDE 智能提示和代码补全
- **更好的可维护性**：类型定义作为文档，代码更易理解
- **更好的重构支持**：类型系统帮助安全地重构代码

## 项目初始化

### 使用 Create React App

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

### 使用 Vite

\`\`\`bash
pnpm create vite@6.5.0 . --template react-ts
\`\`\`

## 基础类型定义

### 函数组件类型

\`\`\`tsx
import React from 'react';

interface Props {
  name: string;
  age?: number;
  onSubmit: (data: string) => void;
}

const UserCard: React.FC<Props> = ({ name, age, onSubmit }) => {
  return (
    <div>
      <h1>{name}</h1>
      {age && <p>年龄：{age}</p>}
      <button onClick={() => onSubmit(name)}>提交</button>
    </div>
  );
};

export default UserCard;
\`\`\`

### 类组件类型

\`\`\`tsx
import React, { Component } from 'react';

interface Props {
  title: string;
}

interface State {
  count: number;
}

class Counter extends Component<Props, State> {
  state: State = {
    count: 0
  };

  increment = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>计数：{this.state.count}</p>
        <button onClick={this.increment}>+1</button>
      </div>
    );
  }
}

export default Counter;
\`\`\`

## Hooks 的类型定义

### useState

\`\`\`tsx
import React, { useState } from 'react';

const Example: React.FC = () => {
  // 显式指定类型
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);

  interface User {
    id: number;
    name: string;
  }

  return (
    <div>
      <p>计数：{count}</p>
      {user && <p>用户：{user.name}</p>}
    </div>
  );
};
\`\`\`

### useEffect

\`\`\`tsx
import React, { useEffect, useState } from 'react';

interface Data {
  items: string[];
}

const DataFetcher: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <ul>
          {data.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );
};
\`\`\`

### useContext

\`\`\`tsx
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemedButton: React.FC = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('ThemedButton must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = context;

  return (
    <button 
      onClick={toggleTheme}
      style={{ 
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333'
      }}
    >
      切换主题
    </button>
  );
};
\`\`\`

## 事件处理类型

\`\`\`tsx
import React from 'react';

const EventHandlers: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('点击位置：', e.clientX, e.clientY);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('输入值：', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('表单提交');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleInput} />
      <button type="submit" onClick={handleClick}>提交</button>
    </form>
  );
};
\`\`\`

## 泛型组件

\`\`\`tsx
import React from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const List = <T extends {}>({ items, renderItem }: ListProps<T>) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

interface User {
  id: number;
  name: string;
}

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <List<User>
      items={users}
      renderItem={user => <span>{user.name}</span>}
    />
  );
};
\`\`\`

## 类型守卫

\`\`\`tsx
import React from 'react';

interface Admin {
  type: 'admin';
  permissions: string[];
}

interface User {
  type: 'user';
  role: string;
}

type Person = Admin | User;

const isAdmin = (person: Person): person is Admin => {
  return person.type === 'admin';
};

const PersonCard: React.FC<{ person: Person }> = ({ person }) => {
  return (
    <div>
      {isAdmin(person) ? (
        <p>管理员权限：{person.permissions.join(', ')}</p>
      ) : (
        <p>用户角色：{person.role}</p>
      )}
    </div>
  );
};
\`\`\`

## 常用工具类型

### Partial

\`\`\`tsx
interface User {
  name: string;
  age: number;
  email: string;
}

// 所有属性变为可选
type PartialUser = Partial<User>;

const updateUser = (id: number, updates: PartialUser) => {
  // 更新用户
};
\`\`\`

### Pick/Omit

\`\`\`tsx
interface User {
  id: number;
  name: string;
  age: number;
  password: string;
}

// 只选择指定属性
type UserPreview = Pick<User, 'id' | 'name'>;

// 排除指定属性
type SafeUser = Omit<User, 'password'>;
\`\`\`

### Record

\`\`\`tsx
// 创建键值对类型
type UserMap = Record<number, User>;

const users: UserMap = {
  1: { id: 1, name: '张三', age: 25, password: 'xxx' },
  2: { id: 2, name: '李四', age: 30, password: 'yyy' }
};
\`\`\`

## 实践建议

### 1. 使用 type 还是 interface？

- **interface**：用于定义对象结构，支持声明合并
- **type**：更灵活，可以定义联合类型、交叉类型等

### 2. 避免 any 类型

尽量使用具体类型或 unknown，避免使用 any，以免失去类型检查的好处。

### 3. 使用类型断言时要谨慎

\`\`\`tsx
// 避免
const data = response.data as any;

// 更好的做法
interface Data {
  items: string[];
}
const data = response.data as Data;
\`\`\`

### 4. 使用 React.FC 还是普通函数？

\`\`\`tsx
// 使用 React.FC（推荐）
const Component: React.FC<Props> = (props) => { ... };

// 或者不使用 React.FC
const Component = (props: Props) => { ... };
\`\`\`

### 5. 为第三方库添加类型

\`\`\`tsx
// 如果某个库没有类型定义
declare module 'some-library' {
  export function doSomething(): void;
}
\`\`\`

## 总结

React 与 TypeScript 的结合使用可以显著提高代码质量和开发效率。通过合理的类型定义和类型推断，我们可以编写更加健壮和可维护的代码。

---

**要点回顾**：
- 使用 \`React.FC<Props>\` 定义函数组件
- 使用泛型创建可复用的组件
- 合理使用类型守卫处理联合类型
- 利用工具类型简化类型定义
- 避免使用 any 类型

掌握这些技巧，你就可以在 React 项目中高效地使用 TypeScript 了！
`;export{e as default};