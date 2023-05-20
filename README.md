네이버 지도 즐겨찾기 리스트 카카오맵 즐겨찾기로 추가하기

---

사용법:
- `git clone https://github.com/kingsubin/map-favorites-auto-add.git`
- `cd map-favorites-auto-add`
- `npm install`
- 네이버 지도 정보 가져오기
  - https://map.naver.com/v5/favorite/myPlace 이동
  - 가져 올 리스트 선택
  - `F12`를 눌러 개발자 도구를 열고 `Network` 탭으로 이동
  - `xhr` 타입의 이름이 `32글자ID?mcid=ALL` 인 `Response` 탭을 선택
  - 복사하여 `data.json` 파일에 붙여넣기
- 현재 실행중인 크롬을 전부 종료
- 크롬 디버깅 모드로 실행
  - macOS: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9223`
  - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe --remote-debugging-port=9223`
- `DevTools listening on ws://127.0.0.1:9223/devtools/browser/a177f827-32aa-44a7-8fa8-092d050c4891` 와 같은 메시지가 뜨는데 browser/ 이후의 id 복사
- 디버깅 모드로 실행된 크롬에서 [카카오맵](https://map.kakao.com/)에 로그인한다.
- 실행
  - `node inex.js [복사한 id] [카카오맵 즐겨찾기 리스트 번호]` 
  - ex: `node index.js a177f827-32aa-44a7-8fa8-092d050c4891 2`
