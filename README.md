# Hải Anh & Thanh Hà | Wedding Invitation

Website thiệp cưới online tĩnh, mobile-first, dùng HTML5, CSS3 và JavaScript thuần. Giao diện được chỉnh theo hướng bám sát template CineLove 15 bằng CSS/JS tự viết, không sao chép code hoặc asset độc quyền.

## Cấu trúc file

```text
.
├── .gitignore
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   ├── cover.jpg
│   │   ├── hero-ref15.png
│   │   ├── studio-full-ref15.png
│   │   └── ...
│   └── music/
│       └── wedding.mp3
└── README.md
```

## Nội dung hiện có

Trang hiện gồm:

```text
Màn mở thiệp sang hai bên
Hero theo template 15
Lịch cưới
Lời mời
Album ảnh cưới
Monogram / câu quote
Nhà gái / nhà trai
Hai sự kiện cưới
Lời cảm ơn
Tim rơi hai bên thiệp
```

Các mục phụ không dùng trong bản hiện tại đã được lược bỏ khỏi giao diện.

## Đổi thông tin

Mở `js/main.js` và sửa `WEDDING_CONFIG` ở đầu file:

```js
const WEDDING_CONFIG = {
    bride: "Thanh Hà",
    groom: "Hải Anh",
    weddingDate: "2026-09-12T10:30:00",
    venue: "Trung tâm tiệc cưới ABC",
    address: "123 Nguyễn Trãi, Hà Nội",
    googleMapsUrl: "https://maps.google.com/?q=123%20Nguyen%20Trai%2C%20Ha%20Noi"
};
```

Tên khách mời vẫn hỗ trợ qua query parameter:

```text
https://username.github.io/wedding/?guest=Nguyen%20Van%20A
```

## Nhạc nền

Website đang dùng:

```text
./assets/music/wedding.mp3
```

Để đổi nhạc, thay file này hoặc sửa đường dẫn trong `index.html`.

## GitHub Pages

Chạy tại thư mục root của repo:

```bash
git init
git add .
git commit -m "Initial wedding invitation"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

Sau đó vào GitHub:

```text
Settings
Pages
Deploy from branch
Branch: main
Folder: /root
Save
```

Tất cả asset đang dùng relative path, phù hợp GitHub Pages.
