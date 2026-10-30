'use strict';
// Import schemas are prototype proposals, not customer-confirmed supplier formats.
(function(root){
  const brands=['DESCENTE','KOLON SPORT','ANTA','FILA'];
  const platforms=['天猫','淘宝','抖音','京东','快手','拼多多'];
  const categories=['抓绒 / 中层','轻量保暖','防风 / 防护','跑步 / 训练'];
  const bands=['500元以下','500—999元','1000—1999元','2000元及以上','未分价位'];
  const newsTypes=['财报与经营','组织与人事','赛道与战略','材料与竞品'];
  const months=Array.from({length:12},(_,i)=>`${i<9?2024:2025}-${String((i+3)%12+1).padStart(2,'0')}`);
  const headers={external:['月份','品牌','平台','品类','GMV（元）','销量（件）','上新SKU数','价格带'],internal:['月份','品牌','品类','材料技术','销量','单位','销售额（元）'],intelligence:['发布日期','品牌','分类','标题','摘要','来源','原文链接','经营启示']};
  function scope(r){return [r.customer,r.month,r.brand,r.platform,r.category].join('|');}
  function key(type,r){return (type==='external'?[scope(r),r.priceBand]:type==='internal'?[r.customer,r.month,r.brand,r.category,r.technology]:[r.customer,r.date,r.brand,r.type,r.title,r.url]).join('|');}
  function merge(type,base,imports){const replaced=type==='external'?new Set(imports.map(scope)):null;const m=new Map(base.filter(r=>!replaced||!replaced.has(scope(r))).map(r=>[key(type,r),r]));imports.forEach(r=>m.set(key(type,r),r));return [...m.values()];}
  function externalFixture(){const factors=[[.43,.16,.12,.24,.02,.03],[.55,.17,.08,.17,.01,.02],[.21,.12,.35,.20,.05,.07],[.43,.15,.18,.18,.02,.04]],price=[2400,2100,580,1380];return months.slice(0,11).flatMap((month,mi)=>brands.flatMap((brand,bi)=>platforms.flatMap((platform,pi)=>categories.map((category,ci)=>{const units=Math.round((bi===2?29000:17000)*[.8,.73,.68,.74,.92,1.12,1.32,1.63,1.48,1.32,1.09][mi]*factors[bi][pi]*[.4,.3,.2,.1][ci]);const unitPrice=Math.round(price[bi]*[.82,1.04,1.25,.65][ci]);return {customer:'anta',month,brand,platform,category,units,gmv:units*unitPrice,newSkus:Math.max(1,Math.round(units/900)),priceBand:unitPrice<500?bands[0]:unitPrice<1000?bands[1]:unitPrice<2000?bands[2]:bands[3],origin:'prototype'};}))));}
  function internalFixture(){return months.slice(0,11).flatMap((month,mi)=>brands.flatMap((brand,bi)=>categories.map((category,ci)=>{const units=Math.round([1350,550,1800,420][bi]*[.85,.8,.72,.78,.91,1.08,1.19,1.3,1.38,1.28,1.12][mi]*[.6,.2,.12,.08][ci]);return {customer:'anta',month,brand,category,technology:['抓绒技术（演示）','保暖技术（演示）','防护技术（演示）','跑步技术（演示）'][ci],units,unit:'米',amount:units*[58,72,88,48][ci],origin:'prototype'};})));}
  const sum=(rows,k)=>rows.reduce((n,r)=>n+r[k],0);
  const norm=v=>String(v??'').replace(/[\s（）()_]/g,'').toLowerCase();
  function dateValue(value,monthly){let s=String(value??'').trim();if(/^\d{5}(?:\.\d+)?$/.test(s)){s=new Date((Number(s)-25569)*86400000).toISOString().slice(0,10);}s=s.replaceAll('/','-');const match=s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);if(!match)return null;const y=+match[1],m=+match[2],d=+(match[3]||1),date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return null;return `${y}-${String(m).padStart(2,'0')}`+(monthly?'':'-'+String(d).padStart(2,'0'));}
  function number(v){if(String(v??'').trim()==='')return NaN;return Number(String(v).replaceAll(',',''));}
  function validURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
  function validate(type,grid,customer='anta'){
    if(!headers[type])throw Error('未知数据类型。');if(!grid.length)throw Error('文件为空。');if(grid.length>20001)throw Error('请将文件控制在20,000行以内。');
    const h=grid[0].map(norm),required=headers[type].filter(v=>type!=='external'||v!=='价格带');
    const missing=required.filter(v=>!h.includes(norm(v)));if(missing.length)throw Error('缺少表头：'+missing.join('、'));
    const duplicateHeaders=h.filter((v,i)=>v&&h.indexOf(v)!==i);if(duplicateHeaders.length)throw Error('表头重复，请检查文件。');
    const valid=[],errors=[],seen=new Set(),priceScopes=new Map();
    grid.slice(1).forEach((cells,i)=>{const get=name=>{const index=h.indexOf(norm(name));return index<0?'':String(cells[index]??'').trim();};let r,error='';
      if(type==='external')r={customer,month:dateValue(get('月份'),true),brand:get('品牌'),platform:get('平台'),category:get('品类'),gmv:number(get('GMV（元）')),units:number(get('销量（件）')),newSkus:number(get('上新SKU数')),priceBand:get('价格带')||'未分价位',origin:'import'};
      if(type==='internal')r={customer,month:dateValue(get('月份'),true),brand:get('品牌'),category:get('品类'),technology:get('材料技术'),units:number(get('销量')),unit:get('单位'),amount:number(get('销售额（元）')),origin:'import'};
      if(type==='intelligence')r={customer,date:dateValue(get('发布日期'),false),brand:get('品牌'),type:get('分类'),title:get('标题'),summary:get('摘要'),source:get('来源'),url:get('原文链接'),implication:get('经营启示'),origin:'import'};
      if(customer!=='anta')error='当前只配置安踏集团试点';else if(![...brands,...type==='intelligence'?['安踏集团']:[]].includes(r.brand))error='品牌不属于当前试点客户';
      else if(type==='intelligence'){
        if(!r.date||!months.includes(r.date.slice(0,7)))error='发布日期不在报告周期内';else if(!newsTypes.includes(r.type))error='情报分类不匹配';else if(!r.title||!r.summary||!r.source||!r.implication)error='标题、摘要、来源和经营启示均须填写';else if(!validURL(r.url))error='原文链接须为不含账号密码的 HTTPS 地址';
      }else{
        if(!r.month||!months.includes(r.month))error='月份不在报告周期内或日期无效';else if(!categories.includes(r.category))error='品类需使用模板名称';
        else if(type==='external'){
          if(!platforms.includes(r.platform))error='平台须分别填写天猫、淘宝、抖音、京东、快手或拼多多';else if(!bands.includes(r.priceBand))error='价格带不在模板范围内';else if([r.gmv,r.units,r.newSkus].some(v=>!Number.isFinite(v)||v<0))error='GMV、销量及上新数须为非负数字';else if(!Number.isInteger(r.units)||!Number.isInteger(r.newSkus))error='服装销量及上新数须为整数';else if(r.units===0&&r.gmv>0)error='销量为0但GMV大于0';
        }else if(!r.technology)error='材料技术不能为空';else if(!['米','码','千克'].includes(r.unit))error='材料单位须为米、码或千克';else if([r.units,r.amount].some(v=>!Number.isFinite(v)||v<0))error='材料销量及销售额须为非负数字';else if(r.units===0&&r.amount>0)error='材料销量为0但销售额大于0';
      }
      if(type==='external'&&!error){const modes=priceScopes.get(scope(r))||new Set();modes.add(r.priceBand==='未分价位'?'aggregate':'banded');priceScopes.set(scope(r),modes);if(modes.size>1)error='同一业务范围不能混合未分价位汇总与价格带明细';}
      const k=key(type,r);if(!error&&seen.has(k))error='文件内存在重复业务键';seen.add(k);if(error)errors.push({row:i+2,error});else valid.push(r);
    });
    if(!valid.length&&!errors.length)throw Error('没有数据行。');return {rows:valid,errors};
  }
  function align(external,internal,brand,category,technology){const ext=external.filter(r=>r.brand===brand&&r.category===category),all=internal.filter(r=>r.brand===brand&&r.category===category),ins=all.filter(r=>!technology||r.technology===technology),em=new Set(ext.map(r=>r.month)),im=new Set(ins.map(r=>r.month)),common=months.filter(m=>em.has(m)&&im.has(m));return {external:ext.filter(r=>common.includes(r.month)),internal:ins.filter(r=>common.includes(r.month)),months:common,missing:months.filter(m=>em.has(m)!==im.has(m))};}
  function materialUnits(rows,unit){let total=0;const incompatible=[];rows.forEach(r=>{if(r.unit===unit)total+=r.units;else if(r.unit==='码'&&unit==='米')total+=r.units*.9144;else if(r.unit==='米'&&unit==='码')total+=r.units/.9144;else incompatible.push(r);});return {value:incompatible.length?null:total,incompatible};}
  function convertAssumptions(from,to,drivers){
    if(from===to)return {...drivers};
    if(!['米','码'].includes(from)||!['米','码'].includes(to))return {...drivers,use:null,price:null};
    const factor=(from==='米'?1:.9144)/(to==='米'?1:.9144);
    const use=Number.isFinite(drivers.use)?drivers.use*factor:null,price=Number.isFinite(drivers.price)?drivers.price/factor:null;
    return {...drivers,use:Number.isFinite(use)?use:null,price:Number.isFinite(price)?price:null};
  }
  function opportunity(input){const {pieces,internal,ratio,use,win,price}=input;if([pieces,internal,ratio,use,win,price].some(v=>v===null||!Number.isFinite(v)||v<0)||ratio>100||win>100)return null;const demand=pieces*ratio/100*use,gap=Math.max(demand-internal,0),revenue=gap*win/100*price;return [demand,gap,revenue].every(Number.isFinite)?{demand,gap,revenue}:null;}
  const api={brands,platforms,categories,bands,months,newsTypes,headers,scope,key,merge,externalFixture,internalFixture,sum,dateValue,validURL,validate,align,materialUnits,convertAssumptions,opportunity};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DOMAIN=api;
})(typeof window!=='undefined'?window:globalThis);
