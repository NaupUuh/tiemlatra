/* =========================================================
   BỘT NGŨ CỐC 12 LOẠI HẠT — main.js
   Đọc cấu hình từ config.js (window.SHOP)
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SHOP || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- format tiền ---------- */
  function fmt(n) {
    if (n === null || n === undefined || n === "" || isNaN(n)) return null;
    return Number(n).toLocaleString("vi-VN") + (CFG.currency || "đ");
  }
  function hasPrice(n) { return n !== null && n !== undefined && n !== "" && !isNaN(n) && Number(n) > 0; }

  /* ---------- 1. GIÁ ---------- */
  function renderPrices() {
    var nowTxt = hasPrice(CFG.price) ? fmt(CFG.price) : "Liên hệ báo giá";
    $$("[data-price-slot]").forEach(function (el) {
      if (hasPrice(CFG.price)) {
        el.innerHTML = fmt(CFG.price);
      } else {
        el.textContent = nowTxt;
        el.style.fontSize = "26px";
      }
    });

    var oldEl = $("[data-price-old]");
    if (oldEl && hasPrice(CFG.oldPrice) && hasPrice(CFG.price)) {
      oldEl.textContent = fmt(CFG.oldPrice);
      oldEl.hidden = false;
    }

    var offEl = $("[data-price-off]");
    if (offEl && hasPrice(CFG.oldPrice) && hasPrice(CFG.price)) {
      var pct = Math.round((1 - CFG.price / CFG.oldPrice) * 100);
      if (pct > 0) { offEl.textContent = "-" + pct + "%"; offEl.hidden = false; }
    }

    var noteEl = $("[data-price-note]");
    if (noteEl && hasPrice(CFG.price)) noteEl.textContent = "Đã bao gồm VAT. Miễn phí giao hàng toàn quốc.";

    /* sticky bar */
    var sp = $("#stickyPrice"), so = $("#stickyOld");
    if (sp) sp.textContent = hasPrice(CFG.price) ? fmt(CFG.price) : "Liên hệ";
    if (so && hasPrice(CFG.oldPrice) && hasPrice(CFG.price)) { so.textContent = fmt(CFG.oldPrice); so.hidden = false; }
  }

  /* ---------- 2. LIÊN HỆ: trống thì ẩn hẳn, không hiện "Đang cập nhật" ---------- */
  function renderContact() {
    var tel = (CFG.hotline || "").trim();
    var zalo = (CFG.zalo || "").trim();
    var fb = (CFG.facebook || "").trim();
    var addr = (CFG.address || "").trim();
    var mail = (CFG.email || "").trim();

    function setText(sel, val) {
      var el = $(sel);
      if (!el) return;
      if (val) { el.textContent = val; el.hidden = false; var li = el.closest("li"); if (li) li.hidden = false; }
      else { el.textContent = ""; el.hidden = true; var li2 = el.closest("li"); if (li2) li2.hidden = true; }
    }
    setText("#ftHotline", tel);
    setText("#ftZalo", zalo);
    setText("#ftAddress", addr);
    setText("#ftFacebook", fb);
    setText("#ftEmail", mail);

    // link fanpage
    var fbLink = $("#ftFacebookLink");
    if (fbLink) { if (fb) { fbLink.href = fb; fbLink.hidden = false; } else fbLink.hidden = true; }
    var mailLink = $("#ftEmailLink");
    if (mailLink) { if (mail) { mailLink.href = "mailto:" + mail; mailLink.hidden = false; } else mailLink.hidden = true; }

    // câu "Cần gấp? Gọi hotline ..." trong popup cảm ơn
    var okLine = $("#okHotlineLine");
    if (okLine) {
      if (tel) { okLine.hidden = false; $("#okHotline").textContent = tel; }
      else okLine.hidden = true;
    }

    $$("a[href^='tel:']").forEach(function (a) { if (tel) { a.href = "tel:" + tel; } else { a.hidden = true; } });

    // giờ làm việc
    var wh = $("#ftHours");
    if (wh) { if (CFG.workHours) wh.textContent = CFG.workHours; else { var l = wh.closest("li"); if (l) l.hidden = true; } }

    // cả khối "Liên hệ" ở footer: nếu không có gì thì ẩn luôn cột
    var col = $("#ftContactCol");
    if (col && !tel && !zalo && !fb && !addr && !mail) {
      col.hidden = true;
      var grid = col.parentNode;
      if (grid) grid.classList.add("no-contact");
    }
  }

  /* ---------- 2b. TOAST "vừa có người đặt" (dữ liệu viết sẵn) ---------- */
  function initSocialProof() {
    var list = (CFG.socialProof || []);
    var box = $("#proofToast");
    if (!box || !list.length) { if (box) box.remove(); return; }

    var i = 0, timer = null, paused = false, baseMins = 0;

    /* Không làm phiền khi khách đang điền form đặt hàng */
    var orderSec = $("#dat-hang");
    if (orderSec && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        paused = es[0].isIntersecting;
        if (paused) box.classList.remove("show");
      }, { threshold: 0.25 }).observe(orderSec);
    }

    function show() {
      if (paused) { timer = setTimeout(show, 8000); return; }
      var d = list[i % list.length]; i++;
      if (i % list.length === 1) baseMins += 2 + Math.floor(Math.random() * 5);  // thời gian trôi theo lượt

      $("#proofName").textContent = d.name || "";
      $("#proofTxt").innerHTML = "vừa đặt <b>" + esc(d.combo || "") + "</b>" +
        (d.city ? " · " + esc(d.city) : "");
      var t = $("#proofTime");
      if (t) {
        var m = parseInt(d.mins, 10);
        if (isNaN(m)) m = baseMins + 3;
        else m = m + baseMins;
        t.textContent = m < 60 ? m + " phút trước" : (m / 60).toFixed(0) + " giờ trước";
      }
      box.classList.add("show");
      timer = setTimeout(function () {
        box.classList.remove("show");
        timer = setTimeout(show, 9000 + Math.random() * 8000);
      }, 6000);
    }
    setTimeout(show, 7000);

    var x = $("#proofClose");
    if (x) x.addEventListener("click", function () { clearTimeout(timer); box.classList.remove("show"); box.remove(); });
  }

  /* ---------- 3. COMBO ---------- */
  var selectedCombo = null;
  function renderCombos() {
    var box = $("#combos");
    if (!box) return;
    var list = CFG.combos || [];
    box.innerHTML = list.map(function (c, i) {
      var priceTxt = hasPrice(c.price) ? fmt(c.price) : "Liên hệ";
      var oldTxt = hasPrice(c.oldPrice) && hasPrice(c.price) ? "<s>" + fmt(c.oldPrice) + "</s>" : "";
      var badge = c.badge ? '<span class="combo__badge">' + c.badge + "</span>" : "";
      return '<label class="combo' + (i === 1 ? " sel" : "") + '" data-combo="' + c.id + '">' +
        badge +
        '<input type="radio" name="combo" value="' + c.id + '"' + (i === 1 ? " checked" : "") + ">" +
        '<span class="combo__radio"></span>' +
        '<span class="combo__body">' +
          '<span class="combo__nm">' + c.name + "</span>" +
          '<span class="combo__ds">' + (c.desc || "") + "</span>" +
        "</span>" +
        '<span class="combo__pr"><b>' + priceTxt + "</b>" + oldTxt + "</span>" +
        "</label>";
    }).join("");

    selectedCombo = list.length ? (list[1] || list[0]) : null;

    $$(".combo", box).forEach(function (el) {
      el.addEventListener("click", function () {
        $$(".combo", box).forEach(function (o) { o.classList.remove("sel"); });
        el.classList.add("sel");
        var id = el.getAttribute("data-combo");
        selectedCombo = (CFG.combos || []).filter(function (c) { return c.id === id; })[0] || null;
        updateTotal();
      });
    });
    updateTotal();
  }

  function updateTotal() {
    var el = $("#totalVal");
    if (!el) return;
    if (selectedCombo && hasPrice(selectedCombo.price)) el.textContent = fmt(selectedCombo.price);
    else el.textContent = "Liên hệ báo giá";
  }

  /* ---------- 4. ĐẾM NGƯỢC ---------- */
  function initCountdown() {
    if (!CFG.countdownEnd) return;
    var end = new Date(CFG.countdownEnd).getTime();
    if (isNaN(end)) return;
    var wrap = $("#countdown");
    if (!wrap) return;
    wrap.hidden = false;
    if (CFG.countdownNote) { var n = $("#cdNote"); if (n) n.textContent = CFG.countdownNote; }
    var d = $("#cdD"), h = $("#cdH"), m = $("#cdM"), s = $("#cdS");
    function pad(v) { return v < 10 ? "0" + v : "" + v; }
    function tick() {
      var left = end - Date.now();
      if (left <= 0) {
        if (d) d.textContent = h.textContent = m.textContent = s.textContent = "00";
        clearInterval(timer);
        return;
      }
      var sec = Math.floor(left / 1000);
      if (d) d.textContent = pad(Math.floor(sec / 86400));
      if (h) h.textContent = pad(Math.floor(sec % 86400 / 3600));
      if (m) m.textContent = pad(Math.floor(sec % 3600 / 60));
      if (s) s.textContent = pad(sec % 60);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- 5. ĐỊA CHỈ 2 CẤP ---------- */
  function initAddress() {
    var prov = $("#fProv"), ward = $("#fWard");
    var data = window.VN_ADDR;
    if (!prov || !data) return;

    Object.keys(data).sort(function (a, b) { return a.localeCompare(b, "vi"); }).forEach(function (name) {
      var o = document.createElement("option");
      o.value = name; o.textContent = name;
      prov.appendChild(o);
    });

    prov.addEventListener("change", function () {
      var wards = data[prov.value] || [];
      ward.innerHTML = '<option value="">Chọn phường/xã</option>';
      if (!prov.value || !wards.length) { ward.disabled = true; return; }
      wards.forEach(function (w) {
        var o = document.createElement("option");
        o.value = w.name; o.textContent = w.name;
        ward.appendChild(o);
      });
      ward.disabled = false;
    });
  }

  /* ---------- 6. VALIDATE + GỬI ĐƠN ---------- */
  function showErr(key, on) {
    var el = $('[data-err="' + key + '"]');
    if (el) el.classList.toggle("show", !!on);
    var inp = ({ name: "#fName", phone: "#fPhone", province: "#fProv", ward: "#fWard", address: "#fAddr" })[key];
    if (inp && $(inp)) $(inp).classList.toggle("err", !!on);
  }

  function valPhone(v) {
    var d = (v || "").replace(/[^\d]/g, "");
    if (d.length === 11 && d.indexOf("84") === 0) d = "0" + d.slice(2);
    return /^0\d{9}$/.test(d) ? d : null;
  }

  function makeCode() {
    var d = new Date();
    var p = function (n) { return n < 10 ? "0" + n : "" + n; };
    return (CFG.orderPrefix || "DH") + p(d.getDate()) + p(d.getMonth() + 1) +
      String(d.getFullYear()).slice(2) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function initForm() {
    var form = $("#orderForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = ($("#fName").value || "").trim();
      var phoneRaw = ($("#fPhone").value || "").trim();
      var phone = valPhone(phoneRaw);
      var province = $("#fProv").value;
      var wardV = $("#fWard").value;
      var addr = ($("#fAddr").value || "").trim();
      var note = ($("#fNote").value || "").trim();

      var ok = true;
      if (!name || name.length < 2) { showErr("name", true); ok = false; } else showErr("name", false);
      if (!phone) { showErr("phone", true); ok = false; } else showErr("phone", false);
      if (!province) { showErr("province", true); ok = false; } else showErr("province", false);
      if (!wardV) { showErr("ward", true); ok = false; } else showErr("ward", false);
      if (!addr || addr.length < 4) { showErr("address", true); ok = false; } else showErr("address", false);

      if (!ok) {
        var first = $(".field input.err, .field select.err");
        if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); try { first.focus({ preventScroll: true }); } catch (x) {} }
        return;
      }

      var code = makeCode();
      var payload = {
        code: code,
        combo: selectedCombo ? selectedCombo.name : "",
        comboPrice: selectedCombo && hasPrice(selectedCombo.price) ? selectedCombo.price : "",
        name: name, phone: phone,
        province: province, ward: wardV, address: addr, note: note,
        product: "Bột Ngũ Cốc 12 Loại Hạt",
        time: new Date().toISOString(),
        page: location.href
      };

      var btn = form.querySelector('button[type="submit"]');
      var old = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "⏳ Đang gửi…"; }

      function done() {
        $("#orderCode").textContent = "Mã đơn: " + code;
        form.style.display = "none";
        $("#orderOk").classList.add("show");
        $("#orderOk").scrollIntoView({ behavior: "smooth", block: "center" });
      }
      function fail() {
        if (btn) { btn.disabled = false; btn.innerHTML = old; }
        // vẫn cho khách gửi tay
        var txt = orderText(payload);
        copyText(txt);
        alert("Chưa gửi được tự động. Đơn của bạn đã được copy — hãy gửi qua Zalo/hotline để shop nhận đơn.\n\n" + txt);
      }

      if (CFG.orderEndpoint) {
        fetch(CFG.orderEndpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        }).then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
          .then(function (j) { if (j && j.ok === false) throw new Error("server"); done(); })
          .catch(fail);
      } else {
        copyText(orderText(payload));
        done();
      }
    });
  }

  function orderText(p) {
    return "ĐƠN HÀNG MỚI\n" +
      "Mã đơn: " + p.code + "\n" +
      "Sản phẩm: " + p.product + "\n" +
      "Gói: " + p.combo + (p.comboPrice ? (" — " + fmt(p.comboPrice)) : "") + "\n" +
      "Họ tên: " + p.name + "\n" +
      "SĐT: " + p.phone + "\n" +
      "Địa chỉ: " + p.address + ", " + p.ward + ", " + p.province + "\n" +
      (p.note ? "Ghi chú: " + p.note + "\n" : "");
  }

  function copyText(t) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(t).catch(function () { fallbackCopy(t); });
        return true;
      }
    } catch (e) {}
    return fallbackCopy(t);
  }

  function fallbackCopy(t) {
    var ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- 7. FAQ ---------- */
  function initFaq() {
    $$(".faq__q").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.parentElement;
        var a = item.querySelector(".faq__a");
        var open = item.classList.contains("open");
        $$(".faq__item").forEach(function (it) {
          it.classList.remove("open");
          var aa = it.querySelector(".faq__a");
          if (aa) aa.style.maxHeight = "0px";
        });
        if (!open) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + 40 + "px";
        }
      });
    });
  }

  /* ---------- 8. REVEAL ---------- */
  function initReveal() {
    var els = $$(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 9. STICKY CTA + TO TOP ---------- */
  function initScrollUI() {
    var sticky = $("#stickyCta"), toTop = $("#toTop"), form = $("#orderCard");
    var shown = false;
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (!shown && y > 620) { shown = true; if (sticky) sticky.classList.add("show"); }
      else if (shown && y < 380) { shown = false; if (sticky) sticky.classList.remove("show"); }

      if (toTop) toTop.classList.toggle("show", y > 900);

      // ẩn sticky khi đã tới form
      if (sticky && form) {
        var r = form.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85 && r.bottom > 0) sticky.classList.remove("show");
        else if (shown) sticky.classList.add("show");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- 10. ĐIỀN SĐT tự động xoá lỗi ---------- */
  function initFieldCleanup() {
    var map = { "fName": "name", "fPhone": "phone", "fAddr": "address" };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () { showErr(map[id], false); });
    });
    ["fProv", "fWard"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("change", function () { showErr(id === "fProv" ? "province" : "ward", false); });
    });
    var ph = document.getElementById("fPhone");
    if (ph) ph.addEventListener("input", function () { this.value = this.value.replace(/[^\d+\s.]/g, ""); });
  }

  /* ---------- ĐÁNH GIÁ: chỉ hiện khi có dữ liệu THẬT ---------- */
  function initReviews() {
    var sec = $("#danh-gia");
    if (!sec) return;
    var list = (CFG.reviews || []);
    if (!list.length) {
      sec.hidden = true;
      // Ẩn luôn link menu trỏ tới section đánh giá (tránh bấm vào khoảng trống)
      document.querySelectorAll('a[href="#danh-gia"]').forEach(function (a) { a.parentNode && (a.parentNode.hidden = true); });
      return;
    }
    sec.hidden = false;
    var navRv = $("#navReview");
    if (navRv) navRv.hidden = false;

    var top = $("#rvTop");
    if (CFG.rating) {
      var avg = $("#rvAvg"), st = $("#rvStars"), cnt = $("#rvCount");
      if (avg) avg.textContent = String(CFG.rating).replace(".", ",");
      if (st) st.innerHTML = starsAvg(Number(CFG.rating));
      if (cnt) cnt.textContent = CFG.reviewCount ? fmtNum(CFG.reviewCount) + " đánh giá" : "Đánh giá khách hàng";
      // Neu so review hien thi it hon tong -> ghi ro "dang hien X/Y"
      var more = $("#rvMore");
      if (more && CFG.reviewCount && list.length < CFG.reviewCount) {
        more.hidden = false;
        more.textContent = list.length + " đánh giá tiêu biểu trong tổng số " + fmtNum(CFG.reviewCount) + " đánh giá";
      }
      if (top) top.hidden = false;
    } else if (top) top.hidden = true;

    var wrap = $("#rvList");
    if (!wrap) return;
    wrap.innerHTML = list.map(function (r) {
      var initials = (r.name || "?").trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
      return '<div class="review rv in">' +
        '<div class="review__hd"><div class="review__av">' + esc(initials) + '</div><div>' +
        '<div class="review__nm">' + esc(r.name || "") + '</div>' +
        '<div class="review__meta">' + (r.verified !== false ? '<span class="vrf">✓ Đã mua</span>' : '') +
        (r.when ? ' · ' + esc(r.when) : '') + '</div></div></div>' +
        '<div class="review__st">' + stars(r.stars || 5) + '</div>' +
        '<p class="review__txt">' + esc(r.text || "") + '</p></div>';
    }).join("");

    // Dien thoai: mac dinh chi hien 3 the, bam "Xem them" moi hien het
    var tog = $("#rvToggle");
    if (tog) {
      var LIMIT = 3;
      var cards = [].slice.call(wrap.children);
      var isMobile = function () { return window.matchMedia("(max-width:760px)").matches; };
      var open = false;
      var apply = function () {
        var lim = isMobile() && !open ? LIMIT : cards.length;
        cards.forEach(function (c, i) { c.style.display = i < lim ? "" : "none"; });
      };
      if (cards.length <= LIMIT) { tog.hidden = true; }
      else {
        tog.hidden = false;
        var sync = function () {
          tog.hidden = !isMobile();
          tog.textContent = open ? "Thu gọn đánh giá" : "Xem thêm " + Math.max(0, cards.length - LIMIT) + " đánh giá";
          apply();
        };
        sync();
        tog.addEventListener("click", function () { open = !open; sync(); });
        window.addEventListener("resize", function () { open = false; sync(); });
      }
    }
  }

  function stars(n) { n = Math.max(1, Math.min(5, n | 0)); return "★★★★★".slice(0, n); }
  /* Sao le cho diem trung binh: 4,8 -> 4 sao day + 1 sao mo */
  function starsAvg(v) {
    var full = Math.floor(v + 1e-9), out = "";
    for (var i = 0; i < 5; i++) {
      if (i < full) out += "\u2605";
      else if (i === full && v - full >= 0.25) out += '<span style="opacity:.38">\u2605</span>';
      else out += '<span style="opacity:.22">\u2605</span>';
    }
    return out;
  }
  function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    renderPrices();
    renderContact();
    renderCombos();
    initCountdown();
    initAddress();
    initForm();
    initFaq();
    initReviews();
    initSocialProof();
    initReveal();
    initScrollUI();
    initFieldCleanup();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
