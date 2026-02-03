"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const supabase = createClient()
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 1. 載入 YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // 當 API 準備好時，初始化播放器
    window.onYouTubeIframeAPIReady = () => {
      createPlayer()
    }

    // 如果 API 已經在頁面上（例如切換頁面回來），直接初始化
    if (window.YT && window.YT.Player) {
      createPlayer()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      // 注意：不要 destroy player，因為 React 重新渲染可能會導致問題
    }
  }, [videoId])

  const createPlayer = async () => {
    // 先去資料庫抓上次進度
    const { data: { user } } = await supabase.auth.getUser()
    let startTime = 0
    
    if (user) {
      const { data } = await supabase
        .from('progress')
        .select('watched_seconds')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single()
      
      if (data) startTime = data.watched_seconds
    }

    // 建立播放器
    playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 0,
        controls: 1, // 雖然我們不能完全隱藏控制列，但可以設定 modestbranding
        start: startTime,
        origin: window.location.origin,
        modestbranding: 1, // 隱藏 YouTube Logo
        rel: 0, // 不顯示相關影片
        fs: 0, // 禁止全螢幕按鈕 (可選)
        iv_load_policy: 3, // 不顯示影片註釋
        disablekb: 1 // 禁止鍵盤控制 (防止按 'k' 暫停等)
      },
      events: {
        onStateChange: onPlayerStateChange
      }
    })
  }

  const onPlayerStateChange = (event: any) => {
    // 1 = Playing
    if (event.data === 1) {
      // 開始每 5 秒儲存一次
      intervalRef.current = setInterval(() => {
        saveProgress()
      }, 5000)
    } else {
      // 暫停或結束，清除 Timer 並立即存一次
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      saveProgress()
    }
  }

  const saveProgress = async () => {
    if (!playerRef.current || !playerRef.current.getCurrentTime) return
    
    const currentTime = playerRef.current.getCurrentTime()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && currentTime > 0) {
      await supabase.from('progress').upsert({
        user_id: user.id,
        video_id: videoId,
        watched_seconds: Math.floor(currentTime),
        updated_at: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-xl aspect-video">
      <div id={`youtube-player-${videoId}`} className="w-full h-full" />
    </div>
  )
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}