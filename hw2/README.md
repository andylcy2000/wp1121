# 112-1-hw1

本作業有實作pass與perfect部份，網頁排版可能與示意圖小有差異

## Run the project

If you want to run the project, you can follow the steps below.
原則上與unit1-trello clone差不多，我是在Ubuntu上操作的

### 1. 取得本資料夾

### 2. Install dependencies

在Terminal中進到本作業資料夾，在112-1-unit1-trello-clone資料夾中進行：
cd backend
yarn

cd ..

cd frontend
yarn

### 3. Environment variables setting 

- In `/backend` directory, create a file named `.env`
- Add some lines in `.env`
 
 PORT=8000
 MONGO_URI=<your connection string> ＃＃＃在index.js裡我是設定MONGO_URI

 Remember to add `.env` to `.gitignore` file. This is to prevent sensitive information from being exposed.

### 4. Run the server

在terminal中進入backend
yarn dev
If successful, you should see the following message in the terminal:


Server is running on port http://localhost:8000


### 5. Open the frontend

在terminal中進入frontend
yarn dev


Pass功能皆有製作完成

有一點可能要注意的是，有時候開啟網頁會跳出listMap/[card.id/] is undefined，這部份我有做判斷式防範了，但不確定是不是電腦效能問題，有時候load太慢還是會噴error，如果噴error刷新幾次網頁就可以了。

在進入到可以看到歌曲的那頁時，Return按鈕是可以回到首頁的。

編輯按鈕按下會跳出dialog進行編輯。

點到一個歌曲的row時會造成前面勾選，這部份是MUI DataGrid的原始設定。

在歌曲列右下角有每頁顯示歌曲數，如果新增完歌曲沒在第一頁看到可能是超過單頁上限跑到第二頁。

編輯歌曲內容時，如果勾選Add a copy並改變list選項，會新增一份歌曲到另一個list，並保留一份在原本的list。

其他功能與題目敘述相同



Perfect部份則做了輸入提示跟list及歌曲名稱重複判定

以下對perfect部份稍作說明

如果在欄位中沒輸入就按下儲存，會跳出alert。

如果在名稱部份發生重複，也會alert。


lint部份有warning，這部份是我故意設定成那樣的。
error的話我這邊是沒有。

以上，感謝你閱讀到這邊！
