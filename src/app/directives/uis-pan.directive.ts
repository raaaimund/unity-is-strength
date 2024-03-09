import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

export interface UisPanEndedEvent {
  container: HTMLElement;
  panValues: HammerInput;
}

@Directive({
  selector: '[uisPan]',
  standalone: true,
})
export class UisPanDirective {
  @Output() uisPanEnded = new EventEmitter<UisPanEndedEvent>();

  @HostListener("panstart", ["$event"]) onPanStart(event: HammerInput) {
    const container = this.el.nativeElement.parentElement;
    if (!container) throw new Error('No container found');
    container.style.position = 'relative';
  }

  @HostListener("panup", ["$event"]) onPanUp(event: HammerInput) {
    const container = this.el.nativeElement.parentElement;
    if (!container) throw new Error('No container found');
    container.style.top = `${event.deltaY}px`;
  }

  @HostListener("pandown", ["$event"]) onPanDown(event: HammerInput) {
    const container = this.el.nativeElement.parentElement;
    if (!container) throw new Error('No container found');
    container.style.top = `${event.deltaY}px`;
  }

  @HostListener("panend", ["$event"]) onPanEnd(event: HammerInput) {
    const container = this.el.nativeElement.parentElement;
    if (!container) throw new Error('No container found');
    this.uisPanEnded.emit({container, panValues: event});
  }

  constructor(private el: ElementRef<HTMLElement>) {
  }
}
