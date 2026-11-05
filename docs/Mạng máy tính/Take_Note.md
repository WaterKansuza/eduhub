# Buổi 1
## Giới thiệu về môn học
Checkpoint Exam sẽ mở sau khi đến hạn
Thời gian mở 1 tuần
Chuyên cần giữa kì sẽ được tính như sau: Sẽ có 6 bài Checkpoint Exam, đến ngày mở thì phải làm, có thể làm đi làm lại nhưng phải làm, chỉ cần **thiếu 1** là bị **cấm thi**, điểm chuyên cần dựa trên **số lần làm bài** Checkpoint Exam.
Làm hết bài Checkpoint (17 module) sẽ có 1 bài Final Exam (bài này để lấy điểm giữa kì, chỉ được làm 1 lần)
Tải phần mềm Cisco Packet Tracer để làm các bài lab

Môn giới thiệu những cái bắt đầu của mạng máy tính (Nhập môn mạng máy tính là môn 1/3 của mạng máy tính)
Cách tạo lập hệ thống mạng, cách duy trì, học cấu hình làm cách nào để các máy tính có thể hoạt động trơn tru và thông suốt với nhau.
Trên trang Cisco thể học ở các học phần có self-paced
## Bài học
- thi hết học phần sẽ làm bài lab, lên phòng thực hành và làm bài lab, gõ các câu lệnh, khi gõ lệnh xong thì sẽ có điểm.
[Không quan trọng với thi]
Giới thiệu về sự ảnh hưởng mạng với cuộc sống, hình thái của mạng, các loại mạng khác nhau, các phương pháp kết nối internet, xu hướng của hệ thống mạng bây giờ, giới thiệu về nghề nghiệp,...

Intranet: mạng nội bộ, intranet có thể là WAN, là tập hợp riêng mạng nội bộ của một tổ chức.
Extranet: Cung cấp quyền truy cập an toàn vào mạng cho đối tượng bên ngoài.
DSL: Kênh thuê bao kĩ thuật số băng thông rộng.
Mạng hội tụ: Trước đi đường cáp riêng cho từng dịch vụ, ví dụ kết nối internet: Kéo 1 đường internet, kết nối TV, dùng dây cáp. Bây giờ mạng hội tụ có thể cung cấp nhiều thứ trên cùng một nơi.

Module 2 (Cực kì quan trọng) 
Cisco IOS Access
Shell: Giao diện cụ thể, CLI và GUI, CLI: Giao diện dòng lệnh và GUI: Giao diện đồ họa
Kernel: phần lõi của hệ điều hành, chịu trách nhiệm giao tiếp trực tiếp với phần cứng và quản lý tài nguyên hệ thống như CPU, bộ nhớ và thiết bị ngoại vi
Hardware: Phần Cứng của máy tính

Console 
Secure Shell (SSH): Kết nối từ xa, tạo virtual để kết nối để an toàn, nội dung được mã hóa.
Telnet: Cũng là kết nối từ xa nhưng không an toàn vì mọi thứ đều được gửi qua văn bảng thường và không được mã hóa

Tải: puTTy:..., wireshark: công cụ để phân tích gói tin của hệ thống mạng (sau này sẽ dùng)

Cisco Packet Tracer:
Góc trái dưới có Network Devices: Chọn các Device ở ô trái, ô thứ 2 tia sét đỏ vàng là automatic: Tự động chọn 
Muốn kết nối có thể dùng ping (muốn kết nối phải biết địa chỉ IP)
vào cmd ping [IP]
    1 cổng control bên trái
    giữa có các cổng LAN
    bên phải có cổng GIGA
Bấm con PC0, bấm Terminal (sau khi kết nối Console)
gõ lệnh: 
enable
configure terminal
hostname S1 (đặt tên)

conf t
banner motd #XIN CHAO. VUI LONG NHAP PASS#
exit
copy running-config startup-config
(sau khi set cấu hình xong thì phải nhập lệnh trên để nó lưu lại)
Viết tắt: copy run st

địa chỉ IP, phương tiện để các máy định vị lẫn nhau, IPv4 mặt nạ mạng con luôn đi kèm địa chỉ mạng có 32-bit.
Cổng mặc định, địa chỉ ip của bộ định tuyến, máy chủ sẽ truy cập ra ngoài.
IPv6 có 128 bit và sẽ đổi sang thập lục phân (HEX) tức là vẫn có 32bit có 4 giá trị ở 1 cặp.

cấu hình địa chỉ ip cho switch, đặt địa chỉ IP qua VLAN (mạng ảo)
interface vlan 1
ip address 192.168.1.254.255.255.255.0
no shutdown (để bật cổng lên)