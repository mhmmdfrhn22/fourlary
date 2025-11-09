import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class NewsDetailPage extends StatelessWidget {
  final Map<String, dynamic> news;

  const NewsDetailPage({super.key, required this.news});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          news['category'],
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                news['image'],
                width: double.infinity,
                height: 220,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              news['title'],
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Iconsax.user, color: Colors.grey[600], size: 16),
                const SizedBox(width: 4),
                Text(news['author'], style: TextStyle(color: Colors.grey[700])),
                const SizedBox(width: 8),
                Icon(Iconsax.calendar_1, color: Colors.grey[600], size: 16),
                const SizedBox(width: 4),
                Text(news['date'], style: TextStyle(color: Colors.grey[700])),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              news['content'],
              style: TextStyle(
                color: Colors.grey[800],
                fontSize: 15,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
