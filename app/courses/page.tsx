import { CourseCard } from "@/components/CourseCard"
import { courses } from "@/lib/data"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let progressMap: Record<string, number> = {}
  if (user) {
    const { data: progressData } = await supabase
      .from('progress')
      .select('video_id, watched_seconds')
      .eq('user_id', user.id)

    if (progressData) {
      progressData.forEach((p) => {
        const durationMap: Record<string, number> = {
          "8yr5zzOfNz0": 515,
          "bqrpXfzCTUw": 669,
          "FhHQu8y_3c0": 589
        }
        const duration = durationMap[p.video_id] || 600
        const percentage = Math.min(100, Math.round((p.watched_seconds / duration) * 100))
        progressMap[p.video_id] = percentage
      })
    }
  }

  return (
    <main className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">我的課程 📚</h1>
        <p className="text-neutral-500">這裡是你所有的課程進度。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            {...course} 
            progress={progressMap[course.videoId] || 0} 
          />
        ))}
      </div>
    </main>
  )
}
