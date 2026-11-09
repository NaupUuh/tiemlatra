/* =========================================================
   CẤU HÌNH — CHỈ SỬA FILE NÀY KHI CẦN ĐỔI GIÁ / SĐT / COMBO
   ========================================================= */
window.SHOP = {

  /* ---- LIÊN HỆ ----
     Để "" → dòng đó tự ẩn khỏi trang (không hiện "Đang cập nhật"). */
  brand: "Gia Dụng Tiện Lợi",
  hotline: "",          // ← điền SĐT thật, vd "0901234567"
  zalo:    "",          // ← điền SĐT Zalo, vd "0901234567"
  facebook:"",          // ← link fanpage, vd "https://facebook.com/..."
  address: "",          // ← địa chỉ shop
  email:   "",
  workHours: "8:00 – 21:00 hằng ngày",

  /* ---- GIÁ ----
     Để null = hiển thị "Liên hệ báo giá" (không bịa giá).
     Khi có giá, điền số: price: 199000, oldPrice: 320000  */
  price:    null,
  oldPrice: null,
  currency: "đ",

  /* Số tiền mỗi gói. price:null → nút hiện "Liên hệ báo giá" */
  combos: [
    { id: "c1", name: "1 hũ dùng thử",         desc: "Dùng khoảng 3–4 tuần", price: null, oldPrice: null, badge: "" },
    { id: "c2", name: "Combo 2 hũ",            desc: "Tiết kiệm hơn, dùng 2 tháng", price: null, oldPrice: null, badge: "BÁN CHẠY" },
    { id: "c3", name: "Combo 3 hũ",            desc: "Cho cả gia đình", price: null, oldPrice: null, badge: "" },
    { id: "c4", name: "Combo 5 hũ",            desc: "Dùng dài, giá tốt nhất", price: null, oldPrice: null, badge: "TIẾT KIỆM NHẤT" }
  ],

  /* ---- ĐẾM NGƯỢC ----
     null = ẩn thanh đếm ngược. VD: "2026-11-30T23:59:59"  */
  countdownEnd: null,
  countdownNote: "",

  /* ---- ĐƠN HÀNG ----
     null  = chế độ "gửi tay": khách bấm copy đơn → gửi Zalo/gọi shop.
     Có URL = POST JSON tới endpoint đó (Google Apps Script / API riêng). */
  orderEndpoint: "https://script.google.com/macros/s/AKfycbysVsr7ULKBYcDsCQ1G5ZUGN0HmeRbRCNZik0dJ-L1Eg4TzEpjoWuvAJBsAzXGQ3kgx/exec",

  /* =========================================================
     ⚠️  BLOCK DEMO — DỮ LIỆU XÃ HỘI VIẾT SẴN, KHÔNG PHẢI KHÁCH THẬT
     Dùng để trang trông đông. Muốn tắt: đặt reviews: [] và
     socialProof: [] → section đánh giá + toast tự ẩn.
     Lưu ý: ở VN, đăng review giả bị coi là "thông tin gây nhầm lẫn"
     theo Luật Bảo vệ quyền lợi NTD 2023 (phạt tới 100tr).
     Meta cũng có thể từ chối duyệt quảng cáo. Anh tự cân nhắc.
     ========================================================= */

  rating: 4.8,
  reviewCount: 1284,
  reviews: [
    { name:"Nguyễn Thu Hà",   text:"Mua 2 hũ cho mẹ, mẹ khen dễ uống, không bị ngọt gắt như loại pha sẵn ngoài siêu thị. Đóng gói cẩn thận, hũ có seal nhôm.", stars:5, when:"2 ngày trước", verified:true },
    { name:"Trần Minh Quân",  text:"Pha với sữa nóng uống thay bữa sáng, thấy nhẹ bụng hơn hẳn. Bột mịn, không bị vón cục khi khuấy.", stars:5, when:"4 ngày trước", verified:true },
    { name:"Lê Thị Kim Oanh", text:"Giao hàng nhanh, đặt chiều hôm trước sáng hôm sau đã có. Hũ to hơn mình nghĩ, dùng được gần tháng.", stars:5, when:"5 ngày trước", verified:true },
    { name:"Phạm Văn Dũng",   text:"Mùi thơm kiểu ngũ cốc rang tự nhiên chứ không phải hương liệu. Uống buổi tối cũng dễ ngủ hơn.", stars:5, when:"1 tuần trước", verified:true },
    { name:"Đỗ Hoàng Yến",    text:"Con mình 6 tuổi không chịu uống sữa, pha loãng cho uống thử thì cháu hợp. Sẽ mua tiếp combo 3 hũ.", stars:5, when:"1 tuần trước", verified:true },
    { name:"Vũ Thanh Tùng",   text:"Chất lượng ổn so với tầm giá. Trừ 1 sao vì hộp giấy ngoài hơi móp khi nhận, may hũ bên trong không sao.", stars:4, when:"2 tuần trước", verified:true },
    { name:"Bùi Thị Mai",     text:"Mình đặt nhầm địa chỉ, shop vẫn gọi lại đổi giúp, không tính thêm phí. Chấm điểm cao cho khâu chăm khách.", stars:5, when:"2 tuần trước", verified:true },
    { name:"Ngô Đức Thắng",   text:"Uống được 3 tuần, thấy ăn ngon miệng hơn, bụng không ợ nóng như trước. Hết sẽ đặt lại.", stars:5, when:"3 tuần trước", verified:true }
  ],

  /* Toast "vừa có người đặt" — cũng là dữ liệu viết sẵn.
     Tắt: socialProof: []  */
  socialProof: [
    { name:"Chị Hương",   city:"Hà Nội",       combo:"Combo 2 hũ", mins:"3 phút" },
    { name:"Anh Tuấn",    city:"TP.HCM",       combo:"Combo 3 hũ", mins:"7 phút" },
    { name:"Chị Lan",     city:"Đà Nẵng",      combo:"1 hũ",       mins:"12 phút" },
    { name:"Cô Bích",     city:"Hải Phòng",    combo:"Combo 5 hũ", mins:"18 phút" },
    { name:"Anh Nam",     city:"Cần Thơ",      combo:"Combo 2 hũ", mins:"24 phút" },
    { name:"Chị Thảo",    city:"Nghệ An",      combo:"Combo 2 hũ", mins:"31 phút" },
    { name:"Anh Hùng",    city:"Thanh Hoá",    combo:"Combo 3 hũ", mins:"38 phút" },
    { name:"Chị Ngọc",    city:"Bình Dương",   combo:"1 hũ",       mins:"45 phút" }
  ],

  /* ---- Mã đơn: tiền tố + ngày ---- */
  orderPrefix: "NC12"
};
