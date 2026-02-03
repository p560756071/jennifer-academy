import { Award, Book, Clock, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">學員檔案 👤</h1>
      </header>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 mb-8">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.email?.split('@')[0] || "學員"}</h2>
            <p className="text-neutral-500 mb-2">{user?.email || "尚未登入"}</p>
            <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">
              一般會員
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-neutral-500">學習時數</h3>
          </div>
          <p className="text-3xl font-bold">12.5 <span className="text-sm font-normal text-neutral-400">小時</span></p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-neutral-500">完成課程</h3>
          </div>
          <p className="text-3xl font-bold">3 <span className="text-sm font-normal text-neutral-400">堂</span></p>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-neutral-500">獲得積分</h3>
          </div>
          <p className="text-3xl font-bold">450 <span className="text-sm font-normal text-neutral-400">分</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-brand-500" />
          成就徽章
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-neutral-50 dark:bg-neutral-800 rounded-xl flex flex-col items-center justify-center p-4 border border-neutral-100 dark:border-neutral-700 hover:bg-brand-50 hover:border-brand-200 transition-colors cursor-pointer group">
              <div className="h-16 w-16 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm text-center">學習新手</p>
              <p className="text-xs text-neutral-400">2026/02/01</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
