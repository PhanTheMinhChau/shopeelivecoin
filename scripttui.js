const apiUrl = "https://script.google.com/macros/s/AKfycbxhd52vK5-MQ21Xg92JYKTpx3L_wOi9DNbKXJB_UWOy_DkjUTMGRDY1TQfZiksKzqudNA/exec";
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

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    data.sort((a, b) => a.startTime - b.startTime);
    dataList.innerHTML = "";
    items = data.map(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      
      const maxcoin = item.maxcoin === 0 ? "voucher" : item.maxcoin + "xu";
      card.innerHTML = `
        <div class="top-row">
          <div class="shop-name"> ${item.userName}</div>
          <div class="coin-section">${maxcoin}</div>
          <div class="button-section">
            <button onclick="window.location.href='https://shopee.vn/universal-link/shop/${item.shopId}?utm_source=an_17396220028&utm_medium=affiliates&utm_campaign=-&utm_content=acc48----&utm_term=cd82nkgk8fmq;'">Vào ngay</button>
          </div>
        </div>
        <div class="countdown" data-start-time="${item.startTime}"></div>
      `;
      dataList.appendChild(card);
      return { element: card.querySelector(".countdown"), startTime: item.startTime * 1000, row: card };
    });

    updateCountdowns();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  } finally {
    document.getElementById("koco").style.display = items.length === 0 ? "block" : "none";
    document.getElementById("loading").style.display = "none"; // Ẩn loading
  }
}

function updateCountdowns() {
  const currentTime = Date.now();
  items = items.filter(item => {
    const timeDifference = item.startTime - currentTime;
    if (timeDifference > 0) {
      item.element.textContent = formatCountdown(timeDifference);
      return true; // Giữ lại mục này
    } else {
      item.row.remove(); // Xóa hàng khỏi DOM nếu thời gian đã hết
      return false; // Loại bỏ mục này khỏi danh sách items
    }
  });
}

// Gọi fetch data khi trang load và cập nhật đếm ngược mỗi giây
fetchData().then(() => {
  setInterval(updateCountdowns, 1000);
});
setInterval(fetchData, 8000);
