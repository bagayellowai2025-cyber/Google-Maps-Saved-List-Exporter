(async function() {
    console.log("🚀 開始執行：啟動『深度捲動與動態擷取』模式...");

    // 1. 找尋第一個地點元素，作為定位點
    let firstItem = document.querySelector('.ZSOIif');
    if (!firstItem) {
        alert("找不到任何地點，請確認左側是否有展開『已儲存的地點清單』！");
        return;
    }

    // 2. 自動往上尋找「真正擁有捲動軸」的框架 (破解 Google 隱藏架構)
    let scrollContainer = null;
    let currentElement = firstItem;
    while (currentElement) {
        let style = window.getComputedStyle(currentElement);
        // 條件：必須有捲動屬性，且內容高度大於可視高度
        if ((style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') && currentElement.scrollHeight > currentElement.clientHeight) {
            scrollContainer = currentElement;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    // 備用方案
    if (!scrollContainer) scrollContainer = document.querySelector('div[role="main"]');

    if (!scrollContainer) {
        alert("找不到可捲動的清單框架，請試著手動用滑鼠滾動一點點清單後，再執行一次程式碼。");
        return;
    }

    // 使用 Map 儲存資料，以「店名」為 Key 避免重複
    let resultsMap = new Map();

    // 擷取畫面上資料的函數
    const extractCurrentVisibleItems = () => {
        let items = document.querySelectorAll('.ZSOIif');
        items.forEach(item => {
            let name = item.querySelector('.fontHeadlineSmall')?.innerText.trim() || '';
            if (!name) return; // 跳過空殼

            let rating = item.querySelector('.MW4etd')?.innerText.trim() || '';
            let reviews = item.querySelector('.UY7F9')?.innerText.replace(/[()]/g, '').trim() || '';
            let imgUrl = item.querySelector('img.WkIe8')?.src || '';

            let price = '';
            let category = '';
            let details = item.querySelectorAll('.IIrLbb');

            if (details.length > 1) {
                let detailText = details[1].innerText.replace(/\n/g, ' ').trim();
                let parts = detailText.split('·');
                if (parts.length === 2) {
                    price = parts[0].trim();
                    category = parts[1].trim();
                } else if (parts.length === 1) {
                    category = parts[0].replace('·', '').trim();
                }
            }

            // 更新最完整的資料
            if (!resultsMap.has(name) || (rating !== "" && resultsMap.get(name).rating === "")) {
                resultsMap.set(name, { name, category, rating, reviews, imgUrl, price });
            }
        });
    };

    // 3. 智慧捲動機制
    let lastHeight = 0;
    let noChangeCount = 0;
    const maxRetries = 4; // 如果高度沒變，最多再等 4 次 (對付網路延遲)

    console.log("開始自動捲動，請放開滑鼠與鍵盤，讓程式自己跑...");

    while (noChangeCount < maxRetries) {
        // 先抓取目前範圍內的資料
        extractCurrentVisibleItems();

        lastHeight = scrollContainer.scrollHeight;

        // 模擬人類：直接將捲動條拉到目前的最底部，觸發 Google 載入新資料
        scrollContainer.scrollTo(0, scrollContainer.scrollHeight);

        // 暫停 1.5 秒，等 Google 轉圈圈載入資料
        await new Promise(r => setTimeout(r, 1500));

        // 再次抓取剛載入的資料
        extractCurrentVisibleItems();

        let newHeight = scrollContainer.scrollHeight;

        if (newHeight === lastHeight) {
            // 高度沒增加，可能到底了，也可能是網路還在轉圈圈
            noChangeCount++;
            console.log(`清單似乎到底了，進行第 ${noChangeCount} 次確認等待...`);
        } else {
            // 高度有增加，代表成功載入新區塊，計數器歸零
            noChangeCount = 0;
            console.log(`成功載入新範圍，目前已蒐集 ${resultsMap.size} 筆地點...`);
        }
    }

    // 4. 準備輸出 CSV
    let results = Array.from(resultsMap.values());

    if (results.length === 0) {
        alert("找不到任何地點資料！");
        return;
    }

    const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;
    const BOM = '\uFEFF'; 
    const header = "店名,種類,評價,評價數,圖片網址,價格帶\n";
    const rows = results.map(r => 
        `${escapeCSV(r.name)},${escapeCSV(r.category)},${escapeCSV(r.rating)},${escapeCSV(r.reviews)},${escapeCSV(r.imgUrl)},${escapeCSV(r.price)}`
    ).join("\n");
    const csvContent = BOM + header + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `GoogleMaps清單_${results.length}筆.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ 捲動結束！成功匯出 ${results.length} 筆不重複的資料！檔案已下載。`);
})();
