# 112-1-hw1

本作業有實作pass與perfect部份，網頁排版可能不太好看

## Run the project

If you want to run the project, you can follow the steps below.
原則上與unit1差不多，我是在Ubuntu上操作的

### 1. 取得本資料夾

### 2. Install dependencies

在Terminal中進到本作業資料夾
cd backend
yarn

### 3. Environment variables setting 

- In `/backend` directory, create a file named `.env`
- Add some lines in `.env`
 
 PORT=8000
 MONGO_URI=<your connection string> ＃＃＃在index.js裡我是設定MONGO_URI

 Remember to add `.env` to `.gitignore` file. This is to prevent sensitive information from being exposed.

### 4. Run the server


yarn start
If successful, you should see the following message in the terminal:


Server is running on port http://localhost:8000


### 5. Open the frontend

Open `frontend/index.html` by clicking it in your file explorer.

Or if you're on ubuntu, you can run the following command to open it in your browser.


cd frontend
xdg-open index.html


If you're on macOS, you can run the following command to open it in your browser.


cd frontend
open index.html


Pass功能皆有製作完成
Perfect部份則做了filter及新增日記時日期判定
以下對perfect部份稍作說明

filter:
首次進入首頁時會顯示全部的日記
filter按鍵做在首頁，放在新增日記按鍵的旁邊
點選filter按鍵後，可複選要看的標籤，之後按下確認即會在首頁顯示符合條件的日記
若全都沒勾選又按確認的話首頁會沒有符合條件的日記
按下取消可退回首頁

日期判定：
預設自動帶入本日日期
在新增日記的頁面可以在右上角輸入欄位更改年月日及星期
年有判定閏年的功能
月及日則判定是否大於該月日數，若輸入小數或含虛數會在儲存時轉回整數，輸入為負數會被判定為錯誤
星期幾要輸入國字，並只能輸入一個國字，多空格或字皆會被判定為錯誤

以上，感謝你閱讀到這邊！
