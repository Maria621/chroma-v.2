import {timelineData} from '../../data/timeline.js';

export function initTimeline() {
  const widget = document.querySelector('.timeline-widget');
  if (!widget) return;
  const tabs = [...widget.querySelectorAll('[role="tab"]')];
  const panel = widget.querySelector('#tm-panel');
  const axis = widget.querySelector('.timeline-axis');
  if(!tabs.length || !panel) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current=0;
  const render = (value,focus=false, userAction=false) => {
    current=(value+timelineData.length)%timelineData.length;
    const d=timelineData[current];
    tabs.forEach((tab,i)=>{
      const active=i===current;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    panel.querySelector('.timeline-date').textContent=d.date;
    panel.querySelector('h3').textContent=d.title;
    panel.querySelector('.timeline-content p').textContent=d.description;
    panel.querySelector('.tm-counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(timelineData.length).padStart(2,'0')}`;
    const visual=panel.querySelector('.timeline-visual');
    const graphic=document.createElement('div');graphic.className='timeline-graphic';
    const span=document.createElement('span');
    d.graphic.forEach((part,i)=>{if (i)span.append(document.createElement('br'));span.append(document.createTextNode(part));});
    const year=document.createElement('strong');year.textContent=d.year;
    graphic.append(span,year);visual.replaceChildren(graphic);
    axis?.style.setProperty('--v33-progress',Math.round(current/(tabs.length-1)*100)+'%');
    const tab=tabs[current];
    if (userAction && matchMedia('(max-width:760px)').matches) tab.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
    if(focus)tab.focus();
  };
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>render(i,false,true));
    tab.addEventListener('keydown',e=>{
      const next={ArrowLeft:i-1,ArrowRight:i+1,Home:0,End:tabs.length-1}[e.key];
      if(next!==undefined){e.preventDefault();render(next,true,true)}
    });
  });
  panel.querySelector('.tm-prev')?.addEventListener('click',()=>render(current-1,false,true));
  panel.querySelector('.tm-next')?.addEventListener('click',()=>render(current+1,false,true));
  render(0);
}
