// PDF-only English version (No Parameters)
// Replace entire app/page.tsx with this file

"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import {
  Check,
  Sparkles,
  Zap,
  Download,
  Plus,
  ClipboardList,
  Palette,
  Footprints,
  Wind,
  Shield,
  RotateCcw,
  Star,
  Gauge,
  Smile,
} from "lucide-react";

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
    pdfQuestions: [
      "Was the shoe length appropriate?",
      "How was the width fit?",
      "Was there any pressure around the instep?",
      "Was the heel hold secure?",
    ],
    icon: Footprints,
    color: "from-cyan-300 to-blue-500",
    questions: [
      "足長サイズは適切でしたか？",
      "足幅のフィット感はどうでしたか？",
      "甲周りの圧迫感はありましたか？",
      "踵のホールド感は十分でしたか？",
    ],
  },
  {
    id: "cushion",
    title: "クッション性",
    label: "Cushion",
    pdfQuestions: [
      "How soft was the landing feel?",
      "Did you feel enough rebound?",
      "Was the cushioning amount appropriate?",
    ],
    icon: Smile,
    color: "from-lime-300 to-green-500",
    questions: [
      "着地時の柔らかさはどう感じましたか？",
      "反発感は十分に感じられましたか？",
      "クッション量は適切でしたか？",
    ],
  },
  {
    id: "design",
    title: "デザイン",
    label: "Design",
    pdfQuestions: [
      "What was your impression of the overall design?",
      "Did the shoe feel premium?",
      "Would you recommend this design?",
    ],
    icon: Star,
    color: "from-fuchsia-300 to-pink-500",
    questions: [
      "全体デザインの印象はどうでしたか？",
      "高級感は感じられましたか？",
      "他人に勧めたいデザインですか？",
    ],
  },
];

const categories = ["Running", "Lifestyle", "Training"];
const users = ["初級者", "中級者", "一般ユーザー"];

export default function PopShoesHearingSheetMaker() {
  const [modelName, setModelName] = useState("Cloud Runner Proto 01");
  const [category, setCategory] = useState("Running");
  const [targetUsers, setTargetUsers] = useState(["初級者"]);
  const [selected, setSelected] = useState(["fit", "cushion"]);
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

    if (customQuestions.length > 0) {
      doc.setFontSize(14);
      doc.text("Custom Questions", 20, y);
      y += 10;

      customQuestions.forEach((q, index) => {
        const lines = doc.splitTextToSize(
          `Custom ${index + 1}. ${q}`,
          160
        );

        doc.setFontSize(10);
        doc.text(lines, 24, y);
        y += lines.length * 6 + 2;

        doc.line(24, y, 185, y);
        y += 8;
      });
    }

    doc.save("hearing-sheet.pdf");
  };

  const toggleGroup = (id: string) => {
    setGenerated(false);

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleQuestion = (groupId: string, index: number) => {
    const questionId = getQuestionId(groupId, index);

    setExcludedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleUser = (user: string) => {
    setTargetUsers((prev) =>
      prev.includes(user)
        ? prev.filter((item) => item !== user)
        : [...prev, user]
    );
  };

  const addCustomQuestion = () => {
    const value = customQuestion.trim();

    if (!value) return;

    setCustomQuestions((prev) => [...prev, value]);
    setCustomQuestion("");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#111827]">
          <h1 className="text-4xl font-black">
            HEARING SHEET MAKER
          </h1>

          <p className="mt-2 font-bold text-slate-500">
            PDF export only uses English text.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#111827]">
              <h2 className="mb-4 text-xl font-black">
                Sample Info
              </h2>

              <label className="mb-2 block font-black">
                モデル名
              </label>

              <input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="mb-4 w-full rounded-2xl border-4 border-slate-900 p-3 font-bold"
              />

              <label className="mb-2 block font-black">
                対象ユーザー
              </label>

              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <button
                    key={user}
                    onClick={() => toggleUser(user)}
                    className={`rounded-full border-4 border-slate-900 px-4 py-2 font-black ${
                      targetUsers.includes(user)
                        ? "bg-pink-300"
                        : "bg-white"
                    }`}
                  >
                    {user}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#111827]">
              <h2 className="mb-4 text-xl font-black">
                評価項目
              </h2>

              <div className="grid gap-3">
                {questionGroups.map((group) => {
                  const Icon = group.icon;

                  return (
                    <button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`rounded-3xl border-4 border-slate-900 p-4 text-left ${
                        selected.includes(group.id)
                          ? "bg-cyan-200"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black">
                        <Icon size={20} />
                        {group.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#111827]">
            <div className="mb-5 flex flex-wrap gap-3">
              <Button
                onClick={() => setGenerated(true)}
                className="rounded-full border-4 border-slate-900 bg-lime-300 px-6 py-3 font-black"
              >
                GENERATE
              </Button>

              <Button
                onClick={exportPDF}
                className="rounded-full border-4 border-slate-900 bg-pink-300 px-6 py-3 font-black"
              >
                PDF EXPORT
              </Button>
            </div>

            <div className="mb-6 rounded-3xl border-4 border-dashed border-slate-400 p-4">
              <label className="mb-2 block font-black">
                追加質問
              </label>

              <div className="flex gap-2">
                <input
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="flex-1 rounded-2xl border-4 border-slate-900 p-3 font-bold"
                />

                <Button
                  onClick={addCustomQuestion}
                  className="rounded-2xl border-4 border-slate-900 bg-yellow-300 px-4"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              {selectedGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-3xl border-4 border-slate-900 p-4"
                >
                  <h3 className="mb-4 text-2xl font-black">
                    {group.title}
                  </h3>

                  <div className="space-y-2">
                    {group.questions.map((question, index) => {
                      const isSelected = isQuestionSelected(
                        group.id,
                        index
                      );

                      return (
                        <div
                          key={question}
                          onClick={() =>
                            toggleQuestion(group.id, index)
                          }
                          className={`cursor-pointer rounded-2xl p-3 font-bold ${
                            isSelected
                              ? "bg-slate-100"
                              : "bg-slate-300 line-through opacity-50"
                          }`}
                        >
                          {question}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {generated && (
              <div className="mt-6 rounded-3xl border-4 border-slate-900 bg-lime-200 p-4 text-center text-xl font-black">
                Sheet Generated!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
