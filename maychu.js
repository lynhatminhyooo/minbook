const tuyen = require("express");
const dulieu = require("mongoose");
const phanmemtai = require("multer");
const phienchon = require("express-session");
const duongdan = require("path");
const maychu = tuyen();

const luutru = phanmemtai.diskStorage({
  destination: (yc, f, cb) => {
    cb(null, "uploads/");
  },
  filename: (yc, f, cb) => {
    cb(null, Date.now() + duongdan.extname(f.originalname));
  },
});
const tai = phanmemtai({ storage: luutru });

maychu.use(tuyen.urlencoded({ extended: true }));
maychu.use("/uploads", tuyen.static("uploads"));
maychu.use(
  phienchon({
    secret: "min-v33-admin-tich",
    resave: false,
    saveUninitialized: true,
  })
);

dulieu.connect(
  "mongodb+srv://lym280907_db_user:tDuBPHToeUoyjoIB@minh280907.ifox3nz.mongodb.net/?appName=minh280907"
);

const khuonnguoidung = new dulieu.Schema({
  taikhoan: String,
  matkhau: String,
  anhdaidien: String,
  tieusu: { type: String, default: "Chao mung ban!" },
  quantri: { type: Boolean, default: false },
  tichxanh: { type: Boolean, default: false },
  danhsachbanbe: { type: [String], default: [] },
  loimoiketban: { type: [String], default: [] },
  danhsachchan: { type: [String], default: [] },
});
const nguoidung = dulieu.model("User", khuonnguoidung);

const khuonbaiviet = new dulieu.Schema({
  taikhoan: String,
  noidung: String,
  anh: String,
  phim: String,
  camxuc: [{ nguoidung: String, loai: String }],
  binhluan: [{ nguoidung: String, noidung: String }],
  anhdaidien: String,
  tichxanh: { type: Boolean, default: false },
  thoigian: { type: Date, default: Date.now },
  id_nhom: { type: String, default: null },
  tennhom: { type: String, default: null },
});
const baiviet = dulieu.model("Post", khuonbaiviet);

const khuonthongbao = new dulieu.Schema({
  nguoinhan: String,
  nguoigui: String,
  noidung: String,
  daxem: { type: Boolean, default: false },
  thoigian: { type: Date, default: Date.now },
});
const thongbao = dulieu.model("ThongBao", khuonthongbao);

const khuontinnhan = new dulieu.Schema({
  tu: String,
  den: String,
  noidung: String,
  thoigian: { type: Date, default: Date.now },
});
const tinnhan = dulieu.model("TinNhan", khuontinnhan);

const khuonnhom = new dulieu.Schema({
  tennhom: String,
  truongnhom: String,
  anhnhom: String,
  thanhvien: { type: [String], default: [] },
});
const nhom = dulieu.model("Nhom", khuonnhom);

const tichxanhxin = `<svg width="16" height="16" viewBox="0 0 24 24" style="margin-left:3px; vertical-align:text-bottom"><circle cx="12" cy="12" r="12" fill="#5b95f9"/><path d="M10 16.5l-4-4 1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5-8 8z" fill="white"/></svg>`;

const giaodien = `
<style>
 body { background: #f0f2f5; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; margin: 0; padding-bottom: 50px; }
 .thanh_dieu_huong { background: #1877f2; width: 100%; padding: 12px; display: flex; justify-content: center; position: sticky; top: 0; z-index: 100; gap: 15px; }
 .khung_chinh, .the_bai { background: white; width: 550px; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .anh_tron { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px; }
 .nhan_do { background: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 10px; position: absolute; margin-left: 10px; margin-top: -5px; }
   .nut_xanh { background: #1877f2; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }
  .o_ban_be { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; background: #f9f9f9; padding: 10px; border-radius: 8px; }
 .the_ban { text-align: center; width: 65px; font-size: 11px; text-decoration: none; color: black; }
  .the_ban img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; margin-bottom: 5px; }
  .msg { padding: 8px 12px; border-radius: 15px; margin: 5px; max-width: 70%; word-wrap: break-word; }
 .msg-tu { background: #1877f2; color: white; align-self: flex-end; }
  .msg-den { background: #e4e6eb; color: black; align-self: flex-start; }
 a { text-decoration: none; color: inherit; }
  .nut_cx { font-size: 18px; filter: grayscale(100%); transition: 0.1s; text-decoration: none; cursor: pointer; }
 .da_chon { filter: grayscale(0%) !important; transform: scale(1.2); }
  .nut_back { color: #1877f2; font-weight: bold; margin-bottom: 10px; display: inline-block; }
</style>
<script>
function thacamxuc(e, id, loai) {
    e.preventDefault();
    fetch('/camxuc/' + id + '/' + loai)
    .then(r => r.json())
    .then(d => {
        document.getElementById('cx-' + id).innerHTML = d.hien_tk || 'Chưa có cảm xúc';
        document.querySelectorAll('.btn-' + id).forEach(b => b.classList.remove('da_chon'));
        document.getElementById('btn-' + id + '-' + loai).classList.add('da_chon');
    });
}
function guibinhluan(e, id, ten) {
    e.preventDefault();
    let ip = e.target.querySelector('input[name="nd"]');
    let v = ip.value;
    if(!v) return;
    fetch('/binhluan/' + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nd=' + encodeURIComponent(v)
    }).then(() => {
        document.getElementById('list-' + id).innerHTML += '<div style="font-size:12px; margin-bottom:5px"><a href="/nguoidung/' + ten + '"><b>' + ten + ':</b></a> ' + v + '</div>';
        ip.value = '';
    });
}
</script>`;

function vebai(p, user) {
  let tk = { "👍": 0, "❤️": 0, "🥰": 0, "😂": 0, "😢": 0, "😡": 0 };
  p.camxuc.forEach((c) => {
    if (tk[c.loai] !== undefined) tk[c.loai]++;
  });
  let hientk = "";
  for (let k in tk) {
    if (tk[k] > 0) hientk += `<span>${tk[k]}${k}</span>`;
  }
  let chon = p.camxuc.find((c) => c.nguoidung === user)?.loai;

  let tennguoi = `<a href="/nguoidung/${p.taikhoan}"><b>${p.taikhoan}</b></a>`;
  if (p.id_nhom && p.tennhom) {
    tennguoi += ` - <a href="/nhom/${p.id_nhom}"><b>${p.tennhom}</b></a>`;
  }

  return `<div class="the_bai">
        <div style="display:flex; justify-content:space-between">
            <div style="display:flex; align-items:center">
                ${
                  p.anhdaidien
                    ? `<img src="/uploads/${p.anhdaidien}" class="anh_tron">`
                    : "👤"
                } 
                ${tennguoi} ${p.tichxanh ? tichxanhxin : ""}
            </div>
            <span style="font-size:11px; color:#65676b">${new Date(
              p.thoigian
            ).toLocaleString("vi-VN")}</span>
        </div>
        <p>${p.noidung}</p>
        ${
          p.anh
            ? `<img src="/uploads/${p.anh}" style="width:100%; border-radius:8px">`
            : ""
        }
        ${
          p.phim
            ? `<video width="100%" controls style="border-radius:8px"><source src="/uploads/${p.phim}"></video>`
            : ""
        }
        <a href="/danhsachcx/${p._id}" id="cx-${
    p._id
  }" style="font-size:12px; color:#65676b; margin-top:10px; display:block">${
    hientk || "Chưa có cảm xúc"
  }</a>
        <div style="display:flex; gap:12px; margin-top:10px; border-top:1px solid #eee; padding-top:10px">
            ${["👍", "❤️", "🥰", "😂", "😢", "😡"]
              .map(
                (e) =>
                  `<a href="#" id="btn-${p._id}-${e}" class="nut_cx btn-${
                    p._id
                  } ${
                    chon === e ? "da_chon" : ""
                  }" onclick="thacamxuc(event, '${p._id}', '${e}')">${e}</a>`
              )
              .join("")}
        </div>
        <hr style="border:0; border-top:1px solid #eee">
        ${
          user === p.taikhoan
            ? `<a href="/xoa/${p._id}" style="color:red; font-size:12px">Xóa bài</a>`
            : ""
        }
        <div style="margin-top:10px">
            <div id="list-${p._id}">
                ${p.binhluan
                  .map(
                    (c) =>
                      `<div style="font-size:12px; margin-bottom:5px"><a href="/nguoidung/${c.nguoidung}"><b>${c.nguoidung}:</b></a> ${c.noidung}</div>`
                  )
                  .join("")}
            </div>
            <form onsubmit="guibinhluan(event, '${
              p._id
            }', '${user}')" style="margin-top:5px">
                <input name="nd" placeholder="Bình luận..." style="width:75%; border-radius:5px; border:1px solid #ddd; padding:5px"> <button type="submit" style="background:none; border:none; color:#1877f2; font-weight:bold; cursor:pointer">Gửi</button>
            </form>
        </div>
    </div>`;
}

maychu.get("/", async (req, res) => {
  await nguoidung.deleteMany({ taikhoan: { $in: [null, "", "undefined"] } });
  const u = req.session.user;
  const me = u ? await nguoidung.findOne({ taikhoan: u }) : null;
  const tatcabai = await baiviet.find().sort({ _id: -1 });

  if (me) {
    const moisach = me.loimoiketban.filter((t) => t && t.trim() !== "");
    if (moisach.length !== me.loimoiketban.length) {
      await nguoidung.updateOne(
        { taikhoan: u },
        { $set: { loimoiketban: moisach } }
      );
    }
  }

  let sltb = u
    ? await thongbao.countDocuments({ nguoinhan: u, daxem: false })
    : 0;
  let slmoi =
    me && me.loimoiketban
      ? me.loimoiketban.filter((t) => t && t.trim() !== "").length
      : 0;

  let h =
    giaodien +
    `<div class="thanh_dieu_huong">
        <a href="/" style="color:white; font-weight:bold">🏠 Home</a>
       <a href="/ds-nhom" style="color:white; font-weight:bold">👨‍👩‍👧 Nhóm</a>
        <form action="/tim" method="GET"><input name="tukhoa" style="border-radius:20px; border:none; padding:5px 15px; width:200px" placeholder="Tìm người dùng..."></form>
      ${
        u
          ? `<a href="/thongbao" style="color:white; position:relative">🔔 ${
              sltb > 0 ? `<span class="nhan_do">${sltb}</span>` : ""
            }</a> 
           <a href="/loimoi" style="color:white; position:relative">👥 ${
             slmoi > 0
               ? `<span class="nhan_do" style="background:green">${slmoi}</span>`
               : ""
           }</a>
           <a href="/hopthu" style="color:white">📩 Chat</a>`
          : ""
      }
  </div>`;

  if (!me) {
    h += `<div class="khung_chinh"><h2>Min-Book</h2><a href="/dangnhap">Đăng nhập</a> | <a href="/dangky">Đăng ký</a></div>`;
  } else {
    h += `<div class="khung_chinh">Chào <a href="/nguoidung/${u}"><b>${u}</b></a> ${
      me.tichxanh ? tichxanhxin : ""
    } | <a href="/setting">Cài đặt</a> | <a href="/dangxuat" style="color:red">Thoát</a>
           <form action="/dang" method="POST" enctype="multipart/form-data" style="margin-top:15px">
               <textarea name="nd" placeholder="Bạn đang nghĩ gì?" style="width:100%; height:50px" required></textarea>
               <input type="file" name="tep"> <button class="nut_xanh" style="float:right">Đăng</button>
         </form></div>`;
    const locbai = tatcabai.filter(
      (p) =>
        (p.taikhoan === u ||
          me.danhsachbanbe.includes(p.taikhoan) ||
          p.id_nhom !== null) &&
        !me.danhsachchan.includes(p.taikhoan)
    );
    locbai.forEach((p) => {
      h += vebai(p, u);
    });
  }
  res.send(h);
});

maychu.get("/tim", async (req, res) => {
  const tu = req.query.tukhoa || "";
  const me = await nguoidung.findOne({ taikhoan: req.session.user });
  let ds = [];
  if (tu === "") {
    const tatca = await nguoidung.find({ taikhoan: { $ne: req.session.user } });
    ds = tatca.sort((a, b) => (me.danhsachbanbe.includes(b.taikhoan) ? -1 : 1));
  } else {
    const tatca = await nguoidung.find({
      taikhoan: { $regex: tu, $options: "i" },
      taikhoan: { $ne: req.session.user },
    });
    ds = tatca.sort((a, b) => (me.danhsachbanbe.includes(b.taikhoan) ? -1 : 1));
  }
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>${
      tu === "" ? "Gợi ý kết bạn" : "Kết quả cho: " + tu
    }</h3>`;
  ds.forEach(
    (u) =>
      (h += `<p style="padding:10px; border-bottom:1px solid #eee"><a href="/nguoidung/${
        u.taikhoan
      }" style="display:flex; align-items:center">${
        u.anhdaidien
          ? `<img src="/uploads/${u.anhdaidien}" class="anh_tron">`
          : "👤"
      } <b>${u.taikhoan}</b> ${u.tichxanh ? tichxanhxin : ""} ${
        me.danhsachbanbe.includes(u.taikhoan)
          ? '<small style="color:blue;margin-left:5px">BẠN BÈ</small>'
          : ""
      }</a></p>`)
  );
  res.send(h + `</div>`);
});

maychu.get("/danhsachcx/:id", async (req, res) => {
  const b = await baiviet.findById(req.params.id);
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>Người đã thả cảm xúc</h3>`;
  for (let c of b.camxuc) {
    const u = await nguoidung.findOne({ taikhoan: c.nguoidung });
    h += `<p style="display:flex; align-items:center; margin-bottom:10px"><a href="/nguoidung/${
      c.nguoidung
    }" style="display:flex; align-items:center; flex:1">${
      u && u.anhdaidien
        ? `<img src="/uploads/${u.anhdaidien}" class="anh_tron">`
        : "👤"
    } <b>${c.nguoidung}</b></a> <span style="font-size:20px">${
      c.loai
    }</span></p>`;
  }
  res.send(h + `</div>`);
});

maychu.get("/nguoidung/:ten", async (req, res) => {
  const u = req.session.user;
  const dich = await nguoidung.findOne({ taikhoan: req.params.ten });
  const me = u ? await nguoidung.findOne({ taikhoan: u }) : null;
  if (!dich || (me && dich.danhsachchan.includes(u)))
    return res.send("Người dùng không tồn tại hoặc bạn bị chặn!");

  const ps = await baiviet
    .find({ taikhoan: req.params.ten, id_nhom: null })
    .sort({ _id: -1 });
  const infoban = await nguoidung.find({
    taikhoan: { $in: dich.danhsachbanbe },
  });

  let nutkb = "";
  let nutchan = "";
  let nutadmin = "";

  if (me && u !== dich.taikhoan) {
    if (me.danhsachbanbe.includes(dich.taikhoan)) {
      nutkb = "<span>✓ Bạn bè</span>";
    } else if (dich.loimoiketban.includes(u)) {
      nutkb = "<span>⌛ Đang chờ</span>";
    } else {
      nutkb = `<a href="/ketban/${dich.taikhoan}" class="nut_xanh">➕ Kết bạn</a>`;
    }
    nutchan = `<a href="/chan/${dich.taikhoan}" style="color:red; font-size:12px; margin-left:10px">Chặn</a>`;
    if (me.quantri) {
      if (dich.tichxanh)
        nutadmin = `<a href="/go-tich/${dich.taikhoan}" style="color:orange; font-size:12px; margin-left:10px">[Gỡ tích]</a>`;
      else
        nutadmin = `<a href="/trao-tich/${dich.taikhoan}" style="color:blue; font-size:12px; margin-left:10px">[Trao tích]</a>`;
    }
  }

  let h =
    giaodien +
    `<div class="khung_chinh" style="text-align:center"><a href="/" class="nut_back">← Về Home</a><br>
     ${
       dich.anhdaidien
         ? `<img src="/uploads/${dich.anhdaidien}" style="width:100px; height:100px; border-radius:50%">`
         : "👤"
     }
      <h2>${dich.taikhoan} ${dich.tichxanh ? tichxanhxin : ""}</h2><p>${
      dich.tieusu
    }</p><div style="margin-bottom:15px">${nutkb} ${nutchan} ${nutadmin}</div>
     <a href="/chat/${dich.taikhoan}" style="color:#1877f2">📩 Nhắn tin</a>
     <div style="text-align:left; border-top:1px solid #eee; margin-top:20px; padding-top:10px">
          <b>Bạn bè (${dich.danhsachbanbe.length})</b>
         <div class="o_ban_be">${infoban
           .map(
             (b) =>
               `<a href="/nguoidung/${b.taikhoan}" class="the_ban"><img src="${
                 b.anhdaidien
                   ? "/uploads/" + b.anhdaidien
                   : "/uploads/default.png"
               }"><br><b>${b.taikhoan}</b></a>`
           )
           .join("")}</div>
      </div></div>`;
  ps.forEach((p) => {
    h += vebai(p, u);
  });
  res.send(h);
});

maychu.get("/lam-admin/:ten", async (req, res) => {
  await nguoidung.updateOne(
    { taikhoan: req.params.ten },
    { quantri: true, tichxanh: true }
  );
  res.send(
    "Tài khoản " +
      req.params.ten +
      " đã trở thành Admin. Hãy về trang chủ để dùng quyền."
  );
});

maychu.get("/trao-tich/:ten", async (req, res) => {
  const m = await nguoidung.findOne({ taikhoan: req.session.user });
  if (m && m.quantri) {
    await nguoidung.updateOne({ taikhoan: req.params.ten }, { tichxanh: true });
    await baiviet.updateMany({ taikhoan: req.params.ten }, { tichxanh: true });
  }
  res.redirect("/nguoidung/" + req.params.ten);
});

maychu.get("/go-tich/:ten", async (req, res) => {
  const m = await nguoidung.findOne({ taikhoan: req.session.user });
  if (m && m.quantri) {
    await nguoidung.updateOne(
      { taikhoan: req.params.ten },
      { tichxanh: false }
    );
    await baiviet.updateMany({ taikhoan: req.params.ten }, { tichxanh: false });
  }
  res.redirect("/nguoidung/" + req.params.ten);
});

maychu.get("/ds-nhom", async (req, res) => {
  const tu = req.query.timnhom || "";
  const l = await nhom.find({ tennhom: { $regex: tu, $options: "i" } });
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>Tìm kiếm Nhóm</h3>
  <form action="/ds-nhom" method="GET"><input name="timnhom" placeholder="Nhập tên nhóm..." value="${tu}"> <button class="nut_xanh">Tìm</button></form><hr>`;
  l.forEach(
    (n) =>
      (h += `<p style="display:flex; align-items:center">${
        n.anhnhom
          ? `<img src="/uploads/${n.anhnhom}" style="width:30px;height:30px;margin-right:10px;border-radius:5px">`
          : "📁"
      } <b>${n.tennhom}</b> (${
        n.thanhvien.length
      } thành viên) - <a href="/nhom/${
        n._id
      }" style="color:blue; margin-left:5px">Vào</a></p>`)
  );
  res.send(
    h +
      `<hr><form action="/tao-nhom" method="POST"><input name="ten" placeholder="Tên nhóm mới..."><button class="nut_xanh">Tạo</button></form></div>`
  );
});

maychu.get("/nhom/:id", async (req, res) => {
  const n = await nhom.findById(req.params.id);
  const u = req.session.user;
  const ps = await baiviet.find({ id_nhom: req.params.id }).sort({ _id: -1 });
  let h =
    giaodien +
    `<div class="khung_chinh" style="text-align:center"><a href="/ds-nhom" class="nut_back" style="float:left">← Quay lại</a><br>
     ${
       n.anhnhom
         ? `<img src="/uploads/${n.anhnhom}" style="width:100px; height:100px; border-radius:10px">`
         : "📁"
     }
      <h2>Nhóm: ${n.tennhom} (${n.thanhvien.length} thành viên)</h2>`;
  if (u === n.truongnhom) {
    h += `<form action="/anh-nhom/${n._id}" method="POST" enctype="multipart/form-data">Ảnh nhóm: <input type="file" name="hinh"> <button style="font-size:10px">Cập nhật</button></form>`;
  }
  if (u && !n.thanhvien.includes(u))
    h += `<a href="/tham-gia/${n._id}" class="nut_xanh">Tham gia</a>`;
  else if (u)
    h += `<form action="/dang-nhom/${n._id}" method="POST" style="margin-top:10px"><textarea name="nd" style="width:100%"></textarea><button class="nut_xanh">Đăng bài</button></form>`;
  res.send(h + `</div>` + ps.map((p) => vebai(p, u)).join(""));
});

maychu.get("/camxuc/:id/:loai", async (req, res) => {
  const u = req.session.user;
  const b = await baiviet.findById(req.params.id);
  await baiviet.findByIdAndUpdate(req.params.id, {
    $pull: { camxuc: { nguoidung: u } },
  });
  await baiviet.findByIdAndUpdate(req.params.id, {
    $push: { camxuc: { nguoidung: u, loai: req.params.loai } },
  });
  if (u !== b.taikhoan)
    await new thongbao({
      nguoinhan: b.taikhoan,
      nguoigui: u,
      noidung: `đã thả ${req.params.loai} vào bài viết`,
    }).save();

  const bmoi = await baiviet.findById(req.params.id);
  let tk = { "👍": 0, "❤️": 0, "🥰": 0, "😂": 0, "😢": 0, "😡": 0 };
  bmoi.camxuc.forEach((c) => {
    if (tk[c.loai] !== undefined) tk[c.loai]++;
  });
  let h = "";
  for (let k in tk) {
    if (tk[k] > 0) h += `<span>${tk[k]}${k}</span>`;
  }
  res.json({ hien_tk: h });
});

maychu.post("/binhluan/:id", async (req, res) => {
  const u = req.session.user;
  const b = await baiviet.findById(req.params.id);
  await baiviet.findByIdAndUpdate(req.params.id, {
    $push: { binhluan: { nguoidung: u, noidung: req.body.nd } },
  });
  if (u !== b.taikhoan)
    await new thongbao({
      nguoinhan: b.taikhoan,
      nguoigui: u,
      noidung: "đã bình luận bài của bạn",
    }).save();
  res.send("ok");
});

maychu.get("/hopthu", async (req, res) => {
  const me = await nguoidung.findOne({ taikhoan: req.session.user });
  if (!me) return res.redirect("/");
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>Hộp thư bạn bè</h3>`;
  me.danhsachbanbe.forEach(
    (b) =>
      (h += `<p style="padding:10px; border-bottom:1px solid #eee"><a href="/chat/${b}" style="color:blue"><b>${b}</b> (Nhắn tin ngay)</a></p>`)
  );
  res.send(h + `</div>`);
});

maychu.get("/chat/:den", async (req, res) => {
  const tu = req.session.user,
    den = req.params.den;
  if (!tu) return res.redirect("/");
  const ds = await tinnhan
    .find({
      $or: [
        { tu, den },
        { tu: den, den: tu },
      ],
    })
    .sort({ thoigian: 1 });
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/hopthu" class="nut_back">← Về danh sách</a><h3>Chat với ${den}</h3><div style="height:350px; overflow-y:auto; display:flex; flex-direction:column; border:1px solid #ddd; padding:10px">`;
  ds.forEach(
    (t) =>
      (h += `<div class="msg ${t.tu === tu ? "msg-tu" : "msg-den"}">${
        t.noidung
      }</div>`)
  );
  h += `</div><form action="/guitin/${den}" method="POST" style="margin-top:10px; display:flex"><input name="nd" style="flex:1" required> <button class="nut_xanh">Gửi</button></form></div>`;
  res.send(h);
});

maychu.get("/thongbao", async (req, res) => {
  const u = req.session.user;
  if (!u) return res.redirect("/");
  const ds = await thongbao.find({ nguoinhan: u }).sort({ _id: -1 });
  await thongbao.updateMany({ nguoinhan: u }, { daxem: true });
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>Thông báo</h3>`;
  ds.forEach(
    (t) =>
      (h += `<p style="padding:10px; border-bottom:1px solid #eee"><b>${t.nguoigui}</b> ${t.noidung}</p>`)
  );
  res.send(h + `</div>`);
});

maychu.get("/loimoi", async (req, res) => {
  const me = await nguoidung.findOne({ taikhoan: req.session.user });
  let h =
    giaodien +
    `<div class="khung_chinh"><a href="/" class="nut_back">← Về Home</a><h3>Lời mời kết bạn</h3>`;
  if (!me.loimoiketban || me.loimoiketban.length === 0) h += `<p>Trống.</p>`;
  else {
    me.loimoiketban.forEach((u) => {
      if (u && u.trim() !== "")
        h += `<div style="display:flex; align-items:center; margin-top:10px"><b>${u}</b> <a href="/dongy/${u}" class="nut_xanh" style="margin-left:auto">Đồng ý</a><a href="/tuchoi/${u}" style="color:red; margin-left:10px">Xóa</a></div>`;
    });
  }
  res.send(h + `</div>`);
});

maychu.get("/ketban/:ten", async (req, res) => {
  await nguoidung.updateOne(
    { taikhoan: req.params.ten },
    { $addToSet: { loimoiketban: req.session.user } }
  );
  res.redirect("/nguoidung/" + req.params.ten);
});
maychu.get("/chan/:ten", async (req, res) => {
  await nguoidung.updateOne(
    { taikhoan: req.session.user },
    { $addToSet: { danhsachchan: req.params.ten } }
  );
  await nguoidung.updateOne(
    { taikhoan: req.session.user },
    { $pull: { danhsachbanbe: req.params.ten } }
  );
  await nguoidung.updateOne(
    { taikhoan: req.params.ten },
    { $pull: { danhsachbanbe: req.session.user } }
  );
  res.redirect("/");
});
maychu.get("/dongy/:ten", async (req, res) => {
  await nguoidung.updateOne(
    { taikhoan: req.session.user },
    {
      $push: { danhsachbanbe: req.params.ten },
      $pull: { loimoiketban: req.params.ten },
    }
  );
  await nguoidung.updateOne(
    { taikhoan: req.params.ten },
    { $push: { danhsachbanbe: req.session.user } }
  );
  res.redirect("/loimoi");
});
maychu.get("/tuchoi/:ten", async (req, res) => {
  await nguoidung.updateOne(
    { taikhoan: req.session.user },
    { $pull: { loimoiketban: req.params.ten } }
  );
  res.redirect("/loimoi");
});
maychu.post("/guitin/:den", async (req, res) => {
  await new tinnhan({
    tu: req.session.user,
    den: req.params.den,
    noidung: req.body.nd,
  }).save();
  res.redirect("/chat/" + req.params.den);
});
maychu.get("/setting", async (req, res) => {
  const u = await nguoidung.findOne({ taikhoan: req.session.user });
  res.send(
    giaodien +
      `<div class="khung_chinh"><h3>Cài đặt</h3><form action="/update" method="POST" enctype="multipart/form-data">Ảnh: <input type="file" name="hinh"><br><br>Tiểu sử: <textarea name="bio" style="width:100%">${u.tieusu}</textarea><br><br><button class="nut_xanh">Lưu</button></form></div>`
  );
});
maychu.post("/update", tai.single("hinh"), async (req, res) => {
  const u = await nguoidung.findOne({ taikhoan: req.session.user });
  if (req.file) u.anhdaidien = req.file.filename;
  u.tieusu = req.body.bio;
  await u.save();
  await baiviet.updateMany(
    { taikhoan: u.taikhoan },
    { anhdaidien: u.anhdaidien }
  );
  res.redirect("/");
});
maychu.post("/dang-nhom/:id", async (req, res) => {
  const u = await nguoidung.findOne({ taikhoan: req.session.user });
  const n = await nhom.findById(req.params.id);
  await new baiviet({
    taikhoan: u.taikhoan,
    noidung: req.body.nd,
    id_nhom: req.params.id,
    tennhom: n.tennhom,
    anhdaidien: u.anhdaidien,
  }).save();
  res.redirect("/nhom/" + req.params.id);
});
maychu.post("/tao-nhom", async (req, res) => {
  await new nhom({
    tennhom: req.body.ten,
    truongnhom: req.session.user,
    thanhvien: [req.session.user],
  }).save();
  res.redirect("/ds-nhom");
});
maychu.get("/tham-gia/:id", async (req, res) => {
  await nhom.findByIdAndUpdate(req.params.id, {
    $addToSet: { thanhvien: req.session.user },
  });
  res.redirect("/nhom/" + req.params.id);
});
maychu.post("/anh-nhom/:id", tai.single("hinh"), async (req, res) => {
  const n = await nhom.findById(req.params.id);
  if (req.session.user === n.truongnhom && req.file) {
    await nhom.findByIdAndUpdate(req.params.id, { anhnhom: req.file.filename });
  }
  res.redirect("/nhom/" + req.params.id);
});
maychu.post("/dang", tai.single("tep"), async (req, res) => {
  const u = await nguoidung.findOne({ taikhoan: req.session.user });
  let a = null,
    p = null;
  if (req.file) {
    if (
      [".mp4", ".mov"].includes(
        duongdan.extname(req.file.originalname).toLowerCase()
      )
    )
      p = req.file.filename;
    else a = req.file.filename;
  }
  await new baiviet({
    taikhoan: u.taikhoan,
    noidung: req.body.nd,
    anh: a,
    phim: p,
    anhdaidien: u.anhdaidien,
    tichxanh: u.tichxanh,
  }).save();
  res.redirect("/");
});
maychu.get("/dangnhap", (req, res) =>
  res.send(
    `<form action="/dangnhap" method="POST">TK: <input name="tk"><br>MK: <input name="mk" type="password"><br><button>Vào</button></form>`
  )
);
maychu.post("/dangnhap", async (req, res) => {
  const u = await nguoidung.findOne({
    taikhoan: req.body.tk,
    matkhau: req.body.mk,
  });
  if (u) {
    req.session.user = u.taikhoan;
    res.redirect("/");
  } else res.send("Sai");
});
maychu.get("/dangky", (req, res) =>
  res.send(
    `<form action="/dangky" method="POST">TK: <input name="tk"><br>MK: <input name="mk" type="password"><br><button>Đăng ký</button></form>`
  )
);
maychu.post("/dangky", async (req, res) => {
  await new nguoidung({ taikhoan: req.body.tk, matkhau: req.body.mk }).save();
  res.send('OK <a href="/dangnhap">Đăng nhập</a>');
});
maychu.get("/dangxuat", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
maychu.get("/xoa/:id", async (req, res) => {
  await baiviet.findByIdAndDelete(req.params.id);
  res.redirect(req.header("Referer") || "/");
});

maychu.listen(process.env.PORT || 3000, () =>
  console.log("MIN-BOOK ĐÃ LÊN MẠNG!")
);
