var OW=[['001','Estela Living, LLC'],['002','Estela Specs 1 LLC'],['003','Estela Specs 2 LLC'],['004','Estela Specs 3 LLC'],['005','Estela Specs 4 LLC'],['006','Estela Specs 6 LLC'],['007','Estela Specs 7 LLC'],['008','Estela Specs 8 LLC'],['009','Estela Specs 9 LLC'],['100','Sabana Owner, LLC']];
var PMS=['Michael Bedaw','Jason Bedaw','Jim Humphreys','Jon Frantz'];
var SL={collecting:'Collecting Docs',review:'Under Review',permitted:'Permitted',co:'CO Received'};
var BMAP={'Collecting Docs':'collecting','Under Review':'review','Permitted ✓':'permitted','CO ★':'co'};
var _active=[];
function _gp(){try{return JSON.parse(localStorage.getItem('estela_permits_v3')||'[]');}catch(e){return[];}}
function _gs(p){var ps=p.permitStatus||'',os=p.overallStatus||'';if(ps==='co'||os==='co')return'co';if(ps==='issued'||ps==='permitted'||os==='permitted')return'permitted';if(ps==='applied'||os==='submitted'||ps==='review')return'review';return'collecting';}
function _fp(){return _active.length?_gp().filter(function(p){return _active.indexOf(_gs(p))>-1;}):_gp();}
function _on(code){var o=OW.find(function(x){return x[0]===code;});return o?code+' - '+o[1]:code||'—';}

function _pf(){document.querySelectorAll('.info-field').forEach(function(f){var lbl=f.querySelector('.info-label'),inp=f.querySelector('input.info-input');if(!inp||inp.dataset.pf)return;var label=lbl?lbl.textContent.trim():'';if(label!=='Project Manager'&&label!=='OWNER')return;inp.dataset.pf='1';var onch=inp.getAttribute('onchange')||'',cur=inp.value,sel=document.createElement('select');sel.className='info-input';sel.style.cssText='width:100%;padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;background:#fff;color:#1e293b';if(label==='Project Manager'){var d0=document.createElement('option');d0.value='';d0.textContent='Select PM...';sel.appendChild(d0);PMS.forEach(function(pm){var o=document.createElement('option');o.value=pm;o.textContent=pm;if(pm.toUpperCase()===cur.toUpperCase())o.selected=true;sel.appendChild(o);});}else{var d1=document.createElement('option');d1.value='';d1.textContent='Select owner...';sel.appendChild(d1);OW.forEach(function(o){var opt=document.createElement('option');opt.value=o[0];opt.textContent=o[0]+' - '+o[1];if(o[0]===cur)opt.selected=true;sel.appendChild(opt);});}sel.addEventListener('change',function(){try{eval(onch.replace(/this\.value/g,JSON.stringify(this.value)));}catch(e){}});inp.replaceWith(sel);});}

function _exp(tr,com,st){var nxt=tr.nextElementSibling;if(nxt&&nxt.dataset.er===com+st){nxt.remove();return;}while(nxt&&nxt.dataset.er){var t=nxt.nextElementSibling;nxt.remove();nxt=t;}var pp=_gp().filter(function(p){return p.community===com&&_gs(p)===st;});if(!pp.length)return;var exp=document.createElement('tr');exp.dataset.er=com+st;var td=document.createElement('td');td.colSpan=tr.querySelectorAll('td').length||8;td.style.cssText='padding:0;border-bottom:3px solid #3b82f6;border-top:1px solid #bfdbfe';var box=document.createElement('div');box.style.cssText='background:#f0f9ff;border-left:4px solid #3b82f6';var hd=document.createElement('div');hd.style.cssText='padding:8px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #bfdbfe';var hl=document.createElement('strong');hl.style.cssText='font-size:12px;color:#1e40af;text-transform:uppercase';hl.textContent=com+' — '+SL[st]+' ('+pp.length+')';var hb=document.createElement('button');hb.textContent='Close ✕';hb.style.cssText='background:none;border:1px solid #bfdbfe;border-radius:4px;cursor:pointer;color:#64748b;padding:2px 8px;font-size:11px';hb.onclick=function(){exp.remove();};hd.appendChild(hl);hd.appendChild(hb);box.appendChild(hd);var tbl=document.createElement('table');tbl.style.cssText='width:100%;border-collapse:collapse';var thead=document.createElement('thead');var hr=document.createElement('tr');hr.style.background='#dbeafe';['#','Address / Lot','Permit #','Model','Owner','PM'].forEach(function(h){var th=document.createElement('th');th.style.cssText='padding:6px 12px;text-align:left;font-size:10px;color:#1e40af;font-weight:700;white-space:nowrap';th.textContent=h;hr.appendChild(th);});thead.appendChild(hr);tbl.appendChild(thead);var tb=document.createElement('tbody');pp.forEach(function(p,i){var row=document.createElement('tr');row.style.background=i%2===0?'#f8faff':'#eff6ff';[i+1,p.address+(p.lotNumber?' · Lot '+p.lotNumber:''),p.permitNumber||'—',p.model||'—',_on(p.owner),p.projectManager||'—'].forEach(function(v,ci){var c=document.createElement('td');c.style.cssText='padding:6px 12px;font-size:12px';if(ci===0)c.style.color='#94a3b8';if(ci===2){c.style.fontFamily='monospace';c.style.color='#4f46e5';}if(ci===4){c.style.fontWeight='700';c.style.color='#7c3aed';}c.textContent=v;row.appendChild(c);});tb.appendChild(row);});tbl.appendChild(tb);box.appendChild(tbl);td.appendChild(box);exp.appendChild(td);tr.insertAdjacentElement('afterend',exp);}

function _bt(){Array.from(document.querySelectorAll('table tbody tr')).forEach(function(tr){if(tr.dataset.b5||tr.dataset.er)return;var tds=tr.querySelectorAll('td');if(tds.length<4)return;var com=tds[0]&&tds[0].textContent.trim();if(!com||com==='TOTAL'||/^\d+$/.test(com))return;tr.dataset.b5='1';[{i:2,s:'collecting'},{i:3,s:'review'},{i:4,s:'permitted'},{i:5,s:'co'}].forEach(function(col){var td=tds[col.i];if(!td||td.textContent.trim()==='—')return;td.style.cursor='pointer';td.title='Click to expand';td.style.textDecoration='underline dotted';(function(t,c,s){td.addEventListener('click',function(e){e.stopPropagation();_exp(t,c,s);});})(tr,com,col.s);});});}

function _ut(){var fp=_fp();Array.from(document.querySelectorAll('table tbody tr')).forEach(function(tr){if(tr.dataset.er)return;var tds=tr.querySelectorAll('td');if(tds.length<4)return;var com=tds[0]&&tds[0].textContent.trim();if(!com||com==='TOTAL'||/^\d+$/.test(com))return;var cp=fp.filter(function(p){return p.community===com;});if(tds[1]){tds[1].dataset.orig=tds[1].dataset.orig||tds[1].textContent.trim();tds[1].textContent=_active.length?cp.length:(tds[1].dataset.orig||cp.length);}[{i:2,s:'collecting'},{i:3,s:'review'},{i:4,s:'permitted'},{i:5,s:'co'}].forEach(function(col){var td=tds[col.i];if(!td)return;var badge=td.querySelector('span')||td;var orig=badge.dataset.orig||(badge.tagName==='SPAN'?badge.textContent.trim():null);if(orig)badge.dataset.orig=orig;var n=cp.filter(function(p){return _gs(p)===col.s;}).length;if(badge.tagName==='SPAN'){badge.textContent=_active.length?(n||''):(orig||n);badge.style.opacity=(_active.length&&!n)?'0.3':'';}});})}

function _msb(){var btns=Array.from(document.querySelectorAll('button')).filter(function(b){var t=b.textContent.trim();return t==='All'||BMAP[t];});if(!btns.length||btns[0].dataset.ms5)return;btns.forEach(function(btn){btn.dataset.ms5='1';var txt=btn.textContent.trim();if(txt==='All'){btn.addEventListener('click',function(){_active=[];btns.forEach(function(b){b.style.outline='';b.style.background='';});setTimeout(_ut,100);},true);return;}var sKey=BMAP[txt];if(!sKey)return;btn.addEventListener('click',function(e){e.stopPropagation();e.preventDefault();setTimeout(function(){var idx=_active.indexOf(sKey);if(idx>-1){_active.splice(idx,1);btn.style.outline='';btn.style.background='';}else{_active.push(sKey);btn.style.outline='2px solid #7c3aed';btn.style.background='#ede9fe';}_ut();},80);},true);});}

function _ent(){
  var permits=_gp();
  document.querySelectorAll('table').forEach(function(tbl){
    if(tbl.dataset.et)return;
    var ths=Array.from(tbl.querySelectorAll('th')).map(function(th){return th.textContent.trim().toUpperCase();});
    if(!ths.some(function(h){return h.includes('ADDRESS');})||!ths.some(function(h){return h.includes('COMMUNITY');}))return;
    tbl.dataset.et='1';

    // Add MODEL + OWNER headers
    var hr=tbl.querySelector('thead tr');
    if(hr&&!hr.querySelector('[data-added]')){
      var pmI=ths.findIndex(function(h){return h.includes('PM');});
      var mth=document.createElement('th');mth.dataset.added='1';mth.textContent='MODEL';mth.style.cssText='padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#64748b;cursor:pointer;white-space:nowrap';
      var oth=document.createElement('th');oth.dataset.added='1';oth.textContent='OWNER';oth.style.cssText='padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#64748b;cursor:pointer;white-space:nowrap';
      if(pmI>-1&&hr.children[pmI]){hr.children[pmI].insertAdjacentElement('afterend',oth);hr.children[pmI].insertAdjacentElement('afterend',mth);}else{hr.appendChild(mth);hr.appendChild(oth);}
    }

    // Filter toolbar
    if(!tbl.previousElementSibling||!tbl.previousElementSibling.dataset.ftb){
      var tb=document.createElement('div');tb.dataset.ftb='1';
      tb.style.cssText='display:flex;flex-wrap:wrap;gap:8px;padding:10px 0 10px;align-items:center';

      function mk(lbl,el){var w=document.createElement('div');w.style.cssText='display:flex;align-items:center;gap:5px';var l=document.createElement('span');l.textContent=lbl;l.style.cssText='font-size:11px;color:#64748b;font-weight:600;white-space:nowrap';w.appendChild(l);w.appendChild(el);return w;}

      var si=document.createElement('input');si.type='text';si.placeholder='Search address, PM, model...';si.style.cssText='padding:5px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:12px;width:210px';

      var pi=document.createElement('select');pi.style.cssText='padding:5px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:12px';
      var pa=document.createElement('option');pa.value='';pa.textContent='All PMs';pi.appendChild(pa);
      PMS.forEach(function(pm){var o=document.createElement('option');o.value=pm;o.textContent=pm;pi.appendChild(o);});

      var df=document.createElement('input');df.type='date';df.style.cssText='padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:12px';
      var dt=document.createElement('input');dt.type='date';dt.style.cssText='padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:12px';
      var sep=document.createElement('span');sep.textContent='to';sep.style.cssText='font-size:11px;color:#64748b';

      var cb=document.createElement('button');cb.textContent='✕ Clear';cb.style.cssText='padding:5px 10px;background:#6b7280;color:#fff;border:none;border-radius:6px;font-size:11px;cursor:pointer';
      var cd=document.createElement('span');cd.style.cssText='font-size:11px;color:#64748b;font-weight:600;margin-left:4px';

      tb.appendChild(mk('Search:',si));tb.appendChild(mk('PM:',pi));
      var dw=document.createElement('div');dw.style.cssText='display:flex;align-items:center;gap:5px';
      var dl=document.createElement('span');dl.textContent='Submitted:';dl.style.cssText='font-size:11px;color:#64748b;font-weight:600;white-space:nowrap';
      dw.appendChild(dl);dw.appendChild(df);dw.appendChild(sep);dw.appendChild(dt);
      tb.appendChild(dw);tb.appendChild(cb);tb.appendChild(cd);
      tbl.parentNode.insertBefore(tb,tbl);

      function af(){
        var sv=si.value.toLowerCase(),pv=pi.value,fv=df.value,tv=dt.value,vis=0;
        Array.from(tbl.querySelectorAll('tbody tr')).forEach(function(row){
          var txt=row.textContent.toLowerCase();
          var pmCell=Array.from(row.querySelectorAll('td')).find(function(td,i){return ths[i]&&ths[i].includes('PM');});
          var sd=row.dataset.sd||'';
          var ok=((!sv||txt.includes(sv))&&(!pv||!pmCell||pmCell.textContent.includes(pv))&&(!fv||sd>=fv)&&(!tv||sd<=tv));
          row.style.display=ok?'':'none';if(ok)vis++;
        });
        cd.textContent=vis+' shown';
      }
      si.addEventListener('input',af);pi.addEventListener('change',af);df.addEventListener('change',af);dt.addEventListener('change',af);
      cb.addEventListener('click',function(){si.value='';pi.value='';df.value='';dt.value='';af();});
    }

    // Enrich rows with Model + Owner + submitted date
    Array.from(tbl.querySelectorAll('tbody tr')).forEach(function(row){
      if(row.dataset.enriched)return;row.dataset.enriched='1';
      var ac=row.querySelector('td');if(!ac)return;
      var addr=ac.textContent.trim().toLowerCase();
      var p=permits.find(function(x){if(!x.address)return false;var pa=x.address.toLowerCase();return pa.includes(addr.split(' ').slice(0,2).join(' '))||addr.includes(pa.split(',')[0].trim().split(' ').slice(0,2).join(' '));});
      if(p&&p.stageDates&&p.stageDates.submitted)row.dataset.sd=p.stageDates.submitted;
      var mc=document.createElement('td');mc.style.cssText='padding:8px 12px;font-size:13px';mc.textContent=p?p.model||'—':'—';
      var oc=document.createElement('td');oc.style.cssText='padding:8px 12px;font-size:12px;font-weight:600;color:#7c3aed';oc.textContent=p?_on(p.owner):'—';
      var tds=row.querySelectorAll('td');
      var pmI2=ths.findIndex(function(h){return h.includes('PM');});
      if(pmI2>-1&&tds[pmI2]){tds[pmI2].insertAdjacentElement('afterend',oc);tds[pmI2].insertAdjacentElement('afterend',mc);}else{row.appendChild(mc);row.appendChild(oc);}
    });

    // Sort all columns
    Array.from(tbl.querySelectorAll('th')).forEach(function(th,ci){
      if(th.dataset.s)return;th.dataset.s='1';
      var arr=document.createElement('span');arr.style='margin-left:4px;opacity:0.4;font-size:9px';arr.textContent='⇅';th.appendChild(arr);
      th.style.cursor='pointer';th.title='Click to sort A→Z or Z→A';
      th.addEventListener('click',function(){
        var tb2=tbl.querySelector('tbody');if(!tb2)return;
        var rows=Array.from(tb2.querySelectorAll('tr')).filter(function(r){return r.style.display!=='none';});
        var d=th._d||1;th._d=-d;
        rows.sort(function(a,b){return((a.querySelectorAll('td')[ci]||{}).textContent||'').localeCompare((b.querySelectorAll('td')[ci]||{}).textContent||'')*d;});
        rows.forEach(function(r){tb2.appendChild(r);});
        tbl.querySelectorAll('th span').forEach(function(s){s.textContent='⇅';s.style.opacity='0.4';});
        arr.textContent=d===1?'↑':'↓';arr.style.opacity='1';
      });
    });
  });
}

setInterval(function(){_pf();_bt();_msb();_ut();_ent();},1000);