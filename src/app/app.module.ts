import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
// modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// services
import { AuthService } from './services/auth/auth.service';
import { MainService } from './services/main/main.service';
import { ContentService } from './services/content/content.service';
import { ChangeService } from './services/change/change.service';
import { MessageService } from './services/message/message.service';
import { TimelineService } from './services/timeline/timeline.service';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorComponent } from './pages/error/error.component';
import { ThumbPageComponent } from './pages/thumb-page/thumb-page.component';
import { ApproveService } from './services/approve/approve.service';
import { MessagesComponent } from './components/messages/messages.component';
import { FullscreenComponent } from './pages/fullscreen/fullscreen.component';

import { NgxFlipBookModule } from './components/ngx-flipbook';
import { RequestChangesComponent } from './components/request-changes/request-changes.component';
import { ApproveComponent } from './components/approve/approve.component';

export function configProviderFactory(provider: MainService) {
  return () => provider.load();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    ErrorComponent,
    ThumbPageComponent,
    MessagesComponent,
    FullscreenComponent,
    RequestChangesComponent,
    ApproveComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    NgxFlipBookModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    MainService,
    ContentService,
    ChangeService,
    ApproveService,
    MessageService,
    TimelineService,
    { provide: APP_INITIALIZER, useFactory: configProviderFactory, deps: [MainService], multi: true }
  ],
  entryComponents: [RequestChangesComponent, ApproveComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
