# 🎯 Dự án môn Lý thuyết đồ thị

Chào mừng bạn đến với repository của dự án môn Lý thuyết đồ thị! 🚀 Đây là một ứng dụng web trực quan giúp bạn thao tác với các thuật toán đồ thị một cách dễ dàng, trực quan và sinh động nhất.

## 📌 Công nghệ sử dụng

Dự án này được xây dựng bằng các công nghệ hiện đại để mang lại trải nghiệm tốt nhất:
- **React + TypeScript**: Cung cấp sự linh hoạt và an toàn về kiểu dữ liệu.
- **Vite**: Build tool siêu nhanh giúp tăng tốc quá trình phát triển.
- **Ant Design**: Bộ thư viện UI mạnh mẽ giúp giao diện đẹp và dễ sử dụng.
- **Tailwind CSS**: Giúp thiết kế UI nhanh chóng mà vẫn giữ được tính nhất quán.
- **Cytoscape.js**: Để hiển thị và thao tác với đồ thị một cách trực quan.
- **ESLint + Prettier**: Hỗ trợ kiểm tra và format code để giữ codebase sạch sẽ, dễ đọc.

## 🚀 Các tính năng nổi bật
- Vẽ và tương tác với đồ thị một cách trực quan.
- Hỗ trợ ownload hình ảnh đồ thị dưới dạng png.
- Hỗ trợ các thuật toán cơ bản như BFS, DFS, Dijkstra, Floyd-Warshall, Bellman-Ford...
- Hiển thị bước chạy của thuật toán bằng animation để dễ dàng theo dõi.
- Cho phép nhập dữ liệu đồ thị trực tiếp trên giao diện.
- Giao diện đẹp, dễ sử dụng, phù hợp cho sinh viên học tập và nghiên cứu.

## 📦 Cài đặt và chạy dự án

Để bắt đầu, hãy chạy các lệnh sau:

```bash
# Clone repository
git clone https://github.com/your-repo/project-graph-theory.git
cd project-graph-theory

# Cài đặt dependencies
yarn install  # Hoặc npm install

# Chạy ứng dụng
yarn dev  # Hoặc npm run dev
```

Sau đó, mở trình duyệt và truy cập `http://localhost:5173/` để bắt đầu trải nghiệm!

Hoặc bạn có thể trải nghiệm trực tiếp trang web qua link sau: [Link đến ứng dụng](#) 🚀

## 👨‍💻 Người phát triển
Dự án được thực hiện bởi:
- **Lê Hoàng Nhi** - Phát triển, thiết kế ứng dụng và kiểm thử.
- **Nguyễn Trường Hưng** - Phát triển, thiết kế ứng dụng và kiểm thử.
- **Trần Văn Nghĩa** - Phát triển, thiết kế ứng dụng và kiểm thử.
- **Trần Minh Quang** - Phát triển, thiết kế ứng dụng và kiểm thử.

## 📖 Mở rộng cấu hình ESLint

Nếu bạn muốn áp dụng các quy tắc kiểm tra mã nguồn chặt chẽ hơn, có thể điều chỉnh ESLint như sau:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Ngoài ra, có thể thêm plugin **eslint-plugin-react** để tối ưu hóa kiểm tra code React:

```js
import react from 'eslint-plugin-react';

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

## 💡 Đóng góp

Chúng tôi luôn chào đón các đóng góp từ cộng đồng! Nếu bạn muốn tham gia phát triển dự án, hãy thực hiện các bước sau:

1. **Fork repository** và tạo branch mới.
2. Thực hiện các thay đổi hoặc bổ sung tính năng.
3. Gửi pull request để nhóm xem xét và tích hợp vào dự án chính.
4. Thảo luận với cộng đồng để cải thiện dự án.

Cảm ơn bạn đã quan tâm đến dự án của chúng tôi! 🎉

## 🎯 Mục tiêu của dự án

Dự án này không chỉ phục vụ cho môn học mà còn giúp các bạn sinh viên có công cụ trực quan để học và hiểu rõ hơn về các thuật toán đồ thị. Nếu bạn có ý tưởng hay ho hoặc muốn đóng góp, hãy tham gia cùng chúng mình nhé! 😍

---

Chúc các bạn có một trải nghiệm tuyệt vời với dự án này! 🚀

---

# 🎯 Graph Theory Project

Welcome to the repository of the Graph Theory course project! 🚀 This is an interactive web application that allows you to work with graph algorithms in the most intuitive and dynamic way.

## 📌 Technologies Used

This project is built with modern technologies to provide the best experience:
- **React + TypeScript**: Provides flexibility and type safety.
- **Vite**: A super-fast build tool that accelerates development.
- **Ant Design**: A powerful UI library for a beautiful and user-friendly interface.
- **Tailwind CSS**: Enables fast UI design while maintaining consistency.
- **Cytoscape.js**: To visualize and interact with graphs dynamically.
- **ESLint + Prettier**: Ensures code quality and formatting.

## 🚀 Key Features
- Draw and interact with graphs intuitively.
- Support for exporting graph images in PNG format.
- Supports basic algorithms such as BFS, DFS, Dijkstra, Floyd-Warshall, Bellman-Ford...
- Animations to visualize algorithm execution step-by-step.
- Allows graph data input from files or direct user input.
- User-friendly interface designed for students and researchers.

## 📦 Installation & Running the Project

To get started, run the following commands:

```bash
# Clone the repository
git clone https://github.com/your-repo/project-graph-theory.git
cd project-graph-theory

# Install dependencies
yarn install  # Or npm install

# Run the application
yarn dev  # Or npm run dev
```

Then open your browser and go to `http://localhost:5173/` to start exploring!

Or you can experience the web application directly via this link: [Live Application](#) 🚀

## 👨‍💻 Developers
This project was developed by:
- **Le Hoang Nhi** - Development, application design, and testing.
- **Nguyen Truong Hung** - Development, application design, and testing.
- **Tran Van Nghia** - Development, application design, and testing.
- **Tran Minh Quang** - Development, application design, and testing.

## 💡 Contribution

We welcome contributions from the community! If you’d like to contribute, follow these steps:

1. **Fork the repository** and create a new branch.
2. Make changes or add new features.
3. Submit a pull request for review and integration.
4. Discuss with the community to enhance the project.

Thank you for your interest in our project! 🎉

## 🎯 Project Goals

This project is not only for academic purposes but also provides students with an intuitive tool to learn and understand graph algorithms better. If you have interesting ideas or want to contribute, feel free to join us! 😍

---

We hope you have a fantastic experience with this project! 🚀
