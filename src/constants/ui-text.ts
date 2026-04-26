export const UI_TEXT = {
  // ─── Metadata ────────────────────────────────────────────
  META: {
    SITE_NAME: "IELTS Writing AI",
    SITE_DESCRIPTION:
      "Nền tảng luyện IELTS Writing Task 2 tích hợp AI chấm bài",
  },

  // ─── Dùng chung ──────────────────────────────────────────
  COMMON: {
    PLACEHOLDER_EMAIL: "example@email.com",
    PLACEHOLDER_PASSWORD: "••••••••",
    EMPTY_VALUE: "—",
    FALLBACK_USER_NAME: "bạn",
    FALLBACK_USER_DISPLAY: "Người dùng",
  },

  // ─── Validation ──────────────────────────────────────────
  VALIDATION: {
    EMAIL_INVALID: "Email không hợp lệ",
    PASSWORD_MIN: "Mật khẩu tối thiểu 6 ký tự",
    FULL_NAME_MIN: "Tên tối thiểu 2 ký tự",
    FULL_NAME_MAX: "Tên tối đa 30 ký tự",
    PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  },

  // ─── Trang Login ─────────────────────────────────────────
  LOGIN: {
    HEADING: "IELTS Writing AI",
    SUBHEADING: "Đăng nhập để tiếp tục luyện tập",
    LABEL_EMAIL: "Email",
    LABEL_PASSWORD: "Mật khẩu",
    BTN_SUBMIT: "Đăng nhập",
    LINK_REGISTER: "Đăng ký ngay",
    HINT_NO_ACCOUNT: "Chưa có tài khoản?",
    TOAST_ERROR: "Email hoặc mật khẩu không đúng",
    TOAST_SUCCESS: "Đăng nhập thành công!",
  },

  // ─── Trang Register ──────────────────────────────────────
  REGISTER: {
    HEADING: "Tạo tài khoản",
    SUBHEADING: "Bắt đầu hành trình IELTS của bạn",
    LABEL_FULL_NAME: "Họ và tên",
    LABEL_EMAIL: "Email",
    LABEL_PASSWORD: "Mật khẩu",
    LABEL_CONFIRM_PASSWORD: "Xác nhận mật khẩu",
    PLACEHOLDER_FULL_NAME: "Nguyễn Văn A",
    BTN_SUBMIT: "Đăng ký",
    LINK_LOGIN: "Đăng nhập",
    HINT_HAS_ACCOUNT: "Đã có tài khoản?",
    TOAST_SUCCESS_REDIRECT: "Đăng ký thành công! Vui lòng đăng nhập.",
    TOAST_SUCCESS_AUTO_LOGIN: "Chào mừng bạn đến với IELTS Writing AI!",
    TOAST_ERROR_FALLBACK: "Đăng ký thất bại",
  },

  // ─── Sidebar ─────────────────────────────────────────────
  SIDEBAR: {
    LOGO_TEXT: "IELTS Writing AI",
    NAV_DASHBOARD: "Tổng quan",
    NAV_PRACTICE: "Luyện tập",
    NAV_COURSES: "Khóa học",
    NAV_SAMPLE_ESSAYS: "Bài mẫu",
    NAV_FLASHCARDS: "Thẻ từ vựng",
    NAV_NOTEBOOK: "Sổ tay",
  },

  // ─── Topbar ──────────────────────────────────────────────
  TOPBAR: {
    GREETING: "Chào mừng trở lại 👋",
    BTN_LOGOUT: "Đăng xuất",
  },

  // ─── Dashboard ───────────────────────────────────────────
  DASHBOARD: {
    GREETING: (name: string) => `Xin chào, ${name} 👋`,
    SUBHEADING: "Hôm nay bạn muốn luyện tập chủ đề nào?",
    STAT_SUBMISSIONS: "Bài đã nộp",
    STAT_AVG_BAND: "Band trung bình",
    STAT_STREAK: "Streak hiện tại",
    PLACEHOLDER_COMING_SOON:
      "Các module đang được phát triển — Giai đoạn 2 & 3 sắp ra mắt.",
  },

  // ─── Practice ────────────────────────────────────────────
  PRACTICE: {
    BTN_SAVE_DRAFT: "Lưu nháp",
    BTN_SUBMIT: "Nộp bài",
    BTN_SUBMITTING: "Đang nộp...",
    LABEL_WORD_COUNT: (count: number) => `${count} từ`,
    WORD_COUNT_MIN: 250,
    WORD_COUNT_HINT: "Tối thiểu 250 từ",
    DRAFT_SAVED: "Đã lưu nháp",
    TOPIC_LABEL: "Chủ đề",
    TARGET_BAND_LABEL: "Mục tiêu",
    TASK_INSTRUCTION: "Hướng dẫn làm bài",
    GRADING_IDLE: "Viết bài và nhấn Nộp bài để AI chấm điểm",
    GRADING_WAITING: "Đang chờ hàng đợi...",
    GRADING_PROCESSING: "AI đang chấm bài...",
    GRADING_COMPLETED: "Chấm bài hoàn tất!",
    GRADING_FAILED: "Có lỗi xảy ra khi chấm bài",
    GRADING_LABEL_OVERALL: "Band dự kiến",
    PLACEHOLDER_ESSAY: "Bắt đầu viết bài của bạn tại đây...",
  },

  // ─── Result ──────────────────────────────────────────────
  RESULT: {
    TOOLTIP_SUGGESTION_LABEL: "Gợi ý",
    SEVERITY_HIGH: "Cao",
    SEVERITY_MEDIUM: "Trung bình",
    SEVERITY_LOW: "Thấp",
    SCORE_LABEL_TASK: "Task Response",
    SCORE_LABEL_COHERENCE: "Coherence & Cohesion",
    SCORE_LABEL_LEXICAL: "Lexical Resource",
    SCORE_LABEL_GRAMMAR: "Grammatical Range",
    SCORE_LABEL_OVERALL: "Overall Band",
    FEEDBACK_GENERAL: "Nhận xét chung",
    FEEDBACK_STRENGTHS: "Điểm mạnh",
    FEEDBACK_IMPROVEMENTS: "Cần cải thiện",
    ERROR_LIST_TITLE: "Danh sách lỗi",
    ERROR_FILTER_ALL: "Tất cả",
    RESULT_LOADING: "Đang tải kết quả...",
    RESULT_NOT_FOUND: "Không tìm thấy kết quả",
    TOOLTIP_CATEGORY_LABEL: "Loại lỗi",
    TOOLTIP_SEVERITY_LABEL: "Mức độ",
  },

  // ─── Sample Essays ───────────────────────────────────────────
  SAMPLE_ESSAYS: {
    PAGE_TITLE: "Bài mẫu IELTS",
    PAGE_SUBTITLE: "Tham khảo các bài viết mẫu đã được AI chấm điểm",
    BADGE_TASK_1: "Task 1",
    BADGE_TASK_2: "Task 2",
    CARD_READ_MORE: "Đọc bài",
    FILTER_TASK_ALL: "Tất cả",
    FILTER_TASK_1: "Task 1",
    FILTER_TASK_2: "Task 2",
    FILTER_BAND_ALL: "Mọi band",
    FILTER_BAND_LOW: "Band 5.0",
    FILTER_BAND_MID: "Band 6.0",
    FILTER_BAND_HIGH: "Band 7+",
    BTN_RESET_FILTER: "Đặt lại",
    EMPTY_STATE: "Không có bài mẫu nào phù hợp",
    EMPTY_STATE_HINT: "Thử thay đổi bộ lọc",
    DETAIL_BACK: "Danh sách bài mẫu",
    DETAIL_LABEL_QUESTION: "Đề bài",
    DETAIL_LABEL_INFO: "Thông tin bài viết",
    DETAIL_LABEL_BAND: "Band Score",
    DETAIL_LABEL_TASK: "Loại bài",
    DETAIL_LABEL_TOPIC: "Chủ đề",
    DETAIL_LABEL_AUTHOR: "Tác giả",
    DETAIL_NO_ANNOTATION: "Bài viết này chưa có phân tích lỗi chi tiết",
    DETAIL_NOT_FOUND: "Không tìm thấy bài mẫu",
  },

  NOTEBOOK: {
    PAGE_TITLE:          "Sổ tay của tôi",
    PAGE_SUBTITLE:       "Ghi chú cá nhân trong quá trình luyện tập",
    BTN_NEW_NOTE:        "Ghi chú mới",
    BTN_SAVE:            "Lưu thay đổi",
    BTN_CREATE:          "Tạo ghi chú",
    UNTITLED:            "Ghi chú không có tiêu đề",
    NOTE_COUNT_LABEL:    "ghi chú",
    PLACEHOLDER_TITLE:   "Tiêu đề (tùy chọn)",
    PLACEHOLDER_CONTENT: "Viết ghi chú của bạn...",
    EMPTY_LIST:          "Chưa có ghi chú nào",
    EMPTY_LIST_HINT:     "Nhấn \"Ghi chú mới\" để bắt đầu",
    EMPTY_SELECT:        "Chọn một ghi chú hoặc tạo mới",
    EMPTY_SELECT_HINT:   "Ghi chú của bạn sẽ hiển thị ở đây",
    DELETE_CONFIRM:      "Bạn có chắc muốn xóa ghi chú này không?",
  },

  COURSES: {
    PAGE_TITLE: "Khoá học",
    PAGE_SUBTITLE: "Tài liệu học IELTS Writing theo từng band điểm",
    FILTER_TOPIC_ALL: "Tất cả chủ đề",
    EMPTY_COURSES: "Không có khoá học nào",
    EMPTY_COURSES_HINT: "Thử thay đổi bộ lọc chủ đề",
    EMPTY_LESSONS: "Khoá học chưa có bài học",
    LABEL_LESSONS: (n: number) => `${n} bài học`,
    LABEL_INSTRUCTOR: "Giảng viên",
    TAB_VIDEOS: "Video",
    TAB_VOCABULARY: "Từ vựng",
    TAB_GRAMMAR: "Ngữ pháp",
    TAB_NOTES: "Ghi chú",
    EMPTY_VIDEOS: "Chưa có video",
    EMPTY_VOCABULARY: "Chưa có từ vựng",
    EMPTY_GRAMMAR: "Chưa có ngữ pháp",
    EMPTY_NOTES: "Chưa có ghi chú",
    LABEL_DURATION: (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
    BTN_RESET_FILTER: "Đặt lại",
    DETAIL_BACK: "Quay lại",
    DETAIL_SELECT_LESSON: "Chọn một bài học để bắt đầu",
    DETAIL_LESSON_LOADING: "Đang tải bài học...",
  },




} as const;
