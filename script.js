const apiUrl = "https://script.google.com/macros/s/AKfycbyobr7LWkEQjy0Kvu-_eRoTgTG-aWEPC8Lk81l6pIYar85KIz1BoZfYijcp3zjghvYhPA/exec";
const dataList = document.getElementById("data-list");

function formatCountdown(timeDifference) {
  if (timeDifference <= 0) return "Đã bắt đầu";

  const seconds = Math.floor((timeDifference / 1000) % 60);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds >= 0) parts.push(`${seconds} giây`);

  return parts.join(" ");
}

let items = [];

// Replace this part of JavaScript for rendering cards
// Replace this part of JavaScript for rendering cards
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    data.sort((a, b) => a.startTime - b.startTime);

    dataList.innerHTML = "";
    items = data.map((item, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="top-row">
          <div class="shop-name"> ${item.userName}</div>
          <div class="coin-section">${item.maxcoin} xu</div>
          <div class="button-section">
            <button onclick="window.location.href='${item.shopId}'">Vào ngay</button>
          </div>
        </div>
        <div style=" display: flex; justify-content: space-between; width: 61%; ">
          <div style=" font-size: 0.9em; color: #777; margin-top: 8px; font-weight: normal; text-align: center; ">${item.viewer_count}</div>
          <div class="countdown" data-start-time="${item.startTime}"></div>
        </div>
      `;
      dataList.appendChild(card);
      return { element: card.querySelector(".countdown"), startTime: item.startTime, row: card };
    });

    updateCountdowns();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}



function updateCountdowns() {
  const currentTime = Date.now();
  items = items.filter(item => {
    const timeDifference = item.startTime - currentTime;
    if (timeDifference > 0) {
      item.element.textContent = formatCountdown(timeDifference);
      return true;
    } else {
      item.row.remove();
      return false;
    }
  });
}

fetchData().then(() => {
  setInterval(updateCountdowns, 1000);
});
setInterval(fetchData, 10000);
