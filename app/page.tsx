"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { Check, Sparkles, Zap, Download, Plus, ClipboardList, Palette, Footprints, Wind, Shield, RotateCcw, Star, Gauge, Smile } from "lucide-react";
const Card = ({ children, className = "" }: any) => (
  <div className={className}>{children}</div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, className = "", ...props }: any) => (
  <button className={className} {...props}>
    {children}
  </button>
);

const questionGroups = [
  {
    id: "fit",
    title: "フィット感",
    label: "Fit",
    icon: Footprints,
    color: "from-cyan-300 to-blue-500",
    accent: "bg-cyan-100",
    questions: [
      "足長サイズは適切でしたか？",
      "足幅のフィット感はどうでしたか？",
      "甲周りの圧迫感はありましたか？",
      "踵のホールド感は十分でしたか？",
      "歩行時に足ズレはありましたか？",
      "つま先の余裕は適切でしたか？",
      "長時間履いても窮屈感はありませんでしたか？",
      "シューレース調整はしやすかったですか？",
    ],
    pdfQuestions: [
      "Was the shoe length appropriate?",
      "How was the width fit?",
      "Was there any pressure around the instep?",
      "Was the heel hold secure?",
      "Did your foot slide inside the shoe while walking?",
      "Was there enough toe room?",
      "Did the shoe feel comfortable after long wear?",
      "Was it easy to adjust the laces?",
    ],
  },
  {
    id: "cushion",
    title: "クッション性",
    label: "Cushion",
    icon: Smile,
    color: "from-lime-300 to-green-500",
    accent: "bg-lime-100",
    questions: [
      "着地時の柔らかさはどう感じましたか？",
      "反発感は十分に感じられましたか？",
      "クッション量は適切でしたか？",
      "長時間使用時の疲労軽減を感じましたか？",
      "前足部のクッション感はどうでしたか？",
      "踵部の衝撃吸収は十分でしたか？",
    ],
    pdfQuestions: [
      "How did the softness feel during landing?",
      "Did you feel enough rebound?",
      "Was the amount of cushioning appropriate?",
      "Did the shoe help reduce fatigue during long wear?",
      "How did the forefoot cushioning feel?",
      "Was the heel impact absorption sufficient?",
    ],
  },
  {
    id: "stability",
    title: "安定性",
    label: "Stability",
    icon: Gauge,
    color: "from-orange-300 to-red-500",
    accent: "bg-orange-100",
    questions: [
      "横ブレは感じましたか？",
      "着地時の安定感はどうでしたか？",
      "コーナリング時に不安感はありましたか？",
      "片足立ち時の安定感は十分でしたか？",
      "ミッドソールの硬さは適切でしたか？",
      "足首周りのサポート感はどうでしたか？",
    ],
    pdfQuestions: [
      "Did you feel any side-to-side wobbling?",
      "How stable did the shoe feel during landing?",
      "Did you feel unstable while cornering?",
      "Was the shoe stable enough while standing on one foot?",
      "Was the midsole firmness appropriate?",
      "How was the support around the ankle?",
    ],
  },
  {
    id: "lightweight",
    title: "軽量性",
    label: "Lightweight",
    icon: Zap,
    color: "from-yellow-300 to-amber-500",
    accent: "bg-yellow-100",
    questions: [
      "持った時に軽さを感じましたか？",
      "歩行時に重さは気になりましたか？",
      "長時間使用時の重量負担はありましたか？",
      "動きやすさに影響はありましたか？",
    ],
    pdfQuestions: [
      "Did the shoe feel light when held?",
      "Did the weight bother you while walking?",
      "Did the weight feel burdensome during long wear?",
      "Did the weight affect ease of movement?",
    ],
  },
  {
    id: "breathability",
    title: "通気性",
    label: "Breathability",
    icon: Wind,
    color: "from-sky-300 to-indigo-500",
    accent: "bg-sky-100",
    questions: [
      "ムレ感はありましたか？",
      "通気性は十分に感じましたか？",
      "夏場でも快適に履けそうですか？",
      "素材の蒸れやすさは気になりましたか？",
    ],
    pdfQuestions: [
      "Did your feet feel hot or humid inside the shoe?",
      "Did the shoe feel breathable enough?",
      "Would this shoe be comfortable in summer?",
      "Did the upper material feel prone to heat build-up?",
    ],
  },
  {
    id: "flexibility",
    title: "屈曲性",
    label: "Flexibility",
    icon: RotateCcw,
    color: "from-violet-300 to-purple-500",
    accent: "bg-violet-100",
    questions: [
      "歩行時の曲がりやすさはどうでしたか？",
      "前足部の屈曲は自然でしたか？",
      "動作時の硬さは気になりましたか？",
      "スムーズな重心移動を感じましたか？",
    ],
    pdfQuestions: [
      "How easy was the shoe to bend while walking?",
      "Was the forefoot flex natural?",
      "Did the shoe feel stiff during movement?",
      "Did the shoe support smooth weight transition?",
    ],
  },
  {
    id: "grip",
    title: "グリップ性",
    label: "Grip",
    icon: Shield,
    color: "from-emerald-300 to-teal-500",
    accent: "bg-emerald-100",
    questions: [
      "滑りやすさは感じましたか？",
      "濡れた路面での安心感はありましたか？",
      "急停止時のグリップ感はどうでしたか？",
      "アウトソールの接地感は十分でしたか？",
    ],
    pdfQuestions: [
      "Did the shoe feel slippery?",
      "Did the shoe feel secure on wet surfaces?",
      "How was the grip during sudden stops?",
      "Was the outsole ground contact sufficient?",
    ],
  },
  {
    id: "durability",
    title: "耐久性",
    label: "Durability",
    icon: Shield,
    color: "from-slate-300 to-slate-600",
    accent: "bg-slate-100",
    questions: [
      "素材の耐久性に不安はありましたか？",
      "摩耗しやすそうな箇所はありましたか？",
      "長期間使用できそうと感じましたか？",
      "アッパー素材の強度は十分そうですか？",
    ],
    pdfQuestions: [
      "Did you have any concerns about material durability?",
      "Were there any areas that seemed likely to wear quickly?",
      "Did the shoe feel suitable for long-term use?",
      "Did the upper material seem strong enough?",
    ],
  },
  {
    id: "easy",
    title: "着脱性",
    label: "Easy On/Off",
    icon: Plus,
    color: "from-pink-300 to-rose-500",
    accent: "bg-pink-100",
    questions: [
      "履きやすさはどうでしたか？",
      "脱ぎやすさはどうでしたか？",
      "開口部の広さは適切でしたか？",
      "着脱時にストレスはありましたか？",
    ],
    pdfQuestions: [
      "How easy was it to put on the shoe?",
      "How easy was it to take off the shoe?",
      "Was the opening size appropriate?",
      "Did you feel any stress while putting on or taking off the shoe?",
    ],
  },
  {
    id: "design",
    title: "デザイン",
    label: "Design",
    icon: Star,
    color: "from-fuchsia-300 to-pink-500",
    accent: "bg-fuchsia-100",
    questions: [
      "全体デザインの印象はどうでしたか？",
      "シルエットは魅力的に感じましたか？",
      "高級感は感じられましたか？",
      "ブランドらしさは感じましたか？",
      "他人に勧めたいデザインですか？",
      "年齢層に合ったデザインだと思いますか？",
    ],
    pdfQuestions: [
      "What was your first impression of the overall design?",
      "Did you find the silhouette attractive?",
      "Did the shoe feel premium?",
      "Did the design feel consistent with the brand?",
      "Would you recommend this design to others?",
      "Do you think the design fits the target age group?",
    ],
  },
  {
    id: "color",
    title: "カラー",
    label: "Color",
    icon: Palette,
    color: "from-rose-300 via-orange-300 to-yellow-400",
    accent: "bg-rose-100",
    questions: [
      "カラーリングの印象はどうでしたか？",
      "配色バランスは良いと感じましたか？",
      "コーディネートしやすそうですか？",
      "色の高級感は感じられましたか？",
      "店頭で目を引く色だと思いますか？",
    ],
    pdfQuestions: [
      "What was your impression of the colorway?",
      "Did the color balance feel good?",
      "Does the color seem easy to style with outfits?",
      "Did the color feel premium?",
      "Would this color stand out in stores?",
    ],
  },
  {
    id: "scene",
    title: "使用シーン",
    label: "Usage Scene",
    icon: ClipboardList,
    color: "from-blue-300 to-cyan-500",
    accent: "bg-blue-100",
    questions: [
      "日常使いしやすそうですか？",
      "スポーツ用途に適していると感じますか？",
      "通勤・通学でも使いやすそうですか？",
    ],
    pdfQuestions: [
      "Does the shoe seem easy to use daily?",
      "Does the shoe feel suitable for sports use?",
      "Would the shoe be suitable for commuting or school?",
    ],
  },
  {
    id: "overall",
    title: "総合評価",
    label: "Overall",
    icon: Sparkles,
    color: "from-indigo-300 to-violet-500",
    accent: "bg-indigo-100",
    questions: [
      "総合的な満足度を教えてください。",
      "購入したいと思いましたか？",
      "改善してほしい点はありますか？",
    ],
    pdfQuestions: [
      "What is your overall satisfaction with this sample?",
      "Would you consider purchasing this shoe?",
      "What points would you like to improve?",
    ],
  },
];

const categories = [
  "Tennis",
  "Padel",
  "Pickleball",
  "Volleyball",
  "Handball",
  "Badminton",
  "Basketball",
  "Wrestling",
  "Netball",
];
const users = [
  {
    label: "初級者 / Beginner",
    pdf: "Beginner",
  },
  {
    label: "中級者 / Intermediate",
    pdf: "Intermediate",
  },
  {
    label: "上級者 / Advanced",
    pdf: "Advanced",
  },
  {
    label: "社内評価者 / Internal Tester",
    pdf: "Internal Tester",
  },
  {
    label: "一般ユーザー / General User",
    pdf: "General User",
  },
];

const APP_PASSWORD = "CPS2026";

export default function PopShoesHearingSheetMaker() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modelName, setModelName] = useState("New Item");
  const [category, setCategory] = useState("Tennis");
  const [targetUsers, setTargetUsers] = useState(["Beginner", "General User"]);
  const [selected, setSelected] = useState(["fit", "cushion", "design", "color", "overall"]);
  const [generated, setGenerated] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [excludedQuestions, setExcludedQuestions] = useState<string[]>([]);

  const selectedGroups = useMemo(
    () => questionGroups.filter((group) => selected.includes(group.id)),
    [selected]
  );

  const getQuestionId = (groupId: string, index: number) =>
    `${groupId}-${index}`;

  const isQuestionSelected = (groupId: string, index: number) => {
    return !excludedQuestions.includes(getQuestionId(groupId, index));
  };

  const getSelectedQuestions = (group: any) => {
    return group.questions.filter((_: any, index: number) =>
      isQuestionSelected(group.id, index)
    );
  };

  const questionCount =
    selectedGroups.reduce(
      (sum, group) => sum + getSelectedQuestions(group).length,
      0
    ) + customQuestions.length;
const exportPDF = () => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(20);
  doc.text("HEARING SHEET", 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.text(`MODEL: ${modelName}`, 20, y);
  y += 8;
  doc.text(`CATEGORY: ${category}`, 20, y);
  y += 8;
  doc.text(`TARGET: ${targetUsers.join(" / ")}`, 20, y);
  y += 15;

  selectedGroups.forEach((group) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text(group.label, 20, y);
    y += 10;

    group.pdfQuestions.forEach((q, index) => {
      if (!isQuestionSelected(group.id, index)) return;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(`${index + 1}. ${q}`, 160);

      doc.setFontSize(10);
      doc.text(lines, 24, y);
      y += lines.length * 6 + 2;

      doc.line(24, y, 185, y);
      y += 8;
    });

    y += 5;
  });

  customQuestions.forEach((q, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.text(`Custom ${index + 1}. ${q}`, 20, y);
    y += 7;
    doc.line(20, y, 180, y);
    y += 8;
  });

  doc.save("hearing-sheet.pdf");
};
  const toggleGroup = (id: string) => {
    setGenerated(false);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleQuestion = (groupId: string, index: number) => {
    const questionId = getQuestionId(groupId, index);

    setGenerated(false);
    setExcludedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleUser = (user: { label: string; pdf: string }) => {
    setTargetUsers((prev) =>
      prev.includes(user.pdf)
        ? prev.filter((item) => item !== user.pdf)
        : [...prev, user.pdf]
    );
  };

  const addCustomQuestion = () => {
    const value = customQuestion.trim();
    if (!value) return;
    setCustomQuestions((prev) => [...prev, value]);
    setCustomQuestion("");
  };

  const reset = () => {
    setSelected([]);
    setExcludedQuestions([]);
    setCustomQuestions([]);
    setGenerated(false);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === APP_PASSWORD) {
      setIsUnlocked(true);
      setPasswordError("");
      return;
    }

    setPasswordError("Password is incorrect.");
  };

  const exportText = () => {
    const lines = [];
    lines.push(`ヒアリングシート：${modelName || "未入力サンプル"}`);
    lines.push(`カテゴリ：${category}`);
    lines.push(`対象：${targetUsers.join(" / ") || "未選択"}`);
    lines.push("");
    selectedGroups.forEach((group) => {
      lines.push(`■ ${group.title}`);
      getSelectedQuestions(group).forEach((q: string, index: number) => lines.push(`${index + 1}. ${q}`));
      lines.push("");
    });
    if (customQuestions.length > 0) {
      lines.push("■ 今回だけの追加質問");
      customQuestions.forEach((q, index) => lines.push(`${index + 1}. ${q}`));
    }
    navigator.clipboard?.writeText(lines.join("\n"));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_30%),radial-gradient(circle_at_top_right,#ffe0f8,transparent_26%),linear-gradient(135deg,#f7fbff,#fff7e8)] p-4 text-slate-900 md:p-8">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#111827]"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-1 text-sm font-black tracking-wide text-slate-900">
              <Sparkles size={16} /> SNEAKER LAB TOOL
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              HEARING SHEET MAKER
            </h1>

            <p className="mt-2 font-bold text-slate-500">
              Please enter the password to open this tool.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                className="w-full rounded-2xl border-4 border-slate-900 bg-slate-50 px-4 py-3 font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-cyan-200"
                placeholder="Enter password"
                autoFocus
              />

              {passwordError && (
                <p className="mt-3 rounded-2xl bg-pink-100 px-4 py-3 text-sm font-black text-pink-700">
                  {passwordError}
                </p>
              )}

              <button
                onClick={handlePasswordSubmit}
                className="mt-5 w-full rounded-full border-4 border-slate-900 bg-cyan-300 px-5 py-4 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] transition hover:bg-cyan-200"
              >
                Open App
              </button>
            </div>

            <p className="mt-5 text-xs font-bold text-slate-400">
              This is a simple app-level password screen.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_30%),radial-gradient(circle_at_top_right,#ffe0f8,transparent_26%),linear-gradient(135deg,#f7fbff,#fff7e8)] p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0_#111827]"
        >
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-1 text-sm font-black tracking-wide text-slate-900">
                <Sparkles size={16} /> SNEAKER LAB TOOL
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                HEARING SHEET MAKER
              </h1>
              <p className="mt-2 text-base font-semibold text-slate-600 md:text-lg">
                今日のサンプル、どこを深掘りする？評価軸をポンポン選んで質問シートを生成！
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 3.5 }}
              className="rounded-3xl bg-gradient-to-br from-cyan-300 via-lime-300 to-orange-300 p-5 text-center shadow-[5px_5px_0_#111827]"
            >
              <div className="text-sm font-black">SELECTED</div>
              <div className="text-5xl font-black">{questionCount}</div>
              <div className="text-sm font-black">QUESTIONS</div>
            </motion.div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
          <section className="space-y-6">
            <Card className="rounded-[2rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#111827]">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-2xl bg-orange-300 p-2">
                    <ClipboardList size={22} />
                  </div>
                  <h2 className="text-xl font-black">Sample Info</h2>
                </div>

                <label className="mb-2 block text-sm font-black">モデル名</label>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="mb-4 w-full rounded-2xl border-3 border-slate-900 bg-slate-50 px-4 py-3 font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-cyan-200"
                  placeholder="例：Cloud Runner Proto 01"
                />

                <label className="mb-2 block text-sm font-black">カテゴリ</label>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`rounded-2xl border-3 border-slate-900 px-3 py-2 text-sm font-black transition ${
                        category === item
                          ? "bg-cyan-300 shadow-[3px_3px_0_#111827]"
                          : "bg-white hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <label className="mb-2 block text-sm font-black">対象ユーザー</label>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <button
                      key={user.pdf}
                      onClick={() => toggleUser(user)}
                      className={`rounded-full border-3 border-slate-900 px-3 py-2 text-sm font-black transition ${
                        targetUsers.includes(user.pdf)
                          ? "bg-pink-300 shadow-[3px_3px_0_#111827]"
                          : "bg-white hover:bg-slate-100"
                      }`}
                    >
                      {targetUsers.includes(user.pdf) ? "✓ " : ""}
                      {user.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#111827]">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-black">どこを聞く？</h2>
                    <p className="text-sm font-bold text-slate-500">カードを押すとON/OFF</p>
                  </div>
                  <Button onClick={reset} className="rounded-full border-3 border-slate-900 bg-white text-slate-900 hover:bg-slate-100">
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {questionGroups.map((group) => {
                    const Icon = group.icon;
                    const isOn = selected.includes(group.id);
                    return (
                      <motion.button
                        key={group.id}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ y: -3 }}
                        onClick={() => toggleGroup(group.id)}
                        className={`relative rounded-3xl border-4 border-slate-900 p-4 text-left transition ${
                          isOn
                            ? `bg-gradient-to-br ${group.color} shadow-[5px_5px_0_#111827]`
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="rounded-2xl bg-white/80 p-2">
                            <Icon size={22} />
                          </div>
                          {isOn && (
                            <div className="rounded-full bg-slate-900 p-1 text-white">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-black">{group.title}</div>
                        <div className="text-xs font-black uppercase tracking-wide opacity-80">{group.label}</div>
                        <div className="mt-2 rounded-full bg-white/75 px-2 py-1 text-xs font-black">
                          {getSelectedQuestions(group).length}/{group.questions.length} Questions
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="rounded-[2rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#111827]">
              <CardContent className="p-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Live Preview</h2>
                    <p className="font-bold text-slate-500">質問をクリックするとON/OFFできます。PDFにも反映されます。</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setGenerated(true)}
                      className="rounded-full border-4 border-slate-900 bg-lime-300 px-5 py-6 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] hover:bg-lime-200"
                    >
                      <Zap className="mr-2" size={20} /> SHEET GENERATE!
                    </Button>
                    <Button
  onClick={exportText}
  className="rounded-full border-4 border-slate-900 bg-cyan-300 px-5 py-6 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] hover:bg-cyan-200"
>
  <Download className="mr-2" size={20} /> COPY
</Button>

<Button
  onClick={exportPDF}
  className="rounded-full border-4 border-slate-900 bg-pink-300 px-5 py-6 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] hover:bg-pink-200"
>
  PDF EXPORT
</Button>
                    
                  </div>
                </div>

                <div className="mb-5 rounded-3xl border-4 border-dashed border-slate-900 bg-gradient-to-r from-yellow-100 via-pink-100 to-cyan-100 p-4">
                  <div className="text-sm font-black text-slate-500">SAMPLE</div>
                  <div className="text-2xl font-black">{modelName || "未入力サンプル"}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm font-black">
                    <span className="rounded-full bg-white px-3 py-1">Category: {category}</span>
                    <span className="rounded-full bg-white px-3 py-1">Target: {targetUsers.join(" / ") || "未選択"}</span>
                    <span className="rounded-full bg-white px-3 py-1">Total: {questionCount}問</span>
                  </div>
                </div>

                <div className="mb-5 rounded-3xl border-3 border-slate-900 bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-black">今回だけの追加質問</label>
                  <div className="flex gap-2">
                    <input
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomQuestion()}
                      className="min-w-0 flex-1 rounded-2xl border-3 border-slate-900 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-pink-200"
                      placeholder="例：新しいソール形状について違和感はありますか？"
                    />
                    <Button onClick={addCustomQuestion} className="rounded-2xl border-3 border-slate-900 bg-pink-300 text-slate-900 hover:bg-pink-200">
                      <Plus size={20} />
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {generated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-5 rounded-3xl border-4 border-slate-900 bg-lime-200 p-4 text-center shadow-[4px_4px_0_#111827]"
                    >
                      <div className="text-2xl font-black">🎉 Generated! {questionCount}問のシートができました</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="max-h-[760px] space-y-4 overflow-auto pr-1">
                  {selectedGroups.length === 0 && customQuestions.length === 0 ? (
                    <div className="rounded-3xl border-4 border-dashed border-slate-300 p-10 text-center">
                      <div className="text-5xl">👟</div>
                      <p className="mt-3 text-xl font-black text-slate-500">左のカードを選ぶと質問が表示されます</p>
                    </div>
                  ) : (
                    selectedGroups.map((group) => {
                      const Icon = group.icon;
                      return (
                        <motion.div
                          key={group.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-3xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0_#111827]"
                        >
                          <div className={`mb-3 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${group.color} px-4 py-2 font-black`}>
                            <Icon size={20} /> {group.title}
                          </div>
                          <ol className="space-y-2">
                            {group.questions.map((question, index) => {
                              const isSelected = isQuestionSelected(group.id, index);

                              return (
                                <li
                                  key={question}
                                  onClick={() => toggleQuestion(group.id, index)}
                                  className={`cursor-pointer rounded-2xl p-3 font-bold leading-relaxed transition ${
                                    isSelected
                                      ? "bg-slate-50 hover:bg-cyan-50"
                                      : "bg-slate-200 line-through opacity-40 hover:opacity-70"
                                  }`}
                                >
                                  <span
                                    className={`mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${
                                      isSelected ? "bg-slate-900" : "bg-slate-400"
                                    }`}
                                  >
                                    {isSelected ? "✓" : "−"}
                                  </span>
                                  {question}
                                </li>
                              );
                            })}
                          </ol>
                        </motion.div>
                      );
                    })
                  )}

                  {customQuestions.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0_#111827]"
                    >
                      <div className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-pink-300 px-4 py-2 font-black">
                        <Plus size={20} /> 今回だけの追加質問
                      </div>
                      <ol className="space-y-2">
                        {customQuestions.map((question, index) => (
                          <li key={`${question}-${index}`} className="rounded-2xl bg-slate-50 p-3 font-bold leading-relaxed">
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                              {index + 1}
                            </span>
                            {question}
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}