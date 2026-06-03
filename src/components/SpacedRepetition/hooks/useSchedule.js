import { useState, useEffect, useCallback } from "react";
import { getNextInterval, getNextDueDate, isDue } from "../utils/srs";

const STORAGE_KEY = "spaced_repetition_data";

/**
 * Hook quản lý toàn bộ dữ liệu: môn học, bài học, lịch ôn
 * Đọc/ghi localStorage + tính toán lịch ôn
 */
export function useSchedule() {
  // Cấu trúc dữ liệu:
  // {
  //   subjects: [
  //     {
  //       id, name, color,
  //       lessons: [
  //         { id, title, content, interval, dueDate, lastReviewed, reviewCount, status }
  //       ]
  //     }
  //   ]
  // }

  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { subjects: [] };
  });

  // Tự động lưu khi data thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ========== SUBJECT CRUD ==========

  const addSubject = useCallback((name, color = "#007bff") => {
    const newSubject = {
      id: Date.now().toString(36),
      name,
      color,
      lessons: [],
      createdAt: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    return newSubject;
  }, []);

  const updateSubject = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const deleteSubject = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  }, []);

  // ========== LESSON CRUD ==========

  const addLesson = useCallback((subjectId, title, content = "") => {
    const newLesson = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title,
      content,
      interval: 0,
      dueDate: Date.now(), // Ôn ngay
      lastReviewed: null,
      reviewCount: 0,
      status: "new", // new | learning | reviewing | mastered
    };

    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, lessons: [...s.lessons, newLesson] }
          : s
      ),
    }));
    return newLesson;
  }, []);

  const updateLesson = useCallback((subjectId, lessonId, updates) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : s
      ),
    }));
  }, []);

  const deleteLesson = useCallback((subjectId, lessonId) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s
      ),
    }));
  }, []);

  // ========== REVIEW LOGIC ==========

  const reviewLesson = useCallback(
    (subjectId, lessonId, quality) => {
      setData((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) => {
          if (s.id !== subjectId) return s;

          return {
            ...s,
            lessons: s.lessons.map((l) => {
              if (l.id !== lessonId) return l;

              const normalizedQuality = quality === "again" ? "again" : "good";
              const newInterval = getNextInterval(l.interval || 0, normalizedQuality);
              const isAgain = normalizedQuality === "again";
              const newDueDate = isAgain ? Date.now() : getNextDueDate(newInterval);
              const newReviewCount = (l.reviewCount || 0) + 1;

              let newStatus = "learning";
              if (isAgain) {
                newStatus = "learning";
              } else if (newInterval < 7) {
                newStatus = "learning";
              } else if (newInterval < 30) {
                newStatus = "reviewing";
              } else {
                newStatus = "mastered";
              }

              return {
                ...l,
                interval: newInterval,
                dueDate: newDueDate,
                lastReviewed: Date.now(),
                reviewCount: newReviewCount,
                status: newStatus,
              };
            }),
          };
        }),
      }));
    },
    []
  );

  // ========== QUERIES ==========

  const getTodayLessons = useCallback(() => {
    const now = Date.now();
    const result = [];
    data.subjects.forEach((subject) => {
      subject.lessons.forEach((lesson) => {
        if (lesson.dueDate <= now) {
          result.push({ ...lesson, subjectName: subject.name, subjectId: subject.id, subjectColor: subject.color });
        }
      });
    });
    return result;
  }, [data]);

  const getSubjectLessons = useCallback(
    (subjectId) => {
      const subject = data.subjects.find((s) => s.id === subjectId);
      return subject ? subject.lessons : [];
    },
    [data]
  );

  const getStats = useCallback(() => {
    let totalLessons = 0;
    let dueToday = 0;
    let mastered = 0;
    const now = Date.now();

    data.subjects.forEach((s) => {
      s.lessons.forEach((l) => {
        totalLessons++;
        if (l.dueDate <= now) dueToday++;
        if (l.status === "mastered") mastered++;
      });
    });

    return {
      totalSubjects: data.subjects.length,
      totalLessons,
      dueToday,
      mastered,
    };
  }, [data]);

  return {
    data,
    // Subject
    addSubject,
    updateSubject,
    deleteSubject,
    // Lesson
    addLesson,
    updateLesson,
    deleteLesson,
    reviewLesson,
    // Queries
    getTodayLessons,
    getSubjectLessons,
    getStats,
  };
}

export default useSchedule;
