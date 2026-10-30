'use strict';
window.DEMO={
  "periods": [
    {
      "id": "fy25",
      "name": "FY2025 · 2024.04—2025.03",
      "short": "2024.04 — 2025.03",
      "updated": "2025.05.20",
      "months": [
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
        "1月",
        "2月",
        "3月"
      ]
    }
  ],
  "customers": {
    "anta": {
      "name": "安踏集团",
      "en": "ANTA GROUP",
      "mark": "ANTA",
      "className": "anta",
      "description": "多品牌体育用品集团 · 运动与户外",
      "owner": "待客户指定",
      "health": 76,
      "sales": 28,
      "category": 35,
      "launches": 42,
      "penetration": 6.8,
      "opportunity": [
        12,
        18
      ],
      "pipeline": 6.2,
      "coverage": 2.3,
      "series": [
        65,
        70,
        85,
        90,
        120,
        100,
        130,
        130,
        165,
        145,
        165,
        190
      ],
      "industry": [
        30,
        35,
        50,
        55,
        75,
        60,
        90,
        80,
        100,
        85,
        110,
        125
      ],
      "brands": [
        {
          "name": "DESCENTE",
          "cn": "迪桑特",
          "mark": "D",
          "momentum": "高",
          "potential": "高",
          "signal": "品牌动能高、当前渗透中，哪些产品系列具备可验证的新增应用空间？",
          "penetrationLevel": "中"
        },
        {
          "name": "KOLON SPORT",
          "cn": "可隆",
          "mark": "K",
          "momentum": "高",
          "potential": "高",
          "signal": "品牌动能高、当前渗透低，哪些SKU存在可验证的材料应用空白？",
          "penetrationLevel": "低"
        },
        {
          "name": "ANTA",
          "cn": "安踏",
          "mark": "A",
          "momentum": "中",
          "potential": "中",
          "signal": "品牌动能与当前渗透均为中，哪些品类应优先验证？",
          "penetrationLevel": "中"
        },
        {
          "name": "FILA",
          "cn": "斐乐",
          "mark": "F",
          "momentum": "中",
          "potential": "中",
          "signal": "品牌动能中、当前渗透低，哪些应用场景值得进一步确认？",
          "penetrationLevel": "低"
        }
      ],
      "insights": [
        [
          "增长动能",
          "户外与高端品牌的增长快于核心品牌。"
        ],
        [
          "技术卡位",
          "Polartec在抓绒/中层已有优势，保暖与外壳仍渗透不足。"
        ],
        [
          "优先空白",
          "轻量保暖与天气防护是下一步重点场景。"
        ]
      ],
      "risks": [
        [
          "竞争加剧",
          "中层与保暖领域竞争加剧。"
        ],
        [
          "价格敏感",
          "部分主流细分市场对价格敏感。"
        ],
        [
          "供应波动",
          "原材料及供应链存在波动。"
        ],
        [
          "宏观消费",
          "宏观不确定性可能影响消费者支出。"
        ]
      ],
      "healthLabel": "良好",
      "trendBasis": {
        "kind": "image_approximation",
        "unit": "待客户确认",
        "originalDataProvided": false,
        "note": "按附件B图刻度和节点取约值重绘，非原始月度数据，不推算同比。"
      }
    }
  },
  "materials": [
    {
      "name": "抓绒 / 中层",
      "en": "Fleece / Midlayer",
      "state": "优势地位",
      "level": "good",
      "pressure": "高",
      "next": "保持技术领先",
      "tech": "待产品技术团队确认"
    },
    {
      "name": "保暖",
      "en": "Insulation",
      "state": "渗透不足",
      "level": "warn",
      "pressure": "高",
      "next": "优先拓展空白",
      "tech": "待产品技术团队确认"
    },
    {
      "name": "外壳 / 天气防护",
      "en": "Shell / Weather",
      "state": "渗透不足",
      "level": "warn",
      "pressure": "高",
      "next": "优先拓展空白",
      "tech": "待产品技术团队确认"
    },
    {
      "name": "跑步 / 训练",
      "en": "Running / Training",
      "state": "新兴应用",
      "level": "blue",
      "pressure": "中",
      "next": "选择性增长",
      "tech": "待产品技术团队确认"
    }
  ],
  "metrics": [
    {
      "key": "health",
      "name": "客户健康度",
      "en": "Overall Account Health",
      "unit": "分",
      "formula": "综合健康度评分。样图给出 76/100 与 Good；材料没有确认评分权重、标准化方法或分档阈值。",
      "source": "评分模型，依赖 ERP、CRM、SKU 监测与舆情数据",
      "status": "模型与权重待确认",
      "note": "76 分与“良好”直接来自客户样图，不由本 Demo 的其他明细计算。销售增长、品类动能、技术渗透、关系深度、消费者信号只是 MD 中提出的候选维度。",
      "frequency": "月度 / 待确认"
    },
    {
      "key": "sales",
      "name": "我方销售同比",
      "en": "Our Sales Growth",
      "unit": "%",
      "formula": "（本期我方向当前集团销售额 − 上年同期销售额）÷ 上年同期销售额 × 100%。",
      "source": "我方 ERP / 财务订单数据",
      "status": "待接入",
      "note": "需要统一币种、退货、集团内品牌归属与含税口径。基期为 0 时不计算增幅。",
      "frequency": "月度 / 待确认"
    },
    {
      "key": "category",
      "name": "相关品类增速",
      "en": "Relevant Category Growth",
      "unit": "%",
      "formula": "（本期目标品类市场规模 − 上年同期市场规模）÷ 上年同期市场规模 × 100%。",
      "source": "行业报告 / 第三方品类监测",
      "status": "需外部数据",
      "note": "这是目标品类市场的增长，不等同于客户整体收入增长；目标品类和可比市场需确认。",
      "frequency": "季度 / 待确认"
    },
    {
      "key": "launches",
      "name": "相关新品同比",
      "en": "New Relevant Launches",
      "unit": "%",
      "formula": "（本期相关新品 SKU 数 − 上年同期相关新品 SKU 数）÷ 上年同期相关新品 SKU 数 × 100%。",
      "source": "客户新品清单 / 电商商品监测",
      "status": "待接入",
      "note": "以首发日期计入，需约定 SKU 去重规则、颜色尺码合并规则与目标技术场景。",
      "frequency": "月度 / 待确认"
    },
    {
      "key": "penetration",
      "name": "技术渗透率",
      "en": "Technology Penetration",
      "unit": "%",
      "formula": "监测范围内明确提及 Polartec 技术的有效 SKU 数 ÷ 同范围有效 SKU 总数 × 100%。",
      "source": "客户 SKU 主数据 / 商品详情页及吊牌识别",
      "status": "需 SKU 级数据",
      "note": "集团 6.8% 为样图示意；品牌地图按原图显示“中/低”。品牌及场景的精确分子分母未提供，不能自拟百分比或据此汇总。",
      "frequency": "月度 / 待确认"
    },
    {
      "key": "opportunity",
      "name": "潜在机会估算",
      "en": "High-potential Opportunity",
      "unit": "亿元",
      "formula": "目标场景市场空间 × 材料价值占比 × 可获取比例，按低 / 高情景形成区间。",
      "source": "市场空间模型 + 品类 / 品牌假设",
      "status": "测算模型待确认",
      "note": "是潜在空间的区间测算，并非已确认收入、销售承诺或 CRM 商机金额；样图未明确币种口径，本 Demo 暂按人民币演示。",
      "frequency": "季度 / 待确认"
    }
  ],
  "roles": [
    {
      "name": "产品团队",
      "en": "Product",
      "status": "活跃",
      "level": "good"
    },
    {
      "name": "创新团队",
      "en": "Innovation",
      "status": "活跃",
      "level": "good"
    },
    {
      "name": "采购团队",
      "en": "Sourcing",
      "status": "部分覆盖",
      "level": "warn"
    },
    {
      "name": "品牌 / 营销",
      "en": "Brand & Marketing",
      "status": "覆盖不足",
      "level": "risk"
    }
  ],
  "actions": [
    {
      "title": "建立集团级技术机会地图",
      "description": "对齐品牌、场景与现有材料应用，形成优先级。",
      "owner": "KA 负责人",
      "due": "T+7 天",
      "brand": 0
    },
    {
      "title": "锁定 2—3 个季节性重点品类",
      "description": "确认轻量保暖与防护场景的样品测试清单。",
      "owner": "产品技术团队",
      "due": "T+14 天",
      "brand": 1
    },
    {
      "title": "进入产品与创新决策链",
      "description": "在开发节点前完成需求访谈与联合技术交流。",
      "owner": "KA + 技术团队",
      "due": "T+21 天",
      "brand": 0
    },
    {
      "title": "共建联合商业化路线图",
      "description": "明确验证、开发、上市里程碑及双方责任人。",
      "owner": "联合项目组",
      "due": "T+30 天",
      "brand": 1
    }
  ]
};
