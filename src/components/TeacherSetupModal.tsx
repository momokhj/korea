import React from 'react';
import { Download, ImagePlus, RotateCcw, Trash2, X } from 'lucide-react';
import { ACHIEVEMENT_STANDARD, SymbolQuestion } from '../data/symbols';
import { buildStandaloneHtml } from '../utils/exportStandaloneHtml';
import { SymbolArtwork } from './SymbolArtwork';

interface TeacherSetupModalProps {
  isOpen: boolean;
  questions: SymbolQuestion[];
  onUpdateQuestion: (id: number, updates: Partial<SymbolQuestion>) => void;
  onResetAll: () => void;
  onClose: () => void;
}

export const TeacherSetupModal: React.FC<TeacherSetupModalProps> = ({
  isOpen,
  questions,
  onUpdateQuestion,
  onResetAll,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePhotoUpload = (id: number, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateQuestion(id, { customPhotoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadStandaloneHtml = () => {
    const html = buildStandaloneHtml(questions);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '우리나라_상징_짝맞추기.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-setup-title"
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 id="teacher-setup-title" className="text-xl md:text-2xl font-extrabold text-slate-900">
              실물 사진 업로드 · 문제 문구 설정
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              업로드한 사진은 이 화면에서만 사용되며 외부 서버로 전송되거나 저장되지 않습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="설정 창 닫기"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Achievement Standard & Quick Actions */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs md:text-sm font-semibold text-slate-700 max-w-xl">
            적용 성취기준: {ACHIEVEMENT_STANDARD}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0047A0] hover:bg-blue-800 text-white text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <Download className="w-4 h-4" />
              <span>단일 HTML 파일 저장</span>
            </button>
            <button
              type="button"
              onClick={onResetAll}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
            >
              <RotateCcw className="w-4 h-4" />
              <span>기본 그림·문구로 초기화</span>
            </button>
          </div>
        </div>

        {/* 16 Questions List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white"
            >
              <SymbolArtwork
                artworkId={q.symbolKey}
                label={q.title}
                customPhotoUrl={q.customPhotoUrl}
                className="w-20 h-20 shrink-0"
              />

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700">
                  <span>{q.id}번 · {q.title}</span>
                  <span className="text-slate-400" aria-hidden="true">·</span>
                  <span className="text-[#0047A0]">{q.levelLabel}</span>
                </div>

                <label className="block">
                  <span className="sr-only">{q.id}번 문제 문장</span>
                  <input
                    type="text"
                    value={q.prompt}
                    onChange={(e) => onUpdateQuestion(q.id, { prompt: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0047A0] text-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <ImagePlus className="w-4 h-4" />
                  <span>사진 올리기</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handlePhotoUpload(q.id, e.target.files?.[0])}
                  />
                </label>

                {q.customPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateQuestion(q.id, { customPhotoUrl: undefined })}
                    aria-label={`${q.title} 업로드 사진 삭제`}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>사진 삭제</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
