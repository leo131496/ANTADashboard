'use strict';

NAV.splice(3, 0, ['reports','file','自动数据报表','Data Reports'], ['brand-ai','atom','AI 品牌分析','Brand Analysis']);
Object.assign(state, {reportBrand:'all', reportMonth:'all', reportMetric:'gmv', aiBrand:'', aiMonth:'all', aiResult:null,
  aiError:'', aiPending:null, reportGeneratedAt:new Date().toISOString()});
const workingPages = new Set(['reports','brand-ai','ecommerce','intelligence','datahub']);
const reportInput = () => ({external:commerceRows(), internal:internalRows(), news:newsRows(), mode:state.datasetMode,
  revision:state.reportRevision, generatedAt:state.reportGeneratedAt});
const reportData = (filters={}) => REPORT.build(reportInput(), filters);
const periodText = r => r.period.from ? `${r.period.from} — ${r.period.to}` : '尚无有效记录';
const val = (n, digits=1) => n === null ? '—' : fmt(n,digits);
const sourceBadge = () => badge(state.datasetMode==='imported'?'本次导入数据':'构造演示数据',state.datasetMode==='imported'?'good':'warn');

function reportHeading(c) {
  const report=reportData(), nav=NAV.find(n=>n[0]===state.page);
  return `<div class="page-title"><div><p class="eyebrow">CUSTOMER INTELLIGENCE</p><h1>${nav[2]}<span>${nav[3]}</span></h1></div><div class="report-title-actions">${sourceBadge()}${textlink('继续导入数据','datahub')}</div></div>
    <section class="customer-banner report-customer" aria-label="报表数据范围"><div class="customer-id"><div class="customer-logo anta">ANTA</div><div class="customer-names"><h2>${c.name}<span>${c.en}</span></h2><p>${state.datasetMode==='imported'?'按本次导入记录生成，不混合构造明细':'当前为演示工作区，上传文件即可生成自己的报表'}</p></div></div><div class="customer-meta"><div class="meta-item"><span>数据中的月份范围</span><strong>${esc(periodText(report))}</strong></div><div class="meta-item"><span>已载入记录</span><strong>电商 ${report.counts.external} / 内销 ${report.counts.internal} / 情报 ${report.counts.intelligence}</strong></div></div></section>`;
}
const originalTitle=title;
title=function(c){return workingPages.has(state.page)?reportHeading(c):originalTitle(c);};

function reportFilters(report) {
  const all=reportData();
  return `<div class="analysis-toolbar"><div class="analysis-filters">${selectControl('报表品牌','brand',[['all','全部品牌'],...all.availableBrands],state.reportBrand,'report-filter')}${selectControl('统计月份','month',[['all','全部月份'],...all.period.months],state.reportMonth,'report-filter')}<button class="text-button" id="reset-report">重置筛选</button></div><div class="report-export-actions"><button class="quiet-button" id="report-csv">${icon('download',14)}导出汇总CSV</button><button class="primary-button" id="report-html">${icon('file',14)}下载完整报表</button></div></div>`;
}
function reportTrend(report) {
  const rows=report.trend, metric=state.reportMetric;
  if(!rows.length)return '<div class="empty-state">没有外部电商记录，月度趋势暂不生成。</div>';
  const w=720,h=222,left=60,right=666,top=20,bottom=181,max=Math.max(...rows.map(r=>r[metric]))*1.15||1;
  const monthIndex=m=>Number(m.slice(0,4))*12+Number(m.slice(5)), first=monthIndex(rows[0].label),last=monthIndex(rows.at(-1).label);
  const x=i=>rows.length===1?(left+right)/2:left+(monthIndex(rows[i].label)-first)*(right-left)/(last-first),y=v=>bottom-v/max*(bottom-top);
  const segments=[];rows.forEach((r,i)=>{if(i===0||monthIndex(r.label)-monthIndex(rows[i-1].label)!==1)segments.push([]);segments.at(-1).push(i);});
  let lastTick=-Infinity;const ticks=new Set();rows.forEach((r,i)=>{if(i===0||i===rows.length-1||(x(i)-lastTick>=100&&right-x(i)>=80)){ticks.add(i);lastTick=x(i);}});
  return `<div class="report-trend"><div class="legend"><span><i></i>${metric==='gmv'?'GMV（万元）':'销售件数（万件）'}</span><span>缺失月份不补零，折线按月份间断</span></div><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="导入数据月度${metric==='gmv'?'GMV':'销量'}趋势，时间轴按实际月份，缺失处断开">${[0,.25,.5,.75,1].map(f=>`<line x1="${left}" x2="${right}" y1="${y(f*max)}" y2="${y(f*max)}" stroke="#e5edf5"/><text x="${left-10}" y="${y(f*max)+4}" text-anchor="end">${val(f*max/1e4,1)}</text>`).join('')}${segments.filter(s=>s.length>1).map(s=>`<polyline points="${s.map(i=>`${x(i)},${y(rows[i][metric])}`).join(' ')}" fill="none" stroke="#175cd3" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}${rows.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r[metric])}" r="4" fill="#175cd3"><title>${esc(r.label)}：${metric==='gmv'?val(r.gmv/1e4,2)+'万元':val(r.units,0)+'件'}；该月${r.records}条记录</title></circle>${ticks.has(i)?`<text x="${x(i)}" y="207" text-anchor="middle">${r.label.slice(2).replace('-','.')}</text>`:''}`).join('')}</svg></div>`;
}
function reportBars(groups,total) {
  if(!groups.length)return '<div class="empty-state">尚无此类记录。</div>';
  const max=Math.max(...groups.map(g=>g.gmv),1);
  return `<div class="comparison-bars">${groups.map(g=>`<div class="comparison-bar"><div><span>${esc(g.label)}</span><b>${val(g.gmv/1e4,2)}万元 <small>${total>0?val(g.gmv/total*100,1)+'%':'占比—'}</small></b></div><div class="bar-track"><i style="width:${g.gmv/max*100}%"></i></div></div>`).join('')}</div>`;
}
function reportsPage() {
  const r=reportData({brand:state.reportBrand,month:state.reportMonth});
  return `<div class="report-ready"><div>${icon('check',19)}<strong>${state.datasetMode==='imported'?'导入完成，报表已自动生成':'自动报表示例'}</strong><span>${r.counts.external+r.counts.internal+r.counts.intelligence}条记录 · ${r.brands.length}个品牌 / 集团 · ${esc(periodText(r))}</span></div>${textlink('查看品牌分析','brand-ai')}</div>
    ${reportFilters(r)}<div class="commerce-stats">${statCard('电商GMV',val(r.summary.gmv===null?null:r.summary.gmv/1e4,2),'万元','当前记录范围合计，币种按模板人民币')}${statCard('服装销售件数',val(r.summary.units,0),'件','缺失记录不当作零销量')}${statCard('成交均价',val(r.summary.averagePrice,0),'元 / 件','GMV ÷ 件数，非材料单价')}${statCard('我方材料销售额',val(r.summary.internalAmount===null?null:r.summary.internalAmount/1e4,2),'万元','内部记录独立汇总，不与GMV直接相减')}</div>
    <div class="report-layout"><section class="card">${head('','月度经营趋势','Monthly Performance',`<div class="segmented"><button data-report-metric="gmv" class="${state.reportMetric==='gmv'?'selected':''}">GMV</button><button data-report-metric="units" class="${state.reportMetric==='units'?'selected':''}">销量</button></div>`)}${reportTrend(r)}<div class="chart-note">趋势反映当前文件和筛选范围；不能把监测范围变化直接解读为业务增长。</div></section><section class="card">${head('','渠道贡献','Channel Mix')}<div class="detail-card-body">${reportBars(r.channels,r.summary.gmv)}</div></section><section class="card report-wide">${head('','品牌经营对比','Brand Performance',badge('点击查看品牌分析','blue'))}<div class="detail-card-body table-scroll"><table class="data-table"><thead><tr><th>品牌</th><th>GMV（万元）</th><th>范围内占比</th><th>销量（件）</th><th>最近月环比</th><th>我方材料销售额（万元）</th><th>分析</th></tr></thead><tbody>${r.brands.map(b=>`<tr><td><strong>${esc(b.brand)}</strong></td><td>${val(b.gmv===null?null:b.gmv/1e4,2)}</td><td>${b.share===null?'—':val(b.share,1)+'%'}</td><td>${val(b.units,0)}</td><td title="${esc(b.mom.reason)}">${b.mom.value===null?'暂不可比':(b.mom.value>0?'+':'')+val(b.mom.value,1)+'%'}</td><td>${val(b.internalAmount===null?null:b.internalAmount/1e4,2)}</td><td><button class="text-button" data-analyze-brand="${esc(b.brand)}">分析 ${icon('arrow',12)}</button></td></tr>`).join('')||'<tr><td colspan="7">尚无有效记录，请先导入数据。</td></tr>'}</tbody></table></div><div class="chart-note">环比只在相邻月份、品牌 / 平台 / 品类 / 价格带覆盖相同时计算；仍须核验来源覆盖。占比仅为当前报表范围内占比。</div></section><section class="card">${head('','品类结构','Category Mix')}<div class="detail-card-body">${reportBars(r.categories,r.summary.gmv)}</div></section><section class="card">${head('','价格带结构','Price-band Mix')}<div class="detail-card-body">${reportBars(r.bands,r.summary.gmv)}</div></section><section class="card report-wide">${head('','数据完整性与统计说明','Data Coverage')}<div class="detail-card-body"><div class="report-coverage">${[['外部电商',r.counts.external],['内部销售',r.counts.internal],['企业情报',r.counts.intelligence]].map(([n,count])=>`<div><span>${n}</span><strong>${count}<small> 条</small></strong></div>`).join('')}<div><span>平台上新记录</span><strong>${val(r.summary.newListings,0)}<small> 条</small></strong></div></div><ul class="report-notes">${r.warnings.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="muted-note">报表生成于 ${esc(new Date(r.generatedAt).toLocaleString('zh-CN'))}。本机处理，刷新后恢复演示；可下载完整报表保存。附件样图的六项KPI仍在战略总览中单独展示。</p></div></section></div>`;
}

function evidenceChips(ids, evidence) {
  return `<span class="evidence-chips">${ids.map(id=>`<a href="#evidence-${id}" data-evidence-id="${id}" title="${esc(evidence.find(e=>e.id===id)?.label||id)}">${id}</a>`).join('')}</span>`;
}
function analysisItems(items, evidence) {
  return items.map(item=>`<article class="analysis-item"><h4>${esc(item.title)}${evidenceChips(item.evidenceIds,evidence)}</h4><p>${esc(item.text)}</p></article>`).join('');
}
function brandAIPage() {
  const report=reportData({month:state.aiMonth});
  if(!report.brands.some(b=>b.brand===state.aiBrand))state.aiBrand=report.brands[0]?.brand||'';
  const demo=REPORT.analyze(report,state.aiBrand), live=state.aiResult;
  const useLive=live&&live.brand===state.aiBrand&&live.revision===state.reportRevision&&live.month===state.aiMonth;
  const result=useLive?live:demo, connected=!!window.BRAND_AI_CONFIG?.endpoint;
  const pending=state.aiPending?.brand===state.aiBrand&&state.aiPending?.month===state.aiMonth&&state.aiPending?.revision===state.reportRevision;
  const all=reportData();
  return `<div class="analysis-toolbar"><div class="analysis-filters">${selectControl('分析品牌','brand',report.brands.map(b=>b.brand),state.aiBrand,'ai-filter')}${selectControl('分析月份','month',[['all','全部月份'],...all.period.months],state.aiMonth,'ai-filter')}</div><div class="report-export-actions"><button class="quiet-button" id="ai-contract">查看AI接入说明</button><button class="primary-button" id="run-live-ai" ${!connected||pending||!demo?'disabled':''}>${pending?'正在分析…':connected?'调用AI服务分析':'真实AI待接入'}</button></div></div><div class="ai-state ${useLive?'is-live':''}"><div>${icon('atom',24)}<div><strong>${useLive?'AI服务返回的品牌分析':'品牌分析演示'}</strong><p>${useLive?'依据当前数据生成，结论需经业务人员复核。':'以下由导入数据和可追溯规则生成，尚未调用大模型；导入或筛选后自动更新。'}</p></div></div>${badge(useLive?'已调用AI服务':'演示分析 · 非大模型',useLive?'good':'warn')}</div>${state.aiError?`<div class="import-errors" role="alert">${esc(state.aiError)}；下方保留当前数据的演示分析。</div>`:''}
    ${result?`<section class="card analysis-summary"><div class="detail-card-body"><div><span class="analysis-brand">${esc(result.brand)}</span><span class="muted-note">${esc(periodText(report))} · 数据版本 ${state.reportRevision}</span></div><p>${esc(result.summary)}</p></div></section><div class="brand-analysis-grid"><section class="card">${head('','经营表现与结构','Performance & Evidence')}<div class="detail-card-body">${analysisItems(result.facts,demo.evidence)}</div></section><div class="analysis-side"><section class="card">${head('','需关注的问题','Risks & Gaps')}<div class="detail-card-body">${analysisItems(result.risks,demo.evidence)}</div></section><section class="card">${head('','建议行动','Recommended Actions')}<div class="detail-card-body">${analysisItems(result.actions,demo.evidence)}</div></section></div></div><section class="card evidence-register">${head('','分析依据','Evidence Register',badge('结论对应事实ID','blue'))}<div class="detail-card-body table-scroll"><table class="data-table"><thead><tr><th>事实ID</th><th>指标 / 证据</th><th>当前值</th><th>计算与来源</th></tr></thead><tbody>${demo.evidence.map(e=>`<tr id="evidence-${e.id}" tabindex="-1"><td><strong>${e.id}</strong></td><td>${esc(e.label)}</td><td>${esc(e.value)}</td><td>${esc(e.source)}</td></tr>`).join('')}</tbody></table></div></section>`:'<div class="empty-state">尚无可分析的品牌记录，请先导入数据。</div>'}`;
}

function aiContractModal() {
  modal('真实AI服务接入','当前为演示分析；本轮未配置模型或调用费用。',`<h3>页面已预留分析接口</h3><p>接入后，系统向公司管理的HTTPS接口发送当前品牌的聚合指标、事实ID和来源摘要，返回经营分析、风险与行动建议。</p><h3>接入时需提供</h3><p>公司AI服务地址、模型选择、服务端鉴权和数据使用规则。密钥应由服务端保管，不填写在公开网页或GitHub配置文件中。</p><div class="callout">当前导入、统计报表和演示分析均在本机浏览器运行，不发送文件到AI服务。正式服务的接口约定已随代码提供。</div>`,{footer:'<button class="quiet-button modal-close-button">知道了</button>'});
}
async function runLiveAnalysis() {
  const report=reportData({month:state.aiMonth}), demo=REPORT.analyze(report,state.aiBrand);
  if(!demo||!window.BRAND_AI_CONFIG?.endpoint)return;
  const snapshot={brand:state.aiBrand,month:state.aiMonth,revision:state.reportRevision};
  state.aiPending=snapshot;state.aiError='';render(true);
  const current=()=>snapshot.brand===state.aiBrand&&snapshot.month===state.aiMonth&&snapshot.revision===state.reportRevision;
  try {
    const result=await BRAND_AI.request({endpoint:window.BRAND_AI_CONFIG.endpoint,report,analysis:demo});
    if(current())state.aiResult={...result,month:snapshot.month};
  }catch(error){if(current())state.aiError=error.message;}
  finally{if(state.aiPending===snapshot)state.aiPending=null;if(current())render(true);}
}

function safeCSV(rows) {
  return '\uFEFF'+rows.map(row=>row.map(value=>{
    let text=String(value??''); if(typeof value==='string'&&/^[=+\-@\t\r]/.test(text))text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }).join(',')).join('\r\n');
}
function exportReportCSV() {
  const r=reportData({brand:state.reportBrand,month:state.reportMonth});
  download('安踏集团_导入数据报表.csv',safeCSV([['客户360数据报表'],['统计期',periodText(r)],['数据来源',r.mode==='imported'?'本次导入':'构造演示'],['生成时间',r.generatedAt],[],['品牌','GMV（元）','销量（件）','均价（元/件）','范围内GMV占比（%）','我方材料销售额（元）'],...r.brands.map(b=>[b.brand,b.gmv,b.units,b.averagePrice,b.share,b.internalAmount]),[],['月份','GMV（元）','销量（件）'],...r.trend.map(t=>[t.label,t.gmv,t.units]),[],['说明',...r.warnings]]),'text/csv;charset=utf-8');
  toast('当前筛选范围的报表已下载');
}
function exportReportHTML() {
  const r=reportData({brand:state.reportBrand,month:state.reportMonth});
  const table=(headers,rows)=>`<table><thead><tr>${headers.map(v=>`<th>${esc(v)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v??'未提供')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const content=`<h1>安踏集团 · 客户360经营报表</h1><p>${esc(periodText(r))} ｜ ${r.mode==='imported'?'本次导入数据':'构造演示数据'} ｜ 版本 ${r.revision}</p><p>生成时间：${esc(new Date(r.generatedAt).toLocaleString('zh-CN'))}。此文件保存当前报表快照，可通过浏览器打印为PDF。</p><h2>品牌经营对比</h2>${table(['品牌','GMV（万元）','销量（件）','均价（元/件）','范围内占比','我方材料销售额（万元）'],r.brands.map(b=>[b.brand,val(b.gmv===null?null:b.gmv/1e4,2),val(b.units,0),val(b.averagePrice,0),b.share===null?'—':val(b.share,1)+'%',val(b.internalAmount===null?null:b.internalAmount/1e4,2)]))}<h2>月度走势</h2>${table(['月份','GMV（万元）','销量（件）'],r.trend.map(t=>[t.label,val(t.gmv/1e4,2),val(t.units,0)]))}<h2>渠道与品类结构</h2>${table(['类型','名称','GMV（万元）'],[...r.channels.map(g=>['平台',g.label,val(g.gmv/1e4,2)]),...r.categories.map(g=>['品类',g.label,val(g.gmv/1e4,2)]),...r.bands.map(g=>['价格带',g.label,val(g.gmv/1e4,2)])])}<h2>品牌演示分析</h2><p>以下分析由统计规则生成，未调用大模型；不构成已核验的市场判断。</p>${r.brands.map(b=>{const a=REPORT.analyze(r,b.brand);return `<section><h3>${esc(b.brand)}</h3>${[...a.facts,...a.risks,...a.actions].map(item=>`<p><strong>${esc(item.title)}：</strong>${esc(item.text)} <small>[${item.evidenceIds.join(', ')}]</small></p>`).join('')}<details open><summary>分析依据</summary>${table(['ID','事实','值','来源'],a.evidence.map(e=>[e.id,e.label,e.value,e.source]))}</details></section>`;}).join('')}<h2>数据说明</h2><ul>${r.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul><p>本报表未使用战略总览中的附件样图KPI作为导入统计值。</p>`;
  download('安踏集团_客户360经营报表.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>客户360经营报表</title><style>body{font-family:Arial,"PingFang SC",sans-serif;color:#18334c;max-width:1080px;margin:40px auto;padding:0 24px;font-size:14px;line-height:1.8}h1{color:#082c50}h2{border-bottom:2px solid #175cd3;margin-top:32px}h3{color:#175b9e}table{border-collapse:collapse;width:100%;font-size:12px;margin:15px 0}td,th{border:1px solid #dfe6ee;padding:10px;text-align:left;overflow-wrap:anywhere}th{background:#f1f5fa}small{color:#52718c}section{break-inside:avoid;margin:22px 0}details{border:1px solid #e0e8f2;padding:10px}details[open]{display:block}@media print{body{margin:0;font-size:11px}h2{break-after:avoid}tr{break-inside:avoid}}</style><body>${content}</body></html>`,'text/html;charset=utf-8');
  toast('完整报表已下载，可单独打开、打印或保存为PDF');
}

pages.reports=reportsPage;pages['brand-ai']=brandAIPage;
const renderWithImports=render;
render=function(keepScroll=false){
  renderWithImports(keepScroll);
  const active=workingPages.has(state.page);
  if(active){$('.demo-label').innerHTML=`<i></i> ${state.datasetMode==='imported'?'本次导入 · 待业务核验':'演示数据工作区'}`;
    $('footer>span:nth-child(2)').textContent=state.datasetMode==='imported'?'当前页面按导入记录生成；数据仅保留在本次浏览器页面，刷新后恢复示例。':'当前为构造演示数据；上传文件后自动生成独立报表和品牌演示分析。';
    $('#foot-period').textContent='数据范围 '+periodText(reportData());
  }else{$('.demo-label').innerHTML='<i></i> 设计演示 · 样图参考';$('footer>span:nth-child(2)').textContent='本页业务指标为附件样图或设计示意；自动报表单独展示导入数据。';}
};
$('#quick-import').innerHTML=icon('file',15)+'导入数据';
$('#export').onclick=()=>{if(workingPages.has(state.page))modal('导出数据报表','下载当前统计范围，不包含附件样图KPI。',`<div class="export-options"><button class="export-option" id="modal-report-html">${icon('file',25)}<strong>完整经营报表</strong><small>HTML快照，含汇总表、趋势明细与品牌演示分析；可打印为PDF。</small></button><button class="export-option" id="modal-report-csv">${icon('download',25)}<strong>数据汇总CSV</strong><small>可用Excel打开，便于复核数值及继续分析。</small></button></div>`);else exportModal();};
document.addEventListener('change',e=>{
  if(e.target.matches('[data-report-filter]')){const key=e.target.dataset.reportFilter;state[key==='brand'?'reportBrand':'reportMonth']=e.target.value;render(true);}
  if(e.target.matches('[data-ai-filter]')){const key=e.target.dataset.aiFilter;state[key==='brand'?'aiBrand':'aiMonth']=e.target.value;state.aiResult=null;state.aiError='';render(true);}
});
document.addEventListener('click',e=>{
  const brand=e.target.closest('[data-analyze-brand]'), metric=e.target.closest('[data-report-metric]'), evidence=e.target.closest('[data-evidence-id]');
  if(brand){state.aiBrand=brand.dataset.analyzeBrand;state.aiMonth=state.reportMonth;state.aiResult=null;state.aiError='';go('brand-ai');}
  if(metric){state.reportMetric=metric.dataset.reportMetric;render(true);}
  if(evidence){e.preventDefault();const row=document.getElementById('evidence-'+evidence.dataset.evidenceId);row?.scrollIntoView({block:'center',behavior:'auto'});row?.focus({preventScroll:true});}
  if(e.target.closest('#reset-report')){state.reportBrand='all';state.reportMonth='all';render(true);}
  if(e.target.closest('#report-csv,#modal-report-csv'))exportReportCSV();
  if(e.target.closest('#report-html,#modal-report-html'))exportReportHTML();
  if(e.target.closest('#ai-contract'))aiContractModal();
  if(e.target.closest('#run-live-ai'))runLiveAnalysis();
});
if(pages[location.hash.slice(1)])state.page=location.hash.slice(1);
render(true);
