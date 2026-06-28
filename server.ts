import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import mammoth from "mammoth";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase body limit to handle base64 documents safely
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route for lesson plan integration
app.post("/api/integrate", async (req, res) => {
  try {
    const client = getGeminiClient();
    const { mon, lop, tenBai, file, options } = req.body;
    const { cv2345, cv5512, nls, ai } = options || { cv2345: true, cv5512: false, nls: true, ai: true };

    let extractedText = "";
    let isPdf = false;
    let pdfBase64 = "";

    if (file && file.base64) {
      const mime = file.mimeType || "";
      if (mime.includes("officedocument.wordprocessingml") || file.name?.endsWith(".docx")) {
        // Convert docx buffer to text
        const buffer = Buffer.from(file.base64, "base64");
        const docxResult = await mammoth.extractRawText({ buffer });
        extractedText = docxResult.value;
      } else if (mime.includes("pdf") || file.name?.endsWith(".pdf")) {
        isPdf = true;
        pdfBase64 = file.base64;
      } else {
        // Assume text file
        extractedText = Buffer.from(file.base64, "base64").toString("utf-8");
      }
    }

    const gradeNum = parseInt(lop) || 1;
    let capHoc = "Tiểu học";
    let frameworkCV = "Công văn 2345/BGDĐT-GDTH";
    let levelCode = "CB1"; // default class 1-3

    if (gradeNum >= 1 && gradeNum <= 3) {
      levelCode = "CB1";
    } else if (gradeNum >= 4 && gradeNum <= 5) {
      levelCode = "CB2";
    } else if (gradeNum >= 6 && gradeNum <= 7) {
      levelCode = "TC1";
      capHoc = "THCS";
      frameworkCV = "Công văn 5512/BGDĐT-GDTrH";
    } else if (gradeNum >= 8 && gradeNum <= 9) {
      levelCode = "TC2";
      capHoc = "THCS";
      frameworkCV = "Công văn 5512/BGDĐT-GDTrH";
    } else {
      levelCode = "NC1";
      capHoc = "THPT";
      frameworkCV = "Công văn 5512/BGDĐT-GDTrH";
    }

    // Explicitly toggle based on choice if provided override
    if (cv5512) {
      frameworkCV = "Công văn 5512/BGDĐT-GDTrH";
      if (capHoc === "Tiểu học") {
        capHoc = "THCS"; // THCS or THPT standard for CV5512
      }
    } else if (cv2345) {
      frameworkCV = "Công văn 2345/BGDĐT-GDTH";
      capHoc = "Tiểu học";
    }

    const sysInstruction = `Bạn là Chuyên gia Giáo dục hàng đầu Việt Nam với hơn 25 năm kinh nghiệm biên soạn hướng dẫn và giáo án đáp ứng Chương trình GDPT 2018. Bạn am hiểu sâu sắc:
1) Thông tư 02/2025/TT-BGDĐT về Khung Năng lực số (NLS) dành cho học sinh phổ thông Việt Nam.
2) Quyết định 3439/QĐ-BGDĐT về Khung Giáo dục Trí tuệ nhân tạo (AI) trong nhà trường.

Nhiệm vụ của bạn là phân tích và lồng ghép hai mạch năng lực này một cách khoa học, tự nhiên, thiết thực vào giáo án được cung cấp. Lồng ghép phải gắn chặt mục tiêu bài học, lứa tuổi, tránh hình thức, tránh nhồi nhét, tuyệt đối không làm quá tải giáo viên và học sinh.

Khung Năng lực Số (Thông tư 02/2025/TT-BGDĐT):
- Cấu trúc chỉ báo: X.Y.ZZa (Ví dụ: 1.3.CB1a)
  + X: Miền năng lực (1: Khai thác dữ liệu & thông tin; 2: Giao tiếp & hợp tác; 3: Sáng tạo nội dung số; 4: An toàn; 5: Giải quyết vấn đề; 6: Ứng dụng trí tuệ nhân tạo)
  + Y: Năng lực thành phần (Ví dụ 1.3: Quản lý dữ liệu, thông tin và nội dung số)
  + ZZ: Mức độ tương ứng cấp học (CB1: Lớp 1-3, CB2: Lớp 4-5, TC1: Lớp 6-7, TC2: Lớp 8-9, NC1: Lớp 10-12)
  + a, b, c...: Biến thể chỉ báo cụ thể.

Khung Giáo dục AI (Quyết định 3439/QĐ-BGDĐT):
Mã miền năng lực:
- NLa: Tư duy lấy con người làm trung tâm (Tiểu học: biết AI do người tạo; THCS: hiểu vai trò con người; THPT: đánh giá tác động xã hội)
- NLb: Đạo đức AI (Tiểu học: sử dụng an toàn; THCS: áp dụng đạo đức không thiên kiến; THPT: đánh giá rủi ro đạo đức)
- NLc: Kỹ thuật & Ứng dụng AI (Tiểu học: làm quen trợ lý ảo, vẽ tranh, phân loại đơn giản; THCS: dùng AI tạo sản phẩm, viết câu lệnh prompt; THPT: hiểu thuật toán, dữ liệu, mạng nơ-ron, tối ưu)
- NLd: Thiết kế hệ thống AI (Tiểu học: trải nghiệm ý tưởng; THCS: dự án AI nhỏ; THPT: kiểm thử, cải tiến hệ thống)

Yêu cầu phân tích và trả về định dạng JSON nghiêm ngặt cấu trúc dưới đây.
Highlight rõ phần được nâng cấp hoặc bổ sung bằng cách bao quanh phần đó bằng tag html: <span class="nls-ai-addition bg-emerald-50 border-l-2 border-emerald-500 text-emerald-950 px-1.5 py-0.5 rounded font-medium shadow-sm break-words my-1 inline-block">... <strong>[Mã chỉ báo]</strong></span>.`;

    const mainPrompt = `Hãy tích hợp Năng lực số (NLS) và Giáo dục Trí tuệ Nhân tạo (AI) vào Kế hoạch bài dạy (Giáo án) sau.

THÔNG TIN BÀI HỌC:
- Môn: ${mon || "Chưa xác định"}
- Lớp: Lớp ${lop} (Cấp học: ${capHoc}, Mức độ chỉ báo NLS: ${levelCode})
- Tên bài: ${tenBai || "Chưa xác định"}
- Khung mẫu giáo án yêu cầu: ${frameworkCV}

ANALYSED LESSON CONTENT:
${extractedText ? `Nội dung giáo án do người dùng cung cấp:\n${extractedText}` : "Không có giáo án cũ tải lên. Bạn hãy xây dựng một giáo án mẫu nâng cấp chuẩn mực nhất cho bài học có tên, môn và cấp học ở trên."}

YÊU CẦU CHI TIẾT TÍCH HỢP:
1. Xác định năng lực số (Thống tư 02) và Năng lực AI (Quyết định 3439) phù hợp nhất với Mục tiêu bài dạy.
2. Thiết kế ít nhất một hoạt động học tập cụ thể có sử dụng một công cụ số hoặc AI thực tế (Sử dụng các công cụ có thật như Canva Magic, Gemini, ChatGPT, Teachable Machine, NotebookLM, Scratch, PhET, GeoGebra, MS Paint, Word...). Hoạt động phải lồng ghép tự nhiên vào tiến trình bài dạy theo quy chuẩn ${frameworkCV}.
3. Chỉ ra tiêu chí, cách đánh giá học sinh khi thực hiện hoạt động số/AI đó.
4. Mọi chỉ báo lồng ghép nâng cấp cần được bọc bởi thẻ:
<span class="nls-ai-addition bg-emerald-50 border-l-2 border-emerald-500 text-emerald-950 px-1.5 py-0.5 rounded font-medium shadow-sm break-words my-1 inline-block">... [Mã chỉ báo]</span>
để phân biệt rõ ràng với phần gốc.

Bạn cần trả về định dạng JSON chứa các thuộc tính sau:
1. "gocTomTat": Tóm tắt ngắn gọn cấu trúc và nội dung giáo án ban đầu (dạng Markdown).
2. "nangCapPlain": Bản giáo án đầy đủ đã nâng cấp (Dạng văn bản Markdown thông thường, các phần tích họp ghi mã chỉ báo bên cạnh bằng ký hiệu [Mã] đậm).
3. "nangCapHtml": Bản giáo án đầy đủ đã nâng cấp (Dạng HTML hiển thị siêu đẹp, sử dụng cấu trúc bảng chuẩn giáo án Việt Nam cho mục các hoạt động học tập, các phần lồng ghép bổ sung được bọc chính xác bằng tag class="nls-ai-addition bg-emerald-50 border-l-2 border-emerald-500 text-emerald-950 px-1.5 py-0.5 rounded font-medium shadow-sm break-words my-1 inline-block" và ghi mã chỉ báo rõ ràng).
4. "integratedIndicators": Danh sách mảng các đối tượng chứa: { "code": "mã chỉ báo_hoặc_mã AI", "type": "nls" hoặc "ai", "name": "Tên năng lực", "description": "Mô tả cụ thể của chỉ báo và lý do lồng ghép" }
5. "expertComments": Nhận xét khoa học, lời khuyên và hướng dẫn sư phạm chân thành, thực tế của chuyên gia dành cho giáo viên soạn bài học này (dạng Markdown).`;

    const contents: any[] = [];
    if (isPdf) {
      contents.push({
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf"
        }
      });
    }
    contents.push({ text: mainPrompt });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gocTomTat: { type: Type.STRING },
            nangCapPlain: { type: Type.STRING },
            nangCapHtml: { type: Type.STRING },
            integratedIndicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  type: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["code", "type", "name", "description"]
              }
            },
            expertComments: { type: Type.STRING }
          },
          required: ["gocTomTat", "nangCapPlain", "nangCapHtml", "integratedIndicators", "expertComments"]
        },
        temperature: 0.2
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Integration Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during integration." });
  }
});

// Setup Vite development server or serve build files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
