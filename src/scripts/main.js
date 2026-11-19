import {initNavigation} from './components/navigation.js';
import {initCarousel} from './components/carousel.js';
import {initTimeline} from './components/timeline.js';
import {initLightbox} from './components/lightbox.js';
import {initUnitActions} from './components/units.js';
import {initContactForm} from './components/contact.js';
import {initNews} from './components/news.js';

const start=()=>{
  initNavigation();initCarousel();initTimeline();initLightbox();
  initUnitActions();initContactForm();void initNews();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
