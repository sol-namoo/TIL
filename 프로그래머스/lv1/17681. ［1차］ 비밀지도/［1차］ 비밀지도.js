function solution(n, arr1, arr2) {
    let answer = [...new Array(n)].map(v => '#'.repeat(n))
    let first = arr1.map(num => binary(num))
                    .map((convert)=> {while(convert.length < n){convert = '0' + convert} return convert})
    let second = arr2.map(num => binary(num))
                    .map((convert) => {while(convert.length < n){convert = '0' + convert} return convert})
    
    first.forEach((num, i)=>{
        for(idx in num){
            if(first[i][idx] === '0' && second[i][idx] === '0') {
                let fixed = answer[i].split('')
                fixed[idx] = ' '
                fixed = fixed.join('')
                answer.splice(i, 1, fixed)           
            }
        }
    })
    
    
    function binary(origin){
        if(origin === 1 | origin === 0){
            return String(origin)
        }
        return binary(Math.floor(origin / 2)) + String(origin % 2)
        }

    return answer;
}

// 0. 출력값이 될 answer = [...new Array(n)].map(v => '#'.repeat(n))
// 1. arr 안의 n개의 수을 모두 이진화한다.
// 2. arr1 안의 각 자리값을 돌면서 arr2의 값과 비교한다.
// 3. 둘 다 공백인 경우 answer에서 ' '으로 바꾼다.