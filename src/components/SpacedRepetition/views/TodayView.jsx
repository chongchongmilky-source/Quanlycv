import React from "react";
import { getDueLabel } from "../utils/srs";

/**
 * Màn hình chính: "Hôm nay cần học/ôn bài nào"
 */
export function TodayView({ todayLessons, onReview, onGoToSubject, stats }) {
  // Nhóm theo môn
  const grouped = todayLessons.reduce((acc, lesson) => {
    if (!acc[lesson.subjectName]) {
      acc[lesson.subjectName] = {
        color: lesson.subjectColor,
        subjectId: lesson.subjectId,
        lessons: [],
      };
    }
    acc[lesson.subjectName].lessons.push(lesson);
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>📅 Hôm nay</h2>
      <p style={{ color: "#666", marginBottom: 24, marginTop: 0 }}>
        Bạn có <strong>{todayLessons.length} bài</strong> cần ôn hôm nay
      </p>

      {/* Stats mini */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <MiniStat label="Môn học" value={stats.totalSubjects} icon="📚" color="#6c757d" />
        <MiniStat label="Tổng bài" value={stats.totalLessons} icon="📝" color="#007bff" />
        <MiniStat label="Cần ôn" value={stats.dueToday} icon="" color="#dc3545" />
        <MiniStat label="Đã thuộc" value={stats.mastered} icon="✅" color="#28a745" />
      </div>

      {todayLessons.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            background: "#f8f9fa",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h3 style={{ margin: "0 0 8px 0" }}>Hoàn thành hôm nay!</h3>
          <p style={{ color: "#888", margin: 0 }}>
            Bạn đã ôn xong tất cả bài cần học. Hãy quay lại ngày mai nhé.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([subjectName, group]) => (
            <div key={subjectName}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: group.color,
                    }}
                  />
                  {subjectName}
                </h3>
                <button
                  onClick={() => onGoToSubject(group.subjectId)}
                  style={{
                    padding: "4px 10px",
                    background: "transparent",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  Xem tất cả →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: 14,
                      border: "1px solid #e9ecef",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {lesson.reviewCount > 0
                          ? `Lần ôn thứ ${lesson.reviewCount}`
                          : "Bài mới"}{" "}
                        • Interval: {lesson.interval} ngày
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => onReview(lesson.subjectId, lesson.id, "again")}
                        title="Quên - ôn lại"
                        style={{
                          padding: "6px 10px",
                          background: "#fff",
                          border: "1px solid #dc3545",
                          color: "#dc3545",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => onReview(lesson.subjectId, lesson.id, "good")}
                        title="Nhớ bài"
                        style={{
                          padding: "6px 12px",
                          background: "#28a745",
                          border: "none",
                          color: "#fff",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        ✅ Nhớ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 14,
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
    </div>
  );
}

export default TodayView;