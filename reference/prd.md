# PRD — EDU Parent (Phụ huynh) App
*Tài liệu dựng lại từ ảnh chụp màn hình thật trong `./reference`. Chỉ mô tả những gì xuất hiện trong ảnh, không suy diễn tính năng chưa có bằng chứng hình ảnh.*

## 0. Cấu trúc tổng quan

Ứng dụng có 2 cấp màn hình chính:

- **Phụ huynh Homescreen** — màn hình gốc, hiển thị lưới tính năng dùng chung + danh sách các học sinh đã liên kết với tài khoản phụ huynh.
- **Học sinh Homescreen** — màn hình theo ngữ cảnh 1 học sinh cụ thể (mở ra khi bấm vào thẻ học sinh), hiển thị số dư thẻ, cùng lưới tính năng, và hoạt động gần đây của riêng học sinh đó.

Từ cả hai màn hình trên, các tính năng con (Đóng học phí, Nạp điểm vào thẻ, Lịch sử chi tiêu, Thời khoá biểu, Theo dõi điểm danh, Báo vắng, Bài tập, Kết quả học tập...) đều được truy cập qua lưới icon 2x4, và mỗi tính năng luôn thao tác trên **một học sinh cụ thể** — nếu ngữ cảnh học sinh chưa xác định (bấm từ Phụ huynh Homescreen), app hiển thị **bottom sheet "Danh sách học sinh"** để phụ huynh chọn trước khi vào màn hình tính năng.

Mọi màn hình con đều lặp lại một khối thông tin học sinh cố định ở đầu trang (avatar, họ tên, mã học sinh, lớp, trường) kèm nút **"Đổi"** để mở lại bottom sheet chọn học sinh mà không cần quay về Home.

---

## 1. Phụ huynh Homescreen

### Mục tiêu
Là điểm vào trung tâm: giới thiệu thương hiệu "Thẻ học sinh thông minh", cho phép truy cập nhanh mọi tính năng, và quản lý danh sách học sinh đã liên kết.

### Thành phần UI chính
- Banner thương hiệu "ECO School Phụ huynh" / "Thẻ học sinh thông minh" + icon trợ giúp "?" ở góc phải trên.
- Lưới icon tính năng, **vuốt ngang 2 trang** (dot indicator bên dưới):
  - Trang 1: Đóng học phí, Nạp điểm vào thẻ, Lịch sử chi tiêu, Thời khoá biểu, Theo dõi điểm danh, Báo vắng, Bài tập, Kết quả học tập.
  - Trang 2: Học bạ số, Thực đơn, Hoạt động, Hóa đơn, Dặn thuốc, Bảng tin, Nhật ký chăm sóc *(các icon này có mặt trên lưới nhưng không có màn hình chi tiết trong bộ ảnh tham chiếu — không suy diễn thêm hành vi cho chúng)*.
- "Danh sách học sinh": mỗi học sinh là 1 card hiển thị avatar, họ tên, mã học sinh, trường, lớp, số dư thẻ.
- Banner nhắc nợ học phí "X hóa đơn chờ thanh toán" + link "Thanh toán" (chỉ hiện khi có hóa đơn chưa đóng).
- Nút "Thêm học sinh mới +" ở cuối danh sách.

### Hành vi người dùng
- Bấm 1 icon tính năng → mở bottom sheet "Danh sách học sinh" để chọn học sinh áp dụng, sau đó điều hướng vào màn hình tính năng tương ứng cho học sinh đã chọn.
- Bấm vào 1 card học sinh → vào **Học sinh Homescreen** của học sinh đó.
- Bấm banner "Thanh toán" → vào thẳng luồng Đóng học phí.
- Bấm "Thêm học sinh mới +" → vào luồng Liên kết học sinh.
- Bấm icon "?" → vào Hướng dẫn sử dụng.

---

## 2. Học sinh Homescreen

### Mục tiêu
Trung tâm thao tác cho một học sinh cụ thể: xem số dư thẻ, truy cập nhanh các tính năng, theo dõi hoạt động gần đây, và nạp điểm vào thẻ.

### Thành phần UI chính
- Header: nút quay lại, tiêu đề "Học sinh", icon cài đặt (góc phải).
- Khối hồ sơ: avatar, họ tên, mã học sinh, nút "Đổi" (mở bottom sheet chọn học sinh khác), lớp, trường.
- Card "Số dư thẻ" hiển thị điểm hiện có.
- Lưới icon tính năng (trùng nhóm trang 1 của Phụ huynh Homescreen): Đóng học phí, Nạp điểm vào thẻ, Lịch sử chi tiêu, Thời khoá biểu, Theo dõi điểm danh, Báo vắng, Bài tập, Kết quả học tập.
- "Hoạt động gần đây": nhật ký các sự kiện (nạp tiền, điểm danh, thêm/hủy liên kết học sinh...) kèm thời gian.
- CTA cố định đáy màn hình "Nạp điểm vào thẻ" — **bị vô hiệu hoá (xám, không bấm được)** nếu trường của học sinh không hỗ trợ tính năng nạp điểm (ví dụ trường "FINVIET").

### Hành vi người dùng
- Bấm "Đổi" → mở bottom sheet "Danh sách học sinh" để chuyển sang học sinh khác mà không thoát ra Home.
- Bấm icon tính năng → vào thẳng màn hình tính năng cho học sinh đang xem (không cần chọn lại vì ngữ cảnh đã có sẵn).
- Bấm CTA "Nạp điểm vào thẻ" (nếu khả dụng) → vào luồng Nạp điểm vào thẻ.

---

## 3. Bottom sheet "Danh sách học sinh" (component dùng chung)

### Mục tiêu
Chuẩn hoá việc chọn/chuyển học sinh trước khi vào bất kỳ tính năng nào — tránh lặp lại thao tác điều hướng.

### Thành phần UI chính
- Tiêu đề "Danh sách học sinh" + nút đóng (X).
- Danh sách card học sinh: họ tên, mã học sinh, số dư thẻ. Học sinh đang được chọn có thể được tô nổi bật (nền vàng).

### Hành vi người dùng
- Xuất hiện khi: (a) bấm icon tính năng từ Phụ huynh Homescreen, (b) bấm nút "Đổi" từ bất kỳ màn hình theo ngữ cảnh học sinh nào.
- Với tính năng **Nạp điểm vào thẻ**, danh sách chỉ hiển thị những học sinh thuộc trường **có hỗ trợ** tính năng này (ví dụ chỉ thấy "Phan Khánh Vy", ẩn "Trần Đăng Khoa").
- Chọn 1 học sinh → đóng sheet, điều hướng vào màn hình tính năng với ngữ cảnh học sinh đã chọn.

---

## 4. Đóng học phí

### Mục tiêu
Cho phép phụ huynh tra cứu và thanh toán các hoá đơn học phí/dịch vụ nhà trường chưa thanh toán.

### Thành phần UI chính & hành vi
Có 2 nhánh tuỳ trạng thái liên kết hoá đơn của học sinh:

**Nhánh A — học sinh/nhà cung cấp chưa từng liên kết hoá đơn:**
1. **Chọn nhà cung cấp** (modal): ô tìm kiếm + danh sách đối tác (ECO School/finviet, TheSSC, VinaID).
2. **Hóa đơn học phí**: banner nhà cung cấp đã chọn (có nút "Thay đổi"), ô nhập "Mã học sinh", khối "Hoá đơn đã lưu" (nếu có), khối minh hoạ "Hoá đơn mẫu" khoanh vùng vị trí lấy mã học sinh trên hoá đơn giấy. CTA "Tiếp tục" chỉ bật khi đã nhập mã hợp lệ.
3. **Thông tin hóa đơn**: hiển thị thông tin học sinh tra được, danh sách "Hoá đơn chưa thanh toán" dạng checkbox chọn kỳ cần đóng, tổng tiền cập nhật theo lựa chọn, CTA "Xác nhận thanh toán".

**Nhánh B — học sinh đã có hoá đơn liên kết sẵn:**
- Vào thẳng màn **Thông tin hóa đơn**: thông tin học sinh, danh sách hoá đơn chưa thanh toán nhóm theo tháng (mỗi tháng expand ra các dòng phí con: Học phí, Tiền ăn, Học liệu... — mỗi dòng có checkbox riêng), tổng tiền, CTA "Xác nhận thanh toán".

*(Bộ ảnh tham chiếu không có màn hình xác nhận thanh toán/kết quả cho luồng này — không suy diễn thêm.)*

---

## 5. Nạp điểm vào thẻ

### Mục tiêu
Nạp tiền/điểm vào thẻ học sinh (thẻ dùng để thanh toán trong trường — ăn uống, mua sắm căng tin...).

### Thành phần UI chính & hành vi
1. **Thông tin nạp điểm**: thông tin học sinh, lưới chọn nhanh mệnh giá (10,000 / 20,000 / 50,000 / 100,000 / 200,000 / 500,000), link "Nhập số điểm khác", tiện ích "Kích hoạt nạp điểm tự động", tổng điểm + CTA "Xác nhận".
2. **Xác nhận giao dịch**: tổng thanh toán, thông tin học sinh, mục "Ưu đãi ECO Me" (chọn ưu đãi), chọn phương thức thanh toán (Ví ECO — cảnh báo đỏ nếu số dư không đủ kèm nút "Nạp tiền" ví; hoặc thẻ ngân hàng liên kết như Techcombank), CTA "Tiếp tục".
3. **Kết quả giao dịch**: biểu tượng thành công, số tiền, mã giao dịch, thời gian, thông tin học sinh, link "Chia sẻ", banner gợi ý kích hoạt nạp tiền tự động, khối gợi ý dịch vụ liên quan "Đừng bỏ lỡ" (điện thoại trả sau, bảo hiểm xe máy, bảo hiểm ô tô), 2 CTA "Trang chủ" / "Giao dịch mới".

---

## 6. Lịch sử chi tiêu

### Mục tiêu
Xem lại lịch sử nạp/tiêu trên thẻ học sinh.

### Thành phần UI chính
- Banner học sinh dạng "thẻ vật lý" (gradient vàng) hiển thị tên + mã học sinh, có mũi tên để mở lại bottom sheet chọn học sinh.
- Bộ lọc "Lọc theo": chọn khoảng ngày tuỳ ý, hoặc nút nhanh "3 tháng" / "6 tháng".
- Khối tổng hợp "Nhật ký": Tiền vào / Tiền ra.
- Danh sách giao dịch: icon loại giao dịch, tên (vd "Nạp tiền"), thời gian, số tiền (màu xanh khi cộng).

### Hành vi người dùng
- Bấm banner thẻ học sinh → mở bottom sheet "Danh sách học sinh" để đổi học sinh xem.
- Đổi bộ lọc thời gian → danh sách và tổng hợp cập nhật theo khoảng đã chọn.

---

## 7. Thời khoá biểu

### Mục tiêu
Xem thời khoá biểu hiện tại của học sinh.

### Thành phần UI chính & hành vi
- Header thông tin học sinh như chuẩn chung.
- Nếu trường/lớp chưa có dữ liệu thời khoá biểu (ví dụ học sinh mầm non): hiển thị **trạng thái rỗng** "Chưa có thông tin".
- Nếu có dữ liệu: hiển thị nhãn "Thời gian: dd/mm/yyyy - dd/mm/yyyy" (kỳ áp dụng) và nội dung thời khoá biểu dạng **hình ảnh/tài liệu** (không phải bảng dữ liệu tương tác) kèm nút "Tải xuống" ở cuối trang.

---

## 8. Theo dõi điểm danh

### Mục tiêu
Theo dõi tình trạng đi học theo ngày/tháng và truy cập nhanh tính năng báo vắng.

### Thành phần UI chính
- Header thông tin học sinh chuẩn.
- Segmented control 2 tab: **Nhật ký** / **Điểm danh**.
- Tab **Điểm danh**:
  - Card "Thống kê tháng [n]": 4 chỉ số — Có mặt, Vắng có phép, Vắng không phép, Đến muộn.
  - Lịch tháng có điều hướng tháng trước/sau, ngày hiện tại được đánh dấu.
  - CTA cố định đáy "Báo vắng".
- Tab **Nhật ký**: danh sách hoạt động điểm danh gần đây, hoặc trạng thái rỗng "Chưa có thông tin" nếu chưa có dữ liệu.

### Hành vi người dùng
- Bấm CTA "Báo vắng" → chuyển sang luồng Báo vắng (tạo đơn).

---

## 9. Báo vắng

### Mục tiêu
Gửi đơn xin nghỉ phép cho học sinh và theo dõi trạng thái duyệt đơn.

### Thành phần UI chính & hành vi

**Màn danh sách "Báo vắng":**
- Header thông tin học sinh chuẩn.
- Tab lọc: Tất cả / Chờ duyệt / Đã duyệt / Đã huỷ.
- Mỗi đơn là 1 card: khoảng ngày nghỉ, badge trạng thái (Chờ duyệt/Đã duyệt/Đã huỷ — mỗi trạng thái 1 màu riêng), Thời gian nghỉ (Cả ngày/Buổi sáng/Buổi chiều), Số ngày nghỉ, Nội dung.
- CTA cố định đáy "Tạo đơn báo vắng".

**Màn "Tạo đơn báo vắng" (form):**
- Ngày hiện tại hiển thị tham chiếu ("Hôm nay, ngày ...").
- "Thời gian nghỉ": chọn 1 trong 3 — Cả ngày / Buổi sáng / Buổi chiều.
- "Từ ngày" / "Đến ngày": 2 ô chọn ngày qua date picker.
- "Ghi chú": textarea bắt buộc (*), giới hạn 256 ký tự, có bộ đếm ký tự.
- "Ảnh đính kèm": tối đa 10 ảnh, chọn qua "Thư viện".
- CTA "Nộp đơn" — bị mờ/disable cho tới khi các trường bắt buộc được điền.

**Kết quả:**
- Modal "Thành công" / "Xin phép vắng thành công" + nút "Đã hiểu" đè lên form vừa nhập.
- Sau khi đóng modal, quay lại danh sách "Báo vắng", đơn mới xuất hiện đầu danh sách với trạng thái "Chờ duyệt".

---

## 10. Bài tập

### Mục tiêu
Theo dõi bài tập được giao, nộp bài hộ/hỗ trợ học sinh, và xem lại nhận xét/điểm của giáo viên.

### Thành phần UI chính & hành vi

**Màn danh sách "Bài tập":**
- Header thông tin học sinh chuẩn.
- Tab lọc: Tất cả / Chưa nộp / Đã nộp / Đã chấm.
- Mỗi bài là 1 card: tên môn, tên bài, badge trạng thái (Đã chấm - xanh lá / Chưa nộp - cam...), Điểm (nếu đã chấm), thời gian + hạn nộp (đổi màu đỏ nếu quá hạn), tên giáo viên.
- Cuối danh sách có dòng "Bạn đã xem hết bài tập".

**Màn "Chi tiết bài tập" (khi bài Chưa nộp):**
- Banner cảnh báo đỏ nếu bài đã quá hạn nộp.
- Card "Nhận xét của giáo viên": Môn, Giáo viên, badge trạng thái, Điểm ("-" nếu chưa có), Nhận xét ("Chưa có nhận xét" nếu chưa chấm).
- Khối chi tiết giao bài: Ngày giao, Hạn nộp.
- "Bài tập nhỏ": Nội dung bài tập (link "Xem chi tiết"), Tài liệu đính kèm (ảnh minh hoạ).
- CTA đáy "Nộp bài tập".

**Màn "Nội dung bài nộp" (khi nộp mới):**
- Preview "Tài liệu đính kèm" đã chọn (có nút xoá X trên từng tệp).
- Bộ đếm "Đã chọn (n) tệp".
- 2 nút thêm tệp: "Thư viện" (ảnh) / "Tài liệu" (file).
- CTA đáy "Gửi bài tập".
- Sau khi bấm gửi → modal "Nộp bài thành công" / "Học sinh nộp bài thành công" + nút "Đã hiểu".

**Màn "Chi tiết bài tập" (khi bài Đã nộp — xem lại):**
- Giống màn chi tiết ở trên nhưng: badge trạng thái đổi thành "Đã nộp", thêm khối "Nội dung bài nộp" (bài đã gửi, có link "Xem chi tiết").
- CTA đáy đổi thành "Chỉnh sửa bài nộp" (thay cho "Nộp bài tập").

**Màn chỉnh sửa bài nộp:**
- Giao diện giống hệt màn "Nội dung bài nộp" khi nộp mới, chỉ khác CTA đáy là "Cập nhật bài nộp" (thay vì "Gửi bài tập") — cho phép thay tệp đính kèm rồi nộp lại.

---

## 11. Kết quả học tập

### Mục tiêu
Xem bảng điểm và kết quả rèn luyện theo học kỳ.

### Thành phần UI chính
- Header thông tin học sinh chuẩn.
- Nhãn năm học, vd "Năm học 2025-2026".
- Tab: Học kỳ I / Học kỳ II / Tổng kết.
- Card "Tổng kết học kỳ": bảng 2 cột (Danh mục / giá trị học kỳ đang chọn) gồm 3 dòng — Kết quả học tập, Kết quả hành vi, Số ngày nghỉ. Giá trị hiển thị "--" khi chưa có dữ liệu.
- Ghi chú giải thích viết tắt xếp loại: "T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt / G: Giỏi, TT: Tiên tiến, XS: Xuất sắc".
- Card "Kết quả học tập": bảng điểm chi tiết theo môn học, nhiều cột điểm thành phần (ĐĐGTX, ĐĐGK...), cuộn ngang được, giá trị "--" khi chưa có điểm.

---

## 12. Liên kết học sinh

### Mục tiêu
Thêm một học sinh mới vào danh sách quản lý của phụ huynh.

### Thành phần UI chính & hành vi

**Màn giới thiệu:**
- Banner thương hiệu giống Home.
- Card hướng dẫn "Quét hoặc nhập thông tin học sinh để liên kết" với 3 bước: (1) Nhập mã học sinh và mã bảo vệ hoặc quét mã QR trên thẻ học sinh; (2) Kiểm tra thông tin học sinh; (3) Nhấn "Xác nhận" để hoàn tất.
- 2 CTA: "Quét mã QR" (chính, màu vàng) và "Nhập thông tin" (phụ, viền).
- Link chân trang "Bạn làm hỏng, mất thẻ, Cấp lại thẻ".

**Modal "Kích hoạt liên kết học sinh"** (khi bấm "Nhập thông tin"):
- Ghi chú hotline hỗ trợ cấp mã bảo vệ: "1900 9005".
- 2 ô nhập: "Mã học sinh", "Mã bảo vệ".
- CTA "Xác nhận" (disable tới khi đủ dữ liệu).

*(Bộ ảnh tham chiếu không có màn hình kết quả sau khi xác nhận liên kết — không suy diễn thêm.)*

---

## 13. Hướng dẫn sử dụng

### Mục tiêu
Cung cấp tài liệu hướng dẫn từng bước ngay trong app, truy cập từ icon "?" trên Phụ huynh Homescreen.

### Thành phần UI chính
- Tiêu đề "Hướng dẫn sử dụng Thẻ học sinh".
- Thanh tab cuộn ngang gồm (tối thiểu) 4 chủ đề: Kích hoạt thẻ mới, Nạp tiền vào thẻ, Theo dõi điểm danh, Quản lý chi tiêu.
- Mỗi tab: tiêu đề chủ đề (pill xanh), chuỗi ảnh mockup điện thoại được đánh số (1, 2, 3...) minh hoạ từng bước thao tác kèm chú thích ngắn bên dưới mỗi ảnh.

### Hành vi người dùng
- Chuyển tab để xem hướng dẫn cho từng chủ đề khác nhau; nội dung là tài liệu tĩnh, không có thao tác nghiệp vụ thật (chỉ là ảnh minh hoạ chú thích).
