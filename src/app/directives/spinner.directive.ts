import { Directive, inject, input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSpinner]',
  standalone: true
})
export class SpinnerDirective implements OnChanges {

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  readonly appSpinner = input.required<boolean | null | undefined>();
  readonly appSpinnerIdle = input<TemplateRef<Element> | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {

      this.viewContainerRef.clear();

      if (this.appSpinner()) {
        const viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.renderer.addClass(viewRef.rootNodes[0], 'spinner-border');
        this.renderer.addClass(viewRef.rootNodes[0], 'spinner-border-sm');
      } else if (this.appSpinnerIdle()) {
        this.viewContainerRef.createEmbeddedView(this.appSpinnerIdle()!);
      }
    }
  }

}
