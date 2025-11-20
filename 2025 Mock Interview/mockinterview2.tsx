/**
 * 🎯 Mock Technical Interview - Problem Set
 *
 * 면접관: AI Assistant
 * 지원자: [Your Name]
 *
 * ============================================
 * 📋 PROBLEM: Product List with Search & Filter
 * ============================================
 *
 * 🎯 목표
 * - REST API에서 제품 목록을 가져와 화면에 표시
 * - 실시간 검색 기능 구현
 * - 카테고리별 필터링 기능 추가
 * - 로딩 및 에러 상태 처리
 *
 * 📦 요구사항
 * 1. API 엔드포인트: https://fakestoreapi.com/products
 * 2. 검색: 제품명(title) 기준 실시간 검색
 * 3. 필터: 카테고리(category)별 필터링
 * 4. UI: 반응형 레이아웃 (모바일 우선)
 * 5. 상태 관리: React hooks (useState, useEffect)
 *
 * 🎨 UI 요구사항
 * - 검색 입력창 (상단)
 * - 카테고리 필터 버튼들 (검색창 아래)
 * - 제품 카드 그리드 (반응형: 모바일 1열, 태블릿 2열, 데스크톱 3열)
 * - 각 카드: 이미지, 제품명, 가격, 평점
 * - 로딩 스피너
 * - 에러 메시지 표시
 *
 * 🔧 기술 스택
 * - TypeScript
 * - React (함수형 컴포넌트)
 * - CSS (또는 CSS Modules / Styled Components)
 *
 * ⚠️ 제약사항
 * - 외부 라이브러리 사용 금지 (React, TypeScript만 사용)
 * - 30-40분 내 구현 목표
 * - 코드는 단계별로 설명하며 작성
 *
 * 📝 예시 데이터 구조
 * {
 *   id: number,
 *   title: string,
 *   price: number,
 *   description: string,
 *   category: string,
 *   image: string,
 *   rating: { rate: number, count: number }
 * }
 *
 * ✅ 평가 기준
 * 1. Core Technical Execution
 *    - TypeScript 타입 정의
 *    - 비동기 처리 (async/await 또는 Promise)
 *    - 상태 관리 로직
 *    - 이벤트 핸들링
 *
 * 2. Code Quality & Refactoring
 *    - 함수 분리 및 재사용성
 *    - 변수/함수 네이밍
 *    - 에러 핸들링
 *
 * 3. Collaboration & Communication
 *    - 문제 이해 및 접근 방식 설명
 *    - 트레이드오프 설명
 *    - 코드 작성 중 사고 과정 표현
 *
 * ============================================
 * 🚀 시작하기
 * ============================================
 *
 * 아래에 최소한의 코드 구조가 준비되어 있습니다.
 * 이제 인터뷰를 시작하겠습니다!
 */

import { useState, useEffect, useMemo } from "react";

// ============================================
// 타입 정의
// ============================================

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const productCategoryMap = {
  All: "all",
  ELECTRONICS: "electronics",
  JEWELERY: "jewelery",
  MEN_CLOTHING: "men's clothing",
  WOMEN_CLOTHING: "women's clothing",
} as const;
const productCategory = Object.keys(productCategoryMap) as Array<
  keyof typeof productCategoryMap
>;
type ProductCategory = keyof typeof productCategoryMap;

// ============================================
// 유틸 함수
// ============================================

// ============================================
// 메인 컴포넌트
// ============================================

export function ProductListComponent() {
  // TODO: 상태 관리
  const [list, setList] = useState<Product[] | null>(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [category, setCategory] = useState<ProductCategory>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const filteredList = useMemo(() => {
    if (!list) return [];

    return list.filter((item) => {
      // 카테고리 필터
      const matchesCategory =
        category === "All" || item.category === productCategoryMap[category];

      // 키워드 필터 (대소문자 무시)
      const matchesKeyword =
        debouncedKeyword === "" ||
        item.title.toLowerCase().includes(debouncedKeyword.toLowerCase());

      return matchesCategory && matchesKeyword;
    });
  }, [list, debouncedKeyword, category]);

  // TODO: 검색 및 필터 로직

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value); // 즉시 업데이트 (UI 반응성)
  };

  const handleCategoryChange = (selectedCategory: ProductCategory) => {
    setCategory(selectedCategory);
  };

  useEffect(() => {
    // TODO: API 호출
    const abort = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch("https://fakestoreapi.com/products", {
          signal: abort.signal,
        });
        if (!resp.ok) {
          throw new Error("Response Error");
        }
        const data = await resp.json();
        setList(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
    return () => abort.abort();
  }, []);

  // Debounce: keyword가 변경될 때마다 500ms 후에 debouncedKeyword 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // TODO: UI 렌더링
  return (
    <div>
      {/* TODO: 검색창, 필터, 제품 목록 구현 */}
      <div>
        <input value={keyword} onChange={handleKeywordChange}></input>
        <button>🔍</button>
      </div>

      <div>
        {productCategory.map((item) => {
          return (
            <button key={item} onClick={() => handleCategoryChange(item)}>
              {productCategoryMap[item]}
            </button>
          );
        })}
      </div>

      <h1>Product List</h1>
      <ul>
        {loading && <h6>loading...</h6>}
        {error && <h6>Something went wrong...</h6>}
        {!loading &&
          !error &&
          filteredList &&
          (filteredList.length === 0 ? (
            <h6>Nothing was found</h6>
          ) : (
            filteredList.map((item) => (
              <li key={item.id}>
                <div>
                  <div>{item.title}</div>
                </div>
              </li>
            ))
          ))}
      </ul>
    </div>
  );
}

// ============================================
// 📊 Mock Interview 평가 요약
// ============================================
//
// 전체 평가 점수
// - Core Technical Execution: 7/10
// - Code Quality & Refactoring: 6/10
// - Collaboration & Communication: 9/10
// - 시간 관리: 5/10
//
// ✅ 강점
// 1. 문제 이해 및 의사소통 능력 우수
//    - API 제약 파악, 클라이언트/서버 필터링 구분
//    - 트레이드오프 설명 명확
//    - 사고 과정 표현 능숙
// 2. 기본 기술력 양호
//    - TypeScript 타입 정의 적절
//    - React hooks 사용 능숙
//    - 비동기 처리 이해
// 3. 자기 인식 능력
//    - 시간 초과 문제 인지
//    - 우선순위 판단 필요성 인식
//
// ⚠️ 개선 필요 사항
// 1. 구현 정확성
//    - Debounce 구현 오류 (setTimeout 사용법, AbortController 부적절 사용)
//    - 필터링 로직 오류 (category 비교, keyword 대소문자 처리)
//    - 카테고리 핸들러 오류 (button의 value 접근 방식)
// 2. 시간 관리
//    - 목표 시간(30-40분) 대비 1시간 30분 소요
//    - 우선순위 판단 필요 (MVP → 스타일링 → 최적화)
// 3. 완성도
//    - CSS 미구현 (반응형 레이아웃, 카드 스타일)
//
// 💡 실무 관점 평가
// - 합격 가능성: 조건부 합격 (중급 레벨)
// - 의사소통과 문제 이해 능력이 우수하나, 구현 정확성 보완 필요
// - 시간 관리와 우선순위 판단 능력 개선 필요
//
// 📝 개선 제안
// 1. Debounce 구현 연습 (setTimeout, clearTimeout 활용)
// 2. MVP 접근법 훈련 (기본 기능 완성 우선)
// 3. 시간 제한 연습 (우선순위 판단 능력 향상)
