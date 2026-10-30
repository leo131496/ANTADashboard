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
        100,
        106,
        114,
        117,
        134,
        122,
        146,
        145,
        166,
        153,
        168,
        190
      ],
      "industry": [
        100,
        102,
        108,
        110,
        119,
        113,
        126,
        122,
        133,
        125,
        138,
        148
      ],
      "brands": [
        {
          "name": "DESCENTE",
          "cn": "迪桑特",
          "mark": "D",
          "momentum": "高",
          "potential": "高",
          "segment": "高端户外 / 轻量保暖",
          "tech": "待结合产品规格确认",
          "relation": "角色级关系覆盖见客户关系页；品牌级关系待提供",
          "signal": "高端户外品类增速领先，具备轻量保暖技术合作空间。",
          "penetrationLevel": "中"
        },
        {
          "name": "KOLON SPORT",
          "cn": "可隆",
          "mark": "K",
          "momentum": "高",
          "potential": "高",
          "segment": "专业户外 / 防风防护",
          "tech": "待结合产品规格确认",
          "relation": "角色级关系覆盖见客户关系页；品牌级关系待提供",
          "signal": "品牌增长与当前技术渗透形成缺口，优先验证防护场景。",
          "penetrationLevel": "低"
        },
        {
          "name": "ANTA",
          "cn": "安踏",
          "mark": "A",
          "momentum": "中",
          "potential": "中",
          "segment": "跑步训练 / 日常运动",
          "tech": "待结合产品规格确认",
          "relation": "角色级关系覆盖见客户关系页；品牌级关系待提供",
          "signal": "主品牌体量较大，适合从重点系列开展技术应用试点。",
          "penetrationLevel": "中"
        },
        {
          "name": "FILA",
          "cn": "斐乐",
          "mark": "F",
          "momentum": "中",
          "potential": "中",
          "segment": "运动生活 / 城市户外",
          "tech": "待结合产品规格确认",
          "relation": "角色级关系覆盖见客户关系页；品牌级关系待提供",
          "signal": "关注舒适与城市户外需求，先验证品牌合作意向。",
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
          "中层与保暖领域竞品投入增加。",
          "高"
        ],
        [
          "价格敏感",
          "主流运动系列对材料成本较为敏感。",
          "中"
        ],
        [
          "供应波动",
          "原材料与交期波动可能影响开发节奏。",
          "中"
        ],
        [
          "消费变化",
          "宏观不确定性影响非刚需消费。",
          "中"
        ]
      ],
      "healthLabel": "良好"
    }
  },
  "materials": [
    {
      "name": "抓绒 / 中层",
      "en": "Fleece / Midlayer",
      "state": "优势巩固",
      "level": "good",
      "pressure": "高",
      "next": "保持技术领先",
      "tech": "待产品技术团队确认"
    },
    {
      "name": "轻量保暖",
      "en": "Lightweight Insulation",
      "state": "渗透不足",
      "level": "warn",
      "pressure": "高",
      "next": "优先拓展空白",
      "tech": "待产品技术团队确认"
    },
    {
      "name": "防风 / 防护",
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
