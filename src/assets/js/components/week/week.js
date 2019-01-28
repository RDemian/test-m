'use strict';

import $ from 'jquery';
import '../../lib/modernizr-custom';
import { isNull } from 'util';

/**
 * week module.
 * @module week
 */

export default function () {

    if (!Modernizr.contextmenu) {
        alert('Не поддерживает contextmenu!');
    } else {
        contextMenuFF();
    }

    var weekList = document.querySelector('.week__list');
    var weekItems = document.querySelectorAll('.week__item');
    var startContainer = null; // строка списка откуда забрали элемент
    var targetContainer = null; // целевой контейнер
    var moveElement = null; // перемещаемый элемент
    var replacedElement = null; // замещаемый элемент
        
    /* возвращает элемент родитель с заданным классом */
    function getParentElement(currentEl, needClass) {
        while (!(currentEl.classList.contains(needClass))) {
            currentEl = currentEl.parentElement;
            if(isNull(currentEl)) {
                break;
            }
        }
        return currentEl;
    }
    /* подключаем обработчики */
    
    weekList.addEventListener('dragstart' , onDragStart);
    weekList.addEventListener('dragleave' , onDragLeave);
    weekList.addEventListener('dragend' , onDragEnd);
    
    [].forEach.call(weekItems, (item) => {
        item.addEventListener('dragenter', onDragEnter);
        item.addEventListener('dragover', onDragOver);
        item.addEventListener('drop', onDragDrop);
    });
    
    function onDragStart(ev) {
        ev.dataTransfer.effectAllowed='move';
        startContainer = getParentElement(ev.target, 'week__item');
        moveElement = getParentElement(ev.target, 'week-card');
        moveElement.classList.add('drag-element');
        if (navigator.userAgent.search(/Firefox/) > 0) {
            ev.dataTransfer.setData('text/plain', 'ev.target');  
        }
        return true;
    }
    function onDragDrop(ev) {
        ev.preventDefault();
        targetContainer = getParentElement(ev.target, 'week__item');
        replacedElement = getParentElement(ev.target, 'week-card');
        startContainer.appendChild(replacedElement);
        replacedElement.classList.remove('color-animation');
        targetContainer.appendChild(moveElement);
        moveElement.classList.remove('drag-element');
        startContainer = targetContainer = moveElement = replacedElement = null;
        contextMenuFF();
    }
    function onDragEnter(ev) {
        ev.preventDefault();
        var hoverElement = getParentElement(ev.target, 'week-card');
        hoverElement.classList.add('color-animation');
        return true;
    }
    function onDragOver(ev) {
        ev.preventDefault();
    }
    function onDragLeave(ev) {
        ev.preventDefault();
        var leaveElement = getParentElement(ev.target, 'week-card');
        if (!isNull(leaveElement) && leaveElement.classList.contains('color-animation')) {
            leaveElement.classList.remove('color-animation');
        }
    }
    function onDragEnd(ev) {
        if (!isNull(moveElement) && moveElement.classList.contains('drag-element')) {
            moveElement.classList.remove('drag-element');
        }
    }

    // Контекстное меню мозила
    function contextMenuFF() {
        // Создаем меню:
        //var fragment = document.createDocumentFragment();
        $(".week-menu").empty();

        $('.week-card').each((i, el) => {
            var labelText = $(el).children('.week-card__title')[0].innerText;
            
            var cardPos = el.id;
            var index = cardPos.indexOf('-') + 1;
            cardPos = parseInt(cardPos.substring(index));
            
            if (!(cardPos == i)) {
                labelText = labelText + ' *';
            }

            var newItem = $('<menuitem>', {
                label: labelText
            })
            newItem.appendTo('.week-menu');
        });
    }

    // Контекстное меню
    
    // обработчик вызова контекстного меню
    $(weekList).mouseup(function(ev) {
        if (!Modernizr.contextmenu) {
            // отменяем вызов стандартного контекстного меню
            document.oncontextmenu = function() {return false;};
            // Удаляем предыдущее вызванное контекстное меню:
            $('.context-menu').remove();
            
            // Проверяем нажата ли правая кнопка мыши:
            if (event.which === 3)  {
                contextMenu(ev);
            }
        }
    });

    //Формирование меню
    function contextMenu(event) {
        // Создаем меню:
        var contextMenu = $('<div>', {
            class: 'context-menu'
        })
        .appendTo('body')
        .append( // Добавляем пункты меню:
            $('.week__list').clone().removeClass('week__list').addClass('context-menu__list')
        );
        //Проверяем помещается ли меню на экране
        var menuHeight = contextMenu[0].offsetHeight;
        var menuWidth = contextMenu[0].offsetWidth;
        var menuTop = event.pageY;
        var menuLeft = event.pageX;

        if (menuHeight + menuTop > document.body.clientHeight - 15) {
            menuTop = menuTop - menuHeight - 15;
        }
        if (menuWidth + menuLeft > document.body.clientWidth - 5) {
            menuLeft = menuLeft - menuWidth - 5;
        }

        contextMenu.css({
            left: menuLeft +'px',
            top: menuTop +'px'
        });
        //отображаем меню
        $('.context-menu .week__item').removeClass('week__item').addClass('context-menu__item');
        $('.context-menu .week-card').removeClass('week-card').addClass('context-menu__card');
        $('.context-menu .week-card__title').removeClass('week-card__title').addClass('context-menu__title');
        // помечаем элементы которые не на своем месте
        $('.context-menu__card').each((i, el) => {
            var cardPos = el.id;
            var index = cardPos.indexOf('-') + 1;
            cardPos = parseInt(cardPos.substring(index));
            
            if (!(cardPos == i)) {
                $(el).addClass('context-menu__card_mark');
            }
        });

        contextMenu.show();        
        
    }
    
};