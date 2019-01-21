import $ from 'jquery';
import whatInput from 'what-input';
import week from './components/week/week';


window.$ = $;

//import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';


$(document).foundation();

$(document).ready(week);// инициализация модуля week


