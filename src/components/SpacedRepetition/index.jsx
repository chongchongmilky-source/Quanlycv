import React, { useState, useMemo } from "react";
import { TodayView } from "./views/TodayView";
import { SubjectList } from "./views/SubjectList";
import { SubjectView } from "./views/SubjectView";
import { useSchedule } from "./hooks/useSchedule";

export default function SpacedRepetitionApp() {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const {
    data,
    addSubject,
    updateSubject,
    deleteSubject,
    addLesson,
    updateLesson,
    deleteLesson,
    reviewLesson,
    getTodayLessons,
    getSubjectLessons,
    getStats,
  } = useSchedule();

  const todayLessons = useMemo(() => getTodayLessons(), [data]);
  const stats = useMemo(() => getStats(), [data]);

  const selectedSubject = useMemo(
    () => data.subjects.find((s) => s.id === selectedSubjectId),
    [data, selectedSubjectId]
  );
  const selectedLessons = useMemo(
    () => (selectedSubjectId ? getSubjectLessons(selectedSubjectId) : []),
    [selectedSubjectId, data]
  );

  const tabs = [
    { id: "today", label: "📅 Hôm nay" },
    { id: "subjects", label: "📚 Môn học" },
  ];

  const handleGoToSubject = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setActiveTab("subject-detail");
  };

  const handleBackToList = () => {
    setSelectedSubjectId(null);
    setActiveTab("subjects");
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: "100vh",
        background: "#f5f6f8",
      }}
    >
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #e9ecef" }}>
        <h1 style={{ margin: "0 0 4px 0", fontSize: 24 }}>🧠 Spaced Repetition</h1>
        <div style={{ fontSize: 13, color: "#888" }}>Ôn bài thông minh theo khoảng cách</div>
      </div>

      {activeTab !== "subject-detail" && (
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#e9ecef", borderRadius: 10, padding: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#007bff" : "#666",
                transition: "all 0.2s",
                fontSize: 14,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "today" && (
        <TodayView
          todayLessons={todayLessons}
          onReview={reviewLesson}
          onGoToSubject={handleGoToSubject}
          stats={stats}
        />
      )}

      {activeTab === "subjects" && (
        <SubjectList
          subjects={data.subjects}
          onAdd={addSubject}
          onUpdate={updateSubject}
          onDelete={deleteSubject}
          onSelect={handleGoToSubject}
        />
      )}

      {activeTab === "subject-detail" && selectedSubject && (
        <SubjectView
          subject={selectedSubject}
          lessons={selectedLessons}
          onBack={handleBackToList}
          onAddLesson={(title, content) => addLesson(selectedSubjectId, title, content)}
          onUpdateLesson={(lessonId, updates) => updateLesson(selectedSubjectId, lessonId, updates)}
          onDeleteLesson={(lessonId) => deleteLesson(selectedSubjectId, lessonId)}
          onReview={(lessonId, quality) => reviewLesson(selectedSubjectId, lessonId, quality)}
        />
      )}
    </div>
  );
}