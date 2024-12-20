import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'clients',
    loadChildren: () => import('./pages/clients/clients.module').then( m => m.ClientsPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./pages/reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'krathsh',
    loadChildren: () => import('./pages/krathsh/krathsh.module').then( m => m.KrathshPageModule)
  },
  {
    path: 'client-profile',
    loadChildren: () => import('./pages/client-profile/client-profile.module').then( m => m.ClientProfilePageModule)
  },
  {
    path: 'new-krathsh',
    loadChildren: () => import('./pages/new-krathsh/new-krathsh.module').then( m => m.NewKrathshPageModule)
  },
  {
    path: 'krathseis',
    loadChildren: () => import('./pages/krathseis/krathseis.module').then( m => m.KrathseisPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./pages/new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('./pages/otp-verification/otp-verification.module').then( m => m.OtpVerificationPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'choose-address',
    loadChildren: () => import('./pages/choose-address/choose-address.module').then( m => m.ChooseAddressPageModule)
  },
  {
    path: 'facebook-images',
    loadChildren: () => import('./pages/facebook-images/facebook-images.module').then( m => m.FacebookImagesPageModule)
  },
  {
    path: 'instagram-images',
    loadChildren: () => import('./pages/instagram-images/instagram-images.module').then( m => m.InstagramImagesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },

  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'add-person',
    loadChildren: () => import('./pages/add-person/add-person.module').then( m => m.AddPersonPageModule)
  },
  {
    path: 'new-service',
    loadChildren: () => import('./pages/new-service/new-service.module').then( m => m.NewServicePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'images',
    loadChildren: () => import('./pages/images/images.module').then( m => m.ImagesPageModule)
  },
  {
    path: 'add-schedule-exception',
    loadChildren: () => import('./pages/add-schedule-exception/add-schedule-exception.module').then( m => m.AddScheduleExceptionPageModule)
  },
  {
    path: 'guide',
    loadChildren: () => import('./pages/guide/guide.module').then( m => m.GuidePageModule)
  },
  {
    path: 'search-krathsh',
    loadChildren: () => import('./pages/search-krathsh/search-krathsh.module').then( m => m.SearchKrathshPageModule)
  },
  {
    path: 'add-services',
    loadChildren: () => import('./pages/add-services/add-services.module').then( m => m.AddServicesPageModule)
  },
  {
    path: 'team-services',
    loadChildren: () => import('./pages/team-services/team-services.module').then( m => m.TeamServicesPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'new-package',
    loadChildren: () => import('./pages/new-package/new-package.module').then( m => m.NewPackagePageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'choose-variation',
    loadChildren: () => import('./pages/choose-variation/choose-variation.module').then( m => m.ChooseVariationPageModule)
  },
  {
    path: 'closures',
    loadChildren: () => import('./pages/closures/closures.module').then( m => m.ClosuresPageModule)
  },
  {
    path: 'reservation-settings',
    loadChildren: () => import('./pages/reservation-settings/reservation-settings.module').then( m => m.ReservationSettingsPageModule)
  },
  {
    path: 'automated-notifications',
    loadChildren: () => import('./pages/automated-notifications/automated-notifications.module').then( m => m.AutomatedNotificationsPageModule)
  },
  {
    path: 'social-media',
    loadChildren: () => import('./pages/social-media/social-media.module').then( m => m.SocialMediaPageModule)
  },
  {
    path: 'edit-automatic-notification',
    loadChildren: () => import('./pages/edit-automatic-notification/edit-automatic-notification.module').then( m => m.EditAutomaticNotificationPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'team-services-prompt',
    loadChildren: () => import('./pages/team-services-prompt/team-services-prompt.module').then( m => m.TeamServicesPromptPageModule)
  },
  {
    path: 'sms-purchase',
    loadChildren: () => import('./pages/sms-purchase/sms-purchase.module').then( m => m.SmsPurchasePageModule)
  },
  {
    path: 'successful-payment',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'failed-payment',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'edit-auto-renewal',
    loadChildren: () => import('./pages/edit-auto-renewal/edit-auto-renewal.module').then( m => m.EditAutoRenewalPageModule)
  },
  {
    path: 'charges',
    loadChildren: () => import('./pages/charges/charges.module').then( m => m.ChargesPageModule)
  },
  {
    path: 'pwa-installation',
    loadChildren: () => import('./pages/pwa-installation/pwa-installation.module').then( m => m.PwaInstallationPageModule)
  },
  {
    path: 'notification-prompt',
    loadChildren: () => import('./pages/notification-prompt/notification-prompt.module').then( m => m.NotificationPromptPageModule)
  },

 
 

 
  
  
 
 
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
