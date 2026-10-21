---
name: eco-school-prd
description: Quy trình và quy chuẩn viết PRD / use case / mô tả giao diện / user story cho ECO School (App ECO Me, Phụ huynh [PH-xx]) theo yêu cầu của Diễm. Dùng khi được yêu cầu viết, cập nhật hoặc rút gọn PRD, mô tả Use Case, mô tả giao diện, Acceptance Criteria hay user story cho Jira / Confluence (kb.finviet.com.vn) từ Figma, UI PDF hoặc prototype đã build.
---

# Viết PRD cho ECO School: quy chuẩn của Diễm

Kỹ năng này gom các yêu cầu Diễm đã đưa ra khi viết PRD. Khác với `ba-document` (đặc tả `PRD-DOCS.md` tổng quát bằng Markdown), đây là PRD theo mẫu Confluence của công ty: xuất `.docx` để import Confluence, hoặc văn bản dán thẳng vào Confluence / Jira.

## 1. Trước khi viết

1. **Đọc mẫu có sẵn của dự án trước.** Kiểm tra thư mục PRD (`~/Finviet/ECO School/PRD (docs)/`), các PRD cùng nhóm và template PRD đang có. Khi được yêu cầu "viết lại cho đúng cấu trúc", lấy trang Confluence mẫu (đọc bằng công cụ Confluence) làm chuẩn rồi rút gọn nội dung thừa cho khớp.
2. **Nguồn sự thật cho UI và business rule** theo thứ tự: UI Figma / handoff hoặc file PDF Diễm gửi, prototype đã build (localhost, `eco-school-parents.vercel.app`), PRD đang có (Confluence hoặc PDF export). Khi cập nhật PRD đã có, dựa trên bản PDF / trang hiện có của Diễm và sửa theo app hiện tại, giữ nguyên phần còn đúng.
3. **Báo mức độ sẵn sàng trước khi tạo file** (khi Diễm yêu cầu, hoặc tính năng còn điểm mờ): nêu tình trạng đầu vào, liệt kê các điểm cần chốt thành **danh sách đánh số kèm lựa chọn đề xuất**. Diễm trả lời ngắn theo số ("1. … 2. … 3. …"). Đừng hỏi lại điều đã có trong PRD, UI hoặc code.
4. Các điểm hay phải chốt: cách tính tổng, quy ước đếm, phạm vi thời gian (năm học tính từ tháng 8 đến tháng 7), mặc định khi mở màn, phần nào cần Backend bổ sung (ghi rõ "cần chốt với BE").
5. Dịch vụ Phụ huynh nằm dưới trang Confluence `pageId=92768750`; chỉ build / mô tả trong phạm vi đó.

## 2. Cấu trúc PRD (.docx)

Mã tài liệu dạng `[PH-xx]` (tính năng con `[PH-9.4]`). Thông tin đầu vào mặc định: nền tảng App ECO Me (iOS, Android); Owner / Reviewer: `diem.vo@finviet.com.vn`.

**Đầu tài liệu**
- Bảng 1: Priority, Document Status (Ready for Review), Document Owner, Created Date, Reviewer.
- Bảng 2: Lịch sử tài liệu (phiên bản, mức thay đổi, tóm tắt, ngày cập nhật, người phụ trách). Mỗi lần cập nhật thêm một dòng.

**Phần 1. Thông tin tổng quan**: 1.1 Giới thiệu chung · 1.2 Mục tiêu · 1.3 Phạm vi · 1.4 Tài liệu tham khảo (bảng BRD, Sheets, API, Prototype).

**Phần 2. Tổng quan nghiệp vụ và quy tắc cốt lõi** (thứ tự đã chốt):
- **2.1 Mô hình hóa nghiệp vụ**, gồm User Flow vẽ dạng **swimlane** (theo tác nhân). Ở PH-9.4 mục này từng là 2.2.1 trước khi đổi cấu trúc; số mục con theo bản PRD đang sửa.
- **2.2 Mô tả các bước nghiệp vụ**: bước, chuyển trạng thái, logic tính toán, kèm **ít nhất 1 ví dụ cụ thể** có mốc thời gian / số liệu thực.
- **2.3 Business Rules (BR)** nằm sau 2.2.

**Quy tắc viết BR**
- Ngắn gọn, đánh số `BR-01`, `BR-02`…, nói về **vận hành của đối tượng nghiệp vụ** (ví dụ góp ý: sửa được hay không, thời hạn mở lại, giới hạn tập tin, dữ liệu phụ thuộc học sinh đang chọn).
- **Không** mô tả chức năng, màn hình, nút bấm trong BR. Những thứ đó thuộc Use Case (phần 3) và Giao diện (phần 4).

**Phần 3. Đặc tả tính năng và Use Case**
- 3.1 Bảng phân rã: `Epic | Feature | Platform | Priority | User Story | Status`.
- 3.2 Từng Use Case (`UC-01`, `UC-02`…): ID, tên, Actor, Trigger, Pre-condition, Happy path (đánh số bước), Exception (lỗi, hủy, mất kết nối), Post-condition, Business Rules riêng.
- **Gộp use case hợp lý, không tách vụn.** Ví dụ Góp ý còn 3 UC: UC-01 Xem danh sách và chi tiết góp ý · UC-02 Phụ huynh gửi góp ý mới · UC-03 Phụ huynh trao đổi trong góp ý (phản hồi và mở lại góp ý đã đóng). Khi Diễm hỏi "có nên gộp X vào Y không", đưa ý kiến kèm lý do.

**Phần 4. Giao diện người dùng**
- Bảng 5 cột: `Màn hình | Field/Component | Format | Description | Note`.
- Cột **Màn hình**: nhúng ảnh chụp thật từ prototype / Figma, kèm tên màn hình in đậm. **Merge cell theo chiều dọc** cho các dòng field / component thuộc cùng một màn hình.
- Các cột còn lại liệt kê từng thành phần: nút, ô nhập, icon, tiêu đề, trạng thái Enable / Disable / Validation.
- Tách phần 4 thành các mục nhỏ theo cụm màn hình, ví dụ PH-9.4: 4.1 Entry points · 4.2 Thông tin chung (số tiền, hóa đơn) · 4.3 Phân bổ danh mục (donut chart) · 4.4 Theo tháng (bar chart).

**Phần 5. Tiêu chí nghiệm thu (AC)**
- Dạng rút gọn, theo điều kiện (condition-driven). Mỗi AC xử lý một tiêu chí độc lập: Eligibility, Trigger, Validation, Error Handling, State Updates.
- Nêu rõ: điều kiện áp dụng, điều kiện chặn, xử lý hệ thống, kết quả mong đợi.
- Tiêu đề `AC-01`, `AC-02`…, mỗi tiêu đề có dòng trống và **spacing before 360** phía trên.

## 3. Quy tắc kỹ thuật để import Confluence không lỗi

1. **Không dùng thẻ `<br>`** trong bảng. Mỗi dòng hoặc gạch đầu dòng trong một ô là một đoạn văn riêng (`<w:p>`).
2. **Dùng Unicode, không dùng LaTeX**: viết thẳng `≥ ≤ → • –`, không viết `$ \ge $`.
3. **Không viết `[X]`, `[<]` đơn lẻ** (Confluence hiểu nhầm là checkbox / macro rồi ngắt dòng). Viết rõ: nút đóng (X), nút quay lại (<).
4. **Khoảng cách thoáng giữa các AC**: dòng trống và spacing before 360 trước mỗi tiêu đề AC.
5. **Xuất file hoàn chỉnh**: nhúng đủ ảnh thật vào `.docx`, kiểm tra file mở được và còn nguyên, báo đường dẫn file.

Khi tạo `.docx` dùng skill `docx` của Claude. Kiểm tra lại file đã sinh (đọc lại bảng, ảnh, merge cell) trước khi báo xong.

## 4. Nơi lưu và đặt tên

- Lưu trong `~/Finviet/ECO School/PRD (docs)/1. ECO SCHOOL (Parent)/`. Tính năng có nhiều bản con nằm trong thư mục riêng, ví dụ `10 - [PH-09] - Đóng Học Phí/03 - [PH-9.4] - Tổng quan hóa đơn học phí đã đóng.docx`; tính năng đơn: `21 - [PH-20] Phụ huynh góp ý cho nhà trường.docx`.
- Giữ tên theo thứ tự số và mã `[PH-xx]` của thư mục. Không sửa các file khóa `~$…`.
- Cuối câu trả lời ghi rõ đường dẫn file đã lưu.

## 5. Các dạng đầu ra khác

- **Chỉ mô tả Use Case và Giao diện để dán vào Confluence** ("không cần tạo file Word"): trả văn bản có cấu trúc, bảng giao diện đủ 5 cột, không tạo `.docx`. Áp dụng cùng quy tắc ở mục 3.
- **Cập nhật một UC** trong PRD đã có (ví dụ UC-02 thanh toán tiếp hóa đơn đã trả một phần): chỉ viết lại UC đó và phần giao diện liên quan, nêu rõ chỗ thay đổi so với bản cũ.
- **User story cho Jira**, theo đúng khuôn:

```
US: As a parent, I want …, so that …
PRD: [[PH-x.y] Tên PRD](link Confluence)
Prototype: https://eco-school-parents.vercel.app/ (đường dẫn thao tác: Màn hình > Tab > Mục)
Mô tả Chức năng:

1. Vị trí: điều hướng vào từ …
2. …
```

  Mỗi ý là một câu hành vi người dùng nhìn thấy / làm được, đánh số, không nêu chi tiết kỹ thuật. Khi cập nhật, bám đúng app hiện tại và nêu những điểm khác bản cũ.

## 6. Nội dung nghiệp vụ Diễm đã chốt (dùng lại khi liên quan)

- **Góp ý**: không sửa sau khi gửi; mở lại trong 7 ngày kể từ lúc đóng, quá hạn thì ẩn hoặc khóa; tập tin đính kèm là hình ảnh (chọn từ thư viện hoặc chụp) hoặc PDF, tối đa 10 tập tin mỗi lần upload (áp dụng cho cả góp ý mới và phản hồi); dữ liệu phụ thuộc tài khoản phụ huynh và học sinh đang chọn.
- **Tổng quan hóa đơn**: tổng số tiền thanh toán chỉ tính khoản **đã trả**; số liệu tổng quan chỉ lấy dữ liệu của **năm học đang chọn** (mặc định năm học hiện tại, tháng 8 đến tháng 7); danh mục suy ra từ tên khoản ở prototype, bản thật cần trường danh mục riêng (ghi chú cho BE).
- **Hóa đơn thanh toán một phần**: dưới mỗi hóa đơn còn ít nhất một khoản chưa trả có "Số tiền còn lại" (tổng các khoản chưa trả) và nút "Thanh toán ngay" mở màn Xác nhận thanh toán chỉ với hóa đơn đó; thanh toán xong về Kết quả giao dịch như flow hiện tại.
- **Xem hóa đơn điện tử**: nút mở màn xem PDF có nút quay lại và tải về ở góc trên.

## 7. Kiểm tra trước khi giao

- Cấu trúc 2.1 / 2.2 / 2.3 và các phần 1 đến 5 đúng thứ tự; BR ngắn, không lẫn màn hình hay nút.
- Số lượng UC hợp lý, không trùng lặp; mỗi UC đủ các trường.
- Bảng giao diện: có ảnh, tên màn hình in đậm, cột Màn hình đã merge dọc.
- AC rút gọn, độc lập, có spacing; không còn `<br>`, LaTeX, `[X]`.
- Số liệu và wording khớp app hiện tại và các điểm đã chốt ở mục 6.
