# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi trong file này.

Format dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/) và [Semantic Versioning](https://semver.org/lang/vi/).

## [Unreleased]

### Đã thêm
- (Ghi tính năng mới tại đây trước khi phát hành bản tiếp theo)

## [1.2.0] - 2026-05-26

### Đã thêm
- Chấm bài qua HuggingFace Inference Endpoint (vLLM) với structured JSON output.
- Admin: xem chi tiết submission (`/admin/submissions/:id`).
- Admin: danh sách submissions theo user (sửa lỗi phân trang).
- Component `SubmissionDetailView` dùng chung cho học viên và admin.
- Hệ thống quản lý phiên bản: `VERSION`, `CHANGELOG.md`, API `/api/version`, trang lịch sử cập nhật.

### Đã thay đổi
- Sample Essay: bỏ `targetBand`, chỉ dùng `overallBandScore` (schema, API, admin UI, seed).
- Favorite essays: populate `overallBandScore` thay cho `targetBand`.

### Đã sửa
- Admin API submissions trả 400 khi thiếu query `page`/`limit` (dùng `DefaultValuePipe`).

## [1.1.0] - 2026-05-26

### Đã thêm
- Admin Dashboard: Topics, Courses, Lessons, Exam Questions, Sample Essays, Users, Pipeline.
- WebSocket: `submission_status_updated`, `submission_progress`, `pipeline_progress`.
- Pipeline tạo học liệu: jobs, analyze, seed, duyệt candidates/lessons.
- Trang admin bảo vệ role ADMIN; sidebar link Quản trị.

## [1.0.0] - 2026-03-01

### Đã thêm
- Xác thực JWT (đăng ký, đăng nhập, phân quyền STUDENT / ADMIN).
- Luyện viết Task 2: đề thi, draft, nộp bài, chấm AI (Google Gemini).
- Kết quả chấm: 4 tiêu chí IELTS, lỗi highlight, strengths/improvements.
- Khóa học, bài học (video, từ vựng, ngữ pháp), bài mẫu, flashcards, sổ tay.
- Dashboard học viên, NextAuth, React Query, Socket.io client.

[Unreleased]: https://github.com/your-org/ielts-writing/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/your-org/ielts-writing/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/your-org/ielts-writing/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/your-org/ielts-writing/releases/tag/v1.0.0
