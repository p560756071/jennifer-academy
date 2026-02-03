"use client"

import { VideoPlayer } from "@/components/VideoPlayer"
import { Quiz } from "@/components/Quiz"
import { courses } from "@/lib/data"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState, use } from "react"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const course = courses.find((c) => c.id === id)
  const [activeTab, setActiveTab] = useState<'video' | 'quiz' | 'material'>('video')

  if (!course) {
    notFound()
  }

  return (
    <main className="p-4 md:p-8">
      <Link href="/courses" className="inline-flex items-center text-neutral-500 hover:text-neutral-800 mb-6 group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        返回課程列表
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="aspect-video w-full">
            <VideoPlayer videoId={course.videoId} />
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-4 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('video')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'video' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              >
                課程介紹
              </button>
              <button 
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'quiz' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              >
                課後測驗
              </button>
              <button 
                onClick={() => setActiveTab('material')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'material' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              >
                教材下載
              </button>
            </div>

            {activeTab === 'video' && (
              <div>
                <h1 className="text-xl md:text-2xl font-bold mb-4">{course.title}</h1>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {course.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {course.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="py-6">
                <Quiz />
              </div>
            )}

            {activeTab === 'material' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-brand-200 hover:bg-brand-50/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                      <span className="font-bold text-xs">PDF</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium group-hover:text-brand-700 truncate">課程講義.pdf</h4>
                      <p className="text-xs text-neutral-400">2.4 MB</p>
                    </div>
                  </div>
                  <button className="text-brand-600 font-medium text-sm whitespace-nowrap">下載</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 sticky top-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-600" />
              課程章節
            </h3>
            <div className="space-y-3">
              {courses.map((c, idx) => (
                <Link 
                  key={c.id} 
                  href={`/courses/${c.id}`}
                  className={`block p-3 rounded-lg transition-colors ${c.id === course.id ? 'bg-brand-50 border border-brand-200' : 'hover:bg-neutral-50'}`}
                >
                  <div className="flex gap-3">
                    <span className="text-neutral-400 font-medium text-sm shrink-0">0{idx + 1}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${c.id === course.id ? 'text-brand-700' : 'text-neutral-700'}`}>
                        {c.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">{c.duration}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
