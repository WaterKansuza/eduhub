# CCNA: Nhập môn mạng máy tính

> Đây là bản hỗ trợ học tập bằng tiếng Việt cùng mục lục dịch thuật. Nội dung kỹ thuật đầy đủ, chính xác theo bài khóa học nằm trong [Introduction_to_Networks.md](./Introduction_to_Networks.md).

## Chào mừng

Chào mừng bạn đến với Ngày nay về mạng!

Xin chúc mừng! Module này bắt đầu hành trình hướng đến sự nghiệp thành công trong lĩnh vực Công nghệ Thông tin bằng cách cung cấp cho bạn nền tảng về cách tạo, vận hành và bảo trì mạng. Ngoài ra, bạn sẽ được làm quen với mô phỏng mạng bằng Cisco Packet Tracer. Chúng tôi tin rằng bạn sẽ rất thích phần này!

**Tên module:** Networking Today

**Mục tiêu module:** Giải thích những tiến bộ trong các công nghệ mạng hiện đại.

## Mục lục khóa học

1. Networking Today - Mạng ngày nay
2. Basic Switch and End Device Configuration - Cấu hình cơ bản switch và thiết bị đầu cuối
3. Protocols and Models - Giao thức và mô hình mạng
4. Physical Layer - Tầng vật lý
5. Number Systems - Hệ đếm
6. Data Link Layer - Tầng liên kết dữ liệu
7. Ethernet Switching - Chuyển mạch Ethernet
8. Network Layer - Tầng mạng
9. Address Resolution - Phân giải địa chỉ
10. Basic Router Configuration - Cấu hình cơ bản router
11. IPv4 Addressing - Địa chỉ IPv4
12. IPv6 Addressing - Địa chỉ IPv6
13. ICMP
14. Transport Layer - Tầng giao vận
15. Application Layer - Tầng ứng dụng
16. Network Security Fundamentals - Những kiến thức cơ bản về bảo mật mạng
17. Build a Small Network - Xây dựng mạng quy mô nhỏ

## Nội dung đã dịch

# Module 1: Networking Today (Mạng ngày nay)

## 1.0 Giới thiệu

## 1.0.1 Tại sao tôi nên học học phần này?

Chào mừng bạn đến với Networking (mạng máy tính) ngay hôm nay!

Chúc mừng! Mô-đun này giúp bạn bắt đầu con đường dẫn đến sự nghiệp thành công trong lĩnh vực Công nghệ thông tin bằng cách cung cấp cho bạn sự hiểu biết nền tảng về việc tạo, vận hành và bảo trì Networks (các mạng). Như một phần thưởng, bạn có thể đi sâu vào mô phỏng Networking (mạng máy tính) bằng cách sử dụng Packet (Packet) Tracer. Chúng tôi hứa bạn sẽ thực sự thích nó!

## 1.0.2 Tôi sẽ học làm gì trong học phần này?

**Tiêu đề mô-đun:** Networking (mạng máy tính) hôm nay

**Mục tiêu mô-đun:** Giải thích những tiến bộ trong công nghệ network (mạng) hiện đại.

| Tiêu đề chủ đề | Mục tiêu chủ đề |
| --- | --- |
| **Networks (các mạng) Ảnh hưởng đến cuộc sống của chúng ta** | Giải thích Networks (các mạng) ảnh hưởng đến cuộc sống hàng ngày của chúng ta như thế nào. |
| **Network (mạng) Components (các thành phần)** | Giải thích cách sử dụng host (Host) và network (mạng) Devices (các thiết bị). |
| **Các biểu diễn và cấu trúc liên kết Network (mạng)** | Giải thích các biểu diễn network (mạng) và cách chúng được sử dụng trong cấu trúc liên kết network (mạng). |
| **Các loại Networks (các mạng) phổ biến** | So sánh đặc điểm các loại Networks (các mạng) thông dụng. |
| **Kết nối Internet** | Giải thích cách mạng LAN và WAN kết nối với Internet. |
| **Networks (các mạng) đáng tin cậy** | Mô tả bốn yêu cầu cơ bản của một network (mạng) đáng tin cậy. |
| **Xu hướng Network (mạng)** | Giải thích các xu hướng như BYOD, cộng tác trực tuyến, video và điện toán đám mây đang thay đổi cách chúng ta tương tác như thế nào. |
| **Network (mạng) Security (bảo mật)** | Xác định một số mối đe dọa Security (bảo mật) cơ bản và giải pháp cho tất cả Networks (các mạng). |
| **Chuyên gia CNTT** | Giải thích các cơ hội việc làm trong lĩnh vực Networking (mạng máy tính). |

## Tiện ích đồ họa

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/en-US/assets/42339be7f23f43a4bca9a7e305e83c5f.png`

Để có được và cài đặt bản sao Cisco Packet (Packet) Tracer của bạn, vui lòng làm theo hướng dẫn từ link (liên kết) bên dưới:
[https://www.netacad.com/resources/lab-downloads](https://www.netacad.com/resources/lab-downloads?courseLang=en-US)

## Video 1.0.4 - Bắt đầu với Cisco Packet (Packet) Tracer

Packet (Packet) Tracer là một công cụ cho phép bạn mô phỏng Networks (các mạng) thực. Nó cung cấp ba menu chính:

* Bạn có thể thêm Devices (các thiết bị) và kết nối chúng qua cáp hoặc không dây.
* Bạn có thể chọn, xóa, kiểm tra, gắn nhãn và nhóm Components (các thành phần) trong network (mạng) của mình.
* Bạn có thể quản lý network (mạng) của mình bằng cách mở network (mạng) hiện có/mẫu, lưu network (mạng) hiện tại của bạn và sửa đổi hồ sơ người dùng hoặc tùy chọn của bạn.

Nếu bạn đã sử dụng bất kỳ chương trình nào như trình xử lý văn bản hoặc bảng tính, bạn đã quen với các lệnh menu Tệp nằm ở thanh menu trên cùng. Các lệnh Mở, Lưu, Lưu dưới dạng và Thoát hoạt động giống như đối với bất kỳ chương trình nào, nhưng có hai lệnh đặc biệt đối với Packet (Packet) Tracer.

Lệnh Open Samples sẽ hiển thị một thư mục gồm các ví dụ dựng sẵn về các tính năng và cấu hình của nhiều network (mạng) và Internet of Things Devices (các thiết bị) có trong Packet (Packet) Tracer.

Lệnh Thoát và Đăng xuất sẽ xóa thông tin đăng ký cho bản sao Packet (Packet) Tracer này và yêu cầu người dùng tiếp theo của bản sao Packet (Packet) Tracer này thực hiện lại quy trình đăng nhập.

Nhấp vào Phát trong video để tìm hiểu cách sử dụng các menu và cách tạo Packet (Packet) Tracer network (mạng) đầu tiên của bạn.

[Xem video](https://players.brightcove.net/2649925992001/ZtjDPtmlF_default/index.html?videoId=83fb2114-a68f-4121-9bcd-85674ce18c3a)

## 1.0.5 Packet (Packet) Tracer - Khám phá chế độ logic và vật lý

Mô hình network (mạng) trong hoạt động Chế độ vật lý theo dõi Packet (Packet) (PTPM) này kết hợp nhiều công nghệ mà bạn có thể thành thạo trong các khóa học của Học viện Cisco Networking (mạng máy tính). Nó đại diện cho một phiên bản đơn giản hóa về diện mạo của một doanh nghiệp vừa và nhỏ network (mạng).

Hầu hết Devices (các thiết bị) tại văn phòng chi nhánh Seward và trung tâm Warrenton data (dữ liệu) đều đã được triển khai và định cấu hình. Bạn vừa được thuê để đánh giá Devices (các thiết bị) và Networks (các mạng) đã triển khai. Việc bạn hiểu mọi thứ bạn thấy và làm trong hoạt động này không quan trọng. Hãy thoải mái khám phá network (mạng) theo cách riêng của bạn. Nếu bạn muốn tiến hành một cách có hệ thống hơn, hãy làm theo các bước dưới đây. Trả lời các câu hỏi theo khả năng tốt nhất của bạn.

### Khám phá chế độ logic và vật lý

- Activity instructions: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.0.5-packet-tracer---logical-and-physical-mode-exploration.pdf_en-US_30c75859-0ffe-44c9-83c2-2e29a98a01bc.pdf`

- Packet Tracer file: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.0.5-packet-tracer---logical-and-physical-mode-exploration.pka_en-US_e5917d29-87c4-49ae-a67a-19a7e211bdcd.pka`

## 1.1 Networks (các mạng) Ảnh hưởng đến cuộc sống của chúng ta

## 1.1.1 Networks (các mạng) Kết nối với chúng tôi

Trong số tất cả những điều cần thiết cho sự tồn tại của con người, nhu cầu tương tác với người khác chỉ xếp dưới nhu cầu duy trì sự sống của chúng ta. Giao tiếp gần như quan trọng đối với chúng ta như sự phụ thuộc của chúng ta vào không khí, nước, thức ăn và nơi trú ẩn.

Trong thế giới ngày nay, thông qua việc sử dụng Networks (các mạng), chúng ta được kết nối hơn bao giờ hết. Những người có ý tưởng có thể giao tiếp ngay lập tức với người khác để biến những ý tưởng đó thành hiện thực. Các sự kiện và khám phá tin tức được biết đến trên toàn thế giới chỉ trong vài giây. Các cá nhân thậm chí có thể kết nối và chơi trò chơi với những người bạn ở cách nhau bởi các đại dương và lục địa.

## 1.1.2 Video - Trải nghiệm học tập tại Học viện Cisco Networking (mạng máy tính)

Những người thay đổi thế giới không được sinh ra. Chúng được tạo ra. Từ năm 1997, Học viện Cisco Networking (mạng máy tính) đã hoạt động hướng tới một mục tiêu duy nhất: đào tạo và xây dựng kỹ năng cho thế hệ nhân tài tiếp theo cần thiết cho nền kinh tế kỹ thuật số.

Nhấp vào Chơi tới Học viện Cisco Networking (mạng máy tính) để tìm hiểu cách chúng tôi sử dụng công nghệ nhằm biến thế giới thành một nơi tốt đẹp hơn.

[Xem video](https://players.brightcove.net/2649925992001/ZtjDPtmlF_default/index.html?videoId=c8619ad6-6906-4b45-bb85-d72e4dfc9bdd)

## 1.1.3 Không có ranh giới

Những tiến bộ trong công nghệ Networking (mạng máy tính) có lẽ là những thay đổi quan trọng nhất trên thế giới hiện nay. Chúng đang giúp tạo ra một thế giới trong đó biên giới quốc gia, khoảng cách địa lý và những hạn chế về vật lý trở nên ít liên quan hơn, tạo ra những trở ngại ngày càng giảm bớt.

Internet đã thay đổi cách thức tương tác xã hội, thương mại, chính trị và cá nhân của chúng ta. Bản chất trực tiếp của truyền thông qua internet khuyến khích việc tạo ra các cộng đồng toàn cầu. Cộng đồng toàn cầu cho phép tương tác xã hội độc lập với vị trí hoặc múi giờ.

Việc tạo ra các cộng đồng trực tuyến để trao đổi ý tưởng và thông tin có tiềm năng tăng cơ hội năng suất trên toàn cầu.

Việc tạo ra đám mây cho phép chúng ta lưu trữ tài liệu, hình ảnh và truy cập chúng mọi lúc, mọi nơi. Vì vậy, cho dù chúng ta đang ở trên tàu, trong công viên hay đứng trên đỉnh núi, chúng ta đều có thể truy cập liền mạch data (dữ liệu) và các ứng dụng trên bất kỳ device (thiết bị) nào.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/en-US/assets/2f1e5ea96e4d4c1a9c5f223b0e60fda2.png`

## 1.2 Network (mạng) Components (các thành phần)

## 1.2.1 Vai trò Host (Host)

Nếu bạn muốn trở thành một phần của cộng đồng trực tuyến toàn cầu, trước tiên máy tính, máy tính bảng hoặc điện thoại thông minh của bạn phải được kết nối với network (mạng). network (mạng) đó phải được kết nối với internet. Chủ đề này thảo luận về các bộ phận của network (mạng). Hãy xem bạn có nhận ra những Components (các thành phần) này ở nhà hoặc trường học network (mạng) của bạn không!

Tất cả các máy tính được kết nối với network (mạng) và tham gia trực tiếp vào giao tiếp network (mạng) đều được phân loại là Hosts (các Host). Hosts (các Host) có thể được gọi là End Devices (các thiết bị đầu cuối). Một số Hosts (các Host) còn được gọi là Clients (các Client). Tuy nhiên, thuật ngữ Hosts (các Host) đặc biệt đề cập đến Devices (các thiết bị) trên network (mạng) được gán một số cho mục đích liên lạc. Số này xác định host (Host) trong network (mạng) cụ thể. Số này được gọi là Giao thức Internet (IP) address (Address). IP address (Address) xác định host (Host) và network (mạng) mà host (Host) được gắn vào.

Servers (các Server) là các máy tính có phần mềm cho phép chúng cung cấp thông tin, như email hoặc trang web, cho End Devices (các thiết bị đầu cuối) khác trên network (mạng). Mỗi dịch vụ yêu cầu phần mềm server (Server) riêng biệt. Ví dụ: server (Server) yêu cầu phần mềm web server (Server) để cung cấp dịch vụ web cho network (mạng). Một máy tính có phần mềm server (Server) có thể cung cấp dịch vụ đồng thời cho nhiều Clients (các Client) khác nhau.

Như đã đề cập trước đó, Clients (các Client) là một loại host (Host). Clients (các Client) có phần mềm yêu cầu và hiển thị thông tin thu được từ server (Server), như trong hình.

**Mô tả hình:** Hình này mô tả PC client (Client) và server (Server) được kết nối thông qua đám mây tượng trưng cho Internet

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d832ac0-1c25-11ea-a010-eb2108469056/2d8351d2-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Client (Client) | Internet | Server (Server)

Một ví dụ về phần mềm client (Client) là trình duyệt web, như Chrome hoặc FireFox. Một máy tính cũng có thể chạy nhiều loại phần mềm client (Client). Ví dụ: người dùng có thể kiểm tra email và xem trang web trong khi nhắn tin tức thời và nghe luồng âm thanh. Bảng liệt kê ba loại phần mềm server (Server) phổ biến.

| Kiểu | Sự miêu tả |
| --- | --- |
| E-mail | Email server (Server) chạy phần mềm email server (Server). Clients (các Client) sử dụng phần mềm mail client (Client), chẳng hạn như Microsoft Outlook, để truy cập email trên server (Server). |
| Web | Web server (Server) chạy phần mềm web server (Server). Clients (các Client) sử dụng phần mềm trình duyệt, chẳng hạn như Windows Internet Explorer, để truy cập các trang web trên server (Server). |
| Tài liệu | Tệp server (Server) lưu trữ các tệp công ty và người dùng ở một vị trí trung tâm. client (Client) Devices (các thiết bị) truy cập các tệp này bằng phần mềm client (Client) chẳng hạn như Windows File Explorer. |

## 1.2.2 Ngang hàng

Phần mềm Client (Client) và server (Server) thường chạy trên các máy tính riêng biệt, nhưng cũng có thể sử dụng một máy tính cho cả hai vai trò cùng một lúc. Trong các doanh nghiệp nhỏ và gia đình, nhiều máy tính hoạt động như Servers (các Server) và Clients (các Client) trên network (mạng). Loại network (mạng) này được gọi là network (mạng) ngang hàng.

Trong hình, PC chia sẻ in có kết nối Universal Serial Bus (USB) với máy in và kết nối network (mạng), sử dụng Network Interface Card (card giao diện mạng) (NIC), với PC chia sẻ tệp.

**Mô tả hình:** Hình này hiển thị một chiếc network (mạng) nhỏ với ba chiếc Devices (các thiết bị). Máy in ở bên trái, được kết nối với PC chia sẻ in ở giữa, PC này cũng được kết nối với PC chia sẻ tệp ở bên phải.  Bên dưới Topology (cấu trúc liên kết) là danh sách các ưu điểm và nhược điểm của Networking (mạng máy tính) ngang hàng.  Ưu điểm của Networking (mạng máy tính) ngang hàng là: dễ cài đặt, ít phức tạp hơn, chi phí thấp hơn vì network (mạng) Devices (các thiết bị) và Servers (các Server) chuyên dụng có thể không cần thiết và có thể được sử dụng cho các tác vụ đơn giản như truyền tệp và chia sẻ máy in. Nhược điểm của Networking (mạng máy tính) ngang hàng là: không có quản trị tập trung, không an toàn, không thể mở rộng, tất cả Devices (các thiết bị) có thể hoạt động như cả Clients (các Client) và Servers (các Server), điều này có thể làm chậm hiệu suất của chúng.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d839ff0-1c25-11ea-a010-eb2108469056/2d83c700-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Nhãn trong hình:** Tôi có một máy in muốn chia sẻ | Tôi có tập tin để chia sẻ | Chia sẻ in | Chia sẻ tập tin

## 1.2.3 End Devices (các thiết bị đầu cuối)

network (mạng) Devices (các thiết bị) mà mọi người quen thuộc nhất là End Devices (các thiết bị đầu cuối). Để phân biệt một End Device (thiết bị đầu cuối) với một End Device (thiết bị đầu cuối) khác trên network (mạng) có một address (Address). Khi End Device (thiết bị đầu cuối) bắt đầu liên lạc, nó sử dụng address (Address) của End Device (thiết bị đầu cuối) đích để chỉ định nơi gửi tin nhắn.

End Device (thiết bị đầu cuối) là nguồn hoặc đích của tin nhắn được truyền qua network (mạng).

Nhấp vào Phát trong hình để xem hình ảnh động của data (dữ liệu) chảy qua network (mạng).

**Mô tả hoạt ảnh:** Hình minh họa một network (mạng) Topology (cấu trúc liên kết) vật lý với một khối LAN, một khối InternetWork và một khối LAN khác. Từ trái sang phải, LAN có hai người dùng: điện thoại IP, PC và server (Server) được kết nối với switch (Switch). Một link (liên kết) vật lý kết nối LAN switch (Switch) với một cạnh router (Router) nằm trong khối LAN và khối Internetwork. Khối Internetwork bao gồm bốn Routers (các Router) được kết nối trong một mạng Topology (cấu trúc liên kết) đầy đủ. Một cạnh router (Router) nằm trong khối Internetwork và khối LAN thứ hai. Khối LAN thứ hai bao gồm hai người dùng, một điện thoại IP, một PC và một server (Server). Khi hoạt ảnh bắt đầu, một thông báo bắt nguồn từ một trong những người dùng trong LAN đầu tiên và truyền từ người dùng này đến switch (Switch) và tới cạnh router (Router) kết nối Internetwork. Tại Internetwork, tin nhắn được chuyển đến máy soạn thảo router (Router) khác tiếp quản LAN thứ hai. Tin nhắn được chuyển tiếp đến LAN thứ hai, thông qua switch (Switch) và đến người dùng cuối đích. Văn bản bên dưới đồ họa có nội dung Data (dữ liệu) bắt nguồn từ End Device (thiết bị đầu cuối), chảy qua network (mạng) và đến End Device (thiết bị đầu cuối).

- **Kết nối mạng**

- **LAN**

- **LAN**

- Tin nhắn có thể mất
thay thế Routes (các tuyến đường).

- Data (dữ liệu) bắt đầu từ End Device (thiết bị đầu cuối), chảy qua network (mạng) và đến End Device (thiết bị đầu cuối).

**Nội dung hoạt hình:** ZZZP0000ZZZ

## 1.2.4 Devices (các thiết bị) trung gian

Devices (các thiết bị) trung gian kết nối End Devices (các thiết bị đầu cuối) riêng lẻ với network (mạng). Họ có thể kết nối nhiều Networks (các mạng) riêng lẻ để tạo thành một mạng lưới liên mạng. Các Devices (các thiết bị) trung gian này cung cấp khả năng kết nối và đảm bảo rằng data (dữ liệu) chảy qua network (mạng).

Devices (các thiết bị) trung gian sử dụng đích End Device (thiết bị đầu cuối) address (Address), kết hợp với thông tin về các kết nối network (mạng), để xác định đường dẫn mà các tin nhắn sẽ đi qua network (mạng). Ví dụ về Devices (các thiết bị) trung gian phổ biến hơn và danh sách các chức năng được hiển thị trong hình.

**Mô tả hình:** Hình ảnh hiển thị các ký hiệu của năm trung gian phổ biến Devices (các thiết bị) và mô tả một số chức năng của chúng. Ở trên cùng là router (Router) không dây, LAN switch (Switch) và router (Router) không dây.  Dưới đây là thiết bị tường lửa và switch (Switch) nhiều lớp. network (mạng) Devices (các thiết bị) trung gian thực hiện một số hoặc tất cả các chức năng này: tái tạo và truyền lại tín hiệu liên lạc, duy trì thông tin về những đường dẫn tồn tại thông qua network (mạng) và mạng nội bộ, thông báo cho Devices (các thiết bị) khác về lỗi và lỗi giao tiếp, hướng dẫn data (dữ liệu) dọc theo các đường dẫn thay thế khi có lỗi link (liên kết), phân loại và gửi tin nhắn trực tiếp theo mức độ ưu tiên, cho phép hoặc từ chối luồng data (dữ liệu), dựa trên cài đặt Security (bảo mật). Lưu ý: Không hiển thị là trung tâm Ethernet cũ. Hub Ethernet còn được gọi là bộ lặp nhiều cổng. Bộ lặp tái tạo và truyền lại tín hiệu liên lạc. Lưu ý rằng tất cả Devices (các thiết bị) trung gian đều thực hiện chức năng của bộ lặp.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d846340-1c25-11ea-a010-eb2108469056/2d846342-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Nhãn trong hình:** Trung gian Devices (các thiết bị) | Không dây Router (Router) | LAN Switch (Switch) | Router (Router) | Switch (Switch) đa lớp | Thiết bị tường lửa

## 1.2.5 Phương tiện Network (mạng)

Giao tiếp truyền qua network (mạng) trên phương tiện truyền thông. Phương tiện truyền thông cung cấp kênh để thông điệp truyền từ nguồn tới đích.

Networks (các mạng) hiện đại chủ yếu sử dụng ba loại phương tiện để kết nối Devices (các thiết bị), như trong hình:

* **Dây kim loại bên trong cáp** \- Data (dữ liệu) được mã hóa thành các xung điện.
* **Sợi thủy tinh hoặc nhựa bên trong cáp (cáp quang)** \- Data (dữ liệu) được mã hóa thành các xung ánh sáng.
* **Truyền không dây** \- Data (dữ liệu) được mã hóa thông qua điều chế tần số cụ thể của sóng điện từ.

**Mô tả hình:** Có ba hình ảnh của phương tiện network (mạng) phổ biến kèm theo các tiêu chí để sử dụng khi chọn phương tiện network (mạng). Hình ảnh trên cùng hiển thị các dây xoắn đôi và đầu nối được sử dụng với phương tiện truyền thông bằng đồng. Hình ảnh ở giữa là cáp quang nhiều sợi và đầu nối cáp quang. Hình ảnh phía dưới hiển thị Devices (các thiết bị) không dây bao gồm router (Router) và máy ảnh. Các loại phương tiện network (mạng) khác nhau có các tính năng và lợi ích khác nhau. Không phải tất cả các loại phương tiện network (mạng) đều có đặc điểm giống nhau và chúng cũng không phù hợp cho cùng mục đích. Bốn tiêu chí chính để chọn phương tiện network (mạng) là: Khoảng cách tối đa mà phương tiện có thể truyền tín hiệu thành công là bao nhiêu? Môi trường mà phương tiện sẽ được cài đặt là gì? Số lượng data (dữ liệu) là bao nhiêu và nó phải được truyền ở tốc độ nào? Chi phí của phương tiện và cài đặt là bao nhiêu?

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d84b160-1c25-11ea-a010-eb2108469056/2d84d873-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Nhãn trong hình:** Đồng | Cáp quang | Không dây

## 1.2.6 Kiểm tra sự hiểu biết của bạn - Network (mạng) Components (các thành phần)

Kiểm tra sự hiểu biết của bạn về network (mạng) Components (các thành phần) bằng cách chọn câu trả lời TỐT NHẤT cho các câu hỏi sau.

## Câu hỏi

Tên nào sau đây là tên của tất cả các máy tính được kết nối với network (mạng) tham gia trực tiếp vào giao tiếp network (mạng)?

Khi data (dữ liệu) được mã hóa dưới dạng xung ánh sáng, phương tiện nào đang được sử dụng để truyền data (dữ liệu)?

Hai Devices (các thiết bị) nào là Devices (các thiết bị) trung gian? (Chọn hai)

## 1.3 Biểu diễn và cấu trúc liên kết Network (mạng)

## 1.3.1 Biểu diễn Network (mạng)

Các kiến ​​trúc sư và quản trị viên của Network (mạng) phải có khả năng chỉ ra Networks (các mạng) của họ sẽ trông như thế nào. Họ cần có thể dễ dàng xem Components (các thành phần) nào kết nối với Components (các thành phần) khác, vị trí của chúng và cách chúng sẽ được kết nối. Các sơ đồ của Networks (các mạng) thường sử dụng các ký hiệu, giống như các ký hiệu được hiển thị trong hình, để thể hiện các Devices (các thiết bị) khác nhau và các kết nối tạo nên network (mạng).

**Mô tả hình:** Hình ảnh hiển thị các ký hiệu được sử dụng trong sơ đồ network (mạng). Ở trên cùng là các End Devices (các thiết bị đầu cuối) sau: máy tính để bàn, máy tính xách tay, máy in, điện thoại IP, máy tính bảng không dây và điểm cuối TelePresence. Ở giữa là các thiết bị trung gian Devices (các thiết bị) sau: router (Router) không dây, LAN switch (Switch), router (Router), switch (Switch) đa lớp và thiết bị tường lửa.  Ở phía dưới cùng là các phương tiện network (mạng) sau: sóng màu xanh lam mô tả phương tiện không dây, một đường liền màu đen mô tả phương tiện LAN và tia sáng màu đỏ mô tả phương tiện WAN.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d86d440-1c25-11ea-a010-eb2108469056/2d86d442-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** **End Devices (các thiết bị đầu cuối)** | Máy tính để bàn | Máy tính xách tay | Máy in | Điện thoại IP | Máy tính bảng không dây | Điểm cuối TelePresence | **Trung gian Devices (các thiết bị)** | Không dây Router (Router) | LAN Switch (Switch) | Router (Router) | Switch (Switch) đa lớp | Thiết bị tường lửa | **Network (mạng) Media** | Phương tiện không dây | Truyền thông LAN | Truyền thông WAN

Sơ đồ cung cấp một cách dễ dàng để hiểu cách Devices (các thiết bị) kết nối trong network (mạng) lớn. Loại “hình ảnh” này của network (mạng) được gọi là sơ đồ Topology (cấu trúc liên kết). Khả năng nhận dạng các biểu diễn logic của Networking (mạng máy tính) Components (các thành phần) vật lý là rất quan trọng để có thể hình dung được tổ chức và hoạt động của network (mạng).

Ngoài các cách trình bày này, thuật ngữ chuyên ngành được sử dụng để mô tả cách mỗi Devices (các thiết bị) và phương tiện này kết nối với nhau:

* **Network Interface Card (card giao diện mạng) (NIC)** \- Một NIC kết nối vật lý End Device (thiết bị đầu cuối) với network (mạng).
* **Port (Port) vật lý** \- Đầu nối hoặc ổ cắm trên Networking (mạng máy tính) device (thiết bị) nơi phương tiện truyền thông kết nối với End Device (thiết bị đầu cuối) hoặc Networking (mạng máy tính) device (thiết bị) khác.
* **Interface (Interface)** \- Ports (các Port) chuyên dụng trên Networking (mạng máy tính) device (thiết bị) kết nối với Networks (các mạng) riêng lẻ. Vì Routers (các Router) kết nối Networks (các mạng) nên Ports (các Port) trên router (Router) được gọi là network (mạng) Interfaces (các Interface).

**Lưu ý:** Các thuật ngữ port (Port) và interface (Interface) thường được sử dụng thay thế cho nhau.

## 1.3.2 Sơ đồ Topology (cấu trúc liên kết)

Sơ đồ Topology (cấu trúc liên kết) là tài liệu bắt buộc đối với bất kỳ ai làm việc với network (mạng). Họ cung cấp bản đồ trực quan về cách kết nối network (mạng). Có hai loại sơ đồ Topology (cấu trúc liên kết): vật lý và logic.

**Sơ đồ Topology (cấu trúc liên kết) vật lý**

Sơ đồ Topology (cấu trúc liên kết) vật lý minh họa vị trí vật lý của Devices (các thiết bị) trung gian và lắp đặt cáp, như trong hình. Bạn có thể thấy rằng các phòng chứa Devices (các thiết bị) này đều được dán nhãn trong Topology (cấu trúc liên kết) thực tế này.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) vật lý hiển thị sáu phòng, mỗi phòng được đánh dấu bằng hộp màu vàng nhạt, với nhiều Networking (mạng máy tính) Devices (các thiết bị) và hệ thống cáp.  Ở phía bên trái là phòng server (Server) có nhãn phòng 2158. Nó chứa router (Router) có nhãn R1 được gắn trên giá 1 kệ 1 với sáu kết nối cáp.  Một sợi cáp ở trên cùng kết nối với Internet có nhãn đám mây.  Cáp ở bên trái kết nối với switch (Switch) có nhãn S1 được gắn trên giá 1 kệ 2. S1 được kết nối với ba Servers (các Server): một trang web server (Server) được gắn trên giá 2 kệ 1, một email server (Server) được gắn trên giá 2 kệ 2 và một tập tin server (Server) được gắn trên giá 2 kệ 3. A cáp kết nối với đáy R1 kết nối với S2 có nhãn switch (Switch) được gắn trên giá 1 kệ 3. S2 có hai kết nối dẫn đến máy in và PC trong phòng CNTT có nhãn phòng 2159. R1 có ba dây cáp ở bên phải được kết nối với ba Switches (các Switch) nằm trong phòng 2124. switch (Switch) trên cùng được gắn nhãn S3 và được gắn trên giá 1 kệ 1. switch (Switch) ở giữa có nhãn S4 và gắn trên giá 1 kệ 2. switch (Switch) phía dưới có nhãn S5 và gắn trên giá 1 kệ 3. S3 có một cáp ở bên trái kết nối với máy tính xách tay trong phòng có nhãn phòng lớp 1 2125. S4 có một cáp ở bên trái kết nối với máy tính xách tay trong phòng có nhãn phòng lớp 2 2126. S5 có một cáp ở bên trái kết nối với máy tính xách tay trong một căn phòng có nhãn lớp 3, phòng 2127.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d879790-1c25-11ea-a010-eb2108469056/2d879792-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Email Server (Server)
Giá 2
Kệ 2 | Web Server (Server)
Giá 2
Kệ 1 | Tệp Server (Server)
Giá 2
Kệ 3 | Giá đỡ 1
Kệ 2 | Giá đỡ 1
Kệ 1 | Giá đỡ 1
Kệ 2 | Giá đỡ 1
Kệ 1 | Giá đỡ 1
Kệ 3 | Giá đỡ 1
Kệ 3 | Server (Server) Phòng: Rm: 2158 | Văn phòng CNTT: Rm: 2159 | Lớp 1: Rm: 2125 | Lớp 2: Rm: 2126 | Lớp 3: Rm: 2127 | Rm: 2124

**Sơ đồ logic Topology (cấu trúc liên kết)**

Các sơ đồ logic Topology (cấu trúc liên kết) minh họa Devices (các thiết bị), Ports (các Port) và sơ đồ địa chỉ của network (mạng), như trong hình. Bạn có thể xem End Devices (các thiết bị đầu cuối) nào được kết nối với Devices (các thiết bị) trung gian nào và phương tiện nào đang được sử dụng.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) logic hiển thị các nhãn Devices (các thiết bị), port (Port) và sơ đồ địa chỉ network (mạng).  Ở giữa bức ảnh là một chiếc router (Router) có nhãn R1.  port (Port) có nhãn G0/0 kết nối với đám mây ở Internet có nhãn trên cùng.  port (Port) có nhãn G0/1 kết nối ở bên trái với switch (Switch) có nhãn S1 tại port (Port) G0/1.  S1 được kết nối với ba Servers (các Server).  S1 và Servers (các Server) được đánh dấu bằng một vòng tròn màu vàng nhạt với network (mạng) 192.168.10.0 được viết ở trên cùng.  Port (Port) F0/1 trên S1 kết nối với web server (Server).  Port (Port) F0/2 trên S1 kết nối với email server (Server).  Port (Port) F0/3 trên S1 kết nối với tệp server (Server).  Port (Port) F0/1 trên R1 kết nối ở phía dưới với switch (Switch) có nhãn S2.  S2 kết nối với máy in và PC, tất cả đều được đánh dấu bằng vòng tròn màu vàng nhạt với chữ network (mạng) 192.168.11.0 được viết ở phía dưới.  Ở bên trái của R1 là ba kết nối bổ sung, mỗi kết nối với switch (Switch) tại port (Port) G0/1, sau đó được kết nối với máy tính xách tay tại port (Port) F0/1. Mỗi switch (Switch) và máy tính xách tay đều được đánh dấu màu vàng và network (mạng) address (Address) được hiển thị.  Port (Port) G0/0 của R1 kết nối ở trên cùng với S3 có gắn nhãn switch (Switch) trên network (mạng) 192.168.100.0.  Port (Port) G1/1 của R1 kết nối ở giữa với switch (Switch) có nhãn S4 trên network (mạng) 192.169.101.0.  Port (Port) G1/2 trên R1 kết nối ở phía dưới với switch (Switch) có nhãn S5 trên network (mạng) 192.168.102.0.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d87e5b0-1c25-11ea-a010-eb2108469056/2d880cc0-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Email Server (Server) | Web Server (Server) | Tệp Server (Server) | Network (mạng)
192.168.10.0 | Network (mạng) 192.168.11.0 | Network (mạng) 192.168.100.0 | Network (mạng) 192.168.101.0 | Network (mạng) 192.168.102.0

Các cấu trúc liên kết được hiển thị trong sơ đồ vật lý và logic phù hợp với mức độ hiểu biết của bạn tại thời điểm này trong khóa học. Tìm kiếm trên Internet “sơ đồ network (mạng) Topology (cấu trúc liên kết)” để xem một số ví dụ phức tạp hơn. Nếu bạn thêm từ “Cisco” vào cụm từ tìm kiếm của mình, bạn sẽ tìm thấy nhiều cấu trúc liên kết sử dụng các biểu tượng tương tự như những gì bạn đã thấy trong những hình này.

## 1.3.3 Kiểm tra sự hiểu biết của bạn - Các biểu diễn và cấu trúc liên kết Network (mạng)

Kiểm tra hiểu biết của bạn về các cách biểu diễn và cấu trúc liên kết network (mạng) bằng cách chọn câu trả lời TỐT NHẤT cho các câu hỏi sau.

## Câu hỏi

Kết nối nào kết nối vật lý End Device (thiết bị đầu cuối) với network (mạng)?

Những kết nối nào là Ports (các Port) chuyên biệt trên Networking (mạng máy tính) device (thiết bị) kết nối với Networks (các mạng) riêng lẻ?

Loại network (mạng) Topology (cấu trúc liên kết) nào cho phép bạn xem End Devices (các thiết bị đầu cuối) nào được kết nối với Devices (các thiết bị) trung gian nào và phương tiện nào đang được sử dụng?

Loại network (mạng) Topology (cấu trúc liên kết) nào cho phép bạn xem vị trí thực tế của Devices (các thiết bị) trung gian và lắp đặt cáp?

## 1.4 Các loại Networks (các mạng) phổ biến

## 1.4.1 Networks (các mạng) có nhiều kích cỡ

Bây giờ bạn đã quen với Components (các thành phần) tạo nên Networks (các mạng) và các biểu diễn của chúng trong cấu trúc liên kết vật lý và logic, bạn đã sẵn sàng tìm hiểu về nhiều loại Networks (các mạng) khác nhau.

Networks (các mạng) có đủ kích cỡ. Chúng bao gồm từ Networks (các mạng) đơn giản bao gồm hai máy tính đến Networks (các mạng) kết nối hàng triệu Devices (các thiết bị).

Ngôi nhà đơn giản Networks (các mạng) cho phép bạn chia sẻ tài nguyên, chẳng hạn như máy in, tài liệu, hình ảnh và âm nhạc, giữa một số End Devices (các thiết bị đầu cuối) cục bộ.

Văn phòng nhỏ và văn phòng tại nhà (SOHO) Networks (các mạng) cho phép mọi người làm việc tại nhà hoặc văn phòng từ xa. Nhiều người lao động tự do sử dụng các loại Networks (các mạng) này để quảng cáo và bán sản phẩm, đặt hàng vật tư và giao tiếp với khách hàng.

Các doanh nghiệp và tổ chức lớn sử dụng Networks (các mạng) để cung cấp sự hợp nhất, lưu trữ và truy cập thông tin trên network (mạng) Servers (các Server). Networks (các mạng) cung cấp email, nhắn tin tức thời và cộng tác giữa các nhân viên. Nhiều tổ chức sử dụng kết nối Internet của network (mạng) của họ để cung cấp sản phẩm và dịch vụ cho khách hàng.

Internet là network (mạng) lớn nhất hiện có. Trên thực tế, thuật ngữ internet có nghĩa là “network (mạng) của Networks (các mạng)”. Nó là một tập hợp Networks (các mạng) riêng tư và công cộng được kết nối với nhau.

Trong các doanh nghiệp nhỏ và gia đình, nhiều máy tính hoạt động như cả Servers (các Server) và Clients (các Client) trên network (mạng). Loại network (mạng) này được gọi là network (mạng) ngang hàng.

Nhấp vào từng nút để biết thêm thông tin.

### Ngôi Nhà Nhỏ Networks (các mạng)

**Ngôi nhà nhỏ Networks (các mạng)**

Ngôi nhà nhỏ Networks (các mạng) kết nối một vài máy tính với nhau và với internet.

**Mô tả hình:** ngôi nhà nhỏ network (mạng) bao gồm màn hình, tháp máy tính, bàn phím, chuột, loa và máy in đặt trong tủ

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8b6820-1c25-11ea-a010-eb2108469056/2d8b6820-1c25-11ea-81a0-ffc2c49b96bc.jpg`

### Văn phòng nhỏ và văn phòng tại nhà Networks (các mạng)

**Văn phòng nhỏ và văn phòng tại nhà Networks (các mạng)**

SOHO network (mạng) cho phép các máy tính trong văn phòng tại nhà hoặc văn phòng từ xa kết nối với network (mạng) của công ty hoặc truy cập các tài nguyên được chia sẻ, tập trung.

**Mô tả hình:** văn phòng nhỏ tại nhà network (mạng) bao gồm hai tủ văn phòng với bàn, ghế, tủ hồ sơ, màn hình, điện thoại, tháp máy tính và máy in

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8b8f30-1c25-11ea-a010-eb2108469056/2d8b8f30-1c25-11ea-81a0-ffc2c49b96bc.jpg`

### Trung bình đến lớn Networks (các mạng)

**Networks (các mạng) từ trung bình đến lớn**

Networks (các mạng) từ trung bình đến lớn, chẳng hạn như Networks (các mạng) được các công ty và trường học sử dụng, có thể có nhiều địa điểm với hàng trăm hoặc hàng nghìn Hosts (các Host) được kết nối với nhau.

**Mô tả hình:** network (mạng) trung bình đến lớn trong tòa nhà ba tầng với hệ thống máy tính và máy in ở mỗi tầng

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8bb640-1c25-11ea-a010-eb2108469056/2d8bb640-1c25-11ea-81a0-ffc2c49b96bc.jpg`

### Toàn thế giới Networks (các mạng)

**Networks (các mạng) toàn thế giới**

Internet là một network (mạng) của Networks (các mạng) kết nối hàng trăm triệu máy tính trên toàn thế giới.

**Mô tả hình:** Hình này hiển thị Networks (các mạng) trên toàn thế giới hiển thị bản đồ toàn cầu với năm tòa nhà

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8ca0a0-1c25-11ea-a010-eb2108469056/2d8ca0a1-1c25-11ea-81a0-ffc2c49b96bc.svg`

## 1.4.2 Mạng LAN và WAN

Cơ sở hạ tầng Network (mạng) khác nhau rất nhiều về:

* Kích thước của khu vực được bảo hiểm
* Số lượng người dùng được kết nối
* Số lượng và loại hình dịch vụ hiện có
* Lĩnh vực trách nhiệm

Hai loại cơ sở hạ tầng network (mạng) phổ biến nhất là Local Area Networks (các mạng) (LAN) và Wide Area Networks (các mạng) (WAN). LAN là cơ sở hạ tầng network (mạng) cung cấp quyền truy cập cho người dùng và End Devices (các thiết bị đầu cuối) trong một khu vực địa lý nhỏ. LAN thường được sử dụng trong một bộ phận trong doanh nghiệp, gia đình hoặc doanh nghiệp nhỏ network (mạng). WAN là cơ sở hạ tầng network (mạng) cung cấp quyền truy cập vào Networks (các mạng) khác trên một khu vực địa lý rộng, thường được sở hữu và quản lý bởi một công ty lớn hơn hoặc nhà cung cấp dịch vụ viễn thông. Hình minh họa các mạng LAN được kết nối với WAN.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) hiển thị ba mạng LAN được kết nối qua WAN link (liên kết) ở trung tâm. Một chú giải cho thấy mạng LAN được đánh dấu màu vàng và mạng WAN có màu tím nhạt.  WAN nằm ở trung tâm của sơ đồ. Nó chứa biểu tượng đám mây có nhãn đám mây với các kết nối WAN màu đỏ với ba Routers (các Router).  Mỗi router (Router) được đặt một phần trong WAN và một phần trong LAN. Ở phía dưới bên trái là LAN trung tâm.  Nó chứa một server (Server), hai Switches (các Switch) nhiều lớp, hai LAN Switches (các Switch) và bốn PC. Ở phía dưới bên phải là Chi nhánh LAN.  Nó chứa switch (Switch), server (Server), một máy in, hai điện thoại IP, mỗi điện thoại được kết nối với PC và một điểm truy cập không dây có kết nối không dây với máy tính xách tay và điện thoại thông minh. Ở trên cùng bên phải là văn phòng tại nhà LAN.  Nó chứa router (Router) không dây với kết nối có dây với máy in và kết nối không dây với máy tính xách tay và màn hình.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8cc7b0-1c25-11ea-a010-eb2108469056/2d8cc7b3-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Home Office | Đám mây | Miền Trung | Chi nhánh | LAN | WAN

**LAN**

LAN là cơ sở hạ tầng network (mạng) trải rộng trên một khu vực địa lý nhỏ. Mạng LAN có những đặc điểm cụ thể:

* Mạng LAN kết nối End Devices (các thiết bị đầu cuối) trong một khu vực giới hạn như nhà ở, trường học, tòa nhà văn phòng hoặc khuôn viên trường.
* LAN thường được quản lý bởi một tổ chức hoặc cá nhân. Kiểm soát hành chính được thực thi ở cấp network (mạng) và chi phối Security (bảo mật) cũng như các chính sách kiểm soát truy cập.
* Mạng LAN cung cấp băng thông tốc độ cao cho End Devices (các thiết bị đầu cuối) nội bộ và Devices (các thiết bị) trung gian, như minh họa trong hình.

## Tiện ích đồ họa

**Mô tả hình:** Sơ đồ này là minh họa của LAN. Ở trung tâm của sơ đồ là switch (Switch). Có bốn kết nối Ethernet trên switch (Switch). Ở phía trên bên trái là kết nối với PC. Phía dưới là đường kết nối với máy tính tại bàn làm việc của người công nhân. Bên dưới đó là một kết nối khác với máy tính tại bàn làm việc của công nhân. Ở phía dưới bên trái là kết nối với điện thoại IP. Ở bên phải của switch (Switch) là kết nối với server (Server). Văn bản bên dưới hình có nội dung: network (mạng) phục vụ gia đình, tòa nhà nhỏ hoặc khuôn viên nhỏ được coi là LAN.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8ceec0-1c25-11ea-a010-eb2108469056/2d8d15d1-1c25-11ea-81a0-ffc2c49b96bc.svg`

## 1.4.2 Mạng LAN và WAN

**WAN**

Hình minh họa cho thấy WAN kết nối hai mạng LAN. WAN là cơ sở hạ tầng network (mạng) trải rộng trên một khu vực địa lý rộng lớn. Mạng WAN thường được quản lý bởi nhà cung cấp dịch vụ (SP) hoặc Nhà cung cấp dịch vụ Internet (ISP).

Mạng WAN có những đặc điểm cụ thể:

* WAN kết nối các mạng LAN trên các khu vực địa lý rộng lớn như giữa các thành phố, tiểu bang, tỉnh, quốc gia hoặc lục địa.
* Mạng WAN thường được quản lý bởi nhiều nhà cung cấp dịch vụ.
* Các mạng WAN thường cung cấp tốc độ chậm hơn Links (các liên kết) giữa các mạng LAN.

**Mô tả hình:** Hình này hiển thị hai mạng LAN nhánh được kết nối qua WAN link (liên kết).  Cả hai mạng LAN đều được đánh dấu trong hộp màu vàng nhạt và bao gồm một switch (Switch) trung tâm được kết nối với ba PC, một điện thoại IP, một server (Server) và một router (Router).  Hai Routers (các Router) được kết nối thông qua WAN link (liên kết) màu đỏ.  Bên trái là nhánh 1 LAN và bên phải là nhánh 2 LAN.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8d15d0-1c25-11ea-a010-eb2108469056/2d8d3ce0-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** **Nhánh 1 LAN** | **Chi nhánh 2 LAN**

## 1.4.3 Internet

Internet là một tập hợp trên toàn thế giới gồm các Networks (các mạng) được kết nối với nhau (internetworks hoặc gọi tắt là internet). Hình này cho thấy một cách để xem Internet như một tập hợp các mạng LAN và WAN được kết nối với nhau.

**Mô tả hình:** Năm Switches (các Switch) nhiều lớp với Links (các liên kết) dự phòng được hiển thị bên trong một đám mây lớn.  Xung quanh rìa đám mây có bảy Routers (các Router) được kết nối với nhiều mạng LAN khác nhau.  Có một bệnh viện LAN, một trường học LAN, một doanh nghiệp LAN, một chính phủ LAN và ba mạng LAN gia đình. Văn bản ở phía dưới ghi rằng mạng LAN sử dụng dịch vụ WAN để kết nối.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8d63f0-1c25-11ea-a010-eb2108469056/2d8d63f3-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Trang chủ LAN | Bệnh viện LAN | Chính phủ LAN | Kinh doanh LAN | Trường LAN

Một số ví dụ LAN được kết nối với nhau thông qua kết nối WAN. Các mạng WAN sau đó được kết nối với nhau. Mạng WAN có thể kết nối thông qua dây đồng, cáp quang và đường truyền không dây (không hiển thị).

Internet không thuộc sở hữu của bất kỳ cá nhân hay tập thể nào. Đảm bảo liên lạc hiệu quả trên cơ sở hạ tầng đa dạng này đòi hỏi phải áp dụng các công nghệ và tiêu chuẩn nhất quán và được công nhận rộng rãi cũng như sự hợp tác của nhiều cơ quan quản lý network (mạng). Có những tổ chức được phát triển để giúp duy trì cấu trúc và tiêu chuẩn hóa các giao thức và quy trình internet. Các tổ chức này bao gồm Lực lượng đặc nhiệm kỹ thuật Internet (IETF), Tập đoàn Internet cấp số và tên miền (ICANN) và Ban kiến ​​trúc Internet (IAB), cùng với nhiều tổ chức khác.

## 1.4.4 Mạng nội bộ và mạng ngoại vi

Có hai thuật ngữ khác tương tự như thuật ngữ internet: mạng nội bộ và mạng extranet.

Mạng nội bộ là thuật ngữ thường được dùng để chỉ kết nối riêng của mạng LAN và WAN thuộc về một tổ chức. Mạng nội bộ được thiết kế để chỉ các thành viên, nhân viên của tổ chức hoặc những người khác được ủy quyền mới có thể truy cập được.

Một tổ chức có thể sử dụng extranet để cung cấp quyền truy cập bảo mật và an toàn cho các cá nhân làm việc cho một tổ chức khác nhưng yêu cầu quyền truy cập vào data (dữ liệu) của tổ chức. Dưới đây là một số ví dụ về extranet:

* Một công ty đang cung cấp quyền truy cập vào các nhà cung cấp và nhà thầu bên ngoài
* Một bệnh viện đang cung cấp hệ thống đặt lịch hẹn cho các bác sĩ để họ có thể đặt lịch hẹn cho bệnh nhân của mình
* Một văn phòng giáo dục địa phương đang cung cấp thông tin về ngân sách và nhân sự cho các trường học trong khu vực của mình

Hình này minh họa mức độ truy cập mà các nhóm khác nhau có vào mạng nội bộ của công ty, mạng extranet của công ty và internet.

**Mô tả hình:** Vòng tròn ở giữa được gắn nhãn Mạng nội bộ và chỉ có quyền truy cập của công ty.  Bao quanh đó là một vòng tròn khác có nhãn Extranet và các nhà cung cấp, khách hàng và cộng tác viên đều có thể truy cập được.  Xung quanh đó là một vòng tròn khác được gắn nhãn Internet và cả thế giới có thể truy cập được.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8db210-1c25-11ea-a010-eb2108469056/2d8db213-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** **Internet**
Thế giới | **Mạng ngoại vi**
Nhà cung cấp, Khách hàng, Cộng tác viên | **Mạng nội bộ**
Chỉ công ty

## 1.4.5 Kiểm tra hiểu biết của bạn - Các loại Networks (các mạng) phổ biến

Kiểm tra hiểu biết của bạn về các loại Networks (các mạng) phổ biến bằng cách chọn câu trả lời TỐT NHẤT cho các câu hỏi sau.

## Câu hỏi

Cơ sở hạ tầng network (mạng) nào cung cấp quyền truy cập cho người dùng và End Devices (các thiết bị đầu cuối) trong một khu vực địa lý nhỏ, thường là network (mạng) trong một bộ phận trong doanh nghiệp, gia đình hoặc doanh nghiệp nhỏ?

Tổ chức có thể sử dụng cơ sở hạ tầng network (mạng) nào để cung cấp quyền truy cập bảo mật và an toàn cho các cá nhân làm việc cho một tổ chức khác nhưng yêu cầu quyền truy cập vào data (dữ liệu) của tổ chức?

Cơ sở hạ tầng network (mạng) nào cung cấp quyền truy cập vào Networks (các mạng) khác trên một khu vực địa lý rộng lớn, thường được sở hữu và quản lý bởi nhà cung cấp dịch vụ viễn thông?

## 1.5 Kết nối Internet

## 1.5.1 Công nghệ truy cập Internet

Vì vậy, bây giờ bạn đã hiểu cơ bản về những gì tạo nên network (mạng) và các loại Networks (các mạng) khác nhau. Tuy nhiên, làm thế nào để bạn thực sự kết nối người dùng và tổ chức với internet? Như bạn có thể đoán, có nhiều cách khác nhau để làm điều này.

Người dùng gia đình, nhân viên từ xa và văn phòng nhỏ thường yêu cầu kết nối với ISP để truy cập Internet. Các tùy chọn kết nối rất khác nhau giữa các ISP và vị trí địa lý. Tuy nhiên, các lựa chọn phổ biến bao gồm cáp băng thông rộng, đường dây thuê bao kỹ thuật số băng thông rộng (DSL), mạng WAN không dây và dịch vụ di động.

Các tổ chức thường cần quyền truy cập vào các trang web khác của công ty cũng như internet. Cần có kết nối nhanh để hỗ trợ các dịch vụ kinh doanh bao gồm điện thoại IP, hội nghị truyền hình và bộ lưu trữ trung tâm data (dữ liệu). SP cung cấp kết nối cấp doanh nghiệp. Các dịch vụ phổ biến dành cho doanh nghiệp bao gồm DSL doanh nghiệp, đường dây thuê riêng và Metro Ethernet.

## 1.5.2 Kết nối Internet tại nhà và văn phòng nhỏ

Hình minh họa các tùy chọn kết nối phổ biến cho người dùng văn phòng nhỏ và văn phòng tại nhà.

**Mô tả hình:** Hình này hiển thị các tùy chọn kết nối phổ biến cho người dùng văn phòng nhỏ và văn phòng tại nhà. Từ trái sang phải, một hộp ở ngoài cùng bên trái hiển thị ba tình huống của người dùng cuối, ở trên cùng là một người dùng gia đình và một người ở trong nhà, ở giữa là người dùng thường trực có nhãn Teleworker và ở dưới cùng là một tòa nhà văn phòng có nhãn Văn phòng nhỏ. Có một hộp khác ở bên phải hiển thị một tòa nhà văn phòng lớn có nhãn Nhà cung cấp dịch vụ Internet. Bốn phương thức kết nối khác nhau được hiển thị giữa hộp người dùng cuối và hộp ISP. Ở trên cùng là một đường thẳng có nhãn DSL. Bên dưới DSL là một đường thẳng khác có nhãn Cable. Bên dưới Cable là đường sóng không khí màu xanh có nhãn Cellular. Bên dưới Cellular là một vệ tinh có cả hai hộp Links (các liên kết) với bộ thu/phát đĩa. Ở phía dưới là một nhãn đường thẳng khác Điện thoại quay số. Ở ngoài cùng bên phải là đám mây mô tả Internet. Một đường tia sét hiển thị kết nối giữa ISP và Internet.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8f86d0-1c25-11ea-a010-eb2108469056/40d4a8c6-ed51-4725-8b50-d19fd36b8750.svg`

**Các nhãn trong hình:** Người dùng gia đình | Nhân viên làm việc từ xa | Văn phòng nhỏ | DSL | Cáp | Di động | Internet | Vệ tinh | Điện thoại quay số | Nhà cung cấp dịch vụ Internet | Sợi quang

* **Cáp** \- Thường được cung cấp bởi các nhà cung cấp dịch vụ truyền hình cáp, tín hiệu Internet data (dữ liệu) truyền trên cùng một cáp cung cấp truyền hình cáp. Nó cung cấp băng thông cao, tính sẵn sàng cao và kết nối internet luôn bật.
* **DSL** \- Đường dây thuê bao kỹ thuật số cũng cung cấp băng thông cao, tính sẵn sàng cao và kết nối internet luôn sẵn sàng. DSL chạy trên đường dây điện thoại. Nói chung, người dùng văn phòng nhỏ và văn phòng tại nhà kết nối bằng DSL bất đối xứng (ADSL), có nghĩa là tốc độ tải xuống nhanh hơn tốc độ tải lên.
* **Di động** \- Truy cập internet di động sử dụng điện thoại di động network (mạng) để kết nối. Bất cứ nơi nào bạn có thể nhận được tín hiệu di động, bạn có thể truy cập Internet di động. Hiệu suất bị giới hạn bởi khả năng của điện thoại và tháp di động mà nó được kết nối.
* **Vệ tinh** \- Khả năng truy cập Internet qua vệ tinh là một lợi ích ở những khu vực hoàn toàn không có kết nối Internet. Đĩa vệ tinh yêu cầu đường ngắm rõ ràng tới vệ tinh.
* **Điện thoại quay số** \- Một lựa chọn rẻ tiền sử dụng bất kỳ đường dây điện thoại và modem nào. Băng thông thấp được cung cấp bởi kết nối modem quay số không đủ để truyền data (dữ liệu) lớn, mặc dù nó rất hữu ích cho việc truy cập di động khi đi du lịch.
* **Internet cáp quang** \- Một dạng internet băng thông rộng sử dụng cáp quang để cung cấp khả năng truy cập Internet tốc độ cao với tốc độ tải lên và tải xuống đối xứng.

Việc lựa chọn kết nối khác nhau tùy thuộc vào vị trí địa lý và tính khả dụng của nhà cung cấp dịch vụ.

## 1.5.3 Kết nối Internet của doanh nghiệp

Các tùy chọn kết nối của công ty khác với các tùy chọn của người dùng gia đình. Các doanh nghiệp có thể yêu cầu băng thông cao hơn, băng thông chuyên dụng và dịch vụ được quản lý. Các tùy chọn kết nối khả dụng sẽ khác nhau tùy thuộc vào loại nhà cung cấp dịch vụ ở gần đó.

Hình minh họa các tùy chọn kết nối phổ biến cho doanh nghiệp.

**Mô tả hình:** các tùy chọn kết nối thông dụng dành cho doanh nghiệp

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d8ffc00-1c25-11ea-a010-eb2108469056/2d8ffc02-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Tổ chức | Nhà cung cấp dịch vụ Internet | Vệ tinh | DSL kinh doanh | Tàu điện ngầm Ethernet | Đường dây thuê riêng | internet

* **Đường dây thuê riêng** \- Đường dây thuê riêng là các mạch dành riêng trong network (mạng) của nhà cung cấp dịch vụ kết nối các văn phòng tách biệt về mặt địa lý để có giọng nói riêng và/hoặc data (dữ liệu) Networking (mạng máy tính). Các mạch được thuê với mức giá hàng tháng hoặc hàng năm.
* **Metro Ethernet** \- Điều này đôi khi được gọi là Ethernet WAN. Trong mô-đun này, chúng tôi sẽ gọi nó là Metro Ethernet. Metro ethernet mở rộng công nghệ truy cập LAN vào WAN. Ethernet là công nghệ LAN mà bạn sẽ tìm hiểu trong mô-đun sau.
* **DSL doanh nghiệp** \- DSL doanh nghiệp có sẵn ở nhiều định dạng khác nhau. Một lựa chọn phổ biến là Đường dây thuê bao kỹ thuật số đối xứng (SDSL) tương tự như phiên bản DSL dành cho người tiêu dùng nhưng cung cấp tải lên và tải xuống ở cùng tốc độ cao.
* **Vệ tinh** \- Dịch vụ vệ tinh có thể cung cấp kết nối khi không có giải pháp có dây.
* **Internet cáp quang** \- Một dạng internet băng thông rộng sử dụng cáp quang để cung cấp khả năng truy cập Internet tốc độ cao với tốc độ tải lên và tải xuống đối xứng.

Việc lựa chọn kết nối khác nhau tùy thuộc vào vị trí địa lý và tính khả dụng của nhà cung cấp dịch vụ.

## 1.5.4 Network (mạng) hội tụ

**Networks (các mạng) riêng truyền thống**

Hãy xem xét một ngôi trường được xây dựng cách đây ba mươi năm. Hồi đó, một số lớp học đã được nối cáp cho data (dữ liệu) network (mạng), điện thoại network (mạng) và video network (mạng) cho TV. Những Networks (các mạng) riêng biệt này không thể giao tiếp với nhau. Mỗi network (mạng) sử dụng các công nghệ khác nhau để truyền tín hiệu liên lạc. Mỗi network (mạng) có bộ quy tắc và tiêu chuẩn riêng để đảm bảo giao tiếp thành công. Nhiều dịch vụ chạy trên nhiều Networks (các mạng).

**Mô tả hình:** máy tính, điện thoại và phát sóng riêng biệt Networks (các mạng)

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d907130-1c25-11ea-a010-eb2108469056/2d909840-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Devices (các thiết bị) | Trung bình | Tin nhắn | Tiêu chuẩn thỏa thuận quy tắc | Tiêu chuẩn thỏa thuận quy tắc | Tiêu chuẩn thỏa thuận quy tắc | Trung bình | Tin nhắn | Devices (các thiết bị) | Trung bình | Tin nhắn | Devices (các thiết bị) | Máy tính Networks (các mạng) | Điện thoại Networks (các mạng) | Phát sóng Networks (các mạng)

**Networks (các mạng) hội tụ**

Ngày nay, data (dữ liệu), điện thoại và video Networks (các mạng) riêng biệt hội tụ. Không giống như Networks (các mạng) chuyên dụng, Networks (các mạng) hội tụ có khả năng cung cấp data (dữ liệu), thoại và video giữa nhiều loại Devices (các thiết bị) khác nhau trên cùng một cơ sở hạ tầng network (mạng). Cơ sở hạ tầng network (mạng) này sử dụng cùng một bộ quy tắc, thỏa thuận và tiêu chuẩn triển khai. data (dữ liệu) Networks (các mạng) hội tụ mang nhiều dịch vụ trên một network (mạng).

**Mô tả hình:** data (dữ liệu) network (mạng) hội tụ mang nhiều dịch vụ trên một network (mạng).

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d910d70-1c25-11ea-a010-eb2108469056/2d913481-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Nhãn trong hình:** Trung bình | Trung bình | Trung bình | Tiêu chuẩn thỏa thuận quy tắc | Devices (các thiết bị) | Devices (các thiết bị) | Devices (các thiết bị) | Tin nhắn | Tin nhắn | Tin nhắn | Một Network (mạng)-Nhiều Devices (các thiết bị)

## 1.5.5 Trình theo dõi Packet (Packet) - Đại diện Network (mạng)

Trong hoạt động này, bạn sẽ khám phá cách Packet (Packet) Tracer hoạt động như một công cụ lập mô hình cho các biểu diễn network (mạng).

### Đại diện Network (mạng)

- Activity instructions: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.5.5-packet-tracer---network-representation.pdf_en-US_82faaf2e-4dce-4724-b770-8be0083ff1ed.pdf`

- Packet Tracer file: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.5.5-packet-tracer---network-representation.pka_en-US_e60a66ee-6fb5-43f5-99e2-000a7f74bad2.pka`

## 1.6 Networks (các mạng) đáng tin cậy

## 1.6.1 Kiến trúc Network (mạng)

Bạn đã bao giờ bận rộn làm việc trực tuyến để rồi “Internet ngừng hoạt động” chưa? Như bạn đã biết, Internet không hề ngừng hoạt động, bạn chỉ mất kết nối với nó. Nó rất bực bội. Với rất nhiều người trên thế giới dựa vào quyền truy cập network (mạng) để làm việc và học tập, điều bắt buộc là Networks (các mạng) phải đáng tin cậy. Trong bối cảnh này, độ tin cậy có ý nghĩa nhiều hơn kết nối Internet của bạn. Chủ đề này tập trung vào bốn khía cạnh của độ tin cậy của network (mạng).

Vai trò của network (mạng) đã thay đổi từ data (dữ liệu) chỉ có network (mạng) thành một hệ thống cho phép kết nối mọi người, Devices (các thiết bị) và thông tin trong môi trường network (mạng) hội tụ, đa phương tiện. Để Networks (các mạng) hoạt động hiệu quả và phát triển trong loại môi trường này, network (mạng) phải được xây dựng dựa trên kiến ​​trúc network (mạng) tiêu chuẩn.

Networks (các mạng) cũng hỗ trợ nhiều ứng dụng và dịch vụ. Chúng phải hoạt động trên nhiều loại cáp khác nhau và Devices (các thiết bị), tạo nên cơ sở hạ tầng vật lý. Thuật ngữ kiến ​​trúc network (mạng), trong bối cảnh này, đề cập đến các công nghệ hỗ trợ cơ sở hạ tầng cũng như các dịch vụ và quy tắc hoặc giao thức được lập trình, di chuyển data (dữ liệu) qua network (mạng).

Khi Networks (các mạng) phát triển, chúng tôi đã biết rằng có bốn đặc điểm cơ bản mà kiến ​​trúc sư network (mạng) phải address (Address) để đáp ứng mong đợi của người dùng:

* Dung sai lỗi
* Khả năng mở rộng
* Chất lượng dịch vụ (QoS)
* Security (bảo mật)

## 1.6.2 Khả năng chịu lỗi

network (mạng) có khả năng chịu lỗi là một thiết bị giới hạn số lượng Devices (các thiết bị) bị ảnh hưởng khi xảy ra lỗi. Nó được xây dựng để cho phép phục hồi nhanh chóng khi xảy ra lỗi như vậy. Các Networks (các mạng) này phụ thuộc vào nhiều đường dẫn giữa nguồn và đích của tin nhắn. Nếu một đường dẫn bị lỗi, tin nhắn sẽ được gửi ngay lập tức qua một link (liên kết) khác. Có nhiều đường dẫn đến đích được gọi là dự phòng.

Việc triển khai packet (Packet) chuyển mạch network (mạng) là một cách mà Networks (các mạng) đáng tin cậy cung cấp khả năng dự phòng. Packet (Packet) Switching (chuyển mạch) chia lưu lượng truy cập thành Packets (các Packet) được định tuyến qua network (mạng) được chia sẻ. Một tin nhắn, chẳng hạn như email hoặc luồng video, được chia thành nhiều khối tin nhắn, được gọi là Packets (các Packet). Mỗi packet (Packet) có thông tin địa chỉ cần thiết về nguồn và đích của tin nhắn. Routers (các Router) trong network (mạng) switch (Switch) Packets (các Packet) dựa trên tình trạng của network (mạng) tại thời điểm đó. Điều này có nghĩa là tất cả Packets (các Packet) trong một tin nhắn có thể đi theo những đường dẫn rất khác nhau đến cùng một đích. Trong hình, người dùng không biết và không bị ảnh hưởng bởi router (Router) đang thay đổi động Route (tuyến đường) khi link (liên kết) bị lỗi.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) bao gồm bốn Routers (các Router) với Links (các liên kết) dự phòng. Ở đầu sơ đồ là đám mây Internet với hai kết nối ở phía dưới, mỗi kết nối dẫn đến router (Router). Bên dưới Routers (các Router) này là kết nối với router (Router) khác. Mỗi router (Router) phía dưới kết nối trở lại với cả Routers (các Router) kết nối với Internet. router (Router) ở phía dưới bên trái được kết nối với switch (Switch) với ba máy tính để bàn và ba điện thoại IP. router (Router) ở phía dưới bên phải được kết nối với switch (Switch) với ba máy tính để bàn.  router (Router) phía trên bên trái có một vòng tròn màu đỏ với một đường chéo. Phía trên bên phải router (Router) có mũi tên màu xanh lá cây dẫn đến Internet. Một hộp văn bản có nội dung: các kết nối dự phòng cho phép các đường dẫn thay thế nếu device (thiết bị) bị lỗi; trải nghiệm người dùng không bị ảnh hưởng.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d929410-1c25-11ea-a010-eb2108469056/2d929412-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Các kết nối dự phòng cho phép các đường dẫn thay thế nếu device (thiết bị) hoặc link (liên kết) không thành công. Trải nghiệm người dùng không bị ảnh hưởng.

## 1.6.3 Khả năng mở rộng

network (mạng) có khả năng mở rộng sẽ mở rộng nhanh chóng để hỗ trợ người dùng và ứng dụng mới. Nó thực hiện điều này mà không làm giảm hiệu suất của các dịch vụ đang được người dùng hiện tại truy cập. Hình minh họa cách dễ dàng thêm network (mạng) mới vào network (mạng) hiện có. Các Networks (các mạng) này có khả năng mở rộng vì các nhà thiết kế tuân theo các tiêu chuẩn và giao thức được chấp nhận. Điều này cho phép các nhà cung cấp phần mềm và phần cứng tập trung vào việc cải tiến sản phẩm và dịch vụ mà không cần phải thiết kế bộ quy tắc mới để vận hành trong network (mạng).

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) bao gồm bốn Routers (các Router) với Links (các liên kết) dự phòng bao gồm hai kết nối với đám mây Internet. Có ba mạng LAN, một trong số đó đã được thêm vào gần đây. Một hộp văn bản có nội dung: người dùng bổ sung và toàn bộ Networks (các mạng) có thể được kết nối với Internet mà không làm giảm hiệu suất đối với người dùng hiện tại.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d92bb20-1c25-11ea-a010-eb2108469056/2d92e232-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Người dùng bổ sung và toàn bộ Networks (các mạng) có thể được kết nối với Internet mà không làm giảm hiệu suất của người dùng hiện tại.

## 1.6.4 Chất lượng dịch vụ

Chất lượng dịch vụ (QoS) là yêu cầu ngày càng tăng của Networks (các mạng) ngày nay. Các ứng dụng mới có sẵn cho người dùng qua Networks (các mạng), chẳng hạn như truyền giọng nói và video trực tiếp, tạo ra kỳ vọng cao hơn về chất lượng dịch vụ được cung cấp. Bạn đã bao giờ thử xem một video bị ngắt và tạm dừng liên tục chưa? Khi data (dữ liệu), nội dung thoại và video tiếp tục hội tụ trên cùng một network (mạng), QoS trở thành cơ chế chính để quản lý tắc nghẽn và đảm bảo phân phối nội dung đáng tin cậy cho tất cả người dùng.

Sự tắc nghẽn xảy ra khi nhu cầu về băng thông vượt quá số lượng sẵn có. Băng thông Network (mạng) được đo bằng số bit có thể được truyền trong một giây hoặc số bit trên giây (bps). Khi cố gắng liên lạc đồng thời trên network (mạng), nhu cầu về băng thông network (mạng) có thể vượt quá khả năng sẵn có của nó, tạo ra tắc nghẽn network (mạng).

Khi lưu lượng lớn hơn mức có thể được vận chuyển qua network (mạng), Devices (các thiết bị) sẽ giữ Packets (các Packet) trong bộ nhớ cho đến khi có sẵn tài nguyên để truyền chúng. Trong hình, một người dùng đang yêu cầu một trang web và một người dùng khác đang gọi điện thoại. Với chính sách QoS được áp dụng, router (Router) có thể quản lý luồng data (dữ liệu) và lưu lượng thoại, ưu tiên liên lạc bằng giọng nói nếu network (mạng) gặp tắc nghẽn. Trọng tâm của QoS là ưu tiên lưu lượng truy cập nhạy cảm với thời gian. Loại lưu lượng truy cập chứ không phải nội dung của lưu lượng truy cập mới là điều quan trọng.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) với PC và điện thoại IP được kết nối với switch (Switch) được kết nối với router (Router) đang quản lý chất lượng dịch vụ bằng cách ưu tiên lưu lượng truy cập

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d930940-1c25-11ea-a010-eb2108469056/2d930943-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Chất lượng dịch vụ do router (Router) quản lý, đảm bảo rằng các ưu tiên phù hợp với loại hình giao tiếp và tầm quan trọng của nó đối với tổ chức. | Các trang web thường có thể nhận được mức độ ưu tiên thấp hơn. | Cuộc gọi Thoại qua IP (VoIP) sẽ cần được ưu tiên để duy trì trải nghiệm người dùng mượt mà, không bị gián đoạn. | internet

## 1.6.5 Network (mạng) Security (bảo mật)

Cơ sở hạ tầng, dịch vụ của network (mạng) và data (dữ liệu) có trên network (mạng) được đính kèm là tài sản cá nhân và doanh nghiệp quan trọng. Quản trị viên Network (mạng) phải address (Address) hai loại mối quan tâm của network (mạng) Security (bảo mật): network (mạng) cơ sở hạ tầng Security (bảo mật) và thông tin Security (bảo mật).

Bảo mật cơ sở hạ tầng network (mạng) bao gồm bảo mật vật lý Devices (các thiết bị) cung cấp kết nối network (mạng) và ngăn chặn truy cập trái phép vào phần mềm quản lý nằm trên chúng, như minh họa trong hình.

**Mô tả hình:** network (mạng) Topology (cấu trúc liên kết) với PC và điện thoại IP được kết nối với switch (Switch) được kết nối với router (Router) có thể bảo vệ network (mạng) bằng phần mềm và phần cứng Security (bảo mật) và bằng cách ngăn chặn truy cập vật lý vào network (mạng) Devices (các thiết bị).

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d935760-1c25-11ea-a010-eb2108469056/2d935763-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Quản trị viên có thể bảo vệ network (mạng) bằng phần mềm và phần cứng Security (bảo mật) cũng như bằng cách ngăn truy cập vật lý vào network (mạng) Devices (các thiết bị). | Internet | Các biện pháp Security (bảo mật) bảo vệ network (mạng) khỏi bị truy cập trái phép. | Đăng nhập: ?
Mật khẩu: ?

Quản trị viên Network (mạng) cũng phải bảo vệ thông tin chứa trong Packets (các Packet) được truyền qua network (mạng) và thông tin được lưu trữ trên network (mạng) được đính kèm Devices (các thiết bị). Để đạt được các mục tiêu của network (mạng) Security (bảo mật), có ba yêu cầu chính.

* **Tính bảo mật** \- Tính bảo mật của Data (dữ liệu) có nghĩa là chỉ những người nhận được chỉ định và ủy quyền mới có thể truy cập và đọc data (dữ liệu).
* **Tính toàn vẹn** \- Tính toàn vẹn của Data (dữ liệu) đảm bảo cho người dùng rằng thông tin không bị thay đổi trong quá trình truyền, từ nguồn đến đích.
* **Tính khả dụng** \- Tính khả dụng của Data (dữ liệu) đảm bảo cho người dùng quyền truy cập kịp thời và đáng tin cậy vào các dịch vụ data (dữ liệu) cho người dùng được ủy quyền.

## 1.6.6 Kiểm tra sự hiểu biết của bạn - Networks (các mạng) đáng tin cậy

Kiểm tra sự hiểu biết của bạn về Networks (các mạng) đáng tin cậy bằng cách chọn câu trả lời đúng cho các câu hỏi sau.

## Câu hỏi

Khi các nhà thiết kế tuân theo các tiêu chuẩn và giao thức được chấp nhận, đặc điểm nào trong bốn đặc điểm cơ bản của kiến ​​trúc network (mạng) sẽ đạt được?

Tính bảo mật, tính toàn vẹn và tính sẵn sàng là những yêu cầu trong bốn đặc điểm cơ bản của kiến ​​trúc network (mạng)?

Với loại chính sách nào, router (Router) có thể quản lý luồng data (dữ liệu) và lưu lượng thoại, ưu tiên liên lạc bằng giọng nói nếu network (mạng) gặp tắc nghẽn?

Có nhiều đường dẫn đến đích được gọi là dự phòng. Đây là ví dụ về đặc điểm nào của kiến ​​trúc network (mạng)?

## 1.7 Xu hướng Network (mạng)

## 1.7.1 Xu hướng gần đây

Bây giờ bạn đã biết rất nhiều về Networks (các mạng), chúng được làm bằng gì, chúng kết nối chúng ta như thế nào và những gì cần thiết để đảm bảo chúng luôn đáng tin cậy. Nhưng Networks (các mạng), giống như mọi thứ khác, tiếp tục thay đổi. Có một số xu hướng trong Networking (mạng máy tính) mà bạn, với tư cách là sinh viên NetAcad, nên biết.

Khi các công nghệ mới và Devices (các thiết bị) của người dùng cuối xuất hiện trên thị trường, các doanh nghiệp và người tiêu dùng phải tiếp tục điều chỉnh để phù hợp với môi trường luôn thay đổi này. Có một số xu hướng Networking (mạng máy tính) ảnh hưởng đến các tổ chức và người tiêu dùng:

* Mang theo Device (thiết bị) của riêng bạn (BYOD)
* Hợp tác trực tuyến
* Truyền thông video
* Điện toán đám mây

## 1.7.2 Mang theo Device (thiết bị) của riêng bạn (BYOD)

Khái niệm về bất kỳ device (thiết bị) nào, cho bất kỳ nội dung nào, dưới bất kỳ hình thức nào, là một xu hướng toàn cầu lớn đòi hỏi những thay đổi đáng kể trong cách chúng ta sử dụng Devices (các thiết bị) và kết nối chúng một cách an toàn với Networks (các mạng). Điều này được gọi là Mang theo Device (thiết bị) của riêng bạn (BYOD).

BYOD cho phép người dùng cuối tự do sử dụng các công cụ cá nhân để truy cập thông tin và liên lạc trong toàn bộ doanh nghiệp hoặc khuôn viên network (mạng). Với sự phát triển của Devices (các thiết bị) dành cho người tiêu dùng và sự giảm chi phí liên quan, nhân viên và sinh viên có thể có máy tính tiên tiến và Networking (mạng máy tính) Devices (các thiết bị) để sử dụng cá nhân. Chúng bao gồm máy tính xách tay, máy tính xách tay, máy tính bảng, điện thoại thông minh và máy đọc sách điện tử. Những thứ này có thể do công ty hoặc trường học mua, cá nhân mua hoặc cả hai.

BYOD có nghĩa là mọi device (thiết bị), với bất kỳ quyền sở hữu nào, được sử dụng ở mọi nơi.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/en-US/assets/57f1e41454c44675b65a349f1a37c03c.jpg`

## 1.7.3 Cộng tác trực tuyến

Các cá nhân muốn kết nối với network (mạng), không chỉ để truy cập vào các ứng dụng data (dữ liệu) mà còn để cộng tác với nhau. Hợp tác được định nghĩa là “hành động làm việc với người khác hoặc những người khác trong một dự án chung”. Các công cụ cộng tác, như Cisco WebEx, được minh họa trong hình, cung cấp cho nhân viên, sinh viên, giáo viên, khách hàng và đối tác một cách để kết nối, tương tác ngay lập tức và đạt được mục tiêu của họ.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/en-US/assets/fc592dc21bcb4176afe94d6488d0f2f0.png`

Hợp tác là một ưu tiên chiến lược và quan trọng mà các tổ chức đang sử dụng để duy trì tính cạnh tranh. Hợp tác cũng là một ưu tiên trong giáo dục. Học sinh cần hợp tác để hỗ trợ lẫn nhau trong học tập, phát triển các kỹ năng nhóm được sử dụng trong lực lượng lao động và cùng nhau làm việc trong các dự án theo nhóm.

Cisco Webex Teams là một công cụ cộng tác đa chức năng cho phép bạn gửi tin nhắn tức thời cho một hoặc nhiều người, đăng hình ảnh và đăng video cũng như Links (các liên kết). Mỗi 'không gian' của đội duy trì lịch sử của mọi thứ được đăng ở đó.

## 1.7.4 Truyền thông Video

Một khía cạnh khác của Networking (mạng máy tính) rất quan trọng đối với nỗ lực giao tiếp và cộng tác là video. Video được sử dụng để liên lạc, cộng tác và giải trí. Cuộc gọi video được thực hiện đến và đi từ bất kỳ ai có kết nối Internet, bất kể họ ở đâu.

Hội nghị truyền hình là một công cụ mạnh mẽ để giao tiếp với người khác, cả ở địa phương và toàn cầu. Video đang trở thành một yêu cầu quan trọng để cộng tác hiệu quả khi các tổ chức mở rộng vượt qua các ranh giới địa lý và văn hóa.

## 1.7.5 Video - Cisco Webex dành cho cuộc trò chuyện nhóm

Nhấp vào Chơi trong hình để xem cách Cisco Webex được tích hợp vào cuộc sống và kinh doanh hàng ngày.

[Xem video](https://players.brightcove.net/2649925992001/ZtjDPtmlF_default/index.html?videoId=97a9341c-83a7-4798-9738-1449d7ed429a)

## 1.7.6 Điện toán đám mây

Điện toán đám mây là một trong những cách chúng tôi truy cập và lưu trữ data (dữ liệu). Điện toán đám mây cho phép chúng ta lưu trữ các tập tin cá nhân, thậm chí sao lưu toàn bộ ổ đĩa trên Servers (các Server) qua internet. Các ứng dụng như xử lý văn bản và chỉnh sửa ảnh có thể được truy cập bằng đám mây.

Đối với các doanh nghiệp, Điện toán đám mây mở rộng khả năng của CNTT mà không cần đầu tư vào cơ sở hạ tầng mới, đào tạo nhân sự mới hoặc cấp phép cho phần mềm mới. Các dịch vụ này được cung cấp theo yêu cầu và được cung cấp một cách tiết kiệm cho mọi device (thiết bị) ở bất kỳ đâu trên thế giới mà không ảnh hưởng đến Security (bảo mật) hoặc chức năng.

Điện toán đám mây có thể thực hiện được nhờ các trung tâm data (dữ liệu). Trung tâm Data (dữ liệu) là cơ sở được sử dụng để chứa các hệ thống máy tính và Components (các thành phần) liên quan. Trung tâm data (dữ liệu) có thể chiếm một phòng của tòa nhà, một hoặc nhiều tầng hoặc toàn bộ tòa nhà có quy mô nhà kho. Các trung tâm Data (dữ liệu) thường rất tốn kém để xây dựng và bảo trì. Vì lý do này, chỉ các tổ chức lớn mới sử dụng các trung tâm data (dữ liệu) được xây dựng riêng để chứa data (dữ liệu) của họ và cung cấp dịch vụ cho người dùng. Các tổ chức nhỏ hơn không đủ khả năng duy trì trung tâm data (dữ liệu) riêng của họ có thể giảm tổng chi phí sở hữu bằng cách thuê server (Server) và dịch vụ lưu trữ từ tổ chức trung tâm data (dữ liệu) lớn hơn trên đám mây.

Đối với Security (bảo mật), độ tin cậy và khả năng chịu lỗi, các nhà cung cấp đám mây thường lưu trữ data (dữ liệu) trong các trung tâm data (dữ liệu) phân tán. Thay vì lưu trữ tất cả data (dữ liệu) của một người hoặc một tổ chức trong một trung tâm data (dữ liệu), nó được lưu trữ trong nhiều trung tâm data (dữ liệu) ở các vị trí khác nhau.

Có bốn loại đám mây chính: Đám mây công cộng, Đám mây riêng tư, Đám mây lai và Đám mây cộng đồng, như được hiển thị trong bảng.

### Các loại đám mây

| Loại đám mây | Sự miêu tả |
| --- | --- |
| **Các đám mây công cộng** | Các ứng dụng và dịch vụ dựa trên đám mây được cung cấp trong đám mây công cộng được cung cấp cho người dân nói chung. Các dịch vụ có thể miễn phí hoặc được cung cấp theo mô hình trả tiền cho mỗi lần sử dụng, chẳng hạn như trả tiền cho việc lưu trữ trực tuyến. Đám mây công cộng sử dụng internet để cung cấp dịch vụ. |
| **Đám mây riêng** | Các ứng dụng và dịch vụ dựa trên đám mây được cung cấp trong đám mây riêng được dành cho một tổ chức hoặc thực thể cụ thể, chẳng hạn như chính phủ. Một đám mây riêng có thể được thiết lập bằng cách sử dụng network (mạng) riêng của tổ chức, mặc dù việc xây dựng và bảo trì việc này có thể tốn kém. Đám mây riêng cũng có thể được quản lý bởi một tổ chức bên ngoài với quyền truy cập nghiêm ngặt Security (bảo mật). |
| **Mây lai** | Đám mây lai được tạo thành từ hai hoặc nhiều đám mây (ví dụ: một phần riêng tư, một phần công khai), trong đó mỗi phần vẫn là một đối tượng riêng biệt nhưng cả hai đều được kết nối bằng một kiến ​​trúc duy nhất. Các cá nhân trên đám mây lai sẽ có thể có mức độ truy cập vào các dịch vụ khác nhau dựa trên quyền truy cập của người dùng. |
| **Đám mây cộng đồng** | Đám mây cộng đồng được tạo ra để các thực thể hoặc tổ chức cụ thể sử dụng độc quyền. Sự khác biệt giữa đám mây công cộng và đám mây cộng đồng là các nhu cầu chức năng đã được tùy chỉnh cho cộng đồng. Ví dụ: các tổ chức chăm sóc sức khỏe phải luôn tuân thủ các chính sách và luật pháp (ví dụ: HIPAA) yêu cầu xác thực và bảo mật đặc biệt. Đám mây cộng đồng được sử dụng bởi nhiều tổ chức có nhu cầu và mối quan tâm tương tự. Đám mây cộng đồng tương tự như môi trường đám mây công cộng, nhưng được thiết lập các mức Security (bảo mật), quyền riêng tư và thậm chí cả việc tuân thủ quy định của đám mây riêng. |

## 1.7.7 Xu hướng công nghệ trong gia đình

Xu hướng Networking (mạng máy tính) không chỉ ảnh hưởng đến cách chúng ta giao tiếp ở nơi làm việc và ở trường mà còn thay đổi nhiều khía cạnh trong gia đình. Xu hướng nhà mới nhất bao gồm 'công nghệ nhà thông minh'.

Công nghệ nhà thông minh tích hợp vào các thiết bị hàng ngày, sau đó có thể kết nối với Devices (các thiết bị) khác để làm cho các thiết bị trở nên ‘thông minh’ hoặc tự động hơn. Ví dụ, bạn có thể chuẩn bị thức ăn và cho vào lò nướng để nấu trước khi ra khỏi nhà trong ngày. Bạn lập trình lò nướng thông minh của mình cho món ăn bạn muốn nấu. Nó cũng sẽ được kết nối với 'lịch sự kiện' của bạn để có thể xác định thời gian bạn có mặt để ăn và điều chỉnh thời gian bắt đầu cũng như thời gian nấu cho phù hợp. Nó thậm chí có thể điều chỉnh thời gian và nhiệt độ nấu dựa trên những thay đổi trong lịch trình. Ngoài ra, kết nối điện thoại thông minh hoặc máy tính bảng cho phép bạn kết nối trực tiếp với lò để thực hiện bất kỳ điều chỉnh mong muốn nào. Khi thức ăn đã sẵn sàng, lò nướng sẽ gửi một thông báo cảnh báo cho bạn (hoặc người mà bạn chỉ định) rằng thức ăn đã chín và đang nóng.

Công nghệ nhà thông minh hiện đang được phát triển cho tất cả các phòng trong một ngôi nhà. Công nghệ nhà thông minh sẽ trở nên phổ biến hơn khi nhà Networking (mạng máy tính) và công nghệ internet tốc độ cao ngày càng mở rộng.

**Mô tả hình:** Mô tả công nghệ nhà thông minh hiển thị một đám mây có mũi tên chỉ vào một ngôi nhà, một chiếc ô tô và một chiếc điện thoại thông minh.  Dòng chữ ở phía dưới có nội dung: Điện thoại thông minh được cập nhật từ đám mây với trạng thái của ngôi nhà thông minh Devices (các thiết bị) và ô tô thông minh; sau đó người dùng có thể sử dụng điện thoại thông minh để tương tác với ngôi nhà thông minh và ô tô thông minh.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d95ef70-1c25-11ea-a010-eb2108469056/2d961680-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Nhãn trong hình:** Đám mây

## 1.7.8 Đường dây điện Networking (mạng máy tính)

Đường dây điện Networking (mạng máy tính) cho gia đình Networks (các mạng) sử dụng hệ thống dây điện hiện có để kết nối Devices (các thiết bị), như trong hình.

**Mô tả hình:** Sơ đồ mặt bằng mở của một ngôi nhà sử dụng đường dây điện Networking (mạng máy tính) cho ngôi nhà network (mạng).  Có ba bộ điều hợp đường dây điện PLEK400 4-port (Port) được cắm vào ba ổ cắm điện khác nhau, tất cả đều được kết nối với nhau thông qua kết nối có dây.  Mỗi bộ chuyển đổi có ít nhất một kết nối đường dây điện với device (thiết bị) được nối mạng bao gồm máy tính để bàn và TV.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d963d90-1c25-11ea-a010-eb2108469056/2d9664a0-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** **PLEK400**
Đường dây điện 4-Port (Port)
Bộ chuyển đổi | Không dây-N
Router (Router) | **PLE400** | **PLSK400**
Đường dây điện 4-Port (Port)
Bộ chuyển đổi | Kết nối đường dây điện | Kết nối có dây

Sử dụng bộ chuyển đổi đường dây điện tiêu chuẩn, Devices (các thiết bị) có thể kết nối với LAN bất cứ nơi nào có ổ cắm điện. Không cần lắp đặt cáp data (dữ liệu) và sử dụng rất ít hoặc không cần sử dụng thêm điện. Sử dụng cùng hệ thống dây điện, đường dây điện Networking (mạng máy tính) gửi thông tin bằng cách gửi data (dữ liệu) trên các tần số nhất định.

Powerline Networking (mạng máy tính) đặc biệt hữu ích khi các điểm truy cập không dây không thể tiếp cận tất cả Devices (các thiết bị) trong nhà. Powerline Networking (mạng máy tính) không thể thay thế cho hệ thống cáp chuyên dụng trong data (dữ liệu) Networks (các mạng). Tuy nhiên, đó là một giải pháp thay thế khi cáp data (dữ liệu) network (mạng) hoặc kết nối không dây không thể thực hiện được hoặc không hiệu quả.

## 1.7.9 Băng thông rộng không dây

Ở nhiều khu vực không có cáp và DSL, mạng không dây có thể được sử dụng để kết nối internet.

**Nhà cung cấp dịch vụ Internet không dây**

Nhà cung cấp dịch vụ Internet không dây (WISP) là ISP kết nối người đăng ký với điểm truy cập hoặc điểm phát sóng được chỉ định bằng cách sử dụng các công nghệ không dây tương tự có trong khu vực nội bộ không dây tại nhà Networks (các mạng) (WLAN). WISP thường được tìm thấy ở môi trường nông thôn, nơi không có dịch vụ DSL hoặc cáp.

Mặc dù tháp truyền dẫn riêng biệt có thể được lắp đặt cho ăng-ten, nhưng thông thường, ăng-ten được gắn vào cấu trúc trên cao hiện có, chẳng hạn như tháp nước hoặc tháp vô tuyến. Một đĩa nhỏ hoặc ăng-ten được lắp đặt trên mái nhà của thuê bao trong phạm vi phủ sóng của bộ phát WISP. Thiết bị truy cập của thuê bao được kết nối với network (mạng) có dây trong nhà. Từ quan điểm của người dùng gia đình, việc thiết lập không khác nhiều so với dịch vụ DSL hoặc cáp. Sự khác biệt chính là kết nối từ nhà đến ISP là không dây thay vì cáp vật lý.

**Dịch vụ băng thông rộng không dây**

Một giải pháp không dây khác dành cho gia đình và doanh nghiệp nhỏ là băng thông rộng không dây, như minh họa trong hình.

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1d87c7dcbedf4e48a701e64d126d0757.jpg`

Giải pháp này sử dụng công nghệ di động giống như điện thoại thông minh. Một ăng-ten được lắp đặt bên ngoài ngôi nhà cung cấp kết nối không dây hoặc có dây cho Devices (các thiết bị) trong nhà. Ở nhiều khu vực, băng thông rộng không dây tại nhà đang cạnh tranh trực tiếp với các dịch vụ DSL và cáp.

## 1.7.10 Kiểm tra hiểu biết của bạn - Xu hướng Network (mạng)

Kiểm tra hiểu biết của bạn về xu hướng network (mạng) bằng cách chọn câu trả lời TỐT NHẤT cho các câu hỏi sau.

## Câu hỏi

Tính năng nào là công cụ hội nghị tốt để sử dụng với những người khác ở nơi khác trong thành phố của bạn hoặc thậm chí ở một quốc gia khác?

Tính năng nào mô tả việc sử dụng các công cụ cá nhân để truy cập thông tin và liên lạc trong toàn doanh nghiệp hoặc khuôn viên network (mạng)?

Tính năng nào chứa các tùy chọn như Công khai, Riêng tư, Tùy chỉnh và Kết hợp?

Tính năng nào đang được sử dụng khi kết nối device (thiết bị) với network (mạng) bằng ổ cắm điện?

Tính năng nào sử dụng công nghệ di động giống như điện thoại thông minh?

## 1.8 Network (mạng) Security (bảo mật)

## 1.8.1 Các mối đe dọa Security (bảo mật)

Chắc chắn bạn đã nghe hoặc đọc những câu chuyện tin tức về một công ty network (mạng) bị vi phạm, cho phép những kẻ đe dọa truy cập vào thông tin cá nhân của hàng nghìn khách hàng. Vì lý do này, network (mạng) Security (bảo mật) luôn là ưu tiên hàng đầu của quản trị viên.

Network (mạng) Security (bảo mật) là một phần không thể thiếu của máy tính Networking (mạng máy tính), bất kể network (mạng) được đặt trong một ngôi nhà có một kết nối Internet hay là một tập đoàn có hàng nghìn người dùng. Network (mạng) Security (bảo mật) phải xem xét đến môi trường cũng như các công cụ và yêu cầu của network (mạng). Nó phải có khả năng bảo mật data (dữ liệu) trong khi vẫn đảm bảo chất lượng dịch vụ mà người dùng mong đợi ở network (mạng).

Việc bảo mật network (mạng) bao gồm các giao thức, công nghệ, Devices (các thiết bị), các công cụ và kỹ thuật nhằm bảo vệ data (dữ liệu) và giảm thiểu các mối đe dọa. Các vectơ đe dọa có thể là bên ngoài hoặc bên trong. Nhiều mối đe dọa network (mạng) Security (bảo mật) bên ngoài ngày nay đều bắt nguồn từ internet.

Có một số mối đe dọa bên ngoài phổ biến đối với Networks (các mạng):

* **Vi-rút, sâu và ngựa Trojan** \- Chúng chứa phần mềm hoặc mã độc hại chạy trên người dùng device (thiết bị).
* **Phần mềm gián điệp và phần mềm quảng cáo** \- Đây là những loại phần mềm được cài đặt trên device (thiết bị) của người dùng. Phần mềm sau đó bí mật thu thập thông tin về người dùng.
* **Các cuộc tấn công zero-day** \- Còn được gọi là các cuộc tấn công zero-hour, những cuộc tấn công này xảy ra vào ngày đầu tiên một lỗ hổng được phát hiện.
* **Tác nhân đe dọa tấn công** \- Kẻ độc hại tấn công tài nguyên Devices (các thiết bị) hoặc network (mạng) của người dùng.
* **Tấn công từ chối dịch vụ** \- Những cuộc tấn công này làm chậm hoặc làm sập các ứng dụng và quy trình trên network (mạng) device (thiết bị).
* **Data (dữ liệu) chặn và đánh cắp** \- Cuộc tấn công này lấy thông tin cá nhân từ network (mạng) của một tổ chức.
* **Trộm cắp danh tính** \- Cuộc tấn công này đánh cắp thông tin đăng nhập của người dùng để truy cập vào data (dữ liệu) riêng tư.

Điều quan trọng không kém là phải xem xét các mối đe dọa nội bộ. Đã có nhiều nghiên cứu cho thấy rằng các vi phạm data (dữ liệu) phổ biến nhất xảy ra do người dùng nội bộ của network (mạng). Điều này có thể được cho là do Devices (các thiết bị) bị mất hoặc bị đánh cắp, nhân viên vô tình sử dụng sai mục đích và trong môi trường kinh doanh, thậm chí cả những nhân viên có ác ý. Với các chiến lược BYOD đang phát triển, data (dữ liệu) của công ty dễ bị tổn thương hơn nhiều. Do đó, khi phát triển chính sách Security (bảo mật), điều quan trọng đối với address (Address) cả các mối đe dọa Security (bảo mật) bên ngoài và bên trong, như trong hình.

**Mô tả hình:** hai mũi tên dẫn đến host (Host) bị xâm phạm; một đến từ đám mây Internet đi qua tường lửa, một đến từ mối đe dọa nội bộ bên trong network (mạng)

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d986070-1c25-11ea-a010-eb2108469056/2d988780-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Nội bộ
Đe dọa | Thỏa hiệp Host (Host) | Bên ngoài
Mối đe dọa

## 1.8.2 Giải pháp Security (bảo mật)

Không có giải pháp đơn lẻ nào có thể bảo vệ network (mạng) khỏi nhiều mối đe dọa tồn tại. Vì lý do này, Security (bảo mật) nên được triển khai trong nhiều Layers (các tầng), sử dụng nhiều giải pháp Security (bảo mật). Nếu một Security (bảo mật) Component (thành phần) không xác định được và bảo vệ network (mạng) thì những network (mạng) khác có thể thành công.

Việc triển khai network (mạng) Security (bảo mật) tại nhà thường khá cơ bản. Thông thường, bạn triển khai nó trên End Devices (các thiết bị đầu cuối), cũng như tại điểm kết nối Internet và thậm chí có thể dựa vào các dịch vụ theo hợp đồng từ ISP.

Đây là những Security (bảo mật) Components (các thành phần) cơ bản dành cho gia đình hoặc văn phòng nhỏ network (mạng):

* **Chống vi-rút và chống phần mềm gián điệp** \- Những ứng dụng này giúp bảo vệ End Devices (các thiết bị đầu cuối) khỏi bị nhiễm phần mềm độc hại.
* **Lọc tường lửa** \- Lọc tường lửa chặn truy cập trái phép vào và ra khỏi network (mạng). Điều này có thể bao gồm hệ thống tường lửa dựa trên host (Host) nhằm ngăn chặn truy cập trái phép vào End Device (thiết bị đầu cuối) hoặc dịch vụ lọc cơ bản trên router (Router) tại nhà để ngăn chặn truy cập trái phép từ thế giới bên ngoài vào network (mạng).

Ngược lại, việc triển khai network (mạng) Security (bảo mật) cho network (mạng) của công ty thường bao gồm nhiều Components (các thành phần) được tích hợp trong network (mạng) để giám sát và lọc lưu lượng. Lý tưởng nhất là tất cả Components (các thành phần) hoạt động cùng nhau, giúp giảm thiểu việc bảo trì và cải thiện Security (bảo mật). Networks (các mạng) lớn hơn và Networks (các mạng) công ty sử dụng tính năng chống vi-rút, chống phần mềm gián điệp và lọc tường lửa, nhưng chúng cũng có các yêu cầu Security (bảo mật) khác:

* **Hệ thống tường lửa chuyên dụng** \- Những hệ thống này cung cấp khả năng tường lửa nâng cao hơn có thể lọc lượng lớn lưu lượng truy cập với mức độ chi tiết hơn.
* **Danh sách kiểm soát truy cập (ACL)** \- Những bộ lọc tiếp theo về quyền truy cập và chuyển tiếp lưu lượng truy cập dựa trên IP Addresses (các Address) và các ứng dụng.
* **Hệ thống ngăn chặn xâm nhập (IPS)** \- Hệ thống này xác định các mối đe dọa lây lan nhanh, chẳng hạn như các cuộc tấn công 0 ngày hoặc 0 giờ.
* ** Riêng tư ảo Networks (các mạng) (VPN)** \- Những dịch vụ này cung cấp quyền truy cập an toàn vào tổ chức cho những người làm việc từ xa.

Các yêu cầu của Network (mạng) Security (bảo mật) phải xem xét đến môi trường, cũng như các ứng dụng khác nhau và yêu cầu tính toán. Cả môi trường gia đình và doanh nghiệp đều phải có khả năng bảo mật data (dữ liệu) của mình trong khi vẫn đảm bảo chất lượng dịch vụ mà người dùng mong đợi ở từng công nghệ. Ngoài ra, giải pháp Security (bảo mật) được triển khai phải có khả năng thích ứng với xu hướng ngày càng tăng và thay đổi của network (mạng).

Nghiên cứu về các kỹ thuật giảm thiểu và mối đe dọa network (mạng) Security (bảo mật) bắt đầu bằng sự hiểu biết rõ ràng về cơ sở hạ tầng Switching (chuyển mạch) và Routing (định tuyến) cơ bản được sử dụng để tổ chức các dịch vụ network (mạng).

**Image asset:** `https://www.netacad.com/authoring-resources/_assets/media/2d98ae90-1c25-11ea-a010-eb2108469056/2d98ae94-1c25-11ea-81a0-ffc2c49b96bc.svg`

**Các nhãn trong hình:** Internet | Danh sách truy cập | Tường lửa | LAN | LAN | Tường lửa | ACL

## 1.8.3 Kiểm tra sự hiểu biết của bạn - Network (mạng) Security (bảo mật)

Kiểm tra sự hiểu biết của bạn về network (mạng) Security (bảo mật) bằng cách chọn câu trả lời TỐT NHẤT cho các câu hỏi sau.

## Câu hỏi

Cuộc tấn công nào làm chậm hoặc làm hỏng thiết bị và chương trình?

Tùy chọn nào tạo kết nối an toàn cho nhân viên từ xa?

Tùy chọn nào chặn truy cập trái phép vào network (mạng) của bạn?

Tùy chọn nào mô tả cuộc tấn công network (mạng) xảy ra vào ngày đầu tiên lỗ hổng được phát hiện?

Tùy chọn nào mô tả mã độc đang chạy trên người dùng Devices (các thiết bị)?

## 1.9 Chuyên gia CNTT

## 1.9.1 CCNA

Là sinh viên NetAcad, bạn có thể đã có nghề nghiệp trong lĩnh vực CNTT hoặc vẫn đang tự học để chuẩn bị cho sự nghiệp của mình. Trong cả hai trường hợp, bạn nên biết về các kỹ năng cần thiết để phù hợp với loại công việc hiện có trong lĩnh vực CNTT.

Vai trò và kỹ năng cần có của các kỹ sư network (mạng) đang phát triển và quan trọng hơn bao giờ hết. Chứng chỉ Cisco Certified Network (mạng) Associate (CCNA) chứng tỏ rằng bạn có kiến ​​thức về các công nghệ nền tảng và đảm bảo bạn luôn phù hợp với các bộ kỹ năng cần thiết để áp dụng các công nghệ thế hệ tiếp theo.

CCNA hợp nhất và cập nhật dành cho kỹ sư Networking (mạng máy tính) là ba khóa học và một bài kiểm tra bao gồm các chủ đề cơ bản cho tất cả các công nghệ network (mạng). CCNA mới tập trung vào nền tảng IP và các chủ đề Security (bảo mật) cùng với khả năng lập trình không dây, ảo hóa, tự động hóa và network (mạng).

Có các chứng chỉ DevNet mới ở cấp độ liên kết, chuyên gia và chuyên nghiệp để xác nhận kỹ năng phát triển phần mềm của bạn.

Có các tùy chọn chứng nhận chuyên môn để xác nhận kỹ năng của bạn phù hợp với vai trò công việc và sở thích của bạn. Điều này bao gồm chứng chỉ Chuyên gia cơ sở hạ tầng nâng cao dành cho doanh nghiệp của Cisco.

Bạn có thể bắt đầu ở nơi bạn muốn. Không có điều kiện tiên quyết nào để bắt đầu đạt được chứng chỉ cấp độ liên kết, chuyên gia, chuyên nghiệp hoặc chuyên gia. Tín dụng giáo dục thường xuyên để tái chứng nhận và phát triển liên tục hiện có sẵn cho CCNA.

## 1.9.2 Công việc Networking (mạng máy tính)

Chứng chỉ CCNA của bạn sẽ giúp bạn chuẩn bị cho nhiều công việc khác nhau trên thị trường ngày nay. Tại [www.netacad.com](http://www.netacad.com), bạn có thể nhấp vào menu Nghề nghiệp rồi chọn Cơ hội việc làm. Bạn có thể tìm thấy cơ hội việc làm tại nơi mình sinh sống bằng cách sử dụng chương trình mới, Công cụ kết nối cầu nối nhân tài. Tìm kiếm việc làm với Cisco, cũng như các đối tác và nhà phân phối của Cisco đang tìm kiếm sinh viên và cựu sinh viên Học viện Cisco Networking (mạng máy tính).

Bạn cũng có thể tìm kiếm việc làm CNTT bằng các công cụ tìm kiếm trực tuyến như Indeed, Glassdoor và Monster. Sử dụng các thuật ngữ tìm kiếm như CNTT, quản trị viên network (mạng), kiến ​​trúc sư network (mạng) và quản trị viên hệ thống máy tính. Bạn cũng có thể tìm kiếm bằng thuật ngữ Cisco CCNA.

## 1.9.3 Lab - Nghiên cứu CNTT và Cơ hội việc làm Networking (mạng máy tính)

Trong phòng thí nghiệm này, bạn sẽ hoàn thành các mục tiêu sau:

* Phần 1: Nghiên cứu cơ hội việc làm
* Phần 2: Suy ngẫm về nghiên cứu

### Nghiên cứu CNTT và Cơ hội việc làm Networking (mạng máy tính)

- Activity instructions: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.9.3-lab---research-it-and-networking-job-opportunities.pdf_en-US_5974c688-00d1-420d-8ae5-433bead3ee22.pdf`

- Packet Tracer file: `https://www.netacad.com/authoring-resources/_assets/en-US/assets/1.9.3-lab---research-it-and-networking-job-opportunities.pdf_en-US_5974c688-00d1-420d-8ae5-433bead3ee22.pdf`

## 1.10 Thực hành và kiểm tra mô-đun

## 1.10.1 Tôi đã học được gì trong học phần này?

**Networks (các mạng) Ảnh hưởng đến cuộc sống của chúng ta**

Trong thế giới ngày nay, thông qua việc sử dụng Networks (các mạng), chúng ta được kết nối hơn bao giờ hết. Những người có ý tưởng có thể giao tiếp ngay lập tức với người khác để biến những ý tưởng đó thành hiện thực. Việc tạo ra các cộng đồng trực tuyến để trao đổi ý tưởng và thông tin có tiềm năng tăng cơ hội năng suất trên toàn cầu. Việc tạo ra đám mây cho phép chúng ta lưu trữ tài liệu, hình ảnh và truy cập chúng mọi lúc, mọi nơi.

**Network (mạng) Components (các thành phần)**

Tất cả các máy tính được kết nối với network (mạng) và tham gia trực tiếp vào giao tiếp network (mạng) đều được phân loại là Hosts (các Host). Hosts (các Host) có thể được gọi là End Devices (các thiết bị đầu cuối). Một số Hosts (các Host) còn được gọi là Clients (các Client). Nhiều máy tính hoạt động như Servers (các Server) và Clients (các Client) trên network (mạng). Loại network (mạng) này được gọi là network (mạng) ngang hàng. End Device (thiết bị đầu cuối) là nguồn hoặc đích của tin nhắn được truyền qua network (mạng). Devices (các thiết bị) trung gian kết nối End Devices (các thiết bị đầu cuối) riêng lẻ với network (mạng) và có thể kết nối nhiều Networks (các mạng) riêng lẻ để tạo thành một mạng lưới liên mạng. Devices (các thiết bị) trung gian sử dụng đích End Device (thiết bị đầu cuối) address (Address), kết hợp với thông tin về các kết nối network (mạng), để xác định đường dẫn mà các tin nhắn sẽ đi qua network (mạng). Phương tiện truyền thông cung cấp kênh để thông điệp truyền từ nguồn tới đích.

**Các biểu diễn và cấu trúc liên kết Network (mạng)**

Sơ đồ của Networks (các mạng) thường sử dụng các ký hiệu để thể hiện các Devices (các thiết bị) khác nhau và các kết nối tạo nên network (mạng). Sơ đồ cung cấp một cách dễ dàng để hiểu cách Devices (các thiết bị) kết nối trong network (mạng) lớn. Loại “hình ảnh” này của network (mạng) được gọi là sơ đồ Topology (cấu trúc liên kết). Sơ đồ Topology (cấu trúc liên kết) vật lý minh họa vị trí vật lý của Devices (các thiết bị) trung gian và lắp đặt cáp. Các sơ đồ logic Topology (cấu trúc liên kết) minh họa Devices (các thiết bị), Ports (các Port) và sơ đồ địa chỉ của network (mạng).

**Các loại Networks (các mạng) phổ biến**

Ngôi nhà nhỏ Networks (các mạng) kết nối một số máy tính với nhau và với internet. Văn phòng nhỏ/văn phòng tại nhà (SOHO) network (mạng) cho phép các máy tính trong văn phòng tại nhà hoặc văn phòng từ xa kết nối với network (mạng) của công ty hoặc truy cập các tài nguyên được chia sẻ, tập trung. Networks (các mạng) từ trung bình đến lớn, chẳng hạn như Networks (các mạng) được các công ty và trường học sử dụng, có thể có nhiều địa điểm với hàng trăm hoặc hàng nghìn Hosts (các Host) được kết nối với nhau. Internet là một network (mạng) của Networks (các mạng) kết nối hàng trăm triệu máy tính trên toàn thế giới. Hai loại cơ sở hạ tầng network (mạng) phổ biến nhất là Local Area Networks (các mạng) (LAN) và Wide Area Networks (các mạng) (WAN). LAN là cơ sở hạ tầng network (mạng) trải rộng trên một khu vực địa lý nhỏ. WAN là cơ sở hạ tầng network (mạng) trải rộng trên một khu vực địa lý rộng lớn. Mạng nội bộ đề cập đến kết nối riêng của mạng LAN và mạng WAN thuộc về một tổ chức. Một tổ chức có thể sử dụng extranet để cung cấp quyền truy cập bảo mật và an toàn cho các cá nhân làm việc cho một tổ chức khác nhưng yêu cầu quyền truy cập vào data (dữ liệu) của tổ chức.

**Kết nối Internet**

Các kết nối internet SOHO bao gồm cáp, DSL, Di động, Vệ tinh và Điện thoại quay số. Kết nối Internet doanh nghiệp bao gồm Đường dây thuê riêng chuyên dụng, Metro Ethernet, DSL doanh nghiệp và Vệ tinh. Việc lựa chọn kết nối khác nhau tùy thuộc vào vị trí địa lý và tính khả dụng của nhà cung cấp dịch vụ. Networks (các mạng) riêng biệt truyền thống sử dụng các công nghệ, quy tắc và tiêu chuẩn khác nhau. Networks (các mạng) hội tụ cung cấp data (dữ liệu), thoại và video giữa nhiều loại Devices (các thiết bị) khác nhau trên cùng một cơ sở hạ tầng network (mạng). Cơ sở hạ tầng network (mạng) này sử dụng cùng một bộ quy tắc, thỏa thuận và tiêu chuẩn triển khai. Packet (Packet) Tracer là một chương trình phần mềm linh hoạt cho phép bạn sử dụng các lý thuyết và biểu diễn network (mạng) để xây dựng các mô hình network (mạng) và khám phá các mạng LAN và WAN tương đối phức tạp.

**Networks (các mạng) đáng tin cậy**

Thuật ngữ kiến ​​trúc network (mạng) đề cập đến các công nghệ hỗ trợ cơ sở hạ tầng cũng như các dịch vụ và quy tắc hoặc giao thức được lập trình để di chuyển data (dữ liệu) trên khắp network (mạng). Khi Networks (các mạng) phát triển, chúng tôi đã biết rằng có bốn đặc điểm cơ bản mà kiến ​​trúc sư network (mạng) phải có address (Address) để đáp ứng mong đợi của người dùng: Khả năng chịu lỗi, Khả năng mở rộng, Chất lượng dịch vụ (QoS) và Security (bảo mật). network (mạng) có khả năng chịu lỗi là thiết bị giới hạn số lượng Devices (các thiết bị) bị ảnh hưởng khi xảy ra lỗi. Có nhiều đường dẫn đến đích được gọi là dự phòng. network (mạng) có thể mở rộng nhanh chóng để hỗ trợ người dùng và ứng dụng mới. Networks (các mạng) có khả năng mở rộng vì các nhà thiết kế tuân theo các tiêu chuẩn và giao thức được chấp nhận. QoS là cơ chế chính để quản lý tắc nghẽn và đảm bảo cung cấp nội dung đáng tin cậy cho tất cả người dùng. Quản trị viên Network (mạng) phải address (Address) hai loại mối quan tâm của network (mạng) Security (bảo mật): network (mạng) cơ sở hạ tầng Security (bảo mật) và thông tin Security (bảo mật). Để đạt được các mục tiêu của network (mạng) Security (bảo mật), có ba yêu cầu chính: Tính bảo mật, Tính toàn vẹn và Tính sẵn sàng.

**Xu hướng Network (mạng)**

Có một số xu hướng Networking (mạng máy tính) gần đây ảnh hưởng đến các tổ chức và người tiêu dùng: Mang Device (thiết bị) của riêng bạn (BYOD), cộng tác trực tuyến, liên lạc video và điện toán đám mây. BYOD có nghĩa là mọi device (thiết bị), với bất kỳ quyền sở hữu nào, được sử dụng ở mọi nơi. Các công cụ cộng tác như Cisco WebEx cung cấp cho nhân viên, sinh viên, giáo viên, khách hàng và đối tác một cách để kết nối, tương tác ngay lập tức và đạt được mục tiêu của họ. Video được sử dụng để liên lạc, cộng tác và giải trí. Cuộc gọi video được thực hiện đến và đi từ bất kỳ ai có kết nối Internet, bất kể họ ở đâu. Điện toán đám mây cho phép chúng ta lưu trữ các tập tin cá nhân, thậm chí sao lưu toàn bộ ổ đĩa trên Servers (các Server) qua internet. Các ứng dụng như xử lý văn bản và chỉnh sửa ảnh có thể được truy cập bằng đám mây. Có bốn loại Đám mây chính: Đám mây công cộng, Đám mây riêng, Đám mây lai và Đám mây tùy chỉnh. Công nghệ nhà thông minh hiện đang được phát triển cho tất cả các phòng trong một ngôi nhà. Công nghệ nhà thông minh sẽ trở nên phổ biến hơn khi nhà Networking (mạng máy tính) và công nghệ internet tốc độ cao ngày càng mở rộng. Sử dụng cùng hệ thống dây dẫn điện, đường dây điện Networking (mạng máy tính) gửi thông tin bằng cách gửi data (dữ liệu) trên các tần số nhất định. Nhà cung cấp dịch vụ Internet không dây (WISP) là ISP kết nối người đăng ký với điểm truy cập hoặc điểm phát sóng được chỉ định bằng cách sử dụng các công nghệ không dây tương tự có trong khu vực nội bộ không dây tại nhà Networks (các mạng) (WLAN).

**Network (mạng) Security (bảo mật)**

Có một số mối đe dọa bên ngoài phổ biến đối với Networks (các mạng):

* Virus, sâu và ngựa Trojan
* Phần mềm gián điệp và phần mềm quảng cáo
* Tấn công zero-day
* Các cuộc tấn công của tác nhân đe dọa
* Tấn công từ chối dịch vụ
* Đánh chặn và trộm cắp Data (dữ liệu)
* Trộm cắp danh tính

Đây là những Security (bảo mật) Components (các thành phần) cơ bản dành cho gia đình hoặc văn phòng nhỏ network (mạng):

* Chống virus và phần mềm gián điệp
* Lọc tường lửa

Networks (các mạng) lớn hơn và Networks (các mạng) công ty sử dụng tính năng chống vi-rút, chống phần mềm gián điệp và lọc tường lửa, nhưng chúng cũng có các yêu cầu Security (bảo mật) khác:

* Hệ thống tường lửa chuyên dụng
* Danh sách kiểm soát truy cập (ACL)
* Hệ thống ngăn chặn xâm nhập (IPS)
* Riêng tư ảo Networks (các mạng) (VPN)

**Chuyên gia CNTT**

Chứng chỉ Cisco Certified Network (mạng) Associate (CCNA) chứng tỏ rằng bạn có kiến ​​thức về các công nghệ nền tảng và đảm bảo bạn luôn phù hợp với các bộ kỹ năng cần thiết để áp dụng các công nghệ thế hệ tiếp theo. Chứng chỉ CCNA của bạn sẽ giúp bạn chuẩn bị cho nhiều công việc khác nhau trên thị trường ngày nay. Tại [www.netacad.com](http://www.netacad.com), bạn có thể nhấp vào menu Nghề nghiệp rồi chọn Cơ hội việc làm. Bạn có thể tìm thấy cơ hội việc làm tại nơi mình sinh sống bằng cách sử dụng Công cụ kết nối cầu nối tài năng. Tìm kiếm việc làm với Cisco cũng như các đối tác và nhà phân phối của Cisco đang tìm kiếm sinh viên và cựu sinh viên Học viện Cisco Networking (mạng máy tính).

## Câu hỏi

Trong quá trình kiểm tra định kỳ, một kỹ thuật viên đã phát hiện ra rằng phần mềm được cài đặt trên máy tính đang bí mật thu thập data (dữ liệu) về các trang web được người dùng máy tính truy cập. Loại mối đe dọa nào đang ảnh hưởng đến máy tính này?

Thuật ngữ nào đề cập đến network (mạng) cung cấp quyền truy cập an toàn vào văn phòng công ty cho các nhà cung cấp, khách hàng và cộng tác viên?

Một tập đoàn lớn đã sửa đổi network (mạng) của mình để cho phép người dùng truy cập tài nguyên network (mạng) từ máy tính xách tay cá nhân và điện thoại thông minh của họ. Xu hướng Networking (mạng máy tính) này mô tả xu hướng nào?

ISP là gì?

Trong trường hợp nào việc sử dụng WISP sẽ được khuyến nghị?

Đặc điểm nào của network (mạng) cho phép nó phát triển nhanh chóng để hỗ trợ người dùng và ứng dụng mới mà không ảnh hưởng đến hiệu suất của dịch vụ được cung cấp cho người dùng hiện tại?

Một trường đại học đang xây dựng một ký túc xá mới trong khuôn viên trường. Các công nhân đang đào đất để lắp đặt đường ống nước mới cho khu ký túc xá. Một công nhân vô tình làm hỏng cáp quang nối hai ký túc xá hiện có với trung tâm data (dữ liệu) của khuôn viên trường. Mặc dù cáp đã bị cắt nhưng sinh viên trong ký túc xá chỉ bị gián đoạn dịch vụ network (mạng) trong thời gian rất ngắn. Đặc điểm nào của network (mạng) được thể hiện ở đây?

Hai đặc điểm của network (mạng) có thể mở rộng là gì? (Chọn hai.)

device (thiết bị) nào thực hiện chức năng xác định đường dẫn mà các tin nhắn sẽ đi qua mạng?

Hai tùy chọn kết nối Internet nào không yêu cầu phải chạy cáp vật lý đến tòa nhà? (Chọn hai.)

Người dùng gia đình phải truy cập loại network (mạng) nào để mua sắm trực tuyến?

BYOD thay đổi cách doanh nghiệp triển khai Networks (các mạng) như thế nào?​

Một nhân viên muốn truy cập network (mạng) của tổ chức từ xa, theo cách an toàn nhất có thể. Tính năng network (mạng) nào sẽ cho phép nhân viên có được quyền truy cập từ xa an toàn vào network (mạng) của công ty?

Internet là gì?

Hai chức năng của End Devices (các thiết bị đầu cuối) trên network (mạng) là gì? (Chọn hai.)

## Quy ước dịch thuật

- Thuật ngữ kỹ thuật được giữ bằng tên tiếng Anh và ghi nghĩa tiếng Việt trong ngoặc tròn ở lần xuất hiện đầu tiên, ví dụ: Networking (mạng máy tính).
- Cisco IOS, CLI, địa chỉ IP/MAC, tên giao thức, từ viết tắt, URL, lệnh, Image asset và tên file được giữ nguyên.
- Trình bày theo bố cục liền mạch của khóa học; bảng, video, hình, animation và Packet Tracer vẫn giữ vị trí tương ứng với bản tiếng Anh.

## Trạng thái dịch thuật

- Đã hoàn thành: Module 1 — Networking Today (Mạng ngày nay).
- Các Module 2 đến Module 17 vẫn đang chờ dịch tiếp.
- Bản dịch Module 1 được lưu đồng thời trong [Introduction_to_Networks_VI.md](./Introduction_to_Networks_VI.md) để đối chiếu.
