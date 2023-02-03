# lotto

## 조건
1. “로또 번호 받기” 버튼을 클릭하면 6개의 중복되지 않는 번호를 생성하여 보여 줘야 한다.
2. 최대 5쌍의 번호 나열을 할 수 있도록 버튼 왼쪽에 숫자 입력 창을 배치 한다.
3. 번호는 왼쪽에서 부터 오른쪽으로 오름 차순으로 정렬한다.
4. 번호는 한꺼번에 보여주지 않고 1부터 45까지 빠른 속도로 변경되다가 한개의 숫자씩 보여 줘야 한다.
5. 번호를 생성하는 방식은 본인 만의 알고리즘을 작성하되 최소 3개 이상의 로직이 있어야 한다.

# 빙고
## 조건
1. 1 부터 25 까지 번호로 구성
2. 양쪽으로 나누어 왼쪽에는 빙고 번호, 왼쪽에는 빙고 판으로 구성
3. 왼쪽 빙고 번호 표시 및 번호 뽑기 버튼으로 구분하여 구성
    - 초기에는 빙고 번호를 섞어 주세요 문자만 표시
    - 빙고판 번호 섞이를 완료 하면 기본 숫자 0 표시와 번호 뽑기 버튼 을 보여준다.
    - 번호 뽑기 버튼을 클릭 하면 1~25 숫자가 순차적으로 변하다가 뽑히지 않은 번호 랜덤 표시
4. 오른쪽은 빙고 판과 '빙고 번호 섞이' 버튼, '빙고' 버튼 으로 구성
    - 초기 상태에서 1~25의 번호가 순차로 나열(5 * 5) 및 빙고 버튼 비활성화
    - 번호 섞이 클릭시 번호 판이 5회 랜덤으로 섞이도록 처리 (애니메이션 처리)
    - 번호 섞이가 완료되면 '빙고 번호 섞이' 버튼 비활성화
    - 뽑힌 번호는 빙고판에서 뽑힌 번호 표시하여 구분
    - 총 3줄이 완성 되면 빙고 버튼 활성화
    - 버튼을 누르면 '빙고!' 라는 메시지 표시 후
5. 빙고가 완료 되면 모든 기능을 비활성화 하고 빙고 번호와 빙고판 밖의 하단 부분에 '다시 빙고하기' 버튼 표시 버튼 클릭시 게임 초기화
    - 빙고 번호를 섞을 때 본인만의 알고리즘을 적용할 것(요건 제한 없음)