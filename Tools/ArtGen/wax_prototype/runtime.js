/* Dị Thể Sáp trong bản đồ prototype: sprite thật, VFX, kỹ năng, trùm, bảng kiểm tra.
   Nguồn: Tools/ArtGen/wax_prototype/runtime.js, nhúng bởi Tools/ArtGen/embed_wax_in_prototype.py.
   Không sửa mã gốc của prototype: file này chạy SAU script chính và bọc (wrap) các hàm toàn cục. */
(function(){'use strict';
const D=window.WAXDATA;
if(!D){console.warn('[wax] thiếu WAXDATA');return;}
/* ---- kiểm tra các điểm móc của prototype ---- */
const miss=[];
if(typeof updateEnemies!=='function')miss.push('updateEnemies');if(typeof drawEnemy!=='function')miss.push('drawEnemy');
if(typeof damage!=='function')miss.push('damage');if(typeof kill!=='function')miss.push('kill');
if(typeof drawGroundFX!=='function')miss.push('drawGroundFX');if(typeof drawAirFX!=='function')miss.push('drawAirFX');
if(typeof seedEnemies!=='function')miss.push('seedEnemies');if(typeof liveEnemies!=='function')miss.push('liveEnemies');
if(typeof pos!=='function')miss.push('pos');if(typeof resetFX!=='function')miss.push('resetFX');if(typeof selectMap!=='function')miss.push('selectMap');
if(typeof MAPS==='undefined')miss.push('MAPS');if(typeof S==='undefined')miss.push('S');if(typeof ctx==='undefined')miss.push('ctx');
if(typeof FX==='undefined')miss.push('FX');if(typeof enemies==='undefined')miss.push('enemies');if(typeof T==='undefined')miss.push('T');
if(miss.length){console.warn('[wax] prototype đã đổi, thiếu: '+miss.join(', ')+'. Bỏ qua bản vá Dị Thể Sáp.');return;}
const HAS_TW=typeof towers!=='undefined'&&typeof twPt==='function'&&typeof twHead==='function';

/* ---- ảnh ---- */
function loadImg(src){const im=new Image();im.src=src;return im;}
function rdy(im){return !!im&&im.complete&&im.naturalWidth>0;}
const IMG={},VIMG={};
for(const k in D.units)IMG[k]=loadImg(D.units[k].img);
for(const k in D.vfx)VIMG[k]=loadImg(D.vfx[k].img);

/* ---- bảng quái: bậc gốc (t) giữ luật của tháp trong prototype; máu, tốc độ (ô/giây) theo GDD 4.6 ---- */
const K={
  standard:{t:1,hp:30,sp:1.5,vn:'Sáp tiêu chuẩn',acc:'#f3d57c',sw:'swipe'},
  shard:{t:1,hp:9,sp:1.9,vn:'Sáp vụn',acc:'#f2ecd8',sw:'swipe',small:1},
  crab:{t:1,hp:70,sp:0.8,vn:'Sáp vỏ cua',acc:'#f39a86',sw:'slash'},
  tiger:{t:2,hp:18,sp:3.1,vn:'Sáp hổ',acc:'#efe6d0',sw:'slash'},
  cub:{t:2,hp:8,sp:3.4,vn:'Hổ con',acc:'#efe6d0',sw:'slash',small:1},
  healer:{t:3,hp:46,sp:1.1,vn:'Sáp hồi phục',acc:'#f5a6bd',sw:'swipe'},
  spore:{t:3,hp:40,sp:1.2,vn:'Sáp bào tử',acc:'#b27fd6',sw:'swipe'},
  lens:{t:4,hp:40,sp:1.3,vn:'Sáp thấu kính',acc:'#6cd6cc',sw:'swipe'},
  mirror:{t:4,hp:52,sp:1.2,vn:'Sáp gương',acc:'#d2caf0',sw:'swipe'},
  ultimate:{t:5,hp:170,sp:0.7,vn:'Sáp tối thượng',acc:'#d39a62',sw:'swipe'},
  frenzy:{t:2,hp:26,sp:2.2,vn:'Sáp kích động',acc:'#d8455a',sw:'slash'},
  primordial:{t:1,hp:700,sp:0.7,boss:1,vn:'Sáp Nguyên Thủy',acc:'#f0b648',sw:'swipe'},
  alpha:{t:2,hp:620,sp:1.0,boss:1,vn:'Hổ Sáp Đầu Đàn',acc:'#efe2c6',sw:'slash'},
  mother:{t:3,hp:800,sp:0.7,boss:1,vn:'Cây Sáp Mẹ',acc:'#f5a6bd',sw:'swipe'},
  prism:{t:4,hp:760,sp:0.75,boss:1,vn:'Lăng Kính Sống',acc:'#9fd8ff',sw:'swipe'},
  myriad:{t:5,hp:1400,sp:0.55,boss:1,vn:'Khối Sáp Vạn Người',acc:'#c9a0e0',sw:'swipe'},
  pod:{t:3,hp:14,sp:0,vn:'Quả hạt',acc:'#f5a6bd',small:1}
};
const ORDER=['standard','shard','crab','tiger','cub','healer','spore','lens','mirror','ultimate','frenzy','primordial','alpha','mother','prism','myriad'];
/* GDD 5.3: mỗi bản đồ thêm một bậc và một biến thể; bậc cũ vẫn còn nhưng thưa hơn */
const POOL={1:[['standard',5],['shard',4]],
  2:[['standard',3],['shard',1.5],['tiger',4],['crab',2.5]],
  3:[['standard',2],['shard',1],['tiger',2],['crab',1],['healer',3.5],['spore',3]],
  4:[['standard',1.5],['tiger',1.5],['crab',0.8],['healer',2],['spore',1],['lens',3.5],['mirror',3]],
  5:[['standard',1.5],['tiger',1.5],['healer',1.5],['spore',1],['lens',2],['mirror',1.2],['ultimate',1.7],['frenzy',2.2]]};
const BOSS={1:'primordial',2:'alpha',3:'mother',4:'prism',5:'myriad'};
const TH={primordial:[[.66,'shed'],[.33,'shed']],alpha:[[.5,'roar']],mother:[[.66,'seed'],[.33,'seed']],prism:[[.5,'multi']],myriad:[[.66,'scream'],[.33,'scream'],[.1,'heart']]};
const DEMO={primordial:['shed'],alpha:['pounce','roar'],mother:['roots','seed','bark'],prism:['pfocus','mirror','multi','core'],myriad:['absorb','scream']};
const BOSS_SK={primordial:[['shed','Bong tróc']],
  alpha:[['pounce','Vồ'],['roar','Gọi bầy'],['headbutt','Húc tường']],
  mother:[['roots','Rễ nuôi'],['seed','Gieo hạt'],['bark','Vỏ cây']],
  prism:[['pfocus','Hội tụ'],['multi','Hội tụ đa điểm'],['core','Mở lõi'],['mirror','Da gương']],
  myriad:[['absorb','Hấp thụ'],['scream','Vạn người'],['heart','Trái tim cuối cùng']]};
const STEP={1:'step_dust',2:'step_splash',3:'step_dust',4:'step_salt',5:'step_snow'};
const ICON_F=D.icons;

/* ---- trạng thái chung ---- */
const WX={t:0,corpses:[],g:[],o:[],trails:[],timers:[],edge:null,bossT:14,spawnN:0,fps:60,gallery:false,gpage:0,gt:0,mouse:null};
const OPT={scale:0.25,auto:true,demo:true,dust:true,names:false,bars:false,all:true,cap:46};
const CUR={src:null,noSplit:false};
try{const sv=JSON.parse(localStorage.getItem('waxdbg')||'{}');for(const k in sv)if(k in OPT&&typeof sv[k]===typeof OPT[k])OPT[k]=sv[k];}catch(err){}
function saveOpt(){try{localStorage.setItem('waxdbg',JSON.stringify(OPT));}catch(err){}}
const rnd=(a,b)=>a+Math.random()*(b-a);
const mapId=()=>MAPS[S.map].id||S.map+1;
const U_=k=>D.units[k];
/* hệ số cỡ của lớp phủ trạng thái theo chiều cao quái (Sáp tiêu chuẩn ~0,9, Sáp vụn ~0,35, trùm ~1,9) */
const uf=e=>e.k==='pod'?0.5:U_(e.k).h/112;
const WS=()=>OPT.scale;
const feet=e=>e.y+6;
const uh=e=>e.k==='pod'?40*WS():U_(e.k).h*WS();
const body=e=>[e.x,feet(e)-uh(e)*0.45];
const heavy=e=>!!K[e.k].boss||e.t===5;
const dist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)/0.72);
function pt(e,px,up){return [e.x+(e.w.face>0?-px:px)*WS(),feet(e)-up*WS()];}
function after(t,fn){WX.timers.push({t:t,fn:fn});}
function toDay(){if(S.mode!=='day'){S.mode='day';try{storm.t0=performance.now();setPressed();renderCaption();}catch(err){}}}

/* ---- vẽ VFX ---- */
const TINT={};
function tinted(n,col){const key=n+col;if(TINT[key])return TINT[key];const im=VIMG[n];if(!rdy(im))return im;
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');
  x.drawImage(im,0,0);x.globalCompositeOperation='multiply';x.fillStyle=col;x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0);
  return TINT[key]=c;}
function vframe(v,t,loop,fps){const f=Math.floor(t*(fps||v.fps||1));return loop?((f%v.n)+v.n)%v.n:Math.max(0,Math.min(v.n-1,f));}
/* o: s, sx, sy (hệ số trên cỡ gốc), rot, flip, a, tint, k (world px mỗi px gốc, mặc định WS), c (context) */
function drawV(n,fr,x,y,o){const v=D.vfx[n];let im=VIMG[n];if(!v||!rdy(im))return;o=o||{};const c=o.c||ctx;if(o.tint&&v.tint)im=tinted(n,o.tint);
  const k=o.k||WS(),sx=(o.sx!==undefined?o.sx:(o.s||1))*k,sy=(o.sy!==undefined?o.sy:(o.s||1))*k,f=Math.max(0,Math.min(v.n-1,fr|0));
  c.save();c.translate(x,y);if(o.rot)c.rotate(o.rot);c.scale(o.flip?-sx:sx,sy);
  if(o.a!==undefined)c.globalAlpha=Math.max(0,Math.min(1,o.a));if(v.add)c.globalCompositeOperation='lighter';
  c.drawImage(im,f*v.we,0,v.we,v.he,-v.ax,-v.ay,v.w,v.h);c.restore();}
/* dải lặp theo trục x dọc một đường gấp khúc (tia, vạch vồ, vệt hấp thụ) */
function drawBeam(n,fr,pts,o){const v=D.vfx[n],im=VIMG[n];if(!v||!rdy(im)||pts.length<2)return;o=o||{};const c=o.c||ctx,k=o.k||WS(),tl=v.w*k*(o.s||1),sy=k*(o.sy!==undefined?o.sy:(o.s||1));
  const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const tot=cum[cum.length-1];if(tot<1)return;
  const at=s=>{let i=1;while(i<cum.length-1&&cum[i]<s)i++;const seg=cum[i]-cum[i-1]||1,q=(s-cum[i-1])/seg;return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*q,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*q];};
  const f=Math.max(0,Math.min(v.n-1,fr|0));c.save();if(o.a!==undefined)c.globalAlpha=Math.max(0,Math.min(1,o.a));if(v.add)c.globalCompositeOperation='lighter';
  for(let s=0;s<tot-0.5;s+=tl){const p=at(s),q=at(Math.min(tot,s+tl)),fr2=Math.min(1,(tot-s)/tl),ang=Math.atan2(q[1]-p[1],q[0]-p[0]);
    c.save();c.translate(p[0],p[1]);c.rotate(ang);c.drawImage(im,f*v.we,0,v.we*fr2,v.he,0,-v.ay*sy,tl*fr2,v.h*sy);c.restore();}
  c.restore();}
/* hiệu ứng một lần / lặp có thời hạn. o: layer ('g' | 'o'), dur, loop, fps, on (đi theo quái), dx, dy + tham số drawV */
function vfx(n,x,y,o){const v=D.vfx[n];if(!v)return null;o=o||{};const L=(o.layer||(v.layer==='ground'?'g':'o'))==='g'?WX.g:WX.o;
  if(L.length>420)L.shift();const p={n:n,x:x,y:y,t:0,dur:o.dur||(v.fps?v.n/v.fps:0.4),o:o};L.push(p);return p;}
function vfxOn(e,n,px,up,o){o=o||{};o.on=e;o.px=px;o.up=up;const q=pt(e,px,up);return vfx(n,q[0],q[1],o);}
function drawFxList(L){for(const p of L){const v=D.vfx[p.n],o=p.o;let x=p.x,y=p.y;if(o.on&&!o.on.dead&&o.on.x!==undefined){const q=pt(o.on,o.px||0,o.up||0);x=p.x=q[0];y=p.y=q[1];}
  let a=o.a===undefined?1:o.a;if(o.fade)a*=Math.min(1,(p.dur-p.t)/o.fade);
  drawV(p.n,vframe(v,p.t,o.loop,o.fps),x,y,{s:o.s,sx:o.sx,sy:o.sy,rot:o.rot,flip:o.flip,a:a,tint:o.tint});}}
function edgePulse(col,n,per){WX.edge={col:col,n:n,per:per,t:0};}
const ringS=(R,ell)=>2*R/(ell*WS());

/* ---- quái ---- */
function mkUnit(kind,d){const k=K[kind],b=!!k.boss;
  return {k:kind,t:k.t,hp:k.hp,max:k.hp,slow:0,frozen:0,burn:0,sol:0,net:0,hit:0,lure:0,d:d||0,ph:Math.random()*4,atk:0,
    jx:b?0:Math.round((Math.random()-.5)*12),jy:b?0:Math.round((Math.random()-.5)*10),
    w:{face:-1,vx:0,walkT:Math.random(),lastF:-1,hitT:0,ox:0,oy:0,tar:0,haste:0,regen:0,core:0,barkT:0,skillT:rnd(2,5),queue:[],act:null,atkT:0,swing:0,atkHit:0,
      lastHit:-9,lastSplash:-9,lastRef:-9,drip:rnd(0.6,2.4),cd:{},th:(TH[kind]||[]).slice(),demoI:0,r:null,L:1,born:WX.t}};}
function pickKind(){const pool=POOL[mapId()]||POOL[1],sum=pool.reduce((a,p)=>a+p[1],0);let r=Math.random()*sum;for(const p of pool){r-=p[1];if(r<=0)return p[0];}return pool[0][0];}
function basePos(e){return pos(e.w.r.cells,e.d);}
function place(e,first){const w=e.w,b=basePos(e),px=e.x;e.x=b[0]+e.jx+w.ox;e.y=b[1]+e.jy+w.oy;
  if(first){const L=w.r.cells.length-1,q=pos(w.r.cells,Math.min(L,e.d+0.6)),p0=pos(w.r.cells,Math.max(0,Math.min(L,e.d+0.6)-0.6));w.face=q[0]-p0[0]>0.01?1:-1;}
  else if(px!==undefined&&!w.lockFace){w.vx=w.vx*0.82+(e.x-px);if(Math.abs(w.vx)>0.5)w.face=w.vx>0?1:-1;}}
function spawn(r,kind,d,o){const e=mkUnit(kind,d);e.w.r=r;e.w.L=r.cells.length-1;if(o){if(o.ox!==undefined){e.w.ox=o.ox;e.w.oy=o.oy;}if(o.jx!==undefined){e.jx=o.jx;e.jy=o.jy;}}place(e,true);r.list.push(e);return e;}
function spawnRing(src,kind,n,r0,r1){const out=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rnd(-.3,.3),rr=rnd(r0,r1);
  out.push(spawn(src.w.r,kind,Math.max(0,Math.min(src.w.L-0.2,src.d+rnd(-.3,.3))),{ox:src.w.ox+Math.cos(a)*rr,oy:src.w.oy+Math.sin(a)*rr*0.6}));}return out;}
function bossAlive(){for(const e of liveEnemies())if(K[e.k]&&K[e.k].boss)return e;return null;}
function count(){let n=0;for(const r of enemies)n+=r.list.length;return n;}
function nearTower(e,range,skip){if(!HAS_TW||!S.towers)return null;let best=null,bd=range;for(const tw of towers){if(tw.wxRuin>0||(skip&&skip.includes(tw)))continue;const g=twPt(tw,0,0),d=Math.hypot(g[0]-e.x,g[1]-e.y);if(d<bd){bd=d;best=tw;}}return best;}
function ruin(tw){if(!tw||tw.wxRuin>0)return;tw.wxRuin=10;const g=twPt(tw,0,22);
  FX.rings.push({x:g[0],y:g[1],r0:3,r1:26,life:0,max:0.4,c:'255,214,140'});if(typeof spark==='function')spark(g[0],g[1],16,'#fff0b0');
  for(let i=0;i<6;i++)FX.parts.push({k:'smoke',x:g[0]+rnd(-6,6),y:g[1]-4,vx:rnd(-4,4),vy:rnd(-16,-8),g:0,life:0,max:rnd(1.2,1.9)});
  vfx('attack_impact',g[0],g[1],{s:1.5});shake=Math.max(shake,0.3);flash=Math.max(flash,0.3);flashCol='255,236,170';}

/* ---- hành động (kỹ năng): anim, dur, loop, frame(a,A), tick, marks [[t,fn]], end, move (hệ số tốc độ khi đang làm) ---- */
function startAct(e,a){const w=e.w;a.t=0;a.fired={};w.act=a;w.hitT=0;return a;}
function upAct(e,dt){const w=e.w,a=w.act;a.t+=dt;if(a.tick){a.tick(e,a,dt);if(e.dead||w.act!==a)return;}
  if(a.marks)for(let i=0;i<a.marks.length;i++){if(!a.fired[i]&&a.t>=a.marks[i][0]){a.fired[i]=1;a.marks[i][1](e,a);if(e.dead||w.act!==a)return;}}
  if(a.t>=a.dur){w.act=null;if(a.end)a.end(e,a);}}
function actFrame(U,a){const A=U.anims[a.anim]||U.anims.walk;if(a.frame)return Math.max(0,Math.min(A.n-1,a.frame(a,A)|0));const fps=a.fps||A.fps;return a.loop?Math.floor(a.t*fps)%A.n:Math.min(A.n-1,Math.floor(a.t*fps));}
function allies(e,R,fn){for(const o of liveEnemies())if(o!==e&&o.w&&o.k!=='pod'&&dist(o,e)<R)fn(o);}
function canHeal(o){return o.burn<=0&&o.sol<=0;}
function healTick(e,R,amt,self){for(const o of liveEnemies()){if(!o.w||o.k==='pod'||(!self&&o===e)||dist(o,e)>=R||!canHeal(o))continue;if(o.hp<o.max)o.hp=Math.min(o.max,o.hp+amt);o.w.regen=Math.max(o.w.regen,0.6);}}
function pathPts(e,d0,d1){const pts=[];for(let d=d0;d<d1;d+=0.5){const p=pos(e.w.r.cells,d);pts.push([p[0]+e.jx,p[1]+e.jy+6]);}const p=pos(e.w.r.cells,d1);pts.push([p[0]+e.jx,p[1]+e.jy+6]);return pts;}
function focusBeam(e,list,o){/* nạp 5 giây rồi phá các tháp trong list */
  return {anim:o.anim,loop:o.loop,frame:o.frame,dur:99,tws:list,charge:0,freezeReset:true,bar:true,beam:o.beam,from:o.from,marker:o.marker,
    tick(e,a,dt){a.tws=a.tws.filter(tw=>!(tw.wxRuin>0));if(!a.tws.length||!S.towers){a.dur=a.t;e.w.core=0;return;}
      if(a.t<(o.lead||0))return;if(o.core){e.w.core=0.25;if(a.charge>3&&o.core!==true)a.anim=o.core;}
      if(a.charge<5){a.charge+=dt;if(a.charge>=5){a.charge=5;for(const tw of a.tws)ruin(tw);a.done=a.t;a.dur=a.t+(o.tail||0.3);}}},
    end(e){e.w.core=0;e.w.skillT=o.cd||12;e.w.lockFace=false;}};}
const SK={
  heal(e){startAct(e,{anim:'heal',loop:true,dur:1.9,ring:['heal_ring',34,236],tick(e,a,dt){a.acc=(a.acc||0.25)+dt;if(a.acc>=0.3){a.acc-=0.3;healTick(e,34,3.5,true);}},end(e){e.w.skillT=3.5;}});return true;},
  focus(e,tw){tw=tw||nearTower(e,80);if(!tw)return false;const g=twPt(tw,0,0),dx=e.x-g[0],dy=e.y-g[1],dd=Math.hypot(dx,dy)||1,tx=g[0]+dx/dd*19,ty=g[1]+dy/dd*11-4;
    startAct(e,{anim:'walk',loop:true,dur:99,tick(e,a,dt){const w=e.w;if(tw.wxRuin>0||!S.towers){a.dur=a.t;w.skillT=2;return;}
      const b=basePos(e),vx=tx-(b[0]+e.jx+w.ox),vy=ty-(b[1]+e.jy+w.oy),dl=Math.hypot(vx,vy),st=K.lens.sp*T*dt*Math.max(0.3,w.mul||1);
      if(dl>st+0.5){w.ox+=vx/dl*st;w.oy+=vy/dl*st;return;}
      w.ox+=vx;w.oy+=vy;w.face=g[0]>tx?1:-1;w.lockFace=true;
      startAct(e,focusBeam(e,[tw],{anim:'focus',lead:0.5,tail:0.4,beam:'lens_beam',from:[-11,36],cd:12,
        frame:(a,A)=>a.t<0.5?a.t*8:(a.done===undefined?4+Math.floor(a.t*6)%2:6+(a.t-a.done)*8)}));}});return true;},
  howl(e){startAct(e,{anim:'howl',dur:0.85,marks:[[0.4,e=>{vfx('frenzy_howl',e.x,feet(e),{s:ringS(58,236)});allies(e,58,o=>{o.w.haste=4.5;});}]],end(e){e.w.skillT=6;}});return true;},
  selfheal(e){const up=e=>{if(!canHeal(e))return;e.hp=Math.min(e.max,e.hp+e.max*0.1);vfxOn(e,'ultimate_regen',0,0,{s:uf(e)});e.w.regen=0.8;};
    startAct(e,{anim:'selfheal',loop:true,dur:1.5,marks:[[0.2,up],[0.9,up]],end(e){e.w.skillT=7;}});return true;},
  /* trùm 1 */
  shed(e){startAct(e,{anim:'shed',dur:3,glow:0,warn:1,frame:a=>Math.floor(a.t*2.5)%2,tick(e,a,dt){a.glow+=dt*(10+10*a.t/3);},
    end(e){startAct(e,{anim:'shed',dur:1.1,glow2:1,marks:[[0.5,e=>{vfxOn(e,'primordial_shed_burst',0,105,{s:1});shake=Math.max(shake,0.35);}],[0.5+5/16,e=>{spawnRing(e,'shard',8+Math.floor(Math.random()*3),18,36);}]],end(e){e.w.skillT=9;}});}});return true;},
  /* trùm 2 */
  pounce(e){const w=e.w;if(e.d>=w.L-2)return false;const d0=e.d,d1=Math.min(w.L-0.3,e.d+8);
    startAct(e,{anim:'crouch',loop:true,dur:2,slowable:1,warn:1,line:pathPts(e,d0,d1),mk:0,tick(e,a,dt){a.mk+=dt*(12+14*a.t/2);},
      end(e){startAct(e,{anim:'pounce',dur:0.62,air:1,tick(e,a){const p=Math.min(1,a.t/0.5),q=p*p*(3-2*p);e.d=d0+(d1-d0)*q;a.z=Math.sin(Math.PI*p)*10;},
        marks:[[0.5,e=>{vfx('tiger_land_dust',e.x,feet(e),{s:1});shake=Math.max(shake,0.45);}]],end(e){e.w.skillT=12;}});}});return true;},
  roar(e){startAct(e,{anim:'roar',dur:1.0,marks:[[0.25,e=>{vfx('tiger_roar_ring',e.x,feet(e),{s:1.5});edgePulse('255,60,40',3,0.5);shake=Math.max(shake,0.3);
      const n=4+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const r=enemies[i%enemies.length];after(0.15*i,()=>{const c=spawn(r,'cub',rnd(0,0.8));vfx(STEP[mapId()]||'step_dust',c.x,feet(c),{s:1.2});});}}]],end(e){e.w.skillT=9;}});return true;},
  headbutt(e){startAct(e,{anim:'headbutt',dur:1.5,warn:1,frame:a=>Math.floor(a.t*3)%2,
    end(e){startAct(e,{anim:'headbutt',dur:0.75,marks:[[0.2,e=>{const q=pt(e,-uh(e)*0.55/WS(),55);vfx('tiger_headbutt_impact',q[0],q[1],{s:1});shake=Math.max(shake,0.55);flash=Math.max(flash,0.25);flashCol='255,240,210';if(typeof wallBusy!=='undefined')wallBusy=3;}]],end(e){e.w.skillT=6;}});}});return true;},
  /* trùm 3 */
  roots(e){startAct(e,{anim:'roots',loop:true,dur:2.2,move:1,pulse:1,end(e){e.w.skillT=6;}});return true;},
  seed(e){startAct(e,{anim:'seed',dur:0.95,move:0.4,marks:[[3/8,e=>{const n=4+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const d=e.d-(1.4+i*1.25+Math.random()*0.5);if(d<0.3)break;
      const p=spawn(e.w.r,'pod',d);p.w.podT=5;p.w.blink=0;vfx(STEP[mapId()]||'step_dust',p.x,feet(p),{s:0.8});}}]],end(e){e.w.skillT=8;}});return true;},
  bark(e){e.w.barkT=1.6;startAct(e,{anim:'bark',loop:true,dur:1.5,move:0.5,end(e){e.w.skillT=Math.max(e.w.skillT,4);}});return true;},
  /* trùm 4 */
  pfocus(e){const tw=nearTower(e,190);if(!tw)return SK.mirror(e);const g=twPt(tw,0,0);e.w.face=g[0]>e.x?1:-1;e.w.lockFace=true;
    startAct(e,focusBeam(e,[tw],{anim:'focus',loop:true,beam:'prism_charge_beam',from:[-64,174],core:'open_core',cd:10,tail:0.5}));return true;},
  multi(e){const list=[];for(let i=0;i<3;i++){const tw=nearTower(e,330,list);if(tw)list.push(tw);}if(!list.length)return SK.mirror(e);
    startAct(e,focusBeam(e,list,{anim:'multi_focus',loop:true,beam:'prism_charge_beam',from:[0,128],marker:1,core:true,cd:10,tail:0.5}));return true;},
  core(e){startAct(e,{anim:'open_core',loop:true,dur:3,tick(e){e.w.core=0.25;},end(e){e.w.skillT=6;}});return true;},
  mirror(e){startAct(e,{anim:'mirror_skin',dur:0.75,marks:[[0.2,e=>{vfxOn(e,'prism_mirror_glint',0,105,{s:1.6});const q=body(e);vfx('mirror_reflect',q[0],q[1],{s:1.6,rot:-0.6});}]],end(e){e.w.skillT=6;}});return true;},
  /* trùm 5 */
  absorb(e,fake){if(fake!==false)for(let i=0;i<3;i++){const a=rnd(0,6.28),rr=rnd(60,95);WX.trails.push({x:e.x+Math.cos(a)*rr,y:feet(e)+Math.sin(a)*rr*0.55,boss:e,t:-i*0.18,dur:1.1});}
    if(!e.w.act)startAct(e,{anim:'absorb',loop:true,dur:1.5,move:0.5,end(e){e.w.skillT=Math.max(e.w.skillT,5);}});return true;},
  scream(e){startAct(e,{anim:'scream',loop:true,dur:1.4,marks:[[0.3,e=>{vfx('myriad_scream_wave',e.x,feet(e),{s:ringS(80,352)});shake=Math.max(shake,0.4);}],
      [0.7,e=>{const pool=(POOL[mapId()]||[]).map(p=>p[0]);for(const k of ['standard','standard','tiger','healer','lens','frenzy'])spawnRing(e,pool.includes(k)||k==='frenzy'?k:'standard',1,26,44);}]],end(e){e.w.skillT=10;}});return true;},
  heart(e){if(e.w.heart)return false;if(e.hp>e.max*0.1)e.hp=e.max*0.1;e.w.th=[];
    startAct(e,{anim:'last_heart',loop:true,dur:3,heartOn:1,marks:[[0,e=>{FX.dark=Math.max(FX.dark,0.8);edgePulse('30,8,44',1,3);shake=Math.max(shake,0.3);}]],end(e){e.w.heart=true;e.w.skillT=99;}});return true;}
};

/* ---- cập nhật ---- */
const PST=['slow','frozen','burn','sol','net','hit','lure'],WST=['tar','haste','regen','hitT','core','barkT'];
function step(e){if(!OPT.dust)return;const k=K[e.k],s=k.small?0.6:k.boss?1.8:uf(e);
  vfx(STEP[mapId()]||'step_dust',e.x+rnd(-2,2)*s,feet(e)+0.5,{s:s,a:0.85});
  if(e.k==='primordial'||e.k==='myriad'){vfx('tiger_land_dust',e.x,feet(e),{s:0.6,a:0.7});shake=Math.max(shake,0.035);}}
function despawn(e){e.dead=true;onDeath(e,false);}
function attackFx(e){const k=K[e.k],U=U_(e.k),s=k.small?0.55:k.boss?1.8:uf(e),w=U.cell*WS(),f=e.w.face,cy=feet(e)-uh(e)*0.42;
  vfx('attack_'+(k.sw||'swipe'),e.x+f*w*0.26,cy,{s:(k.sw==='slash'?0.8:1)*s,flip:f<0});
  vfx('attack_impact',e.x+f*w*0.4,cy+uh(e)*0.08,{s:k.small?0.6:k.boss?1.6:1});
  if(k.boss)shake=Math.max(shake,0.12);if(typeof wallBusy!=='undefined')wallBusy=3;}
function ai(e,dt){const w=e.w,k=K[e.k];
  if(w.queue.length){const s=w.queue.shift();if(SK[s]&&SK[s](e))return;}
  w.skillT-=dt;if(w.skillT>0)return;w.skillT=0.6;
  if(e.k==='healer'){if(canHeal(e)){let n=0;allies(e,34,o=>{if(o.hp<o.max&&canHeal(o))n++;});if(n||e.hp<e.max)SK.heal(e);}}
  else if(e.k==='lens'){if(w.ox===0&&w.oy===0)SK.focus(e);}
  else if(e.k==='frenzy'){let n=0;allies(e,58,()=>{n++;});if(n)SK.howl(e);else w.skillT=1;}
  else if(e.k==='ultimate'){if(e.hp<e.max*0.6&&canHeal(e))SK.selfheal(e);else w.skillT=1;}
  else if(k.boss){
    if(OPT.demo&&!w.heart){const cyc=DEMO[e.k];const s=cyc[w.demoI++%cyc.length];w.skillT=7;if(SK[s](e)===false)w.skillT=2;}
    else if(e.k==='alpha'){w.skillT=12;SK.pounce(e);}
    else if(e.k==='prism'){w.skillT=16;SK.pfocus(e);}
    else if(e.k==='mother'){w.skillT=8;SK.roots(e);}
    else w.skillT=2;}
}
function upPod(e,dt){const w=e.w;w.podT-=dt;w.blink+=dt*(6+10*Math.max(0,1-w.podT/5));place(e);
  if(w.podT<=0){e.dead=true;vfx('tree_seed_pod_hatch',e.x,feet(e),{s:1});const r=w.r,d=e.d,jx=e.jx,jy=e.jy;after(4/14,()=>{if(enemies.includes(r))spawn(r,'healer',d,{jx:jx,jy:jy});});}}
function upUnit(e,dt){
  const w=e.w,k=K[e.k],L=w.L;
  for(const s of PST)if(e[s]>0)e[s]=Math.max(0,e[s]-dt);
  for(const s of WST)if(w[s]>0)w[s]=Math.max(0,w[s]-dt);
  if(e.shatter&&e.frozen<=0){e.shatter=false;if(typeof shards==='function')shards(e.x,e.y,10);damage(e,20);if(e.dead)return;}
  if(w.wasF&&e.frozen<=0)vfx('status_frozen_break',e.x,feet(e),{s:uf(e)});w.wasF=e.frozen>0;
  if(e.burn>0){damage(e,6*dt);if(e.dead)return;}
  if(e.sol>0){damage(e,4*dt);if(e.dead)return;}
  if(e.k==='pod'){upPod(e,dt);return;}
  const hv=heavy(e);
  if(e.frozen>0||(e.net>0&&!hv)){if(e.frozen>0&&w.act&&w.act.freezeReset)w.act.charge=0;place(e);return;}
  /* nội tại */
  if(e.t===5){w.rg=(w.rg===undefined?1.6:w.rg)-dt;if(w.rg<=0){w.rg=1.6;if(e.hp<e.max&&canHeal(e)){e.hp=Math.min(e.max,e.hp+(k.boss?e.max*0.008:8));vfxOn(e,'ultimate_regen',0,0,{s:uf(e)});}}}
  if(e.k==='prism'||e.k==='mirror'){w.gl=(w.gl===undefined?rnd(1,4):w.gl)-dt;if(w.gl<=0){w.gl=rnd(3,5);vfxOn(e,'prism_mirror_glint',0,U_(e.k).h*0.5,{s:uf(e)*0.8});}}
  let mul=1;if(e.lure>0)mul=0;else{if(e.slow>0)mul*=0.45;if(e.net>0)mul*=0.35;}if(e.sol>0)mul*=0.8;if(w.tar>0)mul*=0.3;if(w.haste>0)mul*=1.5;if(w.hitT>0)mul*=0.4;w.mul=mul;
  let mv=0,walking=false;
  if(w.act){const a=w.act;upAct(e,a.slowable?dt*Math.max(0.35,Math.min(1,mul)):dt);if(e.dead)return;mv=a.move||0;}
  else if(e.d>=L){
    if(e.k==='alpha'&&!w.rammed){w.rammed=1;SK.headbutt(e);}
    else{const A=U_(e.k).anims.attack,dur=A.n/A.fps,cyc=dur+0.4;e.atk+=dt;w.atkT+=dt;
      if(!w.atkHit&&w.atkT>=A.imp/A.fps){w.atkHit=1;attackFx(e);}
      if(w.atkT>=cyc){w.atkT-=cyc;w.atkHit=0;w.swing++;if(w.swing>=(k.boss?6:3)){despawn(e);return;}}}}
  else{ai(e,dt);if(!w.act){mv=1;walking=true;}else mv=w.act.move||0;}
  if(mv>0&&e.d<L){const sp=k.sp*(w.heart?2.2:1)*mul*mv;e.d=Math.min(L,e.d+sp*dt);
    if(sp>0){w.walkT+=dt*Math.max(0.45,Math.min(1.6,mul));
      const A=U_(e.k).anims.walk,f=Math.floor(w.walkT*A.fps)%A.n;if(f!==w.lastF){w.lastF=f;if(f===0||f===(A.n>>1))step(e);}
      w.drip-=dt;if(w.drip<=0){w.drip=rnd(1.1,2.6);vfx('wax_drip',e.x+rnd(-3,3)*uf(e),feet(e)+rnd(-1,1),{s:Math.max(0.7,uf(e)),tint:k.acc});}}
    if(walking&&(w.ox||w.oy)){const dl=Math.hypot(w.ox,w.oy),st=Math.max(8,k.sp*T*0.8)*dt;if(dl<=st){w.ox=0;w.oy=0;}else{w.ox-=w.ox/dl*st;w.oy-=w.oy/dl*st;}}}
  place(e);
}
function director(dt){
  if(!OPT.auto)return;const id=mapId(),nR=enemies.length||1,tot=count();
  for(const r of enemies){r.timer-=dt;if(r.timer>0)continue;r.timer=rnd(0.9,1.9)*Math.sqrt(nR);if(tot>=OPT.cap||r.list.length>=Math.ceil(OPT.cap/nR)+2)continue;
    const kind=pickKind();if(kind==='shard'){const n=3+Math.floor(Math.random()*3);for(let i=0;i<n;i++)spawn(r,'shard',rnd(0,1.2));}else spawn(r,kind,0);}
  if(BOSS[id]){if(bossAlive())WX.bossT=Math.max(WX.bossT,26);else{WX.bossT-=dt;if(WX.bossT<=0){WX.bossT=26;const r=enemies[WX.spawnN++%nR];spawn(r,BOSS[id],0);if(e2Escort(id))for(let i=0;i<5;i++)spawn(r,'shard',rnd(0.4,2.2));}}}
}
function e2Escort(id){return id===1;}
function update(dt,M){
  WX.t+=dt;
  if(WX.timers.length){for(const t of WX.timers)t.t-=dt;const due=WX.timers.filter(t=>t.t<=0);WX.timers=WX.timers.filter(t=>t.t>0);for(const t of due)t.fn();}
  director(dt);
  if(HAS_TW)for(const tw of towers)if(tw.wxRuin>0){tw.wxRuin-=dt;if(tw.wxRuin<=0){const g=twPt(tw,0,0);FX.rings.push({x:g[0],y:g[1],r0:4,r1:24,life:0,max:0.45,c:'140,230,170'});}}
  for(const r of enemies){for(let i=0;i<r.list.length;i++){const e=r.list[i];if(e.dead)continue;
    if(!e.w){const o=mkUnit({1:'standard',2:'tiger',3:'healer',4:'lens',5:'ultimate'}[e.t]||'standard',e.d);for(const key in o)if(e[key]===undefined)e[key]=o[key];e.w.r=r;e.w.L=r.cells.length-1;}
    upUnit(e,dt);}}
  /* vùng rễ của Cây Sáp Mẹ */
  for(const b of liveEnemies())if(b.k==='mother'){b.w.aura=(b.w.aura||0)+dt;if(b.w.aura>=0.4){b.w.aura-=0.4;healTick(b,62,b.w.act&&b.w.act.pulse?3.5:1.2,false);}}
  for(const r of enemies)r.list=r.list.filter(e=>!e.dead);
  /* hiệu ứng */
  for(const key of ['g','o']){const L=WX[key];let n=0;for(const p of L){p.t+=dt;if(p.t<p.dur&&!(p.o.on&&p.o.on.dead&&p.o.loop))L[n++]=p;}L.length=n;}
  WX.corpses=WX.corpses.filter(c=>(c.t+=dt)<c.dur);
  WX.trails=WX.trails.filter(tr=>{tr.t+=dt;if(tr.t<tr.dur)return true;const b=tr.boss;if(b&&!b.dead&&canHeal(b)){b.hp=Math.min(b.max,b.hp+b.max*0.02);vfxOn(b,'ultimate_regen',0,0,{s:2});}return false;});
  if(WX.edge){WX.edge.t+=dt;if(WX.edge.t>=WX.edge.n*WX.edge.per)WX.edge=null;}
}

/* ---- sát thương, chết ---- */
function reflect(e,src,big){const w=e.w;if(WX.t-w.lastRef<0.14)return;w.lastRef=WX.t;let sx=e.x,sy=e.y-60;
  if(src.tw&&HAS_TW){const h=twHead(src.tw);sx=h[0];sy=h[1];}else if(typeof wallGuns!=='undefined'){let bd=1e9;for(const g of wallGuns){const d=Math.hypot(g.x-e.x,g.y-e.y);if(d<bd){bd=d;sx=g.x;sy=g.y-6;}}}
  const q=body(e),ang=Math.atan2(sy-q[1],sx-q[0]);vfx('mirror_reflect',q[0],q[1],{s:big?1.5:1,rot:ang});
  FX.shots.push({k:'tracer',x0:q[0],y0:q[1],x1:sx+rnd(-3,3),y1:sy+rnd(-3,3),life:0,max:0.09});
  if(WX.t-(w.lastGl||-9)>1.1){w.lastGl=WX.t;vfxOn(e,'prism_mirror_glint',0,U_(e.k).h*0.5,{s:uf(e)*0.8});}}
const damage0=damage;
damage=function(e,a,o){
  if(!e||e.dead)return;const w=e.w;if(!w)return damage0(e,a,o);
  const src=CUR.src,single=!!(src&&src.single);let mult=1;
  if(single){
    if(e.k==='mirror'){mult=0.45;reflect(e,src,false);}
    else if(e.k==='prism'){mult=0.6;reflect(e,src,true);}
    else if((e.k==='crab'||e.k==='mother')&&!(e.sol>0)){mult=0.5;if(e.k==='mother'&&!w.act&&!(w.cd.bark>WX.t)){w.cd.bark=WX.t+7;w.queue.push('bark');}}}
  if(w.core>0)mult*=2;if(w.heart)mult*=0.15;
  const dealt=a*mult;damage0(e,dealt,o);
  if(e.dead)return;
  if(K[e.k].boss&&w.th.length){while(w.th.length&&e.hp/e.max<=w.th[0][0])w.queue.push(w.th.shift()[1]);}
  if(a<1.5)return;
  const t=WX.t,k=K[e.k];
  if(t-w.lastSplash>0.13){w.lastSplash=t;const q=body(e),s=k.small?0.55:k.boss?1.5:uf(e),x=q[0]+rnd(-3,3)*s,y=q[1]+rnd(-3,3)*s;
    if(a>=2.5)vfx('hit_splash',x,y,{s:s,tint:k.acc,rot:rnd(0,6.28)});vfx('hit_flash',x,y,{s:s});}
  if(e.k==='pod'||w.act||e.frozen>0||(e.net>0&&!heavy(e)))return;
  const cd=k.boss?2.6:1.1;if(t-w.lastHit>cd&&(a>=8||Math.random()<0.6)){w.lastHit=t;const A=U_(e.k).anims.hit;w.hitT=A.n/A.fps;}
};
function onDeath(e,killed){
  const w=e.w,k=K[e.k],fy=feet(e),s=k.small?0.5:k.boss?2:uf(e);
  if(e.k==='pod'){if(killed){const q=body(e);vfx('hit_splash',q[0],q[1],{s:0.8,tint:k.acc});}return;}
  const A=U_(e.k).anims.die;WX.corpses.push({k:e.k,x:e.x,y:fy,face:w.face,t:0,dur:A.n/A.fps+0.05});
  vfx('death_melt',e.x,fy+1,{s:s,tint:k.acc});
  if(killed){vfx(Math.random()<0.22||k.boss?'drop_specimen':'drop_resource',e.x,fy-uh(e)*0.35,{s:k.boss?1.6:1,dur:0.5});
    if(k.boss){shake=Math.max(shake,0.5);for(let i=0;i<5;i++)after(0.08*i,()=>vfx('drop_resource',e.x+rnd(-18,18),fy-rnd(4,26),{s:1.1}));}
    if(e.k==='spore'&&!CUR.noSplit&&canHeal(e)){const q=body(e);vfx('spore_burst',q[0],q[1],{s:1});
      const r=w.r,d=e.d,jx=e.jx,jy=e.jy,ox=w.ox,oy=w.oy;after(0.3,()=>{if(!enemies.includes(r))return;for(const deg of [150,30,270]){const a=deg*Math.PI/180,rr=40*WS();spawn(r,'shard',d,{jx:jx,jy:jy,ox:ox+Math.cos(a)*rr,oy:oy-Math.sin(a)*rr*0.7});}});}
    for(const b of liveEnemies())if(b.k==='myriad'&&b!==e&&canHeal(b)&&dist(b,e)<115){WX.trails.push({x:e.x,y:fy-2,boss:b,t:0,dur:1.1});if(!b.w.act&&!(b.w.cd.abs>WX.t)){b.w.cd.abs=WX.t+5;SK.absorb(b,false);}}}
}
const kill0=kill;
kill=function(e){if(!e||e.dead)return;kill0(e);if(e.w&&e.x!==undefined)onDeath(e,true);};

/* ---- vẽ quái ---- */
const FROST={};
function frostFrame(kind,A,f){const key=kind+A.r+'_'+f;if(FROST[key])return FROST[key];const U=U_(kind),im=IMG[kind],c=document.createElement('canvas');c.width=c.height=U.ce;const x=c.getContext('2d');
  x.drawImage(im,f*U.ce,A.r*U.ce,U.ce,U.ce,0,0,U.ce,U.ce);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(150,214,255,0.46)';x.fillRect(0,0,U.ce,U.ce);return FROST[key]=c;}
function blit(c,kind,anim,frame,x,y,face,o){const U=U_(kind),im=IMG[kind];if(!U||!rdy(im))return false;const A=U.anims[anim]||U.anims.walk,f=Math.max(0,Math.min(A.n-1,frame|0)),w=U.cell*((o&&o.k)||WS());
  c.save();c.translate(x,y);if(face>0)c.scale(-1,1);if(o&&o.a!==undefined)c.globalAlpha=o.a;
  if(o&&o.frost)c.drawImage(frostFrame(kind,A,f),0,0,U.ce,U.ce,-w*U.px,-w*(1-U.py),w,w);
  else c.drawImage(im,f*U.ce,A.r*U.ce,U.ce,U.ce,-w*U.px,-w*(1-U.py),w,w);
  c.restore();return true;}
function pose(e){const w=e.w,U=U_(e.k);
  if(w.act)return [w.act.anim,actFrame(U,w.act)];
  if(w.hitT>0){const A=U.anims.hit;return ['hit',Math.min(A.n-1,Math.floor((A.n/A.fps-w.hitT)*A.fps))];}
  if(e.d>=w.L){const A=U.anims.attack;return ['attack',w.atkT<A.n/A.fps?Math.floor(w.atkT*A.fps):0];}
  const nm=w.heart&&U.anims.charge?'charge':'walk',A=U.anims[nm];return [nm,Math.floor(w.walkT*A.fps)%A.n];}
const drawEnemy0=drawEnemy;
drawEnemy=function(e,now){
  const w=e.w;if(!w)return drawEnemy0(e,now);
  const t=WX.t,fy=feet(e),f=uf(e);
  if(e.k==='pod'){drawV('tree_seed_pod_blink',Math.floor(w.blink||0)%4,e.x,fy,{s:1});return;}
  if(!rdy(IMG[e.k]))return drawEnemy0(e,now);
  const p=pose(e),a=w.act,z=a&&a.z||0;
  blit(ctx,e.k,p[0],p[1],e.x,fy-z,w.face,e.frozen>0?{frost:1}:null);
  /* lớp phủ gắn với quái */
  if(a){
    if(a.glow!==undefined&&a.warn){const q=pt(e,0,108);drawV('primordial_crack_glow',Math.floor(a.glow)%8,q[0],q[1],{s:1,a:Math.min(1,0.45+a.t/3)});}
    if(a.heartOn){const q=pt(e,36,172);drawV('myriad_heart_glow',vframe(D.vfx.myriad_heart_glow,t,true),q[0],q[1],{s:1,a:Math.min(1,a.t)});}
  }
  if(w.heart){const q=pt(e,36,172);drawV('myriad_heart_glow',vframe(D.vfx.myriad_heart_glow,t,true),q[0],q[1],{s:1});}
  if(w.core>0){const q=pt(e,0,84);drawV('prism_core_glow',vframe(D.vfx.prism_core_glow,t,true),q[0],q[1],{s:0.85,a:0.9});}
  if(e.sol>0){drawV('status_solvent',vframe(D.vfx.status_solvent,t+e.ph,true),e.x,fy,{s:f});
    if(e.k==='crab'||e.k==='mother')drawV('crab_shell_soften',vframe(D.vfx.crab_shell_soften,t,true),e.x,fy,{s:f,tint:e.k==='mother'?'#b08050':null});}
  else if(w.barkT>0)drawV('crab_shell_soften',vframe(D.vfx.crab_shell_soften,t,true),e.x,fy,{s:f,a:Math.min(1,w.barkT)});
  if(e.burn>0)drawV('status_burning',vframe(D.vfx.status_burning,t+e.ph,true),e.x,fy,{s:f});
  if(e.frozen>0)drawV('status_frozen',vframe(D.vfx.status_frozen,t,true),e.x,fy,{s:f});
  if(e.net>0&&!heavy(e))drawV('status_netted',vframe(D.vfx.status_netted,t,true),e.x,fy,{s:f});
  if(w.regen>0)drawV('heal_sparkle',vframe(D.vfx.heal_sparkle,t+e.ph,true),e.x,fy-uh(e)*0.25,{s:Math.max(0.8,f),a:Math.min(1,w.regen*3)});
  if(e.lure>0&&typeof drawVfx==='function')drawVfx('heat_lure',Math.floor(now/250)%2,e.x,fy-uh(e)-9,{s:0.42});
};

/* ---- lớp mặt đất ---- */
function drawGround(){
  const t=WX.t;
  /* vòng, vạch cảnh báo */
  for(const e of liveEnemies()){const w=e.w;if(!w)continue;const a=w.act,fy=feet(e);
    if(e.k==='mother')drawV('tree_root_ring',vframe(D.vfx.tree_root_ring,t,true),e.x,fy,{s:ringS(62,352),a:a&&a.pulse?1:0.72});
    if(a){
      if(a.ring)drawV(a.ring[0],vframe(D.vfx[a.ring[0]],a.t,true),e.x,fy,{s:ringS(a.ring[1],a.ring[2]),a:Math.min(1,a.t*4,(a.dur-a.t)*4)});
      if(a.line){drawBeam('tiger_pounce_line',vframe(D.vfx.tiger_pounce_line,t,true),a.line,{s:1,a:0.9});const q=a.line[a.line.length-1];drawV('tiger_pounce_marker',Math.floor(a.mk)%8,q[0],q[1],{s:1});}
      if(a.marker&&a.tws)for(const tw of a.tws){const g=twPt(tw,0,0);drawV('prism_target_marker',vframe(D.vfx.prism_target_marker,t,true),g[0],g[1]+2,{s:1.5});}
    }}
  drawFxList(WX.g);
  /* trạng thái dưới chân + bóng */
  for(const e of liveEnemies()){const w=e.w;if(!w)continue;const fy=feet(e),f=uf(e),hv=heavy(e);
    if(w.tar>0)drawV('status_tar',vframe(D.vfx.status_tar,t+e.ph,true),e.x,fy,{s:f*1.1});
    if((e.slow>0||(e.net>0&&hv))&&e.frozen<=0)drawV('status_slowed',vframe(D.vfx.status_slowed,t+e.ph,true),e.x,fy,{s:f*1.1});
    const z=w.act&&w.act.z||0,hw=e.k==='pod'?26:U_(e.k).h*0.95;drawV('shadow_blob',0,e.x,fy+0.5,{sx:hw/128*(1-z/40),sy:hw/128*0.8*(1-z/40),a:e.k==='pod'?0.5:0.3});}
  for(const c of WX.corpses){const A=U_(c.k).anims.die;blit(ctx,c.k,'die',Math.min(A.n-1,Math.floor(c.t*A.fps)),c.x,c.y,c.face);}
}
/* ---- lớp trên: hiệu ứng rời, tia, biểu tượng, viền màn hình ---- */
const BAD=['burning','frozen','solvent','netted','slowed','tar','haste','regen'];
function drawOver(now){
  const t=WX.t,live=liveEnemies();
  for(const tr of WX.trails){if(tr.t<0||!tr.boss||tr.boss.dead)continue;const q=body(tr.boss),p=tr.t/tr.dur;
    drawBeam('myriad_absorb_trail',vframe(D.vfx.myriad_absorb_trail,t,true),[[tr.x,tr.y],q],{s:1,a:Math.min(1,p*5,(1-p)*4)});}
  for(const e of live){const a=e.w&&e.w.act;if(!a||!a.beam||!a.tws||a.charge<=0)continue;const p=a.charge/5,o=pt(e,a.from[0],a.from[1]);
    for(const tw of a.tws){const g=twPt(tw,0,26);drawBeam(a.beam,vframe(D.vfx[a.beam],t,true),[o,g],{s:1,sy:0.4+0.6*p,a:0.55+0.45*p});
      drawV('lens_beam_hit',vframe(D.vfx.lens_beam_hit,t,true),g[0],g[1],{s:(0.7+0.5*p)*(a.beam==='lens_beam'?1:1.5)});}}
  drawFxList(WX.o);
  /* thanh máu, huy hiệu trạng thái, thanh nạp */
  const BS=0.26;ctx.textAlign='center';
  for(const e of live){const w=e.w;if(!w)continue;const k=K[e.k],hv=heavy(e),top=feet(e)-uh(e)*0.94-2;let y=top;
    if(e.k!=='pod'&&(e.hp<e.max||OPT.bars||k.boss)){const bw=Math.max(12,Math.min(44,U_(e.k).h*WS()*0.9)),bx=e.x-bw/2,r=Math.max(0,e.hp/e.max);
      ctx.fillStyle='#120e1c';ctx.fillRect(bx-1,y-4,bw+2,4);ctx.fillStyle=r>0.4?'#ffcf5a':'#ff6a52';ctx.fillRect(bx,y-3,Math.max(1,bw*r),2);y-=6;}
    const a=w.act;
    if(a&&a.bar){drawV('lens_charge_bar',Math.round(a.charge/5*20),e.x,y,{k:0.3});y-=9;}
    const bs=[];if(e.burn>0)bs.push(0);if(e.frozen>0)bs.push(1);if(e.sol>0)bs.push(2);if(e.net>0&&!hv)bs.push(3);if((e.slow>0||(e.net>0&&hv))&&e.frozen<=0)bs.push(4);if(w.tar>0)bs.push(5);if(w.haste>0)bs.push(6);if(w.regen>0)bs.push(7);
    if(bs.length){const sz=40*BS,x0=e.x-(bs.length-1)*sz/2;for(let i=0;i<bs.length;i++)drawV('status_icons',ICON_F[BAD[bs[i]]],x0+i*sz,y,{k:BS});y-=sz+1;}
    if(a&&a.warn&&Math.floor(t*6)%2===0){ctx.font='900 11px system-ui,sans-serif';ctx.lineWidth=2.5;ctx.strokeStyle='#1a0a08';ctx.strokeText('!',e.x,y-1);ctx.fillStyle='#ff5a3c';ctx.fillText('!',e.x,y-1);y-=11;}
    if(OPT.names){ctx.font='600 6px system-ui,sans-serif';ctx.lineWidth=2;ctx.strokeStyle='rgba(10,8,18,0.85)';ctx.strokeText(k.vn,e.x,y-1);ctx.fillStyle='#fff2cf';ctx.fillText(k.vn,e.x,y-1);}}
  if(HAS_TW&&S.towers)for(const tw of towers)if(tw.wxRuin>0){const g=twPt(tw,0,34),s='Dựng lại '+Math.ceil(tw.wxRuin)+'s';ctx.font='700 6px system-ui,sans-serif';ctx.lineWidth=2;ctx.strokeStyle='rgba(10,8,18,0.85)';ctx.strokeText(s,g[0],g[1]);ctx.fillStyle='#ffd98f';ctx.fillText(s,g[0],g[1]);}
  ctx.textAlign='start';
  if(WX.edge){const E=WX.edge,ph=(E.t%E.per)/E.per,al=Math.sin(Math.PI*ph)*0.9,v=D.vfx.screen_edge_pulse,im=VIMG.screen_edge_pulse;
    if(rdy(im)){const col=E.col==='255,60,40'?null:'rgb('+E.col+')';ctx.save();ctx.globalAlpha=al;ctx.drawImage(col?tinted('screen_edge_pulse',col):im,0,0,v.we,v.he,-8,-8,W*T+16,H*T+16);ctx.restore();}}
  updHud();
}

/* ---- móc vào prototype ---- */
const drawGroundFX0=drawGroundFX;drawGroundFX=function(){drawGroundFX0.apply(this,arguments);try{drawGround();}catch(err){oops(err);}};
const drawAirFX0=drawAirFX;drawAirFX=function(now){drawAirFX0.apply(this,arguments);try{drawOver(now);}catch(err){oops(err);}};
let oopsN=0;function oops(err){if(oopsN++<5)console.error('[wax]',err);}
updateEnemies=function(dt,M){try{update(dt,M);}catch(err){oops(err);}};
newEnemy=function(M,d){return mkUnit(pickKind(),d);};
function seed(){
  const M=MAPS[S.map];WX.corpses=[];WX.g=[];WX.o=[];WX.trails=[];WX.timers=[];WX.edge=null;WX.bossT=14;
  enemies=M.routes.map((cells,ri)=>{const r={cells:cells,list:[],timer:0.5+ri*0.4},L=cells.length-1;
    for(let k=0;k<5;k++){let kind=pickKind();if(kind==='shard'&&k%2)kind='standard';spawn(r,kind,L*(0.08+k*0.16));}return r;});
}
seedEnemies=function(){try{seed();}catch(err){oops(err);}};
const resetFX0=resetFX;resetFX=function(){resetFX0.apply(this,arguments);WX.corpses=[];WX.g=[];WX.o=[];WX.trails=[];WX.timers=[];WX.edge=null;};
const selectMap0=selectMap;selectMap=function(i,push){selectMap0.apply(this,arguments);try{buildBossRow();updHud(true);}catch(err){oops(err);}};
if(typeof drawTower==='function'&&HAS_TW){const drawTower0=drawTower;drawTower=function(c,X,Y,type,aim,an,now,ruined,tier){
  if(c===ctx&&!ruined)for(const tw of towers)if(tw.wxRuin>0&&tw.x*T===X&&tw.y*T===Y){ruined=true;break;}
  return drawTower0.call(this,c,X,Y,type,aim,an,now,ruined,tier);};}
if(typeof TWB!=='undefined')for(const key of Object.keys(TWB)){const f=TWB[key];TWB[key]=function(tw){
  if(tw.wxRuin>0){tw.ph='idle';tw.pt=0;tw.cone=0;tw.beam=false;return;}
  CUR.src=key==='mg'?{single:true,tw:tw}:null;try{return f.apply(this,arguments);}finally{CUR.src=null;}};}
if(typeof updateWallGuns==='function'){const updateWallGuns0=updateWallGuns;updateWallGuns=function(){CUR.src={single:true,wall:true};try{return updateWallGuns0.apply(this,arguments);}finally{CUR.src=null;}};}

/* ================= thanh máu trùm + bảng kiểm tra ================= */
const $id=id=>document.getElementById(id);
function el(tag,cls,html){const x=document.createElement(tag);if(cls)x.className=cls;if(html!==undefined)x.innerHTML=html;return x;}
const box=$id('box')||document.body;
const hud=el('div','wx-boss');hud.hidden=true;hud.innerHTML='<b></b><span class="wx-bar"><i></i><u style="left:66%"></u><u style="left:50%"></u><u style="left:33%"></u><u style="left:10%"></u></span><em></em>';box.appendChild(hud);
let hudKey='';
function updHud(force){const b=S.mode==='day'?bossAlive():null,a=b&&b.w.act;
  const key=b?b.k+'|'+Math.round(b.hp/b.max*200)+'|'+(a?a.anim:'')+(b.w.heart?'h':''):'';if(key===hudKey&&!force)return;hudKey=key;hud.hidden=!b;if(!b)return;
  hud.children[0].textContent=K[b.k].vn;hud.children[1].firstChild.style.width=Math.max(0,b.hp/b.max*100).toFixed(1)+'%';
  const nm={shed:'Bong tróc',crouch:'Sắp vồ!',pounce:'Vồ',roar:'Gọi bầy',headbutt:'Húc tường',roots:'Rễ nuôi',seed:'Gieo hạt',bark:'Vỏ cây',focus:'Hội tụ',multi_focus:'Hội tụ đa điểm',open_core:'Mở lõi: sát thương ×2',mirror_skin:'Da gương',absorb:'Hấp thụ',scream:'Vạn người',last_heart:'Trái tim cuối cùng'};
  hud.children[2].textContent=a&&nm[a.anim]?nm[a.anim]:(b.w.heart?'Trái tim cuối cùng: vỏ cứng':Math.ceil(b.hp)+' / '+b.max);}

const routeAt=()=>enemies[WX.spawnN++%(enemies.length||1)];
function dbgSpawn(kind,n,frac){toDay();const out=[];for(let i=0;i<(n||1);i++){const r=routeAt(),L=r.cells.length-1,e=spawn(r,kind,L*(frac===undefined?rnd(0.28,0.42):frac));
  vfx(STEP[mapId()]||'step_dust',e.x,feet(e),{s:K[kind].boss?2.2:1.2});out.push(e);}return out;}
function theBoss(){return bossAlive()||dbgSpawn(BOSS[mapId()]||'primordial',1,0.3)[0];}
function force(e,name){const w=e.w;if(w.act){w.act=null;w.core=0;w.lockFace=false;}w.hitT=0;if(e.frozen>0)e.frozen=0;if(e.net>0)e.net=0;
  if(name==='pounce'&&e.d>=w.L-2)e.d=Math.max(0,w.L-12);
  if(name==='headbutt')w.rammed=1;
  if(SK[name](e)===false)say('Không dùng được lúc này (cần tháp ở gần / còn đường phía trước).');}
function dNear(r,tw){const g=twPt(tw,0,0),L=r.cells.length-1;let bd=1e9,best=0;for(let d=1;d<L-1;d+=0.5){const p=pos(r.cells,d),q=Math.hypot(p[0]-g[0],p[1]-g[1]);if(q<bd){bd=q;best=d;}}return [best,bd];}
const UNIT_SK={
  heal(){let hs=liveEnemies().filter(e=>e.k==='healer');if(!hs.length){hs=dbgSpawn('healer',1);const h=hs[0];for(let i=0;i<3;i++){const s=spawn(h.w.r,'standard',h.d+rnd(-0.8,0.8));s.hp=s.max*0.4;}}
    for(const h of hs){h.burn=0;h.sol=0;force(h,'heal');}},
  focus(){toDay();if(!HAS_TW||!S.towers||!towers.length){say('Bật "Công trình" để có tháp cho Sáp thấu kính hội tụ.');return;}
    let best=null;for(const r of enemies)for(const tw of towers){if(tw.wxRuin>0)continue;const q=dNear(r,tw);if(!best||q[1]<best[2])best=[r,tw,q[1],q[0]];}
    if(!best){say('Mọi tháp đang bị phá, chờ dựng lại.');return;}const e=spawn(best[0],'lens',best[3]);SK.focus(e,best[1]);},
  howl(){let fs=liveEnemies().filter(e=>e.k==='frenzy');if(!fs.length){fs=dbgSpawn('frenzy',1);for(let i=0;i<4;i++)spawn(fs[0].w.r,'standard',fs[0].d+rnd(-1,1));}for(const f of fs)force(f,'howl');},
  selfheal(){let us=liveEnemies().filter(e=>e.k==='ultimate');if(!us.length)us=dbgSpawn('ultimate',1);for(const u of us){u.hp=Math.min(u.hp,u.max*0.45);u.burn=0;u.sol=0;force(u,'selfheal');}},
  spore(){let ss=liveEnemies().filter(e=>e.k==='spore');if(!ss.length){ss=dbgSpawn('spore',2);after(0.9,()=>{for(const s of ss)if(!s.dead){s.burn=0;s.sol=0;kill(s);}});}else for(const s of ss){s.burn=0;s.sol=0;kill(s);}},
  mirror(){let ms=liveEnemies().filter(e=>e.k==='mirror');if(!ms.length)ms=dbgSpawn('mirror',2);for(const m of ms){let tw=HAS_TW?nearTower(m,1e9):null;m.w.lastRef=-9;reflect(m,tw?{tw:tw}:{},false);}}
};
function dbgBoss(name){toDay();const b=theBoss();if(K[b.k].boss&&SK[name])force(b,name);}
function targets(){const live=liveEnemies().filter(e=>e.w&&e.k!=='pod');if(OPT.all||!WX.mouse)return live;const m=WX.mouse;return live.sort((a,b)=>Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y)).slice(0,8);}
const STAT={burn:e=>{e.burn=4.5;},frozen:e=>{e.frozen=3.2;e.frozenMax=3.2;},sol:e=>{e.sol=4.5;},net:e=>{e.net=3.2;e.netMax=3.2;},slow:e=>{e.slow=4.5;},tar:e=>{e.w.tar=4.5;},haste:e=>{e.w.haste=5;},regen:e=>{e.w.regen=4;e.hp=Math.min(e.max,e.hp+e.max*0.3);},
  hurt:e=>{CUR.src=null;damage(e,Math.max(3,e.max*0.2));},
  clear:e=>{e.burn=e.frozen=e.sol=e.net=e.slow=e.lure=0;e.shatter=false;e.w.tar=e.w.haste=e.w.regen=0;}};
function dbgStatus(name){toDay();const ts=targets();if(!ts.length){say('Chưa có quái nào trên bản đồ.');return;}for(const e of ts)if(!e.dead)STAT[name](e);}
function killAll(){CUR.noSplit=true;try{for(const e of liveEnemies())kill(e);}finally{CUR.noSplit=false;}WX.timers=[];}
function setSpeed(v){if(v===0){S.paused=!S.paused;}else{S.paused=false;S.speed=v;}
  const p=$id('g-pause');if(p){p.setAttribute('aria-pressed',!!S.paused);p.textContent=S.paused?'▶':'II';}
  for(const [id,x] of [['g-x1',1],['g-x2',2]]){const b=$id(id);if(b)b.setAttribute('aria-pressed',(S.speed||1)===x);}syncSpeed();}
function syncSpeed(){panel.querySelectorAll('[data-sp]').forEach(b=>{const v=+b.dataset.sp;b.setAttribute('aria-pressed',v===0?!!S.paused:(!S.paused&&(S.speed||1)===v));});}
let sayT=0;function say(s){const m=$id('wx-msg');if(!m)return;m.textContent=s;m.hidden=false;clearTimeout(sayT);sayT=setTimeout(()=>{m.hidden=true;},3600);}

const panel=el('aside','wx-panel');panel.id='wx-panel';panel.setAttribute('aria-label','Bảng kiểm tra Dị Thể Sáp');
panel.innerHTML=
 '<button type="button" class="wx-head" id="wx-toggle" aria-expanded="true" title="Thu gọn / mở bảng (phím Q)"><b>Kiểm tra Dị Thể Sáp</b><span id="wx-stat"></span><i>▾</i></button>'+
 '<div class="wx-body">'+
 '<div class="wx-row"><span class="wx-lbl">Tốc độ</span><button data-sp="0" title="Tạm dừng">II</button><button data-sp="0.25">×¼</button><button data-sp="0.5">×½</button><button data-sp="1">×1</button><button data-sp="2">×2</button></div>'+
 '<div class="wx-row"><button id="wx-gal" class="wx-wide" title="Xếp hàng 16 con, chạy lần lượt mọi animation (phím G)">Bộ sưu tập</button><button id="wx-kill" class="wx-wide wx-danger">Diệt hết</button></div>'+
 '<h4>Sinh quái <small>(bấm = 1 con, Shift = 5 con)</small></h4><div class="wx-grid" id="wx-units"></div>'+
 '<h4>Trùm của bản đồ này</h4><div class="wx-row" id="wx-boss-row"></div>'+
 '<h4>Kỹ năng quái thường</h4><div class="wx-row">'+
   '<button data-us="heal" title="Sáp hồi phục đứng yên, vòng hồi máu, đồng loại hồi máu">Hồi máu</button><button data-us="focus" title="Sáp thấu kính tới cạnh tháp gần nhất, nạp 5 giây rồi phá tháp">Hội tụ</button><button data-us="howl" title="Sáp kích động gào, đồng loại quanh nó tăng tốc">Gào</button>'+
   '<button data-us="selfheal" title="Sáp tối thượng tự hồi máu">Tự hồi</button><button data-us="spore" title="Sáp bào tử chết, vỡ thành 3 Sáp vụn">Vỡ bào tử</button><button data-us="mirror" title="Sáp gương phản đạn đơn mục tiêu">Phản đạn</button></div>'+
 '<h4>Trạng thái <label class="wx-chk"><input type="checkbox" id="wx-all"> mọi quái</label></h4><div class="wx-row">'+
   '<button data-st="burn">Cháy</button><button data-st="frozen">Đóng băng</button><button data-st="sol">Dung môi</button><button data-st="net">Lưới</button><button data-st="slow">Chậm</button><button data-st="tar">Hắc ín</button>'+
   '<button data-st="haste">Tăng tốc</button><button data-st="regen">Hồi máu</button><button data-st="hurt" title="Gây một đòn sát thương để xem animation trúng đòn">Trúng đòn</button><button data-st="clear">Xóa</button></div>'+
 '<h4>Tùy chọn</h4><div class="wx-opts">'+
   '<label class="wx-chk"><input type="checkbox" id="wx-auto"> Tự sinh quái theo bản đồ</label><label class="wx-chk"><input type="checkbox" id="wx-demo" title="Tắt: trùm chỉ dùng kỹ năng đúng theo ngưỡng máu / thời gian của GDD"> Trùm tự diễn mọi kỹ năng</label>'+
   '<label class="wx-chk"><input type="checkbox" id="wx-names"> Hiện tên quái</label><label class="wx-chk"><input type="checkbox" id="wx-bars"> Luôn hiện thanh máu</label><label class="wx-chk"><input type="checkbox" id="wx-dust"> Bụi bước chân</label>'+
   '<label class="wx-rng">Cỡ quái <input type="range" id="wx-scale" min="0.18" max="0.55" step="0.01"><output id="wx-scale-o"></output></label></div>'+
 '<p class="wx-msg" id="wx-msg" hidden></p>'+
 '</div>';
document.body.appendChild(panel);
function setOpen(o){panel.classList.toggle('wx-closed',!o);$id('wx-toggle').setAttribute('aria-expanded',o);try{localStorage.setItem('waxdbg-open',o?'1':'0');}catch(err){}}
let open0=window.innerWidth>=1500;try{const v=localStorage.getItem('waxdbg-open');if(v!==null)open0=v==='1';}catch(err){}
setOpen(open0);
$id('wx-toggle').onclick=()=>setOpen(panel.classList.contains('wx-closed'));
/* nút sinh quái có hình thu nhỏ */
const thumbs=[];
ORDER.forEach(kind=>{const b=el('button',K[kind].boss?'wx-unit wx-isboss':'wx-unit');b.type='button';b.title='Sinh '+K[kind].vn;const c=document.createElement('canvas');c.width=c.height=56;b.appendChild(c);b.appendChild(el('span','',K[kind].vn));
  b.onclick=ev=>{dbgSpawn(kind,ev.shiftKey?5:1,K[kind].boss?0.3:undefined);};$id('wx-units').appendChild(b);thumbs.push([kind,c,false]);});
function drawThumbs(){let left=0;for(const th of thumbs){if(th[2])continue;const U=U_(th[0]),im=IMG[th[0]];if(!rdy(im)){left++;continue;}th[2]=true;const x=th[1].getContext('2d'),s=Math.min(56/U.h*0.92,56/(U.cell*0.8)),w=U.cell*s;
  x.clearRect(0,0,56,56);x.drawImage(im,0,0,U.ce,U.ce,28-w*U.px,54-w*(1-U.py)+w*0.02,w,w);}if(left)setTimeout(drawThumbs,200);}
drawThumbs();
function buildBossRow(){const row=$id('wx-boss-row');if(!row)return;row.innerHTML='';const kind=BOSS[mapId()];if(!kind){row.textContent='Bản đồ này chưa có trùm.';return;}
  const b=el('button','wx-wide wx-isboss','Gọi '+K[kind].vn);b.type='button';b.onclick=()=>{dbgSpawn(kind,1,0.3);};row.appendChild(b);
  for(const sk of BOSS_SK[kind]){const s=el('button','',sk[1]);s.type='button';s.onclick=()=>dbgBoss(sk[0]);row.appendChild(s);}}
buildBossRow();
panel.querySelectorAll('[data-sp]').forEach(b=>{b.type='button';b.onclick=()=>setSpeed(+b.dataset.sp);});
panel.querySelectorAll('[data-us]').forEach(b=>{b.type='button';b.onclick=()=>{toDay();UNIT_SK[b.dataset.us]();};});
panel.querySelectorAll('[data-st]').forEach(b=>{b.type='button';b.onclick=()=>dbgStatus(b.dataset.st);});
$id('wx-kill').onclick=killAll;
for(const [id,key] of [['wx-auto','auto'],['wx-demo','demo'],['wx-names','names'],['wx-bars','bars'],['wx-dust','dust'],['wx-all','all']]){const c=$id(id);c.checked=OPT[key];c.onchange=()=>{OPT[key]=c.checked;saveOpt();};}
const sc=$id('wx-scale'),sco=$id('wx-scale-o');sc.value=OPT.scale;const scShow=()=>{sco.textContent=Math.round(OPT.scale/0.25*100)+'%';};scShow();sc.oninput=()=>{OPT.scale=+sc.value;scShow();saveOpt();};
for(const id of ['g-pause','g-x1','g-x2']){const b=$id(id);if(b)b.addEventListener('click',()=>setTimeout(syncSpeed,0));}
syncSpeed();
const cvEl=$id('map');if(cvEl){cvEl.addEventListener('mousemove',ev=>{const r=cvEl.getBoundingClientRect();WX.mouse={x:(ev.clientX-r.left)/r.width*W*T,y:(ev.clientY-r.top)/r.height*H*T};});}
window.addEventListener('keydown',ev=>{if(ev.target&&ev.target.closest&&ev.target.closest('input,textarea,select'))return;if(ev.ctrlKey||ev.metaKey||ev.altKey)return;
  if(ev.key==='q'||ev.key==='Q')setOpen(panel.classList.contains('wx-closed'));else if(ev.key==='g'||ev.key==='G')setGallery(!WX.gallery);});
/* dòng trạng thái: số quái, fps */
let fN=0,fT=performance.now();
(function stat(){requestAnimationFrame(stat);fN++;try{updHud();}catch(err){}const now=performance.now();if(now-fT>=500){WX.fps=Math.round(fN*1000/(now-fT));fN=0;fT=now;const s=$id('wx-stat');if(s)s.textContent=(S.mode==='day'?count()+' quái':'đang là đêm')+' · '+WX.fps+' fps';}})();

/* ================= bộ sưu tập: 16 con chạy lần lượt mọi animation, và mọi VFX ================= */
const gal=el('div','wx-gal');gal.hidden=true;
gal.innerHTML='<canvas width="1280" height="768"></canvas><div class="wx-galbar"><button type="button" data-gp="0" aria-pressed="true">Quái</button><button type="button" data-gp="1">Hiệu ứng</button><button type="button" data-gp="x" title="Đóng (phím G)">Đóng ✕</button></div>';
box.appendChild(gal);
const gcv=gal.firstChild,gx=gcv.getContext('2d');
gal.querySelectorAll('[data-gp]').forEach(b=>{b.onclick=()=>{if(b.dataset.gp==='x'){setGallery(false);return;}WX.gpage=+b.dataset.gp;gal.querySelectorAll('[data-gp]').forEach(o=>o.setAttribute('aria-pressed',o===b));};});
/* VFX đi kèm từng animation trong bộ sưu tập: [vfx, lớp g/o, dx, dy lên (px gốc), tỉ lệ, bắt đầu ở frame] */
const GV={attack:null,hit:[['hit_splash','o',0,.45,1,0],['hit_flash','o',0,.45,1,0]],die:[['death_melt','g',0,0,1,0]],
  heal:[['heal_ring','g',0,0,0.55,0],['heal_sparkle','o',0,.3,1,0]],focus:[['lens_beam_hit','o',8,.37,0.8,4]],howl:[['frenzy_howl','g',0,0,0.6,4]],selfheal:[['ultimate_regen','o',0,0,1.5,1]],
  shed:[['primordial_crack_glow','o',0,.5,1,0],['primordial_shed_burst','o',0,.5,1,4]],crouch:[['tiger_pounce_marker','g',-165,0,0.7,0]],pounce:[['tiger_land_dust','g',0,0,1,5]],headbutt:[['tiger_headbutt_impact','o',-110,.25,1,2]],roar:[['tiger_roar_ring','g',0,0,1.1,2]],
  seed:[['tree_seed_pod_blink','o',-120,0,1,3]],roots:[['tree_root_ring','g',0,0,0.75,0]],bark:[['crab_shell_soften','o',0,0,2,0]],
  multi_focus:[['prism_target_marker','g',-130,0,1,0]],open_core:[['prism_core_glow','o',0,.4,1.15,0]],mirror_skin:[['prism_mirror_glint','o',0,.5,1.6,2]],
  absorb:[['myriad_absorb_trail','o',-170,.3,1,0]],scream:[['myriad_scream_wave','g',0,0,0.7,1]],last_heart:[['myriad_heart_glow','o',36,.81,1.25,0]]};
GV['prism.focus']=[['prism_charge_beam','o',70,.83,1,0]];
function seqOf(kind){const U=U_(kind),out=[];let t=0;for(const nm in U.anims){const A=U.anims[nm],one=A.n/A.fps,dur=A.loop?Math.max(1.6,Math.ceil(1.6/one)*one):one+(nm==='die'?0.5:0.3);out.push([nm,t,dur]);t+=dur;}return [out,t];}
const SEQ={};for(const k of ORDER)SEQ[k]=seqOf(k);
const ANIM_VN={walk:'đi',attack:'đánh',hit:'trúng đòn',die:'tan chảy',heal:'hồi máu',focus:'hội tụ',howl:'gào',selfheal:'tự hồi',shed:'bong tróc',crouch:'cúi người',pounce:'vồ',headbutt:'húc tường',roar:'gọi bầy',seed:'gieo hạt',roots:'rễ nuôi',bark:'vỏ cây',multi_focus:'hội tụ đa điểm',open_core:'mở lõi',mirror_skin:'da gương',absorb:'hấp thụ',scream:'vạn người',last_heart:'trái tim cuối',charge:'lao tới'};
function galUnit(kind,x,y,k){const U=U_(kind),sq=SEQ[kind],tt=WX.gt%sq[1];let seg=sq[0][0];for(const s of sq[0])if(tt>=s[1])seg=s;
  const nm=seg[0],A=U.anims[nm],lt=tt-seg[1],fr=A.loop?Math.floor(lt*A.fps)%A.n:Math.min(A.n-1,Math.floor(lt*A.fps)),hh=U.h*k,sf=U.cell/128;
  const list=(GV[kind+'.'+nm]||GV[nm]||[]).slice();
  if(nm==='attack')list.push(['attack_'+K[kind].sw,'o',-U.cell*0.28,.42,K[kind].small?0.55:K[kind].boss?1.8:sf,A.imp-1],['attack_impact','o',-U.cell*0.42,.36,K[kind].small?0.6:K[kind].boss?1.6:1,A.imp]);
  const fxDraw=layer=>{for(const g of list){if(g[1]!==layer)continue;const v=D.vfx[g[0]],t0=lt-g[5]/A.fps;if(!v||t0<0)continue;const loop=!!v.loop||!v.fps;if(!loop&&t0>=v.n/v.fps)continue;
    const s=g[4]*((nm==='hit'||nm==='die')?(K[kind].small?0.5:K[kind].boss?2:sf):1);
    drawV(g[0],vframe(v,t0,loop),x+g[2]*k,y-(g[3]<=1?g[3]*hh:g[3]*k),{c:gx,k:k,s:s,tint:K[kind].acc,flip:g[0].indexOf('attack_s')===0});}};
  drawV('shadow_blob',0,x,y+1,{c:gx,k:k,sx:U.h*0.95/128,sy:U.h*0.76/128,a:0.3});
  fxDraw('g');
  if(nm==='die'&&lt>=A.n/A.fps){}else blit(gx,kind,nm,fr,x,y,-1,{k:k});
  fxDraw('o');
  gx.textAlign='center';gx.lineJoin='round';gx.lineWidth=4;gx.strokeStyle='rgba(10,8,18,0.8)';gx.font='700 16px "Baloo 2","Be Vietnam Pro",system-ui,sans-serif';gx.strokeText(K[kind].vn,x,y+24);gx.fillStyle='#ffe6b0';gx.fillText(K[kind].vn,x,y+24);
  const lb=(ANIM_VN[nm]||nm)+' · '+(fr+1)+'/'+A.n+' · '+A.fps+' fps';gx.font='500 12px "Be Vietnam Pro",system-ui,sans-serif';gx.lineWidth=3;gx.strokeText(lb,x,y+41);gx.fillStyle='#d6d7e8';gx.fillText(lb,x,y+41);}
function galBg(title){gx.setTransform(1,0,0,1,0,0);gx.imageSmoothingEnabled=true;
  if(typeof terrain!=='undefined'&&terrain)gx.drawImage(terrain,0,0,1280,768);else{gx.fillStyle='#2a3040';gx.fillRect(0,0,1280,768);}
  gx.fillStyle='rgba(12,12,24,0.5)';gx.fillRect(0,0,1280,768);
  gx.textAlign='left';gx.font='800 20px "Baloo 2","Be Vietnam Pro",system-ui,sans-serif';gx.fillStyle='#ffd98f';gx.fillText(title,20,34);}
function drawGallery(){
  if(WX.gpage===0){galBg('Bộ sưu tập Dị Thể Sáp · nền: '+MAPS[S.map].name);
    const rowA=['standard','shard','crab','tiger','cub','healer'],rowB=['spore','lens','mirror','ultimate','frenzy'],bo=ORDER.filter(k=>K[k].boss);
    rowA.forEach((kind,i)=>{galUnit(kind,120+i*208,212,1);});
    rowB.forEach((kind,i)=>{galUnit(kind,170+i*235,452,1);});
    bo.forEach((kind,i)=>{galUnit(kind,140+i*250,716,0.8);});}
  else{galBg('Mọi hiệu ứng (VFX) · tên file bỏ tiền tố vfx_');const names=Object.keys(D.vfx),cols=9,cw=1280/cols,rows=Math.ceil(names.length/cols),chh=(768-50)/rows;
    names.forEach((n,i)=>{const v=D.vfx[n],cx=(i%cols)*cw,cy=50+Math.floor(i/cols)*chh,k=Math.min((cw-14)/v.w,(chh-30)/v.h,1.1),one=v.fps?v.n/v.fps:1;
      let fr;if(!v.fps)fr=Math.floor(WX.gt*1.5)%v.n;else if(v.loop)fr=vframe(v,WX.gt,true);else{const lt=(WX.gt+i*0.07)%(one+0.25);fr=lt<one?vframe(v,lt,false):-1;}
      gx.fillStyle=i%2?'rgba(255,255,255,0.045)':'rgba(0,0,0,0.12)';gx.fillRect(cx+2,cy+2,cw-4,chh-4);
      if(fr>=0){const x0=cx+cw/2-v.w*k/2,y0=cy+(chh-22)/2-v.h*k/2+2;drawV(n,fr,x0+v.ax*k,y0+v.ay*k,{c:gx,k:k,tint:v.tint?'#f3d57c':null});}
      gx.textAlign='center';gx.font='500 10.5px "JetBrains Mono",ui-monospace,monospace';gx.fillStyle='#d8d6e6';gx.fillText(n.length>21?n.slice(0,20)+'…':n,cx+cw/2,cy+chh-9);});}
}
let gLast=0;
function galLoop(now){if(!WX.gallery)return;const rdt=Math.min(0.05,(now-gLast)/1000);gLast=now;WX.gt+=S.paused?0:rdt*(S.speed||1);try{drawGallery();}catch(err){oops(err);}requestAnimationFrame(galLoop);}
function setGallery(on){WX.gallery=!!on;gal.hidden=!on;const b=$id('wx-gal');if(b)b.setAttribute('aria-pressed',!!on);if(on){gLast=performance.now();requestAnimationFrame(galLoop);}}
$id('wx-gal').onclick=()=>setGallery(!WX.gallery);

/* gieo lại bằng quái mới (script chính đã gieo bằng quái cũ trước khi bản vá chạy) */
seedEnemies();
window.WAXDBG={WX:WX,OPT:OPT,K:K,SK:SK,spawn:dbgSpawn,boss:dbgBoss,unitSkill:n=>UNIT_SK[n](),status:dbgStatus,killAll:killAll,speed:setSpeed,gallery:setGallery,panel:setOpen,drawGallery:drawGallery,
  ready:()=>Object.keys(IMG).every(k=>rdy(IMG[k]))&&Object.keys(VIMG).every(k=>rdy(VIMG[k]))};
})();
