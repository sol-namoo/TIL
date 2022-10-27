function solution(s) {
    let numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    let answer = s
    
    numbers.forEach((num, i) => {
       answer= answer.replaceAll(num, i)
        // console.log(answer)
    })
    
    return Number(answer);
}


// 특정 문자열을 찾아내서 바꾸는 방법?
//      1. replaceAll  
//      2. indexOf + replace or splice

// 각 문자열에 대응되는 숫자 정보가 필요 => 배열의 값과 idx를 일치하도록 넣기

// 이걸 for문을 돌려야 되나? => 배열 기준으로 9번 돌면서 replace
// 영단어가 포함되어 있는지 검사를 해야 할까? x

// 출력값 answer = 문자열에서 숫자로 변환된 값
