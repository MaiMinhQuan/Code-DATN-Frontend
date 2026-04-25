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

  // ─── Error Categories (dùng chung ErrorTooltip + BandScorePanel) ─────────
  ERROR_CATEGORY: {
    GRAMMAR:       "Grammar",
    SPELLING:      "Spelling",
    VOCABULARY:    "Vocabulary",
    COHERENCE:     "Coherence",
    TASK_RESPONSE: "Task Response",
    PUNCTUATION:   "Punctuation",
  },

  // ─── Result Page ─────────────────────────────────────────────────────────
  RESULT: {
    // Page states
    LOADING:         "Đang tải kết quả...",
    PROCESSING:      "Bài đang được xử lý, vui lòng chờ...",
    ERROR_LOAD:      "Không thể tải kết quả. Vui lòng thử lại.",
    ERROR_FAILED:    "Chấm bài thất bại. Vui lòng nộp lại.",

    // Navigation
    BTN_BACK:        "Quay lại",
    BTN_NEW_PRACTICE: "Làm bài mới",

    // Panel headers
    PANEL_ESSAY:     "Bài viết của bạn",
    PANEL_RESULT:    "Kết quả chấm bài",

    // Strategy toggle
    STRATEGY_LABEL:  "Highlight:",

    // BandScorePanel — section labels
    OVERALL_BAND:    "Overall Band Score",
    SCORE_BREAKDOWN: "Score Breakdown",
    ERRORS_FOUND:    (count: number) => `Errors Found (${count})`,
    FEEDBACK:        "General Feedback",
    STRENGTHS:       "Strengths",
    IMPROVEMENTS:    "Areas to Improve",

    // BandScorePanel — 4 criteria
    CRITERIA_TR:     "Task Response",
    CRITERIA_CC:     "Coherence",
    CRITERIA_LR:     "Lexical",
    CRITERIA_GRA:    "Grammar",

    // Recharts tooltip
    CHART_SCORE:     "Score",

    // ErrorTooltip — section labels
    TOOLTIP_SUGGESTION:  "Suggestion",
    TOOLTIP_EXPLANATION: "Explanation",
  },


} as const;
