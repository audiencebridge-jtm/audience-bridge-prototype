"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Users, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { getAudienceMatchUploads, getAudienceMatchCount, type AudienceMatchUpload } from "@/lib/mock-data";

interface AudienceMatchingTabProps {
  newsletterId: string;
}

type UploadStatus = "idle" | "processing" | "success" | "error";

export function AudienceMatchingTab({ newsletterId }: AudienceMatchingTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<AudienceMatchUpload[]>(() => getAudienceMatchUploads(newsletterId));
  const [totalRecords, setTotalRecords] = useState(() => getAudienceMatchCount(newsletterId));
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function processFile(file: File) {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      setUploadStatus("error");
      setStatusMessage("Please upload a .csv or .txt file");
      return;
    }

    setUploadStatus("processing");
    setStatusMessage(`Processing ${file.name}...`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // Skip header row if it looks like one
      const start = /^(email|md5|hash|md5_lc_hem)/i.test(lines[0] ?? "") ? 1 : 0;
      const dataLines = lines.slice(start);
      const recordCount = dataLines.length;

      if (recordCount === 0) {
        setUploadStatus("error");
        setStatusMessage("File contains no records");
        return;
      }

      // Simulate upload completing
      setTimeout(() => {
        const newUpload: AudienceMatchUpload = {
          id: `u${Date.now()}`,
          publicationId: newsletterId,
          fileName: file.name,
          uploadDate: new Date().toISOString().split("T")[0],
          recordCount,
          uploadedBy: "justin@sovidigital.com",
        };

        setUploads((prev) => [newUpload, ...prev]);
        setTotalRecords((prev) => prev + recordCount);
        setUploadStatus("success");
        setStatusMessage(`Successfully uploaded ${recordCount.toLocaleString()} records from ${file.name}`);
      }, 1200);
    };
    reader.onerror = () => {
      setUploadStatus("error");
      setStatusMessage("Failed to read file");
    };
    reader.readAsText(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Audience Match Records</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalRecords.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Total records in audience match pool for this newsletter</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How Audience Matching Works</h3>
            <p className="text-sm text-gray-700 mb-3">
              Upload a list of your most engaged subscribers and we&apos;ll use it to build smart look-a-like audiences for lead generation. The more records you provide, the better your audience match quality will be.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">What to upload:</span> Subscribers who are actively opening and clicking your emails.</p>
              <p><span className="font-medium">How to segment:</span> Export anyone who has clicked in the last 60 days or opened in the last 30 days from your ESP.</p>
              <p><span className="font-medium">Minimum size:</span> 5,000 records. The larger the list, the better the match.</p>
              <p><span className="font-medium">Accepted formats:</span> CSV or TXT file with one email address or MD5 hash per line. If you provide emails, we&apos;ll hash them automatically.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Upload Audience File</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload a CSV file containing email addresses or MD5 hashes of your most engaged subscribers.
          Emails will be converted to lowercase MD5 hashes automatically.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">
            Drag & drop your file here, or <span className="text-blue-600">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Accepts .csv or .txt &mdash; one entry per line</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Status message */}
        {uploadStatus !== "idle" && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm rounded-md px-3 py-2 ${
              uploadStatus === "processing"
                ? "bg-blue-50 text-blue-700"
                : uploadStatus === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {uploadStatus === "processing" && (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
            {uploadStatus === "success" && <CheckCircle2 className="w-4 h-4" />}
            {uploadStatus === "error" && <AlertCircle className="w-4 h-4" />}
            {statusMessage}
          </div>
        )}
      </div>

      {/* Upload history */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Upload History</h3>
        </div>

        {uploads.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">File Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Upload Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Records</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Uploaded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uploads.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        {u.fileName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.uploadDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">{u.recordCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.uploadedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
          {uploads.length} upload{uploads.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
