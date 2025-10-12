import 'package:flutter/material.dart';
import 'package:mobile/core/theme/app_colors.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/core/routes/app_routes.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> onboardingData = [
    {
      "image": "assets/images/onboarding1.png",
      "title": "Ayo Jelajahi Galeri Fourlary!",
      "subtitle":
          "Ayo Jelajahi 100 lebih Foto Foto Menarik dan Informatif Di Halaman Galeri Fourlary!",
    },
    {
      "image": "assets/images/onboarding1.png",
      "title": "Cari Tahu Berita Terbaru!",
      "subtitle":
          "Jelajahi Juga Berbagai Berita Berita Hangat Seputar SMK Negeri 4 Bogor Saat Ini!",
    },
    {
      "image": "assets/images/onboarding1.png",
      "title": "Mulai Jelajah Sekarang!",
      "subtitle":
          "Masuk atau Daftarkan Akun Anda dan Mulai Menjelajah Fitur Bersama Kami!",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              flex: 4,
              child: PageView.builder(
                controller: _controller,
                itemCount: onboardingData.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  final data = onboardingData[index];
                  return Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.asset(data["image"]!, height: 520),
                        const SizedBox(height: 52),
                        Text(
                          data["title"]!,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          data["subtitle"]!,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: AppColors.textLight,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                onboardingData.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  height: 8,
                  width: _currentPage == index ? 24 : 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index
                        ? AppColors.primary
                        : Colors.grey[300],
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    if (_currentPage == onboardingData.length - 1) {
                      Navigator.pushReplacementNamed(context, AppRoutes.login);
                    } else {
                      _controller.nextPage(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  child: Text(
                    _currentPage == onboardingData.length - 1
                        ? "Masuk Sekarang"
                        : "Lanjutkan",
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}