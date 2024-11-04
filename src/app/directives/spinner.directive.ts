import { Directive, inject, input, OnChanges, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSpinner]',
  standalone: true
})
export class SpinnerDirective implements OnChanges {

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  readonly loading = input.required<boolean>({ alias: 'appSpinner' });

  ngOnChanges(): void {
    if (this.loading()) {
      const viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.renderer.addClass(viewRef.rootNodes[0], 'spinner-border');
      this.renderer.addClass(viewRef.rootNodes[0], 'spinner-border-sm');
    } else {
      this.viewContainerRef.clear();
    }
  }

}
