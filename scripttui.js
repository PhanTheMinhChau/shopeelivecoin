// URL của API
const apiUrl = "https://script.google.com/macros/s/AKfycbzIGcy0riFrWZtUmV7COFqY7b0fj2b3UQRHn6dEO6zd0s0A1ffsHAnYW_B3KOATrGaE6Q/exec";
const dataList = document.getElementById("data-list");

// Hàm định dạng thời gian đếm ngược, chỉ hiển thị phần nào có giá trị lớn hơn 0
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
  if (seconds > 0) parts.push(`${seconds} giây`);

  return parts.join(" ");
}

// Lưu danh sách items với các phần tử countdown
let items = [];

// Hàm fetch dữ liệu từ API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Sắp xếp dữ liệu theo startTime từ thấp đến cao (thời gian đếm ngược ít hơn sẽ ở trên)
    data.sort((a, b) => a.startTime - b.startTime);

    // Xóa nội dung cũ
    dataList.innerHTML = "";
    items = data.map(item => {
      const row = document.createElement("tr");
      if (item.maxcoin==0) {
        maxcoin = "vc";
      } else {
        maxcoin = item.maxcoin;
      }
      row.innerHTML = `
        <td>${item.userName}</td>
        <td>${maxcoin}</td>
        <td class="countdown" data-start-time="${item.startTime}"></td>
        <td>
          <button onclick="window.location.href='https://shopee.vn/universal-link/shop/${item.shopId}?utm_source=an_17333510032&utm_medium=affiliates&utm_campaign=-&utm_content=acc48----&utm_term=c1id8gpxye2t'">
            vào
          </button>
        </td>
      `;
      dataList.appendChild(row);
      return { element: row.querySelector(".countdown"), startTime: item.startTime*1000, row: row };
    });

    // Bắt đầu cập nhật đếm ngược ngay khi dữ liệu được fetch
    updateCountdowns();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  } finally {
    document.getElementById("loading").style.display = "none"; // Ẩn loading
  }
}

// Hàm cập nhật thời gian đếm ngược mỗi giây
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
