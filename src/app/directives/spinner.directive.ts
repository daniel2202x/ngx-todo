import { Directive, inject, input, OnChanges, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSpinner]',
  standalone: true
})
export class SpinnerDirective implements OnChanges {

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);

  loading = input.required<boolean>({ alias: 'appSpinner' });

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
