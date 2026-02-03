import { CourseCard } from "@/components/CourseCard"
import { courses } from "@/lib/data"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic" // 強制動態渲染

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 取得該使用者的所有進度
  let progressMap: Record<string, number> = {}
  if (user) {
    const { data: progressData } = await supabase
      .from('progress')
      .select('video_id, watched_seconds')
      .eq('user_id', user.id)

    if (progressData) {
      progressData.forEach((p) => {
        // 簡單轉換：假設每部影片總長 600秒 (10分鐘) 來計算百分比
        // 這裡可以針對不同影片 ID 設定不同長度
        const durationMap: Record<string, number> = {
          "8yr5zzOfNz0": 515, // 8:35
          "bqrpXfzCTUw": 669, // 11:09
          "FhHQu8y_3c0": 589  // 9:49
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
        <h1 className="text-3xl font-bold mb-2">歡迎回來，{user?.email?.split('@')[0] || "學員"} 👋</h1>
        <p className="text-neutral-500">準備好開始今天的學習了嗎？這是為你精選的課程。</p>
      </header>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">推薦課程</h2>
          <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            查看全部
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              {...course} 
              progress={progressMap[course.videoId] || 0}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="bg-brand-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">本週學習挑戰 🎯</h2>
            <p className="mb-6 text-brand-100">
              完成「交通問路」單元的測驗，即可獲得專屬徽章！目前已有 12 位學員完成挑戰。
            </p>
            <button className="bg-white text-brand-600 px-6 py-2 rounded-lg font-bold hover:bg-brand-50 transition-colors">
              立即參加
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        </div>
      </section>
    </main>
  )
}
