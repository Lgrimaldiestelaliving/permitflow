(function(){
var OWNERS=[{code:'001',name:'Estela Living, LLC'},{code:'002',name:'Estela Specs 1 LLC'},{code:'003',name:'Estela Specs 2 LLC'},{code:'004',name:'Estela Specs 3 LLC'},{code:'005',name:'Estela Specs 4 LLC'},{code:'006',name:'Estela Specs 6 LLC'},{code:'007',name:'Estela Specs 7 LLC'},{code:'008',name:'Estela Specs 8 LLC'},{code:'009',name:'Estela Specs 9 LLC'},{code:'100',name:'Sabana Owner, LLC'}];
var PMS=['Michael Bedaw','Jason Bedaw','Jim Humphreys','Jon Frantz'];
window.OWNERS=OWNERS; window.APP_PMS=PMS;
function _gp(){try{return JSON.parse(localStorage.getItem('estela_permits_v3')||'[]');}catch(e){return[];}}
function _sp(permits){try{localStorage.setItem('estela_permits_v3',JSON.stringify(permits));}catch(e){}}
function _save(pid,field,val){var p=_gp();var idx=p.findIndex(function(x){return x.id===pid;});if(idx>-1){p[idx][field]=val;_sp(p);if(typeof saveData==='function')saveData();};}

// Inject Owner + PM dropdowns into expanded permit rows
function injectOwnerFields(){
  document.querySelectorAll('[data-permit-id],[id^="permit-row-"],[class*="permit-row"],[class*="permit-detail"]').forEach(function(row){
    var pid = row.dataset.permitId || row.id.replace('permit-row-','');
    if(!pid || row.dataset.ownerInjected) return;
    row.dataset.ownerInjected = '1';
    var permits = _gp();
    var permit = permits.find(function(p){return p.id===pid;});
    if(!permit) return;
    var div = document.createElement('div');
    div.style.cssText='display:flex;gap:12px;flex-wrap:wrap;padding:8px 0;border-top:1px solid #f0f0f0;margin-top:4px';
    div.innerHTML='<div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:3px">Owner</label><select onchange="_save(''+pid+'','owner',this.value)" style="padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:12px;min-width:180px"><option value="">Select owner...</option>'+OWNERS.map(function(o){return '<option value="'+o.code+'" '+(permit.owner===o.code?'selected':'')+'>'+o.code+' – '+o.name+'</option>';}).join('')+'</select></div><div><label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:3px">Project Manager</label><select onchange="_save(''+pid+'','projectManager',this.value)" style="padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:12px;min-width:180px"><option value="">Select PM...</option>'+PMS.map(function(pm){return '<option value="'+pm+'" '+(permit.projectManager===pm?'selected':'')+'>'+pm+'</option>';}).join('')+'</select></div>';
    // Find the detail section for this permit
    var detail = row.querySelector('.permit-info,[class*="info-grid"],[class*="detail"]');
    if(detail) detail.appendChild(div);
    else row.appendChild(div);
  });
}

// Also patch modal forms to include Owner + correct PM options
function patchModal(){
  var ownerSel = document.getElementById('f-owner');
  var pmSel = document.getElementById('f-projectManager');
  if(!ownerSel){
    var pmField = document.getElementById('f-projectManager');
    if(pmField){
      var ownerDiv = document.createElement('div');
      ownerDiv.className = pmField.closest('.form-field, div')?.className||'';
      ownerDiv.style.cssText = pmField.closest('div')?.style.cssText||'';
      ownerDiv.innerHTML='<label class="form-label" style="font-size:11px;font-weight:600;color:#374151;margin-bottom:4px;display:block">Owner</label><select class="form-input" id="f-owner" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px"><option value="">Select owner...</option>'+OWNERS.map(function(o){return '<option value="'+o.code+'">'+o.code+' – '+o.name+'</option>';}).join('')+'</select>';
      var parent = pmField.closest('.form-field, div')?.parentNode;
      if(parent) parent.insertBefore(ownerDiv, pmField.closest('.form-field, div'));
    }
  }
  if(pmSel){
    var cur = pmSel.value;
    pmSel.innerHTML='<option value="">Select PM...</option>'+PMS.map(function(pm){return '<option value="'+pm+'" '+(pm===cur?'selected':'')+'>'+pm+'</option>';}).join('');
  }
}

// Update _sd (drill-down) to show owner code
var _origSd = window._sd;
window._sd = function(title, permits){
  if(permits && permits.length) {
    // Add owner code to existing drill-down by patching after render
    if(_origSd) _origSd(title, permits);
    // Find the table and add owner column if not there
    setTimeout(function(){
      var tbl = document.querySelector('#_dm table');
      if(!tbl || tbl.querySelector('th[data-owner]')) return;
      var ths = tbl.querySelectorAll('thead th');
      if(ths.length > 2) {
        var ownerTh = document.createElement('th');
        ownerTh.setAttribute('data-owner','1');
        ownerTh.style.cssText='padding:10px;text-align:left;border-bottom:2px solid #e2e8f0';
        ownerTh.textContent='Owner';
        ths[2].after(ownerTh);
        var rows = tbl.querySelectorAll('tbody tr');
        permits.forEach(function(p,i){
          var row = rows[i];
          if(!row) return;
          var tds = row.querySelectorAll('td');
          var ownerTd = document.createElement('td');
          ownerTd.style.cssText='padding:8px;font-family:monospace;font-size:12px;font-weight:700;color:#7c3aed';
          ownerTd.textContent = p.owner||'—';
          if(tds[2]) tds[2].after(ownerTd);
        });
      }
    },100);
  }
};

// Also add Owner + PM to filter area and reports multi-select panel
function addOwnerFilter(){
  if(document.getElementById('_owner_filter')) return;
  var ms = document.getElementById('_ms_status');
  if(!ms) return;
  var ownerDiv = document.createElement('div');
  ownerDiv.id='_owner_filter';
  ownerDiv.style.cssText='margin-top:10px;padding:10px 12px;background:#fff;border-radius:6px;border:1px solid #e2e8f0';
  ownerDiv.innerHTML='<div style="font-size:11px;font-weight:700;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Owner Filter</div><select id="_owner_sel" onchange="window._ownerFilter=this.value" style="padding:5px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:12px;min-width:220px"><option value="">All Owners</option>'+OWNERS.map(function(o){return '<option value="'+o.code+'">'+o.code+' – '+o.name+'</option>';}).join('')+'</select>';
  ms.parentNode.insertBefore(ownerDiv, ms.nextSibling);
}

var _origMsView = window._msView;
window._msView = function(){
  var sel = Array.from(document.querySelectorAll('#_ms_boxes input:checked')).map(function(i){return i.value;});
  var ownerF = window._ownerFilter||'';
  var permits = _gp();
  if(sel.length) permits = permits.filter(function(p){return sel.includes(window._getS?window._getS(p):'');});
  if(ownerF) permits = permits.filter(function(p){return p.owner===ownerF;});
  var parts=[];
  if(sel.length) parts.push(sel.map(function(s){return{collecting:'Collecting Docs',applied:'Applied',review:'Under Review',permitted:'Permitted',co:'CO Received'}[s];}).join(' + '));
  if(ownerF){var o=OWNERS.find(function(x){return x.code===ownerF;});if(o)parts.push(o.name);}
  window._sd(parts.join(' | ')||'All Permits', permits);
};

var obs=new MutationObserver(function(){patchModal();addOwnerFilter();});
obs.observe(document.body,{childList:true,subtree:true});
setTimeout(function(){patchModal();addOwnerFilter();},500);
setInterval(function(){patchModal();addOwnerFilter();},2000);
})();