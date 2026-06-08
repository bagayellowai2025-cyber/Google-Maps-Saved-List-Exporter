# Google Maps 儲存清單自動匯出工具 (Google Maps Saved List Exporter)

這是一個透過 Chrome 主控台執行的輕量級 JavaScript 爬蟲工具。
它可以自動幫你展開 Google Maps 上的「已儲存」清單，擷取所有地點的詳細資訊，並一鍵下載成乾淨的 CSV 表格。

這個專案是透過 **Vibecoding**（與 AI 助手對話協作）逐步除錯與優化而誕生的成果。從一開始只能抓取畫面上的少數資料，進化到能自動破解 Google Maps 的延遲載入 (Lazy Loading) 限制，順利匯出破百筆的大型清單！

[![Video Demo](https://img.youtube.com/vi/x9XPcMEtpps/maxresdefault.jpg)](https://youtu.be/x9XPcMEtpps)

## 💡 解決了什麼痛點？

當我們在 Google Maps 儲存了幾十個甚至上百個地點（例如：旅遊行程、美食清單）時，清單的資訊往往很雜亂。如果想要有系統地分類整理，手動一個一個點開查看地點資訊、複製貼上，不僅眼睛痠，還超級耗時。

透過這支程式，你可以省下數小時的苦工，幾秒鐘內就能獲得一份包含店名、評價、種類的結構化資料表。

## ✨ 核心功能 (Features)

* **自動偵測框架：** 自動尋找隱藏的清單捲動軸，突破 Google 預設只顯示 20 筆資料的限制。
* **智慧等待機制 (Smart Wait)：** 模擬人類瀏覽行為，自動將清單往下滾動並等待伺服器載入，網速慢也不怕漏抓。
* **資料去重複與最佳化：** 邊滾邊抓取，並自動保留資訊最完整的那一筆資料。
* **Excel 友善匯出：** 輸出帶有 BOM 碼的 `.csv` 檔案，用 Excel 打開繁體中文保證不亂碼。
* **擷取欄位包含：** 店名、種類、評價、評價數、圖片網址、價格帶。

## 🚀 使用方法 (How to Use)

不需要安裝任何擴充功能或 Python 環境，只要有 Google Chrome 瀏覽器就能運作。

1. **打開 Google Maps 清單：** 用電腦版 Chrome 瀏覽器打開並登入 Google Maps，點擊進入你的「已儲存」清單，確保左側面板有顯示地點列表。
2. **開啟開發人員工具：** * Windows: 按下 `F12` 或 `Ctrl` + `Shift` + `J`
   * Mac: 按下 `Cmd` + `Option` + `J`
3. **切換到 Console (主控台)：** 在彈出的面板中，點選 `Console` 分頁。
4. **貼上程式碼並執行：** 複製下方的完整程式碼，貼在游標處並按下 `Enter`。
5. **放開雙手：** 你會看到左側清單開始自動往下滾動。請等待它滾動到底部並完成幾次確認後，就會自動下載名為 `GoogleMaps清單_XX筆.csv` 的檔案！

⚠️ 溫馨小提醒：未來如果失效怎麼辦？(Maintenance)
Google Maps 的前端網頁結構（像那些無意義的英文代碼 ZSOIif, MW4etd 等）有時候會隨著官方更新而改變。

如果未來你執行這段程式碼時，發現抓不到資料、或是下載的 CSV 內容都是空白的，不用慌張，通常是因為 Google 改版了。你只需要：
- 在清單的地點上點擊右鍵，選擇「檢查 (Inspect)」。
- 找出新的 HTML class 代碼。
- 將程式碼中 document.querySelector 括號內對應的舊代碼（例如 .ZSOIif）替換成新的代碼即可。
