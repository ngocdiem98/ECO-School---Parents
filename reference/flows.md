# Flows — EDU Parent (Phụ huynh) App
*Sơ đồ điều hướng dựng lại từ ảnh chụp màn hình thật trong `./reference`.*

## 1. Sơ đồ tổng quan (Home → các Tab tính năng)

```mermaid
flowchart TD
    Home["Phụ huynh Homescreen"]
    Picker{{"Bottom sheet:\nDanh sách học sinh"}}
    StudentHome["Học sinh Homescreen"]
    Help["Hướng dẫn sử dụng"]
    LinkStudent["Liên kết học sinh"]

    Fee["Đóng học phí"]
    TopUp["Nạp điểm vào thẻ"]
    Spending["Lịch sử chi tiêu"]
    Timetable["Thời khoá biểu"]
    Attendance["Theo dõi điểm danh"]
    Absence["Báo vắng"]
    Homework["Bài tập"]
    Results["Kết quả học tập"]

    Home -- "bấm icon tính năng (trang 1)" --> Picker
    Home -- "bấm card học sinh" --> StudentHome
    Home -- "bấm banner 'Thanh toán'" --> Fee
    Home -- "bấm 'Thêm học sinh mới +'" --> LinkStudent
    Home -- "bấm icon '?'" --> Help

    Picker -- "chọn 1 học sinh" --> Fee
    Picker -.-> TopUp
    Picker -.-> Spending
    Picker -.-> Timetable
    Picker -.-> Attendance
    Picker -.-> Absence
    Picker -.-> Homework
    Picker -.-> Results

    StudentHome -- "bấm 'Đổi'" --> Picker
    StudentHome -- "bấm icon tính năng" --> Fee
    StudentHome -.-> TopUp
    StudentHome -.-> Spending
    StudentHome -.-> Timetable
    StudentHome -.-> Attendance
    StudentHome -.-> Absence
    StudentHome -.-> Homework
    StudentHome -.-> Results
    StudentHome -- "CTA 'Nạp điểm vào thẻ'\n(nếu trường hỗ trợ)" --> TopUp

    Attendance -- "CTA 'Báo vắng'" --> Absence

    Fee -.->|"quay lại"| Home
    TopUp -.->|"'Trang chủ'"| Home
```

> Ghi chú: các mũi tên chấm (`-.->`) từ Picker/StudentHome tới từng tính năng đều dùng chung cơ chế "vào màn danh sách/chi tiết của tính năng với ngữ cảnh học sinh đã chọn". Icon trang 2 của Home (Học bạ số, Thực đơn, Hoạt động, Hóa đơn, Dặn thuốc, Bảng tin, Nhật ký chăm sóc) không có màn hình trong bộ ảnh tham chiếu nên không được vẽ chi tiết ở đây.

---

## 2. Luồng Đóng học phí

```mermaid
flowchart TD
    Start(["Bấm icon 'Đóng học phí'\nhoặc banner 'Thanh toán'"]) --> Picker{{"Chọn học sinh"}}
    Picker --> Check{"Học sinh đã có\nhoá đơn/nhà cung cấp\nliên kết chưa?"}

    Check -- "Chưa có" --> Provider["Modal: Chọn nhà cung cấp\n(ECO School / TheSSC / VinaID)"]
    Provider --> EnterCode["Hóa đơn học phí:\nnhập Mã học sinh"]
    EnterCode --> Invoice["Thông tin hóa đơn:\nchọn kỳ cần đóng"]

    Check -- "Đã có" --> Invoice

    Invoice --> Confirm["Bấm 'Xác nhận thanh toán'"]
    Confirm -.-> NoData(["(chưa có ảnh màn hình\nkết quả thanh toán)"])
```

---

## 3. Luồng Nạp điểm vào thẻ

```mermaid
flowchart TD
    Start(["Bấm icon 'Nạp điểm vào thẻ'"]) --> Picker{{"Chọn học sinh\n(chỉ hiện trường hỗ trợ)"}}
    Picker --> Amount["Thông tin nạp điểm:\nchọn mệnh giá / nhập số khác"]
    Amount --> Confirm["Xác nhận giao dịch:\nchọn ưu đãi + phương thức thanh toán"]
    Confirm --> Result["Kết quả giao dịch:\nthành công"]
    Result -- "'Trang chủ'" --> Home["Phụ huynh Homescreen"]
    Result -- "'Giao dịch mới'" --> Amount
```

---

## 4. Luồng Theo dõi điểm danh → Báo vắng

```mermaid
flowchart TD
    Start(["Bấm icon 'Theo dõi điểm danh'"]) --> Picker{{"Chọn học sinh"}}
    Picker --> Tabs["Theo dõi điểm danh"]
    Tabs -- "tab Điểm danh" --> Stats["Thống kê tháng + lịch tháng"]
    Tabs -- "tab Nhật ký" --> Log["Nhật ký hoạt động\n(hoặc rỗng)"]
    Stats -- "CTA 'Báo vắng'" --> List["Báo vắng: danh sách đơn"]

    List -- "CTA 'Tạo đơn báo vắng'" --> Form["Tạo đơn báo vắng\n(form)"]
    Form -- "Nộp đơn" --> Success["Modal: Xin phép vắng thành công"]
    Success -- "Đã hiểu" --> List
    List -- "lọc tab" --> ListFiltered["Tất cả / Chờ duyệt /\nĐã duyệt / Đã huỷ"]
```

---

## 5. Luồng Bài tập

```mermaid
flowchart TD
    Start(["Bấm icon 'Bài tập'"]) --> Picker{{"Chọn học sinh"}}
    Picker --> List["Bài tập: danh sách\n(Tất cả/Chưa nộp/Đã nộp/Đã chấm)"]

    List -- "chọn bài Chưa nộp" --> DetailNew["Chi tiết bài tập\n(chưa nộp, CTA 'Nộp bài tập')"]
    DetailNew -- "Nộp bài tập" --> Submit["Nội dung bài nộp:\nthêm Thư viện/Tài liệu"]
    Submit -- "Gửi bài tập" --> SuccessModal["Modal: Nộp bài thành công"]
    SuccessModal -- "Đã hiểu" --> List

    List -- "chọn bài Đã nộp/Đã chấm" --> DetailDone["Chi tiết bài tập\n(đã nộp, CTA 'Chỉnh sửa bài nộp')"]
    DetailDone -- "Chỉnh sửa bài nộp" --> EditSubmit["Nội dung bài nộp\n(CTA 'Cập nhật bài nộp')"]
    EditSubmit -- "Cập nhật bài nộp" --> DetailDone
```

---

## 6. Luồng Liên kết học sinh

```mermaid
flowchart TD
    Start(["Bấm 'Thêm học sinh mới +'\ntrên Phụ huynh Homescreen"]) --> Intro["Màn giới thiệu:\nhướng dẫn 3 bước"]
    Intro -- "Quét mã QR" --> QR(["(chưa có ảnh màn hình\nquét QR)"])
    Intro -- "Nhập thông tin" --> Modal["Modal: nhập Mã học sinh\n+ Mã bảo vệ"]
    Modal -- "Xác nhận" --> Done(["(chưa có ảnh màn hình\nkết quả liên kết)"])
    Intro -- "'Cấp lại thẻ'" --> Reissue(["(chưa có ảnh màn hình\ncấp lại thẻ)"])
```

---

## 7. Luồng Lịch sử chi tiêu / Thời khoá biểu / Kết quả học tập (dạng xem, không phân nhánh)

```mermaid
flowchart TD
    Start(["Bấm icon tính năng"]) --> Picker{{"Chọn học sinh"}}
    Picker --> Spending["Lịch sử chi tiêu:\nlọc theo ngày/3 tháng/6 tháng"]
    Spending -- "bấm banner thẻ" --> Picker

    Picker --> Timetable["Thời khoá biểu:\nảnh/tài liệu hoặc rỗng"]
    Timetable -- "'Tải xuống'" --> Download(["Tải file thời khoá biểu"])

    Picker --> Results["Kết quả học tập:\ntab Học kỳ I/II/Tổng kết"]
```

---

## 8. Luồng Hướng dẫn sử dụng

```mermaid
flowchart TD
    Start(["Bấm icon '?' trên\nPhụ huynh Homescreen"]) --> Guide["Hướng dẫn sử dụng Thẻ học sinh"]
    Guide -- "tab 'Kích hoạt thẻ mới'" --> T1["Hướng dẫn kích hoạt thẻ"]
    Guide -- "tab 'Nạp tiền vào thẻ'" --> T2["Hướng dẫn nạp tiền"]
    Guide -- "tab 'Theo dõi điểm danh'" --> T3["Hướng dẫn xem điểm danh"]
    Guide -- "tab 'Quản lý chi tiêu'" --> T4["Hướng dẫn xem chi tiêu"]
```
