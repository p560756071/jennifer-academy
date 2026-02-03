"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const supabase = createClient()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const [initialTime, setInitialTime] = useState(0)
  
  // 載入 YouTube IFrame API
  useEffect(() => {
    // 檢查是否已載入 API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // 定義 API 載入後的回呼
    window.onYouTubeIframeAPIReady = () => {
      loadPlayer()
    }

    // 如果 API 已經在頁面上，直接載入
    if (window.YT && window.YT.Player) {
      loadPlayer()
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [videoId])

  // 讀取上次觀看進度
  useEffect(() => {
    async function fetchProgress() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('progress')
        .select('watched_seconds')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single()

      if (data) {
        setInitialTime(data.watched_seconds)
      }
    }
    fetchProgress()
  }, [videoId])

  const loadPlayer = () => {
    const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 0,
        controls: 1,
        start: initialTime, // 從上次進度開始
      },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: (event: any) => {
          if (initialTime > 0) {
            event.target.seekTo(initialTime)
          }
        }
      },
    })
    setPlayer(newPlayer)
  }

  // 儲存進度
  const saveProgress = async (seconds: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('progress').upsert({
      user_id: user.id,
      video_id: videoId,
      watched_seconds: Math.floor(seconds),
      updated_at: new Date().toISOString(),
    })
  }

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onPlayerStateChange = (event: any) => {
    // 1 = Playing
    if (event.data === 1) {
      // 開始定期儲存 (每 5 秒)
      intervalRef.current = setInterval(() => {
        const currentTime = event.target.getCurrentTime()
        saveProgress(currentTime)
      }, 5000)
    } else {
      // 暫停或結束時，清除 Timer 並立即儲存一次
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      const currentTime = event.target.getCurrentTime()
      saveProgress(currentTime)
    }
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-xl aspect-video">
      <div id={`youtube-player-${videoId}`} className="w-full h-full" />
    </div>
  )
}

// 擴充 window 型別以支援 YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
