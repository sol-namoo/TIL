function solution(id_list, report, k) {
    var answer = Array(id_list.length).fill(0);
    let report_list = [...new Set(report)]
    let reported = {}
    
    report_list.forEach((item)=>{
        const accuser = id_list.indexOf(item.split(" ")[0])
        const id = item.split(" ")[1]
        reported[id] 
            ? reported[id].push(accuser)
            : reported[id] = [accuser]
    })
    
    for(let id in reported){
        if(reported[id].length >= k)
            for(accuser of reported[id]) answer[accuser] += 1
    }

    return answer;
}

// report의 중복값 무시
// 필요 정보 : 신고당한 횟수 k번 이상 -> 신고한 사람이 메일 받을 횟수
// report_list를 순회하면서
//      let reported = {id: [ ]} , ...}
//      배열 안에 신고한 사람의 id_list에서의 idx 저장
// reported를 순회하면서 length >= k 이면 reporter에 있는 idx대로 answer에서 ++