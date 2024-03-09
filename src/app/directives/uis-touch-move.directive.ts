import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

export interface UisTouchMoveEndedEvent {
  container: HTMLElement;
  y: number;
}

@Directive({
  selector: '[uisMove]',
  standalone: true,
})
export class UisTouchMoveDirective {
  @Output() uisTouchMoveEnded = new EventEmitter<UisTouchMoveEndedEvent>();

  private _lastY: number | null = null;
  private _touchMoveStarted = false;

  @HostListener("touchmove", ["$event"]) onTouchMove(event: TouchEvent) {
    this._touchMoveStarted = true;
    const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
    if (!container) throw new Error('No container found');
    this._lastY = event.touches.item(0)?.clientY ?? null;
    container.style.position = 'absolute';
    container.style.top = `${this._lastY}px`;
  }

  @HostListener("touchend", ["$event"]) onTouchEnd(event: TouchEvent) {
    if (this._touchMoveStarted) {
      const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
      if (!container) throw new Error('No container found');
      if (this._lastY) this.uisTouchMoveEnded.emit({container, y: this._lastY});
    }
    this._touchMoveStarted = false;
  }

  constructor(private el: ElementRef<HTMLElement>) {
  }
}
