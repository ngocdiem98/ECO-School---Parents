# Bộ Test Case: {{feature_name}}

> Tài liệu nguồn: `PRD-DOCS.md` ({{doc_version_or_date}})
> Bộ tự động hóa nguồn: Playwright specs tại `{{e2e_test_path}}`

## Tổng Quan Độ Phủ (Coverage Summary)

| User Story | Tổng Số Case | Luồng Chính | Ngoại Lệ/Biên | Tự Động | Thủ Công |
|---|---|---|---|---|---|
| `US-{{MODULE}}-001` | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |

*(Mỗi User Story trong `PRD-DOCS.md` là một dòng. Mỗi story cần tối
thiểu 1 case luồng chính và 1 case ngoại lệ/biên — story không có case
ngoại lệ nào là một lỗ hổng, không phải một kết quả sạch.)*

---

## `US-{{MODULE}}-001`: {{Tên tính năng}}

### TC-{{MODULE}}-001-01 — {{Tiêu đề ngắn gọn, cụ thể}}

| Trường | Giá trị |
|---|---|
| **Liên Quan** | `US-{{MODULE}}-001` / AC `{{X.Y}}` / `BR-{{MODULE}}-{{NNN}}` (nếu có) |
| **Loại** | Luồng chính / Ngoại lệ / Biên / Bảo mật / Hiệu năng |
| **Độ Ưu Tiên** | Nghiêm trọng / Cao / Trung bình / Thấp |
| **Điều Kiện Tiên Quyết** | {{Trạng thái hệ thống/dữ liệu cần có trước khi chạy test}} |
| **Tự Động** | Có — `{{tên file spec}}::{{tên test}}` / Không — thủ công |

**Các Bước Thực Hiện**

1. {{Hành động}}
2. {{Hành động}}
3. {{Hành động}}

**Dữ Liệu Kiểm Thử**

| Trường | Giá trị |
|---|---|
| {{field}} | {{giá trị sử dụng}} |

**Kết Quả Mong Đợi**

{{Mô tả chính xác những gì cần quan sát được — nêu rõ điều kiện đạt một
cách không mơ hồ, khớp với hành vi đã đặc tả trong AC càng sát nghĩa
càng tốt.}}

**Kết Quả Thực Tế**

{{Điền khi thực thi. Với case tự động, đây là kết quả assertion thực tế
từ lần chạy Playwright, không phải gõ tay lại.}}

**Trạng Thái**

`Chưa Chạy` / `Đạt` / `Không Đạt` / `Bị Chặn`

---

*(Lặp lại một khối `### TC-{{MODULE}}-{{story}}-{{seq}}` cho mỗi test
case. Đánh số theo quy tắc: `TC-<MODULE>-<số-thứ-tự-story>-<số-thứ-tự>`,
ví dụ `TC-AUTH-001-01`, `TC-AUTH-001-02`. Gom tất cả case dưới tiêu đề
`## US-` sở hữu để tài liệu dễ điều hướng theo story, khớp cấu trúc của
`PRD-DOCS.md`.)*

## Cách Xây Dựng Test Case (dùng bởi `/writetest-vn`)

Với mỗi User Story trong `PRD-DOCS.md`:

1. Một case luồng chính cho mỗi dòng trong Bảng Tóm Tắt Tiêu Chí Nghiệm
   Thu của story.
2. Một case ngoại lệ/biên cho mỗi mục trong bước "Xử Lý Ngoại Lệ & Báo
   Lỗi" của story.
3. Một case biên (boundary) cho mỗi ràng buộc số/độ dài trong bước "Quy
   Tắc Kiểm Tra & Ràng Buộc Dữ Liệu" (VD: độ dài tối thiểu/tối đa, so
   sánh ngưỡng).
4. Một case cho mỗi dòng liên quan trong Bảng Chuyển Trạng Thái mà story
   này kích hoạt hoặc bị ảnh hưởng bởi việc chuyển trạng thái.
5. Một case cho mỗi Quy Tắc Vàng (`BR-{{MODULE}}-{{NNN}}`) ràng buộc hành
   vi của story này.
6. Đối chiếu với bộ Playwright thực tế từ `/build`: đánh dấu `Tự Động: Có`
   kèm đúng tên spec/test ở bất kỳ đâu case đã được phủ, `Không` ở những
   case đã đặc tả nhưng chưa tự động hóa (VD: thủ công/khám phá, kiểm tra
   trực quan, hoặc cố tình nằm ngoài phạm vi tự động hóa).
