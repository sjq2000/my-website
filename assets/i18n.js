(function () {
  "use strict";

  const STORAGE_KEY = "sjq-language";
  const analyticsUrl = new URL('analytics.js', document.currentScript.src).href;
  const translations = {
    "【SJQ】身体数据实验室": "SJQ Body Data Lab",
    "身体数据实验室": "Body Data Lab",
    "首页": "Home",
    "项目": "Tools",
    "项目与服务": "Tools & Services",
    "专栏": "Articles",
    "文章专栏": "Articles",
    "个人记录": "Personal Log",
    "个人": "Personal ",
    "记录": "Log",
    "私人分析服务": "Private Analysis",
    "私人": "Private ",
    "分析服务": "Analysis Service",
    "体测计算器": "Fitness Calculator",
    "体测成绩计算器": "Fitness Score Calculator",
    "体脂率计算器": "Body Fat Calculator",
    "睾酮评估": "Testosterone Assessment",
    "睾酮水平评估": "Testosterone Assessment",
    "增肌潜力计算器": "Muscle Potential Calculator",
    "身高预测计算器": "Height Prediction Calculator",
    "生理年龄计算器": "Biological Age Calculator",
    "基因分析实验室": "Genetic Analysis Lab",
    "基因坐标实验室": "Genetic Coordinates Lab",
    "基因坐标": "Genetic Coordinates ",
    "基因": "Genetic ",
    "坐标": "Coordinates ",
    "实验室": "Lab",
    "返回首页": "Back to Home",
    "更多项目": "More Tools",
    "关于": "About ",
    "我的": "My ",
    "我": "Me",
    "好奇心": "Curiosity",
    "一点简单的介绍": "A brief introduction",
    "一些有趣的小工具和作品": "Useful tools and selected projects",
    "这里是【SJQ】身体数据实验室。": "Welcome to SJQ Body Data Lab.",
    "体测、体脂、激素、基因坐标与身体潜力分析工具": "Fitness, body fat, hormones, genetic coordinates and human potential tools",
    "用计算器和报告把身体数据变得更清楚：体测、体脂、睾酮、增肌潜力、身高预测、生理年龄和基因坐标，都可以在这里快速分析。": "Turn body data into clear insights with calculators and reports for fitness, body fat, testosterone, muscle potential, height prediction, biological age and genetic coordinates.",
    "输入你的体测数据，看看你打败了多少中国男大学生。基于《2019中国学生体质与健康调研报告》数据。": "Enter your fitness results and compare them with Chinese male university students, based on the 2019 national student health survey.",
    "输入身高、体重、腰围，自动计算体脂率、去脂肪体重和 FFMI。": "Enter height, weight and waist circumference to estimate body fat, lean body mass and FFMI.",
    "基于年龄的正态分布模型，输入睾酮值查看你在同龄人中的百分位数和健康报告。": "Enter a testosterone result to estimate your age-adjusted percentile and view an educational health report.",
    "输入身高、体重、体脂率、腕围和踝围，估算自然训练状态下的现实与最大增肌潜力。": "Estimate realistic and upper-limit natural muscle potential from height, weight, body fat, wrist and ankle measurements.",
    "根据出生时间、测量时间和当前身高，估算同龄百分位与成年身高参考值。": "Estimate age percentile and adult-height reference values from date of birth, measurement date and current height.",
    "输入出生年份、检测年份和常规血液指标，基于 Phenotypic Age 模型估算生理年龄。": "Estimate biological age using birth year, test year and routine blood markers with the Phenotypic Age model.",
    "中文坐标分析工作台：导入参考群体与目标样本，计算欧氏距离并进行单样本混合拟合。": "A browser-based G25 workspace for reference populations, target samples, Euclidean distance and single-target mixture fitting.",
    "青少年体育生身体素质评估选材、成绩预测与发展建议。价格 59 元，提交需求后联系。": "Individual assessment for young athletes, including performance profiling, projections and development recommendations.",
    "收录两篇知乎文章入口，点击卡片跳转到知乎原文阅读。": "Selected long-form articles; open a card to read the original post on Zhihu.",
    "至今的日记、思考与记录。涵盖金融、哲学、健身、旅行等。": "Personal notes and reflections on finance, philosophy, fitness, travel and more.",
    "如果你觉得有趣，欢迎分享给朋友。": "If you find these tools useful, feel free to share them.",
    "访问量": "Visits",
    "本页": "Page",
    "计算": "Calculate",
    "计算器": "Calculator",
    "结果": "Results",
    "结果解读": "Interpretation",
    "结果解读：": "Interpretation:",
    "未计算": "Not calculated",
    "未填写": "Not provided",
    "正常": "Normal",
    "偏低": "Low",
    "偏高": "High",
    "过高": "Very high",
    "基础计算免费。付费报告会结合你的输入结果，给出更完整的水平定位、优势短板和下一步建议。": "The basic calculation is free. The paid report adds a fuller assessment, strengths, limitations and practical next steps.",
    "购买完整报告": "Buy Full Report",
    "生成完整分析报告": "Generate Full Report",
    "同类比较：优势、短板和风险点": "Peer comparison: strengths, limitations and risk signals",
    "行动建议：下一步训练或改善方向": "Action plan: practical training and improvement priorities",
    "本工具为健康数据参考模型，不构成医学诊断。": "This educational model is for general reference and is not medical advice or a diagnosis.",
    "结果仅用于身体数据参考，不构成医学诊断。完整解读可在测试后生成报告。": "Results are for general body-data reference only and are not medical advice or a diagnosis.",
    "请输入": "Please enter ",
    "请选择": "Please select ",
    "例如：": "e.g. ",
    "身高（cm）": "Height (cm)",
    "体重（kg）": "Weight (kg)",
    "腰围（cm）": "Waist (cm)",
    "胸围（cm）": "Chest (cm)",
    "臀围（cm）": "Hips (cm)",
    "握力（kg）": "Grip strength (kg)",
    "肺活量（ml）": "Lung capacity (ml)",
    "立定跳远（cm）": "Standing long jump (cm)",
    "米跑（秒）": "m run (seconds)",
    "体测总分": "Total fitness score",
    "体格": "Physique",
    "心肺": "Cardiorespiratory fitness",
    "力量": "Strength",
    "耐力": "Endurance",
    "爆发力": "Power",
    "数据来源：《2019中国学生体质与健康调研报告》": "Source: 2019 Chinese National Survey on Students' Constitution and Health",
    "抖音关注": "Follow on Douyin: ",
    "具体百分位因地区不同有细微差异": "Percentiles may vary slightly by region",
    "看看你打败了多少中国男大学生": "See how you compare with Chinese male university students",
    "结果解读：这组数据说明了什么": "Interpretation: what these results mean",
    "体脂率": "Body fat ",
    "输入身高、体重、腰围，自动计算体脂率、去脂肪体重和 FFMI": "Enter height, weight and waist circumference to estimate body fat, lean body mass and FFMI.",
    "身体数据": "Body Measurements",
    "体质类型：": "Body type: ",
    "结果解读：体脂、BMI、FFMI 综合判断": "Interpretation: combined body fat, BMI and FFMI assessment",
    "行动建议：减脂、增肌或体态优化路线": "Action plan: fat loss, muscle gain or body-composition priorities",
    "体脂等级": "Body-fat category",
    "去脂肪体重": "Lean body mass",
    "估算体脂率范围": "Estimated body-fat range",
    "九宫格定位": "Body-type matrix",
    "身体类型": "Body type",
    "体脂率分析报告": "Body Fat Analysis Report",
    "生成体脂分析报告": "Generate Body Fat Report",
    "基础计算免费。付费报告会结合你的输入结果，分析你的体质类型、脂肪风险和下一步减脂/增肌方向。": "The basic calculation is free. The paid report adds body-type context, fat-related risk signals and practical fat-loss or muscle-gain priorities.",
    "回车触发计算": "Press Enter to calculate",
    "我也测试": "Take the Test",
    "分享给朋友": "Share",
    "链接已复制": "Link copied",
    "出生年份": "Year of birth",
    "检测年份": "Test year",
    "检测时实际年龄": "Age at testing",
    "生理年龄": "Biological age",
    "生理": "Biological ",
    "岁": " years",
    "约": "approximately ",
    "相差": "Difference: ",
    "整体判断为": "Overall assessment: ",
    "指标": "Metric",
    "10 年死亡风险模型值": "10-year mortality risk model estimate",
    "CRP 低于 0.01 mg/L 时按 0.01 计算。": "CRP values below 0.01 mg/L are calculated as 0.01.",
    "相对实际年龄": "Compared with chronological age",
    "年龄比值": "Age ratio",
    "计算生理年龄": "Calculate Biological Age",
    "白蛋白 Albumin（g/L）": "Albumin (g/L)",
    "肌酐 Creatinine（umol/L）": "Creatinine (umol/L)",
    "空腹血糖 Glucose（mmol/L）": "Fasting glucose (mmol/L)",
    "平均红细胞体积 MCV（fL）": "Mean corpuscular volume, MCV (fL)",
    "红细胞分布宽度 RDW（%）": "Red cell distribution width, RDW (%)",
    "碱性磷酸酶 ALP（U/L）": "Alkaline phosphatase, ALP (U/L)",
    "淋巴细胞比例（%）": "Lymphocytes (%)",
    "白细胞 WBC": "White blood cells, WBC",
    "反应蛋白 CRP（mg/L）": "C-reactive protein, CRP (mg/L)",
    "偏年轻": "Younger",
    "偏年长": "Older",
    "接近实际年龄": "Close to chronological age",
    "实际年龄": "Chronological age",
    "睾酮值": "Testosterone result",
    "年龄": "Age ",
    "百分位": "Percentile",
    "单位": "Unit",
    "男性": "Male",
    "女性": "Female",
    "生成睾酮分析报告": "Generate Testosterone Report",
    "基于年龄的正态分布模型 · 精准百分位分析": "Age-adjusted normal distribution model · percentile analysis",
    "输入基本信息": "Enter basic information",
    "单位换算": "Unit conversion",
    "免费查看百分位": "View Percentile Free",
    "生成完整睾酮报告": "Generate Full Testosterone Report",
    "免费只显示百分位。完整报告会展示同龄定位、数值换算、结果解读和建议。": "The free result shows the percentile only. The full report adds peer positioning, unit conversion, interpretation and practical recommendations.",
    "同龄定位：百分位、均值差距和等级": "Peer position: percentile, difference from the mean and category",
    "数值换算：ng/dL、nmol/L、ng/mL": "Unit conversions: ng/dL, nmol/L and ng/mL",
    "结果解读：生活方式和复查建议": "Interpretation: lifestyle and follow-up considerations",
    "报告仅供健康教育参考，不构成医学诊断或治疗建议。": "This report is for general health education only and is not medical advice, diagnosis or treatment.",
    "当前身高": "Current height",
    "身高": "Height ",
    "预测": "Prediction ",
    "父亲身高": "Father's height",
    "母亲身高": "Mother's height",
    "出生日期": "Date of birth",
    "测量日期": "Measurement date",
    "预测成年身高": "Predicted adult height",
    "同龄百分位": "Age percentile",
    "性别": "Sex",
    "男生": "Male",
    "女生": "Female",
    "出生月份": "Birth month",
    "测量年份": "Measurement year",
    "测量月份": "Measurement month",
    "测量身高（cm）": "Measured height (cm)",
    "计算身高预测": "Calculate Height Prediction",
    "输入出生时间、测量时间和当前身高，估算同龄位置与成年身高参考值。": "Enter birth date, measurement date and current height to estimate age position and an adult-height reference.",
    "结果仅作发育趋势参考，实际成年身高还会受到遗传、营养、睡眠、运动和发育节奏影响。": "Results are an educational growth reference only. Adult height is also influenced by genetics, nutrition, sleep, exercise and development timing.",
    "青少年生长状态评估": "Youth Growth Assessment",
    "填写营养相关指标，生成完整报告后查看营养状态、潜在身高亏损和补足后的参考身高。": "Add nutrition-related data to assess nutritional status, potential height impact and an optimised reference range in the full report.",
    "血清25羟基维生素D（ng/mL）": "Serum 25-hydroxy vitamin D (ng/mL)",
    "动物蛋白质摄入量（g/天）": "Animal protein intake (g/day)",
    "钙摄入量（mg/天）": "Calcium intake (mg/day)",
    "Ca摄入量（mg/天）": "Calcium intake (mg/day)",
    "睡眠时长（小时/天）": "Sleep duration (hours/day)",
    "运动情况": "Exercise level",
    "完全不运动": "No exercise",
    "很少运动": "Rarely exercises",
    "偶尔运动": "Occasional exercise",
    "规律运动": "Regular exercise",
    "经常运动": "Frequent exercise",
    "未填按偶尔运动计算": "If blank, occasional exercise is assumed",
    "生成青少年生长状态评估": "Generate Youth Growth Assessment",
    "身高预测免费。完整报告会结合维生素D、动物蛋白、钙摄入、睡眠和运动，评估生长状态与生长潜能。": "Height prediction is free. The full report evaluates growth status and potential using vitamin D, animal protein, calcium, sleep and exercise data.",
    "综合进度：营养、睡眠、运动加权评估": "Overall progress: weighted nutrition, sleep and exercise assessment",
    "潜在影响：估算可能亏损的成年身高": "Potential impact: estimated adult-height shortfall",
    "补足参考：给出优化后的身高参考值": "Optimised reference: estimated height after addressing limiting factors",
    "购买生长状态评估": "Buy Growth Assessment",
    "腕围": "Wrist circumference",
    "踝围": "Ankle circumference",
    "当前体重": "Current weight",
    "当前体脂率": "Current body fat",
    "自然增肌潜力": "Natural Muscle Potential",
    "训练年限（年，可选）": "Training experience (years, optional)",
    "计算增肌潜力": "Calculate Muscle Potential",
    "本工具为健身参考模型，结果不代表绝对上限，也不构成医学或训练诊断。": "This fitness model is for general reference. Results are not an absolute limit and do not constitute medical or training advice.",
    "现实目标": "Realistic target",
    "最大潜力": "Upper-limit potential",
    "数据导入": "Data Import",
    "导入文件": "Import File",
    "打开文件": "Open File",
    "参考群体": "Reference Populations",
    "参考群体（SOURCE）": "Reference Populations (SOURCE)",
    "参考群体样本管理": "Reference Population Manager",
    "参考群体名称": "Reference population name",
    "目标样本": "Target Samples",
    "目标样本（TARGET）": "Target Samples (TARGET)",
    "目标样本管理": "Target Sample Manager",
    "搜索参考群体": "Search reference populations",
    "搜索目标样本": "Search target samples",
    "搜索数据": "Search data",
    "搜索": "Search",
    "全部加入": "Add All",
    "一键全选": "Select All",
    "全选": "Select All",
    "取消全选": "Clear Selection",
    "加入": "Add",
    "删除": "Remove",
    "清空": "Clear",
    "样本": "samples",
    "本地": "Local",
    "示例": "Example",
    "单样本拟合": "Single-Target Fit",
    "单样本拟合（SINGLE）": "Single-Target Fit (SINGLE)",
    "多样本拟合": "Multi-Target Fit",
    "多样本拟合（MULTI）": "Multi-Target Fit (MULTI)",
    "基因距离": "Genetic Distance",
    "单目标距离": "Single-Target Distance",
    "比较模式": "Comparison Mode",
    "运行": "Run",
    "开始拟合": "Run Fit",
    "迭代": "Iterations",
    "拟合距离": "Fit distance",
    "参考成分": "Reference component",
    "权重": "Weight",
    "距离": "Distance",
    "数据不上传": "Data is not uploaded",
    "本地计算": "Runs locally",
    "在浏览器本地运行": "Runs locally in your browser",
    "中文 Global25 坐标工作台：数据导入、参考与目标数据、基因距离、双目标比较、单样本拟合和多样本拟合。": "Global25 workspace for data import, reference and target samples, genetic distance, two-target comparison, single-target fitting and multi-target fitting.",
    "严格校验 25 维": "Strict 25-dimension validation",
    "Global25 中文分析工作区": "Global25 Analysis Workspace",
    "工具页签": "Tool tabs",
    "数据导入与筛选": "Data Import & Filtering",
    "可同时打开多个 CSV/TXT 文件，筛选样本后追加或替换到参考群体与目标样本。": "Open multiple CSV or TXT files, filter samples, then append or replace reference and target datasets.",
    "载入 25 维演示数据": "Load 25-Dimension Demo Data",
    "内置全球 G25 坐标库：": "Built-in global G25 library: ",
    "正在载入全球 G25 坐标库…": "Loading the global G25 library…",
    "3 套数据源": "3 data sources",
    "现代群体": "Modern populations",
    "古代样本": "Ancient samples",
    "移除当前文件": "Remove Current File",
    "尚未打开文件": "No file opened",
    "输入名称筛选；空格=并且，?=或者，!=排除": "Filter by name; space=AND, ?=OR, !=exclude",
    "清除": "Clear",
    "追加到": "Append to",
    "替换到": "Replace",
    "筛选结果": "Filtered results",
    "要求": "Required format",
    "名称 + 25 个坐标": "Name + 25 coordinates",
    "同时包含 abc 和 def": "contains both abc and def",
    "包含 abc 或 def": "contains abc or def",
    "包含 abc 且排除 def": "contains abc and excludes def",
    "名称以 abc 开头；": "name starts with abc; ",
    "名称以 abc 结尾": "name ends with abc",
    "演示数据为 25 维虚构坐标，只用于确认流程和算法，不代表真实族群。Global25 的每一维是 PCA 坐标轴，不是 25 个独立“血统百分比”。": "Demo data contains fictional 25-dimensional coordinates for testing the workflow and algorithm only; it does not represent real populations. Each Global25 dimension is a PCA axis, not an independent ancestry percentage.",
    "每行必须是名称加 25 个数值坐标，无表头。": "Each row must contain a name followed by 25 numeric coordinates, without a header.",
    "整理格式": "Format Data",
    "有效样本": "Valid samples",
    "坐标维度": "Dimensions",
    "搜索全球 G25 坐标库": "Search Global G25 Library",
    "全部数据源": "All data sources",
    "一键全选加入": "Add All Results",
    "坐标库载入后即可搜索": "Search will be available after the library loads",
    "管理已选参考样本": "Manage Selected Reference Samples",
    "管理已选目标样本": "Manage Selected Target Samples",
    "当前显示": "Currently showing",
    "搜索已选样本": "Search selected samples",
    "删除搜索结果": "Remove Search Results",
    "粘贴一整行：名称 + 25 个坐标": "Paste one complete row: name + 25 coordinates",
    "新增参考样本": "Add Reference Sample",
    "新增目标样本": "Add Target Sample",
    "暂无参考样本": "No reference samples",
    "暂无目标样本": "No target samples",
    "可放入一个或多个 25 维样本。": "Add one or more 25-dimensional samples.",
    "基因距离（DISTANCE）": "Genetic Distance (DISTANCE)",
    "计算单目标的 G25 欧氏距离，或比较两个目标相对每个参考群体的差值、比值与 D3。": "Calculate G25 Euclidean distance for one target, or compare two targets using difference, ratio and D3 against each reference population.",
    "模式": "Mode",
    "差值": "Difference",
    "比值": "Ratio",
    "最大输出数量": "Maximum results",
    "颜色渐变": "Colour gradient",
    "开启": "On",
    "关闭": "Off",
    "距离显示": "Distance display",
    "原始距离": "Raw distance",
    "目标 A": "Target A",
    "目标 B": "Target B",
    "渐变起点": "Gradient start",
    "渐变终点": "Gradient end",
    "运行当前模式": "Run Current Mode",
    "运行全部单目标": "Run All Single Targets",
    "复制结果": "Copy Results",
    "清空输出": "Clear Output",
    "请先准备参考群体与目标样本。": "Add reference populations and target samples first.",
    "为一个目标寻找参考群体的非负加权组合。": "Find a non-negative weighted combination of reference populations for one target.",
    "计算轮次": "Calculation cycles",
    "限制成分数": "Limit component count",
    "距离附加列 ADC": "Distance auxiliary column (ADC)",
    "ADC 后重算": "Recalculate after ADC",
    "显示零值": "Show zero values",
    "条形图": "Bar chart",
    "是": "Yes",
    "否": "No",
    "运行当前目标": "Run Current Target",
    "运行全部目标": "Run All Targets",
    "选择目标样本并开始拟合。": "Select a target sample and run the fit.",
    "批量拟合所有目标，并生成参考成分 × 目标样本对照表。": "Fit all targets in a batch and generate a reference-component × target-sample table.",
    "快速模式": "Fast mode",
    "运行批量分析": "Run Batch Analysis",
    "复制 CSV": "Copy CSV",
    "复制 TSV": "Copy TSV",
    "至少需要一个参考群体和一个目标样本。": "At least one reference population and one target sample are required.",
    "25 个坐标是什么": "What are the 25 coordinates?",
    "Global25 的 25 个数值是样本在 25 条主成分轴上的位置。单个维度没有固定的“某族血统”含义；结果只能结合相同缩放方式和同一参考面板解释。距离是坐标空间的相似度，拟合比例是数学近似，不等于族源证明、亲缘鉴定或医学诊断。": "The 25 Global25 values locate a sample on 25 principal-component axes. No single dimension has a fixed ancestry meaning. Results are interpretable only with the same scaling and reference panel. Distance measures similarity in coordinate space, while fit proportions are mathematical approximations—not proof of ancestry, kinship or a medical diagnosis.",
    "此页面需要访问验证码。请输入验证码后进入 G25 分析工作区。": "This page requires an access code. Enter it to open the G25 workspace.",
    "访问验证码": "Access code",
    "验证码": "Access code",
    "进入实验室": "Enter Lab",
    "验证码错误，请重试。": "Incorrect access code. Please try again.",
    "访问验证码通过后，本标签页会保持解锁。": "After verification, this tab will remain unlocked for the session.",
    "验证码通过后，本标签页会保持解锁。": "After verification, this tab will remain unlocked for the session.",
    "打开导航": "Open navigation",
    "关闭导航": "Close navigation",
    "当前没有可加入的记录。": "There are no records to add.",
    "打开文件后，筛选结果会显示在这里。": "Filtered results will appear here after a file is opened.",
    "参考群体和目标样本页均可搜索并一键加入。": "Search and bulk-add records from both the reference and target panels.",
    "不限制": "No limit",
    "按冒号前名称合并": "Merge by name before the colon",
    "私人身体分析服务": "Private Body Analysis",
    "青少年体育生身体素质评估": "Youth Athlete Physical Assessment",
    "面向青少年体育生、家长和教练，结合身体数据、体测成绩、专项成绩和训练背景，做一次更完整的身体素质评估、选材判断与发展建议。": "A personalised assessment for young athletes, parents and coaches, combining body measurements, fitness scores, sport-specific results and training history.",
    "适合想判断专项潜力、理解体测短板、规划训练方向，或希望获得一份更个性化分析的人。": "For anyone who wants to understand athletic potential, identify performance gaps, plan training or receive a more personalised analysis.",
    "59 元 / 次": "CNY 59 / assessment",
    "元 / 次": "CNY / assessment",
    "一次性个人分析服务，非医学诊断。": "One-off personal analysis service. Not a medical diagnosis.",
    "前往 Stripe 安全支付 ¥59": "Pay securely with Stripe · CNY 59",
    "支持银行卡、Apple Pay 和 Link。支付完成后会自动返回本页并显示资料提交方式。": "Cards, Apple Pay and Link are supported. After payment, you will return here to see the submission instructions.",
    "已从 Stripe 返回": "Returned from Stripe",
    "请将姓名、年龄、身高体重、运动项目、体测/专项成绩、训练年限和希望分析的问题发送到以下邮箱。通常会按收到资料的顺序开始分析。": "Email your name, age, height, weight, sport, fitness or event results, training history and the questions you want analysed. Assessments are normally started in the order received.",
    "发送资料到 songjueqing@gmail.com": "Email your data to songjueqing@gmail.com",
    "分析内容": "What You Receive",
    "身体素质结构评估": "Physical performance profile",
    "专项潜力与项目匹配": "Sport potential and event fit",
    "体测成绩定位和短板判断": "Fitness-score positioning and gap analysis",
    "未来成绩发展空间预测": "Performance development outlook",
    "需要提供": "What to Provide",
    "身高、体重、年龄": "Height, weight and age",
    "体测成绩和专项成绩": "Fitness and sport-specific results",
    "训练年限和运动项目": "Training experience and sport",
    "可选：围度、伤病史、目标": "Optional: measurements, injury history and goals",
    "青少年体育生": "Young athletes",
    "准备选项目的人": "People choosing a sport or event",
    "想提升体测成绩的人": "People improving fitness-test results",
    "家长、教练或个人爱好者": "Parents, coaches and fitness enthusiasts",
    "服务流程": "How It Works",
    "在线支付": "Online Payment",
    "通过 Stripe 完成一次性服务付款。": "Pay once securely through Stripe.",
    "邮件发送数据": "Email Your Data",
    "支付返回后按提示提交身体和成绩数据。": "After payment, follow the instructions to submit your measurements and results.",
    "完成分析": "Analysis",
    "给出结构化判断和关键结论。": "Receive a structured assessment and the key findings.",
    "发展建议": "Development Plan",
    "提供训练方向、短板和项目选择建议。": "Receive training priorities, gap analysis and sport-selection guidance.",
    "联系邮箱：": "Email: ",
    "价格": "Price",
    "提交需求": "Submit a Request",
    "服务内容": "What's included",
    "适合人群": "Who it is for",
    "付款": "Payment",
    "立即购买": "Buy Now",
    "支付成功": "Payment successful",
    "付款成功": "Payment successful",
    "生成报告": "Generate Report",
    "完整报告": "Full Report",
    "报告": "Report",
    "完整分析报告": "Full Analysis Report",
    "完整": "Full ",
    "分析报告": "Analysis Report",
    "从计算器结果生成报告，通过 Stripe 安全支付后自动返回并解锁。": "Generate a report from your calculator results. After secure Stripe payment, you will return automatically and unlock it.",
    "支持银行卡、Apple Pay 和 Link。支付完成后将自动返回本页。": "Cards, Apple Pay and Link are supported. After payment, you will return to this page automatically.",
    "前往 Stripe 安全支付 ¥9.9": "Pay securely with Stripe · CNY 9.9",
    "前往 Stripe 安全支付 ": "Pay securely with Stripe · ",
    "你的报告": "Your Report",
    "等待计算结果": "Waiting for calculator results",
    "还没有检测到计算器结果。请先回到任意计算器完成计算，再点击该页面底部的“购买完整报告”。": "No calculator result was found. Complete any calculator first, then select Buy Full Report.",
    "去体测成绩计算器测试": "Open Fitness Score Calculator",
    "去增肌潜力计算器测试": "Open Muscle Potential Calculator",
    "去身高预测计算器测试": "Open Height Prediction Calculator",
    "关键指标": "Key Metrics",
    "体质类型": "Body Type",
    "分类逻辑": "Classification Logic",
    "行动建议": "Action Plan",
    "复测方式": "Retesting",
    "分享报告": "Share Report",
    "高FFMI": "High FFMI",
    "中FFMI": "Medium FFMI",
    "低FFMI": "Low FFMI",
    "偏瘦": "Underweight",
    "轻量肌肉型": "Lean Muscular",
    "精壮型": "Athletic",
    "强壮肌肉型": "Strong Muscular",
    "清瘦型": "Lean",
    "标准均衡型": "Balanced",
    "厚实体型": "Solid Build",
    "瘦弱型": "Low-Mass",
    "隐性偏脂型": "Low-Muscle Normal-Weight",
    "虚胖型": "Low-Muscle High-Fat",
    "你的定位": "Your position",
    "体脂率处在比较可控的区间，可以根据审美目标调整。": "Your body-fat level is in a manageable range and can be adjusted to match your physique goal.",
    "BMI和FFMI都在中间区间，适合按目标选择增肌或减脂。": "BMI and FFMI are both in the middle range, so you can choose a gradual muscle-gain or fat-loss phase based on your goal.",
    "你的定位是 ": "Your position is ",
    "你的定位是": "Your position is",
    "BMI反映体重相对身高的水平，FFMI反映去脂体重相对身高的水平。把两者交叉后，可以区分“体重大是因为肌肉多”还是“体重大但肌肉不足”。": "BMI relates body weight to height, while FFMI relates lean mass to height. Reading them together helps distinguish higher weight supported by muscle from higher weight with insufficient muscle.",
    "单看体重容易误判，结合FFMI后能更清楚地看到你的主要矛盾：到底是脂肪过多、肌肉不足，还是肌肉量不错但需要控制脂肪。": "Body weight alone can be misleading. FFMI helps show whether the main issue is excess fat, insufficient muscle, or good muscle mass with room to reduce fat.",
    "当前 BMI 为": "Current BMI is ",
    "，FFMI 为": ", FFMI is ",
    "，体脂率约": ", and body fat is approximately ",
    "去脂体重": "Lean body mass",
    "你的结构相对均衡，可以按审美目标选择方向：想更清晰就轻微减脂，想更有体积就小幅增肌。关键是不要同时大幅减脂又追求快速增肌，目标越单一，反馈越清楚。": "Your body composition is relatively balanced. Choose a mild fat-loss phase for more definition or a small surplus for more size. Keeping one primary goal makes progress easier to measure.",
    "建议每2-4周复测一次体重、腰围和训练表现。减脂期优先看腰围和体脂趋势，增肌期优先看FFMI、力量和体重是否同步上升。": "Retest body weight, waist circumference and training performance every 2–4 weeks. During fat loss, prioritise waist and body-fat trends; during muscle gain, track FFMI, strength and weight together.",
    "生成一个结果图和一个可点击分享链接，别人打开后可以直接进入体脂率测试。": "Create a result image and shareable link that opens the body-fat calculator.",
    "生成分享": "Create Share Link",
    "分享图预览": "Share Preview",
    "我的身体类型：": "My body type: ",
    "打开分享链接": "Open Share Link",
    "报告对象": "Report Subject",
    "输入数据": "Input Data",
    "核心结果": "Key Results",
    "页面原始解读": "Original Interpretation",
    "进一步解读": "Further Interpretation",
    "下一步建议": "Next Steps",
    "当前计算器": "Current calculator",
    "暂无可用数据。": "No data available.",
    "报告已生成，支付后查看": "Report ready — unlock after payment",
    "可预览：本报告将包含输入数据、核心结果、能力图表、结果解读和训练建议。": "Preview: the report includes input data, key results, performance charts, interpretation and training recommendations.",
    "还没有报告数据": "No report data yet",
    "去体脂率计算器测试": "Open Body Fat Calculator",
    "刚刚生成": "Generated just now",
    "模型估算生理年龄约": "Estimated biological age: approximately ",
    "检测时实际年龄约": "Chronological age at testing: approximately ",
    "免责声明": "Disclaimer",
    "隐私政策": "Privacy Policy",
    "服务条款": "Terms of Service",
    "退款政策": "Refund Policy",
    "联系我们": "Contact Us",
    "复制": "Copy",
    "下载": "Download",
    "打印": "Print",
    "重置": "Reset",
    "保存": "Save",
    "关闭": "Close",
    "确认": "Confirm",
    "取消": "Cancel"
    ,"年一月": " January"
    ,"年二月": " February"
    ,"年三月": " March"
    ,"年四月": " April"
    ,"年五月": " May"
    ,"年六月": " June"
    ,"年七月": " July"
    ,"年八月": " August"
    ,"年九月": " September"
    ,"年十月": " October"
    ,"年十一月": " November"
    ,"年十二月": " December"
    ,"条记录": " entries"
    ,"共": "Total "
    ,"条": " records"
  };

  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const replaceKeys = Object.keys(translations)
    .filter((key) => key.length > 1 || key === "岁" || key === "约" || key === "条" || key === "共")
    .sort((a, b) => b.length - a.length);
  let currentLanguage = "zh";
  let observer;

  function translateString(value) {
    if (!value || !/[\u3400-\u9fff]/.test(value)) return value;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const core = value.trim();
    if (translations[core]) return leading + translations[core] + trailing;
    let translated = core;
    for (const key of replaceKeys) {
      if (translated.includes(key)) translated = translated.split(key).join(translations[key]);
    }
    return leading + translated + trailing;
  }

  function shouldSkipText(node) {
    const parent = node.parentElement;
    return !parent || parent.closest("script, style, noscript, textarea, [data-no-translate], .sjq-language-switcher");
  }

  function updateTextNode(node) {
    if (shouldSkipText(node)) return;
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    const original = originals.get(node);
    const next = currentLanguage === "en" ? translateString(original) : original;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function updateAttributes(element) {
    if (!(element instanceof Element) || element.closest("[data-no-translate], .sjq-language-switcher")) return;
    const attributes = ["placeholder", "title", "aria-label"];
    if (element.matches('input[type="button"], input[type="submit"]')) attributes.push("value");
    let saved = attributeOriginals.get(element);
    if (!saved) {
      saved = {};
      attributeOriginals.set(element, saved);
    }
    for (const name of attributes) {
      if (!element.hasAttribute(name)) continue;
      if (!(name in saved)) saved[name] = element.getAttribute(name);
      const original = saved[name];
      const next = currentLanguage === "en" ? translateString(original) : original;
      if (element.getAttribute(name) !== next) element.setAttribute(name, next);
    }
  }

  function updateSubtree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      updateTextNode(root);
      return;
    }
    if (!(root instanceof Element) && root !== document) return;
    if (root instanceof Element) updateAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) updateTextNode(node);
      else updateAttributes(node);
    }
  }

  function updateMetadata() {
    document.documentElement.lang = currentLanguage === "en" ? "en-AU" : "zh-CN";
    if (!document.documentElement.dataset.sjqOriginalTitle) document.documentElement.dataset.sjqOriginalTitle = document.title;
    const originalTitle = document.documentElement.dataset.sjqOriginalTitle;
    document.title = currentLanguage === "en" ? translateString(originalTitle) : originalTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      if (!description.dataset.sjqOriginal) description.dataset.sjqOriginal = description.content;
      description.content = currentLanguage === "en" ? translateString(description.dataset.sjqOriginal) : description.dataset.sjqOriginal;
    }
  }

  function updateSwitcher() {
    document.querySelectorAll(".sjq-language-switcher button").forEach((button) => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setLanguage(language, persist) {
    currentLanguage = language === "en" ? "en" : "zh";
    if (persist) localStorage.setItem(STORAGE_KEY, currentLanguage);
    if (observer) observer.disconnect();
    updateMetadata();
    updateSubtree(document.body);
    updateSwitcher();
    if (observer) observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    window.dispatchEvent(new CustomEvent("sjq-language-change", { detail: { language: currentLanguage } }));
  }

  function buildSwitcher() {
    if (document.querySelector(".sjq-language-switcher")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "sjq-language-switcher";
    wrapper.dataset.noTranslate = "true";
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", "Language");
    wrapper.innerHTML = '<button type="button" data-lang="zh">中文</button><span aria-hidden="true">|</span><button type="button" data-lang="en">EN</button>';
    wrapper.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-lang]");
      if (button) setLanguage(button.dataset.lang, true);
    });
    const nav = document.querySelector("nav");
    if (nav) {
      const menu = nav.querySelector(".menu-toggle");
      nav.insertBefore(wrapper, menu || null);
    } else {
      wrapper.classList.add("sjq-language-switcher--floating");
      document.body.appendChild(wrapper);
    }
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .sjq-language-switcher{order:3;display:inline-flex;align-items:center;gap:7px;margin-left:18px;padding:5px 8px;border:1px solid rgba(0,191,255,.3);border-radius:999px;background:rgba(8,18,28,.9);box-shadow:0 6px 22px rgba(0,0,0,.2);white-space:nowrap;z-index:1201}
      .sjq-language-switcher button{appearance:none;border:0;background:transparent;color:#8d9aa7;font:600 13px/1.2 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;padding:4px 5px;cursor:pointer;transition:color .2s,background .2s;border-radius:999px}
      .sjq-language-switcher button:hover,.sjq-language-switcher button:focus-visible{color:#fff;outline:none;background:rgba(0,191,255,.12)}
      .sjq-language-switcher button.active{color:#00bfff}
      .sjq-language-switcher span{color:#42515e;font-size:12px}
      .sjq-language-switcher--floating{position:fixed;top:14px;right:18px;margin:0}
      nav .nav-links{order:2;margin-left:auto}
      nav .menu-toggle{order:4}
      @media(max-width:700px){.sjq-language-switcher{margin-left:auto;margin-right:8px;padding:4px 6px;gap:4px}.sjq-language-switcher button{font-size:12px;padding:4px}nav .nav-links{margin-left:0}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    addStyles();
    buildSwitcher();
    observer = new MutationObserver((mutations) => {
      observer.disconnect();
      for (const mutation of mutations) {
        if (mutation.type === "characterData") updateTextNode(mutation.target);
        mutation.addedNodes.forEach(updateSubtree);
      }
      observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    });
    const stored = localStorage.getItem(STORAGE_KEY);
    const preferred = stored || (navigator.language && !navigator.language.toLowerCase().startsWith("zh") ? "en" : "zh");
    setLanguage(preferred, false);
    const analyticsScript = document.createElement('script');
    analyticsScript.src = analyticsUrl;
    document.head.appendChild(analyticsScript);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
