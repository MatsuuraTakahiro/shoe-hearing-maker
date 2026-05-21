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

type QuestionGroup = {
  id: string;
  title: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  accent: string;
  parameters: string[];
  questions: string[];
};

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

const questionGroups: QuestionGroup[] = [
  {
    id: "fit",
    title: "Fit",
    label: "Fit",
    icon: Footprints,
    color: "from-cyan-300 to-blue-500",
    accent: "bg-cyan-100",
    parameters: ["Length Fit", "Width Fit", "Instep Pressure", "Heel Hold", "Foot Slide"],
    questions: [
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
    title: "Cushion",
    label: "Cushion",
    icon: Smile,
    color: "from-lime-300 to-green-500",
    accent: "bg-lime-100",
    parameters: ["Softness", "Rebound", "Impact Absorption", "Fatigue Reduction", "Forefoot Cushion"],
    questions: [
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
    title: "Stability",
    label: "Stability",
    icon: Gauge,
    color: "from-orange-300 to-red-500",
    accent: "bg-orange-100",
    parameters: ["Side-to-side Stability", "Landing Stability", "Ankle Support", "Cornering", "Midsole Rigidity"],
    questions: [
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
    title: "Lightweight",
    label: "Lightweight",
    icon: Zap,
    color: "from-yellow-300 to-amber-500",
    accent: "bg-yellow-100",
    parameters: ["Hand Feel Weight", "Walking Weight Feel", "Long-wear Load", "Ease of Movement"],
    questions: [
      "Did the shoe feel light when held?",
      "Did the weight bother you while walking?",
      "Did the weight feel burdensome during long wear?",
      "Did the weight affect ease of movement?",
    ],
  },
  {
    id: "breathability",
    title: "Breathability",
    label: "Breathability",
    icon: Wind,
    color: "from-sky-300 to-indigo-500",
    accent: "bg-sky-100",
    parameters: ["Ventilation", "Heat Build-up", "Summer Comfort", "Material Comfort"],
    questions: [
      "Did your feet feel hot or humid inside the shoe?",
      "Did the shoe feel breathable enough?",
      "Would this shoe be comfortable in summer?",
      "Did the upper material feel prone to heat build-up?",
    ],
  },
  {
    id: "flexibility",
    title: "Flexibility",
    label: "Flexibility",
    icon: RotateCcw,
    color: "from-violet-300 to-purple-500",
    accent: "bg-violet-100",
    parameters: ["Bending Ease", "Forefoot Flex", "Stiffness", "Weight Transition"],
    questions: [
      "How easy was the shoe to bend while walking?",
      "Was the forefoot flex natural?",
      "Did the shoe feel stiff during movement?",
      "Did the shoe support smooth weight transition?",
    ],
  },
  {
    id: "grip",
    title: "Grip",
    label: "Grip",
    icon: Shield,
    color: "from-emerald-300 to-teal-500",
    accent: "bg-emerald-100",
    parameters: ["Slip Resistance", "Wet Surface Grip", "Stopping Grip", "Ground Contact"],
    questions: [
      "Did the shoe feel slippery?",
      "Did the shoe feel secure on wet surfaces?",
      "How was the grip during sudden stops?",
      "Was the outsole ground contact sufficient?",
    ],
  },
  {
    id: "durability",
    title: "Durability",
    label: "Durability",
    icon: Shield,
    color: "from-slate-300 to-slate-600",
    accent: "bg-slate-100",
    parameters: ["Material Strength", "Abrasion Resistance", "Long-term Use", "Upper Strength"],
    questions: [
      "Did you have any concerns about material durability?",
      "Were there any areas that seemed likely to wear quickly?",
      "Did the shoe feel suitable for long-term use?",
      "Did the upper material seem strong enough?",
    ],
  },
  {
    id: "easy",
    title: "Easy On/Off",
    label: "Easy On/Off",
    icon: Plus,
    color: "from-pink-300 to-rose-500",
    accent: "bg-pink-100",
    parameters: ["Ease of Putting On", "Ease of Taking Off", "Opening Size", "Stress During On/Off"],
    questions: [
      "How easy was it to put on the shoe?",
      "How easy was it to take off the shoe?",
      "Was the opening size appropriate?",
      "Did you feel any stress while putting on or taking off the shoe?",
    ],
  },
  {
    id: "design",
    title: "Design",
    label: "Design",
    icon: Star,
    color: "from-fuchsia-300 to-pink-500",
    accent: "bg-fuchsia-100",
    parameters: ["First Impression", "Silhouette", "Premium Feel", "Brand Identity", "Purchase Interest"],
    questions: [
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
    title: "Color",
    label: "Color",
    icon: Palette,
    color: "from-rose-300 via-orange-300 to-yellow-400",
    accent: "bg-rose-100",
    parameters: ["Color Impression", "Color Balance", "Styling Versatility", "Premium Color Feel", "Shelf Impact"],
    questions: [
      "What was your impression of the colorway?",
      "Did the color balance feel good?",
      "Does the color seem easy to style with outfits?",
      "Did the color feel premium?",
      "Would this color stand out in stores?",
    ],
  },
  {
    id: "scene",
    title: "Usage Scene",
    label: "Usage Scene",
    icon: ClipboardList,
    color: "from-blue-300 to-cyan-500",
    accent: "bg-blue-100",
    parameters: ["Daily Use", "Sports Use", "Commuting", "Versatility"],
    questions: [
      "Does the shoe seem easy to use daily?",
      "Does the shoe feel suitable for sports use?",
      "Would the shoe be suitable for commuting or school?",
    ],
  },
  {
    id: "overall",
    title: "Overall",
    label: "Overall",
    icon: Sparkles,
    color: "from-indigo-300 to-violet-500",
    accent: "bg-indigo-100",
    parameters: ["Overall Satisfaction", "Purchase Intent", "Recommendation Intent", "Improvement Priority"],
    questions: [
      "What is your overall satisfaction with this sample?",
      "Would you consider purchasing this shoe?",
      "What points would you like to improve?",
    ],
  },
];

const categories = ["Running", "Lifestyle", "Kids", "Work", "Training", "Outdoor"];
const users = ["Beginner", "Intermediate", "Advanced", "Internal Tester", "General User"];

export default function PopShoesHearingSheetMaker() {
  const [modelName, setModelName] = useState("Cloud Runner Proto 01");
  const [category, setCategory] = useState("Running");
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

  const getQuestionId = (groupId: string, index: number) => `${groupId}-${index}`;

  const isQuestionSelected = (groupId: string, index: number) => {
    return !excludedQuestions.includes(getQuestionId(groupId, index));
  };

  const getSelectedQuestions = (group: QuestionGroup) => {
    return group.questions.filter((_, index) => isQuestionSelected(group.id, index));
  };

  const questionCount =
    selectedGroups.reduce((sum, group) => sum + getSelectedQuestions(group).length, 0) +
    customQuestions.length;

  const parameterCount = selectedGroups.reduce(
    (sum, group) => sum + group.parameters.length,
    0
  );

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
      const questions = getSelectedQuestions(group);
      if (questions.length === 0 && group.parameters.length === 0) return;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text(group.label, 20, y);
      y += 9;

      if (group.parameters.length > 0) {
        doc.setFontSize(10);
        doc.text("Rating Parameters (1: Poor / 5: Excellent)", 20, y);
        y += 8;

        group.parameters.forEach((parameter) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(9);
          doc.text(`${parameter}:   1    2    3    4    5`, 24, y);
          y += 7;
        });

        y += 5;
      }

      if (questions.length > 0) {
        doc.setFontSize(10);
        doc.text("Questions", 20, y);
        y += 8;

        questions.forEach((q, index) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          const questionLines = doc.splitTextToSize(`${index + 1}. ${q}`, 160);
          doc.setFontSize(10);
          doc.text(questionLines, 24, y);
          y += questionLines.length * 6 + 2;
          doc.line(24, y, 185, y);
          y += 8;
        });

        y += 5;
      }
    });

    if (customQuestions.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text("Custom Questions", 20, y);
      y += 10;

      customQuestions.forEach((q, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        const questionLines = doc.splitTextToSize(`Custom ${index + 1}. ${q}`, 160);
        doc.setFontSize(10);
        doc.text(questionLines, 24, y);
        y += questionLines.length * 6 + 2;
        doc.line(24, y, 185, y);
        y += 8;
      });
    }

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

  const selectAllQuestionsInGroup = (groupId: string) => {
    setExcludedQuestions((prev) => prev.filter((id) => !id.startsWith(`${groupId}-`)));
  };

  const deselectAllQuestionsInGroup = (groupId: string, questionLength: number) => {
    const ids = Array.from({ length: questionLength }, (_, index) =>
      getQuestionId(groupId, index)
    );
    setExcludedQuestions((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const toggleUser = (user: string) => {
    setTargetUsers((prev) =>
      prev.includes(user) ? prev.filter((item) => item !== user) : [...prev, user]
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

  const exportText = () => {
    const lines: string[] = [];
    lines.push(`Hearing Sheet: ${modelName || "Untitled Sample"}`);
    lines.push(`Category: ${category}`);
    lines.push(`Target: ${targetUsers.join(" / ") || "Not selected"}`);
    lines.push("");

    selectedGroups.forEach((group) => {
      const questions = getSelectedQuestions(group);
      if (questions.length === 0 && group.parameters.length === 0) return;

      lines.push(`■ ${group.title}`);

      if (group.parameters.length > 0) {
        lines.push("[Rating Parameters]");
        group.parameters.forEach((parameter) => lines.push(`${parameter}: 1 2 3 4 5`));
        lines.push("");
      }

      if (questions.length > 0) {
        lines.push("[Questions]");
        questions.forEach((q, index) => lines.push(`${index + 1}. ${q}`));
        lines.push("");
      }
    });

    if (customQuestions.length > 0) {
      lines.push("■ Custom Questions");
      customQuestions.forEach((q, index) => lines.push(`${index + 1}. ${q}`));
    }

    navigator.clipboard?.writeText(lines.join("\n"));
  };

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
                Select evaluation areas, rating parameters, and questions for each shoe sample.
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

                <label className="mb-2 block text-sm font-black">Model Name</label>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="mb-4 w-full rounded-2xl border-3 border-slate-900 bg-slate-50 px-4 py-3 font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-cyan-200"
                  placeholder="Example: Cloud Runner Proto 01"
                />

                <label className="mb-2 block text-sm font-black">Category</label>
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

                <label className="mb-2 block text-sm font-black">Target User</label>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <button
                      key={user}
                      onClick={() => toggleUser(user)}
                      className={`rounded-full border-3 border-slate-900 px-3 py-2 text-sm font-black transition ${
                        targetUsers.includes(user)
                          ? "bg-pink-300 shadow-[3px_3px_0_#111827]"
                          : "bg-white hover:bg-slate-100"
                      }`}
                    >
                      {targetUsers.includes(user) ? "✓ " : ""}
                      {user}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#111827]">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-black">Evaluation Areas</h2>
                    <p className="text-sm font-bold text-slate-500">
                      Toggle categories ON/OFF
                    </p>
                  </div>
                  <Button
                    onClick={reset}
                    className="rounded-full border-3 border-slate-900 bg-white px-4 py-2 font-black text-slate-900 hover:bg-slate-100"
                  >
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {questionGroups.map((group) => {
                    const Icon = group.icon;
                    const isOn = selected.includes(group.id);
                    const selectedQuestionCount = getSelectedQuestions(group).length;

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
                        <div className="text-xs font-black uppercase tracking-wide opacity-80">
                          {group.label}
                        </div>
                        <div className="mt-2 rounded-full bg-white/75 px-2 py-1 text-xs font-black">
                          {selectedQuestionCount}/{group.questions.length} Questions
                        </div>
                        <div className="mt-1 rounded-full bg-white/75 px-2 py-1 text-xs font-black">
                          {group.parameters.length} Parameters
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
                    <p className="font-bold text-slate-500">
                      Click questions to include or exclude them from the sheet.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setGenerated(true)}
                      className="rounded-full border-4 border-slate-900 bg-lime-300 px-5 py-6 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] hover:bg-lime-200"
                    >
                      <Zap className="mr-2 inline" size={20} /> SHEET GENERATE!
                    </Button>
                    <Button
                      onClick={exportText}
                      className="rounded-full border-4 border-slate-900 bg-cyan-300 px-5 py-6 text-base font-black text-slate-900 shadow-[4px_4px_0_#111827] hover:bg-cyan-200"
                    >
                      <Download className="mr-2 inline" size={20} /> COPY
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
                  <div className="text-2xl font-black">{modelName || "Untitled Sample"}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm font-black">
                    <span className="rounded-full bg-white px-3 py-1">Category: {category}</span>
                    <span className="rounded-full bg-white px-3 py-1">
                      Target: {targetUsers.join(" / ") || "Not selected"}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1">
                      Total: {questionCount}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1">
                      Parameters: {parameterCount}
                    </span>
                  </div>
                </div>

                <div className="mb-5 rounded-3xl border-3 border-slate-900 bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-black">Custom Question</label>
                  <div className="flex gap-2">
                    <input
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomQuestion()}
                      className="min-w-0 flex-1 rounded-2xl border-3 border-slate-900 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-pink-200"
                      placeholder="Example: Did you notice anything unusual about the new sole shape?"
                    />
                    <Button
                      onClick={addCustomQuestion}
                      className="rounded-2xl border-3 border-slate-900 bg-pink-300 px-4 text-slate-900 hover:bg-pink-200"
                    >
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
                      <div className="text-2xl font-black">
                        🎉 Generated! {questionCount} questions and {parameterCount} rating parameters selected.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="max-h-[760px] space-y-4 overflow-auto pr-1">
                  {selectedGroups.length === 0 && customQuestions.length === 0 ? (
                    <div className="rounded-3xl border-4 border-dashed border-slate-300 p-10 text-center">
                      <div className="text-5xl">👟</div>
                      <p className="mt-3 text-xl font-black text-slate-500">
                        Select categories on the left to preview questions.
                      </p>
                    </div>
                  ) : (
                    selectedGroups.map((group) => {
                      const Icon = group.icon;
                      const selectedQuestionCount = getSelectedQuestions(group).length;

                      return (
                        <motion.div
                          key={group.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-3xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0_#111827]"
                        >
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div
                              className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${group.color} px-4 py-2 font-black`}
                            >
                              <Icon size={20} /> {group.title}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => selectAllQuestionsInGroup(group.id)}
                                className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black hover:bg-lime-100"
                              >
                                All ON
                              </button>
                              <button
                                onClick={() =>
                                  deselectAllQuestionsInGroup(group.id, group.questions.length)
                                }
                                className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black hover:bg-pink-100"
                              >
                                All OFF
                              </button>
                            </div>
                          </div>

                          <div className="mb-3 grid gap-2 rounded-2xl bg-slate-50 p-3">
                            <div className="text-sm font-black text-slate-500">
                              Rating Parameters (1–5)
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.parameters.map((parameter) => (
                                <span
                                  key={parameter}
                                  className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black"
                                >
                                  {parameter}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-3 text-sm font-black text-slate-500">
                            {selectedQuestionCount}/{group.questions.length} selected
                          </div>

                          <ol className="space-y-2">
                            {group.questions.map((question, index) => {
                              const isSelected = isQuestionSelected(group.id, index);

                              return (
                                <li
                                  key={`${group.id}-${index}`}
                                  onClick={() => toggleQuestion(group.id, index)}
                                  className={`cursor-pointer rounded-2xl p-3 font-bold leading-relaxed transition ${
                                    isSelected
                                      ? "bg-slate-50 hover:bg-cyan-50"
                                      : "bg-slate-200 opacity-45 line-through hover:opacity-70"
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
                        <Plus size={20} /> Custom Questions
                      </div>
                      <ol className="space-y-2">
                        {customQuestions.map((question, index) => (
                          <li
                            key={`${question}-${index}`}
                            className="rounded-2xl bg-slate-50 p-3 font-bold leading-relaxed"
                          >
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
