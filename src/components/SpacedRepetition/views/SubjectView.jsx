import React, { useState } from "react";
import { getDueLabel } from "../utils/srs";

/**
 * Danh sách bài của 1 môn - thêm/sửa/xóa bài
 */
export function SubjectView({
  subject,
  lessons,
  onBack,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReview,
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateLesson(editingId, { title: title.trim(), content: content.trim() });
      setEditingId(null);
    } else {
      onAddLesson(title.trim(), content.trim());
    }
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setContent(lesson.content);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = (lesson) => {
    if (confirm(`Xóa bài "${lesson.title}"?`)) {
      onDeleteLesson(lesson.id);
      if (editingId === lesson.id) {
        resetForm();
      }
      if (expandedId === lesson.id) {
        setExpandedId(null);
      }
    }
  };

  const getStatusBadge = (lesson) => {
    const styles = {
      new: { bg: "#e3f2fd", color: "#1565c0", label: "Mới" },
      learning: { bg: "#fff3cd", color: "#856404", label: "Đang học" },
      reviewing: { bg: "#d4edda", color: "#155724", label: "Đang ôn" },
      mastered: { bg: "#d1ecf1", color: "#0c5460", label: "Đã thuộc" },
    };
    const s = styles[lesson.status] || styles.new;
    return (
      <span
        style={{
          padding: "3px 8px",
          background: s.bg,
          color: s.color,
          borderRadius: 10,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          ← Quay lại danh sách môn
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: subject.color,
              }}
            />
            {subject.name}
          </h2>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Thêm bài
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #e9ecef",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: 16 }}>
            {editingId ? "✏️ Sửa bài" : "➕ Thêm bài mới"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Tiêu đề bài:
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Chương 1 - Đại số tuyến tính"
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Nội dung / Ghi chú (tùy chọn):
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tóm tắt nội dung bài học..."
                rows={4}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {editingId ? "Cập nhật" : "Thêm"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "8px 16px",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách bài */}
      {lessons.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            background: "#f8f9fa",
            borderRadius: 12,
            color: "#888",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}></div>
          <p>Chưa có bài nào trong môn này.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lessons.map((lesson) => {
            const isExpanded = expandedId === lesson.id;
            const dueLabel = getDueLabel(lesson.dueDate);
            const isDue = lesson.dueDate <= Date.now();

            return (
              <div
                key={lesson.id}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  border: `1px solid ${isDue ? "#ffc107" : "#e9ecef"}`,
                  padding: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : lesson.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <h4 style={{ margin: 0, fontSize: 16 }}>{lesson.title}</h4>
                      {getStatusBadge(lesson)}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {lesson.reviewCount > 0
                        ? `Đã ôn ${lesson.reviewCount} lần • Interval: ${lesson.interval} ngày`
                        : "Chưa ôn lần nào"}
                      {isDue && " • ⚠️ Cần ôn"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: isDue ? "#dc3545" : "#666", fontWeight: 600 }}>
                      {dueLabel}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(lesson);
                      }}
                      style={{
                        padding: "6px 10px",
                        background: "#fff",
                        color: "#007bff",
                        border: "1px solid #007bff",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lesson);
                      }}
                      style={{
                        padding: "6px 10px",
                        background: "#fff",
                        color: "#dc3545",
                        border: "1px solid #dc3545",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee" }}>
                    {lesson.content && (
                      <div
                        style={{
                          fontSize: 14,
                          color: "#555",
                          lineHeight: 1.6,
                          marginBottom: 12,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {lesson.content}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => {
                          onReview(lesson.id, "good");
                          setExpandedId(null);
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        ✅ Nhớ bài
                      </button>
                      <button
                        onClick={() => {
                          onReview(lesson.id, "again");
                          setExpandedId(null);
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Quên - Ôn lại
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubjectView;
