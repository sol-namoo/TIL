function solution(n) {
    let answer = [];
    
    for(let i = 0 ; i < n/2 ; i++){
        answer.push(i*2 + 1)
    }
    
    return answer;
}

// 방법 1 : 1부터 n까지 돌기
// 방법 2 : 0부터 n/2까지 돌고 *2 +1
//  10 => 0 1 2 3 4 => 0 2 4 6 8
//  15 => 0 1 2 3 4 5 6 7 => 0 2 4 6 8 10 12 14