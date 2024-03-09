import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

export interface UisMoveEndedEvent {
  container: HTMLElement;
  y: number;
}

@Directive({
  selector: '[uisMove]',
  standalone: true,
})
export class UisMoveDirective {
  @Output() uisMoveEnded = new EventEmitter<UisMoveEndedEvent>();

  private _lastY: number | null = null;
  private _mouseMoveStarted = false;

  @HostListener("mousedown", ["$event"]) onMouseDown() {
    this._mouseMoveStarted = true;
  }

  @HostListener("mousemove", ["$event"]) onMouseMove(event: MouseEvent) {
    if (this._mouseMoveStarted) {
      const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
      if (!container) throw new Error('No container found');
      container.style.position = 'absolute';
      container.style.top = `${event.clientY - 20}px`;
    }
  }

  @HostListener("mouseup", ["$event"]) onMouseUp(event: MouseEvent) {
    this._mouseMoveStarted = false;
    const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
    if (!container) throw new Error('No container found');
    this.uisMoveEnded.emit({container, y: event.clientY});
  }

  @HostListener("touchmove", ["$event"]) onTouchMove(event: TouchEvent) {
    const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
    if (!container) throw new Error('No container found');
    this._lastY = event.touches.item(0)?.clientY ?? null;
    container.style.position = 'absolute';
    container.style.top = `${this._lastY}px`;
  }

  @HostListener("touchend", ["$event"]) onTouchEnd(event: TouchEvent) {
    const container = this.el.nativeElement.parentElement?.closest('.plant-bottom-sheet') as HTMLElement | null
    if (!container) throw new Error('No container found');
    if (this._lastY) this.uisMoveEnded.emit({container, y: this._lastY});
  }

  constructor(private el: ElementRef<HTMLElement>) {
  }
}
