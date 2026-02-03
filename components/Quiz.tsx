"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "影片中提到的 'Excuse me' 是什麼意思？",
    options: ["對不起/不好意思", "你好", "再見", "謝謝"],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "若要詢問 '公車站與這裡的距離'，下列哪句英文是正確的？",
    options: [
      "Where is the bus stop?",
      "How far is the bus stop from here?",
      "Is the bus stop near?",
      "I want to go to the bus stop."
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "影片建議在問路時，最禮貌的開頭方式是？",
    options: ["Hey you!", "Look at me.", "Excuse me, could you help me?", "I'm lost."],
    correctAnswer: 2
  }
]

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedOption(index)
    const correct = index === mockQuestions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setIsCorrect(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setScore(0)
    setShowResult(false)
  }

  if (showResult) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-4">測驗結束！</h3>
        <p className="text-lg text-neutral-600 mb-6">
          你的得分是：<span className="text-brand-600 font-bold text-2xl">{score} / {mockQuestions.length}</span>
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          重新測驗
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-500">
          Question {currentQuestion + 1} of {mockQuestions.length}
        </span>
        <span className="text-sm font-medium text-brand-600">
          Score: {score}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-6">
        {mockQuestions[currentQuestion].text}
      </h3>

      <div className="space-y-3 mb-8">
        {mockQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => !selectedOption && handleAnswer(index)}
            disabled={selectedOption !== null}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedOption === null 
                ? "border-neutral-200 hover:border-brand-300 hover:bg-brand-50" 
                : selectedOption === index
                  ? isCorrect
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                  : index === mockQuestions[currentQuestion].correctAnswer
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-neutral-200 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedOption !== null && index === selectedOption && (
                isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedOption !== null && (
        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            {currentQuestion < mockQuestions.length - 1 ? "下一題" : "查看結果"}
          </button>
        </div>
      )}
    </div>
  )
}
