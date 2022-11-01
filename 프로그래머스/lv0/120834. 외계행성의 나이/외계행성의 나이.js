function solution(age) {
    var answer = getAlpha(age);
    function getAlpha(age){
        if(age < 10) return String.fromCharCode(97 + age)
        return getAlpha(Math.floor(age/10)) + String.fromCharCode(97 + age % 10)
    }
    return answer;
}

// a의 유니코드는 97 => 문자.charCodeAt(0) - 97 하면 10진수 숫자
// 23살 => '2'+'3' => 'c'+'d'
// console.log(String.fromCharCode(97 + 2))