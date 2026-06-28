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
    let extractedHtml = "";
    let isPdf = false;
    let pdfBase64 = "";

    if (file && file.base64) {
      const mime = file.mimeType || "";
      if (mime.includes("officedocument.wordprocessingml") || file.name?.endsWith(".docx")) {
        // Convert docx buffer to HTML to preserve table/column structure, ignoring images to avoid huge base64 tokens
        const buffer = Buffer.from(file.base64, "base64");
        const docxResult = await mammoth.convertToHtml({ buffer }, {
          convertImage: mammoth.images.imgElement(function(image) {
            return {}; // Strip image elements entirely
          })
        });
        extractedHtml = docxResult.value;

        // Extract raw text to get all text runs, including Word equations
        const docxTextResult = await mammoth.extractRawText({ buffer });
        extractedText = docxTextResult.value;
      } else if (mime.includes("pdf") || file.name?.endsWith(".pdf")) {
        isPdf = true;
        pdfBase64 = file.base64;
      } else {
        // Assume text file
        extractedText = Buffer.from(file.base64, "base64").toString("utf-8");
        extractedHtml = extractedText;
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

YÊU CẦU BẢO TOÀN NỘI DUNG VÀ CẤU TRÚC GỐC 100%:
1. Bạn phải bảo toàn ĐÚNG VÀ ĐỦ 100% tất cả câu chữ của văn bản gốc được cung cấp. Tuyệt đối KHÔNG ĐƯỢC XÓA BẤT KỲ CHỮ NÀO trong tài liệu gốc. Bạn chỉ được chèn thêm các hoạt động mới hoặc các chỉ báo lồng ghép vào đúng vị trí tiến trình học tập. Kế hoạch bài dạy đầu ra sẽ dài hơn bản gốc.
2. Giữ nguyên cấu trúc bảng/cột của giáo án gốc: Nếu giáo án gốc chia bảng 2 cột (ví dụ: 'Hoạt động của giáo viên' và 'Hoạt động của học sinh') hoặc 3 cột, giáo án đầu ra bắt buộc phải giữ nguyên đúng số cột đó, không được tự ý gộp cột, tách cột, hay đổi tên cột gốc. Bạn hãy chèn các nội dung lồng ghép mới vào bên trong các ô tương ứng một cách tự nhiên.
3. Không lồng ghép kiểu liệt kê lý thuyết, hãy viết cụ thể giáo viên hướng dẫn làm gì và học sinh làm gì bằng công cụ số/AI cụ thể.
4. Mọi phần bổ sung nâng cấp phải được bọc chính xác bởi thẻ:
<span class="nls-ai-addition bg-emerald-50 border-l-2 border-emerald-500 text-emerald-950 px-1.5 py-0.5 rounded font-medium shadow-sm break-words my-1 inline-block">... <strong>[Mã chỉ báo]</strong></span>
5. Tự động nhận diện, đối chiếu và chuẩn hóa công thức hóa học/toán học: 
  - Bản gốc tải lên có chứa các phương trình hoặc công thức hóa học, toán học được soạn bằng công cụ Equation của Word. Khi trích xuất sang HTML, các công thức này có thể bị mất hoặc lỗi hiển thị, nhưng trong bản TEXT (Văn bản thô) vẫn chứa các mảnh ký tự tuyến tính của chúng (ví dụ: H_2+Cl_2, H_2+I_2 □(⇔┴(xt,to) ), CaCO_3+CO_2+H_2 O⇌Ca(HCO_3 )_2, v.v.).
  - Bạn PHẢI đối chiếu bản văn bản thô (TEXT) để lấy ra chính xác các phương trình hóa học và công thức toán học gốc. TUYỆT ĐỐI không được tự ý thay thế phản ứng hóa học bằng phản ứng khác (Ví dụ: Bản gốc là H2 + Cl2 thì không được thay thế bằng KClO3 hay bất kỳ phản ứng nào khác).
  - Bạn hãy viết lại toàn bộ công thức hóa học dưới dạng HTML sạch đẹp: sử dụng thẻ <sub> cho chỉ số dưới (ví dụ: CaCO<sub>3</sub>, H<sub>2</sub>O, Ca(HCO<sub>3</sub>)<sub>2</sub>), thẻ <sup> cho chỉ số trên (ví dụ: t<sup>o</sup>).
  - Sử dụng TRỰC TIẾP ký tự Unicode thực tế cho các mũi tên: → (mũi tên một chiều), ⇌ (mũi tên thuận nghịch), ⇄ (mũi tên hai chiều). CẤM sử dụng các mã thực thể HTML entities (như &rightleftharpoons;, &rightleftarrows;, &rarr;...) vì khi xuất ra file Word sẽ bị lỗi hiển thị mã code thô. Ghi điều kiện phản ứng (xt, t°) rõ ràng bên cạnh hoặc bên trên mũi tên. Loại bỏ các ký tự hộp vuông lỗi "□" và các ký tự điều khiển Equation lỗi.

YÊU CẦU ĐỊNH DẠNG HTML (Dùng cho "nangCapHtml"):
1. Toàn bộ nội dung của "nangCapHtml" phải được bọc trong thẻ wrapper:
<div class="lesson-document" style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.5; color: black; text-align: justify;">...</div>
2. Mọi bảng biểu trong giáo án phải được vẽ bằng HTML có viền đen sắc nét, cụ thể:
- Thẻ <table> phải có thuộc tính: style="width: 100%; border-collapse: collapse; border: 1px solid black; margin: 15px 0; font-family: 'Times New Roman', Times, serif; font-size: 14pt;"
- Tất cả các thẻ <th> và <td> phải có thuộc tính: style="border: 1px solid black; padding: 8px; vertical-align: top; text-align: left; font-family: 'Times New Roman', Times, serif; font-size: 14pt;"
- Hàng tiêu đề <tr> của bảng có thể tô nền xám nhẹ bằng cách thêm style="background-color: #f2f2f2;" vào các ô <th>.
3. Sử dụng các thẻ HTML chuẩn (p, ul, li, strong, em, br...) để định dạng văn bản một cách chuyên nghiệp. Không sử dụng các class Tailwind CSS trong code HTML tự sinh của bảng biểu (trừ class "nls-ai-addition" để highlight trên web), mà phải dùng hoàn toàn style inline để MS Word và công cụ in ấn đọc được chuẩn chỉnh 100%.

Yêu cầu phân tích và trả về định dạng JSON nghiêm ngặt cấu trúc dưới đây.`;

    const mainPrompt = `Hãy tích hợp Năng lực số (NLS) và Giáo dục Trí tuệ Nhân tạo (AI) vào Kế hoạch bài dạy (Giáo án) sau.

THÔNG TIN BÀI HỌC:
- Môn: ${mon || "Chưa xác định"}
- Lớp: Lớp ${lop} (Cấp học: ${capHoc}, Mức độ chỉ báo NLS: ${levelCode})
- Tên bài: ${tenBai || "Chưa xác định"}
- Khung mẫu giáo án yêu cầu: ${frameworkCV}

NỘI DUNG GIÁO ÁN GỐC CHI TIẾT (ĐỐI CHIẾU 2 PHIÊN BẢN):
${extractedHtml ? `
1. PHIÊN BẢN CẤU TRÚC BẢNG (DẠNG HTML):
(Sử dụng bản này làm khung mẫu, giữ nguyên cấu trúc bảng/cột và các ô <td>):
${extractedHtml}

2. PHIÊN BẢN VĂN BẢN ĐẦY ĐỦ (DẠNG TEXT):
(Sử dụng bản này để đối chiếu và điền lại chính xác các công thức toán, lý, hóa bị thiếu hoặc bị lỗi trong bản HTML. Đảm bảo giữ nguyên 100% các phản ứng gốc trong này, không thay thế phản ứng):
${extractedText}
` : `Nội dung giáo án do người dùng cung cấp:\n${extractedText || "Không có giáo án cũ tải lên. Bạn hãy tự xây dựng một giáo án mẫu nâng cấp chuẩn mực nhất cho bài học ở trên, đảm bảo cấu trúc bảng biểu các hoạt động dạy học được chia làm 2 cột rõ ràng (Hoạt động của giáo viên | Hoạt động của học sinh), định dạng font Times New Roman cỡ 14pt."}`}

YÊU CẦU CHI TIẾT TÍCH HỢP:
1. Xác định năng lực số (Thông tư 02) và Năng lực AI (Quyết định 3439) phù hợp nhất với Mục tiêu bài dạy.
2. Thiết kế ít nhất một hoạt động học tập cụ thể có sử dụng một công cụ số hoặc AI thực tế (Sử dụng các công cụ có thật như Canva Magic, Gemini, ChatGPT, Teachable Machine, NotebookLM, Scratch, PhET, GeoGebra, MS Paint, Word...). Hoạt động phải lồng ghép tự nhiên vào tiến trình dạy học.
3. Chỉ ra tiêu chí, cách đánh giá học sinh khi thực hiện hoạt động số/AI đó.
4. Bảo đảm 100% câu từ và các phương trình phản ứng hóa học gốc được giữ lại toàn bộ, tuyệt đối không thay thế phản ứng gốc.
5. Cấu trúc bảng/cột của các hoạt động trong tài liệu gốc phải được bảo toàn chính xác. Chèn các phần hoạt động tích hợp mới trực tiếp vào trong đúng ô <td> tương ứng của bảng cũ.

Bạn cần trả về định dạng JSON chứa các thuộc tính sau:
1. "nangCapHtml": Bản giáo án đầy đủ đã nâng cấp dưới dạng HTML chuẩn định dạng Times New Roman cỡ 14pt, giữ nguyên cấu trúc bảng cột gốc, tất cả các ô trong bảng đều có style="border: 1px solid black; padding: 8px;", phần tích hợp bọc trong thẻ span class="nls-ai-addition...".
2. "integratedIndicators": Danh sách mảng các đối tượng chứa: { "code": "mã chỉ báo_hoặc_mã AI", "type": "nls" hoặc "ai", "name": "Tên năng lực", "description": "Mô tả cụ thể của chỉ báo và lý do lồng ghép" }
3. "expertComments": Nhận xét khoa học, lời khuyên và hướng dẫn sư phạm chân thành, thực tế của chuyên gia dành cho giáo viên soạn bài học này (dạng Markdown).`;

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
          required: ["nangCapHtml", "integratedIndicators", "expertComments"]
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
