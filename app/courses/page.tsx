import { CourseCard } from "@/components/CourseCard"
import { courses } from "@/lib/data"

export default function CoursesPage() {
  return (
    <main className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">我的課程 📚</h1>
        <p className="text-neutral-500">這裡是你所有的課程進度。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </main>
  )
}
