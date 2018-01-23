import { Platform } from 'ionic-angular';
import { pointerCoord, PointerCoordinates } from 'ionic-angular/util/dom';
import { Renderer2 } from '@angular/core';

const MAX_DRAG_ANGLE = 40;
const DRAG_THRESHOLD = 20;

export class PanGesture {

  onMove: (delta: number) => void;

  onEnd: () => void;

  private initialCoords: PointerCoordinates;

  private leftThreshold: number = 0;

  private rightThreshold: number = 0;

  private shouldCapture: boolean;

  private isDragging: boolean;

  private lastPosX: number;

  private listeners: Function[] = [];

  constructor(
    private plt: Platform,
    private el: HTMLElement,
    private rnd: Renderer2
  ) {
    this.listeners.push(
      rnd.listen(el, 'mousedown', this._onStart.bind(this)),
      rnd.listen(el, 'touchstart', this._onStart.bind(this)),
      rnd.listen(el, 'touchmove', this._onMove.bind(this)),
      rnd.listen(el, 'mousemove', this._onMove.bind(this)),
      rnd.listen(el, 'touchend', this._onEnd.bind(this)),
      rnd.listen(el, 'mouseup', this._onEnd.bind(this))
    );
  }

  destroy() {
    this.listeners.forEach(fn => fn());
  }

  private _onStart(ev: TouchEvent) {
    const coords: PointerCoordinates = pointerCoord(ev),
      vw = this.plt.width();

    if (coords.x < this.leftThreshold || coords.x > vw - this.rightThreshold) {
      // ignore this gesture, it started in the side menu touch zone
      this.shouldCapture = false;
      return;
    }

    // the starting point looks good, let's see what happens when we move

    this.initialCoords = coords;
    this.lastPosX = coords.x;

  }

  private _onMove(ev: TouchEvent) {
    const coords: PointerCoordinates = pointerCoord(ev);

    if (!this.isDragging) {

      if (typeof this.shouldCapture !== 'boolean')
      // we haven't decided yet if we want to capture this gesture
        this.checkGesture(coords);


      if (this.shouldCapture === true)
      // gesture is good, let's capture all next onTouchMove events
        this.isDragging = true;
      else
        return;

    }

    // stop anything else from capturing these events, to make sure the content doesn't slide
    ev.stopPropagation();
    ev.preventDefault();

    // get delta X
    const deltaX: number = this.lastPosX - coords.x;

    // emit value
    this.onMove && this.onMove(deltaX);

    // update last X value
    this.lastPosX = coords.x;

  }

  private _onEnd() {
    if (this.shouldCapture === true) {
      this.onEnd && this.onEnd();
    }

    this.isDragging = false;
    this.shouldCapture = undefined;

  }

  private checkGesture(newCoords: PointerCoordinates) {
    const radians = MAX_DRAG_ANGLE * (Math.PI / 180),
      maxCosine = Math.cos(radians),
      deltaX = newCoords.x - this.initialCoords.x,
      deltaY = newCoords.y - this.initialCoords.y,
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance >= DRAG_THRESHOLD) {
      // swipe is long enough so far
      // lets check the angle
      const angle = Math.atan2(deltaY, deltaX),
        cosine = Math.cos(angle);

      this.shouldCapture = Math.abs(cosine) > maxCosine;
    }
  }

}
