import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'gallery_detail.dart';

class GalleryPage extends StatefulWidget {
  const GalleryPage({super.key});

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  final List<Map<String, dynamic>> galleryPosts = [
    {
      'username': 'Nymas Hayu',
      'profile': 'https://i.pravatar.cc/150?img=5',
      'image': 'https://picsum.photos/400/300?1',
      'likes': 1242,
      'comments': 24,
      'isLiked': false,
      'caption': 'Senja di halaman sekolah',
    },
    {
      'username': 'DanBilzerian',
      'profile': 'https://i.pravatar.cc/150?img=7',
      'image': 'https://picsum.photos/400/300?2',
      'likes': 930,
      'comments': 12,
      'isLiked': false,
      'caption': 'Kebersamaan di kelas 12 RPL',
    },
    {
      'username': 'Alex_Moore',
      'profile': 'https://i.pravatar.cc/150?img=9',
      'image': 'https://picsum.photos/400/300?3',
      'likes': 420,
      'comments': 9,
      'isLiked': false,
      'caption': 'Langit cerah di pagi hari',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      body: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // 🔹 Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Jelajahi Seluruh\nGaleri Fourlary 📸',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    child: Row(
                      children: [
                        const Icon(Iconsax.search_normal, color: Colors.grey),
                        const SizedBox(width: 8),
                        const Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Cari galeri...',
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(
                            Iconsax.setting_4,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 🔹 Feed posts
            ...galleryPosts.map((post) {
              return Container(
                margin: const EdgeInsets.only(bottom: 18),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 🔸 Header profil post
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundImage: NetworkImage(post['profile']),
                            radius: 18,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            post['username'],
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                          const Spacer(),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Iconsax.more, size: 18),
                          ),
                        ],
                      ),
                    ),

                    // 🔸 Gambar utama + Hero animation
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => GalleryDetailPage(post: post),
                          ),
                        );
                      },
                      child: Hero(
                        tag: post['image'],
                        child: AspectRatio(
                          aspectRatio: 1,
                          child: Image.network(
                            post['image'],
                            fit: BoxFit.cover,
                            width: double.infinity,
                          ),
                        ),
                      ),
                    ),

                    // 🔸 Caption
                    Padding(
                      padding: const EdgeInsets.fromLTRB(14, 16, 14, 4),
                      child: Text(
                        post['caption'],
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),

                    // 🔸 Like & Comment bar
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 4,
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () {
                              setState(() {
                                post['isLiked'] = !post['isLiked'];
                                post['likes'] += post['isLiked'] ? 1 : -1;
                              });
                            },
                            icon: Icon(
                              post['isLiked'] ? Iconsax.heart5 : Iconsax.heart,
                              color: post['isLiked']
                                  ? Colors.red
                                  : Colors.black,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${post['likes']}',
                            style: const TextStyle(fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(width: 20),
                          GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => GalleryDetailPage(post: post),
                                ),
                              );
                            },
                            child: Row(
                              children: [
                                const Icon(Iconsax.message, size: 22),
                                const SizedBox(width: 6),
                                Text('${post['comments']}'),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 6),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
