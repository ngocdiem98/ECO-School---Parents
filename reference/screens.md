# Screens — EDU Parent (Phụ huynh) App
*Wireframe ASCII (46 cột), dựng lại theo đúng bố cục trong ảnh chụp màn hình thật ở `./reference`. Trạng thái status-bar (giờ, wifi, pin) được lược bỏ vì không thuộc bố cục nghiệp vụ.*

---

## 0. Component dùng chung: Bottom sheet "Danh sách học sinh"
*(nguồn: Bai tap_1, Bao vang_1, lich su chi tieu_3, nap diem vao the_1, v.v.)*

```
+--------------------------------------------+
| (nen mo, man hinh phia sau bi lam toi)      |
|                                              |
+--------------------------------------------+
|  Danh sach hoc sinh                    [X]  |
+--------------------------------------------+
|  Phan Khanh Vy          So du the           |
|  9192930059             12,000 diem         |
+--------------------------------------------+
|  Tran Dang Khoa         So du the           |
|  9192930072                  0 diem         |
+--------------------------------------------+
```
> Ghi chú: với tính năng "Nạp điểm vào thẻ", chỉ liệt kê học sinh thuộc trường có hỗ trợ (danh sách có thể chỉ còn 1 dòng).

---

## 1. Phụ huynh Homescreen — trang icon 1/2
*(nguồn: Phu huynh homescreen.PNG)*

```
+--------------------------------------------+
| (<)     ECO School Phu huynh          (?)   |
|      "The hoc sinh thong minh"  [artwork]   |
+--------------------------------------------+
| [Dong   ][Nap diem][Lich su ][Thoi khoa]    |
| [hoc phi][vao the ][chi tieu][bieu     ]    |
|                                              |
| [Theo doi][Bao vang][Bai tap][Ket qua ]     |
| [diem danh]        |         [hoc tap ]     |
|              . o                            |
+--------------------------------------------+
| Danh sach hoc sinh                          |
| +------------------------------------------+|
| | (o) Phan Khanh Vy                        ||
| |     9192930059                           ||
| |------------------------------------------||
| | Truong        Truong Mam non Demo        ||
| | Lop           Lop La                     ||
| | So du the             12,000 diem        ||
| +------------------------------------------+|
| +------------------------------------------+|
| | (o) Tran Dang Khoa                       ||
| |     9192930072                           ||
| |------------------------------------------||
| | Truong        Truong FINVIET             ||
| | Lop           Lop 10A1                   ||
| | So du the                  0 diem        ||
| +------------------------------------------+|
| [!] 4 hoa don cho thanh toan   Thanh toan-> |
| [      Them hoc sinh moi   +      ]         |
+--------------------------------------------+
```

## 1b. Phụ huynh Homescreen — trang icon 2/2 (vuốt sang phải)
*(nguồn: Phu huynh homescreen_vao tu the...PNG)*

```
+--------------------------------------------+
| (<)     ECO School Phu huynh          (?)   |
|      "The hoc sinh thong minh"  [artwork]   |
+--------------------------------------------+
| [Hoc ba ][Thuc  ][Hoat  ][Hoa don]          |
| [so     ][don   ][dong  ]                   |
|                                              |
| [Dan    ][Bang  ][Nhat ky]                  |
| [thuoc  ][tin   ][cham soc]                 |
|                  o .                        |
+--------------------------------------------+
| Danh sach hoc sinh                          |
|  ... (giong trang 1, khong doi) ...         |
+--------------------------------------------+
```
> Ghi chú: các icon ở trang 2 không có màn hình chi tiết trong ảnh tham chiếu.

---

## 2. Học sinh Homescreen
*(nguồn: Hoc sinh homescreen_Phan Khanh Vy.PNG)*

```
+--------------------------------------------+
| <        Hoc sinh                    (⚙)   |
+--------------------------------------------+
| (o) Phan Khanh Vy            [(2 Doi)]      |
|     9192930059                              |
|     Lop La                                  |
|     Truong Mam non Demo                     |
+--------------------------------------------+
| [id] So du the              12,000 diem     |
+--------------------------------------------+
| [Dong   ][Nap diem][Lich su ][Thoi khoa]    |
| [hoc phi][vao the ][chi tieu][bieu     ]    |
|                                              |
| [Theo doi][Bao vang][Bai tap][Ket qua ]     |
| [diem danh]                  [hoc tap ]     |
|              . o                            |
+--------------------------------------------+
| Hoat dong gan day                           |
| [v] Nap tien                    +1,000 diem |
|     10/07/2026 - 09:41                      |
| [i] Them lien ket hoc sinh Phan Khanh Vy |   |
|     9192930059 - 10/07/2026 - 09:29         |
| [i] Da kich hoat the hoc sinh Phan Khanh Vy  |
|     10/07/2026 - 09:29                      |
| [i] Da huy lien ket the hoc sinh Phan..      |
|     10/07/2026 - 09:29                      |
+--------------------------------------------+
| [        Nap diem vao the (CTA vang)      ] |
+--------------------------------------------+
```
> Với học sinh mà trường không hỗ trợ nạp điểm (vd Trần Đăng Khoa), CTA đáy trang bị disable (xám, không bấm được) và icon "Nạp điểm vào thẻ" trong lưới cũng bị làm mờ.

---

## 3. Đóng học phí — Chọn nhà cung cấp (modal)
*(nguồn: dong hoc phi 1_neu chua co hoa don hoc sinh.PNG)*

```
+--------------------------------------------+
|          Chon nha cung cap           [X]    |
+--------------------------------------------+
| ( Q  Tim kiem nha cung cap             )    |
+--------------------------------------------+
| +------------------------------------------+|
| | [finviet]         ECO School             ||
| +------------------------------------------+|
| +------------------------------------------+|
| | [SSC]              TheSSC                ||
| +------------------------------------------+|
| +------------------------------------------+|
| | [VinaID]            VinaID               ||
| +------------------------------------------+|
+--------------------------------------------+
```

## 4. Đóng học phí — Hóa đơn học phí (nhập mã HS)
*(nguồn: dong hoc phi 2_neu chua co hoa don hoc sinh.PNG)*

```
+--------------------------------------------+
| <        Hoa don hoc phi                    |
+--------------------------------------------+
| [finviet] ECO School            Thay doi -> |
+--------------------------------------------+
| Thong tin hoc sinh                          |
| ( Ma hoc sinh_________________________ )    |
+--------------------------------------------+
| Hoa don da luu                              |
| [#] ECO School                              |
|     Tran Dang Khoa                          |
|     9192930072                              |
+--------------------------------------------+
| Hoa don mau                                 |
| +------------------------------------------+|
| | [finviet]   PHIEU BAO THU TIEN    [QR]   ||
| | Truong Finviet                           ||
| | Ten hoc sinh: Nguyen Van A               ||
| | Ma hoc sinh: 9192931210 <-- (o day)      ||
| | Lop 11A1   Ky phi: 04/2026                ||
| | STT | Noi dung | Thanh tien | Ghi chu    ||
| +------------------------------------------+|
+--------------------------------------------+
| [         Tiep tuc (disabled)            ]  |
+--------------------------------------------+
```

## 5. Đóng học phí — Thông tin hóa đơn (đã có liên kết, nhóm theo tháng)
*(nguồn: dong hoc phi 1_neu da co hoa don hoc sinh_Tran Dang Khoa.PNG)*

```
+--------------------------------------------+
| <       Thong tin hoa don                   |
+--------------------------------------------+
| Thong tin hoc sinh                          |
| [id] Tran Dang Khoa                         |
| [#]  9192930072                             |
| [c]  Lop 10A1                                |
| [p]  Truong FINVIET                          |
|----------------------------------------------|
| Ten dich vu        Thanh toan hoc phi        |
| Nha cung cap                 ECO School      |
+--------------------------------------------+
| Hoa don chua thanh toan (4)                 |
| Chon ky thanh toan                          |
| +------------------------------------------+|
| |[ ] Hoa don thang 6/2026    1,355,000d [^]||
| |  [ ] Hoc phi 06/2026            200,000d ||
| |  [ ] Tien an thang 06/2026      875,000d ||
| |  [ ] Hoc lieu Lich su           280,000d ||
| +------------------------------------------+|
| +------------------------------------------+|
| |[ ] Hoa don thang 7/2026    1,426,000d [^]||
| |  [ ] Hoc phi 07/2026            200,000d ||
| |  [ ] Tien an thang 07/2026      945,000d ||
| |  [ ] Hoc lieu Lich su           280,000d ||
| +------------------------------------------+|
+--------------------------------------------+
| Tong tien: 0d      [ Xac nhan thanh toan ]  |
+--------------------------------------------+
```

---

## 6. Nạp điểm vào thẻ — Thông tin nạp điểm
*(nguồn: nap diem vao the 2.PNG)*

```
+--------------------------------------------+
| <        Thong tin nap diem                 |
+--------------------------------------------+
| |             [artwork the]                 |
| |       Nap diem the hoc sinh                |
| |--------------------------------------------|
| | [p] Thong tin hoc sinh                     |
| |     Phan Khanh Vy                          |
| |     9192930059                             |
+--------------------------------------------+
| So diem nap                                 |
| [ 10,000 ][ 20,000 ][ 50,000 (*chon*) ]     |
| [100,000 ][200,000 ][500,000         ]      |
|          Nhap so diem khac (edit)           |
+--------------------------------------------+
| Tien ich                                    |
| [i] Kich hoat nap diem tu dong          ->  |
+--------------------------------------------+
| Tong diem: 50,000        [   Xac nhan   ]   |
+--------------------------------------------+
```

## 7. Nạp điểm vào thẻ — Xác nhận giao dịch
*(nguồn: nap diem vao the 3.PNG)*

```
+--------------------------------------------+
| <        Xac nhan giao dich                 |
+--------------------------------------------+
|              (o)                             |
|          Tong thanh toan                     |
|            50,000d                           |
|      [ Nap diem the hoc sinh ]                |
|----------------------------------------------|
| Ma hoc sinh                     9192930059    |
| Ten hoc sinh                  Phan Khanh Vy   |
| So tien                            50,000d    |
+--------------------------------------------+
| [$] Uu dai ECO Me           Chon uu dai ->  |
+--------------------------------------------+
| [$] Chon phuong thuc thanh toan  Xem them-> |
| +------------------------------------------+|
| | [ECO]  Vi ECO            42,069d          ||
| |        So du vi khong du   [Nap tien]     ||
| +------------------------------------------+|
| +------------------------------------------+|
| | [TCB]  Techcombank •••• 2939       (o)    ||
| +------------------------------------------+|
+--------------------------------------------+
| [            Tiep tuc              ]        |
+--------------------------------------------+
```

## 8. Nạp điểm vào thẻ — Kết quả giao dịch
*(nguồn: nap diem vao the 4_success.PNG)*

```
+--------------------------------------------+
|          Ket qua giao dich                   |
+--------------------------------------------+
| +------------------------------------------+|
| |              (check xanh)                ||
| |          Giao dich thanh cong            ||
| |              1,000d                       ||
| |       [ Nap diem the hoc sinh ]            ||
| |--------------------------------------------|
| | Ma giao dich              285986529 ->     ||
| | Thoi gian giao dich  10:30 10/07/2026      ||
| | Thong tin dich vu                          ||
| | Ma hoc sinh                 9192930059     ||
| | Ten hoc sinh              Phan Khanh Vy    ||
| |                 Chia se <share>            ||
| +------------------------------------------+|
| [i] Kich hoat nap tien HS tu dong    [Kich  |
|     Khong lo doan sinh hoat truong  hoat ngay|
+--------------------------------------------+
| Dung bo lo                                  |
| [DT trå sau][BH xe may][BH o to]            |
| an toan bao mat 66,000d    480,700d          |
+--------------------------------------------+
| [   Trang chu   ][   Giao dich moi   ]      |
+--------------------------------------------+
```

---

## 9. Lịch sử chi tiêu
*(nguồn: lich su chi tieu_2.PNG)*

```
+--------------------------------------------+
| <        Lich su chi tieu                   |
+--------------------------------------------+
| +------------------------------------------+|
| | Phan Khanh Vy                        ->  ||
| | 9192930059                                ||
| +------------------------------------------+|
+--------------------------------------------+
| Loc theo  [Chon ngay v] [3 thang*][6 thang] |
+--------------------------------------------+
| Nhat ky                                     |
| [Tien vao: 12,000 diem][Tien ra: 0 diem]    |
+--------------------------------------------+
| [v] Nap tien              +1,000 diem       |
|     10/07/2026 - 09:41                      |
| [v] Nap tien              +5,000 diem       |
|     02/07/2026 - 13:52                      |
| [v] Nap tien              +1,000 diem       |
|     27/05/2026 - 14:18                      |
| [v] Nap tien              +5,000 diem       |
|     17/05/2026 - 16:04                      |
+--------------------------------------------+
```

---

## 10. Thời khoá biểu — trạng thái rỗng
*(nguồn: thoi khoa bieu_2_Phan Khanh Vy.PNG)*

```
+--------------------------------------------+
| <        Thoi khoa bieu                     |
+--------------------------------------------+
| (o) Phan Khanh Vy             [(2 Doi)]     |
|     9192930059                              |
|     Lop La                                  |
|     Truong Mam non Demo                     |
+--------------------------------------------+
|                                              |
|              [icon rong]                    |
|            Chua co thong tin                |
|                                              |
+--------------------------------------------+
```

## 11. Thời khoá biểu — có dữ liệu (dạng tài liệu ảnh)
*(nguồn: thoi khoa bieu_2_Tran Dang Khoa.PNG)*

```
+--------------------------------------------+
| <        Thoi khoa bieu                     |
+--------------------------------------------+
| (o) Tran Dang Khoa            [(2 Doi)]     |
|     9192930072                              |
|     Lop 10A1                                |
|     Truong FINVIET                          |
+--------------------------------------------+
| [#] Thoi gian: 01/01/2026 - 16/05/2026       |
+--------------------------------------------+
| +------------------------------------------+|
| |                                            ||
| |     [ anh/tai lieu thoi khoa bieu ]        ||
| |                                            ||
| +------------------------------------------+|
+--------------------------------------------+
|            [v] Tai xuong                     |
+--------------------------------------------+
```

---

## 12. Theo dõi điểm danh — tab "Điểm danh"
*(nguồn: Theo doi diem danh_2_Tab Diem danh.PNG)*

```
+--------------------------------------------+
| <     Theo doi diem danh                    |
+--------------------------------------------+
| (o) Phan Khanh Vy              [(2 Doi)]    |
|     9192930059                              |
|     Lop La                                  |
|     Truong Mam non Demo                     |
+--------------------------------------------+
|  Nhat ky        [ Diem danh (*) ]           |
+--------------------------------------------+
| [#] Thong ke thang 7                        |
| [v] Co mat: 0        [i] Vang co phep: 0    |
| [x] Vang khong phep:0 [t] Den muon: 0       |
+--------------------------------------------+
| Thang 7, 2026                    <    >     |
| T2  T3  T4  T5  T6  T7  CN                  |
| 29  30   1   2   3   4   5                  |
|  6   7   8   9  10* 11  12                  |
| 13  14  15  16  17  18  19                  |
| 20  21  22  23  24  25  26                  |
| 27  28  29  30  31                          |
+--------------------------------------------+
| [             Bao vang               ]      |
+--------------------------------------------+
```

## 13. Theo dõi điểm danh — tab "Nhật ký" (rỗng)
*(nguồn: Theo doi diem danh_2_Tab Nhat ky.PNG)*

```
+--------------------------------------------+
| <     Theo doi diem danh                    |
+--------------------------------------------+
| (o) Phan Khanh Vy              [(2 Doi)]    |
|     9192930059                              |
|     Lop La                                  |
|     Truong Mam non Demo                     |
+--------------------------------------------+
|  [ Nhat ky (*) ]        Diem danh           |
+--------------------------------------------+
| Hoat dong gan day                           |
|                                              |
|              [icon rong]                    |
|            Chua co thong tin                |
|                                              |
+--------------------------------------------+
```

---

## 14. Báo vắng — danh sách
*(nguồn: Bao vang_4_Review.PNG)*

```
+--------------------------------------------+
| <          Bao vang                         |
+--------------------------------------------+
| (o) Tran Dang Khoa             [(2 Doi)]    |
|     9192930072                              |
|     Lop 10A1                                |
|     Truong FINVIET                          |
+--------------------------------------------+
| [Tat ca*][Cho duyet][Da duyet][Da huy]      |
+--------------------------------------------+
| +------------------------------------------+|
| | 10/07/2026 - 10/07/2026     Cho duyet    ||
| |------------------------------------------||
| | Thoi gian nghi              Ca ngay      ||
| | So ngay nghi                    1 ngay   ||
| | Noi dung                    con xin nghi ||
| +------------------------------------------+|
| +------------------------------------------+|
| | 25/06/2026 - 27/06/2026        Da huy    ||
| |------------------------------------------||
| | Thoi gian nghi            Buoi sang      ||
| | So ngay nghi                    3 ngay   ||
| | Noi dung           Con xin nghi phep     ||
| +------------------------------------------+|
+--------------------------------------------+
| [        Tao don bao vang            ]      |
+--------------------------------------------+
```

## 15. Báo vắng — Tạo đơn (form)
*(nguồn: Bao vang_3_Tao don.PNG)*

```
+--------------------------------------------+
| <       Tao don bao vang                    |
+--------------------------------------------+
| (o) Tran Dang Khoa                          |
|     9192930072                              |
|     Lop 10A1                                |
|     Truong FINVIET                          |
+--------------------------------------------+
| Hom nay, ngay 10/07/2026                     |
+--------------------------------------------+
| Thoi gian nghi                              |
| [(=) Ca ngay*][ (o) Buoi sang][(^) Bch]     |
+--------------------------------------------+
| [Tu ngay  10/07/2026  #] [Den ngay 10/07 #]  |
+--------------------------------------------+
| Ghi chu                                     |
| +------------------------------------------+|
| | Noi dung *                                ||
| |                                            ||
| |                                     0/256 ||
| +------------------------------------------+|
+--------------------------------------------+
| Anh dinh kem            Toi da 10 anh 0/10  |
| +--------+                                  |
| | [img]  |                                  |
| |Thu vien|                                  |
| +--------+                                  |
+--------------------------------------------+
| [         Nop don (disabled)          ]     |
+--------------------------------------------+
```

## 16. Báo vắng — Modal thành công
*(nguồn: Bao vang_3_tao don thanh cong.PNG)*

```
+--------------------------------------------+
| (nen form Tao don bao vang, bi lam toi)     |
|                                              |
|   +------------------------------------+     |
|   |          Thanh cong                |     |
|   |    Xin phep vang thanh cong        |     |
|   |                                     |     |
|   |   [        Da hieu        ]        |     |
|   +------------------------------------+     |
|                                              |
+--------------------------------------------+
```

---

## 17. Bài tập — danh sách
*(nguồn: Bai tap_2.PNG)*

```
+--------------------------------------------+
| <           Bai tap                         |
+--------------------------------------------+
| (o) Tran Dang Khoa             [(2 Doi)]    |
|     9192930072                              |
|     Lop 10A1                                |
|     Truong FINVIET                          |
+--------------------------------------------+
| [Tat ca*][Chua nop][Da nop][Da cham]        |
+--------------------------------------------+
| +------------------------------------------+|
| | GDQP-AN                       Da cham   ||
| | Tinh toan                                ||
| |------------------------------------------||
| | Diem: 10       00:00|13/06/2026 Phung..  ||
| +------------------------------------------+|
| +------------------------------------------+|
| | Toan                          Chua nop   ||
| | Bai tap nho                               ||
| |------------------------------------------||
| | 14:40|29/05/2026 (Qua han)   Phung Thi Thu||
| +------------------------------------------+|
|                                              |
|        Ban da xem het bai tap               |
+--------------------------------------------+
```

## 18. Bài tập — Chi tiết (chưa nộp)
*(nguồn: Bai tap_3_Nop bai tap.PNG)*

```
+--------------------------------------------+
| <        Chi tiet bai tap                   |
+--------------------------------------------+
| [!] Luu y: Bai tap da qua han nop bai       |
+--------------------------------------------+
| +------------------------------------------+|
| | Nhan xet cua Giao vien                    ||
| |--------------------------------------------|
| | Mon: Toan                       Chua nop  ||
| | Giao vien: Phung Thi Thu                   ||
| |--------------------------------------------|
| | Diem   | Nhan xet                          ||
| |   -    | Chua co nhan xet                  ||
| +------------------------------------------+|
+--------------------------------------------+
| Ngay giao                        26/05/2026  |
| Han nop                    14:40 29/05/2026  |
+--------------------------------------------+
| Bai tap nho                                 |
| +------------------------------------------+|
| | Noi dung bai tap:        Xem chi tiet ->  ||
| | Kiem tra chu de                           ||
| |--------------------------------------------|
| | Tai lieu dinh kem:                        ||
| |   [ hinh anh dinh kem ]                   ||
| +------------------------------------------+|
+--------------------------------------------+
| [           Nop bai tap               ]     |
+--------------------------------------------+
```

## 19. Bài tập — Nội dung bài nộp (nộp mới)
*(nguồn: Bai tap_4_Gui bai tap.PNG)*

```
+--------------------------------------------+
| <        Noi dung bai nop                   |
+--------------------------------------------+
| Tai lieu dinh kem                           |
| +------------------------------------------+|
| |  [ preview tep da chon ]           (X)   ||
| +------------------------------------------+|
+--------------------------------------------+
|                                              |
|          ( vung ghi chu / nhap )            |
|                                              |
+--------------------------------------------+
| Da chon (1) tep                             |
| [ (img) Thu vien ] [ (doc) Tai lieu ]       |
+--------------------------------------------+
| [           Gui bai tap               ]     |
+--------------------------------------------+
```

## 20. Bài tập — Modal nộp thành công
*(nguồn: Bai tap_5_Gui bai tap thanh cong.PNG)*

```
+--------------------------------------------+
| (nen man Noi dung bai nop, bi lam toi)      |
|                                              |
|   +------------------------------------+     |
|   |        Nop bai thanh cong          |     |
|   |   Hoc sinh nop bai thanh cong      |     |
|   |                                     |     |
|   |   [        Da hieu        ]        |     |
|   +------------------------------------+     |
|                                              |
+--------------------------------------------+
```

## 21. Bài tập — Chi tiết (đã nộp / review)
*(nguồn: Bai tap_6_Review lai bai da nop.PNG)*

```
+--------------------------------------------+
| <        Chi tiet bai tap                   |
+--------------------------------------------+
| +------------------------------------------+|
| | Nhan xet cua Giao vien                    ||
| |--------------------------------------------|
| | Mon: Toan                         Da nop  ||
| | Giao vien: Phung Thi Thu                   ||
| |--------------------------------------------|
| | Diem   | Nhan xet                          ||
| |   -    | Chua co nhan xet                  ||
| +------------------------------------------+|
+--------------------------------------------+
| Ngay giao                        26/05/2026  |
| Han nop                    14:40 29/05/2026  |
+--------------------------------------------+
| Bai tap nho                                 |
| +------------------------------------------+|
| | Noi dung bai tap:        Xem chi tiet ->  ||
| | Kiem tra chu de                           ||
| |--------------------------------------------|
| | Tai lieu dinh kem:                        ||
| |   [ hinh anh dinh kem ]                   ||
| |--------------------------------------------|
| | Noi dung bai nop:         Xem chi tiet -> ||
| +------------------------------------------+|
+--------------------------------------------+
| [        Chinh sua bai nop            ]     |
+--------------------------------------------+
```

## 22. Bài tập — Chỉnh sửa bài nộp
*(nguồn: Bai tap_7_Cap nhat lai bai nop moi.PNG — giống màn #19, khác CTA)*

```
+--------------------------------------------+
| <        Noi dung bai nop                   |
+--------------------------------------------+
| Tai lieu dinh kem                           |
| +------------------------------------------+|
| |  [ preview tep da chon ]           (X)   ||
| +------------------------------------------+|
+--------------------------------------------+
|                                              |
|          ( vung ghi chu / nhap )            |
|                                              |
+--------------------------------------------+
| Da chon (1) tep                             |
| [ (img) Thu vien ] [ (doc) Tai lieu ]       |
+--------------------------------------------+
| [         Cap nhat bai nop            ]     |
+--------------------------------------------+
```

---

## 23. Kết quả học tập
*(nguồn: Ket qua hoc tap_2.PNG)*

```
+--------------------------------------------+
| <        Ket qua hoc tap                    |
+--------------------------------------------+
| (o) Tran Dang Khoa             [(2 Doi)]    |
|     9192930072                              |
|     Lop 10A1                                |
|     Truong FINVIET                          |
+--------------------------------------------+
| [#] Nam hoc 2025-2026                        |
+--------------------------------------------+
| [Hoc ky I*][ Hoc ky II ][  Tong ket  ]      |
+--------------------------------------------+
| Tong ket hoc ky                             |
| +------------------------------------------+|
| | Danh muc          | Hoc ky I             ||
| |------------------------------------------||
| | Ket qua hoc tap    |         --           ||
| | Ket qua hanh vi     |         --           ||
| | So ngay nghi        |         --           ||
| +------------------------------------------+|
| Ghi chu: T:Tot,K:Kha,D:Dat,CD:Chua dat       |
|          G:Gioi,TT:Tien tien,XS:Xuat sac    |
+--------------------------------------------+
| Ket qua hoc tap                             |
| +------------------------------------------+|
| |Mon hoc | DDGTX | DD GK | ...  (cuon ngang)||
| |--------------------------------------------|
| |Ngu Van |  --   |  --   |                  ||
| |Toan    |  --   |  --   |                  ||
| |Ngoai ngu 1| -- |  --   |                  ||
| +------------------------------------------+|
+--------------------------------------------+
```

---

## 24. Liên kết học sinh — Màn giới thiệu
*(nguồn: Lien ket HS_Lien ket moi.PNG)*

```
+--------------------------------------------+
| <         [artwork banner]                  |
|        "The hoc sinh thong minh"            |
+--------------------------------------------+
|            [ minh hoa the + QR ]            |
+--------------------------------------------+
| Quet hoac nhap thong tin hoc sinh de        |
| lien ket                                    |
|                                              |
| (1) Buoc 1: Nhap ma hoc sinh va ma bao ve   |
|     hoac quet ma QR tren the hoc sinh.      |
| (2) Buoc 2: Kiem tra thong tin hoc sinh.    |
| (3) Buoc 3: Nhan "Xac nhan" de hoan tat.    |
+--------------------------------------------+
| [          Quet ma QR (chinh)         ]     |
| [          Nhap thong tin              ]     |
+--------------------------------------------+
| Ban lam hong, mat the, Cap lai the           |
+--------------------------------------------+
```

## 25. Liên kết học sinh — Modal nhập mã
*(nguồn: Lien ket HS_Nhap ma HS va ma bao ve.PNG)*

```
+--------------------------------------------+
| (nen man gioi thieu, bi lam toi)            |
+--------------------------------------------+
|   Kich hoat lien ket hoc sinh        [X]    |
|----------------------------------------------|
|   Vui long lien he Hotline 1900 9005 de      |
|   duoc ho tro cung cap ma bao ve             |
|                                              |
|   ( Ma hoc sinh_________________________ )  |
|   ( Ma bao ve___________________________ )  |
|                                              |
|   [       Xac nhan (disabled)          ]    |
+--------------------------------------------+
```

---

## 26. Hướng dẫn sử dụng
*(nguồn: Huong dan 1..4)*

```
+--------------------------------------------+
| <   Huong dan su dung The hoc sinh          |
+--------------------------------------------+
| [Kich hoat][Nap tien ][Theo doi][Quan ly]   |
| [the moi* ][vao the  ][diem danh][chi tieu] |
|          (tab cuon ngang duoc)              |
+--------------------------------------------+
|         [  Kich hoat the moi  ]             |
+--------------------------------------------+
|  +----------------+  +----------------+     |
|  | [mock dien     |  | [mock dien     |     |
|  |  thoai buoc 1] |  |  thoai buoc 2] |     |
|  +----------------+  +----------------+     |
|         (1)                  (2)            |
|   Chon muc kich       Chon quet ma           |
|   hoat the moi        kich hoat              |
|                                              |
|  +----------------+  +----------------+     |
|  | [mock buoc 3]  |  | [mock buoc 4]  |     |
|  +----------------+  +----------------+     |
+--------------------------------------------+
```
> Cấu trúc lặp lại tương tự cho 3 tab còn lại (Nạp tiền vào thẻ, Theo dõi điểm danh, Quản lý chi tiêu), chỉ khác nội dung mockup và chú thích từng bước.
