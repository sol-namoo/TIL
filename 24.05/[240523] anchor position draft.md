# 새로 제안된 CSS anchor position 초안

## 설명 / 정의

기존 absolute position과 비슷하지만 dom 요소에 구애받지 않고 화면에 표시 가능한 [anchor position](https://drafts.csswg.org/css-anchor-position-1/)이 제안되었다. 툴팁 등을 만들 때 유용할 수 있다.

절대 위치에 있는 요소를 여러 다른 요소에 고정하고, 동시에 `@position-try` 규칙을 선언하면 해당 요소가 브라우저 화면을 벗어날 경우에 대한 스타일도 정의할 수 있다.

```jsx
.anchor {
  anchor-name: --tooltip;
}
.tooltip {
  /* Fixpos means we don’t need to worry about
     containing block relationships;
     the tooltip can live anywhere in the DOM. */
  position: fixed;

  /* All the anchoring behavior will default to
     referring to the --tooltip anchor. */
  position-anchor: --tooltip;

  /* Align the tooltip’s bottom to the top of the anchor;
     this also defaults to horizontally center-aligning
     the tooltip and the anchor (in horizontal writing modes). */
  inset-area: block-start;

  /* Automatically swap if this overflows the window
     so the tooltip’s top aligns to the anchor’s bottom
     instead. */
  position-try: flip-block;

  /* Prevent getting too wide */
  max-inline-size: 20em;
}
```

예를 들어 `.tooltip`은 `.anchor` 요소의 오른쪽 위에 나타난다. 만약 `.tooltip`이 브라우저 화면을 벗어난다면 `position-try: flip-block`에 의해 `.anchor` 요소의 아래에 배치된다.

## 추가 정보

세상에 [Chrome Platform Status의 Roadmap](https://chromestatus.com/roadmap),  [blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev) 라는 공간이 있다!

‘ECMAscript의 역사’ 같은 아티클에은 읽었지만, 언어와 브라우저 스펙은 실시간으로 발전해 나가는 것이라는 걸 실감은 못 하고 있었다.

이렇게 바로 지난 달 새로 나온 내용을 확인하고, 웹이 발전해 나가는 동시대를 살아가고 있다는 실감이 드니 지금까지 쌓여 있는 것들을 들여다보고 해치우던 과정에서 잠깐 숨을 돌리는 느낌이 든다.

동시에 이런 새로운 문법과 스펙을 나 역시 생각하고 제안해볼 수 있다는 사실이 상상력을 자극한다.


## 레퍼런스

[월간 크롬 이슈 리포트 2024년 4월호](https://ui.toast.com/posts/ko_chrome_report_202404#-css-anchor-배치)