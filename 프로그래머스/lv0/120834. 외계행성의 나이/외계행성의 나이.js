// function solution(age) {
//     var answer = getAlpha(age);
//     function getAlpha(age){
//         if(age < 10) return String.fromCharCode(97 + age)
//         return getAlpha(Math.floor(age/10)) + String.fromCharCode(97 + age % 10)
//     }
//     return answer;
// }

function solution(age) {
    var answer = '';
    for (char of String(age)) answer += String.fromCharCode(97 + Number(char))
    return answer;
}

