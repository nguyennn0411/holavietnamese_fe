import { useEffect,useState } from 'react';
import { ArrowLeft,ArrowRight,X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BuffaloMascot } from './BuffaloMascot';
const STORAGE_KEY='hola-nghe-guide-completed';
export function MascotOnboarding(){
 const {t}=useTranslation('learner'); const [open,setOpen]=useState(false); const [step,setStep]=useState(0); const steps=t('mascot.guide.steps',{returnObjects:true});
 useEffect(()=>{if(window.localStorage.getItem(STORAGE_KEY)!=='1')setOpen(true)},[]);
 const close=()=>{window.localStorage.setItem(STORAGE_KEY,'1');setOpen(false)};
 if(!open||!Array.isArray(steps))return <button type="button" className="nghe-guide-replay" onClick={()=>{setStep(0);setOpen(true)}}><BuffaloMascot variant="welcome" size="tiny" animated />{t('mascot.guide.replay')}</button>;
 const item=steps[step]; return <div className="nghe-guide" role="dialog" aria-modal="true" aria-labelledby="nghe-guide-title"><div className="nghe-guide__card"><button className="nghe-guide__close" onClick={close} aria-label={t('mascot.guide.skip')}><X size={18}/></button><BuffaloMascot variant={item.variant||'teaching'} size="large" animated/><div><span>{t('mascot.guide.progress',{current:step+1,total:steps.length})}</span><h2 id="nghe-guide-title">{item.title}</h2><p>{item.text}</p><div className="nghe-guide__actions"><button onClick={close}>{t('mascot.guide.skip')}</button><span>{step>0&&<button onClick={()=>setStep(step-1)}><ArrowLeft size={15}/>{t('mascot.guide.back')}</button>}{step<steps.length-1?<button className="is-primary" onClick={()=>setStep(step+1)}>{t('mascot.guide.next')}<ArrowRight size={15}/></button>:<button className="is-primary" onClick={close}>{t('mascot.guide.finish')}</button>}</span></div></div></div></div>;
}
