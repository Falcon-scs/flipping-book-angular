import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FadeAnimation } from './animations/fade.animation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [FadeAnimation]
})
export class AppComponent {
  constructor(
    private iconReg: MatIconRegistry,
    private sanitizer: DomSanitizer,
    translate: TranslateService
    ) {

    translate.addLangs(['en', 'pt', 'fr', 'es']);
    translate.setDefaultLang('pt');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt|es|fr/) ? browserLang : 'pt');

    iconReg.addSvgIcon('chat', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_chat.svg'));
    iconReg.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_check.svg'));
    iconReg.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_close.svg'));
    iconReg.addSvgIcon('complete', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_complete.svg'));
    iconReg.addSvgIcon('contract', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_contract.svg'));
    iconReg.addSvgIcon('expand', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_expand.svg'));
    iconReg.addSvgIcon('grid', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_grid.svg'));
    iconReg.addSvgIcon('left-arrow', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_left_arrow.svg'));
    iconReg.addSvgIcon('message', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_message.svg'));
    iconReg.addSvgIcon('pause', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_pause.svg'));
    iconReg.addSvgIcon('play', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_play.svg'));
    iconReg.addSvgIcon('refresh', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_refresh.svg'));
    iconReg.addSvgIcon('right-arrow', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_right_arrow.svg'));
    iconReg.addSvgIcon('send', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_send.svg'));
    iconReg.addSvgIcon('share', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_share.svg'));
    iconReg.addSvgIcon('warning', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_warning.svg'));
    iconReg.addSvgIcon('satisfied', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ic_satisfied.svg'));
  }

  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
