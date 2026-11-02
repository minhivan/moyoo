# Surface brief: moyoo app (camera → review)

Scope: toàn bộ app (`src/App.tsx` và các component). Mode: Operate. Mobile-first, không landing; tablet/desktop là cột app căn giữa, review hai cột khi rộng.

Audience/job: nhóm bạn 16–24, mở app là chụp; chọn chế độ (1 tấm, dải 4, lưới 2×2), khung, lọc; xem lại, chỉnh dấu/giấy, lưu PNG hoặc sao chép.

Constraints: frontend-only, không lưu ảnh; camera cần thao tác người dùng lần đầu; giữ mọi chức năng hiện có.

## Direction contract

THESIS: Điện thoại là máy purikura: khung ngắm mặc sẵn màu giấy và đúng tỉ lệ ô ảnh sẽ in, nên thấy gì in nấy. Từ chối bố cục "landing rồi vào studio" và màn camera đen chung chung.

OWN-WORLD: Nền hồng kẹo #FFE3F1, mặt trắng viền dày như sticker, mực mận #2B1030, hồng nóng #FF3E9A cho nút chụp, hồng đậm #D6116F cho nút có chữ, tím #7A3CFF cho trạng thái đang chọn. Một họ chữ tròn Baloo 2, một cỡ làm việc, cỡ hiển thị chỉ cho đếm ngược và tên app. Bo 20–28px, keyline trắng 3–4px, nét vẽ tay ngôi sao/tim chỉ ở dấu ấn.

STORY: Mở app thấy chính mình trong khung màu giấy, chạm nút hồng là chụp; xong 1 hoặc 4 tấm thì sang tờ ảnh để chỉnh dấu, giấy và lưu.

FIRST VIEWPORT: Thanh trên mỏng (moyoo, âm thanh, VI/EN). Khung ngắm 3:4 chiếm ~62% chiều cao, bên trong ô cắt đúng tỉ lệ chế độ, ngoài ô phủ màu khung. Dưới: thanh chế độ ba viên; hàng công cụ Khung · Lọc · Hẹn giờ · Auto; đáy: chọn ảnh, nút chụp 84px, đổi camera.

FORM: Purikura (lựa chọn của người dùng, thẻ pick ở vòng bốc lại 1; đứng đầu danh sách grounded của mình). seed:cc2e24f006b6525c. Signature move: khung ngắm "mặc" màu giấy và mặt nạ tỉ lệ ô in; chọn là dán sticker (nhấc lên, keyline trắng, nghiêng nhẹ). Chuyển động một nhịp 0,4s vượt nhẹ.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
