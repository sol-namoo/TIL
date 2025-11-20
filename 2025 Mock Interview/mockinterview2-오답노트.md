# 🌿 React 면접 실전 과제 복습 노트 (입문~중급 완전판)

**면접 일자**: 2025년  
**문제**: Product List with Search & Filter  
**목표 시간**: 30-40분 | **실제 소요**: 1시간 30분

---

## 1️⃣ Debounce는 어떻게 구현해야 할까?

### 💡 개념

Debounce는 "입력이 멈춘 후 일정 시간이 지나면 실행"하는 기법이야. 검색창에서 타이핑할 때마다 API를 호출하는 것을 방지하기 위해 사용해.

### 🧠 핵심 구분

| 잘못된 방법                    | 올바른 방법                  | 이유                                                 |
| ------------------------------ | ---------------------------- | ---------------------------------------------------- |
| `setTimeout(wait, callback())` | `setTimeout(callback, wait)` | 인자 순서가 반대! `callback()`은 즉시 실행됨         |
| `AbortController` 사용         | `clearTimeout` 사용          | AbortController는 fetch용, setTimeout은 clearTimeout |
| 전역 변수로 타이머 관리        | `useEffect` cleanup으로 관리 | 메모리 누수 방지, React 생명주기와 맞음              |

### 💬 잘못된 코드

```typescript
// ❌ 이렇게 하면 안 돼!
let debounceAbort;
let debounceTimer;
const debounce = (callback, wait) => {
  debounceAbort.abort(); // undefined일 때 에러!
  debounceAbort = new AbortController();
  debounceTimer = setTimeout(wait, callback(), {
    // 순서 틀림, 즉시 실행
    signal: debounceAbort.signal,
  });
};
```

### 💬 올바른 코드 (React 권장)

```typescript
// ✅ useEffect 방식 (가장 안전)
const [keyword, setKeyword] = useState("");
const [debouncedKeyword, setDebouncedKeyword] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedKeyword(keyword); // 항상 최신 keyword 참조
  }, 500);

  return () => clearTimeout(timer); // cleanup: 새 입력 시 이전 타이머 취소
}, [keyword]);
```

### 💬 왜 중요한가?

- **React 생명주기와 완벽히 맞음**: cleanup 함수로 자동 정리
- **메모리 누수 방지**: 컴포넌트 언마운트 시 타이머 자동 취소
- **항상 최신 값**: `keyword` 변경 시마다 effect 재실행되어 최신 값 참조

---

## 2️⃣ 필터링 로직에서 Map의 키와 값을 구분하자

### 💡 개념

TypeScript에서 `as const`로 만든 객체의 키와 값은 다른 타입이야. 키는 `"All" | "ELECTRONICS"` 같은 리터럴 타입이고, 값은 `"all" | "electronics"` 같은 문자열이야.

### 🧠 핵심 구분

| 비교 대상                      | 타입                     | 예시 값         |
| ------------------------------ | ------------------------ | --------------- |
| `category` (state)             | `"All" \| "ELECTRONICS"` | `"ELECTRONICS"` |
| `item.category` (API 응답)     | `string`                 | `"electronics"` |
| `productCategoryMap[category]` | `"all" \| "electronics"` | `"electronics"` |

### 💬 잘못된 코드

```typescript
// ❌ 직접 비교하면 안 돼!
const filteredList = useMemo(
  () =>
    list?.filter(
      (item) =>
        item.category === category && // "electronics" === "ELECTRONICS" ❌
        item.title.includes(keyword) // 대소문자 구분 ❌
    ),
  [list, keyword, category]
);
```

### 💬 올바른 코드

```typescript
// ✅ Map을 통해 값으로 변환 후 비교
const filteredList = useMemo(() => {
  if (!list) return [];

  return list.filter((item) => {
    // 카테고리: "All"이거나 Map 값과 비교
    const matchesCategory =
      category === "All" || item.category === productCategoryMap[category];

    // 키워드: 대소문자 무시
    const matchesKeyword =
      debouncedKeyword === "" ||
      item.title.toLowerCase().includes(debouncedKeyword.toLowerCase());

    return matchesCategory && matchesKeyword;
  });
}, [list, debouncedKeyword, category]);
```

### 💬 왜 중요한가?

- **타입 안정성**: TypeScript가 키와 값을 구분하여 타입 체크
- **실제 데이터와 매칭**: API 응답은 값(`"electronics"`)이므로 Map을 통해 변환 필요
- **"전체" 케이스 처리**: `"All"`은 특별 케이스로 별도 처리

---

## 3️⃣ Button의 onClick에서는 value를 직접 전달하자

### 💡 개념

HTML에서 `button` 요소의 `value` 속성은 form 제출 시에만 의미가 있어. `onClick` 이벤트에서는 `e.target.value`가 `undefined`가 돼. 대신 화살표 함수로 직접 값을 전달해야 해.

### 🧠 핵심 구분

| 요소     | value 접근 방법     | 사용 사례                        |
| -------- | ------------------- | -------------------------------- |
| `input`  | `e.target.value` ✅ | 텍스트 입력, 선택                |
| `button` | 직접 전달 ✅        | `onClick={() => handler(value)}` |
| `select` | `e.target.value` ✅ | 드롭다운 선택                    |

### 💬 잘못된 코드

```typescript
// ❌ button의 value는 접근 불가
const handleCategoryChange = (e) => {
  setCategory(e.target.value); // undefined!
};

<button value={item} onClick={handleCategoryChange}>
  {item}
</button>;
```

### 💬 올바른 코드

```typescript
// ✅ 화살표 함수로 직접 전달
const handleCategoryChange = (selectedCategory: ProductCategory) => {
  setCategory(selectedCategory);
};

{
  productCategory.map((item) => {
    return (
      <button
        key={item}
        onClick={() => handleCategoryChange(item)} // 직접 전달
      >
        {productCategoryMap[item]} {/* 표시는 값, 전달은 키 */}
      </button>
    );
  });
}
```

### 💬 왜 중요한가?

- **타입 안정성**: 파라미터 타입을 명시하여 TypeScript 오류 방지
- **명확한 의도**: 어떤 값이 전달되는지 코드만 봐도 알 수 있음
- **재사용성**: 핸들러 함수를 다른 곳에서도 쉽게 재사용 가능

---

## 4️⃣ 클로저는 "값"이 아니라 "스코프"를 참조한다

### 💡 개념

클로저는 함수가 생성된 스코프의 변수에 대한 참조를 유지해. 하지만 React State는 컴포넌트 리렌더링 시마다 새 값이 되기 때문에, 클로저로 캡처하면 오래된 값을 참조할 수 있어.

### 🧠 핵심 구분

| 상황                    | 클로저 동작         | 결과              |
| ----------------------- | ------------------- | ----------------- |
| 일반 변수               | 스코프 참조 유지    | 항상 최신 값 ✅   |
| React State (캡처)      | 생성 시점 값만 캡처 | 오래된 값 참조 ❌ |
| React State (useEffect) | effect 재실행       | 항상 최신 값 ✅   |

### 💬 잘못된 코드

```typescript
// ❌ 클로저가 생성 시점의 keyword만 캡처
const debouncedSetKeyword = useMemo(
  () =>
    debounce(() => {
      setDebouncedKeyword(keyword); // 초기값("")만 참조
    }, 500),
  [] // keyword 변경되어도 재생성 안 됨
);
```

### 💬 올바른 이해

```typescript
// ✅ useEffect는 keyword 변경 시마다 재실행
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedKeyword(keyword); // 항상 최신 keyword
  }, 500);
  return () => clearTimeout(timer);
}, [keyword]); // keyword 변경 시마다 이 effect 재실행
```

### 💬 클로저 예시

```typescript
// 클로저는 "스코프"를 참조
function example() {
  let count = 0; // 이 변수는 example의 스코프에 있음

  return function increment() {
    count++; // 같은 count 변수를 계속 참조
    console.log(count);
  };
}

const inc = example();
inc(); // 1
inc(); // 2
inc(); // 3  ← 같은 count 변수!
```

### 💬 왜 중요한가?

- **React State 특성 이해**: State는 리렌더링 시 새 값이 되므로 클로저로 캡처하면 안 돼
- **useEffect의 역할**: 의존성 배열로 최신 값 참조 보장
- **메모리 관리**: cleanup 함수로 타이머 정리하여 메모리 누수 방지

---

## 5️⃣ 시간 관리: MVP 우선, 완벽함은 나중에

### 💡 개념

코딩 인터뷰에서는 **완성도가 완벽함보다 중요해**. 모든 기능을 완벽하게 구현하려다 시간을 다 쓰면, 기본 기능도 못 끝낼 수 있어.

### 🧠 핵심 구분

| 접근 방식 | 시간 배분                                  | 결과             |
| --------- | ------------------------------------------ | ---------------- |
| 완벽주의  | Debounce 1시간 → CSS 미완성                | ❌ 불완전한 제출 |
| MVP 우선  | 기본 기능 20분 → 스타일 10분 → 최적화 10분 | ✅ 완성된 제출   |

### 💬 올바른 우선순위

```
1단계: 기본 기능 (20분)
  ✅ API 호출 및 데이터 표시
  ✅ 기본 검색 (debounce 없이)
  ✅ 카테고리 필터

2단계: 스타일링 (10분)
  ✅ 기본 레이아웃
  ✅ 반응형 그리드

3단계: 최적화 (10분)
  ✅ Debounce 추가
  ✅ 성능 최적화
```

### 💬 왜 중요한가?

- **면접관 평가**: 완성된 기능 > 완벽한 일부 기능
- **실무 적용**: MVP로 빠르게 검증 후 점진적 개선
- **시간 관리**: 막히면 10-15분 후 질문하거나 우선순위 조정

---

## 6️⃣ Debounce vs Throttle 구분하기

### 💡 개념

둘 다 성능 최적화 기법이지만, **언제 실행되는지**가 달라.

### 🧠 핵심 구분

| 기법         | 실행 시점                     | 사용 사례        |
| ------------ | ----------------------------- | ---------------- |
| **Debounce** | 입력이 멈춘 후 일정 시간 경과 | 검색창, 폼 검증  |
| **Throttle** | 일정 시간마다 최대 1회 실행   | 스크롤, 리사이즈 |

### 💬 예시

```typescript
// Debounce: 마지막 입력 후 500ms 후 실행
사용자 입력: a → (200ms) → b → (300ms) → c → (500ms 대기) → 실행
실행 횟수: 1회

// Throttle: 500ms마다 최대 1회 실행
사용자 입력: a → (200ms) → b → (300ms) → c → (500ms 경과) → 실행
실행 횟수: 여러 번 (500ms 간격)
```

### 💬 왜 중요한가?

- **적절한 선택**: 검색은 Debounce, 스크롤은 Throttle
- **UX 향상**: 불필요한 연산 방지로 부드러운 사용자 경험

---

## 7️⃣ React Hooks 패턴 정리

### 💡 개념

React Hooks는 각각 특정 목적이 있어. 잘못 사용하면 성능 문제나 버그가 생길 수 있어.

### 🧠 핵심 구분

| Hook          | 목적              | 의존성 배열           |
| ------------- | ----------------- | --------------------- |
| `useState`    | 상태 관리         | 없음                  |
| `useEffect`   | 사이드 이펙트     | 의존성 변경 시 재실행 |
| `useMemo`     | 값 메모이제이션   | 의존성 변경 시 재계산 |
| `useCallback` | 함수 메모이제이션 | 의존성 변경 시 재생성 |

### 💬 예시

```typescript
// useMemo: 필터링 결과 메모이제이션
const filteredList = useMemo(
  () => list?.filter(/* ... */),
  [list, debouncedKeyword, category] // 이 값들이 변경될 때만 재계산
);

// useCallback: 함수 메모이제이션 (자식 컴포넌트에 props로 전달할 때)
const handleClick = useCallback(
  () => {
    /* ... */
  },
  [dependency] // 이 값이 변경될 때만 재생성
);
```

### 💬 왜 중요한가?

- **성능 최적화**: 불필요한 재계산/재생성 방지
- **의존성 관리**: 의존성 배열을 정확히 설정해야 최신 값 참조

---

## 8️⃣ TypeScript 타입 안정성 팁

### 💡 개념

TypeScript는 타입을 통해 오류를 미리 잡아줘. 하지만 타입 단언이나 타입 가드를 잘못 사용하면 런타임 에러가 날 수 있어.

### 🧠 핵심 구분

| 기법           | 사용 시점           | 예시                          |
| -------------- | ------------------- | ----------------------------- |
| `as const`     | 리터럴 타입 고정    | `{ All: "all" } as const`     |
| `keyof typeof` | 객체의 키 타입 추출 | `type Key = keyof typeof obj` |
| 타입 단언 `as` | 타입 강제 변환      | `Object.keys() as Array<Key>` |
| 타입 가드      | 런타임 타입 체크    | `if (typeof x === 'string')`  |

### 💬 예시

```typescript
// as const: 리터럴 타입으로 고정
const productCategoryMap = {
  All: "all",
  ELECTRONICS: "electronics",
} as const;

// keyof typeof: 키 타입 추출
type ProductCategory = keyof typeof productCategoryMap;
// 결과: "All" | "ELECTRONICS"

// 타입 단언: Object.keys()의 string[]을 구체 타입으로
const productCategory = Object.keys(productCategoryMap) as Array<
  keyof typeof productCategoryMap
>;
```

### 💬 왜 중요한가?

- **타입 안정성**: 컴파일 타임에 오류 발견
- **자동완성**: IDE가 정확한 타입 힌트 제공
- **리팩토링 안전성**: 타입 변경 시 관련 코드 자동 감지

---

## 📚 실전 체크리스트

### 면접 전 확인사항

- [ ] Debounce/Throttle 구현 연습
- [ ] React Hooks 패턴 복습
- [ ] TypeScript 타입 시스템 이해
- [ ] 시간 제한 연습 (30분 타이머)
- [ ] MVP 접근법 훈련
- [ ] 클로저 개념 정리

### 면접 중 전략

1. **문제 이해** (5분): 요구사항 정리, 질문하기
2. **계획 수립** (5분): 우선순위 정하기, 시간 배분
3. **기본 구현** (20분): MVP 완성
4. **스타일링** (10분): 기본 레이아웃
5. **최적화** (10분): Debounce, 성능 개선

### 막혔을 때

- 10-15분 이상 막히면 질문하기
- 우선순위 조정하기
- 일단 동작하는 코드부터 만들기

---

**작성일**: 2025년  
**다음 리뷰**: 1주일 후
