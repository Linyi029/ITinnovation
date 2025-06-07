deploy.js : 部署合約的檔案 (開啟Anvil後用另一個terminal輸入 node src/contract/deploy.js)

routes.jsx : 每個jsx檔的網址

## Web/src/pages
login, register : 我本來是用metamask 但你們說要用anvil 所以我就沒動它了

PuzzleOptions : 登入後的主頁

User : 點username出現的個人資料頁面(getAttemptedPuzzles, getMyPuzzles)

SolvePuzzleMain : 瀏覽所有的題目(含可以解or已被解決/時效已到的)

UnverifiedPuzzle : 還沒被解出的題目(解題跟看提示皆須花錢)

VerifiedPuzzle : 已被解出的題目(可以免費看提示跟解答)

** 有dynamic是邱寫的 比較適合你們串前後端(?)(沒有寫死)

idx-create : 出題目的頁面

createPZ : idx-create的一部份(用form將題目的各種資訊包起來)
