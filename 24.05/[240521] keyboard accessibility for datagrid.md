# 테이블/그리드의 키보드 접근성 (feat. tabindex)

## 설명 / 정의

### **언제 `tabindex`가 유용한가?**

MUI를 기본 CSS 라이브러리로 쓰고 있는데, datagrid의 셀이 탭으로 인덱스가 불가하다는 이슈가 제기되었다.

(결론부터 얘기하자면 아니었다. 개발 초기 디자이너측 요청으로 셀 포커스 시의 outline을 강제로 지웠는데, 그 때문에 탭과 키보드 탐색이 되고 있는데도 화면에 표시가 안 되는 것이었다.)

그런데 MUI 문서를 살펴보니 일부러 각 셀에 대한 탭인덱스를 지웠다는 것을 알게 되었다. 페이지 내 모든 요소에 탭 인덱스를 넣는 것은 오히려 접근성을 해칠 수도 있다는 것이다.

먼저 **tabindex의 목적과 유용성**에 대해서 찾아봤을 때는 다음과 같이 정리되었다.

1. **키보드 내비게이션 지원**: 데이터 그리드 내의 셀이나 특정 요소에 대해 **`tabindex`**를 설정하면 사용자가 키보드만으로 해당 요소들에 접근할 수 있다.
2. **포커스 순서 제어**: 논리적인 포커스 순서를 설정하여 사용자가 자연스럽게 이동할 수 있도록 도와준다.
3. 

**주의할 점**은 다음과 같다.

1. **과도한 사용**: 모든 요소에 **`tabindex`**를 부여하면 포커스가 지나치게 많아져 사용자가 혼란스러워질 수 있다.
2. **비인터랙티브 요소**: 본래 포커스를 받을 필요가 없는 비인터랙티브 요소에 **`tabindex`**를 설정하는 것은 피해야 한다.

### 과도한 사용의 예시와 문제

해당 요소가 원래부터 인터랙티브 요소인지 아닌지를 기준으로 tabindex의 추가 여부를 잘 생각해야 한다는 글도 있었고([link](https://www.a11yproject.com/posts/how-to-use-the-tabindex-attribute/#making-non-interactive-elements-focusable)), 애초에 html 구조를 논리적으로 잘 작성했다면 tabindex의 크기를 조작해서 순서를 바꿀 필요가 없다는 내용도 있었다.

`**tabindex="0"**`을 비인터랙티브 요소(단락, 제목, 목록 등)에 적용하면 화면 읽기 프로그램을 사용하는 사람이 모든 콘텐츠에 집중할 수 있어 접근성을 향상시킬 것이라는 믿음은 잘못되었다고 한다.

네이티브 인터랙티브 요소에 **`tabindex`** 속성을 선언할 필요가 없고, 비인터랙티브 요소에 **`tabindex`** 속성을 추가할 필요도 없다. 화면 읽기 프로그램과 같은 보조 기술이 이 콘텐츠를 탐색하는 다른 방법이 있기 때문이다.

따라서, 비인터랙티브 요소에 **`tabindex`** 속성을 추가하는 것은 몇 가지 문제를 일으킨다.

1. 화면을 볼 수 없는 경우, 실제로 인터랙티브한 것과 그렇지 않은 것에 대한 혼동을 준다.

2. 키보드를 사용하는 사람들(특히 보조 기술을 사용하지 않는 키보드 사용자)에게 추가적인 작업을 요구하며, 특히 운동 제어 장애가 있는 사람들에게 어려움을 준다.

3. 요소의 이름과 역할을 발표하지 않을 수 있어 해당 요소가 무엇인지, 어떻게 작동해야 하는지, 그리고 제대로 코딩되었는지에 대한 추가적인 혼동을 일으킨다.

### **그리드 패턴**

그렇다면 다시 우리의 케이스로 돌아가서, datagrid에서는 어떻게 쓰는 것이 바람직할까? WAI-ARIA 문서를 읽으며 나는 ‘테이블 패턴과 그리드 패턴’이라는 분류가 있다는 것을 처음 알게 된다 🤯

- **테이블 패턴**은 단순 위젯으로, 주로 읽기 전용 데이터를 표시하며 기본적인 탭 순서를 따른다.
- **그리드 패턴**은 복합 위젯으로, 편집 가능하고 인터랙티브한 정보를 효율적으로 탐색할 수 있게 설계되었다.

### Datagrid 에서의 tabindex 사용

표 형식의 콘텐츠를 표시할 때 그리드 패턴을 사용할지 또는 테이블 패턴을 사용할지 선택할 때는 다음과 같은 요소들을 고려해야 한다.

그리드는 복합 위젯이므로:

- 항상 여러 개의 포커스 가능한 요소를 포함한다.
- 그리드에 포함된 포커스 가능한 요소 중 하나만 페이지 탭 순서에 포함된다.
- 그리드 내부의 포커스 이동을 관리하는 코드를 작성자가 제공해야 한다.
- 테이블에 포함된 모든 포커스 가능한 요소는 페이지 탭 순서에 포함된다.

포커스 가능한 요소가 여러 개 있는 요소라는 것이 이미 전제되어 있으므로, 접근성을 저해하지 않도록 하기 위해서 일종의 타협안이 마련된 것 같다.

1. **모든 셀 포커스 가능**: 그리드 내의 모든 셀은 포커스 가능해야 화면 읽기 프로그램 사용자가 그리드 내의 모든 내용을 탐색하고 상호작용할 수 있게 된다. 이는 셀 자체가 포커스 가능하거나 셀 안에 포커스 가능한 요소를 포함하는 방식으로 구현될 수 있다. 
2. **탭 인덱스는 그리드 전체에 하나만**: 페이지 탭 순서에는 그리드 자체의 포커스만 포함된다. 즉, 그리드 내의 개별 셀이나 요소들은 탭 순서에 포함되지 않지만, 사용자가 그리드에 포커스를 맞춘 후에는 키보드 화살표 키 등을 사용해 그리드 내부를 탐색할 수 있다. 이렇게 하면 페이지의 탭 순서가 간결해지고 효율적인 탐색이 가능하다.

다만 실제로 셀에서 탭 인덱스를 지우면 a 태그가 있는 셀에서 엔터키를 입력해도 링크 클릭 효과가 일어나지 않는다는 단점이 있다.

MUI 예시와 Gmail의 메일 목록을 확인해 보니 기본적으로 tabindex를 -1로 설정해두고 해당 row에 포커스했을 때 동적으로 0으로 바꾸어주고 있는데, Gmail은 그래도 링크 접근은 안 되는 걸 왜 바꾸고 있는지는 아직 모르겠다 🤔

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/5faaf709-5286-406a-bd35-2f81525f2422/ac30b432-672f-4de7-8338-3ffdb25d5a13/Untitled.png)

## 레퍼런스

[HTML의 tabindex 속성과 키보드 포커스](https://www.daleseo.com/html-tabindex/)

[Data Grid - Accessibility - MUI X](https://v5.mui.com/x/react-data-grid/accessibility/)

[Grid (Interactive Tabular Data and Layout Containers) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)