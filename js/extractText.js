var stack;

function tour(complete, target, action, isSeries) {
  var curr, i, start, timeCounter;
  //최초 호출된 경우
  if (!isSeries) {
    //최초 스택을 생성-이전동일
    stack = [target.length ? target : [target]];
  } else {
    // 이어받는 경우는 target이 stack임
    stack = target;
  }
  //시작시간을 확인한다.
  start = Date.now();
  //시간확인용 카운터 초기화
  timeCounter = 0;

  while (curr = stack.pop()) {
    i = curr.length;
    while (i--) {
      action(curr[i]);
      if (curr[i].childNodes && curr[i].childNodes.length) {
        stack.push(curr[i].childNodes);
      }
    }

    //카운터가 100이 될때마다 시간을 측정한다.
    if (timeCounter++ == 100) {
      //3초가 경과되었다면
      if (Date.now() - start > 3000) {
        //다음 프레임으로 넘긴다.
        return setTimeout(function() {
          //현재 스택을 target으로, isSeries를 true로
          tour(complete, stack, action, true);
        }, 1);
      }
      //카운터를 초기화
      timeCounter = 0;
    }
  }
  complete();
}
