import $ from 'jquery';
import whatInput from 'what-input';
import slick from 'slick-carousel';
import accordion from './components/accordion/accordion';
window.$ = $;

//import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';


$(document).foundation();
//console.log(accordion);
accordion();
//$( document ).ready( accordion );
//$(accordion);

$('.js-slick-carousel').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
  })
