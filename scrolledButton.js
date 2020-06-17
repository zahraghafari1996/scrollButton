
import React, { useEffect, useRef } from "react";
import { Button } from "@material-ui/core";
import arrowTop from "Assets/img/happyIcon.svg";

// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
const windowRequestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// main function
const scrollToY = (elementToScroll, scrollTargetY, speed, easing) => {
    // elementToScroll: the element to scroll
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    const scrollElement = elementToScroll || window,
        scrollY = scrollElement.scrollTop !== undefined ? scrollElement.scrollTop : scrollElement.scrollY,
        toScrollTargetY = scrollTargetY || 0,
        toSpeed = speed || 2000,
        toEasing = easing || 'easeOutSine';
    let currentTime = 0;

    // min time .1, max time .8 seconds
    const time = Math.max(.1, Math.min(Math.abs(scrollY - toScrollTargetY) / toSpeed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    const easingEquations = {
        easeOutSine: (pos) => {
            return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: (pos) => {
            return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInOutQuint: (pos) => {
            if ((pos /= 0.5) < 1) {
                return 0.5 * Math.pow(pos, 5);
            }
            return 0.5 * (Math.pow((pos - 2), 5) + 2);
        }
    };
    // add animation loop
    const tick = () => {
        currentTime += 1 / 60;

        const p = currentTime / time;
        const t = easingEquations[toEasing](p);

        if (p < 1) {
          windowRequestAnimFrame(tick);

          scrollElement.scrollTo(0, scrollY + ((toScrollTargetY - scrollY) * t));
        } else {
            scrollElement.scrollTo(0, toScrollTargetY);
        }
    };

    // call it once to get started
    tick();
}

const findParentScrollNode = (node) => {
  if(node.parentNode){
    if(node.parentNode.style && node.parentNode.style.overflow === 'scroll'){
       return node.parentNode;
    }
    return findParentScrollNode(node.parentNode);
  }
  return null;
}

export default function ScrollButton(props) {
  const { scrollDuration = 2000, scrollEasing = 'easeOutSine', componentRef } = props;
  const scrollElement = useRef();
  useEffect(() => {
    if(componentRef.current) {
      scrollElement.current = findParentScrollNode(componentRef.current);
    }
  }, [componentRef]);
  const scrollToTop = () => {
    if(scrollElement.current){
      scrollToY(scrollElement.current, 0, scrollDuration, scrollEasing);
    }
  };
  return (
    <Button
      title='Back to top'
      className='scrolledButton position-sticky'
      onClick={scrollToTop}
    >
      <img src={arrowTop} alt='positive' className='ml-2' />
    </Button>
  );
}
