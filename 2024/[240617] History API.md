# History API

## Window.history 객체

window.history 객체는 브라우저의 세션 기록(즉, 탭 단위)을 조작할 수 있는 방법을 제공하는 Web API다.

window.history 객체를 사용하면 브라우저의 세션 기록을 더 세밀하게 제어할 수 있으며, 이를 통해 SPA(Single Page Application)와 같은 현대적인 웹 애플리케이션에서 보다 나은 사용자 경험을 제공할 수 있다.

### 주요 속성

- **length**: 현재 세션 기록 스택의 길이를 나타낸다. 즉, 사용자가 현재 탭에서 방문한 페이지의 수를 의미한다.

### 주요 메서드

- back(), forward(), go(delta) 메서드를 이용해서 브라우저의 앞으로가기 뒤로가기 기능을 구현할 수 있다.
- **pushState(state, title, url)** 또는**replaceState(state, title, url)**를 통해 페이지를 다시 로드하지 않고 URL을 변경할 수 있다.
  : 브라우저 세션 기록 스택에 새로운 상태를 추가합니다. 페이지를 다시 로드하지 않고 URL을 변경할 수 있다.
  - `state`: 새로 추가되는 항목과 관련된 상태 객체.
  - `title`: 대부분의 브라우저에서 무시되지만, 어떤 경우에는 문서 제목을 나타낼 수 있다.
  - `url`: 새로운 기록 항목의 URL입니다. 같은 도메인 내에서만 변경할 수 있다.
- : 현재 세션 기록 항목을 새로운 상태로 대체한다.
  - `state`: 대체되는 항목과 관련된 상태 객체.
  - `title`: 대부분의 브라우저에서 무시되지만, 어떤 경우에는 문서 제목을 나타낼 수 있다.
  - `url`: 대체될 기록 항목의 URL입니다. 같은 도메인 내에서만 변경할 수 있다.

### 이벤트

- **popstate**: 같은 document에서 두 히스토리 엔트리 간의 이동이 있을 때만 발생한다. 사용자가 `back()`, `forward()` 또는 `go()` 메서드를 호출하거나 브라우저의 뒤로 가기 또는 앞으로 가기 버튼을 클릭할 때에 해당한다. history.pushState() 또는 history.replaceState()는 popstate 이벤트를 발생시키지 않는다. `popstate` 이벤트는 변경된 상태 객체를 포함하는 `event.state` 속성을 통해 접근할 수 있다.

## 추가 정보

다음과 같이 popstate 발생 시 다시 앞으로 이동하거나 엔트리를 추가하거나 이동하면, 실질적으로는 뒤로가기를 방지하는 효과를 낼 수 있다.

```jsx
window.onpopstate = () => {
  history.go(1);
};

window.onpopstate = () => {
  history.pushState(null, "", "");
};
```

## 레퍼런스

[History API로 작업하기 - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/History_API/Working_with_the_History_API)

[웹에서 뒤로가기를 막고 모달을 클로즈 처리하기 위한 방법](https://velog.io/@bclef25/웹에서-뒤로가기를-막고-모달을-클로즈-처리하기-위한-방법)
