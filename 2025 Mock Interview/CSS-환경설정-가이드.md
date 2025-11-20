# 🎨 React + TypeScript CSS 환경 설정 가이드

## 📋 개요

React + TypeScript 프로젝트에서 CSS를 사용하는 세 가지 방법의 환경 설정 방법을 정리했어.

| 방법 | 설정 난이도 | 타입 안정성 | 스타일 격리 | 런타임 오버헤드 |
|------|------------|------------|------------|---------------|
| **일반 CSS** | ⭐ 쉬움 | ❌ | ❌ | 없음 |
| **CSS Modules** | ⭐⭐ 보통 | ✅ | ✅ | 없음 |
| **Styled Components** | ⭐⭐ 보통 | ✅ | ✅ | 있음 (작음) |

---

## 1️⃣ 일반 CSS (Plain CSS)

### 💡 개념

가장 기본적인 방법이야. 별도 설정 없이 바로 사용할 수 있어. 하지만 스타일이 전역으로 적용되고, 클래스명 충돌 위험이 있어.

### 🛠️ 설정 방법

#### 단계 1: CSS 파일 생성

```bash
# 컴포넌트와 같은 디렉토리에 CSS 파일 생성
touch src/components/ProductList.css
```

#### 단계 2: CSS 파일 작성

```css
/* ProductList.css */
.product-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.category-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.category-button:hover {
  background: #f0f0f0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
```

#### 단계 3: 컴포넌트에서 import

```typescript
// ProductListComponent.tsx
import './ProductList.css';  // CSS 파일 import

export function ProductListComponent() {
  return (
    <div className="product-list-container">
      <div className="search-container">
        <input className="search-input" />
      </div>
      {/* ... */}
    </div>
  );
}
```

### ✅ 장점
- 설정 불필요, 바로 사용 가능
- 가장 간단한 방법
- 빌드 도구 없이도 동작

### ⚠️ 단점
- 전역 스타일 (클래스명 충돌 가능)
- 타입 안정성 없음
- 스타일 격리 불가

---

## 2️⃣ CSS Modules

### 💡 개념

CSS 파일을 모듈로 만들어서 클래스명을 자동으로 고유하게 만들어줘. 스타일 격리가 자동으로 되고, TypeScript 타입도 생성돼.

### 🛠️ 설정 방법

#### 단계 1: CSS Modules 타입 정의 파일 생성

```bash
# 프로젝트 루트에 타입 정의 파일 생성
touch src/css-modules.d.ts
```

#### 단계 2: 타입 정의 작성

```typescript
// src/css-modules.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// CSS Modules를 사용하지 않는 일반 CSS도 타입 정의
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

#### 단계 3: CSS Module 파일 생성 (`.module.css` 확장자)

```bash
# .module.css 확장자로 파일 생성
touch src/components/ProductList.module.css
```

#### 단계 4: CSS Module 파일 작성

```css
/* ProductList.module.css */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.searchContainer {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.searchInput {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.categoryButtons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.categoryButton {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.categoryButton:hover {
  background: #f0f0f0;
}

.categoryButtonActive {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.productGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* 반응형: 모바일 우선 */
@media (max-width: 768px) {
  .productGrid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .productGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.productCard {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  transition: box-shadow 0.2s;
}

.productCard:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.productTitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}
```

#### 단계 5: 컴포넌트에서 사용

```typescript
// ProductListComponent.tsx
import styles from './ProductList.module.css';

export function ProductListComponent() {
  const [category, setCategory] = useState<ProductCategory>("All");

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input className={styles.searchInput} />
      </div>

      <div className={styles.categoryButtons}>
        {productCategory.map((item) => {
          return (
            <button
              key={item}
              className={`${styles.categoryButton} ${
                category === item ? styles.categoryButtonActive : ''
              }`}
              onClick={() => handleCategoryChange(item)}
            >
              {productCategoryMap[item]}
            </button>
          );
        })}
      </div>

      <div className={styles.productGrid}>
        {/* ... */}
      </div>
    </div>
  );
}
```

### ✅ 장점
- 스타일 자동 격리 (클래스명 충돌 없음)
- TypeScript 타입 지원 (자동완성)
- 빌드 타임에 최적화
- 런타임 오버헤드 없음

### ⚠️ 단점
- `.module.css` 확장자 필수
- 빌드 도구가 CSS Modules를 지원해야 함 (대부분 지원)

### 💡 팁: 클래스명 여러 개 적용하기

```typescript
// 방법 1: 템플릿 리터럴
className={`${styles.button} ${isActive ? styles.active : ''}`}

// 방법 2: 배열 + join
className={[styles.button, isActive && styles.active].filter(Boolean).join(' ')}

// 방법 3: clsx 라이브러리 (추천)
import clsx from 'clsx';
className={clsx(styles.button, isActive && styles.active)}
```

---

## 3️⃣ Styled Components

### 💡 개념

CSS-in-JS 방식이야. JavaScript/TypeScript 안에서 CSS를 작성할 수 있어. 컴포넌트 단위로 스타일이 격리되고, props로 동적 스타일링이 쉬워.

### 🛠️ 설정 방법

#### 단계 1: 패키지 설치

```bash
# Styled Components 설치
npm install styled-components

# TypeScript 타입 정의 설치
npm install --save-dev @types/styled-components
```

#### 단계 2: 타입 정의 (선택사항, 권장)

```typescript
// src/styled.d.ts 또는 src/types/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
```

#### 단계 3: Theme 파일 생성 (선택사항, 권장)

```typescript
// src/theme.ts
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};
```

#### 단계 4: 컴포넌트에서 사용

```typescript
// ProductListComponent.tsx
import styled from 'styled-components';

// Styled Components 정의
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

interface CategoryButtonProps {
  $isActive?: boolean;  // $ 접두사: DOM에 전달되지 않음
}

const CategoryButton = styled.button<CategoryButtonProps>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: ${props => props.$isActive ? '#007bff' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#212529'};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isActive ? '#0056b3' : '#f0f0f0'};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  /* 반응형: 모바일 우선 */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

// 컴포넌트 사용
export function ProductListComponent() {
  const [category, setCategory] = useState<ProductCategory>("All");

  return (
    <Container>
      <SearchContainer>
        <SearchInput value={keyword} onChange={handleKeywordChange} />
        <button>🔍</button>
      </SearchContainer>

      <CategoryButtons>
        {productCategory.map((item) => {
          return (
            <CategoryButton
              key={item}
              $isActive={category === item}
              onClick={() => handleCategoryChange(item)}
            >
              {productCategoryMap[item]}
            </CategoryButton>
          );
        })}
      </CategoryButtons>

      <ProductGrid>
        {filteredList?.map((item) => (
          <ProductCard key={item.id}>
            <ProductTitle>{item.title}</ProductTitle>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
}
```

### ✅ 장점
- 컴포넌트와 스타일이 함께 있어서 관리 쉬움
- Props로 동적 스타일링 쉬움
- TypeScript 완벽 지원
- 자동 스타일 격리

### ⚠️ 단점
- 런타임 오버헤드 (작지만 존재)
- 패키지 설치 필요
- CSS 파일과 분리되어 있어서 디자이너와 협업 시 불편할 수 있음

### 💡 팁: Theme 사용하기

```typescript
// App.tsx 또는 최상위 컴포넌트
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ProductListComponent />
    </ThemeProvider>
  );
}

// Styled Component에서 theme 사용
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;
```

---

## 🎯 각 방법 비교 및 선택 가이드

### 상황별 추천

| 상황 | 추천 방법 | 이유 |
|------|----------|------|
| 빠른 프로토타입 | 일반 CSS | 설정 불필요 |
| 대규모 프로젝트 | CSS Modules | 성능 + 격리 |
| 동적 스타일링 많음 | Styled Components | Props 활용 쉬움 |
| 디자이너와 협업 | CSS Modules | CSS 파일 공유 쉬움 |
| 타입 안정성 중요 | CSS Modules / Styled Components | 둘 다 지원 |

### 성능 비교

- **일반 CSS**: 가장 빠름 (별도 처리 없음)
- **CSS Modules**: 빠름 (빌드 타임 처리)
- **Styled Components**: 약간 느림 (런타임 처리, 하지만 미미함)

---

## 📝 실전 예시: 현재 프로젝트에 적용하기

### CSS Modules 적용 예시

```typescript
// 1. ProductList.module.css 파일 생성
// 2. 타입 정의 파일 생성 (css-modules.d.ts)
// 3. 컴포넌트 수정

import styles from './ProductList.module.css';

export function ProductListComponent() {
  // ... 기존 코드 ...

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input 
          className={styles.searchInput}
          value={keyword} 
          onChange={handleKeywordChange} 
        />
        <button>🔍</button>
      </div>

      <div className={styles.categoryButtons}>
        {productCategory.map((item) => {
          return (
            <button
              key={item}
              className={`${styles.categoryButton} ${
                category === item ? styles.categoryButtonActive : ''
              }`}
              onClick={() => handleCategoryChange(item)}
            >
              {productCategoryMap[item]}
            </button>
          );
        })}
      </div>

      <h1>Product List</h1>
      <ul className={styles.productGrid}>
        {loading && <li className={styles.loading}>loading...</li>}
        {error && <li className={styles.error}>Something went wrong...</li>}
        {!loading && !error && filteredList && (
          filteredList.length === 0 ? (
            <li className={styles.loading}>Nothing was found</li>
          ) : (
            filteredList.map((item) => (
              <li key={item.id} className={styles.productCard}>
                <div className={styles.productTitle}>{item.title}</div>
              </li>
            ))
          )
        )}
      </ul>
    </div>
  );
}
```

---

## 🚀 빠른 시작 체크리스트

### 일반 CSS
- [ ] CSS 파일 생성
- [ ] 컴포넌트에서 `import './file.css'`
- [ ] `className` 사용

### CSS Modules
- [ ] `*.module.css` 파일 생성
- [ ] `css-modules.d.ts` 타입 정의 파일 생성
- [ ] 컴포넌트에서 `import styles from './file.module.css'`
- [ ] `className={styles.className}` 사용

### Styled Components
- [ ] `npm install styled-components @types/styled-components`
- [ ] `import styled from 'styled-components'`
- [ ] Styled Component 정의
- [ ] JSX에서 사용

---

**작성일**: 2025년  
**다음 업데이트**: 필요 시

