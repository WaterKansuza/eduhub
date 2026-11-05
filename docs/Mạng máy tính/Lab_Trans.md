# 1.5.7 Packet Tracer - Network Representation
(Cấu trúc liên kết mạng / Mô hình mạng)
## Các mục tiêu:
- Mô hình mạng trong hoạt động này là sự kết hợp của nhiều công nghệ mà bạn sẽ được nắm vững trong khóa học CCNA. Mô hình biểu diễn phiên bản đơn giản hóa cách mà mạng lưới doanh nghiệp vừa và nhỏ có thể trông như thề nào. Bạn có thể tự mình khám phá mạng lưới này theo ý muốn của bạn. Khi bạn sẵn sàng, hãy thực hiện các bước bên dưới và trả lời các câu hỏi được giao.

**Note**: Bạn không cần quá trú tâm về việc bạn có hiểu tất cả những thứ bạn thấy và bạn làm trong hoạt động này. Hãy tự do khám phá mạng lưới theo cách của bạn. Trả lời các câu hỏi bằng khả năng tốt nhất của bạn.

## Hướng dẫn
### Bước 1: Nhận dạng các thành phần phổ biến của một mạng máy tính như đã được trình bày ở trong App Packet Tracer.
-Thanh công cụ biểu tưởng ở góc dưới bên trái có vô số loại thành phần mạng khác nhau. Bạn có thể thấy các doanh mục tương ứng với các thiết bị trung gian (intermediary devices), thiết bị đầu cuối (end devices), và phương tiện truyền dẫn (media). Danh mục Các cổng kết nối (Connections) (Có biểu tượng tia sét) biểu diễn cho các phương tiện kết nối mà được Packet Tracer cung cấp. Ngoài ra còn có danh mục Các Thiết bị đầu cuối (End Devices) và hai danh mục đặc thù đối với Packet Tracer: Tự tùy chỉnh thiết bị (Custom Made Devices) và Kết nối đa người dùng (Multiuser Connection).
Danh sách danh mục thiết bị trung gian (intermediary).

[?] Nếu không xét những gì nằm bên trong điện toán đám mây (internet cloud) hoặc mạng nội bộ trên nền tảng đám mây (Intranet Cloud), có bao nhiêu biểu tượng trong sơ đồ mạng đại diện cho các thiết bị đầu cuối (chỉ có duy nhất một kết nối dẫn đến chúng)?

*Đáp án:* 15 biểu tượng.
- Home Office: 4 thiết bị:
    HomeDesktop, HomeLaptop, Inkjet, Tablet đều chỉ nối vào WRS (kể cả đường không dây nét đứt).
    Modem không đếm vì nối với WRS và đám mây Internet (2 kết nối).
- Central: 5 thiết bị:
    CentralServer (chỉ nối S3).
    PC1, PC2 (nối S1) và PC3, PC4 (nối S2).
- Branch: 6 thiết bị:
    BranchServer, Laser, Smart Phone, Guest.
    Sales và Accounting (PC), mỗi máy chỉ nối vào điện thoại IP của nó.
    IP Phone0 và IP Phone1 không đếm vì mỗi cái nối với S4 và với PC (2 kết nối).

[?] Có bao nhiêu thiết bị đầu cuối **không** phải máy tính để bàn?

*Đáp án:* 8 thiết bị

[?] Có bao nhiêu phương tiện kết nối đã được sử dụng ở sơ đồ mạng này?

*Đáp án:* 4

- Đường đen liền (dây đồng): nối switch, router, PC, server, máy in, v.v. Đây là kiểu phổ biến nhất trong sơ đồ.
- Đường đen nét đứt (không dây): HomeLaptop, Tablet, Smart Phone và Guest nối vào WRS hoặc Wireless AP.
- Đường đỏ ngoằn ngoèo (WAN): nối R2 với Internet, R4 với Internet, và R2 với R4 qua Intranet.
- Đường xanh ngoằn ngoèo (WAN): nối Modem với đám mây Internet. Kiểu này khác với đường đỏ nên được tính là một loại riêng.

### Bước 2: Giải thích mục đích của các thiết bị.
a. Trong ứng dụng Packet Tracer, chỉ có thiết bị Server-PT mới có thể đóng vai trò là một máy chủ (server). Máy tính để bàn (Desktop) hay Máy tính xách tay cá nhân (Laptop PCs) không thể được coi như một máy chủ. Dựa theo những gì bạn được học, hãy giải thích về mô hình client-server (máy khách-máy chủ).
b. Hãy liệt kê ít nhất 2 chức năng của các thiết bị trung gian.
c. Hãy liệt kê ít nhất hai tiêu chí lựa chọn loại phương tiện truyền dẫn mạng.

*Đáp án:*

a. Mô hình máy khách-máy chủ (client-server)

Trong mô hình này, các thiết bị đầu cuối (host) chia làm hai vai trò:

- **Máy chủ (server):** chạy phần mềm máy chủ (web, email, file, DNS, DHCP...), luôn sẵn sàng **cung cấp** thông tin và dịch vụ cho các thiết bị khác.
- **Máy khách (client):** chạy phần mềm máy khách (trình duyệt web, ứng dụng email...), **gửi yêu cầu** đến máy chủ rồi nhận và hiển thị thông tin trả về.

**Ví dụ:** PC (client) mở trình duyệt và gõ địa chỉ một trang web. PC gửi yêu cầu đến web server, server trả về nội dung trang, trình duyệt hiển thị cho người dùng.

**Vì sao trong Packet Tracer chỉ Server-PT làm được máy chủ?** Server-PT có tab **Services** để bật và cấu hình các dịch vụ như HTTP, DNS, DHCP, FTP, Email. Desktop và Laptop chỉ có phần mềm máy khách nên chỉ đóng vai trò client.

b. Chức năng của các thiết bị trung gian

- Kết nối các thiết bị đầu cuối vào mạng và kết nối nhiều mạng với nhau.
- Tái tạo và truyền lại tín hiệu dữ liệu.
- Duy trì thông tin về các đường đi có trong mạng.
- Chuyển hướng dữ liệu sang đường khác khi một liên kết bị hỏng.
- Thông báo cho các thiết bị khác về lỗi và sự cố truyền thông.
- Phân loại và chuyển tiếp dữ liệu theo mức ưu tiên (QoS).
- Cho phép hoặc chặn luồng dữ liệu theo chính sách bảo mật.

c. Tiêu chí lựa chọn loại phương tiện truyền dẫn mạng

- **Khoảng cách tối đa** mà phương tiện truyền được tín hiệu một cách đáng tin cậy.
- **Môi trường lắp đặt** (trong nhà hay ngoài trời, có nhiễu điện từ hay không).
- **Lượng dữ liệu và tốc độ truyền** (băng thông) cần đáp ứng.
- **Chi phí** của phương tiện và chi phí lắp đặt.

### Bước 3: So sánh và đối chiếu mạng LAN và mạng WAN.
Câu hỏi:
a. Giải thích sự khác nhau giữa mạng LAN và mạng WAN. Cho ví dụ về mỗi loại.
b. Trong mạng Packet Tracer này, bạn thấy có bao nhiêu mạng WAN?
c. Bạn thấy có bao nhiêu mạng LAN?
d. Internet trong mạng Packet Tracer này được đơn giản hóa quá mức và không thể hiện cấu trúc, hình thức của Internet thực tế. Hãy mô tả ngắn gọn về Internet.
e. Người dùng gia đình thường kết nối Internet bằng những cách phổ biến nào?
f. Các doanh nghiệp ở khu vực của bạn thường dùng những phương pháp nào để kết nối Internet?

*Đáp án:*

a. Sự khác nhau giữa LAN và WAN

- **LAN (Local Area Network, mạng cục bộ):** phủ một khu vực địa lý nhỏ như nhà, văn phòng, trường học, tòa nhà. Thường do một cá nhân hoặc một tổ chức sở hữu và quản lý, tốc độ cao.
  - Ví dụ: mạng Wi-Fi trong nhà, mạng máy tính của một phòng thực hành, mạng văn phòng công ty.
- **WAN (Wide Area Network, mạng diện rộng):** phủ một khu vực địa lý rất lớn, nối nhiều LAN ở xa nhau (giữa các thành phố, quốc gia). Thường do nhà cung cấp dịch vụ (ISP) sở hữu, doanh nghiệp phải thuê lại.
  - Ví dụ: Internet, mạng nối trụ sở chính với chi nhánh ở thành phố khác.

b. Số mạng WAN

- Trong sơ đồ có **2 mạng WAN**: đám mây **Internet** và đám mây **Intranet**.
- Chúng được nối với các LAN bằng các đường đỏ và xanh ngoằn ngoèo.

c. Số mạng LAN

- Có **3 mạng LAN**: **Home Office**, **Central** và **Branch** (mỗi khu vực nằm trong một khung riêng).

d. Mô tả về Internet

- Internet là mạng toàn cầu gồm vô số mạng nhỏ hơn (của ISP, doanh nghiệp, trường học, chính phủ...) kết nối với nhau.
- Không ai sở hữu hay kiểm soát toàn bộ Internet. Nó vận hành nhờ các giao thức chung (như TCP/IP) và các tổ chức tiêu chuẩn.
- Các mạng được nối với nhau qua nhiều tuyến cáp (gồm cả cáp quang biển), vệ tinh và thiết bị định tuyến, nên dữ liệu có thể đi nhiều đường khác nhau để đến đích.

e. Cách người dùng gia đình kết nối Internet

- Cáp quang (FTTH)
- Cáp truyền hình (cable)
- DSL
- Mạng di động (3G/4G/5G)
- Vệ tinh
- Quay số (dial-up, đã rất ít dùng)

f. Cách doanh nghiệp kết nối Internet

- Đường thuê riêng (leased line) bằng cáp quang
- Metro Ethernet
- DSL doanh nghiệp (như SDSL)
- Cáp quang dùng chung gói dành cho doanh nghiệp
- Vệ tinh (ở vùng khó kéo cáp)
- Ở Việt Nam, phổ biến là các gói cáp quang doanh nghiệp của VNPT, Viettel, FPT.

## Câu hỏi thử thách
Giờ đây, bạn đã có cơ hội để khám phá mạng lưới được biểu diễn bên trong hoạt động của Packet Tracer, bạn có thể đã có được một vài kĩ năng mà bạn sẽ muốn được áp dụng. Hoặc bạn muốn có cơ hội để khám phá mạng lưới này xâu hơn. Việc nhận ra rằng đa số những gì bạn thấy và trải nghiệm trong Packet Tracer đang vượt quá trình độ kỹ năng của bạn, đây là một vài thử thách mà bạn có thể muốn được thử. Đừng lo về việc bạn có thể không làm được tất cả. Chẳng bao lâu nữa, bạn sẽ thuần thục trong việc sử dụng Packet Tracer và trở thành là một chuyên gia thiết kế mạng. 

    - Thêm một thiết bị đầu cuối vào sơ đồ mạng và kết nối nó tới một trong các mạng LAN sử dụng một phương tiện kết nối. Còn điều gì khác mà thiết bị này cần để truyền dữ liệu tới những người dùng cuối khác? Liệu bạn có thể cung cấp thông tin? Liệu có cách nào để xác thực rằng bạn đã kết nối tới đúng thiết bị?
    - Thêm một thiết bị trung gian mới tới một trong các mạng lưới và kết nối nó tới một trong các mạng LAN hoặc mạng WAN sử dụng một phương tiện kết nối. Còn điều gì khác mà thiết bị này cần để đóng vai trò là một trung gian để trung chuyển tới các thiết bị khác ở bên trong mạng lưới không?
    - Hãy mở một cửa sổ mới của Packet Tracer. Tạo một mạng lưới mới với ít nhất 2 mạng LAN được kết nối với WAN. Kết nối tất cả các thiết bị. Hãy xem lại hoạt động Packet Tracer ban đầu để biết bạn có thể cần thực hiện thêm những gì nhằm giúp cho mạng mới của bạn có thể hoạt động được. Bạn hãy quay trở lại mạng lưới bạn mới tạo sau khi bạn đã thuần thục nhiều kỹ năng hơn trong tương lai nhé!

# Các từ tiếng anh
- Topology: hình học tô pô, 

    **Toán học**: là ngành nghiên cứu các tính chất của không gian được bảo toàn qua các phép biến dạng liên tục nhưng không bị xé rách hay dán dính. 

    Trong **công nghệ thông tin**: là cấu trúc liên kết hoặc cấu hình mạng, mô tả cách các thiết bị (node) được sắp xếp và kết nối với nhau trong một hệ thống mạng máy tính.

- Intermediary: Trung gian. 
