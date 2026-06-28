"use client";

import { useState } from "react";
import { ActionMessage } from "@/components/student/ActionMessage";
import { Card } from "@/components/ui/Card";
import { formatActionFeedback, type ActionFeedback } from "@/lib/client/action-feedback";

export function AssignmentForm({
  assignmentId = "assignment-1"
}: {
  assignmentId?: string;
}) {
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [feedback, setFeedback] = useState<ActionFeedback>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function postSubmission(endpoint: string) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assignmentId,
        textContent,
        linkUrl
      })
    });

    return response.json();
  }

  async function handleSaveDraft() {
    setIsSaving(true);
    try {
      const result = await postSubmission("/api/submissions/draft");
      if (result.ok) {
        setFeedback({
          kind: "info",
          message: "草稿已保存"
        });
      } else {
        setFeedback(formatActionFeedback(result));
      }
    } catch {
      setFeedback({
        kind: "error",
        message: "网络异常，请稍后重试"
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const result = await postSubmission("/api/submissions/submit");
      setFeedback(formatActionFeedback(result));
    } catch {
      setFeedback({
        kind: "error",
        message: "网络异常，请稍后重试"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <p className="text-xs font-semibold text-action">作业 01 · 必交</p>
      <h1 className="mt-2 text-2xl font-bold text-forest">我的价值观地图</h1>
      <div className="mt-4 rounded-2xl bg-warm p-4 text-sm leading-6 text-ink">
        <p className="font-semibold">任务要求</p>
        <p>1. 写出 5 个核心价值观</p>
        <p>2. 说明它们如何影响选择</p>
        <p>3. 可上传图片、视频或文件</p>
      </div>
      <label className="mt-5 block text-sm font-semibold text-forest">
        文字说明
        <textarea
          className="mt-2 min-h-40 w-full rounded-2xl border border-forest/10 bg-warm p-4 text-sm outline-none focus:border-action"
          onChange={(event) => setTextContent(event.target.value)}
          placeholder="写下你的思考与结论…"
          value={textContent}
        />
      </label>
      <label className="mt-4 block text-sm font-semibold text-forest">
        成果链接
        <input
          className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-warm px-4 text-sm outline-none focus:border-action"
          onChange={(event) => setLinkUrl(event.target.value)}
          placeholder="https://"
          value={linkUrl}
        />
      </label>
      <div className="mt-4 rounded-2xl border border-dashed border-forest/20 bg-warm p-4 text-sm text-muted">
        附件上传将在下一步接入 Supabase Storage；当前可先提交文字和链接。
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-button border border-forest/10 bg-white px-5 text-sm font-semibold text-forest shadow-sm disabled:opacity-60"
          disabled={isSaving || isSubmitting}
          onClick={handleSaveDraft}
          type="button"
        >
          {isSaving ? "保存中…" : "保存草稿"}
        </button>
        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-button bg-action px-5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          disabled={isSaving || isSubmitting}
          onClick={handleSubmit}
          type="button"
        >
          {isSubmitting ? "提交中…" : "正式提交"}
        </button>
      </div>
      <ActionMessage feedback={feedback} />
    </Card>
  );
}
