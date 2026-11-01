'use strict';
/* Pure report calculations. No model, network, persistence or DOM access. */
(function (root) {
  const add = (rows, field) => {
    const value = rows.reduce((total, row) => total + row[field], 0);
    if (!Number.isFinite(value)) throw Error('汇总数值超出可计算范围，请检查文件。');
    return value;
  };
  const ratio = (part, total) => total > 0 ? part / total * 100 : null;
  const group = (rows, field) => {
    const buckets = new Map();
    rows.forEach(row => {
      const label = row[field];
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label).push(row);
    });
    return [...buckets].map(([label, list]) => ({label, gmv: add(list, 'gmv'), units: add(list, 'units'), records: list.length}))
      .sort((a, b) => b.gmv - a.gmv || a.label.localeCompare(b.label));
  };
  const offsetMonth = (month, count) => {
    const [year, mon] = month.split('-').map(Number), date = new Date(Date.UTC(year, mon - 1 + count, 1));
    return date.toISOString().slice(0, 7);
  };
  const sameCoverage = (current, previous) => {
    const scopes = rows => new Set(rows.map(r => [r.brand, r.platform, r.category, r.priceBand].join('|')));
    const left = scopes(current), right = scopes(previous);
    return left.size === right.size && [...left].every(k => right.has(k));
  };
  function change(rows, latest, offset) {
    if (!latest) return {value: null, reason: '没有外部电商记录'};
    const baseMonth = offsetMonth(latest, offset), current = rows.filter(r => r.month === latest), previous = rows.filter(r => r.month === baseMonth);
    if (!previous.length) return {value: null, reason: `缺少${baseMonth}的可比记录`, currentMonth: latest, baseMonth};
    if (!sameCoverage(current, previous)) return {value: null, reason: '两期品牌、平台、品类或价格带覆盖不同', currentMonth: latest, baseMonth};
    const base = add(previous, 'gmv');
    return {value: base > 0 ? (add(current, 'gmv') / base - 1) * 100 : null,
      reason: base > 0 ? '同导入范围比较；仍需核验供应商覆盖' : '基期GMV为零，无法计算增幅', currentMonth: latest, baseMonth};
  }
  function build({external = [], internal = [], news = [], mode = 'sample', revision = 0, generatedAt = new Date().toISOString()}, filters = {}) {
    const {brand = 'all', month = 'all'} = filters;
    const ext = external.filter(r => (brand === 'all' || r.brand === brand) && (month === 'all' || r.month === month));
    const ins = internal.filter(r => (brand === 'all' || r.brand === brand) && (month === 'all' || r.month === month));
    const intelligence = news.filter(r => (brand === 'all' || r.brand === brand || r.brand === '安踏集团') && (month === 'all' || r.date.slice(0, 7) === month));
    const months = [...new Set([...ext.map(r => r.month), ...ins.map(r => r.month), ...intelligence.map(r => r.date.slice(0, 7))])].sort();
    const totalGMV = ext.length ? add(ext, 'gmv') : null, units = ext.length ? add(ext, 'units') : null;
    const availableBrands = [...new Set([...external.map(r => r.brand), ...internal.map(r => r.brand), ...news.map(r => r.brand)])].sort();
    const brandNames = [...new Set([...ext.map(r => r.brand), ...ins.map(r => r.brand), ...intelligence.map(r => r.brand)])].sort();
    const brandStats = brandNames.map(name => {
      const rows = ext.filter(r => r.brand === name), sales = ins.filter(r => r.brand === name), brandMonths = [...new Set(rows.map(r => r.month))].sort();
      const gmv = rows.length ? add(rows, 'gmv') : null, quantity = rows.length ? add(rows, 'units') : null;
      return {brand: name, gmv, units: quantity, averagePrice: quantity > 0 ? gmv / quantity : null,
        newListings: rows.length ? add(rows, 'newSkus') : null, share: rows.length ? ratio(gmv, totalGMV) : null,
        externalRecords: rows.length, internalRecords: sales.length, internalAmount: sales.length ? add(sales, 'amount') : null,
        months: brandMonths, mom: change(external.filter(r => r.brand === name), brandMonths.at(-1), -1), yoy: change(external.filter(r => r.brand === name), brandMonths.at(-1), -12),
        channels: group(rows, 'platform'), categories: group(rows, 'category'), bands: group(rows, 'priceBand')};
    }).sort((a, b) => (b.gmv ?? -1) - (a.gmv ?? -1) || a.brand.localeCompare(b.brand));
    const quantities = new Map();
    ins.forEach(row => quantities.set(row.unit, (quantities.get(row.unit) || 0) + row.units));
    const warnings = [];
    if (!ext.length) warnings.push('没有外部电商记录，GMV、服装销量及市场走势暂不计算。');
    if (!ins.length) warnings.push('没有内部销售记录，不能判断我方供货表现或材料缺口。');
    const externalMonths = [...new Set(ext.map(r => r.month))].sort(), internalMonths = [...new Set(ins.map(r => r.month))].sort();
    if (ext.length && ins.length && externalMonths.join() !== internalMonths.join()) warnings.push('外部与内部数据的月份范围不同；各自汇总值不能直接相减或视为同期对照。');
    if (externalMonths.some((m,i) => i > 0 && offsetMonth(externalMonths[i-1],1) !== m)) warnings.push('外部电商月份不连续，不能将缺失期间视为零销量或连续监测。');
    if (months.length < 2) warnings.push('当前不足两个月；不能据此判断持续增长或衰退。');
    warnings.push('品牌份额仅指本次数据范围内GMV占比，不是行业市场份额；上新记录未跨平台去重。');
    if (mode === 'sample') warnings.unshift('当前使用构造的演示数据；上传文件后将使用导入数据生成报表，不混合演示明细。');
    return {version: 1, revision, mode, generatedAt, filters: {brand, month}, availableBrands,
      period: {from: months[0] || null, to: months.at(-1) || null, months},
      counts: {external: ext.length, internal: ins.length, intelligence: intelligence.length},
      sourceMonths: {external: externalMonths, internal: internalMonths},
      summary: {gmv: totalGMV, units, averagePrice: units > 0 ? totalGMV / units : null,
        newListings: ext.length ? add(ext, 'newSkus') : null, internalAmount: ins.length ? add(ins, 'amount') : null,
        materialQuantities: [...quantities].map(([unit, value]) => ({unit, value}))},
      brands: brandStats, channels: group(ext, 'platform'), categories: group(ext, 'category'), bands: group(ext, 'priceBand'),
      trend: group(ext, 'month').sort((a, b) => a.label.localeCompare(b.label)),
      news: intelligence.map(n => ({brand: n.brand, date: n.date, type: n.type, title: n.title, summary: n.summary, source: n.source, url: n.url})), warnings};
  }
  const number = (n, decimals = 1) => n === null ? '未提供' : n.toLocaleString('zh-CN', {maximumFractionDigits: decimals});
  function analyze(report, brand) {
    const b = report.brands.find(item => item.brand === brand);
    if (!b) return null;
    const evidence = [], facts = [], risks = [], actions = [];
    const cite = (label, value, source) => {
      const id = `F${String(evidence.length + 1).padStart(2, '0')}`;
      evidence.push({id, label, value, source});
      return id;
    };
    const recordsId = cite('外部电商记录', `${b.externalRecords}条`, report.mode === 'imported' ? '本次导入的外部电商表' : '构造演示数据');
    if (b.gmv !== null) {
      const gmvId = cite('品牌GMV', `${number(b.gmv / 1e4, 2)}万元`, '外部GMV逐行合计');
      const shareId = cite('范围内GMV占比', b.share === null ? '总GMV为0，不能计算' : `${number(b.share)}%`, '该品牌GMV ÷ 本报表所有品牌GMV');
      const ranked = report.brands.filter(item => item.gmv !== null), rank = 1 + ranked.filter(item => item.gmv > b.gmv).length;
      const tied = ranked.filter(item => item.gmv === b.gmv).length > 1;
      facts.push({title: '品牌经营表现', text: `${brand}在当前记录中的GMV为${number(b.gmv / 1e4, 2)}万元，在${ranked.length}个有电商记录的品牌中${tied?'并列':''}排第${rank}；范围内占比${b.share === null ? '无法计算' : number(b.share) + '%'}。`, evidenceIds: [gmvId, shareId]});
      const growthId = cite('最近月GMV环比', b.mom.value === null ? b.mom.reason : `${b.mom.currentMonth}较${b.mom.baseMonth}：${number(b.mom.value)}%`, '仅比较相邻月份、相同品牌/平台/品类/价格带范围');
      facts.push({title: '增长趋势', text: b.mom.value === null ? `暂不输出环比增长判断：${b.mom.reason}。` : `最近月GMV较上月${b.mom.value >= 0 ? '增加' : '减少'}${number(Math.abs(b.mom.value))}%。这是同导入范围比较，不代表品牌全渠道增速。`, evidenceIds: [growthId]});
      const channel = b.channels[0];
      if (channel && b.gmv > 0) {
        const id = cite('主要监测平台', `${channel.label}：${number(channel.gmv / 1e4, 2)}万元，占该品牌记录GMV的${number(ratio(channel.gmv, b.gmv))}%`, '按平台汇总');
        facts.push({title: '渠道结构', text: `当前监测记录中，${channel.label}贡献最高。应先核验其他渠道是否完整，再判断渠道集中度。`, evidenceIds: [id]});
        actions.push({title: '核对重点渠道', text: `优先复核${channel.label}的商品和月度明细，补齐其他渠道覆盖说明。`, evidenceIds: [id]});
      }
      const category = b.categories[0], band = b.bands[0];
      if (category) {
        const id = cite('主要品类与价位', `${category.label}品类GMV${number(category.gmv / 1e4, 2)}万元；最高贡献价位为${band.label}`, '分别按品类和价格带汇总，非交叉SKU证据');
        facts.push({title: '产品切入方向', text: `可从${category.label}畅销产品收集材料应用证据。${band.label}是独立价位汇总结果，不能直接认定该品类集中在这一价位，也不能据此认定技术替代机会。`, evidenceIds: [id]});
        actions.push({title: '补充产品证据', text: '索取重点品类SKU、材料标识及商品链接，再由产品技术团队评估合作空间。', evidenceIds: [id]});
      }
      risks.push({title: '监测覆盖边界', text: '导入范围内占比与排名不等同市场份额或全品牌表现；需要供应商确认监测覆盖。', evidenceIds: [recordsId, shareId]});
    } else {
      facts.push({title: '缺少电商经营证据', text: `${brand}没有外部电商记录，暂不能判断GMV、渠道表现、增长趋势或市场位置。`, evidenceIds: [recordsId]});
    }
    const internalId = cite('内部材料销售额', b.internalAmount === null ? '未提供' : `${number(b.internalAmount / 1e4, 2)}万元`, '仅汇总该品牌内部销售额，未将服装件数与材料用量相减');
    facts.push({title: '我方业务关联', text: b.internalAmount === null ? '内部销售尚未提供；不能用终端销量直接推断我方收入或材料缺口。' : `该品牌导入的我方材料销售额合计${number(b.internalAmount / 1e4, 2)}万元。需核对供货范围和单位后，再进入材料机会测算。`, evidenceIds: [internalId]});
    if (b.mom.value === null) risks.push({title: '趋势证据不足', text: b.mom.reason + '；不生成增长率或健康评分。', evidenceIds: [recordsId]});
    actions.push({title: '对齐内外部口径', text: '补齐共同月份、监测范围、材料单位与适用规格后，再评估材料应用及商务行动。', evidenceIds: [internalId, recordsId]});
    return {version: 1, mode: 'demo', brand, generatedAt: report.generatedAt, revision: report.revision,
      summary: `基于${report.mode === 'imported' ? '当前导入数据' : '构造演示数据'}的${brand}品牌分析。由可追溯计算规则生成，尚未调用大模型。`, facts, risks, actions, evidence};
  }
  const api = {build, analyze, change, sameCoverage, offsetMonth};
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.REPORT = api;
})(typeof window !== 'undefined' ? window : globalThis);
