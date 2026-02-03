import { Play, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  level: string
  progress: number
}

export function CourseCard({ id, title, description, thumbnail, duration, level, progress }: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className="group block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-brand-600">
            <Play className="h-6 w-6 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-brand-50 text-brand-600 rounded-full">
            {level}
          </span>
          {progress === 100 && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="flex items-center text-xs text-neutral-400 gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
