// Trust graph page strings (ui/app/trustgraph/page.tsx + components/TrustGraphSimulator.tsx).
export const en = {
  graph: {
    hero: {
      notice: "Whitepaper is under construction and will be updated soon.",
      subtitle:
        "Graph & AI-based Trust Evaluation Network for High-Risk Food / Seafood Supply Chains",
    },
    s1: {
      title: "I. Vision & Technological Philosophy",
      p1a: "The system completely resolves the ",
      gigo: "\"Garbage In - Garbage Out\" (GIGO)",
      p1b: " dilemma on Blockchain using a ",
      zeroTrust: "Zero-Trust philosophy",
      p1c: ".",
      q1: "Instead of considering Blockchain as the core, the project positions it merely as an ",
      evidenceLayer: "\"Evidence Storage Layer\"",
      q2: ". The heart and brain of the system lie in two core technologies: the ",
      graphEngine: "Graph Analytics Engine",
      q3: " and the ",
      riskEngine: "Dynamic AI Risk Engine",
      q4: ", combined with a human network (Human Protocol) to verify physical truths before recording them on-chain.",
    },
    s2: {
      title: "II. System Architecture (5 Core Layers Model)",
      intro:
        "The new architecture is built around two AI cores, processing data across 5 distinct layers:",
      l1: {
        heading: "Layer 1: Human Oracle Input Layer",
        intro:
          "The entry point for real-world data, including physical and logical checkpoints:",
        poaLabel: "Proof of Action:",
        poa: " Users must upload media (photos/videos of feed packaging, water test results) with embedded metadata (GPS, Timestamp) instead of just entering text.",
        ruleLabel: "Rule-based Validation:",
        rule: " Automatically scans for basic logical errors (incorrect yield inputs, manipulation speed violations, duplicate IDs).",
        dagLabel: "DAG Topological Check:",
        dag: " Ensures batches strictly follow the Directed Acyclic Graph (DAG) sequence, prohibiting any illegal bypasses.",
      },
      l2: {
        heading: "[CORE 1] Network Graph Analytics Engine",
        intro:
          "Data is pushed into a Graph Database (e.g., Neo4j). This acts as the \"Eye\" of the system, utilizing Graph Neural Networks (GNN) to scan for micro and macro fraud behaviors:",
        collusionLabel: "Collusion Clique Detection:",
        collusion:
          " Utilizes Louvain / Watts-Strogatz algorithms to identify closed node clusters (farmers/officials) continuously cross-verifying each other to form isolated factions.",
        pairLabel: "Pair-Risk Evaluation:",
        pair: " Uses the Adamic-Adar index to monitor \"Submitter/Approver\" pairs. An overly high ratio of internal transactions triggers a red flag.",
        linkLabel: "Link Prediction:",
        link: " The GNN model proactively predicts an account's fraud risk based on its positional shift within the network, even before a violation occurs.",
      },
      l3: {
        heading: "[CORE 2] Dynamic AI Risk Engine",
        intro:
          "This is the \"Brain\" delivering the final verdict. Replacing simple linear formulas, the system deploys Non-linear Machine Learning algorithms (such as XGBoost or Random Forest) to calculate:",
        weightsLabel: "Contextual Adaptive Weights:",
        weights:
          " The ML model self-adjusts risk levels based on time (disease seasons), geographical location, and batch nature.",
        riskLabel: "Risk Score (",
        riskSuffix: "):",
        riskDesc:
          " The metric evaluating the toxicity/fraud probability of a batch.",
        trustLabel: "Trust Score (",
        trustSuffix: "):",
        trustDesc:
          " A Beta Reputation System evaluating accumulated individual trustworthiness.",
        killLabel: "Kill-switch Mechanism:",
        killDesc1:
          " Bypasses all past reputation, instigating an immediate rejection (",
        killDesc2:
          ") if critical errors (e.g., banned antibiotic residue) are detected.",
      },
      l4: {
        heading: "Layer 4: Execution & Consensus Layer",
        intro:
          "Based on Graph and Risk AI outputs, Smart Contracts automatically route the workflow:",
        greenTitle: "Green Zone (Auto-Approve)",
        greenD1: "Low ",
        greenD2: ", valid DAG \u2192 Approved, ",
        greenD3: " added to Validator, recorded on Blockchain.",
        yellowTitle: "Yellow Zone (Pending)",
        yellowD1: "Suspicious ",
        yellowD2:
          " \u2192 Held. Dispatches 1-2 random, graph-distant Validators for a Cross-check / Random Audit.",
        redTitle: "Red Zone (Reject/Slashing)",
        redD1: "Critical error / Collusion \u2192 Transaction cancelled, severe ",
        redD2: " deduction, and stake slashed.",
      },
      l5: {
        heading: "Layer 5: Decentralized Storage & Oracle Ecosystem",
        li1: "Only clean data that passes Layer 4 (along with Evidence Hash, Risk Score, and Trust Score) is permanently immutably written to the Blockchain.",
        oracleLabel: "Oracle API Provision:",
        li2: " Opens APIs allowing external systems to query verified trust data.",
      },
    },
    s3: {
      title: "III. Incentive Mechanism & Game Theory",
      intro:
        "The system implements Game Theory to naturally steer user behavior toward honesty:",
      rewardsLabel: "Reputation Rewards:",
      rewards1: " Farmers/Validators maintaining a high Trust Score (",
      rewards2:
        ") receive priority approval processing or earn token rewards during surprise cross-checks.",
      slashLabel: "Slashing Penalties:",
      slash:
        " Attempting to \"bribe\" verifiers becomes futile because the Graph Engine (Core 1) detects anomalous links, prompting the Risk Engine (Core 2) to impose heavy reputation penalties, eventually disabling the compromised account from platform operations.",
    },
    s4: {
      title: "IV. Commercial Value Unlocking (New Business Models)",
      intro:
        "With this architecture, the project transcends traditional SaaS for a single seafood company, unlocking revenue from 2 core models:",
      b2b: {
        title: "1. \"Trust Oracle API\" Model (B2B)",
        li1: "Packaging the system as a specialized Supply Chain Risk Oracle.",
        li2a:
          "E-commerce platforms, supermarket chains, or international certifiers (e.g., ASC, GlobalGAP) can call your API to ask: ",
        quote:
          "\"What is the probability of documentation collusion risk for this shrimp batch?\"",
      },
      defi: {
        title: "2. DeFi Agricultural Lending Model",
        li1: "Integrating with Banks or Decentralized Finance (DeFi) protocols.",
        li2a: "Utilizing the Trust Score (",
        li2b: ") and Farmer behavior graphs as a Decentralized Credit Score.",
        li3: "Banks can automatically approve uncollateralized loans for farmers showcasing transparent networks and maintaining Risk Scores strictly within the Green Zone for 10 consecutive harvests.",
      },
    },
    sim: {
      subtitle: "Trust Network Simulator",
      legendTitle: "Nodes",
      legendSource: "Source Node",
      legendStation: "Station Node",
      controlsTitle: "Control Panel",
      controlsSubtitle: "Choose a network state to simulate",
      statusPrefix: "Status: ",
      btnNormal: "Normal Flow",
      btnCollusion: "Collusion",
      btnAnomaly: "Anomaly",
      riskLabel: "Risk Score",
      run: "Run Algorithm",
      running: "Extracting features...",
      noteInit: "Initializing pipeline, extracting graph features...",
      note1: "Stage 1/3: Denoising (filtering trivial nodes/edges).",
      note2: "Stage 2/3: Isolating collusion clusters & anomalies (signal boost).",
      status: {
        normal: {
          title: "SECURE NETWORK",
          description: "GNN detected no anomaly. Data flow is stable.",
        },
        collusion: {
          title: "COLLUSION DETECTED",
          description:
            "Abnormal cross-validation cluster found. Source check required.",
        },
        anomaly: {
          title: "LOGIC ANOMALY",
          description: "Deviant behavior with bursty transaction pattern.",
        },
      },
      criticalTitle: "CRITICAL RISK DETECTED",
      criticalDesc: "Louvain: closed collusion cluster. LOF: anomalous yield.",
      back: "Back",
      report: "VIEW FULL REPORT",
    },
  },
};

export const vi: typeof en = {
  graph: {
    hero: {
      notice: "Whitepaper đang được hoàn thiện và sẽ sớm được cập nhật.",
      subtitle:
        "Mạng lưới đánh giá niềm tin dựa trên Đồ thị & AI cho chuỗi cung ứng thực phẩm / hải sản rủi ro cao",
    },
    s1: {
      title: "I. Tầm nhìn & Triết lý Công nghệ",
      p1a: "Hệ thống giải quyết triệt để bài toán ",
      gigo: "\"Garbage In - Garbage Out\" (GIGO)",
      p1b: " trên Blockchain bằng triết lý ",
      zeroTrust: "Zero-Trust (không tin tưởng mặc định)",
      p1c: ".",
      q1: "Thay vì xem Blockchain làm cốt lõi, dự án chỉ định vị nó như một ",
      evidenceLayer: "\"Lớp lưu trữ bằng chứng\"",
      q2: ". Trái tim và bộ não của hệ thống nằm ở hai công nghệ cốt lõi: ",
      graphEngine: "Cỗ máy phân tích Đồ thị",
      q3: " và ",
      riskEngine: "Cỗ máy Đánh giá Rủi ro AI Động",
      q4: ", kết hợp với mạng lưới con người (Human Protocol) để xác minh sự thật vật lý trước khi ghi lên chuỗi khối.",
    },
    s2: {
      title: "II. Kiến trúc Hệ thống (Mô hình 5 Lớp Cốt lõi)",
      intro:
        "Kiến trúc mới được xây dựng xoay quanh hai cỗ máy AI, xử lý dữ liệu qua 5 lớp riêng biệt:",
      l1: {
        heading: "Lớp 1: Lớp Dữ liệu Đầu vào của Human Oracle",
        intro:
          "Điểm tiếp nhận dữ liệu thực tế, bao gồm các trạm kiểm tra vật lý và logic:",
        poaLabel: "Bằng chứng Hành động:",
        poa: " Người dùng phải tải lên ảnh/video (hình ảnh bao bì thức ăn, kết quả kiểm tra nước) kèm siêu dữ liệu (GPS, dấu thời gian) thay vì chỉ nhập văn bản.",
        ruleLabel: "Xác thực theo Quy tắc:",
        rule: " Tự động quét các lỗi logic cơ bản (nhập sai sản lượng, vi phạm tốc độ xử lý, trùng lặp mã định danh).",
        dagLabel: "Kiểm tra Topo DAG:",
        dag: " Đảm bảo các lô hàng tuân thủ nghiêm ngặt trình tự Đồ thị Có hướng Không chu trình (DAG), ngăn chặn mọi hành vi vượt bước bất hợp pháp.",
      },
      l2: {
        heading: "[CỐT LÕI 1] Cỗ máy Phân tích Đồ thị Mạng lưới",
        intro:
          "Dữ liệu được đẩy vào Cơ sở dữ liệu Đồ thị (ví dụ: Neo4j). Đây đóng vai trò \"Đôi mắt\" của hệ thống, sử dụng Mạng nơ-ron Đồ thị (GNN) để quét các hành vi gian lận vi mô và vĩ mô:",
        collusionLabel: "Phát hiện Cụm thông đồng:",
        collusion:
          " Sử dụng thuật toán Louvain / Watts-Strogatz để nhận diện các cụm nút khép kín (người nuôi/cán bộ) liên tục xác thực chéo lẫn nhau, hình thành các phe phái biệt lập.",
        pairLabel: "Đánh giá Rủi ro theo Cặp:",
        pair: " Dùng chỉ số Adamic-Adar để giám sát các cặp \"Người gửi/Người phê duyệt\". Tỷ lệ giao dịch nội bộ quá cao sẽ phát tín hiệu cảnh báo.",
        linkLabel: "Dự đoán Liên kết:",
        link: " Mô hình GNN chủ động dự đoán rủi ro gian lận của một tài khoản dựa trên vị trí của nó trong mạng lưới, ngay cả trước khi vi phạm xảy ra.",
      },
      l3: {
        heading: "[CỐT LÕI 2] Cỗ máy Đánh giá Rủi ro AI Động",
        intro:
          "Đây là \"Bộ não\" đưa ra phán quyết cuối cùng. Thay vì các công thức tuyến tính đơn giản, hệ thống triển khai các thuật toán Học máy Phi tuyến (như XGBoost hay Random Forest) để tính toán:",
        weightsLabel: "Trọng số Thích ứng theo Ngữ cảnh:",
        weights:
          " Mô hình ML tự điều chỉnh mức rủi ro dựa trên thời gian (mùa dịch bệnh), địa lý và tính chất của lô hàng.",
        riskLabel: "Điểm Rủi ro (",
        riskSuffix: "):",
        riskDesc:
          " Chỉ số đánh giá xác suất độc hại/gian lận của một lô hàng.",
        trustLabel: "Điểm Tin cậy (",
        trustSuffix: "):",
        trustDesc:
          " Hệ thống Danh tiếng Beta đánh giá mức độ đáng tin cậy tích lũy của từng cá nhân.",
        killLabel: "Cơ chế Kill-switch:",
        killDesc1:
          " Bỏ qua toàn bộ danh tiếng trong quá khứ, kích hoạt từ chối ngay lập tức (",
        killDesc2:
          ") nếu phát hiện lỗi nghiêm trọng (ví dụ: tồn dư kháng sinh cấm sử dụng).",
      },
      l4: {
        heading: "Lớp 4: Lớp Thực thi & Đồng thuận",
        intro:
          "Dựa trên kết quả của AI Đồ thị và AI Rủi ro, Hợp đồng Thông minh tự động điều hướng quy trình:",
        greenTitle: "Vùng Xanh (Tự động phê duyệt)",
        greenD1: "Thấp ",
        greenD2: ", DAG hợp lệ \u2192 Được duyệt, ",
        greenD3: " cộng vào Validator, ghi lên Blockchain.",
        yellowTitle: "Vùng Vàng (Chờ xử lý)",
        yellowD1: "Đáng ngờ ",
        yellowD2:
          " \u2192 Tạm giữ. Điều động 1-2 Validator ngẫu nhiên, xa trên đồ thị, để kiểm tra chéo / kiểm toán ngẫu nhiên.",
        redTitle: "Vùng Đỏ (Từ chối/Phạt cắt stake)",
        redD1: "Lỗi nghiêm trọng / Thông đồng \u2192 Giao dịch bị hủy, ",
        redD2: " bị trừ nặng, và stake bị cắt phạt.",
      },
      l5: {
        heading: "Lớp 5: Hệ sinh thái Lưu trữ Phi tập trung & Oracle",
        li1: "Chỉ dữ liệu sạch vượt qua Lớp 4 (kèm Evidence Hash, Điểm Rủi ro và Điểm Tin cậy) mới được ghi vĩnh viễn, bất biến lên Blockchain.",
        oracleLabel: "Cung cấp Oracle API:",
        li2: " Mở API cho phép các hệ thống bên ngoài truy vấn dữ liệu tin cậy đã xác minh.",
      },
    },
    s3: {
      title: "III. Cơ chế Khuyến khích & Lý thuyết Trò chơi",
      intro:
        "Hệ thống áp dụng Lý thuyết Trò chơi để định hướng hành vi người dùng một cách tự nhiên về sự trung thực:",
      rewardsLabel: "Phần thưởng Danh tiếng:",
      rewards1: " Người nuôi/Validator duy trì Điểm Tin cậy cao (",
      rewards2:
        ") sẽ được ưu tiên xử lý phê duyệt hoặc nhận phần thưởng token trong các đợt kiểm tra chéo bất ngờ.",
      slashLabel: "Hình phạt Cắt phạt:",
      slash:
        " Mọi nỗ lực \"hối lộ\" người xác minh đều trở nên vô nghĩa vì Cỗ máy Đồ thị (Cốt lõi 1) phát hiện các liên kết bất thường, buộc Cỗ máy Rủi ro (Cốt lõi 2) áp dụng hình phạt danh tiếng nặng nề, cuối cùng vô hiệu hóa tài khoản vi phạm khỏi hoạt động của nền tảng.",
    },
    s4: {
      title: "IV. Khai thác Giá trị Thương mại (Mô hình Kinh doanh Mới)",
      intro:
        "Với kiến trúc này, dự án vượt ra ngoài mô hình SaaS truyền thống cho một công ty hải sản đơn lẻ, mở khóa doanh thu từ 2 mô hình cốt lõi:",
      b2b: {
        title: "1. Mô hình \"Trust Oracle API\" (B2B)",
        li1: "Đóng gói hệ thống thành một Oracle Rủi ro Chuỗi cung ứng chuyên biệt.",
        li2a:
          "Các sàn thương mại điện tử, chuỗi siêu thị hoặc tổ chức chứng nhận quốc tế (ví dụ: ASC, GlobalGAP) có thể gọi API của bạn để hỏi: ",
        quote:
          "\"Xác suất rủi ro thông đồng trong chứng từ của lô tôm này là bao nhiêu?\"",
      },
      defi: {
        title: "2. Mô hình Cho vay Nông nghiệp DeFi",
        li1: "Tích hợp với các Ngân hàng hoặc giao thức Tài chính Phi tập trung (DeFi).",
        li2a: "Sử dụng Điểm Tin cậy (",
        li2b: ") và đồ thị hành vi của Người nuôi như một Điểm Tín dụng Phi tập trung.",
        li3: "Ngân hàng có thể tự động phê duyệt khoản vay không thế chấp cho người nuôi có mạng lưới minh bạch và duy trì Điểm Rủi ro nghiêm ngặt trong Vùng Xanh trong 10 vụ thu hoạch liên tiếp.",
      },
    },
    sim: {
      subtitle: "Mô phỏng Mạng lưới Tin cậy",
      legendTitle: "Các nút",
      legendSource: "Nút nguồn",
      legendStation: "Nút trạm",
      controlsTitle: "Bảng Điều khiển",
      controlsSubtitle: "Chọn mô phỏng trạng thái mạng lưới",
      statusPrefix: "Trạng thái: ",
      btnNormal: "Luồng Chuẩn",
      btnCollusion: "Thông Đồng",
      btnAnomaly: "Dị Thường",
      riskLabel: "Điểm rủi ro",
      run: "Chạy Thuật Toán",
      running: "Đang trích xuất đặc trưng...",
      noteInit: "Khởi tạo pipeline, trích xuất đặc trưng đồ thị...",
      note1: "Giai đoạn 1/3: Giảm nhiễu (lọc nút/cạnh không quan trọng).",
      note2: "Giai đoạn 2/3: Cô lập cụm thông đồng & điểm dị thường (tăng cường tín hiệu).",
      status: {
        normal: {
          title: "MẠNG LƯỚI AN TOÀN",
          description: "GNN không phát hiện bất thường. Luồng dữ liệu ổn định.",
        },
        collusion: {
          title: "PHÁT HIỆN THÔNG ĐỒNG",
          description:
            "Phát hiện cụm xác thực chéo bất thường. Cần kiểm tra nguồn.",
        },
        anomaly: {
          title: "DỊ THƯỜNG LOGIC",
          description: "Hành vi lệch chuẩn với pattern giao dịch đột biến.",
        },
      },
      criticalTitle: "PHÁT HIỆN RỦI RO NGHIÊM TRỌNG",
      criticalDesc: "Louvain: Cụm thông đồng khép kín. LOF: Sản lượng dị thường.",
      back: "Quay lại",
      report: "XEM BÁO CÁO CHI TIẾT",
    },
  },
};
