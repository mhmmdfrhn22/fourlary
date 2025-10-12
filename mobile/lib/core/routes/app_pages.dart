import 'package:flutter/material.dart';
import 'package:mobile/views/onboarding/onboarding_page.dart';
import 'package:mobile/views/auth/login_view.dart';
import 'package:mobile/views/home/home_page.dart';
import 'app_routes.dart';

class AppPages {
  static Map<String, WidgetBuilder> routes = {
    AppRoutes.onboarding: (_) => const OnboardingPage(),
    AppRoutes.login: (_) => const LoginView(),
    AppRoutes.home: (_) => const HomePage(),
  };
}