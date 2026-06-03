import React, { useState } from "react";

/**
 * Danh sách tất cả các môn - thêm/sửa/xóa môn
 */
export function SubjectList({ subjects, onAdd, onUpdate, onDelete, onSelect }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#007bff");
  const [editingId, setEditingId] = useState(null);

  const COLORS = [
    "#007bff", "#28a745", "#dc3545", "#ffc107",
    "#6f42c1", "#fd7e14", "#20c997", "#e83e8c",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdate(editingId, { name: name.trim(), color });
      setEditingId(null);
    } else {
      onAdd(name.trim(), color);
    }
    setName("");
    setColor("#007bff");
    setShowForm(false);
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setName(subject.name);
    setColor(subject.color);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setColor("#007bff");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>📚 Danh sách môn học</h2>
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
          + Thêm môn
        </button>
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
            {editingId ? "✏️ Sửa môn" : "➕ Thêm môn mới"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
                Tên môn:
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Toán, Tiếng Anh, Lịch sử..."
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
              <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
                Màu:
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c,
                      cursor: "pointer",
                      border: color === c ? "3px solid #333" : "3px solid transparent",
                      boxSizing: "border-box",
                    }}
                  />
                ))}
              </div>
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

      {/* Grid môn học */}
      {subjects.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            background: "#f8f9fa",
            borderRadius: 12,
            color: "#888",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <p>Chưa có môn nào. Thêm môn đầu tiên để bắt đầu!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {subjects.map((subject) => {
            const dueCount = subject.lessons.filter(
              (l) => l.dueDate <= Date.now()
            ).length;
            return (
              <div
                key={subject.id}
                onClick={() => onSelect(subject.id)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  border: "1px solid #e9ecef",
                  borderTop: `4px solid ${subject.color}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.15s",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <h3 style={{ margin: "0 0 8px 0", fontSize: 18 }}>{subject.name}</h3>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                  {subject.lessons.length} bài học
                </div>
                {dueCount > 0 && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#fff3cd",
                      color: "#856404",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {dueCount} bài cần ôn
                  </div>
                )}

                {/* Action buttons */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    display: "flex",
                    gap: 4,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEdit(subject)}
                    style={{
                      width: 28,
                      height: 28,
                      border: "none",
                      background: "#f1f3f5",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xóa môn "${subject.name}" và tất cả bài học?`)) {
                        onDelete(subject.id);
                      }
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      border: "none",
                      background: "#ffe5e5",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubjectList;