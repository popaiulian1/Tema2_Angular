import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition} from '@ant-design/icons-angular';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { PlusOutline, EditOutline, UserOutline, 
  MailOutline, PhoneOutline, HomeOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [PlusOutline, EditOutline, 
  UserOutline, MailOutline, PhoneOutline, HomeOutline];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideHttpClient(), provideAnimations(),
    {provide: NZ_I18N, useValue: en_US},
    [provideNzIcons(icons)]
  ]
};
