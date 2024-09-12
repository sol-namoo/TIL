# 브라우저에 로컬 이미지 렌더하기 (url화 방식)


## 설명 / 정의

로컬 이미지 파일을 <input> 태그 또는 <div> 태그를 통해 브라우저에서 받았을 때, url을 활용해 동적으로 이미지를 로드하는 2가지 방법을 비교했다.

(다른 방법으로는 canvas에 띄우기, webGL 이용하기, svg 파일을 삽입하기 등이 있다고 한다)

둘 다 파일을 url로 변환하기 때문에 비슷해 보이지만 실제 작동하는 방식은 달랐다.

기존에는 FileReader를 사용해서 로드하고 있었는데, createObjectURL 메소드를 사용하는 방법을 찾으면서 코드를 변경했다.

내가 다루는 파일들이 고화질 파일이고, 또 실제로 화면에 로드할 필요 없이 metadata만 뽑으면 되기 때문에 blob 방식이 더 유리했다.

### FileReader를 사용하는 방법

```jsx
const file = event.target.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);
document.getElementById('image').src = imageUrl;
```

- filereader는 파일을 읽어 브라우저의 메모리에 로드한다.
- **`readAsDataURL`** 메서드는 파일의 실제 내용을 읽어 Base64로 인코딩된 문자열 형태의 데이터 URL을 생성한다. 이를 메모리에 저장한다.
- 메모리에 읽어오기 때문에, 파일 크기가 크다면 성능에 영향을 줄 수 있다.
- Data URL은 **`data:`**로 시작하며, **`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`**와 같은 형태이다.

### **URL.createObjectURL**을 사용하는 방법

```jsx
const file = event.target.files[0]; 
const imageUrl = URL.createObjectURL(file); 
document.getElementById('image').src = imageUrl;
```

- **`URL.createObjectURL`** 메서드는 브라우저에서 특정 Blob에 대한 임시 URL을 생성한다.
    - Blob 객체는 파일 및 데이터 조각을 나타내는 불변 객체로, 파일 시스템에서의 구체적인 파일 정보를 포함하지 않는다. file 객체는 blob 객체의 하위 클래스이므로 blob 처럼 사용할 수 있다.
- 이 URL은 브라우저 세션 동안 유효하며, 파일을 메모리에 직접 읽지 않고 파일에 대한 참조만 메모리에 유지하므로 큰 파일을 다룰 때 유리하다.
- 사용이 끝난 URL을 **`URL.revokeObjectURL`**을 통해 해제하여 메모리 누수를 방지할 수 있다.
- Blob 방식에서 생성된 URL은 일반적으로 **`blob:`**로 시작하며**`blob:http://example.com/12345678-1234-1234-1234-123456789abc`**와 같은 형태이다.

## 추가 정보

내 경우는 실제로 브라우저에 렌더할 필요도 없고, 단지 이미지를 로드해서 이미지의 가로 세로 사이즈 정도만 확인하면 된다.
<img> 태그를 생성해서 dom에 추가하는 작업 없이  **`new Image()`** 만 생성한다.

createObjectURL 방식으로 바꾸면서 비동기 처리를 한 단계 줄였지만 로드는 여전히 비동기이다 ㅎ

```jsx
const img = new Image();
img.onload = function() {
     //  img.width, img.height 확인하고 resolve 또는 URL revoke
};
img.src = imageUrl;
```