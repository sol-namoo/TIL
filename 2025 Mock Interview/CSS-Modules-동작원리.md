# 🔍 CSS Modules 동작 원리 완전 정리

## 📋 질문에 대한 답변

### 1️⃣ .module.css 파일 형식은 일반 CSS와 동일한가?

**답: 네, 완전히 동일해요!**

`.module.css` 파일 안에는 일반 CSS 문법을 그대로 사용하면 돼. `.container`, `.button` 같은 클래스 선택자를 작성하면 되고, 특별한 문법은 없어.

```css
/* ProductList.module.css - 일반 CSS와 100% 동일 */
.container {
  padding: 20px;
}

.button {
  background: blue;
}
```

**차이점은 파일 확장자뿐이야!**
- 일반 CSS: `ProductList.css`
- CSS Modules: `ProductList.module.css` ← `.module`만 추가

---

## 2️⃣ TypeScript의 module declaration은 무엇인가?

### 💡 개념

TypeScript의 `declare module`은 **타입 정의**일 뿐이야. 실제로 CSS를 JavaScript 객체로 변환하는 건 아니고, 단지 "이런 파일을 import하면 이런 타입이야"라고 TypeScript 컴파일러에게 알려주는 거야.

### 🧠 단계별 해석

```typescript
// src/css-modules.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

#### 단어별 해석

1. **`declare module`**: "이 모듈의 타입을 선언한다"
2. **`'*.module.css'`**: "`.module.css`로 끝나는 모든 파일"
3. **`const classes`**: "이 모듈을 import하면 `classes`라는 상수가 나온다"
4. **`{ [key: string]: string }`**: "객체 타입인데, 키는 string, 값도 string"
5. **`export default classes`**: "기본 export로 이 객체를 내보낸다"

### 💬 실제 사용 예시

```typescript
// TypeScript가 이렇게 이해해:
import styles from './ProductList.module.css';
// styles의 타입은: { [key: string]: string }
// 즉, styles.container, styles.button 같은 프로퍼티가 string 타입

// 그래서 이렇게 사용 가능:
<div className={styles.container}>  // ✅ 타입 체크 통과
<div className={styles.unknown}>    // ⚠️ 타입 에러는 아니지만, 런타임에 undefined
```

### ⚠️ 중요한 점

**`declare module`은 타입 정의일 뿐, 실제 변환은 안 해!**

실제로 CSS를 JavaScript 객체로 변환하는 건 **빌드 도구**(webpack, vite, parcel 등)의 역할이야.

---

## 3️⃣ CSS가 JavaScript 객체로 변환되는 과정

### 💡 핵심 개념

CSS Modules는 **빌드 타임**(코드를 번들링할 때)에 처리돼. 빌드 도구가 CSS 파일을 읽어서 JavaScript 객체로 변환해.

### 🧠 변환 과정 (빌드 타임)

#### 원본 CSS 파일

```css
/* ProductList.module.css */
.container {
  padding: 20px;
}

.button {
  background: blue;
}
```

#### 빌드 도구가 변환한 JavaScript

```javascript
// 빌드 도구가 자동 생성 (실제로는 보이지 않음)
export default {
  container: "ProductList_container_abc123",
  button: "ProductList_button_def456"
};
```

#### 실제 HTML에 적용되는 클래스명

```html
<!-- 빌드 후 실제 HTML -->
<div class="ProductList_container_abc123">
  <button class="ProductList_button_def456">Click</button>
</div>
```

### 💬 빌드 도구별 설정

#### Webpack (Create React App, Next.js 등)

```javascript
// webpack.config.js (보통 자동 설정됨)
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,  // ← 이 옵션이 CSS Modules 활성화
            },
          },
        ],
      },
    ],
  },
};
```

#### Vite

```javascript
// vite.config.js (기본적으로 CSS Modules 지원)
// 별도 설정 불필요! .module.css만 사용하면 자동 활성화
```

### 🔍 실제 변환 과정 상세

1. **빌드 도구가 CSS 파일 읽기**
   ```css
   .container { padding: 20px; }
   ```

2. **CSS 파싱 (파일명, 클래스명 추출)**
   - 파일명: `ProductList.module.css`
   - 클래스명: `container`

3. **고유 클래스명 생성**
   - 원본: `container`
   - 변환: `ProductList_container_abc123`
   - 패턴: `[파일명]_[클래스명]_[해시]`

4. **JavaScript 객체 생성**
   ```javascript
   {
     container: "ProductList_container_abc123"
   }
   ```

5. **CSS 파일도 변환**
   ```css
   /* 원본 */
   .container { padding: 20px; }
   
   /* 변환 후 */
   .ProductList_container_abc123 { padding: 20px; }
   ```

---

## 4️⃣ 고유 클래스명 생성은 누가 해주는가?

### 💡 답변

**빌드 도구의 CSS Loader가 해줘요!**

### 🧠 각 빌드 도구의 역할

| 빌드 도구 | CSS Loader | 설정 필요? |
|----------|-----------|-----------|
| **Webpack** | `css-loader` | `modules: true` 옵션 |
| **Vite** | 내장 CSS 처리 | 자동 (`.module.css`만 사용) |
| **Parcel** | 내장 CSS 처리 | 자동 |
| **Next.js** | Webpack 기반 | 자동 |

### 💬 클래스명 생성 규칙

빌드 도구는 보통 이런 규칙으로 클래스명을 생성해:

```
[파일명]_[클래스명]_[해시]
```

예시:
- 파일: `ProductList.module.css`
- 클래스: `container`
- 해시: `abc123` (파일 내용 기반)
- 결과: `ProductList_container_abc123`

### 🔍 해시가 필요한 이유

**같은 클래스명이라도 다른 파일이면 다른 해시를 붙여서 충돌 방지!**

```css
/* Button.module.css */
.button { background: blue; }
/* → Button_button_xyz789 */

/* Card.module.css */
.button { background: red; }
/* → Card_button_abc123 */
```

두 파일 모두 `.button`을 사용해도, 빌드 후에는 완전히 다른 클래스명이 돼!

---

## 5️⃣ 전체 흐름 정리

### 📊 개발자 관점

```typescript
// 1. CSS 파일 작성 (일반 CSS 문법)
/* ProductList.module.css */
.container { padding: 20px; }

// 2. TypeScript에서 import
import styles from './ProductList.module.css';

// 3. 사용
<div className={styles.container}>
```

### 📊 빌드 타임 (자동 처리)

```
1. TypeScript 컴파일러
   → declare module로 타입 체크
   → "styles는 { [key: string]: string } 타입이구나"

2. 빌드 도구 (Webpack/Vite)
   → CSS 파일 읽기
   → 클래스명 추출
   → 고유 클래스명 생성 (해시 추가)
   → JavaScript 객체 생성
   → CSS 파일도 변환

3. 번들링
   → 모든 파일을 하나로 합치기
   → 최종 HTML/CSS/JS 생성
```

### 📊 런타임 (브라우저)

```html
<!-- 실제 HTML -->
<div class="ProductList_container_abc123">
  <!-- styles.container가 "ProductList_container_abc123"로 변환됨 -->
</div>
```

```css
/* 실제 CSS */
.ProductList_container_abc123 {
  padding: 20px;
}
```

---

## 6️⃣ 실제 예시로 이해하기

### 💬 시나리오: 두 컴포넌트가 같은 클래스명 사용

#### 컴포넌트 1

```css
/* Button.module.css */
.button {
  background: blue;
}
```

```typescript
// Button.tsx
import styles from './Button.module.css';
// styles = { button: "Button_button_xyz789" }
```

#### 컴포넌트 2

```css
/* Card.module.css */
.button {
  background: red;
}
```

```typescript
// Card.tsx
import styles from './Card.module.css';
// styles = { button: "Card_button_abc123" }
```

#### 결과

```html
<!-- 두 컴포넌트 모두 사용 -->
<button class="Button_button_xyz789">Button</button>
<div class="Card_button_abc123">Card</div>
```

**충돌 없음!** 각각 다른 클래스명이 생성됨.

---

## 7️⃣ TypeScript module declaration 상세 해석

### 💡 declare module 문법

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### 🧠 단계별 해석

#### 1. `declare module '*.module.css'`

- **의미**: "`.module.css`로 끝나는 모든 파일에 대한 타입 선언"
- **와일드카드 `*`**: 어떤 파일명이든 매칭
- **예시 매칭**:
  - ✅ `ProductList.module.css`
  - ✅ `Button.module.css`
  - ✅ `anything.module.css`

#### 2. `const classes: { [key: string]: string }`

- **의미**: "이 모듈을 import하면 `classes`라는 상수가 나오고, 타입은 객체"
- **`{ [key: string]: string }`**: 인덱스 시그니처
  - 키: string (클래스명)
  - 값: string (변환된 클래스명)
- **예시**:
  ```typescript
  {
    container: "ProductList_container_abc123",
    button: "ProductList_button_def456"
  }
  ```

#### 3. `export default classes`

- **의미**: "기본 export로 이 객체를 내보낸다"
- **사용법**:
  ```typescript
  import styles from './ProductList.module.css';
  // styles는 위의 classes 객체
  ```

### 💬 다른 방식으로도 선언 가능

```typescript
// 방법 1: 기본 (현재 사용 중)
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 방법 2: named export도 허용
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
  export { classes };  // named export도 가능
}

// 방법 3: 더 구체적인 타입
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
```

---

## 8️⃣ 빌드 도구 없이는 작동하지 않아요!

### ⚠️ 중요한 점

CSS Modules는 **빌드 도구가 필수**야. 순수 HTML/CSS/JS만으로는 작동하지 않아.

### 🧠 왜 빌드 도구가 필요한가?

1. **CSS 파싱**: CSS 파일을 읽어서 클래스명 추출
2. **클래스명 변환**: 고유한 클래스명 생성
3. **JavaScript 객체 생성**: CSS를 JS 객체로 변환
4. **CSS 파일 변환**: 원본 CSS도 변환된 클래스명으로 수정

### 💬 빌드 도구가 없으면?

```typescript
// 이 코드는 작동하지 않아요!
import styles from './ProductList.module.css';
// ❌ 브라우저는 CSS 파일을 JavaScript로 import할 수 없음
```

**브라우저는 CSS 파일을 직접 JavaScript 객체로 변환할 수 없어요!**

---

## 9️⃣ 요약

### ✅ 핵심 정리

1. **`.module.css` 파일 형식**: 일반 CSS와 100% 동일
2. **TypeScript `declare module`**: 타입 정의일 뿐, 실제 변환은 안 함
3. **실제 변환**: 빌드 도구(Webpack/Vite 등)가 빌드 타임에 처리
4. **고유 클래스명 생성**: 빌드 도구의 CSS Loader가 자동 생성
5. **변환 결과**: CSS → JavaScript 객체 + 변환된 CSS 파일

### 🎯 전체 흐름

```
개발자 작성
  ↓
[CSS 파일] .module.css (일반 CSS 문법)
  ↓
[TypeScript] declare module (타입 정의)
  ↓
[빌드 타임] 빌드 도구가 처리
  ├─ CSS 파싱
  ├─ 클래스명 추출
  ├─ 고유 클래스명 생성 (해시 추가)
  ├─ JavaScript 객체 생성
  └─ CSS 파일 변환
  ↓
[런타임] 브라우저에서 사용
  ├─ JavaScript: styles.container → "ProductList_container_abc123"
  └─ CSS: .ProductList_container_abc123 { ... }
```

---

**작성일**: 2025년  
**참고**: 이 문서는 CSS Modules의 동작 원리를 이해하기 위한 설명서입니다.

