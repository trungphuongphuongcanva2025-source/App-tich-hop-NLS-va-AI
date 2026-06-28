import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download, 
  File, 
  Check, 
  AlertCircle,
  GraduationCap, 
  Cpu, 
  BookOpen, 
  Printer, 
  CheckCircle2, 
  X,
  RefreshCw,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Default template for physical plan
const DEFAULT_LESSON_PLAN_HTML = `
<div class="lesson-document" style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.5; color: black; text-align: justify;">
  <div style="text-align: center; font-weight: bold; margin-bottom: 25px; font-size: 14pt; line-height: 1.3;">
    <div>TUẦN 1</div>
    <div style="text-transform: uppercase; font-size: 15pt;">Kế hoạch bài dạy</div>
    <div>Môn: Toán — Lớp 2</div>
    <div style="text-transform: uppercase; font-size: 15pt;">BÀI: ÔN TẬP CÁC SỐ ĐẾN 100</div>
    <div style="font-size: 12pt; font-weight: normal; font-style: italic; margin-top: 5px;">(2 TIẾT)</div>
    <div style="font-size: 12pt; font-weight: normal; font-style: italic;">Thời gian thực hiện: Thứ ........., ngày ...... tháng ...... năm 2023</div>
  </div>

  <div style="margin-bottom: 15px;">
    <div style="font-weight: bold;">I. YÊU CẦU CẦN ĐẠT:</div>
    <div style="padding-left: 20px;">
      <div style="font-weight: bold; text-decoration: underline;">1. Kiến thức:</div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;">Đọc số, viết số trong phạm vi 100.</li>
        <li style="margin-bottom: 4px;">So sánh các số, thứ tự số.</li>
        <li style="margin-bottom: 4px;">Hiểu cấu tạo thập phân của số.</li>
      </ul>

      <div style="font-weight: bold; text-decoration: underline; margin-top: 10px;">2. Năng lực:</div>
      <div style="font-style: italic; font-weight: bold; margin-top: 5px;">* Năng lực chung:</div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;"><strong>Năng lực tự chủ và tự học:</strong> Có ý thức học hỏi thầy cô, bạn bè và người khác để củng cố và mở rộng hiểu biết.</li>
        <li style="margin-bottom: 4px;"><strong>Năng lực giao tiếp, hợp tác:</strong> Trao đổi, thảo luận nhóm để thực hiện các nhiệm vụ học tập.</li>
        <li style="margin-bottom: 4px;"><strong>Năng lực giải quyết vấn đề và sáng tạo:</strong> Sử dụng các kiến thức đã học ứng dụng vào thực tế cuộc sống.</li>
      </ul>
      <div style="font-style: italic; font-weight: bold; margin-top: 8px;">* Năng lực đặc thù:</div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;">Tư duy và lập luận toán học, mô hình hoá toán học thông qua việc biểu diễn số bằng đồ dùng trực quan.</li>
        <li style="margin-bottom: 4px;">Giải quyết vấn đề toán học thực tế.</li>
      </ul>

      <div style="font-weight: bold; text-decoration: underline; margin-top: 10px;">3. Phẩm chất:</div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;"><strong>Chăm chỉ:</strong> Chăm chỉ suy nghĩ, tích cực tham gia phát biểu và trả lời câu hỏi; hoàn thành các bài tập đầy đủ.</li>
        <li style="margin-bottom: 4px;"><strong>Trung thực:</strong> Các em thật thà, tự trọng trong quá trình tự đánh giá và tương tác học tập.</li>
        <li style="margin-bottom: 4px;"><strong>Trách nhiệm:</strong> Giữ trật tự, biết lắng nghe ý kiến nhóm, có trách nhiệm với nhiệm vụ tập thể.</li>
      </ul>
    </div>
  </div>

  <div style="margin-bottom: 15px;">
    <div style="font-weight: bold;">II. ĐỒ DÙNG DẠY HỌC:</div>
    <div style="padding-left: 20px; margin-top: 5px;">
      <div><strong>1. Giáo viên:</strong></div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;">Giáo án, Sách giáo khoa (SGK), Sách giáo viên (SGV).</li>
        <li style="margin-bottom: 4px;">Tivi/Máy chiếu, ảnh chụp bảng số từ 1 đến 100.</li>
      </ul>
      <div style="margin-top: 8px;"><strong>2. Học sinh:</strong></div>
      <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
        <li style="margin-bottom: 4px;">SGK, Vở bài tập toán.</li>
        <li style="margin-bottom: 4px;">Bộ đồ dùng toán 2: các khối lập phương tách rời, thanh chục (thước gồm 10 khối liên kết).</li>
      </ul>
    </div>
  </div>

  <div style="margin-bottom: 15px;">
    <div style="font-weight: bold; margin-bottom: 10px;">III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (TIẾT 1):</div>
    
    <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin: 15px 0; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid black; padding: 8px; text-align: center; width: 80px; font-weight: bold; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">Thời lượng</th>
          <th style="border: 1px solid black; padding: 8px; text-align: center; width: 45%; font-weight: bold; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">HOẠT ĐỘNG DẠY (Giáo viên)</th>
          <th style="border: 1px solid black; padding: 8px; text-align: center; width: 45%; font-weight: bold; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">HOẠT ĐỘNG HỌC (Học sinh)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">5'</td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <p style="font-weight: bold; margin: 0 0 5px 0;">1. Khởi động:</p>
            <p style="font-style: italic; font-size: 12pt; margin: 0 0 5px 0; color: #555;">Mục tiêu: Tạo tâm thế hứng thú cho HS và từng bước làm quen với không khí lớp học toán mới.</p>
            <p style="font-weight: bold; margin: 5px 0 2px 0;">Cách tiến hành:</p>
            <ol style="margin: 5px 0 5px 20px; padding: 0; list-style-type: decimal;">
              <li style="margin-bottom: 3px;">GV tổ chức cho cả lớp chơi trò chơi hát múa tập thể "Năm ngón tay ngoan" để khởi động phấn khích.</li>
              <li style="margin-bottom: 3px;">GV giới thiệu bài học mới: "Ôn tập các số đến 100".</li>
            </ol>
          </td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
              <li style="margin-bottom: 4px;">Cả lớp cùng tham gia múa hát nhiệt tình theo giai điệu bài hát mẫu trên tivi.</li>
              <li style="margin-bottom: 4px;">HS lắng nghe giáo viên giới thiệu bài mới, mở sách giáo khoa trang đầu tiên.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">15'</td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <p style="font-weight: bold; margin: 0 0 5px 0;">2. Ôn tập cách đọc, viết các số tròn chục và số có hai chữ số:</p>
            <p style="font-style: italic; font-size: 12pt; margin: 0 0 5px 0; color: #555;">Mục tiêu: Ôn tập nhận biết, đọc, viết cấu tạo lập phương và viết số.</p>
            <p style="font-weight: bold; margin: 5px 0 2px 0;">Cách tiến hành:</p>
            <ol style="margin: 5px 0 5px 20px; padding: 0; list-style-type: decimal;">
              <li style="margin-bottom: 3px;">GV đưa ra mô hình thanh chục và khối lập phương lẻ. Yêu cầu học sinh quan sát.</li>
              <li style="margin-bottom: 3px;">GV đọc số: "Ba mươi lăm". Đề nghị HS lập nhóm lấy số thanh tương ứng.</li>
              <li style="margin-bottom: 3px;">GV theo dõi, hướng dẫn các nhóm lúng túng.</li>
            </ol>
          </td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
              <li style="margin-bottom: 4px;">Học sinh quan sát giáo cụ của GV.</li>
              <li style="margin-bottom: 4px;">Các nhóm HS thảo luận nhanh, rút ra 3 thanh chục (gồm 30 khối) và 5 khối lập phương lẻ đại diện cho số 35.</li>
              <li style="margin-bottom: 4px;">Đại diện nhóm đứng lên giải thích cấu tạo số: "Số 35 gồm 3 chục và 5 đơn vị".</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">15'</td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <p style="font-weight: bold; margin: 0 0 5px 0;">3. Thực hành làm bài tập bảng số:</p>
            <p style="font-style: italic; font-size: 12pt; margin: 0 0 5px 0; color: #555;">Mục tiêu: Đọc dãy số liên tục đến 100, điền khuyết số.</p>
            <p style="font-weight: bold; margin: 5px 0 2px 0;">Cách tiến hành:</p>
            <ol style="margin: 5px 0 5px 20px; padding: 0; list-style-type: decimal;">
              <li style="margin-bottom: 3px;">GV chiếu bảng số từ 1 đến 100 bị khuyết vài số ở dòng 2 và dòng 5.</li>
              <li style="margin-bottom: 3px;">Yêu cầu học sinh làm cá nhân vào vở, tìm số phù hợp điền vào chỗ trống.</li>
              <li style="margin-bottom: 3px;">Gọi một số học sinh đọc to dãy số kết quả trước lớp để kiểm tra.</li>
            </ol>
          </td>
          <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
            <ul style="margin: 5px 0 5px 20px; padding: 0; list-style-type: disc;">
              <li style="margin-bottom: 4px;">Học sinh thực hiện làm bài tập cá nhân vào vở viết sạch đẹp.</li>
              <li style="margin-bottom: 4px;">Học sinh xung phong lên bảng điền trực tiếp giá trị còn thiếu.</li>
              <li style="margin-bottom: 4px;">Cả lớp nhận xét, bổ sung và đồng thanh đọc dãy số hoàn chỉnh.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;

export default function App() {
  const [mon, setMon] = useState("Toán");
  const [lop, setLop] = useState("2");
  const [tenBai, setTenBai] = useState("Ôn tập các số đến 100");
  const [cvMode, setCvMode] = useState<'CV2345' | 'CV5512'>('CV2345');
  const [nlsEnabled, setNlsEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showHighlights, setShowHighlights] = useState(true);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // App running states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    gocTomTat: string;
    nangCapPlain: string;
    nangCapHtml: string;
    integratedIndicators: Array<{
      code: string;
      type: 'nls' | 'ai';
      name: string;
      description: string;
    }>;
    expertComments: string;
  } | null>(null);

  // Filter for indicators list state
  const [indicatorFilter, setIndicatorFilter] = useState<'all' | 'nls' | 'ai'>('all');

  // Handle manual grade selection adjusting context
  const handleLopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLop(val);
    const num = parseInt(val);
    if (num >= 1 && num <= 5) {
      setCvMode('CV2345');
    } else {
      setCvMode('CV5512');
    }
  };

  const handleCvChange = (mode: 'CV2345' | 'CV5512') => {
    setCvMode(mode);
    const num = parseInt(lop);
    if (mode === 'CV2345' && num > 5) {
      setLop("5"); // Reset to primary
    } else if (mode === 'CV5512' && num <= 5) {
      setLop("6"); // Reset to secondary
    }
  };

  // Convert File to Base64 helper
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const resultBase64 = reader.result as string;
      const base64Data = resultBase64.split(",")[1];
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        base64: base64Data,
      });
      setError(null);
    };
    reader.onerror = () => {
      setError("Không thể đọc tệp tin này. Hãy thử lại tệp .txt, .pdf hoặc .docx khác.");
    };
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerUploadInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // call express backend integration
  const handleIntegrate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/integrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mon,
          lop,
          tenBai,
          file: selectedFile,
          options: {
            cv2345: cvMode === 'CV2345',
            cv5512: cvMode === 'CV5512',
            nls: nlsEnabled,
            ai: aiEnabled
          }
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Lỗi máy chủ (${response.status}) khi tích hợp giáo án.`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không xác định khi xử lý giáo án. Vui lòng kiểm tra lại cấu hình API hoặc kết nối.");
    } finally {
      setLoading(false);
    }
  };

  // Helper formats bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Print PDF helper
  const triggerPdfPrint = () => {
    if (!result) return;
    const title = `GiaoAn_NangCap_${tenBai || "BaiHoc"}`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: "Times New Roman", Times, serif;
                line-height: 1.5;
                font-size: 14pt;
                padding: 40px;
                color: #000000;
              }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .uppercase { text-transform: uppercase; }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
                border: 1px solid #000000;
              }
              th, td {
                border: 1px solid #000000;
                padding: 8px;
                text-align: left;
                vertical-align: top;
                font-family: "Times New Roman", Times, serif;
                font-size: 14pt;
              }
              th { background-color: #f2f2f2; font-weight: bold; }
              ul { margin: 5px 0 5px 20px; padding: 0; }
              li { margin-bottom: 4px; }
              .nls-ai-addition {
                background-color: transparent !important;
                border: none !important;
                color: #000000 !important;
                padding: 0 !important;
                margin: 0 !important;
                font-weight: inherit !important;
                display: inline !important;
                box-shadow: none !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            <div style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; text-align: right; font-style: italic; margin-bottom: 20px; color: #555;">
              Giáo án nâng cấp tích hợp chuyên nghiệp - Công cụ Năng lượng Số và Giáo dục AI
            </div>
            ${result.nangCapHtml}
            <div style="margin-top: 40px; border-top: 1px solid #000000; padding-top: 20px; font-family: 'Times New Roman', Times, serif;">
              <h3 style="font-weight: bold; font-size: 14pt; margin: 0 0 10px 0;">Nhận xét & Góp ý sư phạm của Chuyên gia Giáo dục:</h3>
              <p style="white-space: pre-wrap; font-size: 12pt; color: #333333; line-height: 1.4; margin: 0;">
                ${result.expertComments}
              </p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Export to .doc Word file format
  const triggerWordExport = () => {
    if (!result) return;
    const title = `GiaoAn_NangCap_${tenBai || "BaiHoc"}`;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: "Times New Roman", serif; line-height: 1.5; font-size: 14pt; color: #000; text-align: justify; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #000000; }
          th, td { border: 1px solid #000000; padding: 8px; text-align: left; vertical-align: top; font-size: 14pt; font-family: "Times New Roman", serif; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul { margin: 5px 0 5px 20px; padding: 0; }
          li { margin-bottom: 4px; }
          .nls-ai-addition { 
            background-color: transparent !important;
            border: none !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            font-weight: inherit !important;
            display: inline !important;
          }
        </style>
      </head>
      <body>`;
    const footer = `</body></html>`;
    const bodyContent = `
      <div style="text-align: right; font-style: italic; font-size: 10pt; margin-bottom: 20px; font-family: 'Times New Roman', serif; color: #555;">
        Giáo án nâng cấp tích hợp chuyên nghiệp - Công cụ Năng lượng Số và Giáo dục AI
      </div>
      ${result.nangCapHtml}
      <hr style="margin-top: 30px; border: 0; border-top: 1px solid #000;" />
      <h3 style="font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">Lời khuyên giáo dục từ chuyên gia:</h3>
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; color: #333; margin-top: 10px; line-height: 1.4;">
        ${result.expertComments.replace(/\n/g, "<br/>")}
      </div>
    `;
 
    const fullBlobHTML = header + bodyContent + footer;
    const blob = new Blob(["\ufeff" + fullBlobHTML], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredIndicators = result?.integratedIndicators.filter(ind => {
    if (indicatorFilter === 'all') return true;
    return ind.type === indicatorFilter;
  }) || [];

  return (
    <div id="main_app_root" className="min-h-screen bg-slate-100 text-slate-950 font-sans antialiased flex flex-col">
      {/* Header Section in High-Contrast Indigo with thick border bottom */}
      <header id="header_section" className="bg-indigo-900 text-white py-6 px-6 shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span id="header_icon" className="p-2 bg-indigo-800 rounded-lg text-white">
              <GraduationCap className="h-8 w-8 text-indigo-300" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none uppercase">
                App Lồng Ghép Năng Lực Số và AI
              </h1>
              <p className="text-indigo-200 text-xs mt-1.5 font-medium">
                Theo Thông tư 02/2025/TT-BGDĐT và Quyết định 3439/QĐ-BGDĐT của Bộ Giáo dục và Đào tạo Việt Nam
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="text-right border-l border-indigo-700 pl-4">
              <span className="block text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Chuyên gia cố vấn</span>
              <span className="font-extrabold text-sm text-white">BGD&amp;ĐT VN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* Left column: Input Form Controls (Column span 5) */}
        <section id="input_controls" className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 flex-grow flex flex-col gap-4">
            
            {/* Heading indicator with solid geometric block */}
            <h2 className="text-md lg:text-lg font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2 h-6 bg-indigo-600 block rounded-xs shrink-0"></span>
              THIẾT LẬP THÔNG TIN
            </h2>

            {/* Subject & Grade select block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 flex flex-col gap-1">
                <label htmlFor="mon_text" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Môn học
                </label>
                <input
                  id="mon_text"
                  type="text"
                  value={mon}
                  onChange={(e) => setMon(e.target.value)}
                  placeholder="Ví dụ: Tin học, Toán..."
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold bg-white text-slate-800"
                />
              </div>

              {/* Grade select segment */}
              <div className="md:col-span-4 flex flex-col gap-1">
                <label htmlFor="lop_select" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Lớp
                </label>
                <select
                  id="lop_select"
                  value={lop}
                  onChange={handleLopChange}
                  className="w-full border-2 border-slate-200 rounded-lg px-2 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold bg-white text-slate-800"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((grade) => (
                    <option key={grade} value={grade}>
                      Lớp {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lesson title block */}
            <div className="flex flex-col gap-1">
              <label htmlFor="tenbai_text" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Tên bài dạy (Chủ đề)
              </label>
              <input
                id="tenbai_text"
                type="text"
                value={tenBai}
                onChange={(e) => setTenBai(e.target.value)}
                placeholder="Nhập tên bài học cần tích hợp..."
                className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold bg-white text-slate-800"
              />
            </div>

            {/* Toggle buttons CV2345 & CV5512 matching geometric theme values */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Khung cấu trúc quy chuẩn
              </label>
              <div className="grid grid-cols-2 gap-3" id="cv_toggles_container">
                {/* CV2345 primary block toggle */}
                <button
                  id="btn_cv2345"
                  type="button"
                  onClick={() => handleCvChange('CV2345')}
                  className={`border-2 rounded-lg p-3 text-left transition-all flex items-center gap-2 cursor-pointer w-full ${
                    cvMode === 'CV2345'
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="cv_radio_mode"
                    checked={cvMode === 'CV2345'}
                    onChange={() => {}}
                    className="accent-indigo-600 pointer-events-none shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">Tiểu học (CV2345)</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Khung cấu trúc Lớp 1-5</span>
                  </div>
                </button>
                
                {/* CV5512 secondary block toggle */}
                <button
                  id="btn_cv5512"
                  type="button"
                  onClick={() => handleCvChange('CV5512')}
                  className={`border-2 rounded-lg p-3 text-left transition-all flex items-center gap-2 cursor-pointer w-full ${
                    cvMode === 'CV5512'
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="cv_radio_mode"
                    checked={cvMode === 'CV5512'}
                    onChange={() => {}}
                    className="accent-indigo-600 pointer-events-none shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">Trung học (CV5512)</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Khung cấu trúc Lớp 6-12</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone matching Geometric Balance */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Tải giáo án gốc có sẵn (Khuyên dùng)
              </label>
              
              <div
                id="upload_drop_zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={triggerUploadInput}
                className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer flex-1 min-h-[140px] ${
                  isDragging 
                    ? "border-indigo-500 bg-indigo-50/10" 
                    : selectedFile 
                      ? "border-emerald-500 bg-emerald-50/15" 
                      : "border-slate-300 hover:border-indigo-400"
                }`}
              >
                <input
                  id="file_uploader"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".docx,.pdf,.txt"
                  className="hidden"
                />

                {!selectedFile ? (
                  <>
                    <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">TẢI GIÁO ÁN GỐC CÓ SẴN</p>
                    <p className="text-[10px] text-slate-400 leading-normal">Hỗ trợ định dạng .docx, .pdf, .txt</p>
                    <button className="mt-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs hover:bg-slate-100 transition-all pointer-events-none">
                      Chọn từ thiết bị
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-left">
                    <div className="flex items-center gap-2 max-w-[85%]">
                      <div className="p-2 bg-emerald-600 text-white rounded-md">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] font-semibold text-emerald-700">{formatBytes(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      id="btn_remove_file"
                      type="button"
                      onClick={removeFile}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Custom checkboxes in a clean panel */}
            <div className="flex gap-4 p-3 bg-slate-100 rounded-lg justify-start" id="integration_modes_container">
              <button
                id="toggle_nls"
                type="button"
                onClick={() => setNlsEnabled(!nlsEnabled)}
                className="flex items-center gap-2 cursor-pointer text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={nlsEnabled}
                  onChange={() => {}}
                  className="w-4 h-4 accent-indigo-600 pointer-events-none"
                />
                <span className={`text-xs font-bold uppercase tracking-wider transition-all ${nlsEnabled ? 'text-indigo-900 border-b-2 border-indigo-600' : 'text-slate-400'}`}>
                  Năng lực số
                </span>
              </button>

              <button
                id="toggle_ai"
                type="button"
                onClick={() => setAiEnabled(!aiEnabled)}
                className="flex items-center gap-2 cursor-pointer text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={() => {}}
                  className="w-4 h-4 accent-indigo-600 pointer-events-none"
                />
                <span className={`text-xs font-bold uppercase tracking-wider transition-all ${aiEnabled ? 'text-indigo-900 border-b-2 border-indigo-600' : 'text-slate-400'}`}>
                  AI
                </span>
              </button>
            </div>
            
            {(!nlsEnabled && !aiEnabled) && (
              <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Vui lòng bật ít nhất một mạch tích hợp (NLS hoặc AI) để thực hiện tích hợp.
              </p>
            )}

            {/* Massive Purple Button */}
            <button
              id="btn_integrate_action"
              type="button"
              disabled={loading || (!nlsEnabled && !aiEnabled)}
              onClick={handleIntegrate}
              className={`w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer ${
                loading || (!nlsEnabled && !aiEnabled)
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang phân tích &amp; Lồng ghép...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                  <span>Tích Hợp Năng Lực Số Và AI</span>
                </>
              )}
            </button>

          </div>
        </section>

        {/* Right column: Document PREVIEW Area (Column span 7) */}
        <section id="preview_output" className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          
          {/* Preview Panel Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-600 inline-block rounded-xs"></span>
                PREVIEW GIÁO ÁN
              </h2>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all select-none">
                <input
                  type="checkbox"
                  checked={showHighlights}
                  onChange={(e) => setShowHighlights(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
                <span>Hiện Highlight lồng ghép</span>
              </label>
            </div>
            
            {/* Download / Export actions in Geometric style */}
            {result && !loading && (
              <div className="flex gap-2" id="export_actions_wrapper">
                <button
                  id="btn_export_word"
                  type="button"
                  onClick={triggerWordExport}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-indigo-200 uppercase hover:bg-indigo-100 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Xuất Word</span>
                </button>
                <button
                  id="btn_export_pdf"
                  type="button"
                  onClick={triggerPdfPrint}
                  className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-rose-200 uppercase hover:bg-rose-100 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Printer className="h-3 w-3" />
                  <span>Xuất PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Paper View Container with slate-50 background */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 flex flex-col relative justify-start">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Loading screen with pedagogy motivational lines */
                <motion.div
                  key="loading_pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-50/95 backdrop-blur-xs flex flex-col items-center justify-center p-8 text-center z-10"
                >
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <Sparkles className="h-5 w-5 text-[#8a3bf2] absolute animate-pulse" />
                  </div>
                  <h3 className="text-md font-bold text-indigo-900 mb-1">
                    ĐANG PHÂN TÍCH VÀ NÂNG CẤP GIÁO ÁN
                  </h3>
                  <div className="max-w-md text-xs text-slate-500 leading-relaxed space-y-2">
                    <p className="font-semibold text-indigo-600 animate-pulse">
                      "Đang lồng ghép các hoạt động NLS lớp {lop} và trải nghiệm AI bám sát TT02..."
                    </p>
                    <p className="text-[10px] italic">
                      Tra cứu mã chỉ báo {cvMode === 'CV2345' ? 'CB1/CB2' : 'TC1/TC2/NC1'} và chuẩn hóa thành mục tiêu rõ ràng.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Error state showoff */}
            {error && (
              <div id="error_alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs mb-4 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Đã xảy ra lỗi hệ thống:</p>
                  <p className="mt-1 font-semibold leading-normal">{error}</p>
                </div>
              </div>
            )}

            {/* Actual paper look */}
            <div className={`bg-white w-full shadow-md border border-slate-200 mx-auto p-5 md:p-8 rounded-lg ${showHighlights ? "show-highlights" : "hide-highlights"}`}>
              <style>{`
                .hide-highlights .nls-ai-addition {
                  background-color: transparent !important;
                  border: none !important;
                  color: #000000 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  font-weight: inherit !important;
                  box-shadow: none !important;
                  display: inline !important;
                }
                .show-highlights .nls-ai-addition {
                  background-color: #ecfdf5 !important;
                  border-left: 2.5px solid #10b981 !important;
                  color: #064e3b !important;
                  padding: 2px 5px !important;
                  border-radius: 4px;
                  font-weight: bold;
                  display: inline-block;
                  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .lesson-document {
                  font-family: 'Times New Roman', Times, serif !important;
                  font-size: 14pt !important;
                  line-height: 1.5 !important;
                  color: #000000 !important;
                }
                .lesson-document p, 
                .lesson-document span:not(.nls-ai-addition), 
                .lesson-document div, 
                .lesson-document li, 
                .lesson-document td, 
                .lesson-document th, 
                .lesson-document strong, 
                .lesson-document em, 
                .lesson-document ol, 
                .lesson-document ul {
                  font-family: 'Times New Roman', Times, serif !important;
                  font-size: 14pt !important;
                  color: #000000 !important;
                }
                .lesson-document table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  border: 1px solid #000000 !important;
                  margin: 15px 0 !important;
                }
                .lesson-document td, .lesson-document th {
                  border: 1px solid #000000 !important;
                  padding: 8px !important;
                  font-size: 14pt !important;
                  vertical-align: top !important;
                }
                .lesson-document th {
                  background-color: #f2f2f2 !important;
                  font-weight: bold !important;
                  text-align: center !important;
                }
              `}</style>
              {result ? (
                <div id="upgraded_document_display" className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-950 font-semibold">
                      Đã lồng ghép thành công các chỉ báo của Bộ Giáo dục vào bài dạy! Highlight màu xanh hiển thị phần bổ sung.
                    </p>
                  </div>

                  {/* Display rendered paper result */}
                  <div 
                    id="lesson_document_body"
                    className={`prose prose-sm max-w-none font-serif text-slate-800 ${showHighlights ? "show-highlights" : "hide-highlights"}`}
                    dangerouslySetInnerHTML={{ __html: result.nangCapHtml }}
                  />
                </div>
              ) : (
                /* Default layout display before integrate action */
                <div id="default_document_display">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <Award className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Bản Xem Trước Giáo Án Quy Chuẩn</p>
                      <p className="text-[10px] text-indigo-800 leading-relaxed mt-0.5">
                        Dưới đây là mẫu kế hoạch bài dạy môn Toán Tiểu học. Khi bạn điền môn học riêng, chọn cấp học và bấm nút <strong>Tích hợp</strong>, hệ thống sẽ tự động nâng cấp cấu hình này sang cấu hình lồng ghép chuẩn chỉnh.
                      </p>
                    </div>
                  </div>

                  <div 
                    id="default_lesson_document"
                    className={`pointer-events-none select-none opacity-85 ${showHighlights ? "show-highlights" : "hide-highlights"}`}
                    dangerouslySetInnerHTML={{ __html: DEFAULT_LESSON_PLAN_HTML }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Expert and integrated indicators section underneath */}
          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 border-t border-slate-100 bg-slate-50"
              id="analysis_and_advice_grid"
            >
              {/* Box A: List of integrated indicators */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                      CHỈ BÁO ĐÃ TÍCH HỢP
                    </h3>
                  </div>
                  
                  {/* Indicator type filter dropdown */}
                  <div className="flex gap-1">
                    {['all', 'nls', 'ai'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setIndicatorFilter(type as any)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                          indicatorFilter === type 
                            ? "bg-indigo-600 text-white" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {type === 'all' ? 'Tất cả' : type === 'nls' ? 'NLS' : 'AI'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredIndicators.length > 0 ? (
                    filteredIndicators.map((ind, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                          ind.type === 'nls' 
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-950" 
                            : "bg-indigo-50/50 border-indigo-100 text-indigo-950"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider ${
                            ind.type === 'nls' 
                              ? "bg-emerald-600 text-white" 
                              : "bg-indigo-600 text-white"
                          }`}>
                            {ind.code}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {ind.type === 'nls' ? "Năng lực Số" : "Mạch AI"}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 text-xs mt-0.5 leading-tight">{ind.name}</p>
                        <p className="text-[10px] text-slate-600 leading-normal mt-0.5 font-medium">{ind.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 font-medium text-center py-4">
                      Không tìm thấy chỉ báo phù hợp trong mục lọc này.
                    </p>
                  )}
                </div>
              </div>

              {/* Box B: Expert Comments Advises */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-left">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                    LỜI KHUYÊN PHƯƠNG PHÁP
                  </h3>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 mb-2">
                    <p className="text-[9px] italic text-indigo-900 font-bold">
                      Ghi chú phương pháp của Chuyên gia Giáo dục:
                    </p>
                  </div>
                  <div className="prose prose-xs whitespace-pre-wrap font-medium text-slate-700 text-[11px] leading-relaxed">
                    {result.expertComments}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </section>

      </main>

      {/* Decorative clean human credit footer */}
      <footer id="footer_section" className="border-t border-slate-200 py-4 bg-slate-200 text-center text-[10px] text-slate-500 flex justify-between px-6">
        <p>© 2026 App Lồng Ghép Năng Lực Số và AI. Hệ thống hỗ trợ giáo viên phổ thông Việt Nam.</p>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span>Thông tư 02/2025/TT-BGDĐT</span>
          <span>Quyết định 3439/QĐ-BGDĐT</span>
        </div>
      </footer>
    </div>
  );
}
