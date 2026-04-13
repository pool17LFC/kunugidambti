"use client";
import { useState } from "react";

// 9タイプの定義
const TYPE_DETAILS: { [key: string]: { name: string, desc: string, color: string } } = {
  "1": { name: "本部部門", desc: "花火がここに咲く！くぬぎだ祭の導き手", color: "bg-red-500" },
  "2": { name: "会場部門", desc: "模擬店のキャプテン！くぬぎだ祭の心臓", color: "bg-pink-500" },
  "3": { name: "演出部門", desc: "熱狂のクリエイター！くぬぎだ祭の演出家", color: "bg-orange-500" },
  "4": { name: "装飾部門", desc: "高専をデザイン！くぬぎだ祭のデザイナー", color: "bg-purple-500" },
  "5": { name: "企画部門", desc: "ワクワクの震源地！くぬぎだ祭の盛り上げ隊長", color: "bg-blue-500" },
  "6": { name: "舞台部門", desc: "ステージのスペシャリスト！くぬぎだ祭の構築者", color: "bg-green-500" },
  "7": { name: "照明部門", desc: "電気あるところに照明あり！くぬぎだ祭の光使い", color: "bg-yellow-500" },
  "8": { name: "編集部門", desc: "くぬぎだ祭の記憶！パンフレットを思い出に", color: "bg-indigo-500" },
  "9": { name: "経理部門", desc: "財務のスペシャリスト！くぬぎだ祭のお金はお任せ！", color: "bg-teal-500" },
};

interface Question {
  id: number;
  text: string;
  impact: { [key: number]: number }; // keyはタイプ番号、valueは重み
}


const questions: Question[] = [
  { 
    id: 1, 
    text: "動いて仕事するよりデスクワークの方が好きだ", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: -1.0, 
      2: -3.0,  
      3: -2.0, 
      4: -2.0,  
      5: 1.0,  
      6: -3.0,  
      7: -1.0,  
      8: 4.0,  
      9: 2.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 2,
    text: "目立たなくても人を支えることにやりがいを感じる", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: -2.0, 
      2: -1.0,  
      3: -1.0, 
      4: 2.0,  
      5: -4.0,  
      6: 3.0,  
      7: 2.0,  
      8: 2.0,  
      9: 3.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 3,
    text: "文化祭当日は働きたくない", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: -6.0, 
      2: 2.0,  
      3: -5.0, 
      4: 6.0,  
      5: -3.0,  
      6: 5.0,  
      7: 2.0,  
      8: 6.0,  
      9: -2.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 4,
    text: "体育館の出し物よりも模擬店に関わりたい", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 2.0, 
      2: 5.0,  
      3: -5.0, 
      4: 0.0,  
      5: -1.0,  
      6: -3.0,  
      7: -1.0,  
      8: 0.0,  
      9: 2.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 5,
    text: "軽音楽部やダンス部、吹奏楽部に入ろうと考えている", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 0.0, 
      2: -1.0,  
      3: 4.0, 
      4: 1.0,  
      5: 1.0,  
      6: 4.0,  
      7: 2.0,  
      8: 0.0,  
      9: 0.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 6,
    text: "アイデアを形にできる部門に行きたい", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 1.0, 
      2: 0.0,  
      3: 2.0, 
      4: 4.0,  
      5: 4.0,  
      6: -3.0,  
      7: -1.0,  
      8: 4.0,  
      9: 0.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 7,
    text: "細かい作業は好き", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 0.0, 
      2: -1.0,  
      3: 0.0, 
      4: 4.0,  
      5: -1.0,  
      6: -2.0,  
      7: 1.0,  
      8: 3.0,  
      9: 3.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 8,
    text: "ルールは順守すべきだと強く思う", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 2.0, 
      2: 1.0,  
      3: 1.0, 
      4: -1.0,  
      5: -1.0,  
      6: 2.0,  
      7: 1.0,  
      8: 1.0,  
      9: 5.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 9,
    text: "美的センスはある方だと思う", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 0.0, 
      2: 0.0,  
      3: 2.0, 
      4: 4.0,  
      5: 3.0,  
      6: 0.0,  
      7: 1.0,  
      8: 3.0,  
      9: 0.0, // 平和をもたらす人にはマイナス（対立を好まないため）
    } 
  },
  {
    id: 10,
    text: "事前に何度も集まって交流したい", 
    // どのタイプにどれくらい影響を与えるかを定義
    impact: { 
      1: 4.0, 
      2: 2.0,  
      3: 3.0, 
      4: 2.0,  
      5: 4.0,  
      6: -2.0,  
      7: -1.0,  
      8: 1.0,  
      9: -1.0, 
    } 
  }
];

export default function Home() {
  const [status, setStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<{ [key: number]: number }>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });

  const handleAnswer = (point: number) => {
    const currentQuestion = questions[currentStep];
    setScores(prev => {
      const newScores = { ...prev };
      Object.entries(currentQuestion.impact).forEach(([type, weight]) => {
        const typeNum = Number(type);
        newScores[typeNum] = (newScores[typeNum] || 0) + (point * weight);
      });
      return newScores;
    });

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setStatus("finished");
    }
  };

  // 1. 開始画面
  if (status === "waiting") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">部門適性診断</h1>
          <p className="text-slate-500 mb-10">簡単な質問からあなたに「最適な部門」をおすすめします！</p>
          <p className="text-slate-500 mb-10">この診断テストは例であり熟考の上で所属部門を決定してください</p>
          <button onClick={() => setStatus("playing")} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all">
            診断を開始する
          </button>
        </div>
      </main>
    );
  }

  // 2. 結果画面（ランキング表示）
  if (status === "finished") {
    const rankedTypes = Object.entries(scores)
      .map(([id, score]) => ({ id, score, ...TYPE_DETAILS[id] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return (
      <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8 text-slate-800">適正部門ランキング</h1>
        <div className="w-full max-w-md space-y-4">
          {rankedTypes.map((type, index) => (
            <div key={type.id} className={`p-6 rounded-3xl bg-white shadow-sm border-2 ${index === 0 ? "border-indigo-500 scale-105" : "border-transparent opacity-80"}`}>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-indigo-500">#{index + 1}</span>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{type.name}</h2>
                  <p className="text-sm text-slate-500">{type.desc}</p>
                </div>
              </div>
              {index === 0 && <p className="mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 p-2 rounded-lg text-center">あなたへおすすめの部門！！</p>}
            </div>
          ))}
          <button onClick={() => window.location.reload()} className="w-full py-4 text-slate-400 font-medium hover:text-slate-600 transition">
            最初に戻る
          </button>
        </div>
      </main>
    );
  }


// 3. 診断中（playing）
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        
        {/* 1. 質問テキストの表示エリア */}
        <p className="text-gray-400 text-sm mb-2">Question {currentStep + 1}</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-10">
          {questions[currentStep].text}
        </h2>

        {/* 2. ここに「UI部分（ボタンのレンダリング）」を入れます！ */}
        <div className="flex flex-col gap-3">
          {[
            { label: "あてはまる", score: 2, color: "bg-indigo-600 text-white" },
            { label: "ややあてはまる", score: 1, color: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
            { label: "どちらでもない", score: 0, color: "bg-gray-50 text-gray-500 border border-gray-200" },
            { label: "あまりあてはまらない", score: -1, color: "bg-red-50 text-red-400 border border-red-100" },
            { label: "あてはまらない", score: -2, color: "bg-red-100 text-red-600" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.score)}
              className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${opt.color}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}