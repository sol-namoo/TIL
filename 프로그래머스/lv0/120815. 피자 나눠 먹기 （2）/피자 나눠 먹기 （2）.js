function solution(n) {
    const GCD = (a,b) => a % b > 0 ? GCD(b, a % b) : b
    const gcd = 6 >= n ? GCD(6, n) : GCD(n , 6)
    var answer = n / gcd
    return answer;
}

// 총 조각 수 구하기
//      n명과 6의 최소공배수를 구하고
//      n*6/최대공약수
// answer 는 '몇 판'
//      총 조각 수 / 6